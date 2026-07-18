import express from "express";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, "../..");
const PUBLIC_ROOT = path.join(__dirname, "public");
const ADVENTURER_ROOT = path.join(PROJECT_ROOT, "assets", "adventurers");
const INDEX_FILE = path.join(ADVENTURER_ROOT, "index.json");
const CONFIG_FILE = path.join(PROJECT_ROOT, "config", "game-config.json");
const DEFAULT_CONFIG_FILE = path.join(PROJECT_ROOT, "config", "game-config.defaults.json");
const DRAGON_EVOLUTION_FILE = path.join(PROJECT_ROOT, "config", "dragon-evolution.json");
const DRAGON_MUTATION_FILE = path.join(PROJECT_ROOT, "config", "dragon-mutation.json");
const DRAGON_SKILLS_FILE = path.join(PROJECT_ROOT, "config", "dragon-skills.json");
const BACKUP_ROOT = path.join(PROJECT_ROOT, "backups", "dragon-admin");
const PORT = 4173;
const RARITIES = ["C", "B", "A", "S", "SS", "SSS"];
const RARITY_FOLDERS = RARITIES.map((value) => value.toLowerCase());
const ELEMENTS = ["fire", "water", "wood", "light", "dark"];
const EXPECTED_SKILLS = { C: 0, B: 0, A: 0, S: 1, SS: 2, SSS: 3 };
const IMAGE_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif"]);

await import(new URL("../../dragon-evolution-core.js", import.meta.url));
const EvolutionCore = globalThis.DragonEvolutionCore;
if (!EvolutionCore) throw new Error("Dragon evolution core failed to load");

const app = express();
app.disable("x-powered-by");
app.use(express.json({ limit: "5mb" }));
app.use("/api", (_req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

function isLoopbackAddress(address = "") {
  return address === "127.0.0.1" || address === "::1" || address === "::ffff:127.0.0.1";
}

function localWriteOnly(req, res, next) {
  const hostname = String(req.hostname || "").toLowerCase();
  if (!["localhost", "127.0.0.1"].includes(hostname) || !isLoopbackAddress(req.socket.remoteAddress)) {
    return res.status(403).json({ error: "寫入功能只允許本機 localhost 使用" });
  }
  next();
}

function assertInside(base, candidate) {
  const resolvedBase = path.resolve(base);
  const resolved = path.resolve(candidate);
  if (resolved !== resolvedBase && !resolved.startsWith(`${resolvedBase}${path.sep}`)) {
    throw new Error("路徑超出允許範圍");
  }
  return resolved;
}

function timestamp() {
  return new Date().toISOString().replaceAll(":", "-").replaceAll(".", "-");
}

async function pathExists(filePath) {
  try { await fs.access(filePath); return true; } catch { return false; }
}

async function listFilesRecursive(root) {
  if (!await pathExists(root)) return [];
  const entries = await fs.readdir(root, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const entryPath = path.join(root, entry.name);
    if (entry.isDirectory()) files.push(...await listFilesRecursive(entryPath));
    else if (entry.isFile()) files.push(entryPath);
  }
  return files;
}

async function readJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, "utf8"));
}

async function writeJson(filePath, value) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

