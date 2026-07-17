const RARITIES = ["C", "B", "A", "S", "SS", "SSS"];
const ELEMENTS = ["fire", "water", "wood", "light", "dark"];
const PAGE_NAMES = {
  page01: "休息島／首頁",
  page02: "龍舍",
  page03: "孵蛋島",
  page04: "裝備商店",
  page05: "道具商店",
  page06: "探索",
  page07: "冒險者工會",
  page08: "任務",
  page09: "冒險"
};
const PAGE_DEFAULT = {
  enabled: true, contentScale: 1, backgroundScale: 1, backgroundX: 50, backgroundY: 50,
  contentTop: 0, contentLeft: 0, contentWidth: 100, contentHeight: 100,
  paddingTop: 0, paddingBottom: 0, cardWidth: 100, cardHeight: 112, cardGap: 12,
  iconSize: 48, textScale: 1, panelOpacity: .92, panelRadius: 18, goldBorder: 2,
  navHeight: 92, scrollable: true, mimiWidth: 88, mimiBottom: 14, mimiAvatar: 54
};

const store = {
  bootstrap: null,
  draft: null,
  saved: null,
  defaults: null,
  activeTab: "dashboard",
  activePage: "page01",
  history: [],
  future: [],
  matrixFilter: null,
  selectedCharacterId: null,
  simulation: null,
  health: null,
  backups: [],
  animationTimer: null
};

const content = document.getElementById("adminContent");
const preview = document.getElementById("gamePreview");
const toast = document.getElementById("adminToast");
let toastTimer = null;

function clone(value) { return JSON.parse(JSON.stringify(value)); }
function escapeHtml(value) {
  return String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
function getAt(object, path) { return path.split(".").reduce((value, key) => value?.[key], object); }
function setAt(object, path, value) {
  const keys = path.split(".");
  const last = keys.pop();
  const parent = keys.reduce((value, key) => value[key] ??= {}, object);
  parent[last] = value;
}
function showToast(message, isError = false) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.className = `admin-toast is-visible${isError ? " is-error" : ""}`;
  toastTimer = setTimeout(() => { toast.className = "admin-toast"; }, 3200);
}
async function api(url, options = {}) {
  const response = await fetch(url, { headers: { "Content-Type": "application/json", ...(options.headers || {}) }, ...options });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || `HTTP ${response.status}`);
  return data;
}
function postPreview() {
  preview.contentWindow?.postMessage({ type: "dragon-admin-preview", config: store.draft }, window.location.origin);
}
function pushHistory() {
  store.history.push(clone(store.draft));
  if (store.history.length > 30) store.history.shift();
  store.future = [];
  updateTopbarState();
}
function updateTopbarState() {
  document.querySelector('[data-action="undo"]').disabled = !store.history.length;
  document.querySelector('[data-action="redo"]').disabled = !store.future.length;
  document.querySelector('[data-action="save-config"]').disabled = !probabilitiesValid();
}
function probabilitiesValid() {
  const groups = [
    store.draft?.gacha?.adventurer?.rarities,
    store.draft?.gacha?.adventurer?.elements,
    store.draft?.gacha?.egg?.rarities,
    store.draft?.gacha?.egg?.elements,
    store.draft?.adventure?.equipmentRarityRates
  ];
  return groups.every((group) => Math.abs(Object.values(group || {}).reduce((sum, value) => sum + Number(value || 0), 0) - 100) < .0001);
}

function pageHeading(title, description, actions = "") {
  return `<header class="page-heading"><div><h2>${escapeHtml(title)}</h2><p>${escapeHtml(description)}</p></div><div class="page-heading-actions">${actions}</div></header>`;
}
function metric(value, label, className = "") { return `<div class="metric ${className}"><b>${escapeHtml(value)}</b><span>${escapeHtml(label)}</span></div>`; }
function panel(title, body, className = "") { return `<section class="panel ${className}"><h3>${escapeHtml(title)}</h3>${body}</section>`; }
function rangeField(path, label, min, max, step = 1) {
  const value = Number(getAt(store.draft, path) ?? min);
  return `<label class="control-field"><span>${escapeHtml(label)}</span><input type="range" min="${min}" max="${max}" step="${step}" value="${value}" data-config-path="${path}"><input type="number" min="${min}" max="${max}" step="${step}" value="${value}" data-config-path="${path}"></label>`;
}
function numberField(path, label, min = 0, max = 999999, step = 1) { return rangeField(path, label, min, max, step); }
function toggleField(path, label) {
  return `<label class="control-field toggle"><span>${escapeHtml(label)}</span><input type="checkbox" data-config-path="${path}" ${getAt(store.draft, path) ? "checked" : ""}></label>`;
}
function selectField(path, label, options) {
  const current = getAt(store.draft, path);
  return `<label class="control-field"><span>${escapeHtml(label)}</span><select data-config-path="${path}">${options.map(([value, text]) => `<option value="${escapeHtml(value)}" ${value === current ? "selected" : ""}>${escapeHtml(text)}</option>`).join("")}</select><i></i></label>`;
}

