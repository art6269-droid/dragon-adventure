"use strict";

// Final Home V2 overrides. Keep this file loaded after app.js so these layout
// functions are the active versions without disturbing the existing game logic.
function getWorldPages() {
  return [
    { id: "home", label: "家", title: "休息島", icon: "家", assetKey: "navHome", className: "homePage", render: renderWorldHomePage },
    { id: "dragonCave", label: "龍窟", title: "龍窟", icon: "蛋", assetKey: "navDragonCave", className: "dragonCavePage", render: renderWorldDragonCavePage },
    { id: "equipment", label: "裝備店", title: "裝備店", icon: "裝", assetKey: "navEquipmentShop", className: "equipmentShopPage", render: (index) => renderWorldPlaceholderPage(index, "equipmentShopPage", "裝備店", "寵物與傭兵裝備會在這裡整理。", [
      ["寵物頭盔", "提升龍寵防護"],
      ["寵物胸甲", "增加龍寵耐久"],
      ["傭兵武器", "提升角色攻擊"],
      ["傭兵鞋子", "提升行動速度"]
    ]) },
    { id: "items", label: "道具店", title: "道具店", icon: "袋", assetKey: "navItemShop", className: "itemShopPage", render: (index) => renderWorldPlaceholderPage(index, "itemShopPage", "道具店", "探險卷、食物、卷軸與孵化道具會在這裡販售。", [
      ["探險卷", "探索時取得龍蛋"],
      ["傭兵契約券", "冒險公會抽角色"],
      ["寵物食物", "恢復龍的飢餓值"],
      ["孵化道具", "加速或穩定孵化"]
    ]) },
    { id: "explore", label: "探索", title: "探索", icon: "探", assetKey: "navExplore", className: "explorePage", render: (index) => renderWorldPlaceholderPage(index, "explorePage", "探索", "使用探險卷前往不同區域尋找龍蛋。", [
      ["火山", "火屬性龍蛋較常見"],
      ["海洋", "水屬性龍蛋較常見"],
      ["森林", "木與土屬性龍蛋較常見"],
      ["稀有獎勵", "光與暗屬性低機率出現"]
    ]) },
    { id: "quest", label: "任務", title: "任務", icon: "任", assetKey: "navQuest", className: "questPage", render: renderWorldQuestPage }
  ];
}

function renderHomeV2() {
  if (!els.homeV2Root) return;

  console.log("[renderWorldPager]");
  const currentPager = document.querySelector("#worldPager");
  const preservedPage = currentPager
    ? Math.round(currentPager.scrollLeft / Math.max(1, currentPager.clientWidth))
    : 0;
  currentWorldPage = preservedPage;
  const pages = getWorldPages();

  els.homeV2Root.innerHTML = `
    <header class="home-v2-hud" aria-label="玩家資源">
      ${homeV2Resource("金", formatNumber(state.coins), "金幣")}
      ${homeV2Resource("鑽", formatNumber(state.diamonds), "鑽石")}
      <button class="home-v2-settings" type="button" data-v2-action="settings" aria-label="設定">
        <i>設</i><span>設定</span>
      </button>
    </header>

    <main id="homeScene" class="home-v2-scene" aria-label="龍島世界">
      <div id="worldPager" aria-label="橫向滑動島嶼">
        ${pages.map((page, index) => page.render(index)).join("")}
      </div>
    </main>

    <div class="homeDots" aria-label="頁面位置">
      ${pages.map((page, index) => `<button class="homeDot${index === preservedPage ? " is-active" : ""}" type="button" data-page="${index}" aria-label="${escapeHtml(page.title)}"></button>`).join("")}
    </div>

    <section class="home-v2-dialogue mimi-guide-panel" aria-label="Mimi 導覽">
      <div class="mimi-guide-avatar asset-host">
        ${renderAssetImage("mimiHead", "Mimi", "asset-image mimi-guide-head")}
        <span>Mimi</span>
      </div>
      <div class="mimi-guide-text">
        <p>歡迎回來！這裡是休息島，龍寶們正在休息喔。</p>
      </div>
    </section>

    <button id="navLeftBtn" class="home-v2-nav-arrow is-left" type="button" data-v2-nav-arrow="-1" aria-label="向左捲動導航">‹</button>
    <nav id="bottomNavViewport" aria-label="底部功能導航">
      <div id="bottomNavTrack">
        ${pages.map((page, index) => homeV2NavItem(page, index, index === preservedPage)).join("")}
      </div>
    </nav>
    <button id="navRightBtn" class="home-v2-nav-arrow is-right" type="button" data-v2-nav-arrow="1" aria-label="向右捲動導航">›</button>
    ${renderEggSelectionModal()}
  `;

  window.setTimeout(() => {
    const nextPager = document.querySelector("#worldPager");
    if (nextPager) {
      nextPager.scrollLeft = preservedPage * nextPager.clientWidth;
    }
    updateHomeV2ActiveSlide();
  }, 0);
}

