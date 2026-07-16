import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const assetsRoot = path.join(root, "assets");
const outputPath = path.join(assetsRoot, "data", "content-catalog.json");
const elements = ["fire", "water", "wood", "light", "dark"];
const rarities = ["C", "B", "A", "S", "SS", "SSS"];
const stages = ["baby", "youth", "adult", "evolution"];
const legacyStageNames = { baby: "baby", youth: "middle", adult: "adult", evolution: "evolve" };
const actionNames = ["idle", "walk", "attack"];

function toAssetPath(filePath) {
  return path.relative(root, filePath).split(path.sep).join("/");
}

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, "utf8"));
}

async function readActionFrames(folderPath, actions = actionNames) {
  const result = {};
  for (const action of actions) {
    const actionPath = path.join(folderPath, action);
    if (!(await exists(actionPath))) continue;
    const files = (await fs.readdir(actionPath, { withFileTypes: true }))
      .filter((entry) => entry.isFile() && /\.(png|webp|jpg|jpeg)$/i.test(entry.name))
      .map((entry) => entry.name)
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
    if (files.length > 0) {
      result[action] = files.map((file) => toAssetPath(path.join(actionPath, file)));
    }
  }
  return result;
}

async function scanDragonCatalog() {
  const records = [];
  for (const stage of stages) {
    for (const element of elements) {
      for (const rarity of rarities) {
        const rarityPath = path.join(assetsRoot, "dragons", stage, element, rarity);
        if (!(await exists(rarityPath))) continue;
        const folders = (await fs.readdir(rarityPath, { withFileTypes: true }))
          .filter((entry) => entry.isDirectory())
          .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
        for (const folder of folders) {
          const assetRoot = path.join(rarityPath, folder.name);
          const dataPath = path.join(assetRoot, "data.json");
          if (!(await exists(dataPath))) continue;
          const data = await readJson(dataPath);
          records.push({
            ...data,
            id: data.id || `${element}_${rarity.toLowerCase()}_${folder.name}_${stage}`,
            speciesId: data.speciesId || `${element}_${rarity.toLowerCase()}_${folder.name}`,
            element,
            rarity,
            rank: rarity,
            stage,
            assetRoot: `${toAssetPath(assetRoot)}/`,
            iconAsset: toAssetPath(path.join(assetRoot, "icon.png")),
            portraitAsset: toAssetPath(path.join(assetRoot, "portrait.png")),
            actions: await readActionFrames(assetRoot)
          });
        }
      }
    }
  }

  for (const stage of stages) {
    const legacyStage = legacyStageNames[stage];
    for (const element of elements) {
      const legacyRoot = path.join(assetsRoot, "dragons", element, legacyStage);
      if (!(await exists(legacyRoot))) continue;
      const legacyActions = {};
      for (const action of ["idle", "sleep", "walk", "fly", "eat", "train", "attack", "angry"]) {
        const filePath = path.join(legacyRoot, `${action}.png`);
        if (await exists(filePath)) legacyActions[action] = [toAssetPath(filePath)];
      }
      for (const rarity of rarities) {
        const id = `legacy_${element}_${rarity.toLowerCase()}_${stage}`;
        if (records.some((record) => record.id === id)) continue;
        records.push({
          id,
          speciesId: `legacy_${element}_${rarity.toLowerCase()}`,
          name: `${element}-${rarity}-${stage}`,
          element,
          rarity,
          rank: rarity,
          stage,
          hp: 88,
          atk: 24,
          def: 18,
          speed: 14,
          growth: { hp: 8, atk: 2, def: 1, speed: 1 },
          assetRoot: `${toAssetPath(legacyRoot)}/`,
          iconAsset: toAssetPath(path.join(legacyRoot, "avatar.png")),
          portraitAsset: toAssetPath(path.join(legacyRoot, "avatar.png")),
          actions: legacyActions,
          legacy: true
        });
      }
    }
  }
  return records;
}

async function scanEggCatalog() {
  const records = [];
  for (const element of elements) {
    for (const rarity of rarities) {
      const rarityPath = path.join(assetsRoot, "eggs", element, rarity);
      if (await exists(rarityPath)) {
        const folders = (await fs.readdir(rarityPath, { withFileTypes: true }))
          .filter((entry) => entry.isDirectory())
          .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
        for (const folder of folders) {
          const assetRoot = path.join(rarityPath, folder.name);
          const dataPath = path.join(assetRoot, "data.json");
          if (!(await exists(dataPath))) continue;
          const data = await readJson(dataPath);
          records.push({
            ...data,
            id: data.id || `egg_${element}_${rarity.toLowerCase()}_${folder.name}`,
            element,
            rarity,
            assetRoot: `${toAssetPath(assetRoot)}/`,
            iconAsset: toAssetPath(path.join(assetRoot, "icon.png")),
            actions: await readActionFrames(assetRoot, ["idle"])
          });
        }
      }
      const legacyIcon = path.join(assetsRoot, "eggs", element, `${rarity.toLowerCase()}.png`);
      if (await exists(legacyIcon)) {
        records.push({
          id: `legacy_egg_${element}_${rarity.toLowerCase()}`,
          name: `${element}-${rarity}-egg`,
          element,
          rarity,
          hatchTime: 60,
          iconAsset: toAssetPath(legacyIcon),
          actions: { idle: [toAssetPath(legacyIcon)] },
          legacy: true
        });
      }
    }
  }
  return records;
}

async function scanAdventurerCatalog() {
  const records = [];
  for (const element of elements) {
    for (const rarity of rarities) {
      const rarityPath = path.join(assetsRoot, "adventurers", element, rarity);
      if (!(await exists(rarityPath))) continue;
      const folders = (await fs.readdir(rarityPath, { withFileTypes: true }))
        .filter((entry) => entry.isDirectory())
        .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
      for (const folder of folders) {
        const assetRoot = path.join(rarityPath, folder.name);
        const dataPath = path.join(assetRoot, "data.json");
        if (!(await exists(dataPath))) continue;
        const data = await readJson(dataPath);
        records.push({
          ...data,
          templateId: data.templateId || data.id || `adventurer_${element}_${rarity.toLowerCase()}_${folder.name}`,
          element,
          rarity,
          assetRoot: `${toAssetPath(assetRoot)}/`,
          cardAsset: toAssetPath(path.join(assetRoot, "card.png")),
          portraitAsset: toAssetPath(path.join(assetRoot, "portrait.png")),
          actions: await readActionFrames(path.join(assetRoot, "pixel"))
        });
      }
    }
  }
  return records;
}

const catalog = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  conventions: {
    dragons: "assets/dragons/{stage}/{element}/{rarity}/{id}",
    eggs: "assets/eggs/{element}/{rarity}/{id}",
    adventurers: "assets/adventurers/{element}/{rarity}/{id}"
  },
  dragons: await scanDragonCatalog(),
  eggs: await scanEggCatalog(),
  adventurers: await scanAdventurerCatalog(),
  islands: [
    {
      id: "rest",
      name: "龍之島",
      type: "rest",
      x: 0,
      y: 0,
      asset: "assets/island/island-rest.png",
      buildingSlots: 12
    }
  ]
};

await fs.mkdir(path.dirname(outputPath), { recursive: true });
await fs.writeFile(outputPath, `${JSON.stringify(catalog, null, 2)}\n`, "utf8");
console.log(`Content catalog: ${catalog.dragons.length} dragons, ${catalog.eggs.length} eggs, ${catalog.adventurers.length} adventurers`);