function renderDashboard() {
  const { summary, health, matrix } = store.bootstrap;
  const rarityTotals = RARITIES.map((rarity) => `${rarity} ${Object.values(matrix[rarity] || {}).reduce((sum, count) => sum + count, 0)}`).join(" / ");
  const elementTotals = ELEMENTS.map((element) => `${element} ${RARITIES.reduce((sum, rarity) => sum + (matrix[rarity]?.[element] || 0), 0)}`).join(" / ");
  content.innerHTML = pageHeading("儀表板", "檢查設定、角色資料與抽卡系統的目前狀態")
    + `<div class="metric-grid">
      ${metric(summary.version, "遊戲設定版本")}
      ${metric(summary.totalCharacters, "角色總數")}
      ${metric(health.counts.missingAssets, "缺少素材角色", health.counts.missingAssets ? "status-warning" : "")}
      ${metric(health.counts.error, "資料錯誤", health.counts.error ? "status-error" : "status-ok")}
      ${metric(probabilitiesValid() ? "有效" : "無效", "抽卡機率", probabilitiesValid() ? "status-ok" : "status-error")}
      ${metric(health.indexOk ? "正常" : "錯誤", "index.json", health.indexOk ? "status-ok" : "status-error")}
      ${metric(health.configOk ? "正常" : "錯誤", "game-config.json", health.configOk ? "status-ok" : "status-error")}
      ${metric(summary.adventureEnabled ? "已啟用" : "準備中", "第九頁冒險")}
    </div>`
    + panel("快速操作", `<div class="quick-actions">
      <button data-action="health-check">執行完整檢查</button>
      <button data-action="quick-simulate">測試 10,000 抽</button>
      <button data-action="reload-preview">開啟遊戲預覽</button>
      <button data-action="rebuild-index">重建角色索引</button>
      <button data-action="create-backup">備份全部設定</button>
    </div>`)
    + panel("角色分布", `<p class="panel-note">${escapeHtml(rarityTotals)}</p><p class="panel-note">${escapeHtml(elementTotals)}</p>`)
    + panel("最近狀態", `<p class="panel-note">設定最後修改：${new Date(summary.lastConfigModifiedAt).toLocaleString()}</p><p class="panel-note">警告 ${health.counts.warning} 項，錯誤 ${health.counts.error} 項。空角色池與未分類素材會列為警告，不會偷偷回退到火屬性。</p>`);
}

function renderPages() {
  const key = store.activePage;
  const page = store.draft.pages[key] || (store.draft.pages[key] = clone(PAGE_DEFAULT));
  content.innerHTML = pageHeading("頁面管理", "第一頁至第九頁使用個別設定，修改時右側預覽會立即更新", `<button data-action="reset-page">還原本頁預設</button><button class="danger" data-action="reset-all">還原全部預設</button>`)
    + `<div class="tabs-row">${Object.entries(PAGE_NAMES).map(([id, name]) => `<button data-page-key="${id}" class="${id === key ? "is-active" : ""}">${escapeHtml(name)}</button>`).join("")}</div>`
    + panel(`${key.toUpperCase()}｜${PAGE_NAMES[key]}`, `<div class="field-grid">
      ${toggleField(`pages.${key}.enabled`, "頁面啟用")}
      ${toggleField(`pages.${key}.scrollable`, "內容可捲動")}
      ${rangeField(`pages.${key}.contentScale`, "整體縮放", .5, 1.5, .01)}
      ${rangeField(`pages.${key}.backgroundScale`, "背景縮放", .5, 2, .01)}
      ${rangeField(`pages.${key}.backgroundX`, "背景位置 X", 0, 100)}
      ${rangeField(`pages.${key}.backgroundY`, "背景位置 Y", 0, 100)}
      ${rangeField(`pages.${key}.contentTop`, "主內容 top", -150, 300)}
      ${rangeField(`pages.${key}.contentLeft`, "主內容 left", -150, 150)}
      ${rangeField(`pages.${key}.contentWidth`, "主內容寬度 %", 50, 120)}
      ${rangeField(`pages.${key}.contentHeight`, "主內容高度 %", 50, 140)}
      ${rangeField(`pages.${key}.paddingTop`, "上方留白", 0, 240)}
      ${rangeField(`pages.${key}.paddingBottom`, "下方留白", 0, 300)}
      ${rangeField(`pages.${key}.cardWidth`, "卡片寬度 %", 40, 100)}
      ${rangeField(`pages.${key}.cardHeight`, "卡片高度", 48, 300)}
      ${rangeField(`pages.${key}.cardGap`, "卡片間距", 0, 40)}
      ${rangeField(`pages.${key}.iconSize`, "icon 尺寸", 20, 120)}
      ${rangeField(`pages.${key}.textScale`, "文字倍率", .7, 1.5, .01)}
      ${rangeField(`pages.${key}.panelOpacity`, "面板透明度", .2, 1, .01)}
      ${rangeField(`pages.${key}.panelRadius`, "面板圓角", 0, 40)}
      ${rangeField(`pages.${key}.goldBorder`, "金框粗細", 0, 6, .5)}
      ${rangeField(`pages.${key}.navHeight`, "底部導航高度", 56, 130)}
      ${rangeField(`pages.${key}.mimiWidth`, "Mimi 對話寬度 %", 50, 96)}
      ${rangeField(`pages.${key}.mimiBottom`, "Mimi 距導航位置", 0, 80)}
      ${rangeField(`pages.${key}.mimiAvatar`, "Mimi 頭像尺寸", 30, 100)}
    </div>`);
  void page;
}