function renderWorldHomePage(index) {
  const dragons = state.dragons.slice(0, 5);

  return `
    <section class="worldPage homePage restIsland" data-world-index="${index}" aria-label="休息島">
      <div class="rest-ambient" aria-hidden="true">
        <span class="rest-cloud rest-cloud-a"></span>
        <span class="rest-cloud rest-cloud-b"></span>
        <span class="rest-mini-island"></span>
        <span class="rest-far-crystal rest-far-crystal-a"></span>
        <span class="rest-far-crystal rest-far-crystal-b"></span>
        <span class="rest-particle particle-a"></span>
        <span class="rest-particle particle-b"></span>
        <span class="rest-particle particle-c"></span>
        <span class="rest-particle particle-d"></span>
      </div>
      <div class="rest-island-stage">
        <div class="rest-island-glow" aria-hidden="true"></div>
        <img
          class="rest-island-art"
          src="${ASSETS.islands.rest}"
          alt="休息島"
          decoding="async"
          onerror="this.hidden=true;this.nextElementSibling.hidden=false"
        >
        <div class="rest-island-art-fallback" hidden>休息島</div>
        <div class="rest-island-decor" aria-hidden="true">
          <span class="rest-decor decor-flowerbed"></span>
          <span class="rest-decor decor-crystal-front"></span>
          <span class="rest-decor decor-bush"></span>
          <span class="rest-decor decor-mushroom"></span>
          <span class="rest-decor decor-stump"></span>
          <span class="rest-decor decor-sparkle decor-sparkle-a"></span>
          <span class="rest-decor decor-sparkle decor-sparkle-b"></span>
        </div>
        <div class="rest-island-characters">
          <div class="home-v2-dragons">
            ${dragons.length > 0 ? dragons.map(renderHomeV2Dragon).join("") : `
              <div class="home-v2-empty">
                <b>還沒有龍在休息</b>
                <p>前往龍窟孵化龍蛋，讓休息島熱鬧起來。</p>
              </div>
            `}
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderWorldQuestPage(index) {
  const readySlots = (state.hatchIsland?.hatchSlots || []).filter((slot) => slot.currentEgg && getHatchSlotStatus(slot).ready).length;
  const eggCount = (state.eggInventory || []).length;
  return renderWorldPlaceholderPage(index, "questPage", "任務", "任務資訊集中在這裡，不再壓在休息島場景上。", [
    ["今日照顧", "查看休息島上的龍寶狀態"],
    ["孵化提醒", readySlots > 0 ? `${readySlots} 顆蛋可以領取` : "目前沒有可領取的龍蛋"],
    ["蛋庫存", `目前持有 ${eggCount} 顆龍蛋`],
    ["下一步", "前往探索取得更多龍蛋"]
  ]);
}

function getRestDragonState(dragon, index) {
  const states = ["sleep", "walk", "fly", "walk", "sleep"];
  return ["sleep", "walk", "fly"].includes(dragon.restState) ? dragon.restState : states[index % states.length];
}

function getRestDragonFrames(restState) {
  if (restState === "fly") return ["dragonRestFly1", "dragonRestFly2"];
  if (restState === "walk") return ["dragonRestWalk1", "dragonRestWalk2"];
  return ["dragonRestSleep"];
}

function renderHomeV2Dragon(dragon, index) {
  const positions = [
    { x: 28, y: 57, s: 0.94 },
    { x: 50, y: 50, s: 1 },
    { x: 72, y: 38, s: 0.86 },
    { x: 38, y: 69, s: 0.78 },
    { x: 64, y: 66, s: 0.8 }
  ];
  const pos = positions[index % positions.length];
  const restState = getRestDragonState(dragon, index);
  const frames = getRestDragonFrames(restState);
  const rarityClass = `is-rarity-${String(dragon.rarity || "C").toLowerCase()}`;
  return `
    <button
      class="home-v2-dragon rest-dragon ${rarityClass} rest-state-${restState}"
      type="button"
      data-v2-action="select-dragon"
      data-dragon-id="${dragon.id}"
      data-rest-state="${restState}"
      style="--x:${pos.x}%;--y:${pos.y}%;--s:${pos.s};--idle-delay:${index * -0.45}s;"
      aria-label="${escapeHtml(dragon.name)}"
    >
      <span class="dragon-ground-shadow" aria-hidden="true">
        ${renderAssetImage("dragonShadow", "", "asset-image dragon-shadow-art")}
      </span>
      <span class="dragon-aura" aria-hidden="true">
        ${renderAssetImage("dragonGlow", "", "asset-image dragon-glow-art")}
      </span>
      <span class="dragon-portrait asset-host">
        ${frames.map((frameKey, frameIndex) => renderAssetImage(frameKey, dragon.name, `asset-image dragon-state-frame frame-${frameIndex + 1}`)).join("")}
        <span class="home-v2-dragon-fallback">${escapeHtml(dragon.rarity || "龍")}</span>
      </span>
      ${restState === "sleep" ? `<span class="dragon-zzz" aria-hidden="true">Zzz</span>` : ""}
      <span class="dragon-nameplate">
        <b>${escapeHtml(dragon.name)}</b>
        <span><i>${dragon.rarity}</i>${escapeHtml(dragon.element)}</span>
      </span>
    </button>
  `;
}

Object.assign(window, {
  getWorldPages,
  renderHomeV2,
  renderWorldHomePage,
  renderWorldQuestPage,
  renderHomeV2Dragon
});

if (typeof render === "function") {
  window.requestAnimationFrame(() => render());
}