async function pruneBackups() {
  await fs.mkdir(BACKUP_ROOT, { recursive: true });
  const entries = (await fs.readdir(BACKUP_ROOT, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .sort((a, b) => b.name.localeCompare(a.name));
  await Promise.all(entries.slice(50).map((entry) => fs.rm(path.join(BACKUP_ROOT, entry.name), { recursive: true, force: true })));
}

async function createBackup(label, files) {
  const id = `${timestamp()}-${String(label).replace(/[^a-z0-9_-]+/gi, "-")}`;
  const root = path.join(BACKUP_ROOT, id);
  const copied = [];
  await fs.mkdir(root, { recursive: true });
  for (const filePath of files) {
    if (!await pathExists(filePath)) continue;
    const relative = path.relative(PROJECT_ROOT, filePath);
    const destination = assertInside(root, path.join(root, relative));
    await fs.mkdir(path.dirname(destination), { recursive: true });
    await fs.copyFile(filePath, destination);
    copied.push(relative.replaceAll("\\", "/"));
  }
  await writeJson(path.join(root, "manifest.json"), { id, label, createdAt: Date.now(), files: copied });
  await pruneBackups();
  return { id, files: copied };
}

async function writeJsonWithBackup(filePath, value, label) {
  const backup = await createBackup(label, [filePath]);
  await writeJson(filePath, value);
  return backup;
}

function validateProbabilityMap(map, label) {
  if (!map || typeof map !== "object") throw new Error(`${label}格式錯誤`);
  const values = Object.values(map).map(Number);
  if (values.some((value) => !Number.isFinite(value) || value < 0)) throw new Error(`${label}只能使用非負數字`);
  const total = values.reduce((sum, value) => sum + value, 0);
  if (Math.abs(total - 100) > 0.0001) throw new Error(`${label}總和必須為 100%，目前為 ${total}%`);
  return total;
}

function validateConfig(config) {
  if (!config || typeof config !== "object") throw new Error("設定檔格式錯誤");
  validateProbabilityMap(config.gacha?.adventurer?.rarities, "冒險者稀有度機率");
  validateProbabilityMap(config.gacha?.adventurer?.elements, "冒險者屬性機率");
  validateProbabilityMap(config.gacha?.egg?.rarities, "龍蛋稀有度機率");
  validateProbabilityMap(config.gacha?.egg?.elements, "龍蛋屬性機率");
  validateProbabilityMap(config.adventure?.equipmentRarityRates, "冒險裝備掉落機率");
}

async function readIndexSafe() {
  try {
    const data = await readJson(INDEX_FILE);
    return { data, error: null };
  } catch (error) {
    return { data: { characters: [] }, error: error.message };
  }
}

async function scanCharacterFolders() {
  const rows = [];
  for (const rarityFolder of RARITY_FOLDERS) {
    for (const element of ELEMENTS) {
      const folder = path.join(ADVENTURER_ROOT, rarityFolder, element);
      if (!await pathExists(folder)) continue;
      const numbers = await fs.readdir(folder, { withFileTypes: true });
      for (const entry of numbers) {
        if (!entry.isDirectory() || !/^\d{4}$/.test(entry.name)) continue;
        const characterRoot = path.join(folder, entry.name);
        const dataFile = path.join(characterRoot, "data.json");
        rows.push({
          rarityFolder,
          rarity: rarityFolder.toUpperCase(),
          element,
          number: entry.name,
          characterRoot,
          dataFile,
          relativeDataPath: path.relative(ADVENTURER_ROOT, dataFile).replaceAll("\\", "/")
        });
      }
    }
  }
  return rows;
}

function normalizeAssetPath(template, key, fallback) {
  return String(template?.assets?.[key] || fallback);
}

async function loadCharacterRow(row, indexedPaths = new Set()) {
  const issues = [];
  let template = null;
  try {
    template = await readJson(row.dataFile);
  } catch (error) {
    issues.push({ level: "error", code: "data-json", message: `data.json 無法讀取：${error.message}` });
  }
  if (!template) {
    return { ...row, id: `${row.rarityFolder}-${row.element}-${row.number}`, name: "無法讀取", template: null, issues, indexed: indexedPaths.has(row.relativeDataPath), missingAssetCount: 4 };
  }

  const expectedId = `${row.rarityFolder}-${row.element}-${row.number}`;
  if (!template.id) issues.push({ level: "error", code: "missing-id", message: "缺少 templateId" });
  if (template.id && template.id !== expectedId) issues.push({ level: "error", code: "id-path", message: `templateId ${template.id} 與資料夾 ${expectedId} 不一致` });
  if (!RARITIES.includes(String(template.rarity).toUpperCase())) issues.push({ level: "error", code: "rarity", message: "稀有度無效" });
  if (String(template.rarity).toUpperCase() !== row.rarity) issues.push({ level: "error", code: "rarity-path", message: "稀有度與資料夾不一致" });
  if (!ELEMENTS.includes(String(template.element).toLowerCase())) issues.push({ level: "error", code: "element", message: "屬性無效" });
  if (String(template.element).toLowerCase() !== row.element) issues.push({ level: "error", code: "element-path", message: "屬性與資料夾不一致" });
  if (!/^\d{4}$/.test(String(template.number || row.number))) issues.push({ level: "error", code: "number", message: "角色編號必須為四位數" });
  if (!template.name) issues.push({ level: "error", code: "name", message: "缺少角色名稱" });
  if (!template.growth?.base || !template.growth?.perLevel || !template.growth?.variance) issues.push({ level: "error", code: "growth", message: "成長資料不完整" });
  if (!template.animations?.idle) issues.push({ level: "warning", code: "idle-config", message: "缺少 idle 動畫設定" });

  const skillCount = Array.isArray(template.skills) ? template.skills.length : 0;
  const expectedSkills = EXPECTED_SKILLS[row.rarity];
  if (row.rarity === "A" ? skillCount > 1 : skillCount !== expectedSkills) {
    issues.push({ level: "warning", code: "skills", message: `${row.rarity} 預期 ${row.rarity === "A" ? "0～1" : expectedSkills} 個專有技能，目前 ${skillCount}` });
  }

  const assetChecks = [
    ["card", normalizeAssetPath(template, "card", "card.png")],
    ["portrait", normalizeAssetPath(template, "portrait", "portrait.png")],
    ["icon", normalizeAssetPath(template, "icon", "icon.png")]
  ];
  for (const [key, relative] of assetChecks) {
    if (!await pathExists(assertInside(row.characterRoot, path.join(row.characterRoot, relative)))) {
      issues.push({ level: "warning", code: `asset-${key}`, message: `缺少 ${relative}` });
    }
  }
  const idleFolder = template.animations?.idle?.folder || "sprites/idle";
  const idleFile = path.join(row.characterRoot, idleFolder, "idle-01.png");
  if (!await pathExists(idleFile)) issues.push({ level: "warning", code: "asset-idle", message: "缺少 idle 第一格動畫" });

  return {
    ...row,
    id: template.id || expectedId,
    name: template.name || expectedId,
    job: template.job || "",
    skillCount,
    animationCount: Object.keys(template.animations || {}).length,
    template,
    indexed: indexedPaths.has(row.relativeDataPath),
    issues,
    missingAssetCount: issues.filter((issue) => issue.code.startsWith("asset-")).length,
    gameBasePath: `assets/adventurers/${row.rarityFolder}/${row.element}/${row.number}/`
  };
}

async function scanAdventurers() {
  const indexResult = await readIndexSafe();
  const indexEntries = Array.isArray(indexResult.data.characters) ? indexResult.data.characters : [];
  const indexedPaths = new Set(indexEntries.map((entry) => String(entry.path || "").replaceAll("\\", "/")));
  const rows = await scanCharacterFolders();
  const characters = await Promise.all(rows.map((row) => loadCharacterRow(row, indexedPaths)));
  const matrix = Object.fromEntries(RARITIES.map((rarity) => [rarity, Object.fromEntries(ELEMENTS.map((element) => [element, 0]))]));
  characters.filter((item) => item.template).forEach((item) => { matrix[item.rarity][item.element] += 1; });
  return { indexResult, indexEntries, characters, matrix };
}

async function listUnclassifiedFiles() {
  const entries = await fs.readdir(ADVENTURER_ROOT, { withFileTypes: true });
  return Promise.all(entries
    .filter((entry) => entry.isFile() && IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase()))
    .map(async (entry) => {
      const stats = await fs.stat(path.join(ADVENTURER_ROOT, entry.name));
      return { name: entry.name, size: stats.size, modifiedAt: stats.mtimeMs, url: `/game/assets/adventurers/${encodeURIComponent(entry.name)}` };
    }));
}

async function runHealthCheck() {
  const scan = await scanAdventurers();
  const issues = [];
  if (scan.indexResult.error) issues.push({ level: "error", code: "index-json", message: `index.json 無效：${scan.indexResult.error}` });
  const ids = new Map();
  scan.characters.forEach((character) => {
    character.issues.forEach((issue) => issues.push({ ...issue, characterId: character.id, path: character.relativeDataPath }));
    if (ids.has(character.id)) issues.push({ level: "error", code: "duplicate-id", message: `重複 templateId：${character.id}` });
    ids.set(character.id, true);
    if (!character.indexed) issues.push({ level: "warning", code: "not-indexed", characterId: character.id, message: "角色資料夾未加入 index.json" });
  });
  const folderPaths = new Set(scan.characters.map((item) => item.relativeDataPath));
  scan.indexEntries.forEach((entry) => {
    const indexedPath = String(entry.path || "").replaceAll("\\", "/");
    if (!folderPaths.has(indexedPath)) issues.push({ level: "error", code: "broken-index-path", characterId: entry.id, message: `index.json 指向不存在的路徑：${indexedPath}` });
  });
  const validCharacters = scan.characters.filter((item) => item.template && !item.relativeDataPath.includes("_shared") && !item.relativeDataPath.includes("_legacy"));
  for (const rarity of RARITIES) {
    for (const element of ELEMENTS) {
      if (!validCharacters.some((item) => item.rarity === rarity && item.element === element)) {
        issues.push({ level: "warning", code: "empty-pool", message: `空角色池：${rarity} / ${element}` });
      }
    }
  }
  const appSource = await fs.readFile(path.join(PROJECT_ROOT, "app.js"), "utf8");
  if (/templatePool\s*\[\s*0\s*\]/.test(appSource)) issues.push({ level: "error", code: "fire-fallback", message: "app.js 仍存在角色池第一位 fallback，可能造成火屬性偏差" });
  const unclassified = await listUnclassifiedFiles();
  if (unclassified.length) issues.push({ level: "warning", code: "unclassified", message: `冒險者根目錄有 ${unclassified.length} 個未分類素材` });
  return {
    checkedAt: Date.now(),
    issues,
    counts: {
      ok: validCharacters.length,
      warning: issues.filter((issue) => issue.level === "warning").length,
      error: issues.filter((issue) => issue.level === "error").length,
      missingAssets: scan.characters.filter((item) => item.missingAssetCount > 0).length
    },
    matrix: scan.matrix,
    indexOk: !scan.indexResult.error,
    configOk: await pathExists(CONFIG_FILE)
  };
}

function weightedRandom(map, random = Math.random) {
  const entries = Object.entries(map || {}).filter(([, weight]) => Number(weight) > 0);
  const total = entries.reduce((sum, [, weight]) => sum + Number(weight), 0);
  if (!total) return null;
  let roll = random() * total;
  for (const [key, weight] of entries) {
    roll -= Number(weight);
    if (roll < 0) return key;
  }
  return entries.at(-1)?.[0] || null;
}

function simulateGacha(config, characters, draws) {
  const valid = characters.filter((character) => character.template && character.indexed);
  const rarityCounts = Object.fromEntries(RARITIES.map((rarity) => [rarity, 0]));
  const elementCounts = Object.fromEntries(ELEMENTS.map((element) => [element, 0]));
  const characterCounts = Object.fromEntries(valid.map((character) => [character.id, 0]));
  const warnings = new Set();
  const availableRarities = [...new Set(valid.map((item) => item.rarity))];
  for (let i = 0; i < draws; i += 1) {
    let rarity = weightedRandom(config.gacha.adventurer.rarities);
    if (!availableRarities.includes(rarity)) {
      warnings.add(`稀有度 ${rarity} 沒有角色，已從可用稀有度重抽`);
      rarity = weightedRandom(Object.fromEntries(availableRarities.map((key) => [key, config.gacha.adventurer.rarities[key] || 0])));
    }
    const rarityPool = valid.filter((item) => item.rarity === rarity);
    const availableElements = [...new Set(rarityPool.map((item) => item.element))];
    let element = weightedRandom(config.gacha.adventurer.elements);
    if (!availableElements.includes(element)) {
      warnings.add(`角色池 ${rarity}/${element} 為空，已從該稀有度可用屬性重抽`);
      element = weightedRandom(Object.fromEntries(availableElements.map((key) => [key, config.gacha.adventurer.elements[key] || 0])));
    }
    const pool = rarityPool.filter((item) => item.element === element);
    if (!pool.length) continue;
    const picked = pool[Math.floor(Math.random() * pool.length)];
    rarityCounts[rarity] += 1;
    elementCounts[element] += 1;
    characterCounts[picked.id] += 1;
  }
  const emptyPools = [];
  RARITIES.forEach((rarity) => ELEMENTS.forEach((element) => {
    if (!valid.some((item) => item.rarity === rarity && item.element === element)) emptyPools.push(`${rarity}/${element}`);
  }));
  const unreachable = valid.filter((item) => characterCounts[item.id] === 0).map((item) => item.id);
  const rows = (counts, theoretical) => Object.entries(counts).map(([key, count]) => ({
    key,
    count,
    actual: draws ? count / draws * 100 : 0,
    theoretical: Number(theoretical[key]) || 0,
    difference: draws ? count / draws * 100 - (Number(theoretical[key]) || 0) : 0
  }));
  return {
    draws,
    rarities: rows(rarityCounts, config.gacha.adventurer.rarities),
    elements: rows(elementCounts, config.gacha.adventurer.elements),
    characters: Object.entries(characterCounts).map(([id, count]) => ({ id, count })),
    emptyPools,
    unreachable,
    warnings: [...warnings],
    onlyFire: elementCounts.fire === draws && draws > 0,
    highRarityMissing: draws >= 10000 && (rarityCounts.SS === 0 || rarityCounts.SSS === 0)
  };
}

async function readEvolutionBundle() {
  const [evolution, mutation, skills] = await Promise.all([
    readJson(DRAGON_EVOLUTION_FILE),
    readJson(DRAGON_MUTATION_FILE),
    readJson(DRAGON_SKILLS_FILE)
  ]);
  return {
    evolution,
    mutation,
    skills,
    validation: EvolutionCore.validateEvolutionGraph(evolution, mutation, skills)
  };
}

function validateEvolutionBundle(bundle) {
  if (!bundle?.evolution || !bundle?.mutation || !bundle?.skills) throw new Error("進化、突變與技能資料不可缺少");
  const validation = EvolutionCore.validateEvolutionGraph(bundle.evolution, bundle.mutation, bundle.skills);
  if (!validation.valid) {
    const messages = validation.issues.filter((issue) => issue.level === "error").map((issue) => issue.message).join("；");
    throw new Error(`進化資料驗證失敗：${messages}`);
  }
  return validation;
}

async function dashboardData() {
  const [config, defaults, scan, health, unclassified, evolution] = await Promise.all([
    readJson(CONFIG_FILE),
    readJson(DEFAULT_CONFIG_FILE).catch(() => readJson(CONFIG_FILE)),
    scanAdventurers(),
    runHealthCheck(),
    listUnclassifiedFiles(),
    readEvolutionBundle()
  ]);
  const stats = await fs.stat(CONFIG_FILE);
  return {
    config,
    defaults,
    health,
    matrix: scan.matrix,
    characters: scan.characters.map(publicCharacter),
    unclassified,
    evolution,
    summary: {
      version: config.version,
      totalCharacters: scan.characters.filter((item) => item.template).length,
      lastConfigModifiedAt: stats.mtimeMs,
      adventureEnabled: Boolean(config.features?.adventure || config.adventure?.enabled)
    }
  };
}

function publicCharacter(character) {
  return {
    id: character.id,
    name: character.name,
    rarity: character.rarity,
    element: character.element,
    number: character.number,
    job: character.job,
    skillCount: character.skillCount,
    animationCount: character.animationCount,
    indexed: character.indexed,
    relativeDataPath: character.relativeDataPath,
    gameBasePath: character.gameBasePath,
    issues: character.issues,
    template: character.template
  };
}

app.get("/api/bootstrap", async (_req, res, next) => {
  try { res.json(await dashboardData()); } catch (error) { next(error); }
});

app.get("/api/config", async (_req, res, next) => {
  try { res.json(await readJson(CONFIG_FILE)); } catch (error) { next(error); }
});

app.put("/api/config", localWriteOnly, async (req, res, next) => {
  try {
    validateConfig(req.body);
    const current = await readJson(CONFIG_FILE);
    const nextConfig = { ...req.body, version: Math.max(Number(current.version) || 0, Number(req.body.version) || 0) + 1 };
    const backup = await writeJsonWithBackup(CONFIG_FILE, nextConfig, "game-config");
    res.json({ ok: true, config: nextConfig, backup, message: "設定已儲存，請重新整理遊戲測試" });
  } catch (error) { next(error); }
});

app.get("/api/evolution", async (_req, res, next) => {
  try { res.json(await readEvolutionBundle()); } catch (error) { next(error); }
});

app.post("/api/evolution/validate", async (req, res, next) => {
  try {
    const bundle = req.body?.evolution ? req.body : await readEvolutionBundle();
    res.json(EvolutionCore.validateEvolutionGraph(bundle.evolution, bundle.mutation, bundle.skills));
  } catch (error) { next(error); }
});

app.post("/api/evolution/simulate", async (req, res, next) => {
  try {
    const bundle = req.body?.bundle?.evolution ? req.body.bundle : await readEvolutionBundle();
    const validation = EvolutionCore.validateEvolutionGraph(bundle.evolution, bundle.mutation, bundle.skills);
    if (!validation.valid) throw new Error("進化圖含有錯誤，修正後才能模擬");
    const options = {
      ...(req.body?.options || {}),
      runs: Math.min(100000, Math.max(1, Math.round(Number(req.body?.options?.runs) || 1000)))
    };
    res.json(EvolutionCore.simulateEvolution(bundle.evolution, bundle.mutation, bundle.skills, options));
  } catch (error) { next(error); }
});

app.put("/api/evolution", localWriteOnly, async (req, res, next) => {
  try {
    const validation = validateEvolutionBundle(req.body);
    const backup = await createBackup("dragon-evolution", [DRAGON_EVOLUTION_FILE, DRAGON_MUTATION_FILE, DRAGON_SKILLS_FILE]);
    const current = await readEvolutionBundle();
    const evolution = { ...req.body.evolution, version: Math.max(Number(current.evolution.version) || 0, Number(req.body.evolution.version) || 0) + 1 };
    const mutation = { ...req.body.mutation, version: Math.max(Number(current.mutation.version) || 0, Number(req.body.mutation.version) || 0) + 1 };
    const skills = { ...req.body.skills, version: Math.max(Number(current.skills.version) || 0, Number(req.body.skills.version) || 0) + 1 };
    await Promise.all([
      writeJson(DRAGON_EVOLUTION_FILE, evolution),
      writeJson(DRAGON_MUTATION_FILE, mutation),
      writeJson(DRAGON_SKILLS_FILE, skills)
    ]);
    res.json({ ok: true, evolution, mutation, skills, validation, backup, message: "進化與突變設定已儲存" });
  } catch (error) { next(error); }
});

app.get("/api/adventurers", async (_req, res, next) => {
  try {
    const scan = await scanAdventurers();
    res.json({ matrix: scan.matrix, characters: scan.characters.map(publicCharacter), indexError: scan.indexResult.error });
  } catch (error) { next(error); }
});

app.get("/api/adventurers/:id", async (req, res, next) => {
  try {
    const scan = await scanAdventurers();
    const character = scan.characters.find((item) => item.id === req.params.id);
    if (!character) return res.status(404).json({ error: "找不到角色" });
    res.json(publicCharacter(character));
  } catch (error) { next(error); }
});

app.put("/api/adventurers/:id", localWriteOnly, async (req, res, next) => {
  try {
    const scan = await scanAdventurers();
    const character = scan.characters.find((item) => item.id === req.params.id);
    if (!character) return res.status(404).json({ error: "找不到角色" });
    const rarity = String(req.body.rarity || character.rarity).toUpperCase();
    const element = String(req.body.element || character.element).toLowerCase();
    const number = String(req.body.number || character.number);
    if (!RARITIES.includes(rarity) || !ELEMENTS.includes(element) || !/^\d{4}$/.test(number)) throw new Error("角色稀有度、屬性或四位數編號無效");
    const id = `${rarity.toLowerCase()}-${element}-${number}`;
    const destinationRoot = path.join(ADVENTURER_ROOT, rarity.toLowerCase(), element, number);
    const moved = path.resolve(destinationRoot) !== path.resolve(character.characterRoot);
    if (moved && await pathExists(destinationRoot)) throw new Error(`目標角色資料夾已存在：${rarity.toLowerCase()}/${element}/${number}`);

    const nextTemplate = { ...req.body, id, number, rarity, element };
    const originalFiles = await listFilesRecursive(character.characterRoot);
    const backup = await createBackup(`adventurer-${character.id}`, [INDEX_FILE, ...originalFiles]);
    let dataFile = character.dataFile;
    if (moved) {
      await fs.mkdir(path.dirname(destinationRoot), { recursive: true });
      await fs.rename(character.characterRoot, destinationRoot);
      dataFile = path.join(destinationRoot, "data.json");
    }
    await writeJson(dataFile, nextTemplate);

    const index = await readIndexSafe();
    const oldPath = character.relativeDataPath;
    const nextPath = path.relative(ADVENTURER_ROOT, dataFile).replaceAll("\\", "/");
    const entries = (Array.isArray(index.data.characters) ? index.data.characters : [])
      .filter((entry) => entry.id !== character.id && String(entry.path || "").replaceAll("\\", "/") !== oldPath);
    entries.push({ id, path: nextPath });
    entries.sort((left, right) => left.path.localeCompare(right.path));
    await writeJson(INDEX_FILE, { characters: entries });
    res.json({ ok: true, backup, id, moved, character: nextTemplate });
  } catch (error) { next(error); }
});

app.post("/api/adventurers/health", async (_req, res, next) => {
  try { res.json(await runHealthCheck()); } catch (error) { next(error); }
});

app.post("/api/adventurers/rebuild-index", localWriteOnly, async (_req, res, next) => {
  try {
    const scan = await scanAdventurers();
    const characters = scan.characters
      .filter((item) => item.template && !item.issues.some((issue) => issue.level === "error"))
      .sort((a, b) => RARITIES.indexOf(a.rarity) - RARITIES.indexOf(b.rarity) || ELEMENTS.indexOf(a.element) - ELEMENTS.indexOf(b.element) || a.number.localeCompare(b.number))
      .map((item) => ({ id: item.id, path: item.relativeDataPath }));
    const stamp = timestamp();
    await fs.mkdir(path.join(PROJECT_ROOT, "backups"), { recursive: true });
    if (await pathExists(INDEX_FILE)) await fs.copyFile(INDEX_FILE, path.join(PROJECT_ROOT, "backups", `adventurers-index-${stamp}.json`));
    const backup = await writeJsonWithBackup(INDEX_FILE, { characters }, "adventurers-index");
    res.json({ ok: true, count: characters.length, backup, characters });
  } catch (error) { next(error); }
});

app.post("/api/gacha/simulate", async (req, res, next) => {
  try {
    const draws = Math.min(100000, Math.max(1, Math.round(Number(req.body.draws) || 10000)));
    const config = req.body.config || await readJson(CONFIG_FILE);
    validateProbabilityMap(config.gacha?.adventurer?.rarities, "冒險者稀有度機率");
    validateProbabilityMap(config.gacha?.adventurer?.elements, "冒險者屬性機率");
    const scan = await scanAdventurers();
    res.json(simulateGacha(config, scan.characters, draws));
  } catch (error) { next(error); }
});

app.get("/api/unclassified", async (_req, res, next) => {
  try { res.json(await listUnclassifiedFiles()); } catch (error) { next(error); }
});

app.post("/api/unclassified/organize", localWriteOnly, async (req, res, next) => {
  try {
    const { fileName, rarity, element, number, purpose } = req.body;
    const rarityFolder = String(rarity || "").toLowerCase();
    if (!RARITY_FOLDERS.includes(rarityFolder) || !ELEMENTS.includes(element) || !/^\d{4}$/.test(String(number))) throw new Error("稀有度、屬性或四位數編號無效");
    if (!["card", "portrait", "icon", "reference", "ignore"].includes(purpose)) throw new Error("素材用途無效");
    if (purpose === "ignore") return res.json({ ok: true, ignored: true });
    const source = assertInside(ADVENTURER_ROOT, path.join(ADVENTURER_ROOT, path.basename(fileName)));
    if (!await pathExists(source)) throw new Error("找不到未分類素材");
    const extension = path.extname(source).toLowerCase();
    const folder = path.join(ADVENTURER_ROOT, rarityFolder, element, String(number));
    const destination = purpose === "reference"
      ? path.join(folder, "references", path.basename(fileName))
      : path.join(folder, `${purpose}${extension}`);
    assertInside(ADVENTURER_ROOT, destination);
    await createBackup(`unclassified-${path.basename(fileName)}`, [source, ...(await pathExists(destination) ? [destination] : [])]);
    await fs.mkdir(path.dirname(destination), { recursive: true });
    await fs.copyFile(source, destination);
    const [sourceStats, destinationStats] = await Promise.all([fs.stat(source), fs.stat(destination)]);
    if (sourceStats.size !== destinationStats.size) throw new Error("複製驗證失敗，來源未刪除");
    res.json({ ok: true, copiedTo: path.relative(PROJECT_ROOT, destination).replaceAll("\\", "/"), sourceKept: true });
  } catch (error) { next(error); }
});

app.post("/api/unclassified/delete", localWriteOnly, async (req, res, next) => {
  try {
    if (req.body.confirm !== true) throw new Error("刪除來源需要再次確認");
    const source = assertInside(ADVENTURER_ROOT, path.join(ADVENTURER_ROOT, path.basename(req.body.fileName || "")));
    if (!await pathExists(source)) throw new Error("來源檔案已不存在");
    await createBackup(`delete-unclassified-${path.basename(source)}`, [source]);
    await fs.unlink(source);
    res.json({ ok: true });
  } catch (error) { next(error); }
});

app.get("/api/backups", async (_req, res, next) => {
  try {
    await fs.mkdir(BACKUP_ROOT, { recursive: true });
    const entries = (await fs.readdir(BACKUP_ROOT, { withFileTypes: true })).filter((entry) => entry.isDirectory()).sort((a, b) => b.name.localeCompare(a.name));
    const backups = [];
    for (const entry of entries) {
      try { backups.push(await readJson(path.join(BACKUP_ROOT, entry.name, "manifest.json"))); } catch { /* keep malformed backups out of UI */ }
    }
    res.json(backups);
  } catch (error) { next(error); }
});

app.post("/api/backups", localWriteOnly, async (_req, res, next) => {
  try {
    const scan = await scanCharacterFolders();
    const backup = await createBackup("manual-full", [CONFIG_FILE, INDEX_FILE, ...scan.map((item) => item.dataFile)]);
    res.json({ ok: true, backup });
  } catch (error) { next(error); }
});

app.post("/api/backups/restore", localWriteOnly, async (req, res, next) => {
  try {
    const id = path.basename(String(req.body.id || ""));
    const root = assertInside(BACKUP_ROOT, path.join(BACKUP_ROOT, id));
    const manifest = await readJson(path.join(root, "manifest.json"));
    await createBackup("before-restore", manifest.files.map((relative) => assertInside(PROJECT_ROOT, path.join(PROJECT_ROOT, relative))));
    for (const relative of manifest.files) {
      const source = assertInside(root, path.join(root, relative));
      const destination = assertInside(PROJECT_ROOT, path.join(PROJECT_ROOT, relative));
      await fs.mkdir(path.dirname(destination), { recursive: true });
      await fs.copyFile(source, destination);
    }
    res.json({ ok: true, restored: manifest.files.length });
  } catch (error) { next(error); }
});

app.use("/api", (_req, res) => res.status(404).json({ error: "找不到後台功能" }));
app.use(express.static(PUBLIC_ROOT));
app.use("/game", express.static(PROJECT_ROOT, { index: false, etag: false, maxAge: 0 }));

app.use((error, _req, res, _next) => {
  console.error("[Dragon Admin]", error);
  res.status(400).json({ error: error?.message || "後台操作失敗" });
});

app.listen(PORT, "127.0.0.1", () => {
  console.log(`Dragon Admin Studio: http://localhost:${PORT}`);
  console.log(`Project: ${PROJECT_ROOT}`);
});