function probabilityGroup(title, path, keys, className = "") {
  const map = getAt(store.draft, path);
  const total = keys.reduce((sum, key) => sum + Number(map[key] || 0), 0);
  return panel(title, `<div class="probability-grid ${className}">${keys.map((key) => `<label class="probability-field"><span>${key}</span><input type="number" min="0" max="100" step=".1" value="${Number(map[key] || 0)}" data-config-path="${path}.${key}"></label>`).join("")}</div><div class="probability-total ${Math.abs(total - 100) > .0001 ? "invalid" : ""}" data-probability-path="${path}">目前總和：${total.toFixed(1)}%</div>`);
}
function renderSimulation(result) {
  if (!result) return panel("模擬結果", `<p class="panel-note">選擇抽數後執行測試；模擬不會扣鑽石，也不會寫入玩家存檔。</p>`);
  const warning = result.onlyFire ? `<p class="status-error">錯誤：結果全部落在 fire，抽卡邏輯可能未使用目前設定。</p>` : "";
  const high = result.highRarityMissing ? `<p class="status-error">錯誤：10,000 抽以上仍有 SS 或 SSS 為 0。</p>` : "";
  const table = (rows) => `<table><thead><tr><th>項目</th><th>次數</th><th>實測</th><th>理論</th><th>差距</th></tr></thead><tbody>${rows.map((row) => `<tr><td>${row.key}</td><td>${row.count.toLocaleString()}</td><td>${row.actual.toFixed(3)}%</td><td>${row.theoretical.toFixed(3)}%</td><td class="${Math.abs(row.difference) > 2 ? "status-warning" : ""}">${row.difference >= 0 ? "+" : ""}${row.difference.toFixed(3)}%</td></tr>`).join("")}</tbody></table>`;
  return panel(`模擬結果｜${result.draws.toLocaleString()} 抽`, `${warning}${high}<div class="database-layout"><div>${table(result.rarities)}</div><div>${table(result.elements)}</div></div><p class="panel-note">空角色池：${result.emptyPools.length ? result.emptyPools.join("、") : "無"}</p><p class="panel-note">本次未抽中角色：${result.unreachable.length ? result.unreachable.join("、") : "無"}</p>${result.warnings.length ? `<div class="issue-list">${result.warnings.map((message) => `<div class="issue warning">${escapeHtml(message)}</div>`).join("")}</div>` : ""}`);
}
function renderGacha() {
  content.innerHTML = pageHeading("抽卡管理", "稀有度與屬性分開抽取；任一組總和不是 100% 時禁止儲存")
    + probabilityGroup("冒險者稀有度", "gacha.adventurer.rarities", RARITIES)
    + probabilityGroup("冒險者屬性", "gacha.adventurer.elements", ELEMENTS, "elements")
    + panel("冒險者召喚成本", `<div class="field-grid">${numberField("economy.adventurerSummonDiamonds", "單抽鑽石", 0, 1000)}</div>`)
    + probabilityGroup("龍蛋稀有度", "gacha.egg.rarities", RARITIES)
    + probabilityGroup("龍蛋屬性", "gacha.egg.elements", ELEMENTS, "elements")
    + panel("抽卡模擬測試", `<div class="quick-actions"><select id="simulationDraws"><option>100</option><option>1000</option><option selected>10000</option><option>100000</option></select><button class="primary" data-action="simulate">開始模擬</button></div>`)
    + renderSimulation(store.simulation);
}

function matrixTable() {
  const matrix = store.bootstrap.matrix;
  return `<table class="matrix-table"><thead><tr><th>稀有度</th>${ELEMENTS.map((element) => `<th>${element}</th>`).join("")}<th>合計</th></tr></thead><tbody>${RARITIES.map((rarity) => `<tr><th>${rarity}</th>${ELEMENTS.map((element) => { const count = matrix[rarity]?.[element] || 0; const key = `${rarity}/${element}`; return `<td><button class="matrix-button ${count ? "" : "is-empty"} ${store.matrixFilter === key ? "is-active" : ""}" data-matrix-filter="${key}">${count}</button></td>`; }).join("")}<td>${ELEMENTS.reduce((sum, element) => sum + (matrix[rarity]?.[element] || 0), 0)}</td></tr>`).join("")}</tbody></table>`;
}
function assetUrl(character, type) {
  const relative = character.template?.assets?.[type] || `${type}.png`;
  if (/^(https?:|\/)/.test(relative)) return relative;
  if (relative.startsWith("assets/")) return `/game/${relative}`;
  return `/game/${character.gameBasePath}${relative}`;
}
function animationUrl(character, action, frame = 1) {
  const animation = character.template?.animations?.[action] || character.template?.animations?.idle;
  if (!animation) return "/game/assets/adventurers/_shared/sprite-placeholder.png";
  const folder = animation.folder || `sprites/${action}`;
  const actualAction = animation === character.template.animations?.[action] ? action : "idle";
  return `/game/${character.gameBasePath}${folder}/${actualAction}-${String(frame).padStart(2, "0")}.png`;
}
function renderCharacterEditor(character) {
  if (!character) return `<div class="empty-state">從左側選擇一位角色進行編輯。</div>`;
  const template = character.template;
  const previewWidth = Number(template.display?.previewWidth) || 160;
  const previewHeight = Number(template.display?.previewHeight) || 160;
  const objectPositionX = Number(template.display?.objectPositionX ?? 50);
  const objectPositionY = Number(template.display?.objectPositionY ?? 50);
  return `<div class="asset-preview-grid">
    <div class="asset-preview"><span>card</span><img src="${assetUrl(character, "card")}" onerror="this.src='/game/assets/adventurers/_shared/card-placeholder.png'"></div>
    <div class="asset-preview"><span>portrait</span><img src="${assetUrl(character, "portrait")}" onerror="this.src='/game/assets/adventurers/_shared/portrait-placeholder.png'"></div>
    <div class="asset-preview"><span>icon</span><img src="${assetUrl(character, "icon")}" onerror="this.src='/game/assets/adventurers/_shared/icon-placeholder.png'"></div>
  </div>
  <div class="segmented">${Object.keys(template.animations || { idle: {} }).map((action) => `<button data-animation-action="${action}">${action}</button>`).join("")}<button data-animation-control="pause">暫停</button></div>
  <div class="asset-preview"><span>animation</span><img id="characterAnimationPreview" data-frame="1" data-action="idle" src="${animationUrl(character, "idle")}" style="width:${previewWidth}px;height:${previewHeight}px;object-position:${objectPositionX}% ${objectPositionY}%" onerror="this.src='/game/assets/adventurers/_shared/sprite-placeholder.png'"></div>
  <div class="character-editor-grid">
    ${characterTextField("name", "名稱", template.name)}
    ${characterTextField("job", "職業", template.job)}
    ${characterSelectField("rarity", "稀有度", template.rarity, RARITIES)}
    ${characterSelectField("element", "屬性", template.element, ELEMENTS)}
    ${characterTextField("maxLevel", "最高等級", template.maxLevel, "number")}
    ${characterTextField("number", "四位數編號", template.number)}
    ${characterTextField("description", "描述", template.description, "textarea", true)}
    ${characterTextField("growth.base.hp", "基礎 HP", template.growth?.base?.hp, "number")}
    ${characterTextField("growth.base.attack", "基礎攻擊", template.growth?.base?.attack, "number")}
    ${characterTextField("growth.base.defense", "基礎防禦", template.growth?.base?.defense, "number")}
    ${characterTextField("growth.base.speed", "基礎速度", template.growth?.base?.speed, "number")}
    ${characterTextField("growth.perLevel.hp", "每級 HP", template.growth?.perLevel?.hp, "number")}
    ${characterTextField("growth.perLevel.attack", "每級攻擊", template.growth?.perLevel?.attack, "number")}
    ${characterTextField("growth.perLevel.defense", "每級防禦", template.growth?.perLevel?.defense, "number")}
    ${characterTextField("growth.perLevel.speed", "每級速度", template.growth?.perLevel?.speed, "number")}
    ${characterTextField("growth.variance.min", "個體值下限", template.growth?.variance?.min, "number")}
    ${characterTextField("growth.variance.max", "個體值上限", template.growth?.variance?.max, "number")}
    ${characterTextField("display.guildScale", "工會顯示倍率", template.display?.guildScale ?? 1, "number")}
    ${characterTextField("display.mapScale", "地圖顯示倍率", template.display?.mapScale ?? 1, "number")}
    ${characterTextField("display.portraitScale", "頭像顯示倍率", template.display?.portraitScale ?? 1, "number")}
    ${characterTextField("display.anchorX", "Anchor X", template.display?.anchorX ?? .5, "number")}
    ${characterTextField("display.anchorY", "Anchor Y", template.display?.anchorY ?? 1, "number")}
    ${characterTextField("display.previewWidth", "預覽寬度", previewWidth, "number")}
    ${characterTextField("display.previewHeight", "預覽高度", previewHeight, "number")}
    ${characterTextField("display.objectPositionX", "Object Position X", objectPositionX, "number")}
    ${characterTextField("display.objectPositionY", "Object Position Y", objectPositionY, "number")}
    ${characterTextField("display.animationSpeed", "動畫速度倍率", template.display?.animationSpeed ?? 1, "number")}
    ${characterTextField("assets.card", "卡片路徑", template.assets?.card)}
    ${characterTextField("assets.icon", "Icon 路徑", template.assets?.icon)}
    ${characterTextField("assets.portrait", "大頭貼路徑", template.assets?.portrait)}
  </div>
  <label class="text-field"><span>技能 JSON</span><textarea data-character-json="skills">${escapeHtml(JSON.stringify(template.skills || [], null, 2))}</textarea></label>
  <label class="text-field"><span>動畫 JSON</span><textarea data-character-json="animations">${escapeHtml(JSON.stringify(template.animations || {}, null, 2))}</textarea></label>
  <div class="quick-actions"><button class="primary" data-action="save-character" data-character-id="${character.id}">儲存角色 data.json</button></div>`;
}
function characterTextField(path, label, value, type = "text", full = false) {
  const input = type === "textarea" ? `<textarea data-character-field="${path}">${escapeHtml(value)}</textarea>` : `<input type="${type}" step="any" data-character-field="${path}" value="${escapeHtml(value)}">`;
  return `<label class="text-field" style="${full ? "grid-column:1/-1" : ""}"><span>${escapeHtml(label)}</span>${input}</label>`;
}
function characterSelectField(path, label, value, options) {
  return `<label class="text-field"><span>${escapeHtml(label)}</span><select data-character-field="${path}">${options.map((option) => `<option value="${option}" ${option === value ? "selected" : ""}>${option}</option>`).join("")}</select></label>`;
}
function renderAdventurers() {
  const characters = store.bootstrap.characters.filter((character) => !store.matrixFilter || `${character.rarity}/${character.element}` === store.matrixFilter);
  const selected = store.bootstrap.characters.find((character) => character.id === store.selectedCharacterId);
  content.innerHTML = pageHeading("冒險者資料庫", "掃描 index.json 與角色資料夾；點矩陣可查看該池", `<button data-action="health-check">完整檢查</button><button data-action="rebuild-index">重建 index.json</button>`)
    + panel("角色池矩陣", matrixTable())
    + `<div class="database-layout">
      ${panel(`角色清單｜${characters.length}`, `<div class="character-list">${characters.map((character) => `<button class="character-row ${character.id === store.selectedCharacterId ? "is-active" : ""}" data-character-id="${character.id}"><img src="${assetUrl(character, "icon")}" onerror="this.src='/game/assets/adventurers/_shared/icon-placeholder.png'"><span><b>${escapeHtml(character.name)}</b><small>${character.id}｜${character.job || "未設定職業"}</small></span><em class="${character.issues.length ? "status-warning" : "status-ok"}">${character.issues.length ? `${character.issues.length} 項` : "正常"}</em></button>`).join("") || `<div class="empty-state">此角色池目前沒有角色。</div>`}</div>`)}
      ${panel(selected ? `${selected.name}｜角色編輯器` : "角色編輯器", renderCharacterEditor(selected))}
    </div>`;
}

function renderSprites() {
  content.innerHTML = pageHeading("素材尺寸", "調整冒險者與龍的遊戲顯示尺寸，不修改 PNG 原圖")
    + panel("冒險者全域顯示", `<div class="field-grid">${rangeField("sprites.adventurers.guildScale", "工會比例", .3, 2, .01)}${rangeField("sprites.adventurers.mapScale", "地圖比例", .3, 2, .01)}${rangeField("sprites.adventurers.portraitScale", "頭像比例", .3, 2, .01)}${rangeField("sprites.adventurers.anchorX", "Anchor X", 0, 1, .01)}${rangeField("sprites.adventurers.anchorY", "Anchor Y", 0, 1, .01)}</div>`)
    + panel("龍階段與 Wrapper", `<div class="field-grid">${rangeField("sprites.dragons.stageScale.baby", "幼龍比例", .4, 1.5, .01)}${rangeField("sprites.dragons.stageScale.youth", "青年龍比例", .4, 1.5, .01)}${rangeField("sprites.dragons.stageScale.adult", "成年龍比例", .4, 1.5, .01)}${rangeField("sprites.dragons.stageScale.evolution", "進化龍比例", .4, 1.5, .01)}${rangeField("sprites.dragons.mapScale", "地圖尺寸", .3, 2, .01)}${rangeField("sprites.dragons.restIslandScale", "休息島尺寸", .3, 2, .01)}${rangeField("sprites.dragons.hatchIslandScale", "孵蛋島尺寸", .3, 2, .01)}${rangeField("sprites.dragons.detailScale", "詳細面板尺寸", .3, 2, .01)}${rangeField("sprites.dragons.wrapperWidth", "Wrapper 寬度", 32, 180)}${rangeField("sprites.dragons.wrapperHeight", "Wrapper 高度", 32, 180)}${rangeField("sprites.dragons.anchorX", "Anchor X", 0, 1, .01)}${rangeField("sprites.dragons.anchorY", "Anchor Y", 0, 1, .01)}</div><p class="panel-note">idle、walk、fly、sleep、attack、angry 共用同一個 wrapper，切換動作時不會改變容器尺寸。</p>`);
}

const UI_FIELDS = [
  ["topHudHeight", "上方貨幣列高度", 44, 120], ["coinWidth", "金幣框寬度", 80, 240], ["diamondWidth", "鑽石框寬度", 80, 240], ["settingsSize", "設定按鈕大小", 30, 90],
  ["bottomNavHeight", "底部導航高度", 56, 140], ["bottomNavIconSize", "導航 icon 大小", 20, 90], ["bottomNavGap", "導航間距", 0, 30], ["cardRadius", "卡片圓角", 0, 36],
  ["goldBorderWidth", "金框寬度", 0, 8], ["buttonHeight", "按鈕高度", 28, 80], ["buttonFontSize", "按鈕字體", 10, 28], ["mimiAvatarSize", "Mimi 頭像", 30, 100],
  ["mimiDialogueHeight", "Mimi 對話高度", 48, 140], ["modalWidth", "Modal 寬度", 260, 520], ["modalTop", "Modal top", 40, 240], ["overlayOpacity", "遮罩透明度", 0, 1, .01], ["toastBottom", "Toast 位置", 50, 260]
];
function renderUi() {
  content.innerHTML = pageHeading("UI 元件", "全域尺寸以 CSS variables 套用，避免各頁複製不同值")
    + panel("共用元件", `<div class="field-grid">${UI_FIELDS.map(([key, label, min, max, step]) => rangeField(`ui.${key}`, label, min, max, step || 1)).join("")}${selectField("ui.scrollbarMode", "Scrollbar", [["hidden", "隱藏原生捲軸"], ["thin", "細遊戲風捲軸"], ["native", "瀏覽器預設"]])}</div>`);
}

function renderEconomy() {
  content.innerHTML = pageHeading("遊戲數值", "集中管理召喚、探索、孵化、商店、養成與出售價格")
    + panel("主要成本與時間", `<div class="field-grid">${numberField("economy.adventurerSummonDiamonds", "角色單抽鑽石", 0, 1000)}${numberField("economy.exploreTicketCost", "探索券消耗", 0, 20)}${numberField("economy.defaultHatchSeconds", "孵化時間（秒）", 1, 86400)}${numberField("economy.equipmentShopRefreshMinutes", "裝備商店刷新（分鐘）", 1, 10080)}${rangeField("economy.equipmentPriceMultiplier", "裝備價格倍率", .1, 10, .1)}${numberField("economy.feedExp", "餵食經驗", 0, 1000)}${numberField("economy.trainExp", "訓練經驗", 0, 1000)}${numberField("economy.upgrade.baseCost", "升級基礎金幣", 0, 100000)}${numberField("economy.upgrade.levelCost", "每級增加金幣", 0, 10000)}${numberField("economy.upgrade.baseExp", "升級基礎經驗", 0, 100000)}${numberField("economy.upgrade.levelExp", "每級增加經驗", 0, 10000)}</div>`)
    + panel("冒險者出售價格", `<div class="field-grid three">${RARITIES.map((rarity) => numberField(`economy.adventurerSellPrices.${rarity}`, rarity, 0, 100000)).join("")}</div>`)
    + panel("龍出售價格", `<div class="field-grid three">${RARITIES.map((rarity) => numberField(`economy.dragonSellPrices.${rarity}`, rarity, 0, 100000)).join("")}</div>`)
    + panel("孵化器解鎖鑽石", `<div class="field-grid three">${[0, 1, 2, 3, 4, 5].map((index) => numberField(`economy.incubatorUnlockPrices.${index}`, `孵化器 ${index + 1}`, 0, 100000)).join("")}</div>`)
    + panel("新手與任務獎勵", `<div class="field-grid">
      ${numberField("economy.beginnerRewards.tutorialExploreTickets", "教學贈送探險券", 0, 100)}
      ${numberField("economy.beginnerRewards.final.coins", "總獎勵金幣", 0, 999999)}
      ${numberField("economy.beginnerRewards.final.diamonds", "總獎勵鑽石", 0, 999999)}
      ${numberField("economy.beginnerRewards.final.ticketsExplore", "總獎勵探險券", 0, 9999)}
      ${numberField("economy.beginnerRewards.final.items.mysteryBag", "總獎勵神秘袋", 0, 999)}
      ${numberField("economy.missionRewards.getEgg.coins", "取得龍蛋：金幣", 0, 999999)}
      ${numberField("economy.missionRewards.goHatchIsland.diamonds", "回孵蛋島：鑽石", 0, 999999)}
      ${numberField("economy.missionRewards.putInIncubator.ticketsExplore", "放入孵化器：探險券", 0, 9999)}
      ${numberField("economy.missionRewards.finishHatch.coins", "完成孵化：金幣", 0, 999999)}
      ${numberField("economy.missionRewards.feedOnce.diamonds", "餵食：鑽石", 0, 999999)}
      ${numberField("economy.missionRewards.trainOnce.ticketsExplore", "訓練：探險券", 0, 9999)}
      ${numberField("economy.missionRewards.growBattleReady.items.mysteryBag", "可出戰：神秘袋", 0, 999)}
    </div>`);
}

function renderAdventure() {
  const equipment = store.draft.adventure.equipmentRarityRates;
  const total = Object.values(equipment).reduce((sum, value) => sum + Number(value || 0), 0);
  content.innerHTML = pageHeading("第九頁冒險", "功能未完成時保持停用，遊戲顯示「冒險功能準備中」")
    + panel("功能與戰鬥", `<div class="field-grid">${toggleField("features.adventure", "第九頁頁籤啟用")}${toggleField("adventure.enabled", "冒險系統啟用")}${numberField("adventure.chapterCount", "地圖章節數", 1, 100)}${numberField("adventure.stagesPerChapter", "每章關卡數", 1, 100)}${rangeField("adventure.enemyLevelMultiplier", "敵人等級倍率", .1, 10, .1)}${numberField("adventure.recommendedPower", "推薦戰力", 0, 999999)}${numberField("adventure.staminaCost", "體力消耗", 0, 100)}${numberField("adventure.coinDrop", "金幣掉落", 0, 999999)}${numberField("adventure.expDrop", "經驗掉落", 0, 999999)}${rangeField("adventure.equipmentDropRate", "裝備掉落率 %", 0, 100, .1)}${rangeField("adventure.bossRate", "Boss 出現率 %", 0, 100, .1)}${toggleField("adventure.autoBattle", "自動戰鬥")}${rangeField("adventure.battleSpeed", "戰鬥速度", .5, 4, .1)}${numberField("adventure.teamSize", "隊伍人數上限", 1, 8)}</div>`)
    + panel("裝備掉落稀有度", `<div class="probability-grid">${RARITIES.map((rarity) => `<label class="probability-field"><span>${rarity}</span><input type="number" min="0" max="100" step=".1" value="${equipment[rarity]}" data-config-path="adventure.equipmentRarityRates.${rarity}"></label>`).join("")}</div><div class="probability-total ${Math.abs(total - 100) > .0001 ? "invalid" : ""}" data-probability-path="adventure.equipmentRarityRates">目前總和：${total.toFixed(1)}%</div>`);
}

function renderUnclassified() {
  const files = store.bootstrap.unclassified || [];
  content.innerHTML = pageHeading("未分類素材", "只列出冒險者根目錄的散落圖片；整理時先複製與驗證，不會自動刪除來源")
    + (files.length ? `<div class="unclassified-grid">${files.map((file) => `<article class="unclassified-item" data-unclassified-file="${escapeHtml(file.name)}"><img src="${file.url}"><b title="${escapeHtml(file.name)}">${escapeHtml(file.name)}</b><small>${Math.round(file.size / 1024)} KB</small><div class="organize-fields"><select data-organize="rarity">${RARITIES.map((rarity) => `<option>${rarity}</option>`).join("")}</select><select data-organize="element">${ELEMENTS.map((element) => `<option>${element}</option>`).join("")}</select><input data-organize="number" value="0001" maxlength="4"><select data-organize="purpose"><option value="card">card</option><option value="portrait">portrait</option><option value="icon">icon</option><option value="reference">參考圖</option><option value="ignore">忽略</option></select><button data-action="organize-file">複製到角色資料夾</button><button class="danger" data-action="delete-unclassified">刪除來源</button></div></article>`).join("")}</div>` : `<div class="empty-state">目前沒有未分類素材。</div>`);
}

function renderBackups() {
  content.innerHTML = pageHeading("匯入、匯出與備份", "所有寫入前自動備份，最多保留最近 50 份", `<button data-action="create-backup">立即完整備份</button>`)
    + panel("設定檔", `<div class="quick-actions"><button data-action="export-config">匯出全部設定</button><button data-action="import-config">匯入設定</button><button data-action="export-index">匯出角色索引</button><button data-action="rebuild-index">重建角色索引</button></div><input id="configImportFile" type="file" accept="application/json" hidden>`)
    + panel("備份紀錄", `<div>${store.backups.map((backup) => `<div class="backup-row"><span><b>${escapeHtml(backup.label)}</b><small>${new Date(backup.createdAt).toLocaleString()}｜${backup.files.length} 個檔案</small></span><button data-action="restore-backup" data-backup-id="${escapeHtml(backup.id)}">還原</button></div>`).join("") || `<p class="panel-note">尚無備份。</p>`}</div>`);
}

function renderHealth() {
  const health = store.health;
  content.innerHTML = pageHeading("資料健康檢查", "角色索引、資料格式、素材、技能與空角色池完整檢查", `<button data-tab="adventurers">返回資料庫</button><button data-action="health-check">重新檢查</button>`)
    + `<div class="metric-grid">${metric(health.counts.ok, "可用角色")}${metric(health.counts.warning, "警告", "status-warning")}${metric(health.counts.error, "錯誤", "status-error")}${metric(health.counts.missingAssets, "缺素材角色")}</div>`
    + panel("檢查結果", `<div class="issue-list">${health.issues.map((issue) => `<div class="issue ${issue.level}"><b>${issue.level === "error" ? "錯誤" : "警告"}</b>｜${escapeHtml(issue.message)}${issue.characterId ? `｜${escapeHtml(issue.characterId)}` : ""}</div>`).join("") || `<div class="issue status-ok">所有檢查均正常。</div>`}</div>`);
}

function render() {
  clearInterval(store.animationTimer);
  const renderers = { dashboard: renderDashboard, pages: renderPages, gacha: renderGacha, adventurers: renderAdventurers, sprites: renderSprites, ui: renderUi, economy: renderEconomy, adventure: renderAdventure, unclassified: renderUnclassified, backups: renderBackups, health: renderHealth };
  (renderers[store.activeTab] || renderDashboard)();
  document.querySelectorAll("[data-tab]").forEach((button) => button.classList.toggle("is-active", button.dataset.tab === store.activeTab));
  updateTopbarState();
}

async function refreshBootstrap({ keepDraft = true } = {}) {
  const data = await api("/api/bootstrap");
  store.bootstrap = data;
  store.health = data.health;
  store.defaults = clone(data.defaults || data.config);
  if (!keepDraft || !store.draft) {
    store.draft = clone(data.config);
    store.saved = clone(data.config);
    store.history = [];
    store.future = [];
  }
  store.backups = await api("/api/backups");
}

async function saveConfig() {
  if (!probabilitiesValid()) return showToast("機率總和不是 100%，無法儲存", true);
  try {
    const result = await api("/api/config", { method: "PUT", body: JSON.stringify(store.draft) });
    store.draft = clone(result.config);
    store.saved = clone(result.config);
    store.bootstrap.config = clone(result.config);
    store.bootstrap.summary.version = result.config.version;
    store.bootstrap.summary.lastConfigModifiedAt = Date.now();
    store.history = [];
    store.future = [];
    showToast(result.message);
    postPreview();
    render();
  } catch (error) { showToast(error.message, true); }
}

function downloadJson(fileName, data) {
  const url = URL.createObjectURL(new Blob([`${JSON.stringify(data, null, 2)}\n`], { type: "application/json" }));
  const anchor = Object.assign(document.createElement("a"), { href: url, download: fileName });
  anchor.click();
  URL.revokeObjectURL(url);
}

function readCharacterForm(character) {
  const next = clone(character.template);
  content.querySelectorAll("[data-character-field]").forEach((field) => {
    const value = field.type === "number" ? Number(field.value) : field.value;
    setAt(next, field.dataset.characterField, value);
  });
  content.querySelectorAll("[data-character-json]").forEach((field) => { next[field.dataset.characterJson] = JSON.parse(field.value); });
  return next;
}

function startAnimation(character, action) {
  clearInterval(store.animationTimer);
  const image = document.getElementById("characterAnimationPreview");
  if (!image) return;
  const animation = character.template.animations?.[action] || character.template.animations?.idle;
  const frameCount = Math.max(1, Number(animation?.frameCount) || 1);
  const speed = Math.max(.1, Number(character.template.display?.animationSpeed) || 1);
  const duration = Math.max(40, (Number(animation?.frameDuration) || 150) / speed);
  let frame = 1;
  image.dataset.action = action;
  image.src = animationUrl(character, action, frame);
  store.animationTimer = setInterval(() => {
    frame = frame % frameCount + 1;
    image.src = animationUrl(character, action, frame);
  }, duration);
}

document.addEventListener("click", async (event) => {
  const tab = event.target.closest("[data-tab]");
  if (tab) { store.activeTab = tab.dataset.tab; render(); return; }
  const page = event.target.closest("[data-page-key]");
  if (page) { store.activePage = page.dataset.pageKey; render(); return; }
  const matrix = event.target.closest("[data-matrix-filter]");
  if (matrix) { store.matrixFilter = store.matrixFilter === matrix.dataset.matrixFilter ? null : matrix.dataset.matrixFilter; render(); return; }
  const characterButton = event.target.closest("[data-character-id]");
  if (characterButton && !characterButton.dataset.action) { store.selectedCharacterId = characterButton.dataset.characterId; render(); return; }
  const animation = event.target.closest("[data-animation-action]");
  if (animation) {
    const character = store.bootstrap.characters.find((item) => item.id === store.selectedCharacterId);
    if (character) startAnimation(character, animation.dataset.animationAction);
    return;
  }
  if (event.target.closest('[data-animation-control="pause"]')) { clearInterval(store.animationTimer); return; }

  const button = event.target.closest("[data-action]");
  if (!button) return;
  const action = button.dataset.action;
  try {
    if (action === "save-config") await saveConfig();
    if (action === "undo" && store.history.length) { store.future.push(clone(store.draft)); store.draft = store.history.pop(); render(); postPreview(); }
    if (action === "redo" && store.future.length) { store.history.push(clone(store.draft)); store.draft = store.future.pop(); render(); postPreview(); }
    if (action === "reload-preview") { preview.src = `/game/index.html?dragonAdminPreview=1&t=${Date.now()}`; }
    if (action === "reset-page") {
      pushHistory();
      store.draft.pages[store.activePage] = clone(store.defaults?.pages?.[store.activePage] || PAGE_DEFAULT);
      render();
      postPreview();
    }
    if (action === "reset-all" && confirm("確定還原全部出廠預設值？尚未儲存的修改會消失。")) {
      pushHistory();
      store.draft = clone(store.defaults || store.saved);
      render();
      postPreview();
    }
    if (action === "simulate" || action === "quick-simulate") {
      const draws = action === "quick-simulate" ? 10000 : Number(document.getElementById("simulationDraws")?.value || 10000);
      store.simulation = await api("/api/gacha/simulate", { method: "POST", body: JSON.stringify({ draws, config: store.draft }) });
      store.activeTab = "gacha";
      render();
    }
    if (action === "health-check") { store.health = await api("/api/adventurers/health", { method: "POST", body: "{}" }); store.activeTab = "health"; render(); }
    if (action === "rebuild-index" && confirm("將掃描合法角色資料夾、備份舊索引後重建 index.json。確定繼續？")) { const result = await api("/api/adventurers/rebuild-index", { method: "POST", body: "{}" }); await refreshBootstrap(); showToast(`已重建 ${result.count} 位角色索引`); render(); }
    if (action === "save-character") {
      const character = store.bootstrap.characters.find((item) => item.id === button.dataset.characterId);
      const next = readCharacterForm(character);
      const result = await api(`/api/adventurers/${encodeURIComponent(character.id)}`, { method: "PUT", body: JSON.stringify(next) });
      store.selectedCharacterId = result.id;
      await refreshBootstrap();
      showToast(`${next.name} 已儲存`);
      render();
    }
    if (action === "organize-file") {
      const card = button.closest("[data-unclassified-file]");
      const value = (name) => card.querySelector(`[data-organize="${name}"]`).value;
      const result = await api("/api/unclassified/organize", { method: "POST", body: JSON.stringify({ fileName: card.dataset.unclassifiedFile, rarity: value("rarity"), element: value("element"), number: value("number"), purpose: value("purpose") }) });
      showToast(result.ignored ? "已標記忽略" : `已複製到 ${result.copiedTo}，來源仍保留`);
      await refreshBootstrap(); render();
    }
    if (action === "delete-unclassified") {
      const card = button.closest("[data-unclassified-file]");
      if (!confirm(`確定刪除來源 ${card.dataset.unclassifiedFile}？系統會先建立備份。`)) return;
      await api("/api/unclassified/delete", { method: "POST", body: JSON.stringify({ fileName: card.dataset.unclassifiedFile, confirm: true }) });
      await refreshBootstrap(); showToast("來源已備份並刪除"); render();
    }
    if (action === "create-backup") { const result = await api("/api/backups", { method: "POST", body: "{}" }); store.backups = await api("/api/backups"); showToast(`已備份 ${result.backup.files.length} 個檔案`); render(); }
    if (action === "restore-backup" && confirm("還原前會先備份目前檔案。確定還原這份備份？")) { await api("/api/backups/restore", { method: "POST", body: JSON.stringify({ id: button.dataset.backupId }) }); await refreshBootstrap({ keepDraft: false }); showToast("備份已還原"); render(); postPreview(); }
    if (action === "export-config") downloadJson(`dragon-game-config-${Date.now()}.json`, store.draft);
    if (action === "export-index") downloadJson(`adventurers-index-${Date.now()}.json`, { characters: store.bootstrap.characters.filter((item) => item.indexed).map((item) => ({ id: item.id, path: item.relativeDataPath })) });
    if (action === "import-config") document.getElementById("configImportFile").click();
  } catch (error) { showToast(error.message, true); }
});

content.addEventListener("input", (event) => {
  const field = event.target.closest("[data-config-path]");
  if (!field) return;
  const oldValue = getAt(store.draft, field.dataset.configPath);
  const value = field.type === "checkbox" ? field.checked : field.type === "number" || field.type === "range" ? Number(field.value) : field.value;
  if (oldValue === value) return;
  pushHistory();
  setAt(store.draft, field.dataset.configPath, value);
  content.querySelectorAll(`[data-config-path="${field.dataset.configPath}"]`).forEach((mirror) => { if (mirror !== field) { if (mirror.type === "checkbox") mirror.checked = Boolean(value); else mirror.value = value; } });
  postPreview();
  updateTopbarState();
  content.querySelectorAll("[data-probability-path]").forEach((element) => {
    const values = Object.values(getAt(store.draft, element.dataset.probabilityPath) || {});
    const total = values.reduce((sum, item) => sum + Number(item || 0), 0);
    element.textContent = `目前總和：${total.toFixed(1)}%`;
    element.classList.toggle("invalid", Math.abs(total - 100) > .0001);
  });
});

document.getElementById("configImportFile")?.addEventListener("change", async (event) => {
  try {
    const file = event.target.files?.[0];
    if (!file) return;
    const imported = JSON.parse(await file.text());
    pushHistory();
    store.draft = imported;
    render();
    postPreview();
    showToast("設定已匯入草稿，按「儲存設定」才會寫入專案");
  } catch (error) { showToast(`匯入失敗：${error.message}`, true); }
  event.target.value = "";
});

function updatePreviewSize() {
  const preset = document.getElementById("previewPreset").value;
  const custom = document.querySelector(".preview-custom");
  custom.hidden = preset !== "custom";
  const [presetWidth, presetHeight] = preset === "custom" ? [document.getElementById("previewWidth").value, document.getElementById("previewHeight").value] : preset.split("x");
  const width = Math.max(280, Number(presetWidth) || 390);
  const height = Math.max(480, Number(presetHeight) || 844);
  preview.style.width = `${width}px`;
  preview.style.height = `${height}px`;
  document.getElementById("previewSizeLabel").textContent = `${width} × ${height}`;
}
document.getElementById("previewPreset").addEventListener("change", updatePreviewSize);
document.getElementById("previewWidth").addEventListener("input", updatePreviewSize);
document.getElementById("previewHeight").addEventListener("input", updatePreviewSize);
preview.addEventListener("load", () => setTimeout(postPreview, 500));

async function initialize() {
  try {
    await refreshBootstrap({ keepDraft: false });
    render();
    updatePreviewSize();
  } catch (error) {
    content.innerHTML = `<div class="empty-state status-error">Dragon Admin Studio 載入失敗：${escapeHtml(error.message)}</div>`;
  }
}

initialize();
