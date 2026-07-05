"use strict";

const STORAGE_KEY = "dragonAdventureMvpState";
const AUDIO_STORAGE_KEY = "dragonAdventureAudioSettings";
const MUSIC_TRACKS = {
  start: "assets/audio/start.mp3",
  intro: "assets/audio/intro.mp3",
  home: "assets/audio/home.mp3",
  battle: "assets/audio/battle.mp3",
  shop: "assets/audio/shop.mp3",
  fusion: "assets/audio/fusion.mp3"
};
const MUSIC_FALLBACKS = {
  start: ["intro"],
  intro: [],
  home: ["start", "intro"],
  battle: ["intro"],
  shop: ["home", "intro"],
  fusion: ["home", "intro"]
};
const MUSIC_BY_TAB = {
  home: "home",
  bag: "home",
  hatch: "home",
  dragons: "home",
  eggs: "home",
  explore: "home",
  guild: "home",
  stage: "battle",
  itemShop: "shop",
  equipmentShop: "shop",
  gacha: "home",
  codex: "home",
  market: "shop",
  fusion: "fusion",
  pve: "battle",
  pk: "battle"
};
const SFX = {
  startGame: "assets/audio/sfx/sfx-start-game.mp3"
};

const rarities = ["C", "B", "A", "S", "SS", "SSS"];
const cardElements = ["fire", "water", "grass", "dark", "light"];
const cardElementLabels = {
  fire: "火",
  water: "水",
  grass: "草",
  dark: "暗",
  light: "光"
};
const cardKindLabels = {
  character: "角色",
  pet: "寵物"
};
const rarityRates = [
  { rarity: "C", rate: 45 },
  { rarity: "B", rate: 25 },
  { rarity: "A", rate: 15 },
  { rarity: "S", rate: 9 },
  { rarity: "SS", rate: 5 },
  { rarity: "SSS", rate: 1 }
];
const gachaCosts = { coins: 200, diamonds: 30 };
const exploreCosts = { single: 1, ten: 10 };
const mercenaryCosts = { single: 1, ten: 10 };
const hatchSlotUnlockCosts = [0, 0, 100, 200, 300, 500];
const cardRarityRates = [
  { rarity: "C", rate: 45 },
  { rarity: "B", rate: 25 },
  { rarity: "A", rate: 15 },
  { rarity: "S", rate: 9 },
  { rarity: "SS", rate: 5 },
  { rarity: "SSS", rate: 1 }
];
const duplicateFragmentRewards = { C: 5, B: 8, A: 15, S: 35, SS: 80, SSS: 200 };
const fusionRates = { C: 80, B: 65, A: 45, S: 25, SS: 10 };
const sellPrices = { C: 50, B: 150, A: 500, S: 1500, SS: 5000, SSS: 20000 };
const rarityPower = { C: 1, B: 1.22, A: 1.5, S: 1.95, SS: 2.55, SSS: 3.4 };
const foodTypes = {
  jerky: { name: "小肉乾", hunger: 20 },
  fruit: { name: "龍果實", hunger: 50 },
  steak: { name: "神秘肉排", hunger: 100 }
};
const elements = ["火", "水", "木", "風", "雷", "土", "光", "暗"];
const elementClass = {
  火: "fire",
  水: "water",
  木: "grass",
  風: "wind",
  雷: "thunder",
  土: "earth",
  光: "light",
  暗: "dark"
};
const elementPalettes = {
  火: { main: "#ff6b4f", belly: "#ffe194", accent: "#c33031" },
  水: { main: "#42c0ef", belly: "#dcfaff", accent: "#176eb8" },
  木: { main: "#7bdd7f", belly: "#f3ffd8", accent: "#2d9658" },
  風: { main: "#68dc93", belly: "#efffe7", accent: "#24956e" },
  雷: { main: "#ffd24f", belly: "#fff7c2", accent: "#d17618" },
  土: { main: "#bd8d58", belly: "#f5deba", accent: "#6f4b28" },
  光: { main: "#fff1cf", belly: "#ffffff", accent: "#d79d24" },
  暗: { main: "#7a45dc", belly: "#e3b7ff", accent: "#371d75" }
};
const elementNames = {
  火: ["小焰", "赤牙", "暖翼"],
  水: ["小澪", "藍鰭", "潮尾"],
  木: ["小芽", "森角", "葉尾"],
  風: ["小颯", "青羽", "雲角"],
  雷: ["小閃", "鳴牙", "電翼"],
  土: ["小岩", "厚爪", "森角"],
  光: ["小曜", "星翼", "晨冠"],
  暗: ["小影", "夜瞳", "暮爪"]
};
const rarityTitles = {
  C: "幼龍",
  B: "勇龍",
  A: "戰龍",
  S: "王龍",
  SS: "聖龍",
  SSS: "傳說龍"
};
const defaultEggType = "normal-egg";
const eggTypes = {
  "normal-egg": {
    type: "normal-egg",
    name: "普通龍蛋",
    description: "適合新手培育的基礎龍蛋",
    price: 300,
    rarityPool: ["C", "B", "A"],
    rarityRates: [
      { rarity: "C", rate: 60 },
      { rarity: "B", rate: 30 },
      { rarity: "A", rate: 10 }
    ],
    elementBias: null,
    shopTab: "coin",
    currency: "coins",
    requiredSteps: 1000,
    requiredMs: 5 * 60 * 1000,
    image: "eggs/egg-common.png"
  },
  "rare-egg": {
    type: "rare-egg",
    name: "稀有龍蛋",
    description: "蘊含清亮魔力的稀有龍蛋",
    price: 1200,
    rarityPool: ["B", "A", "S"],
    rarityRates: [
      { rarity: "B", rate: 50 },
      { rarity: "A", rate: 35 },
      { rarity: "S", rate: 15 }
    ],
    elementBias: null,
    shopTab: "coin",
    currency: "coins",
    requiredSteps: 1600,
    requiredMs: 7 * 60 * 1000,
    image: "eggs/egg-rare.png"
  },
  "epic-egg": {
    type: "epic-egg",
    name: "史詩龍蛋",
    description: "刻著古代紋路的高階龍蛋",
    price: 180,
    rarityPool: ["A", "S", "SS"],
    rarityRates: [
      { rarity: "A", rate: 50 },
      { rarity: "S", rate: 35 },
      { rarity: "SS", rate: 15 }
    ],
    elementBias: null,
    shopTab: "diamond",
    currency: "diamonds",
    requiredSteps: 2200,
    requiredMs: 9 * 60 * 1000,
    image: "eggs/egg-epic.png"
  },
  "legendary-egg": {
    type: "legendary-egg",
    name: "傳說龍蛋",
    description: "閃耀傳說光輝的珍貴龍蛋",
    price: 480,
    rarityPool: ["S", "SS", "SSS"],
    rarityRates: [
      { rarity: "S", rate: 60 },
      { rarity: "SS", rate: 30 },
      { rarity: "SSS", rate: 10 }
    ],
    elementBias: null,
    shopTab: "diamond",
    currency: "diamonds",
    requiredSteps: 2600,
    requiredMs: 11 * 60 * 1000,
    image: "eggs/egg-legendary.png"
  },
  "dark-sss-egg": {
    type: "dark-sss-egg",
    name: "深淵混沌蛋",
    description: "暗黑屬性高稀有龍蛋",
    price: 1200,
    rarityPool: ["S", "SS", "SSS"],
    rarityRates: [
      { rarity: "S", rate: 50 },
      { rarity: "SS", rate: 35 },
      { rarity: "SSS", rate: 15 }
    ],
    elementBias: "暗",
    shopTab: "diamond",
    currency: "diamonds",
    requiredSteps: 3000,
    requiredMs: 12 * 60 * 1000,
    image: "eggs/egg-dark-sss.png"
  }
};
const shopItems = {
  "jerky-pack": {
    id: "jerky-pack",
    type: "item",
    shopTab: "coin",
    currency: "coins",
    name: "小肉乾補給包",
    description: "獲得小肉乾 x3，適合出門冒險前補給。",
    price: 200,
    icon: "肉",
    rewards: { foods: { jerky: 3 } }
  },
  "fruit-pack": {
    id: "fruit-pack",
    type: "item",
    shopTab: "coin",
    currency: "coins",
    name: "龍果實籃",
    description: "獲得龍果實 x2，讓龍夥伴快速恢復精神。",
    price: 650,
    icon: "果",
    rewards: { foods: { fruit: 2 } }
  },
  "steak-pack": {
    id: "steak-pack",
    type: "item",
    shopTab: "diamond",
    currency: "diamonds",
    name: "神秘肉排禮盒",
    description: "獲得神秘肉排 x2，高級龍也會喜歡。",
    price: 80,
    icon: "排",
    rewards: { foods: { steak: 2 } }
  }
};
const itemShopProducts = [
  { id: "explore-ticket", category: "探險", name: "探險卷", description: "用來前往火山、海洋、森林探索龍蛋。", price: 180, currency: "coins", icon: "券", rewards: { ticketsExplore: 1 } },
  { id: "mercenary-ticket", category: "公會", name: "傭兵契約券", description: "可在冒險公會召募傭兵角色。", price: 260, currency: "coins", icon: "契", rewards: { ticketsMercenary: 1 } },
  { id: "potion-small", category: "回復", name: "小型恢復藥", description: "恢復少量狀態，適合普通關卡。", price: 120, currency: "coins", icon: "藥", rewards: { items: { "potion-small": 1 } } },
  { id: "potion-medium", category: "回復", name: "中型恢復藥", description: "恢復中量狀態，探索前的穩定補給。", price: 320, currency: "coins", icon: "藥", rewards: { items: { "potion-medium": 1 } } },
  { id: "potion-party", category: "回復", name: "全體恢復藥", description: "全隊恢復用的珍貴藥劑。", price: 80, currency: "diamonds", icon: "群", rewards: { items: { "potion-party": 1 } } },
  { id: "potion-cleanse", category: "回復", name: "狀態恢復藥", description: "解除異常狀態。", price: 180, currency: "coins", icon: "淨", rewards: { items: { "potion-cleanse": 1 } } },
  { id: "jerky-plus", category: "食物", name: "小肉乾", description: "寵物喜歡的簡單肉乾。", price: 90, currency: "coins", icon: "肉", rewards: { foods: { jerky: 1 } } },
  { id: "dragon-fruit-plus", category: "食物", name: "龍果實", description: "能快速恢復龍寵精神。", price: 220, currency: "coins", icon: "果", rewards: { foods: { fruit: 1 } } },
  { id: "premium-meat-plus", category: "食物", name: "神秘肉排", description: "高飽足感的稀有食物。", price: 35, currency: "diamonds", icon: "排", rewards: { foods: { steak: 1 } } },
  { id: "energy-feed", category: "食物", name: "高級能量飼料", description: "後續可用於寵物養成與技能訓練。", price: 420, currency: "coins", icon: "糧", rewards: { items: { "energy-feed": 1 } } },
  { id: "scroll-fire", category: "技能卷軸", name: "火焰卷軸", description: "學習或強化火焰技能的卷軸。", price: 520, currency: "coins", icon: "火", rewards: { items: { "scroll-fire": 1 } } },
  { id: "scroll-water", category: "技能卷軸", name: "水流卷軸", description: "學習或強化水流技能的卷軸。", price: 520, currency: "coins", icon: "水", rewards: { items: { "scroll-water": 1 } } },
  { id: "scroll-defense", category: "技能卷軸", name: "防禦強化卷軸", description: "提高寵物防禦相關技能。", price: 580, currency: "coins", icon: "盾", rewards: { items: { "scroll-defense": 1 } } },
  { id: "scroll-speed", category: "技能卷軸", name: "速度提升卷軸", description: "提高寵物速度相關技能。", price: 580, currency: "coins", icon: "速", rewards: { items: { "scroll-speed": 1 } } },
  { id: "scroll-dark", category: "技能卷軸", name: "暗影衝擊卷軸", description: "暗屬性稀有技能卷軸。", price: 80, currency: "diamonds", icon: "暗", rewards: { items: { "scroll-dark": 1 } } },
  { id: "scroll-light", category: "技能卷軸", name: "光之庇護卷軸", description: "光屬性稀有技能卷軸。", price: 80, currency: "diamonds", icon: "光", rewards: { items: { "scroll-light": 1 } } },
  { id: "hatch-hourglass", category: "孵化", name: "孵化加速沙漏", description: "縮短時間型孵化臺的等待時間。", price: 60, currency: "diamonds", icon: "沙", rewards: { items: { "hatch-hourglass": 1 } } },
  { id: "step-booster", category: "孵化", name: "步數推進器", description: "增加步數型孵化臺的步數進度。", price: 260, currency: "coins", icon: "步", rewards: { items: { "step-booster": 1 } } },
  { id: "hatch-stabilizer", category: "孵化", name: "孵化穩定器", description: "後續可提高高稀有孵化穩定性。", price: 90, currency: "diamonds", icon: "穩", rewards: { items: { "hatch-stabilizer": 1 } } },
  { id: "warm-stone", category: "孵化", name: "孵化保溫石", description: "降低孵化風險的保溫石。", price: 360, currency: "coins", icon: "石", rewards: { items: { "warm-stone": 1 } } },
  { id: "hatch-crystal", category: "孵化", name: "孵化能量晶", description: "立即增加孵化進度。", price: 110, currency: "diamonds", icon: "晶", rewards: { items: { "hatch-crystal": 1 } } },
  { id: "bag-expand", category: "實用", name: "背包擴充券", description: "後續可增加背包容量。", price: 100, currency: "diamonds", icon: "包", rewards: { items: { "bag-expand": 1 } } },
  { id: "dragon-slot-expand", category: "實用", name: "龍寵欄位擴充券", description: "後續可增加龍寵欄位。", price: 120, currency: "diamonds", icon: "欄", rewards: { items: { "dragon-slot-expand": 1 } } },
  { id: "rename-card", category: "實用", name: "改名卡", description: "後續可替龍或角色改名。", price: 240, currency: "coins", icon: "名", rewards: { items: { "rename-card": 1 } } },
  { id: "exp-potion", category: "實用", name: "經驗藥水", description: "提升養成效率的經驗道具。", price: 420, currency: "coins", icon: "EXP", rewards: { items: { "exp-potion": 1 } } },
  { id: "element-reset", category: "實用", name: "屬性重置石", description: "後續可重置寵物屬性。", price: 150, currency: "diamonds", icon: "屬", rewards: { items: { "element-reset": 1 } } },
  { id: "skill-reset", category: "實用", name: "技能重置卷", description: "後續可重置技能配置。", price: 130, currency: "diamonds", icon: "技", rewards: { items: { "skill-reset": 1 } } }
];
const equipmentShopProducts = [
  { id: "pet-helmet", category: "寵物裝備", name: "寵物頭盔", slot: "頭盔", price: 600, currency: "coins", icon: "盔", description: "給龍寵使用的基礎頭盔。" },
  { id: "pet-armor", category: "寵物裝備", name: "寵物胸甲", slot: "胸甲", price: 900, currency: "coins", icon: "甲", description: "提高龍寵防護感的胸甲。" },
  { id: "merc-head", category: "傭兵裝備", name: "傭兵頭飾", slot: "頭", price: 520, currency: "coins", icon: "頭", description: "傭兵角色頭部裝備。" },
  { id: "merc-body", category: "傭兵裝備", name: "冒險上衣", slot: "上身", price: 720, currency: "coins", icon: "衣", description: "傭兵角色上身裝備。" },
  { id: "merc-legs", category: "傭兵裝備", name: "旅行下裝", slot: "下身", price: 680, currency: "coins", icon: "褲", description: "傭兵角色下身裝備。" },
  { id: "merc-hands", category: "傭兵裝備", name: "守護手套", slot: "手", price: 460, currency: "coins", icon: "手", description: "傭兵角色手部裝備。" },
  { id: "merc-feet", category: "傭兵裝備", name: "浮島靴", slot: "腳", price: 560, currency: "coins", icon: "靴", description: "傭兵角色腳部裝備。" },
  { id: "merc-weapon", category: "傭兵裝備", name: "星鐵長劍", slot: "武器", price: 90, currency: "diamonds", icon: "劍", description: "傭兵主要武器。" },
  { id: "merc-subweapon", category: "傭兵裝備", name: "雲晶副手", slot: "副武器", price: 80, currency: "diamonds", icon: "副", description: "傭兵副武器。" }
];
const exploreRegions = [
  {
    id: "volcano",
    name: "火山",
    description: "熔岩島脈會產出火屬性龍蛋，偶爾能發現暗與光的稀有蛋。",
    icon: "火",
    visual: "assets/backgrounds/bg-fusion-shrine.png",
    elements: [
      { value: "火", weight: 82 },
      { value: "暗", weight: 9 },
      { value: "光", weight: 9 }
    ]
  },
  {
    id: "ocean",
    name: "海洋",
    description: "雲海潮汐以水屬性為主，深處也可能漂來暗與光的稀有蛋。",
    icon: "水",
    visual: "assets/backgrounds/bg-battle-skyland.png",
    elements: [
      { value: "水", weight: 82 },
      { value: "暗", weight: 9 },
      { value: "光", weight: 9 }
    ]
  },
  {
    id: "forest",
    name: "森林",
    description: "浮空森林以木與土屬性為主，是最適合尋找自然系龍蛋的區域。",
    icon: "森",
    visual: "assets/backgrounds/bg-home-dragon-island.png",
    elements: [
      { value: "木", weight: 45 },
      { value: "土", weight: 37 },
      { value: "暗", weight: 9 },
      { value: "光", weight: 9 }
    ]
  }
];
const exploreEggRates = [
  { value: "normal-egg", weight: 56 },
  { value: "rare-egg", weight: 28 },
  { value: "epic-egg", weight: 11 },
  { value: "legendary-egg", weight: 4 },
  { value: "dark-sss-egg", weight: 1 }
];
const mercenaryPool = [
  { name: "雲槍守衛", rarity: "C", element: "wind" },
  { name: "潮汐補師", rarity: "B", element: "water" },
  { name: "森弓獵人", rarity: "A", element: "grass" },
  { name: "暗月刺客", rarity: "S", element: "dark" },
  { name: "晨星聖騎", rarity: "SS", element: "light" },
  { name: "龍島賢者", rarity: "SSS", element: "light" }
];
const tabAreaNames = {
  home: "龍島主城 1-1",
  bag: "冒險背包",
  hatch: "孵蛋溫室 1-2",
  dragons: "龍寵花園 1-3",
  eggs: "龍蛋庫存",
  explore: "三島探索",
  guild: "冒險公會",
  stage: "天空關卡",
  itemShop: "道具商店",
  equipmentShop: "裝備商店",
  gacha: "星願抽卡",
  codex: "卡片圖鑑",
  fusion: "星火祭壇 2-1",
  pve: "天空巢穴 3-7",
  pk: "雲海競技場",
  market: "龍蛋商店"
};
const mimiTips = [
  "歡迎來到龍島！你的冒險從第一顆蛋開始。",
  "你的蛋快孵化了！走一走或等牠吸收雲海魔力吧。",
  "龍龍餓肚子時戰鬥力會下降，出門前記得餵食。",
  "兩隻同稀有度的龍可以合體，成功後會進化到下一階。",
  "天空巢穴有金幣、食物，偶爾還會掉落新的龍蛋。",
  "龍蛋商店只販售龍蛋，真正的夥伴都要靠你親手孵出來。"
];

const ASSETS = {
  backgrounds: {
    home: "assets/backgrounds/bg-home-dragon-island.png",
    battle: "assets/backgrounds/bg-battle-skyland.png",
    shop: "assets/backgrounds/bg-market-shop.png",
    fusion: "assets/backgrounds/bg-fusion-shrine.png",
    pk: "assets/backgrounds/bg-pk-arena.png"
  },
  islands: {
    rest: "assets/island/island-rest.png",
    hatch: "assets/island/island-hatch.png",
    nest: "assets/island/nest-temp.png"
  },
  characters: {
    mimiFull: "assets/characters/mimi-guide-full.png",
    mimiHead: "assets/characters/mimi-head.png",
    mimiAvatar: "assets/characters/mimi-avatar.png",
    mimiHappy: "assets/characters/mimi-emote-happy.png",
    mimiSurprised: "assets/characters/mimi-emote-surprised.png",
    mimiSad: "assets/characters/mimi-emote-sad.png"
  },
  dragons: {
    homeMain: "assets/dragons/dragon-home-main.png",
    restSleep: "assets/dragons/dragon-rest-sleep.png",
    restWalk1: "assets/dragons/dragon-rest-walk-1.png",
    restWalk2: "assets/dragons/dragon-rest-walk-2.png",
    restFly1: "assets/dragons/dragon-rest-fly-1.png",
    restFly2: "assets/dragons/dragon-rest-fly-2.png",
    c: "assets/dragons/dragon-rank-c.png",
    b: "assets/dragons/dragon-rank-b.png",
    a: "assets/dragons/dragon-rank-a.png",
    s: "assets/dragons/dragon-rank-s.png",
    ss: "assets/dragons/dragon-rank-ss.png",
    sss: "assets/dragons/dragon-rank-sss.png"
  },
  eggs: {
    common: "assets/eggs/egg-common.png",
    rare: "assets/eggs/egg-rare.png",
    epic: "assets/eggs/egg-epic.png",
    legendary: "assets/eggs/egg-legendary.png",
    darkSss: "assets/eggs/egg-dark-sss.png",
    crack01: "assets/eggs/egg-crack-01.png",
    crack02: "assets/eggs/egg-crack-02.png"
  },
  monsters: {
    fluffDark: "assets/monsters/monster-fluff-dark.png",
    slimePurple: "assets/monsters/monster-slime-purple.png",
    bossShadow: "assets/monsters/monster-boss-shadow.png",
    default: "assets/monsters/monster-1.png"
  },
  icons: {
    coin: "assets/icons/icon-coin.png",
    gem: "assets/icons/icon-gem.png",
    energy: "assets/icons/icon-energy.png",
    egg: "assets/icons/icon-egg.png",
    bag: "assets/icons/icon-bag.png",
    dragon: "assets/icons/icon-dragon.png",
    home: "assets/icons/icon-home.png",
    fusion: "assets/icons/icon-fusion.png",
    shop: "assets/icons/icon-shop.png",
    adventure: "assets/icons/icon-adventure.png",
    pk: "assets/icons/icon-pk.png",
    settings: "assets/icons/icon-settings.png",
    navHome: "assets/icons/nav-home.png",
    navDragonCave: "assets/icons/nav-dragon-cave.png",
    navEquipmentShop: "assets/icons/nav-shop-equipment.png",
    navItemShop: "assets/icons/nav-shop-items.png",
    navEggs: "assets/icons/nav-eggs.png",
    navExplore: "assets/icons/nav-explore.png",
    navGuild: "assets/icons/nav-guild.png",
    navStage: "assets/icons/nav-stage.png",
    navQuest: "assets/ui/nav-quest.png"
  },
  items: {
    meatSmall: "assets/items/item-meat-small.png",
    dragonFruit: "assets/items/item-fruit-dragon.png",
    premiumMeat: "assets/items/item-meat-premium.png",
    goldChest: "assets/items/item-chest-gold.png",
    shop: "assets/items/shop.png",
    ticketExplore: "assets/items/item-ticket-explore.png",
    ticketMercenary: "assets/items/item-ticket-mercenary.png",
    potion: "assets/items/item-potion.png",
    scroll: "assets/items/item-scroll.png",
    food: "assets/items/item-food.png",
    hatchTool: "assets/items/item-hatch-tool.png"
  },
  equipment: {
    helmet: "assets/equipment/equipment-helmet.png",
    armor: "assets/equipment/equipment-armor.png",
    weapon: "assets/equipment/equipment-weapon.png",
    boots: "assets/equipment/equipment-boots.png"
  },
  effects: {
    hatchGlow: "assets/effects/fx-hatch-glow.png",
    magicCircle: "assets/effects/fx-magic-circle.png",
    fusionBurst: "assets/effects/fx-fusion-burst.png",
    rarityFrame: "assets/effects/fx-rarity-frame.png",
    rainbowLegend: "assets/effects/fx-rainbow-legend.png",
    hitBurst: "assets/effects/fx-hit-burst.png"
  },
  cards: {
    characters: {
      flameKnight: "assets/cards/characters/char-flame-knight.png",
      tideMage: "assets/cards/characters/char-tide-mage.png",
      leafRanger: "assets/cards/characters/char-leaf-ranger.png",
      shadowPrincess: "assets/cards/characters/char-shadow-princess.png",
      lightOracle: "assets/cards/characters/char-light-oracle.png",
      starDragonlord: "assets/cards/characters/char-star-dragonlord.png"
    },
    characterThumbs: {
      flameKnight: "assets/cards/characters/thumb-char-flame-knight.png",
      tideMage: "assets/cards/characters/thumb-char-tide-mage.png",
      leafRanger: "assets/cards/characters/thumb-char-leaf-ranger.png",
      shadowPrincess: "assets/cards/characters/thumb-char-shadow-princess.png",
      lightOracle: "assets/cards/characters/thumb-char-light-oracle.png",
      starDragonlord: "assets/cards/characters/thumb-char-star-dragonlord.png"
    },
    pets: {
      fireWisp: "assets/cards/pets/pet-fire-wisp.png",
      aquaPuff: "assets/cards/pets/pet-aqua-puff.png",
      grassSprout: "assets/cards/pets/pet-grass-sprout.png",
      shadowCat: "assets/cards/pets/pet-shadow-cat.png",
      lightBunny: "assets/cards/pets/pet-light-bunny.png",
      abyssDrake: "assets/cards/pets/pet-abyss-drake.png"
    },
    petThumbs: {
      fireWisp: "assets/cards/pets/thumb-pet-fire-wisp.png",
      aquaPuff: "assets/cards/pets/thumb-pet-aqua-puff.png",
      grassSprout: "assets/cards/pets/thumb-pet-grass-sprout.png",
      shadowCat: "assets/cards/pets/thumb-pet-shadow-cat.png",
      lightBunny: "assets/cards/pets/thumb-pet-light-bunny.png",
      abyssDrake: "assets/cards/pets/thumb-pet-abyss-drake.png"
    },
    backgrounds: {
      gacha: "assets/cards/backgrounds/bg-gacha-card.png"
    },
    effects: {
      glow: "assets/cards/effects/fx-card-glow.png",
      sss: "assets/cards/effects/fx-card-sss.png"
    }
  },
  ui: {
    board: "assets/ui/ui-style-board.png",
    gachaButton: "assets/ui/gacha/gacha-button.png",
    dragonShadow: "assets/ui/dragon-shadow.png",
    dragonGlow: "assets/ui/dragon-glow.png",
    hatchSlotEmpty: "assets/ui/hatch-slot-empty.png",
    hatchSlotLocked: "assets/ui/hatch-slot-locked.png",
    hatchProgressBar: "assets/ui/hatch-progress-bar.png",
    iconLock: "assets/ui/icon-lock.png",
    iconPlus: "assets/ui/icon-plus.png",
    navHome: "assets/ui/nav-home.png",
    navDragonCave: "assets/ui/nav-dragon-cave.png",
    navGearShop: "assets/ui/nav-gear-shop.png",
    navItemShop: "assets/ui/nav-item-shop.png",
    navExplore: "assets/ui/nav-explore.png",
    navQuest: "assets/ui/nav-quest.png"
  },
  audio: {
    start: "assets/audio/start.mp3",
    intro: "assets/audio/intro.mp3",
    home: "assets/audio/home.mp3",
    battle: "assets/audio/battle.mp3",
    shop: "assets/audio/shop.mp3",
    fusion: "assets/audio/fusion.mp3"
  }
};

const assetSources = {
  bgHome: assetPathList(ASSETS.backgrounds.home, "bg-dragon-island.png"),
  bgBattle: assetPathList(ASSETS.backgrounds.battle),
  bgShop: assetPathList(ASSETS.backgrounds.shop),
  bgFusion: assetPathList(ASSETS.backgrounds.fusion),
  bgPk: assetPathList(ASSETS.backgrounds.pk),
  mimiGuide: assetPathList(ASSETS.characters.mimiFull, "mimi.png"),
  mimiHead: assetPathList(ASSETS.characters.mimiHead, ASSETS.characters.mimiAvatar, "mimi.png"),
  mimiAvatar: assetPathList(ASSETS.characters.mimiAvatar, "mimi.png"),
  mimiHappy: assetPathList(ASSETS.characters.mimiHappy, ASSETS.characters.mimiAvatar, "mimi.png"),
  mimiSurprised: assetPathList(ASSETS.characters.mimiSurprised, ASSETS.characters.mimiAvatar, "mimi.png"),
  mimiSad: assetPathList(ASSETS.characters.mimiSad, ASSETS.characters.mimiAvatar, "mimi.png"),
  eggCommon: assetPathList(ASSETS.eggs.common, "egg-normal.png"),
  eggRare: assetPathList(ASSETS.eggs.rare, ASSETS.eggs.common, "egg-normal.png"),
  eggEpic: assetPathList(ASSETS.eggs.epic, ASSETS.eggs.common, "egg-normal.png"),
  eggLegendary: assetPathList(ASSETS.eggs.legendary, ASSETS.eggs.common, "egg-normal.png"),
  eggDarkSSS: assetPathList(ASSETS.eggs.darkSss, ASSETS.eggs.common, "egg-normal.png"),
  eggCrack01: assetPathList(ASSETS.eggs.crack01, ASSETS.eggs.common, "egg-normal.png"),
  eggCrack02: assetPathList(ASSETS.eggs.crack02, ASSETS.eggs.common, "egg-normal.png"),
  dragonHomeMain: assetPathList(ASSETS.dragons.homeMain, ASSETS.dragons.sss, "dragon-sss.png"),
  dragonC: assetPathList(ASSETS.dragons.c, "dragon-c.png"),
  dragonB: assetPathList(ASSETS.dragons.b, "dragon-b.png"),
  dragonA: assetPathList(ASSETS.dragons.a, "dragon-a.png"),
  dragonS: assetPathList(ASSETS.dragons.s, "dragon-s.png"),
  dragonSS: assetPathList(ASSETS.dragons.ss, "dragon-ss.png"),
  dragonSSS: assetPathList(ASSETS.dragons.sss, "dragon-sss.png"),
  dragonRestSleep: assetPathList(ASSETS.dragons.restSleep, ASSETS.dragons.c, "dragon-c.png"),
  dragonRestWalk1: assetPathList(ASSETS.dragons.restWalk1, ASSETS.dragons.b, "dragon-b.png"),
  dragonRestWalk2: assetPathList(ASSETS.dragons.restWalk2, ASSETS.dragons.b, "dragon-b.png"),
  dragonRestFly1: assetPathList(ASSETS.dragons.restFly1, ASSETS.dragons.s, "dragon-s.png"),
  dragonRestFly2: assetPathList(ASSETS.dragons.restFly2, ASSETS.dragons.s, "dragon-s.png"),
  monster: assetPathList(ASSETS.monsters.default, ASSETS.monsters.fluffDark, "monster-1.png"),
  monsterFluffDark: assetPathList(ASSETS.monsters.fluffDark, ASSETS.monsters.default),
  monsterSlimePurple: assetPathList(ASSETS.monsters.slimePurple, ASSETS.monsters.default),
  monsterBossShadow: assetPathList(ASSETS.monsters.bossShadow, ASSETS.monsters.default),
  shop: assetPathList(ASSETS.items.shop, ASSETS.icons.shop, "shop.png"),
  magicCircle: assetPathList(ASSETS.effects.magicCircle, "magic-circle.png"),
  uiBoard: assetPathList(ASSETS.ui.board),
  gachaCardBg: assetPathList(ASSETS.cards.backgrounds.gacha),
  cardGlow: assetPathList(ASSETS.cards.effects.glow),
  cardSssGlow: assetPathList(ASSETS.cards.effects.sss),
  gachaButton: assetPathList(ASSETS.ui.gachaButton),
  dragonShadow: assetPathList(ASSETS.ui.dragonShadow),
  dragonGlow: assetPathList(ASSETS.ui.dragonGlow),
  navHome: assetPathList(ASSETS.ui.navHome, ASSETS.icons.navHome, ASSETS.icons.home),
  navDragonCave: assetPathList(ASSETS.ui.navDragonCave, ASSETS.icons.navDragonCave, ASSETS.icons.navEggs, ASSETS.icons.egg),
  navEquipmentShop: assetPathList(ASSETS.ui.navGearShop, ASSETS.icons.navEquipmentShop, ASSETS.icons.shop),
  navItemShop: assetPathList(ASSETS.ui.navItemShop, ASSETS.icons.navItemShop, ASSETS.icons.bag),
  navEggs: assetPathList(ASSETS.icons.navEggs, ASSETS.icons.egg),
  navExplore: assetPathList(ASSETS.ui.navExplore, ASSETS.icons.navExplore, ASSETS.icons.adventure),
  navGuild: assetPathList(ASSETS.icons.navGuild, ASSETS.icons.dragon),
  navStage: assetPathList(ASSETS.icons.navStage, ASSETS.icons.pk),
  navQuest: assetPathList(ASSETS.ui.navQuest, ASSETS.icons.navQuest, ASSETS.icons.egg)
};

const characterCardCatalog = [
  {
    id: "char_flame_knight",
    name: "焰心騎士",
    rarity: "C",
    element: "fire",
    image: ASSETS.cards.characters.flameKnight,
    thumbnail: ASSETS.cards.characterThumbs.flameKnight,
    description: "來自熔岩小徑的見習騎士，擅長用熱情鼓舞龍夥伴。",
    skillName: "小火花斬",
    skillDescription: "對敵人造成火屬性傷害，並小幅提升下一次攻擊。"
  },
  {
    id: "char_tide_mage",
    name: "潮汐法師",
    rarity: "B",
    element: "water",
    image: ASSETS.cards.characters.tideMage,
    thumbnail: ASSETS.cards.characterThumbs.tideMage,
    description: "能聽懂雲海潮聲的法師，旅行時會替龍蛋保持濕潤。",
    skillName: "泡沫護盾",
    skillDescription: "生成水盾，減少下一回合受到的傷害。"
  },
  {
    id: "char_leaf_ranger",
    name: "森芽遊俠",
    rarity: "A",
    element: "grass",
    image: ASSETS.cards.characters.leafRanger,
    thumbnail: ASSETS.cards.characterThumbs.leafRanger,
    description: "在浮空森林長大的遊俠，熟悉所有龍島捷徑。",
    skillName: "藤蔓連射",
    skillDescription: "連續攻擊敵人，並有機會提高戰鬥獎勵。"
  },
  {
    id: "char_shadow_princess",
    name: "夜影公主",
    rarity: "S",
    element: "dark",
    image: ASSETS.cards.characters.shadowPrincess,
    thumbnail: ASSETS.cards.characterThumbs.shadowPrincess,
    description: "守護暗月祭壇的神秘少女，能安撫暗黑屬性的龍。",
    skillName: "暗月指令",
    skillDescription: "提升暗屬性夥伴的攻擊，並削弱敵方防禦。"
  },
  {
    id: "char_light_oracle",
    name: "晨光神諭",
    rarity: "SS",
    element: "light",
    image: ASSETS.cards.characters.lightOracle,
    thumbnail: ASSETS.cards.characterThumbs.lightOracle,
    description: "傳說能讀懂星光路線的神諭者，會指引龍島冒險方向。",
    skillName: "星晨祝福",
    skillDescription: "恢復隊伍狀態，並提高孵蛋與戰鬥的幸運感。"
  },
  {
    id: "char_star_dragonlord",
    name: "星翼龍使",
    rarity: "SSS",
    element: "light",
    image: ASSETS.cards.characters.starDragonlord,
    thumbnail: ASSETS.cards.characterThumbs.starDragonlord,
    description: "能與神龍並肩飛越星海的傳說龍使，是收藏家的夢幻夥伴。",
    skillName: "星翼召喚",
    skillDescription: "召喚星翼光陣，讓全隊爆發出傳說級力量。"
  }
];

const petCardCatalog = [
  {
    id: "pet_fire_wisp",
    name: "火花靈",
    rarity: "C",
    element: "fire",
    image: ASSETS.cards.pets.fireWisp,
    thumbnail: ASSETS.cards.petThumbs.fireWisp,
    description: "會在口袋裡發熱的小火靈，適合陪新手旅行。"
  },
  {
    id: "pet_aqua_puff",
    name: "水泡泡",
    rarity: "B",
    element: "water",
    image: ASSETS.cards.pets.aquaPuff,
    thumbnail: ASSETS.cards.petThumbs.aquaPuff,
    description: "漂浮在雲海上的水泡精靈，喜歡追著龍蛋轉圈。"
  },
  {
    id: "pet_grass_sprout",
    name: "芽芽獸",
    rarity: "A",
    element: "grass",
    image: ASSETS.cards.pets.grassSprout,
    thumbnail: ASSETS.cards.petThumbs.grassSprout,
    description: "背上長著幸運嫩芽的小寵物，能找到隱藏小路。"
  },
  {
    id: "pet_shadow_cat",
    name: "影尾貓",
    rarity: "S",
    element: "dark",
    image: ASSETS.cards.pets.shadowCat,
    thumbnail: ASSETS.cards.petThumbs.shadowCat,
    description: "只在黃昏出現的影尾貓，會守著深淵蛋打盹。"
  },
  {
    id: "pet_light_bunny",
    name: "星耳兔",
    rarity: "SS",
    element: "light",
    image: ASSETS.cards.pets.lightBunny,
    thumbnail: ASSETS.cards.petThumbs.lightBunny,
    description: "耳朵會發出星光的兔兔，能照亮雲海夜路。"
  },
  {
    id: "pet_abyss_drake",
    name: "深淵幼龍",
    rarity: "SSS",
    element: "dark",
    image: ASSETS.cards.pets.abyssDrake,
    thumbnail: ASSETS.cards.petThumbs.abyssDrake,
    description: "傳說從混沌蛋旁誕生的幼龍，力量還在慢慢甦醒。"
  }
];

const HATCH_EGG_DEFINITIONS = {
  "normal-egg": {
    type: "normal-egg",
    name: "普通龍蛋",
    rarity: "C",
    elementBias: "random",
    hatchDuration: 60,
    image: "assets/eggs/egg-common.png",
    rarityRates: [
      { rarity: "C", rate: 70 },
      { rarity: "B", rate: 25 },
      { rarity: "A", rate: 5 }
    ]
  },
  "rare-egg": {
    type: "rare-egg",
    name: "稀有龍蛋",
    rarity: "B",
    elementBias: "random",
    hatchDuration: 120,
    image: "assets/eggs/egg-rare.png",
    rarityRates: [
      { rarity: "B", rate: 60 },
      { rarity: "A", rate: 30 },
      { rarity: "S", rate: 10 }
    ]
  },
  "epic-egg": {
    type: "epic-egg",
    name: "史詩龍蛋",
    rarity: "A",
    elementBias: "random",
    hatchDuration: 180,
    image: "assets/eggs/egg-epic.png",
    rarityRates: [
      { rarity: "A", rate: 60 },
      { rarity: "S", rate: 30 },
      { rarity: "SS", rate: 10 }
    ]
  },
  "legendary-egg": {
    type: "legendary-egg",
    name: "傳說龍蛋",
    rarity: "S",
    elementBias: "random",
    hatchDuration: 240,
    image: "assets/eggs/egg-legendary.png",
    rarityRates: [
      { rarity: "S", rate: 60 },
      { rarity: "SS", rate: 30 },
      { rarity: "SSS", rate: 10 }
    ]
  },
  "dark-sss-egg": {
    type: "dark-sss-egg",
    name: "深淵混沌蛋",
    rarity: "SSS",
    elementBias: "暗",
    hatchDuration: 300,
    image: "assets/eggs/egg-dark-sss.png",
    rarityRates: [
      { rarity: "S", rate: 50 },
      { rarity: "SS", rate: 35 },
      { rarity: "SSS", rate: 15 }
    ]
  }
};

let state = loadGame();
let activeTab = "home";
let activeShopTab = "coin";
let toastTimer;
let loginMessageTimer;
let mimiTipIndex = 0;
let gameHasStarted = false;
let startGameTransitioning = false;
let audioManager;
let eggSelectionSlotId = null;
let hatchTimerId = null;
let currentWorldPage = 0;
let lastWorldScrollDebugAt = 0;
let lastWorldScrollDebugPage = -1;
const homeV2Drag = {
  active: false,
  target: null,
  pointerId: null,
  startX: 0,
  scrollLeft: 0,
  startPage: 0,
  dragOffset: 0,
  moved: false
};

const els = {
  startScreen: document.querySelector("#startScreen"),
  loginScreen: document.querySelector("#loginScreen"),
  startGameButton: document.querySelector("#startGameButton"),
  loginStartGameButton: document.querySelector("#loginStartGameButton"),
  loginMessage: document.querySelector("#loginMessage"),
  playerPanel: document.querySelector("#playerPanel"),
  resetGameButton: document.querySelector("#resetGameButton"),
  resourceHud: document.querySelector("#resourceHud"),
  hatchMiniProgress: document.querySelector("#hatchMiniProgress"),
  hatchMiniBar: document.querySelector("#hatchMiniBar"),
  areaName: document.querySelector("#areaName"),
  questTracker: document.querySelector("#questTracker"),
  heroDragonStage: document.querySelector("#heroDragonStage"),
  homeCardShowcase: document.querySelector("#homeCardShowcase"),
  mimiButton: document.querySelector("#mimiButton"),
  mimiBubble: document.querySelector("#mimiBubble"),
  walkButton: document.querySelector("#walkButton"),
  legacyWalkButton: document.querySelector("#legacyWalkButton"),
  eggList: document.querySelector("#eggList"),
  eggInventoryList: document.querySelector("#eggInventoryList"),
  exploreTicketCount: document.querySelector("#exploreTicketCount"),
  exploreList: document.querySelector("#exploreList"),
  exploreResult: document.querySelector("#exploreResult"),
  itemShopList: document.querySelector("#itemShopList"),
  itemShopResult: document.querySelector("#itemShopResult"),
  equipmentShopList: document.querySelector("#equipmentShopList"),
  equipmentShopResult: document.querySelector("#equipmentShopResult"),
  mercenaryTicketCount: document.querySelector("#mercenaryTicketCount"),
  guildList: document.querySelector("#guildList"),
  guildResult: document.querySelector("#guildResult"),
  stageList: document.querySelector("#stageList"),
  stageResult: document.querySelector("#stageResult"),
  bagList: document.querySelector("#bagList"),
  foodPouch: document.querySelector("#foodPouch"),
  dragonList: document.querySelector("#dragonList"),
  fusionMainSelect: document.querySelector("#fusionMainSelect"),
  fusionSubSelect: document.querySelector("#fusionSubSelect"),
  fusionPreview: document.querySelector("#fusionPreview"),
  fusionButton: document.querySelector("#fusionButton"),
  fusionResult: document.querySelector("#fusionResult"),
  pveDragonSelect: document.querySelector("#pveDragonSelect"),
  pveBattleButton: document.querySelector("#pveBattleButton"),
  pveResult: document.querySelector("#pveResult"),
  pkDragonSelect: document.querySelector("#pkDragonSelect"),
  pkBattleButton: document.querySelector("#pkBattleButton"),
  pkResult: document.querySelector("#pkResult"),
  rankScore: document.querySelector("#rankScore"),
  refreshMarketButton: document.querySelector("#refreshMarketButton"),
  marketList: document.querySelector("#marketList"),
  marketResult: document.querySelector("#marketResult"),
  shopTabButtons: document.querySelectorAll("[data-shop-tab]"),
  gachaCoinButton: document.querySelector("#gachaCoinButton"),
  gachaDiamondButton: document.querySelector("#gachaDiamondButton"),
  gachaResult: document.querySelector("#gachaResult"),
  cardFragmentCount: document.querySelector("#cardFragmentCount"),
  codexFilter: document.querySelector("#codexFilter"),
  codexList: document.querySelector("#codexList"),
  codexDetail: document.querySelector("#codexDetail"),
  musicMuteButton: document.querySelector("#musicMuteButton"),
  musicVolume: document.querySelector("#musicVolume"),
  musicVolumeValue: document.querySelector("#musicVolumeValue"),
  musicStatus: document.querySelector("#musicStatus"),
  debugToggle: document.querySelector("#debugToggle"),
  debugPanel: document.querySelector("#debugPanel"),
  debugOutput: document.querySelector("#debugOutput"),
  debugRaritySelect: document.querySelector("#debugRaritySelect"),
  homeV2Root: document.querySelector("#homeV2Root"),
  toastLayer: document.querySelector("#toastLayer"),
  toast: document.querySelector("#toast")
};

window.markAssetLoaded = markAssetLoaded;
window.tryNextAsset = tryNextAsset;

class AudioManager {
  constructor(tracks, fallbackTrack = "intro", fallbackMap = {}) {
    this.tracks = tracks;
    this.fallbackTrack = fallbackTrack;
    this.fallbackMap = fallbackMap;
    this.currentTrack = null;
    this.requestedTrack = null;
    this.pendingTrack = null;
    this.hasUserGesture = false;
    this.volume = 0.6;
    this.isMuted = false;
    this.fadeDuration = 1000;
    this.fadeTimer = null;
    this.fadeResolve = null;
    this.switchToken = 0;
    this.failedTracks = new Set();
    this.onChange = () => {};
    this.audio = new Audio();
    this.audio.loop = true;
    this.audio.preload = "auto";
    this.audio.addEventListener("error", () => this.handleTrackError(this.currentTrack));
    this.loadSettings();
    this.applyVolume(0);
  }

  loadSettings() {
    try {
      const saved = JSON.parse(localStorage.getItem(AUDIO_STORAGE_KEY) || "{}");
      this.volume = clamp(Number(saved.volume), 0, 1);
      if (!Number.isFinite(this.volume)) this.volume = 0.6;
      this.isMuted = Boolean(saved.isMuted);
    } catch (error) {
      this.volume = 0.6;
      this.isMuted = false;
    }
  }

  saveSettings() {
    localStorage.setItem(AUDIO_STORAGE_KEY, JSON.stringify({
      volume: this.volume,
      isMuted: this.isMuted
    }));
  }

  playMusic(trackName) {
    return this.switchMusic(trackName);
  }

  prepareMusic(trackName) {
    this.requestedTrack = this.tracks[trackName] ? trackName : this.fallbackTrack;
    this.pendingTrack = this.requestedTrack;
    this.emitChange();
  }

  unlockPlayback(trackName = this.pendingTrack || this.requestedTrack || this.fallbackTrack) {
    this.hasUserGesture = true;
    const targetTrack = this.tracks[trackName] ? trackName : (this.pendingTrack || this.fallbackTrack);
    if (targetTrack) {
      return this.switchMusic(targetTrack);
    }
    return Promise.resolve();
  }

  async stopMusic(options = {}) {
    this.switchToken += 1;
    if (!options.immediate) {
      await this.fadeOut();
    } else {
      this.clearFade();
    }
    this.audio.pause();
    this.audio.removeAttribute("src");
    this.currentTrack = null;
    this.emitChange();
  }

  async switchMusic(trackName) {
    this.requestedTrack = this.tracks[trackName] ? trackName : this.fallbackTrack;
    if (!this.hasUserGesture) {
      this.pendingTrack = this.requestedTrack;
      this.emitChange();
      return;
    }

    const targetTrack = this.resolveTrack(trackName);
    if (!targetTrack) return;
    if (targetTrack === this.currentTrack && !this.audio.paused) {
      this.applyVolume(this.targetVolume());
      return;
    }

    const token = ++this.switchToken;
    await this.fadeOut();
    if (token !== this.switchToken) return;

    this.audio.pause();
    this.audio.loop = true;
    this.audio.src = this.tracks[targetTrack];
    this.audio.currentTime = 0;
    this.currentTrack = targetTrack;
    this.pendingTrack = null;
    this.emitChange();
    this.applyVolume(0);

    try {
      await this.audio.play();
      if (token !== this.switchToken) return;
      await this.fadeIn();
    } catch (error) {
      if (token !== this.switchToken) return;
      if (this.isPlaybackBlocked(error)) {
        this.pendingTrack = targetTrack;
        this.emitChange();
        return;
      }
      this.handleTrackError(targetTrack);
    }
  }

  fadeOut(duration = this.fadeDuration) {
    return this.animateVolume(this.audio.volume, 0, duration);
  }

  fadeIn(duration = this.fadeDuration) {
    return this.animateVolume(this.audio.volume, this.targetVolume(), duration);
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    this.applyVolume(this.targetVolume());
    this.saveSettings();
    this.emitChange();
    return this.isMuted;
  }

  setVolume(value) {
    this.volume = clamp(Number(value), 0, 1);
    if (!Number.isFinite(this.volume)) this.volume = 0.6;
    this.applyVolume(this.targetVolume());
    this.saveSettings();
    this.emitChange();
  }

  resolveTrack(trackName) {
    const requestedTrack = this.tracks[trackName] ? trackName : this.fallbackTrack;
    const fallbackChain = [
      requestedTrack,
      ...(this.fallbackMap[requestedTrack] || []),
      this.fallbackTrack
    ];
    const candidates = [...new Set(fallbackChain)];
    const availableTrack = candidates.find((track) => this.tracks[track] && !this.failedTracks.has(track));
    if (availableTrack) return availableTrack;
    return null;
  }

  handleTrackError(trackName) {
    if (!trackName) return;
    this.failedTracks.add(trackName);
    const nextTrack = this.resolveTrack(this.requestedTrack || this.fallbackTrack);
    if (nextTrack) {
      this.switchMusic(this.requestedTrack || nextTrack);
      return;
    }
    this.stopMusic({ immediate: true });
  }

  isPlaybackBlocked(error) {
    return error?.name === "NotAllowedError";
  }

  targetVolume() {
    return this.isMuted ? 0 : this.volume;
  }

  applyVolume(value) {
    this.audio.volume = clamp(Number(value) || 0, 0, 1);
  }

  emitChange() {
    this.onChange();
  }

  animateVolume(from, to, duration) {
    this.clearFade();
    if (duration <= 0 || Math.abs(from - to) < 0.01) {
      this.applyVolume(to);
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      const startedAt = performance.now();
      this.fadeResolve = resolve;
      this.fadeTimer = window.setInterval(() => {
        const progress = clamp((performance.now() - startedAt) / duration, 0, 1);
        this.applyVolume(from + (to - from) * progress);
        if (progress >= 1) {
          this.clearFade();
        }
      }, 40);
    });
  }

  clearFade() {
    if (this.fadeTimer) {
      window.clearInterval(this.fadeTimer);
      this.fadeTimer = null;
    }
    if (this.fadeResolve) {
      const resolve = this.fadeResolve;
      this.fadeResolve = null;
      resolve();
    }
  }
}

initialize();

function initialize() {
  ensureValidState();
  audioManager = new AudioManager(MUSIC_TRACKS, "start", MUSIC_FALLBACKS);
  audioManager.onChange = renderAudioControls;
  audioManager.switchMusic("start");
  renderStaticAssets();
  attachEvents();
  attachAudioUnlockEvents();
  registerServiceWorker();
  render();
  renderAudioControls();
  window.setInterval(() => {
    renderHatchMini();
    renderQuestTracker();
    if (activeTab === "home") renderHomeScene();
    if (activeTab === "eggs") renderEggInventory();
    if (activeTab === "hatch") renderEggs();
  }, 5000);
  startHatchTimer();
}

function attachAudioUnlockEvents() {
  const unlock = () => {
    if (!audioManager || audioManager.hasUserGesture) return;
    audioManager.unlockPlayback();
  };
  ["pointerdown", "touchstart", "keydown"].forEach((eventName) => {
    document.addEventListener(eventName, unlock, { once: true, passive: true });
  });
}

function startHatchTimer() {
  if (hatchTimerId) return;
  console.log("[startHatchTimer]");
  hatchTimerId = window.setInterval(() => {
    updateHatchSlots();
  }, 1000);
}

function attachEvents() {
  document.addEventListener("click", (event) => {
    const navButton = event.target.closest(".nav-button[data-tab]");
    if (navButton) {
      switchTab(navButton.dataset.tab);
      return;
    }

    const legacyTabButton = event.target.closest(".tab-button[data-tab]");
    if (legacyTabButton) {
      switchTab(legacyTabButton.dataset.tab);
      return;
    }

    const quickButton = event.target.closest(".quick-tab-button[data-tab-target]");
    if (quickButton) {
      switchTab(quickButton.dataset.tabTarget);
      return;
    }

    const loginAction = event.target.closest("[data-login-action]");
    if (loginAction) {
      handleLoginAction(loginAction.dataset.loginAction);
      return;
    }

    const resourcePlus = event.target.closest("[data-resource-plus]");
    if (resourcePlus) {
      showToast("第一版先不開放購買資源，之後可以接任務或商店。");
    }
  });

  els.startGameButton.addEventListener("click", startGame);
  if (els.loginStartGameButton) els.loginStartGameButton.addEventListener("click", startGame);
  els.resetGameButton.addEventListener("click", toggleDebugPanel);
  if (els.walkButton) els.walkButton.addEventListener("click", addStepsToEggs);
  if (els.legacyWalkButton) els.legacyWalkButton.addEventListener("click", addStepsToEggs);
  els.heroDragonStage.addEventListener("click", handleHomeDragonClick);
  els.eggList.addEventListener("click", handleEggClick);
  if (els.eggInventoryList) els.eggInventoryList.addEventListener("click", handleEggInventoryClick);
  if (els.exploreList) els.exploreList.addEventListener("click", handleExploreClick);
  if (els.itemShopList) els.itemShopList.addEventListener("click", handleNewShopClick);
  if (els.equipmentShopList) els.equipmentShopList.addEventListener("click", handleNewShopClick);
  if (els.guildList) els.guildList.addEventListener("click", handleGuildClick);
  if (els.stageList) els.stageList.addEventListener("click", handleStageClick);
  els.dragonList.addEventListener("click", handleDragonCardClick);
  els.fusionMainSelect.addEventListener("change", renderFusionPreview);
  els.fusionSubSelect.addEventListener("change", renderFusionPreview);
  els.fusionButton.addEventListener("click", fuseDragons);
  els.pveBattleButton.addEventListener("click", runPveBattle);
  els.pkBattleButton.addEventListener("click", runPkBattle);
  els.refreshMarketButton.addEventListener("click", refreshMarket);
  els.marketList.addEventListener("click", handleMarketClick);
  els.shopTabButtons.forEach((button) => {
    button.addEventListener("click", () => switchShopTab(button.dataset.shopTab));
  });
  if (els.gachaCoinButton) els.gachaCoinButton.addEventListener("click", () => drawGacha("coins"));
  if (els.gachaDiamondButton) els.gachaDiamondButton.addEventListener("click", () => drawGacha("diamonds"));
  if (els.codexFilter) els.codexFilter.addEventListener("change", renderCodex);
  if (els.codexList) els.codexList.addEventListener("click", handleCodexClick);
  if (els.codexDetail) els.codexDetail.addEventListener("click", handleCodexClick);
  els.mimiButton.addEventListener("click", cycleMimiTip);
  els.musicMuteButton.addEventListener("click", () => {
    audioManager.toggleMute();
    renderAudioControls();
    showToast(audioManager.isMuted ? "音樂已靜音。" : "音樂已恢復。");
  });
  els.musicVolume.addEventListener("input", () => {
    audioManager.setVolume(Number(els.musicVolume.value) / 100);
    renderAudioControls();
  });
  els.debugToggle.addEventListener("click", toggleDebugPanel);
  els.debugPanel.addEventListener("click", handleDebugAction);
  if (els.homeV2Root) {
    els.homeV2Root.addEventListener("click", handleHomeV2Click);
    els.homeV2Root.addEventListener("scroll", handleHomeV2Scroll, true);
    els.homeV2Root.addEventListener("pointerdown", handleHomeV2PointerDown);
    els.homeV2Root.addEventListener("pointermove", handleHomeV2PointerMove);
    els.homeV2Root.addEventListener("pointerup", handleHomeV2PointerEnd);
    els.homeV2Root.addEventListener("pointercancel", handleHomeV2PointerEnd);
    els.homeV2Root.addEventListener("mousedown", handleHomeV2MouseDown);
    window.addEventListener("mousemove", handleHomeV2MouseMove);
    window.addEventListener("mouseup", handleHomeV2MouseEnd);
    els.homeV2Root.addEventListener("touchstart", handleHomeV2TouchStart, { passive: true });
    els.homeV2Root.addEventListener("touchmove", handleHomeV2TouchMove, { passive: false });
    els.homeV2Root.addEventListener("touchend", handleHomeV2TouchEnd);
    els.homeV2Root.addEventListener("touchcancel", handleHomeV2TouchEnd);
    els.homeV2Root.addEventListener("wheel", handleHomeV2Wheel, { passive: false });
  }
}

function loadGame() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return createNewState();

  try {
    return JSON.parse(raw);
  } catch (error) {
    console.warn("讀取存檔失敗，已建立新遊戲。", error);
    return createNewState();
  }
}

function createNewState() {
  const starterEggs = createStarterEggInventory();
  const starterHatchSlots = createDefaultHatchSlots();
  // 初始玩家資料：第一版不用登入，全部進度都保存在 localStorage。
  return {
    playerName: "小龍騎士",
    coins: 300,
    diamonds: 80,
    stamina: 120,
    maxStamina: 120,
    foods: { jerky: 3, fruit: 1, steak: 0 },
    inventory: {
      items: {},
      equipment: [],
      ticketsExplore: 3,
      ticketsMercenary: 2
    },
    homeIsland: { restDragons: [] },
    hatchIsland: { hatchSlots: starterHatchSlots },
    hatchSlots: starterHatchSlots,
    eggInventory: starterEggs,
    eggs: starterEggs,
    dragons: [],
    characterCards: initializeCardCollection(characterCardCatalog, ["char_flame_knight"], "char_flame_knight"),
    petCards: initializeCardCollection(petCardCatalog, ["pet_fire_wisp"], "pet_fire_wisp"),
    selectedCharacterId: "char_flame_knight",
    selectedPetId: "pet_fire_wisp",
    cardFragments: 0,
    lastGachaResult: null,
    market: generateShopEggs(),
    activeDragonId: null,
    pkScore: 1000,
    totalHatched: 0,
    highestRarity: "-"
  };
}

function ensureValidState() {
  const defaults = createNewState();
  state = { ...defaults, ...state };
  state.playerName = String(state.playerName || defaults.playerName);
  state.coins = normalizedNonNegative(state.coins, 0);
  state.diamonds = normalizedNonNegative(state.diamonds, defaults.diamonds);
  state.maxStamina = positiveNumber(state.maxStamina, defaults.maxStamina);
  state.stamina = clamp(normalizedNonNegative(state.stamina, defaults.stamina), 0, state.maxStamina);
  state.foods = { ...defaults.foods, ...state.foods };
  const savedEggInventory = Array.isArray(state.eggInventory) ? state.eggInventory : state.eggs;
  state.eggInventory = Array.isArray(savedEggInventory)
    ? savedEggInventory.map(normalizeInventoryEgg)
    : createStarterEggInventory();
  state.eggs = state.eggInventory;
  state.dragons = Array.isArray(state.dragons) ? state.dragons.map(normalizeDragon) : [];
  state.inventory = normalizeInventory(state.inventory, defaults.inventory);
  state.hatchIsland = normalizeHatchIsland(state.hatchIsland || { hatchSlots: state.hatchSlots }, defaults.hatchIsland);
  state.hatchSlots = state.hatchIsland.hatchSlots;
  updateHatchSlots({ render: false, save: false });
  state.homeIsland = normalizeHomeIsland(state.homeIsland, state.dragons);
  state.characterCards = normalizeCardCollection(
    state.characterCards,
    characterCardCatalog,
    ["char_flame_knight"],
    state.selectedCharacterId || defaults.selectedCharacterId
  );
  state.petCards = normalizeCardCollection(
    state.petCards,
    petCardCatalog,
    ["pet_fire_wisp"],
    state.selectedPetId || defaults.selectedPetId
  );
  state.selectedCharacterId = ensureSelectedCardId(state.characterCards, state.selectedCharacterId);
  state.selectedPetId = ensureSelectedCardId(state.petCards, state.selectedPetId);
  state.characterCards = state.characterCards.map((card) => ({ ...card, selected: card.id === state.selectedCharacterId }));
  state.petCards = state.petCards.map((card) => ({ ...card, selected: card.id === state.selectedPetId }));
  state.cardFragments = normalizedNonNegative(state.cardFragments, defaults.cardFragments);
  state.lastGachaResult = state.lastGachaResult && typeof state.lastGachaResult === "object" ? state.lastGachaResult : null;
  state.market = generateShopEggs();
  state.pkScore = normalizedNonNegative(state.pkScore, defaults.pkScore);
  state.totalHatched = normalizedNonNegative(state.totalHatched, state.dragons.length);

  if (!state.activeDragonId && state.dragons.length > 0) {
    state.activeDragonId = state.dragons[0].id;
  }
  if (state.activeDragonId && !state.dragons.some((dragon) => dragon.id === state.activeDragonId)) {
    state.activeDragonId = state.dragons[0]?.id ?? null;
  }

  if (!rarities.includes(state.highestRarity)) {
    state.highestRarity = getHighestRarityFromCollection();
  }

  saveGame();
}

function normalizeDragon(dragon) {
  const rarity = rarities.includes(dragon?.rarity) ? dragon.rarity : "C";
  const element = elements.includes(dragon?.element) ? dragon.element : randomItem(elements);
  const fallback = createDragon(rarity, element);

  return {
    ...fallback,
    ...dragon,
    id: dragon?.id || fallback.id,
    name: String(dragon?.name || fallback.name),
    rarity,
    element,
    hp: positiveNumber(dragon?.hp, fallback.hp),
    attack: positiveNumber(dragon?.attack, fallback.attack),
    defense: positiveNumber(dragon?.defense, fallback.defense),
    speed: positiveNumber(dragon?.speed, fallback.speed),
    level: positiveNumber(dragon?.level, 1),
    hunger: clamp(positiveNumber(dragon?.hunger, 80), 0, 100),
    exp: Math.max(0, Number(dragon?.exp) || 0)
  };
}

function normalizeEgg(egg) {
  const type = eggTypes[egg?.type] ? egg.type : defaultEggType;
  const eggType = eggTypes[type];
  const fallback = createEgg(type);
  const steps = Math.max(0, Number(egg?.steps ?? egg?.hatchProgress) || 0);
  const requiredSteps = positiveNumber(egg?.requiredSteps, eggType.requiredSteps);
  return {
    id: egg?.id || fallback.id,
    name: String(egg?.name || eggType.name),
    type,
    eggRarity: rarities.includes(egg?.eggRarity) ? egg.eggRarity : eggRarityFromType(type),
    rarityPool: Array.isArray(egg?.rarityPool) && egg.rarityPool.length > 0 ? egg.rarityPool : [...eggType.rarityPool],
    rarityRates: Array.isArray(egg?.rarityRates) && egg.rarityRates.length > 0 ? egg.rarityRates : eggType.rarityRates.map((item) => ({ ...item })),
    elementBias: elements.includes(egg?.elementBias) ? egg.elementBias : eggType.elementBias,
    hatchProgress: clamp(Math.round((steps / requiredSteps) * 100), 0, 100),
    steps,
    requiredSteps,
    image: String(egg?.image || eggType.image),
    createdAt: positiveNumber(egg?.createdAt, Date.now()),
    assignedAt: egg?.assignedAt ? positiveNumber(egg.assignedAt, Date.now()) : null,
    requiredMs: positiveNumber(egg?.requiredMs, eggType.requiredMs || fallback.requiredMs)
  };
}

function createStarterEggInventory() {
  return [
    createInventoryEgg("normal-egg"),
    createInventoryEgg("dark-sss-egg")
  ];
}

function createInventoryEgg(type = "normal-egg") {
  const definition = HATCH_EGG_DEFINITIONS[type] || HATCH_EGG_DEFINITIONS["normal-egg"];
  return {
    id: createId("egg"),
    type: definition.type,
    name: definition.name,
    rarity: definition.rarity,
    eggRarity: definition.rarity,
    elementBias: definition.elementBias,
    hatchDuration: definition.hatchDuration,
    image: definition.image,
    createdAt: Date.now()
  };
}

function normalizeInventoryEgg(egg) {
  const type = HATCH_EGG_DEFINITIONS[egg?.type]
    ? egg.type
    : inferInventoryEggType(egg);
  const definition = HATCH_EGG_DEFINITIONS[type] || HATCH_EGG_DEFINITIONS["normal-egg"];
  const durationFromMs = Math.ceil(Number(egg?.requiredMs || egg?.remainingTime || 0) / 1000);
  return {
    id: egg?.id || createId("egg"),
    type: definition.type,
    name: String(egg?.name || definition.name),
    rarity: rarities.includes(egg?.rarity) ? egg.rarity : (rarities.includes(egg?.eggRarity) ? egg.eggRarity : definition.rarity),
    eggRarity: rarities.includes(egg?.eggRarity) ? egg.eggRarity : definition.rarity,
    elementBias: egg?.elementBias || definition.elementBias,
    hatchDuration: positiveNumber(egg?.hatchDuration, durationFromMs || definition.hatchDuration),
    image: String(egg?.image || definition.image),
    createdAt: positiveNumber(egg?.createdAt, Date.now())
  };
}

function inferInventoryEggType(egg) {
  const name = String(egg?.name || "");
  if (name.includes("深淵") || name.includes("混沌") || egg?.type === "dark-sss-egg") return "dark-sss-egg";
  if (name.includes("傳說") || egg?.type === "legendary-egg") return "legendary-egg";
  if (name.includes("史詩") || egg?.type === "epic-egg") return "epic-egg";
  if (name.includes("稀有") || egg?.type === "rare-egg") return "rare-egg";
  return "normal-egg";
}

function syncPersistentAliases() {
  if (!state || typeof state !== "object") return;
  if (!state.hatchIsland || typeof state.hatchIsland !== "object") {
    state.hatchIsland = { hatchSlots: createDefaultHatchSlots() };
  }
  if (!Array.isArray(state.hatchIsland.hatchSlots)) {
    state.hatchIsland.hatchSlots = createDefaultHatchSlots();
  }
  state.hatchSlots = state.hatchIsland.hatchSlots;
  if (!Array.isArray(state.eggInventory)) {
    state.eggInventory = Array.isArray(state.eggs) ? state.eggs.map(normalizeInventoryEgg) : [];
  }
  state.eggs = state.eggInventory;
}

function initializeCardCollection(catalog, ownedIds = [], selectedId = null) {
  const ownedSet = new Set(ownedIds);
  return catalog.map((base) => ({
    ...base,
    owned: ownedSet.has(base.id),
    selected: base.id === selectedId
  }));
}

function normalizeCardCollection(savedCards, catalog, defaultOwnedIds = [], selectedId = null) {
  const savedById = new Map(Array.isArray(savedCards) ? savedCards.map((card) => [card.id, card]) : []);
  const defaultOwnedSet = new Set(defaultOwnedIds);

  return catalog.map((base) => {
    const saved = savedById.get(base.id) || {};
    return {
      ...base,
      owned: Boolean(saved.owned || defaultOwnedSet.has(base.id)),
      selected: base.id === selectedId
    };
  });
}

function ensureSelectedCardId(cards, selectedId) {
  if (selectedId && cards.some((card) => card.id === selectedId && card.owned)) {
    return selectedId;
  }
  return cards.find((card) => card.owned)?.id || null;
}

function normalizeInventory(inventory, defaults) {
  const source = inventory && typeof inventory === "object" ? inventory : {};
  return {
    items: { ...(defaults.items || {}), ...(source.items || {}) },
    equipment: Array.isArray(source.equipment) ? source.equipment : [],
    ticketsExplore: normalizedNonNegative(source.ticketsExplore, defaults.ticketsExplore),
    ticketsMercenary: normalizedNonNegative(source.ticketsMercenary, defaults.ticketsMercenary)
  };
}

function createDefaultHatchSlots() {
  return Array.from({ length: 6 }, (_, index) => {
    return {
      id: `slot-${index + 1}`,
      type: "time",
      slotType: "time",
      unlocked: index < 2,
      unlockCostDiamonds: hatchSlotUnlockCosts[index] ?? 999,
      currentEggId: null,
      currentEgg: null,
      startTime: null,
      hatchDuration: 0,
      finishTime: null,
      status: index < 2 ? "empty" : "locked"
    };
  });
}

function normalizeHatchIsland(hatchIsland, defaults) {
  const savedSlots = Array.isArray(hatchIsland?.hatchSlots) ? hatchIsland.hatchSlots : [];
  const defaultSlots = defaults.hatchSlots || createDefaultHatchSlots();
  const hatchSlots = defaultSlots.map((defaultSlot, index) => {
    const saved = savedSlots[index] || {};
    const currentEgg = saved.currentEgg ? normalizeInventoryEgg(saved.currentEgg) : null;
    const unlocked = Boolean(saved.unlocked ?? defaultSlot.unlocked);
    const startTime = saved.startTime ? Number(saved.startTime) : (saved.currentEgg?.assignedAt || saved.assignedAt || null);
    const hatchDuration = positiveNumber(
      saved.hatchDuration,
      currentEgg?.hatchDuration || Math.ceil((saved.currentEgg?.requiredMs || saved.remainingTime || 0) / 1000) || 0
    );
    const finishTime = saved.finishTime
      ? Number(saved.finishTime)
      : (currentEgg && startTime ? Number(startTime) + hatchDuration * 1000 : null);
    let status = saved.status || (unlocked ? "empty" : "locked");
    if (!unlocked) status = "locked";
    if (unlocked && currentEgg) status = finishTime && finishTime <= Date.now() ? "ready" : "hatching";
    if (unlocked && !currentEgg) status = "empty";

    return {
      ...defaultSlot,
      ...saved,
      id: saved.id || defaultSlot.id,
      type: "time",
      slotType: "time",
      unlocked,
      unlockCostDiamonds: defaultSlot.unlockCostDiamonds,
      currentEggId: currentEgg?.id || saved.currentEggId || null,
      currentEgg,
      startTime,
      hatchDuration,
      finishTime,
      status
    };
  });
  return { hatchSlots };
}

function normalizeHomeIsland(homeIsland, dragons) {
  const savedIds = Array.isArray(homeIsland?.restDragons) ? homeIsland.restDragons : [];
  const validIds = savedIds.filter((id) => dragons.some((dragon) => dragon.id === id)).slice(0, 5);
  dragons.forEach((dragon) => {
    if (validIds.length < 5 && !validIds.includes(dragon.id)) {
      validIds.push(dragon.id);
    }
  });
  return { restDragons: validIds };
}

function saveGame() {
  console.log("[saveGame]");
  syncPersistentAliases();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function resetGame() {
  const confirmed = window.confirm("確定要重置遊戲嗎？所有龍、金幣與進度都會清空。");
  if (!confirmed) return;

  localStorage.removeItem(STORAGE_KEY);
  state = createNewState();
  activeTab = "home";
  render();
  showToast("遊戲已重置，新的龍蛋正在等你。");
}

function playSfx(name, volume = 0.7) {
  const src = SFX[name];
  if (!src) return;

  const audio = new Audio(src);
  audio.loop = false;
  audio.volume = clamp(Number(volume), 0, 1);
  audio.play().catch(() => {
    console.warn("SFX 播放失敗：", name);
  });
}

function startGame() {
  if (gameHasStarted || startGameTransitioning) return;
  startGameTransitioning = true;
  playSfx("startGame", 0.7);
  window.setTimeout(enterGame, 300);
}

function enterGame() {
  if (gameHasStarted) return;
  gameHasStarted = true;
  startGameTransitioning = false;
  document.body.classList.add("is-game-started");
  document.body.classList.add("home-v2-active");
  if (els.homeV2Root) {
    els.homeV2Root.hidden = false;
    renderHomeV2();
  }
  els.startScreen.hidden = true;
  if (els.loginScreen) els.loginScreen.hidden = true;
  audioManager.unlockPlayback("home");
  renderAudioControls();
  showToast("歡迎來到龍島！");
}

function handleLoginAction(action) {
  const messages = {
    account: "帳號系統將在後續版本開放，目前先使用本機存檔。",
    notice: "公告：歡迎來到龍島！登入畫面素材可直接覆蓋同名檔案替換。",
    settings: "設定先保留為入口；進入遊戲後可調整音樂與測試選項。"
  };
  showLoginMessage(messages[action] || "這個功能還在準備中。");
}

function showLoginMessage(message) {
  if (!els.loginMessage) return;
  window.clearTimeout(loginMessageTimer);
  els.loginMessage.textContent = message;
  els.loginMessage.hidden = false;
  loginMessageTimer = window.setTimeout(() => {
    if (els.loginMessage) els.loginMessage.hidden = true;
  }, 2600);
}

function switchTab(tabName) {
  activeTab = tabAreaNames[tabName] ? tabName : "home";
  document.body.dataset.activeTab = activeTab;
  document.querySelectorAll(".nav-button[data-tab]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.tab === activeTab);
  });
  document.querySelectorAll(".tab-panel").forEach((panel) => {
    panel.classList.toggle("is-active", panel.id === `tab-${activeTab}`);
  });
  render();
  syncMusicToTab();
}

function switchShopTab(shopTab) {
  activeShopTab = shopTab === "diamond" ? "diamond" : "coin";
  renderMarket();
}

function syncMusicToTab() {
  if (!gameHasStarted || !audioManager) return;
  audioManager.switchMusic(MUSIC_BY_TAB[activeTab] || "home");
  renderAudioControls();
}

function renderStaticAssets() {
  const worldScene = document.querySelector(".world-scene");
  if (worldScene && !worldScene.dataset.assetsReady) {
    worldScene.insertAdjacentHTML("afterbegin", `
      <span class="scene-asset scene-bg asset-host">
        ${renderAssetImage("bgHome", "龍島主畫面背景", "asset-image scene-bg-art")}
      </span>
      <span class="scene-asset scene-battle-bg asset-host">
        ${renderAssetImage("bgBattle", "天空戰鬥背景", "asset-image scene-bg-art")}
      </span>
      <span class="scene-asset scene-shop-bg asset-host">
        ${renderAssetImage("bgShop", "龍蛋商店背景", "asset-image scene-bg-art")}
      </span>
      <span class="scene-asset scene-fusion-bg asset-host">
        ${renderAssetImage("bgFusion", "合體祭壇背景", "asset-image scene-bg-art")}
      </span>
      <span class="scene-asset scene-pk-bg asset-host">
        ${renderAssetImage("bgPk", "競技場背景", "asset-image scene-bg-art")}
      </span>
      <span class="scene-asset scene-shop asset-host">
        ${renderAssetImage("shop", "商店", "asset-image scene-shop-art")}
      </span>
      <span class="scene-asset scene-monster asset-host">
        ${renderAssetImage("monster", "怪物", "asset-image scene-monster-art")}
      </span>
    `);
    worldScene.dataset.assetsReady = "true";
  }

  const miniEgg = document.querySelector(".mini-egg");
  if (miniEgg && !miniEgg.dataset.assetsReady) {
    miniEgg.classList.add("asset-host");
    miniEgg.insertAdjacentHTML("afterbegin", renderAssetImage("eggCommon", "孵蛋中", "asset-image mini-egg-art"));
    miniEgg.dataset.assetsReady = "true";
  }

  document.querySelectorAll("[data-nav-icon]").forEach((icon) => {
    if (icon.dataset.assetsReady) return;
    const assetKey = icon.dataset.navIcon;
    icon.classList.add("asset-host", "nav-icon-host");
    icon.insertAdjacentHTML("afterbegin", renderAssetImage(assetKey, icon.textContent.trim() || "導航", "asset-image nav-icon-art"));
    icon.dataset.assetsReady = "true";
  });
}

function renderAssetImage(assetKey, alt, className) {
  const sources = assetSources[assetKey] || [];
  if (sources.length === 0) return "";

  return `
    <img
      class="${className}"
      src="${escapeHtml(sources[0])}"
      alt="${escapeHtml(alt)}"
      data-asset-key="${assetKey}"
      data-asset-index="0"
      data-asset-sources="${escapeHtml(sources.join("|"))}"
      decoding="async"
      loading="lazy"
      onload="window.markAssetLoaded && window.markAssetLoaded(this)"
      onerror="window.tryNextAsset && window.tryNextAsset(this)"
    >
  `;
}

function markAssetLoaded(img) {
  img.classList.add("is-loaded");
  img.classList.remove("is-missing");
  img.closest(".asset-host")?.classList.add("has-loaded-asset");
  if (img.dataset.assetKey) {
    document.body.classList.add(`asset-${img.dataset.assetKey}-loaded`);
  }
}

function tryNextAsset(img) {
  const sources = (img.dataset.assetSources || "").split("|").filter(Boolean);
  const nextIndex = Number(img.dataset.assetIndex || 0) + 1;

  if (nextIndex < sources.length) {
    img.dataset.assetIndex = String(nextIndex);
    img.src = sources[nextIndex];
    return;
  }

  img.classList.add("is-missing");
  img.setAttribute("aria-hidden", "true");
  img.removeAttribute("src");
}

function assetPathList(...paths) {
  const list = [];
  paths.forEach((path) => {
    const normalized = path.replaceAll("\\", "/");
    const candidates = normalized.startsWith("assets/")
      ? [normalized]
      : [`assets/${normalized}`];

    candidates.forEach((candidate) => {
      list.push(candidate);
      if (candidate.endsWith(".png")) {
        list.push(`${candidate}.png`);
      }
    });
  });

  return [...new Set(list)];
}

function render() {
  // 集中重繪所有 HUD 與玩法區塊，避免資源或龍資料更新後不同步。
  document.body.dataset.activeTab = activeTab;
  renderPlayerPanel();
  renderResourceHud();
  renderHomeScene();
  renderHatchMini();
  renderQuestTracker();
  renderEggs();
  renderEggInventory();
  renderExplore();
  renderItemShop();
  renderEquipmentShop();
  renderGuild();
  renderStageList();
  renderBag();
  renderHomeCardShowcase();
  renderFoodPouch();
  renderDragons();
  renderSelects();
  renderFusionPreview();
  renderMarket();
  renderGacha();
  renderCodex();
  renderHomeV2();
  if (els.rankScore) els.rankScore.textContent = formatNumber(state.pkScore);
  els.areaName.textContent = tabAreaNames[activeTab] || tabAreaNames.home;
  if (els.debugPanel && !els.debugPanel.hidden) {
    renderDebugOutput("state");
  }
  renderAudioControls();
}

function renderAudioControls() {
  if (!audioManager || !els.musicMuteButton || !els.musicVolume) return;
  const volumePercent = Math.round(audioManager.volume * 100);
  els.musicMuteButton.textContent = audioManager.isMuted ? "🔇" : "🔊";
  els.musicMuteButton.setAttribute("aria-label", audioManager.isMuted ? "取消音樂靜音" : "音樂靜音");
  els.musicMuteButton.classList.toggle("is-muted", audioManager.isMuted);
  els.musicVolume.value = String(volumePercent);
  els.musicVolumeValue.textContent = `${volumePercent}%`;
  const trackLabel = audioManager.currentTrack ? musicTrackLabel(audioManager.currentTrack) : "音樂待機";
  els.musicStatus.textContent = audioManager.isMuted ? `${trackLabel} / 靜音` : trackLabel;
  document.body.classList.toggle("audio-muted", audioManager.isMuted);
}

function renderPlayerPanel() {
  const activeDragon = getActiveDragon();
  const level = getPlayerLevel(activeDragon);
  const hpMax = activeDragon ? Math.max(1, activeDragon.hp * 30) : 3680;
  const mpMax = activeDragon ? Math.max(1, activeDragon.speed * 36 + 120) : 865;

  els.playerPanel.innerHTML = `
    <div class="player-avatar">${renderMimiHead("mini")}</div>
    <div class="player-name">
      <span>${escapeHtml(state.playerName)}</span>
      <span class="level-badge">Lv.${level}</span>
    </div>
    ${statusBar("HP", hpMax, hpMax, "")}
    ${statusBar("MP", mpMax, mpMax, "mp")}
    <div class="power-line">戰力 ${formatNumber(calculateBattlePower())}</div>
  `;
}

function renderResourceHud() {
  els.resourceHud.innerHTML = [
    resourceChip("coin", "金", formatNumber(state.coins), "coins", "金幣"),
    resourceChip("gem", "鑽", formatNumber(state.diamonds), "diamonds", "鑽石")
  ].join("");
}

function renderHomeV2() {
  if (!els.homeV2Root) return;
  console.log("[renderWorldPager]");

  const dragons = state.dragons.slice(0, 5);
  const slots = (state.hatchIsland?.hatchSlots || createDefaultHatchSlots()).slice(0, 6);
  const readySlots = slots.filter((slot) => slot.currentEgg && getHatchSlotStatus(slot).ready).length;
  const taskText = readySlots > 0
    ? `有 ${readySlots} 個孵化臺可以收成`
    : state.eggs.length > 0
      ? "把龍蛋放進孵化臺"
      : "前往探索取得龍蛋";

  els.homeV2Root.innerHTML = `
    <header class="home-v2-hud" aria-label="玩家資源">
      ${homeV2Resource("金", formatNumber(state.coins), "金幣")}
      ${homeV2Resource("鑽", formatNumber(state.diamonds), "鑽石")}
      <button class="home-v2-settings" type="button" data-v2-action="settings" aria-label="設定">
        <i>⚙</i><span>設定</span>
      </button>
    </header>

    <main id="homeScene" class="home-v2-scene" aria-label="左右滑動雙島首頁">
      <div id="homePager" class="home-v2-pager">
        <section class="homePage restIsland" data-v2-page="rest" aria-label="休息島">
        <div class="home-v2-title">
          <h1>休息島</h1>
          <p>休息中的龍最多顯示 5 隻</p>
        </div>
        <aside class="home-v2-task">
          <b>任務</b>
          <span>${escapeHtml(taskText)}</span>
        </aside>
        <div class="home-v2-ground islandDecoration"></div>
        <div class="home-v2-dragons">
          ${dragons.length > 0 ? dragons.map(renderHomeV2Dragon).join("") : `
            <div class="home-v2-empty">
              <b>還沒有休息中的龍</b>
              <p>先到孵化島管理你的第一顆蛋。</p>
            </div>
          `}
        </div>
        <div class="home-v2-mimi islandDecoration">
          ${homeV2Image(ASSETS.characters.mimiFull, "Mimi", "Mimi")}
        </div>
        </section>

        <section class="homePage hatchIsland" data-v2-page="hatch" aria-label="孵化島">
        <div class="home-v2-title">
          <h1>孵化島</h1>
          <p>在這座島上管理龍蛋的孵化</p>
        </div>
        <div class="home-v2-ground home-v2-hatch-ground islandDecoration"></div>
        <div class="home-v2-hatch-grid">
          ${slots.map(renderHomeV2Slot).join("")}
        </div>
        </section>
      </div>
    </main>

    <div class="homeDots" aria-label="首頁頁面">
      <button class="homeDot is-active" type="button" data-page="0" aria-label="休息島"></button>
      <button class="homeDot" type="button" data-page="1" aria-label="孵化島"></button>
    </div>

    <section class="home-v2-dialogue" aria-label="Mimi 對話">
      ${homeV2Image(ASSETS.characters.mimiAvatar, "Mimi", "咪")}
      <div>
        <b>Mimi</b>
        <p>歡迎回來，冒險者！這裡是休息島，讓龍寶寶們好好放鬆吧。</p>
      </div>
    </section>

    <button id="navLeftBtn" class="home-v2-nav-arrow is-left" type="button" data-v2-nav-arrow="-1" aria-label="往左看功能">‹</button>
    <nav id="bottomNavViewport" aria-label="主要功能">
      <div id="bottomNavTrack">
      ${homeV2NavItem("home", "🏰", "家", true)}
      ${homeV2NavItem("equipment", "🛡", "裝備店")}
      ${homeV2NavItem("items", "🧪", "道具店")}
      ${homeV2NavItem("eggs", "🥚", "龍蛋")}
      ${homeV2NavItem("explore", "🧭", "探索")}
      ${homeV2NavItem("guild", "⚜", "公會")}
      ${homeV2NavItem("stage", "⚔", "關卡")}
      </div>
    </nav>
    <button id="navRightBtn" class="home-v2-nav-arrow is-right" type="button" data-v2-nav-arrow="1" aria-label="往右看功能">›</button>
  `;
}

function homeV2Resource(icon, value, label) {
  return `
    <div class="home-v2-resource" aria-label="${label}">
      <i>${icon}</i>
      <b>${value}</b>
      <button class="home-v2-plus" type="button" data-v2-action="resource-plus" aria-label="增加${label}">+</button>
    </div>
  `;
}

function homeV2NavItem(id, icon, label, active = false) {
  return `
    <button class="navItem${active ? " is-active" : ""}" type="button" data-v2-nav="${id}">
      <i>${icon}</i>
      <span>${label}</span>
    </button>
  `;
}

function renderHomeV2Dragon(dragon, index) {
  const positions = [
    { x: 26, y: 52, s: 1 },
    { x: 54, y: 48, s: 0.9 },
    { x: 74, y: 66, s: 0.88 },
    { x: 34, y: 74, s: 0.82 },
    { x: 60, y: 78, s: 0.8 }
  ];
  const pos = positions[index % positions.length];
  const image = ASSETS.dragons[dragon.rarity.toLowerCase()] || ASSETS.dragons.c;
  return `
    <button
      class="home-v2-dragon"
      type="button"
      data-v2-action="select-dragon"
      data-dragon-id="${dragon.id}"
      style="--x:${pos.x}%;--y:${pos.y}%;--s:${pos.s};"
      aria-label="${escapeHtml(dragon.name)}"
    >
      ${homeV2Image(image, dragon.name, dragon.element)}
      <b>${escapeHtml(dragon.name)}</b>
      <span>${dragon.rarity} / ${dragon.element}</span>
    </button>
  `;
}

function renderHomeV2Slot(slot) {
  const slotType = slot.slotType || slot.type || "time";
  const isSteps = slotType === "steps";
  const typeLabel = isSteps ? "步數孵化器" : "時間孵化器";
  const typeClass = isSteps ? "is-steps" : "is-time";
  const status = getHatchSlotStatus(slot);

  if (!slot.unlocked) {
    return `
      <article class="home-v2-slot ${typeClass} is-locked">
        <span class="home-v2-slot-type">${isSteps ? "步數" : "時間"}</span>
        <div class="home-v2-slot-visual">🔒</div>
        <h3>鎖定欄位</h3>
        <p>解鎖欄位</p>
        <button class="home-v2-unlock" type="button" data-v2-action="unlock-slot" data-slot-id="${slot.id}">
          💎 ${formatNumber(slot.unlockCostDiamonds)}
        </button>
      </article>
    `;
  }

  if (!slot.currentEgg) {
    return `
      <article class="home-v2-slot ${typeClass}">
        <span class="home-v2-slot-type">${isSteps ? "步數" : "時間"}</span>
        <div class="home-v2-slot-visual">＋</div>
        <h3>${typeLabel}</h3>
        <p>空槽</p>
        <div class="home-v2-progress" aria-hidden="true"><i style="--p:0%"></i></div>
      </article>
    `;
  }

  return `
    <article class="home-v2-slot ${typeClass}${status.ready ? " is-ready" : ""}">
      <span class="home-v2-slot-type">${isSteps ? "步數" : "時間"}</span>
      <div class="home-v2-slot-visual">
        ${homeV2Image(homeV2EggImage(slot.currentEgg), slot.currentEgg.name, "蛋")}
      </div>
      <h3>${escapeHtml(slot.currentEgg.name)}</h3>
      <p>${status.label}</p>
      <div class="home-v2-progress"><i style="--p:${status.percent}%"></i></div>
    </article>
  `;
}

function homeV2EggImage(egg) {
  const map = {
    "normal-egg": ASSETS.eggs.common,
    "rare-egg": ASSETS.eggs.rare,
    "epic-egg": ASSETS.eggs.epic,
    "legendary-egg": ASSETS.eggs.legendary,
    "dark-sss-egg": ASSETS.eggs.darkSss
  };
  if (map[egg?.type]) return map[egg.type];
  if (egg?.image?.startsWith("assets/")) return egg.image;
  if (egg?.image) return `assets/${egg.image}`;
  return ASSETS.eggs.common;
}

function homeV2Image(src, alt, fallback) {
  return `
    <img src="${src}" alt="${escapeHtml(alt)}" onerror="this.hidden=true;this.nextElementSibling.hidden=false">
    <span class="home-v2-dragon-fallback" hidden>${escapeHtml(fallback)}</span>
  `;
}

function handleHomeV2Click(event) {
  if (homeV2Drag.moved) {
    homeV2Drag.moved = false;
    return;
  }

  const actionButton = event.target.closest("[data-v2-action]");
  if (actionButton) {
    event.preventDefault();
    event.stopPropagation();
    const action = actionButton.dataset.v2Action;
    if (action === "settings") {
      toggleDebugPanel();
      return;
    }
    if (action === "resource-plus") {
      showToast("資源增加入口先預留，之後再接正式功能。");
      return;
    }
    if (action === "unlock-slot") {
      unlockHatchSlot(actionButton.dataset.slotId);
      return;
    }
    if (action === "select-dragon") {
      setActiveDragon(actionButton.dataset.dragonId);
      return;
    }
  }

  const navArrow = event.target.closest("[data-v2-nav-arrow]");
  if (navArrow) {
    const viewport = document.querySelector("#bottomNavViewport");
    if (viewport) {
      viewport.scrollBy({ left: Number(navArrow.dataset.v2NavArrow) * 80, behavior: "smooth" });
    }
    return;
  }

  const slideButton = event.target.closest("[data-page]");
  if (slideButton) {
    scrollHomeV2To(Number(slideButton.dataset.page));
    return;
  }

  const navButton = event.target.closest("[data-v2-nav]");
  if (!navButton) return;
  const nav = navButton.dataset.v2Nav;
  if (nav === "home") {
    scrollHomeV2To(0);
    return;
  }
  if (nav === "eggs") {
    scrollHomeV2To(1);
    return;
  }
  showToast("這次先重整首頁線框，其他功能入口保留。");
}

function handleHomeV2Scroll(event) {
  if (event.target.id !== "homePager") return;
  updateHomeV2ActiveSlide();
}

function scrollHomeV2To(target) {
  const pager = document.querySelector("#homePager");
  if (!pager) return;
  const page = target === "hatch" || target === 1 || target === "1" ? 1 : 0;
  pager.scrollTo({ left: page * pager.clientWidth, behavior: "smooth" });
  window.setTimeout(updateHomeV2ActiveSlide, 240);
}

function updateHomeV2ActiveSlide() {
  const pager = document.querySelector("#homePager");
  if (!pager) return;
  const isHatch = pager.scrollLeft > pager.clientWidth * 0.5;
  document.querySelectorAll(".homeDot").forEach((dot) => {
    dot.classList.toggle("is-active", Number(dot.dataset.page) === (isHatch ? 1 : 0));
  });
  document.querySelectorAll(".navItem").forEach((button) => {
    const nav = button.dataset.v2Nav;
    button.classList.toggle("is-active", isHatch ? nav === "eggs" : nav === "home");
  });
}

function handleHomeV2PointerDown(event) {
  if (event.button !== undefined && event.button !== 0) return;
  if (event.pointerType === "mouse") return;
  if (homeV2Drag.active) return;
  const target = getHomeV2DragTarget(event.target);
  if (!target) return;

  startHomeV2Drag(target, event.clientX, event.pointerId);
  target.setPointerCapture?.(event.pointerId);
}

function handleHomeV2PointerMove(event) {
  if (!homeV2Drag.active || event.pointerId !== homeV2Drag.pointerId || !homeV2Drag.target) return;
  moveHomeV2Drag(event.clientX);
}

function handleHomeV2PointerEnd(event) {
  if (!homeV2Drag.active || event.pointerId !== homeV2Drag.pointerId) return;
  homeV2Drag.target?.releasePointerCapture?.(event.pointerId);
  endHomeV2Drag();
}

function handleHomeV2MouseDown(event) {
  if (event.button !== 0 || homeV2Drag.active) return;
  const target = getHomeV2DragTarget(event.target);
  if (!target) return;

  startHomeV2Drag(target, event.clientX, "mouse");
  event.preventDefault();
}

function handleHomeV2MouseMove(event) {
  if (!homeV2Drag.active || homeV2Drag.pointerId !== "mouse") return;
  moveHomeV2Drag(event.clientX);
  event.preventDefault();
}

function handleHomeV2MouseEnd() {
  if (!homeV2Drag.active || homeV2Drag.pointerId !== "mouse") return;
  endHomeV2Drag();
}

function handleHomeV2TouchStart(event) {
  if (homeV2Drag.active) return;
  const touch = event.touches[0];
  const target = getHomeV2DragTarget(event.target);
  if (!touch || !target) return;

  startHomeV2Drag(target, touch.clientX, "touch");
}

function handleHomeV2TouchMove(event) {
  if (!homeV2Drag.active || homeV2Drag.pointerId !== "touch") return;
  const touch = event.touches[0];
  if (!touch) return;

  moveHomeV2Drag(touch.clientX);
  if (homeV2Drag.moved) event.preventDefault();
}

function handleHomeV2TouchEnd() {
  if (!homeV2Drag.active || homeV2Drag.pointerId !== "touch") return;
  endHomeV2Drag();
}

function getHomeV2DragTarget(target) {
  if (!target?.closest) return null;
  if (target.closest("[data-v2-nav-arrow]")) return null;
  const bottomNav = target.closest("#bottomNavViewport");
  if (bottomNav) return bottomNav;
  if (target.closest("button, select, input, textarea, a, [data-v2-action], [data-world-page], [data-page], .egg-modal, .egg-modal-backdrop, .home-v2-slot, .egg-choice-card")) {
    return null;
  }
  return target.closest("#worldPager");
}

function startHomeV2Drag(target, clientX, pointerId) {
  homeV2Drag.active = true;
  homeV2Drag.target = target;
  homeV2Drag.pointerId = pointerId;
  homeV2Drag.startX = clientX;
  homeV2Drag.scrollLeft = target.scrollLeft;
  homeV2Drag.startPage = target.id === "worldPager" ? Math.round(target.scrollLeft / target.clientWidth) : 0;
  homeV2Drag.dragOffset = 0;
  homeV2Drag.moved = false;
  target.classList.add("is-dragging");
}

function moveHomeV2Drag(clientX) {
  if (!homeV2Drag.target) return;

  const dx = clientX - homeV2Drag.startX;
  if (Math.abs(dx) > 4) homeV2Drag.moved = true;
  homeV2Drag.target.scrollLeft = homeV2Drag.scrollLeft - dx;
  homeV2Drag.dragOffset = -dx;
}

function endHomeV2Drag() {
  const target = homeV2Drag.target;
  target?.classList.remove("is-dragging");

  if (target?.id === "worldPager") {
    const delta = homeV2Drag.dragOffset;
    const pageDelta = delta > 48 ? 1 : delta < -48 ? -1 : 0;
    const pageCount = target.children.length || 2;
    const page = clamp(homeV2Drag.startPage + pageDelta, 0, pageCount - 1);
    target.scrollTo({ left: page * target.clientWidth, behavior: "smooth" });
    window.setTimeout(updateHomeV2ActiveSlide, 180);
  }

  homeV2Drag.active = false;
  homeV2Drag.target = null;
  homeV2Drag.pointerId = null;
  homeV2Drag.startPage = 0;
  homeV2Drag.dragOffset = 0;
}

function handleHomeV2Wheel(event) {
  const viewport = event.target.closest("#bottomNavViewport");
  if (!viewport) return;

  const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
  if (delta === 0) return;
  viewport.scrollLeft += delta;
  event.preventDefault();
}

function getWorldPages() {
  return [
    { id: "home", label: "家", title: "休息島", icon: "🏡", assetKey: "navHome", className: "homePage", render: renderWorldHomePage },
    { id: "dragonCave", label: "龍窟", title: "龍窟", icon: "🥚", assetKey: "navDragonCave", className: "dragonCavePage", render: renderWorldDragonCavePage },
    { id: "equipment", label: "裝備店", title: "裝備店", icon: "🛡", assetKey: "navEquipmentShop", className: "equipmentShopPage", render: (index) => renderWorldPlaceholderPage(index, "equipmentShopPage", "裝備店", "寵物裝備與傭兵裝備", [
      ["寵物頭盔", "提升龍寶防禦"],
      ["寵物胸甲", "保護冒險夥伴"],
      ["傭兵武器", "提升推圖攻擊"],
      ["傭兵靴子", "增加速度"]
    ]) },
    { id: "items", label: "道具店", title: "道具店", icon: "🧪", assetKey: "navItemShop", className: "itemShopPage", render: (index) => renderWorldPlaceholderPage(index, "itemShopPage", "道具店", "探險卷、食物、回復藥與孵化道具", [
      ["探險卷", "探索時取得龍蛋"],
      ["傭兵契約券", "公會抽傭兵角色"],
      ["龍果實", "餵食龍寶"],
      ["孵化沙漏", "縮短孵化時間"]
    ]) },
    { id: "explore", label: "探索", title: "探索", icon: "🧭", assetKey: "navExplore", className: "explorePage", render: (index) => renderWorldPlaceholderPage(index, "explorePage", "探索", "使用探險卷尋找龍蛋，不會直接取得成龍", [
      ["火山", "火屬性機率較高"],
      ["海洋", "水屬性機率較高"],
      ["森林", "木 / 土屬性機率較高"],
      ["稀有光暗", "低機率出現"]
    ]) },
    { id: "guild", label: "公會", title: "公會", icon: "⚜", assetKey: "navGuild", className: "guildPage", render: (index) => renderWorldPlaceholderPage(index, "guildPage", "冒險公會", "使用傭兵契約券招募傭兵角色", [
      ["契約券", `${formatNumber(state.inventory?.ticketsMercenary || 0)} 張`],
      ["一般招募", "消耗 1 張契約券"],
      ["十連招募", "消耗 10 張契約券"],
      ["傭兵圖鑑", "之後擴充"]
    ]) },
    { id: "stage", label: "關卡", title: "關卡", icon: "⚔", assetKey: "navStage", className: "stagePage", render: (index) => renderWorldPlaceholderPage(index, "stagePage", "關卡", "章節推圖與打怪入口", [
      ["雲海 1-1", "推薦戰力 1,200"],
      ["天空巢穴 1-2", "推薦戰力 2,000"],
      ["水晶山道 1-3", "推薦戰力 3,200"],
      ["進入戰鬥", "之後接關卡戰鬥"]
    ]) }
  ];
}

function renderHomeV2() {
  if (!els.homeV2Root) return;

  const pages = getWorldPages();
  els.homeV2Root.innerHTML = `
    <header class="home-v2-hud" aria-label="玩家資源">
      ${homeV2Resource("金", formatNumber(state.coins), "金幣")}
      ${homeV2Resource("鑽", formatNumber(state.diamonds), "鑽石")}
      <button class="home-v2-settings" type="button" data-v2-action="settings" aria-label="設定">
        <i>⚙</i><span>設定</span>
      </button>
    </header>

    <main id="homeScene" class="home-v2-scene" aria-label="龍島多分頁">
      <div id="worldPager" aria-label="橫向滑動的多島系統">
        ${pages.map((page, index) => page.render(index)).join("")}
      </div>
    </main>

    <div class="homeDots" aria-label="島嶼頁面">
      ${pages.map((page, index) => `<button class="homeDot${index === 0 ? " is-active" : ""}" type="button" data-page="${index}" aria-label="${page.title}"></button>`).join("")}
    </div>

    <section class="home-v2-dialogue" aria-label="Mimi 對話">
      ${homeV2Image(ASSETS.characters.mimiAvatar, "Mimi", "Mimi")}
      <div>
        <b>Mimi</b>
        <p>歡迎回來！這裡是休息島，龍寶們正在休息喔。</p>
      </div>
    </section>

    <button id="navLeftBtn" class="home-v2-nav-arrow is-left" type="button" data-v2-nav-arrow="-1" aria-label="往左看功能">‹</button>
    <nav id="bottomNavViewport" aria-label="主要功能">
      <div id="bottomNavTrack">
        ${pages.map((page, index) => homeV2NavItem(page, index, index === 0)).join("")}
      </div>
    </nav>
    <button id="navRightBtn" class="home-v2-nav-arrow is-right" type="button" data-v2-nav-arrow="1" aria-label="往右看功能">›</button>
  `;

  window.setTimeout(updateHomeV2ActiveSlide, 0);
}

function renderWorldHomePage(index) {
  const dragons = state.dragons.slice(0, 5);
  const readySlots = (state.hatchIsland?.hatchSlots || []).filter((slot) => slot.currentEgg && getHatchSlotStatus(slot).ready).length;
  const taskText = readySlots > 0 ? `${readySlots} 顆蛋可以孵化` : "照顧休息中的龍寶";

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
      <div class="home-v2-title">
        <h1>休息島</h1>
        <p>龍的休憩花園</p>
      </div>
      <aside class="home-v2-task">
        <b>今日任務</b>
        <span>${escapeHtml(taskText)}</span>
      </aside>
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
        <div class="rest-island-characters">
      <div class="home-v2-dragons">
        ${dragons.length > 0 ? dragons.map(renderHomeV2Dragon).join("") : `
          <div class="home-v2-empty">
            <b>還沒有休息中的龍</b>
            <p>前往龍窟孵化第一位龍寶吧。</p>
          </div>
        `}
      </div>
      <div class="home-v2-mimi islandDecoration">
        ${homeV2Image(ASSETS.characters.mimiFull, "Mimi", "Mimi")}
      </div>
    </section>
  `;
}

// Rest Island layout V3. These final declarations intentionally override the
// older prototypes above while keeping the existing worldPager carousel intact.
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

function renderWorldDragonCavePage(index) {
  console.log("[renderDragonCavePage]");
  const slots = (state.hatchIsland?.hatchSlots || createDefaultHatchSlots()).slice(0, 6);
  return `
    <section class="worldPage dragonCavePage" data-world-index="${index}" aria-label="龍窟">
      <div class="home-v2-title">
        <h1>龍窟</h1>
        <p>管理龍蛋與 6 個孵化臺</p>
      </div>
      <div class="home-v2-ground home-v2-hatch-ground cave-platform islandDecoration"></div>
      <div class="home-v2-hatch-grid">
        ${slots.map(renderHomeV2Slot).join("")}
      </div>
    </section>
  `;
}

function renderWorldPlaceholderPage(index, className, title, subtitle, cards) {
  return `
    <section class="worldPage ${className}" data-world-index="${index}" aria-label="${escapeHtml(title)}">
      <div class="home-v2-title">
        <h1>${escapeHtml(title)}</h1>
        <p>${escapeHtml(subtitle)}</p>
      </div>
      <div class="world-card-grid" aria-label="${escapeHtml(title)}內容">
        ${cards.map(([name, description]) => `
          <article class="world-card">
            <span class="world-card-icon">${worldCardIcon(title)}</span>
            <b>${escapeHtml(name)}</b>
            <p>${escapeHtml(description)}</p>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function worldCardIcon(title) {
  if (title.includes("裝備")) return "🛡";
  if (title.includes("道具")) return "🧪";
  if (title.includes("探索")) return "🧭";
  if (title.includes("公會")) return "⚜";
  if (title.includes("關卡")) return "⚔";
  return "✨";
}

function homeV2NavItem(page, index, active = false) {
  return `
    <button class="navItem${active ? " is-active" : ""}" type="button" data-v2-nav="${page.id}" data-world-page="${index}" aria-label="${page.label}">
      <i class="navItemIcon asset-host">
        ${renderAssetImage(page.assetKey, page.label, "asset-image nav-icon-art")}
        <span class="navItemEmoji">${page.icon}</span>
      </i>
      <span>${page.label}</span>
    </button>
  `;
}

function renderHomeV2Dragon(dragon, index) {
  const positions = [
    { x: 24, y: 47, s: 1 },
    { x: 49, y: 38, s: 0.96 },
    { x: 73, y: 49, s: 0.88 },
    { x: 34, y: 62, s: 0.82 },
    { x: 62, y: 62, s: 0.8 }
  ];
  const pos = positions[index % positions.length];
  const image = ASSETS.dragons[dragon.rarity.toLowerCase()] || ASSETS.dragons.c;
  const rarityClass = `is-rarity-${String(dragon.rarity || "C").toLowerCase()}`;
  return `
    <button
      class="home-v2-dragon ${rarityClass}"
      type="button"
      data-v2-action="select-dragon"
      data-dragon-id="${dragon.id}"
      style="--x:${pos.x}%;--y:${pos.y}%;--s:${pos.s};--idle-delay:${index * -0.45}s;"
      aria-label="${escapeHtml(dragon.name)}"
    >
      <span class="dragon-ground-shadow" aria-hidden="true"></span>
      <span class="dragon-aura" aria-hidden="true"></span>
      <span class="dragon-portrait">
        ${homeV2Image(image, dragon.name, dragon.element)}
      </span>
      <span class="dragon-nameplate">
        <b>${escapeHtml(dragon.name)}</b>
        <span><i>${dragon.rarity}</i>${escapeHtml(dragon.element)}</span>
      </span>
    </button>
  `;
}

function renderHomeV2Slot(slot) {
  const slotType = slot.slotType || slot.type || "time";
  const isSteps = slotType === "steps";
  const typeLabel = isSteps ? "步數孵化臺" : "時間孵化臺";
  const typeClass = isSteps ? "is-steps" : "is-time";
  const status = getHatchSlotStatus(slot);

  if (!slot.unlocked) {
    return `
      <article class="home-v2-slot ${typeClass} is-locked">
        <span class="home-v2-slot-type">${isSteps ? "步數型" : "時間型"}</span>
        <div class="home-v2-slot-visual">🔒</div>
        <h3>鎖定欄位</h3>
        <p>使用鑽石解鎖</p>
        <button class="home-v2-unlock" type="button" data-v2-action="unlock-slot" data-slot-id="${slot.id}">
          💎 ${formatNumber(slot.unlockCostDiamonds)}
        </button>
      </article>
    `;
  }

  if (!slot.currentEgg) {
    return `
      <article class="home-v2-slot ${typeClass}">
        <span class="home-v2-slot-type">${isSteps ? "步數型" : "時間型"}</span>
        <div class="home-v2-slot-visual">${isSteps ? "👣" : "⏳"}</div>
        <h3>${typeLabel}</h3>
        <p>${isSteps ? "剩餘步數：空槽" : "剩餘時間：空槽"}</p>
        <div class="home-v2-progress" aria-hidden="true"><i style="--p:0%"></i></div>
      </article>
    `;
  }

  return `
    <article class="home-v2-slot ${typeClass}${status.ready ? " is-ready" : ""}">
      <span class="home-v2-slot-type">${isSteps ? "步數型" : "時間型"}</span>
      <div class="home-v2-slot-visual">
        ${homeV2Image(homeV2EggImage(slot.currentEgg), slot.currentEgg.name, "🥚")}
      </div>
      <h3>${escapeHtml(slot.currentEgg.name)}</h3>
      <p>${status.label}</p>
      <div class="home-v2-progress"><i style="--p:${status.percent}%"></i></div>
    </article>
  `;
}

function handleHomeV2Click(event) {
  if (homeV2Drag.moved) {
    homeV2Drag.moved = false;
    return;
  }

  const actionButton = event.target.closest("[data-v2-action]");
  if (actionButton) {
    const action = actionButton.dataset.v2Action;
    if (action === "settings") {
      toggleDebugPanel();
      return;
    }
    if (action === "resource-plus") {
      showToast("資源加號保留給後續擴充。");
      return;
    }
    if (action === "unlock-slot") {
      unlockHatchSlot(actionButton.dataset.slotId);
      return;
    }
    if (action === "select-dragon") {
      setActiveDragon(actionButton.dataset.dragonId);
      return;
    }
  }

  const navArrow = event.target.closest("[data-v2-nav-arrow]");
  if (navArrow) {
    const viewport = document.querySelector("#bottomNavViewport");
    if (viewport) {
      viewport.scrollBy({ left: Number(navArrow.dataset.v2NavArrow) * 80, behavior: "smooth" });
    }
    return;
  }

  const pageButton = event.target.closest("[data-page]");
  if (pageButton) {
    goToWorldPage(Number(pageButton.dataset.page));
    return;
  }

  const navButton = event.target.closest("[data-world-page]");
  if (navButton) {
    goToWorldPage(Number(navButton.dataset.worldPage));
  }
}

function handleHomeV2Scroll(event) {
  if (event.target.id !== "worldPager") return;
  const pager = event.target;
  const currentPage = clamp(Math.round(pager.scrollLeft / Math.max(1, pager.clientWidth)), 0, (pager.children.length || 1) - 1);
  currentWorldPage = currentPage;
  const now = Date.now();
  if (currentPage !== lastWorldScrollDebugPage || now - lastWorldScrollDebugAt > 700) {
    console.log("[scroll]", pager.scrollLeft, currentPage);
    console.log("[currentPage]", currentWorldPage);
    lastWorldScrollDebugAt = now;
    lastWorldScrollDebugPage = currentPage;
  }
  updateHomeV2ActiveSlide();
}

function scrollHomeV2To(target) {
  const pageMap = { home: 0, rest: 0, dragonCave: 1, hatch: 1, eggs: 1, equipment: 2, items: 3, explore: 4, guild: 5, stage: 6 };
  const index = typeof target === "number" ? target : pageMap[target] ?? 0;
  goToWorldPage(index);
}

function goToWorldPage(index) {
  console.log("[goToWorldPage]", index);
  const pager = document.getElementById("worldPager");
  if (!pager) return;
  const pageWidth = pager.clientWidth;
  const pageCount = pager.children.length || 1;
  const targetIndex = clamp(Number(index) || 0, 0, pageCount - 1);
  currentWorldPage = targetIndex;
  pager.scrollTo({
    left: pageWidth * targetIndex,
    behavior: "smooth"
  });
  window.setTimeout(updateHomeV2ActiveSlide, 180);
}

function updateHomeV2ActiveSlide() {
  const pager = document.querySelector("#worldPager");
  if (!pager) return;
  const page = clamp(Math.round(pager.scrollLeft / Math.max(1, pager.clientWidth)), 0, (pager.children.length || 1) - 1);
  currentWorldPage = page;

  document.querySelectorAll(".homeDot").forEach((dot) => {
    dot.classList.toggle("is-active", Number(dot.dataset.page) === page);
  });

  document.querySelectorAll(".navItem").forEach((button) => {
    const isActive = Number(button.dataset.worldPage) === page;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-current", isActive ? "page" : "false");
  });

  const activeNav = document.querySelector(`.navItem[data-world-page="${page}"]`);
  const viewport = document.querySelector("#bottomNavViewport");
  if (activeNav && viewport) {
    const navRect = activeNav.getBoundingClientRect();
    const viewportRect = viewport.getBoundingClientRect();
    if (navRect.left < viewportRect.left || navRect.right > viewportRect.right) {
      activeNav.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }

  const dialogueText = document.querySelector(".mimi-guide-text p, .home-v2-dialogue p");
  if (dialogueText) {
    const pageTips = [
      "歡迎回來！這裡是休息島，龍寶們正在休息喔。",
      "歡迎回來！這裡是孵蛋島，快來照顧你的龍蛋吧。",
      "裝備店之後可以替龍寶與夥伴準備冒險裝備。",
      "道具店會準備探險卷、食物與孵化道具。",
      "探索可以找到新的龍蛋，帶回龍窟孵化吧。",
      "任務完成後記得回來找我領獎勵。"
    ];
    dialogueText.textContent = pageTips[page] || pageTips[0];
  }
}

function getHomeV2DragTarget(target) {
  if (!target?.closest) return null;
  if (target.closest("[data-v2-nav-arrow]")) return null;
  const bottomNav = target.closest("#bottomNavViewport");
  if (bottomNav) return bottomNav;
  const hatchScroller = target.closest(".hatch-machines-scroll");
  if (hatchScroller) {
    if (target.closest("button, select, input, textarea, a, [data-v2-action]")) return null;
    return hatchScroller;
  }
  if (target.closest("button, select, input, textarea, a, [data-v2-action], [data-world-page], [data-page], .egg-modal, .egg-modal-backdrop, .home-v2-slot, .egg-choice-card")) return null;
  return target.closest("#worldPager");
}

function startHomeV2Drag(target, clientX, pointerId) {
  homeV2Drag.active = true;
  homeV2Drag.target = target;
  homeV2Drag.pointerId = pointerId;
  homeV2Drag.startX = clientX;
  homeV2Drag.scrollLeft = target.scrollLeft;
  homeV2Drag.startPage = target.id === "worldPager" ? Math.round(target.scrollLeft / target.clientWidth) : 0;
  homeV2Drag.dragOffset = 0;
  homeV2Drag.moved = false;
  target.classList.add("is-dragging");
}

function endHomeV2Drag() {
  const target = homeV2Drag.target;
  target?.classList.remove("is-dragging");

  if (target?.id === "worldPager") {
    const delta = homeV2Drag.dragOffset;
    const pageDelta = delta > 48 ? 1 : delta < -48 ? -1 : 0;
    const pageCount = target.children.length || 1;
    const page = clamp(homeV2Drag.startPage + pageDelta, 0, pageCount - 1);
    target.scrollTo({ left: page * target.clientWidth, behavior: "smooth" });
    window.setTimeout(updateHomeV2ActiveSlide, 180);
  }

  homeV2Drag.active = false;
  homeV2Drag.target = null;
  homeV2Drag.pointerId = null;
  homeV2Drag.startPage = 0;
  homeV2Drag.dragOffset = 0;
}

function renderHomeScene() {
  els.heroDragonStage.innerHTML = `
    <div class="home-swipe home-island-carousel" aria-label="龍島主畫面">
      ${renderRestIsland()}
      ${renderHatchIsland()}
    </div>
  `;
  els.mimiButton.innerHTML = renderMimiHead("mini");
  els.mimiBubble.textContent = "左右滑動龍島：左邊讓龍休息，右邊管理孵化臺。";
}

function renderRestIsland() {
  const restIds = state.homeIsland?.restDragons || [];
  const restDragons = restIds
    .map((id) => findDragon(id))
    .filter(Boolean)
    .slice(0, 5);
  const fallbackDragons = state.dragons.filter((dragon) => !restDragons.some((item) => item.id === dragon.id)).slice(0, Math.max(0, 5 - restDragons.length));
  const dragons = [...restDragons, ...fallbackDragons].slice(0, 5);

  return `
    <section class="home-island home-island-slide rest-island" aria-label="休息島">
      <div class="island-title-card">
        <p class="eyebrow">休憩花園</p>
        <h2>休息島</h2>
        <span>休息中的龍最多顯示 5 隻</span>
      </div>
      <div class="rest-dragon-field">
        ${dragons.length > 0 ? dragons.map((dragon, index) => renderRestDragon(dragon, index)).join("") : `
          <div class="empty-island-note">
            <strong>還沒有龍在島上休息</strong>
            <span>去探索取得龍蛋，再放到孵化臺吧。</span>
          </div>
        `}
      </div>
      <div class="island-hint">點擊龍可設為出戰龍並查看狀態</div>
    </section>
  `;
}

function renderRestDragon(dragon, index) {
  const positions = [
    { x: 18, y: 58, s: 0.92, d: 0 },
    { x: 44, y: 48, s: 0.82, d: -0.8 },
    { x: 70, y: 60, s: 0.88, d: -1.3 },
    { x: 30, y: 75, s: 0.76, d: -1.9 },
    { x: 62, y: 78, s: 0.74, d: -2.4 }
  ];
  const pos = positions[index % positions.length];
  return `
    <button
      class="rest-dragon rarity-${dragon.rarity}"
      type="button"
      data-action="active-home-dragon"
      data-dragon-id="${dragon.id}"
      style="--x:${pos.x}%;--y:${pos.y}%;--scale:${pos.s};--delay:${pos.d}s;"
    >
      ${renderAssetImage(dragonAssetKey(dragon.rarity), dragon.name, "asset-image rest-dragon-art")}
      <span class="rest-dragon-fallback element-${elementClass[dragon.element]}">${dragon.element}</span>
      <b>${escapeHtml(dragon.name)}</b>
      <em>${dragon.rarity} / ${dragon.element}</em>
    </button>
  `;
}

function renderHatchIsland() {
  const slots = state.hatchIsland?.hatchSlots || [];
  return `
    <section class="home-island home-island-slide hatch-island" aria-label="孵化島">
      <div class="island-title-card">
        <p class="eyebrow">HATCH ISLAND</p>
        <h2>孵化島</h2>
        <span>2 格開放，最多可擴充到 6 格</span>
      </div>
      <div class="hatch-slot-grid">
        ${slots.map(renderHatchSlotCard).join("")}
      </div>
      <div class="island-hint">時間型看倒數，步數型可用「走 100 步」推進</div>
    </section>
  `;
}

function renderHatchSlotCard(slot) {
  const status = getHatchSlotStatus(slot);
  const slotType = slot.slotType || slot.type || "time";
  const typeLabel = slotType === "steps" ? "步數型" : "時間型";
  const typeIcon = slotType === "steps" ? "步" : "時";

  if (!slot.unlocked) {
    return `
      <article class="hatch-slot-card ${slotType} is-locked">
        <span class="slot-type">${typeIcon}</span>
        <div class="slot-lock">🔒</div>
        <h3>${typeLabel}孵化臺</h3>
        <p>已鎖定</p>
        <button class="mini-button" type="button" data-action="unlock-hatch-slot" data-slot-id="${slot.id}">
          解鎖 ${formatNumber(slot.unlockCostDiamonds)} 鑽
        </button>
      </article>
    `;
  }

  if (!slot.currentEgg) {
    return `
      <article class="hatch-slot-card is-empty ${slotType}">
        <span class="slot-type">${typeIcon}</span>
        <div class="empty-slot-egg">＋</div>
        <h3>${typeLabel}孵化臺</h3>
        <p>空槽</p>
        <button class="mini-button quick-tab-button" type="button" data-tab-target="eggs">放入龍蛋</button>
      </article>
    `;
  }

  return `
    <article class="hatch-slot-card ${slotType}${status.ready ? " is-ready" : ""}">
      <span class="slot-type">${typeIcon}</span>
      <div class="slot-egg asset-host">${renderEggAsset(slot.currentEgg, "asset-image slot-egg-art")}</div>
      <h3>${escapeHtml(slot.currentEgg.name)}</h3>
      <p>${typeLabel} · ${status.label}</p>
      <div class="progress"><div class="progress-fill" style="width:${status.percent}%"></div></div>
      <button class="mini-button" type="button" data-action="${status.ready ? "hatch-slot" : slotType === "steps" ? "walk-slot" : "slot-wait"}" data-slot-id="${slot.id}" ${status.ready || slotType === "steps" ? "" : "disabled"}>
        ${status.ready ? "孵化" : slotType === "steps" ? "走 100 步" : "孵化中"}
      </button>
    </article>
  `;
}

function renderRideHero(dragon) {
  const palette = elementPalettes[dragon.element] || elementPalettes.暗;
  const inlineStyle = [
    `--dragon-main:${palette.main}`,
    `--dragon-belly:${palette.belly}`,
    `--dragon-accent:${palette.accent}`
  ].join(";");

  return `
    <div class="hero-ride rarity-${dragon.rarity}" style="${inlineStyle}">
      ${renderAssetImage("magicCircle", "魔法陣", "asset-image magic-circle-art")}
      ${renderAssetImage("dragonHomeMain", "首頁主視覺龍", "asset-image ride-dragon-art")}
      <div class="ride-wing"></div>
      <div class="ride-dragon">
        <span class="ride-belly"></span>
        <span class="ride-horn"></span>
        <span class="ride-horn two"></span>
      </div>
      <div class="mimi-rider asset-host">
        ${renderAssetImage("mimiGuide", "咪咪引導角色", "asset-image mimi-full-art")}
        <div class="mimi-placeholder">
          ${renderMimiHead("")}
          <span class="mimi-body"></span>
          <span class="mimi-tail"></span>
        </div>
      </div>
      <div class="hero-nameplate">
        <strong>${escapeHtml(dragon.name)}</strong>
        <span>${dragon.element}屬性 / ${dragon.rarity} / Lv.${dragon.level}</span>
      </div>
    </div>
  `;
}

function renderIslandDragons() {
  const companions = state.dragons.slice(0, 6);
  if (companions.length === 0) return "";

  return `
    <div class="home-island-dragons" aria-label="我的龍島夥伴">
      ${companions.map((dragon, index) => `
        <button
          class="island-dragon rarity-${dragon.rarity}"
          type="button"
          style="${islandDragonStyle(index)}"
          title="${escapeHtml(dragonLabel(dragon))}"
          data-action="active-home-dragon"
          data-dragon-id="${dragon.id}"
        >
          ${renderAssetImage(dragonAssetKey(dragon.rarity), `${dragon.name}小龍`, "asset-image island-dragon-art")}
          <span class="island-dragon-placeholder element-${elementClass[dragon.element]}">${dragon.element}</span>
          <b>${dragon.rarity}</b>
        </button>
      `).join("")}
    </div>
  `;
}

function islandDragonStyle(index) {
  const positions = [
    { x: 10, y: 72, s: 0.82, d: 0 },
    { x: 74, y: 70, s: 0.76, d: -0.8 },
    { x: 20, y: 48, s: 0.68, d: -1.2 },
    { x: 64, y: 51, s: 0.66, d: -1.8 },
    { x: 39, y: 78, s: 0.72, d: -2.4 },
    { x: 84, y: 56, s: 0.62, d: -3 }
  ];
  const pos = positions[index % positions.length];
  return `--x:${pos.x}%;--y:${pos.y}%;--scale:${pos.s};--delay:${pos.d}s;`;
}

function renderMimiHead(extraClass) {
  const className = extraClass ? `mimi-head asset-host ${extraClass}` : "mimi-head asset-host";
  return `
    <span class="${className}">
      ${renderAssetImage("mimiAvatar", "咪咪頭像", "asset-image mimi-avatar-art")}
      <span class="mimi-eye left"></span>
      <span class="mimi-eye right"></span>
    </span>
  `;
}

function renderHatchMini() {
  const slotProgresses = (state.hatchIsland?.hatchSlots || [])
    .filter((slot) => slot.unlocked && slot.currentEgg)
    .map(getHatchSlotStatus);
  if (state.eggs.length === 0 && slotProgresses.length === 0) {
    els.hatchMiniProgress.textContent = "待機";
    els.hatchMiniBar.style.width = "0%";
    return;
  }

  const bestProgress = state.eggs.reduce((best, egg) => {
    const progress = getEggProgress(egg);
    const percent = Math.max(progress.stepPercent, progress.timePercent);
    return percent > best.percent ? { percent, ready: progress.ready } : best;
  }, { percent: 0, ready: false });
  slotProgresses.forEach((progress) => {
    if (progress.percent > bestProgress.percent) {
      bestProgress.percent = progress.percent;
      bestProgress.ready = progress.ready;
    }
  });

  els.hatchMiniProgress.textContent = bestProgress.ready ? "可孵化" : `${bestProgress.percent}%`;
  els.hatchMiniBar.style.width = `${bestProgress.percent}%`;
}

function renderQuestTracker() {
  const readyEggs = state.eggs.filter((egg) => getEggProgress(egg).ready).length;
  const readySlots = (state.hatchIsland?.hatchSlots || []).filter((slot) => getHatchSlotStatus(slot).ready).length;
  const quest = readySlots > 0
    ? { title: "任務：孵化臺完成", lines: [`可孵化 ${readySlots} 個孵化臺`] }
    : readyEggs > 0
      ? { title: "任務：孵化發光龍蛋", lines: [`完成孵化 ${readyEggs}/${state.eggs.length}`] }
      : { title: "任務：前往探索", lines: ["使用探險卷取得龍蛋", "再派送到孵化島"] };

  els.questTracker.innerHTML = `
    <strong>！${quest.title}</strong>
    ${quest.lines.map((line) => `<span>${escapeHtml(line)}</span>`).join("")}
  `;
}

function renderEggs() {
  if (state.eggs.length === 0) {
    els.eggList.innerHTML = `<div class="empty-state">目前沒有龍蛋。打怪勝利時有機會獲得新的蛋。</div>`;
    return;
  }

  els.eggList.innerHTML = state.eggs.map((egg, index) => {
    const progress = getEggProgress(egg);
    return `
      <article class="egg-card">
        <div class="egg-visual asset-host" aria-hidden="true">
          ${renderEggAsset(egg, "asset-image egg-asset")}
        </div>
        <h3>${escapeHtml(egg.name || "龍蛋")} #${index + 1}</h3>
        <div class="meta-line">
          <span>可能孵出 ${rarityPoolLabel(egg.rarityPool)}</span>
          ${egg.elementBias ? `<span>${egg.elementBias}屬性偏向</span>` : ""}
        </div>
        <div class="meta-line">
          <span>步數 ${egg.steps}/${egg.requiredSteps}</span>
          <span>等待 ${formatTime(progress.remainingMs)}</span>
        </div>
        <div class="progress" aria-label="步數進度">
          <div class="progress-fill" style="width: ${progress.stepPercent}%"></div>
        </div>
        <div class="progress" aria-label="時間進度">
          <div class="progress-fill" style="width: ${progress.timePercent}%"></div>
        </div>
        <button class="primary-button" type="button" data-action="hatch" data-egg-id="${egg.id}" ${progress.ready ? "" : "disabled"}>
          ${progress.ready ? "孵化龍蛋" : "吸收雲海魔力中"}
        </button>
      </article>
    `;
  }).join("");
}

function renderEggAsset(egg, className) {
  const eggAssetMap = {
    "normal-egg": "eggCommon",
    "rare-egg": "eggRare",
    "epic-egg": "eggEpic",
    "legendary-egg": "eggLegendary",
    "dark-sss-egg": "eggDarkSSS"
  };
  const imageAssetMap = {
    "eggs/egg-common.png": "eggCommon",
    "eggs/egg-rare.png": "eggRare",
    "eggs/egg-epic.png": "eggEpic",
    "eggs/egg-legendary.png": "eggLegendary",
    "eggs/egg-dark-sss.png": "eggDarkSSS"
  };
  const assetKey = eggAssetMap[egg?.type] || imageAssetMap[egg?.image] || "eggCommon";
  return renderAssetImage(assetKey, egg?.name || "龍蛋", className);
}

function renderEggInventory() {
  if (!els.eggInventoryList) return;
  const emptySlots = getAvailableHatchSlots();
  if (state.eggs.length === 0) {
    els.eggInventoryList.innerHTML = `<div class="empty-state">目前沒有龍蛋。前往探索，用探險卷尋找新的龍蛋。</div>`;
    return;
  }

  els.eggInventoryList.innerHTML = state.eggs.map((egg) => `
    <article class="egg-manage-card rarity-${egg.eggRarity || "C"}">
      <div class="egg-manage-art asset-host">${renderEggAsset(egg, "asset-image egg-manage-image")}</div>
      <div>
        <h3>${escapeHtml(egg.name)}</h3>
        <div class="meta-line">
          <span>${rarityBadge(egg.eggRarity || "C")}</span>
          ${egg.elementBias ? `<span class="element-pill">${egg.elementBias}屬性傾向</span>` : "<span>無固定屬性傾向</span>"}
        </div>
        <p>可能孵出：${rarityPoolLabel(egg.rarityPool)} · 需要 ${formatNumber(egg.requiredSteps)} 步 / ${formatTime(egg.requiredMs)}</p>
        <div class="slot-assign-row">
          ${emptySlots.length > 0 ? emptySlots.map((slot) => `
            <button class="mini-button" type="button" data-action="assign-egg" data-egg-id="${egg.id}" data-slot-id="${slot.id}">
              放入${(slot.slotType || slot.type) === "steps" ? "步數" : "時間"}臺 ${slot.id.replace("slot-", "")}
            </button>
          `).join("") : `<span class="empty-mini-note">目前沒有空的孵化臺</span>`}
        </div>
      </div>
    </article>
  `).join("");
}

function getAvailableHatchSlots() {
  return (state.hatchIsland?.hatchSlots || []).filter((slot) => slot.unlocked && !slot.currentEgg);
}

function getHatchSlotStatus(slot) {
  if (!slot.currentEgg) return { state: "empty", label: "空槽", percent: 0, ready: false };
  const egg = slot.currentEgg;
  const slotType = slot.slotType || slot.type || "time";
  if (slotType === "steps") {
    const remainingSteps = Math.max(0, egg.requiredSteps - (egg.steps || 0));
    const percent = clamp(Math.round(((egg.steps || 0) / egg.requiredSteps) * 100), 0, 100);
    slot.remainingSteps = remainingSteps;
    slot.remainingTime = 0;
    return {
      state: remainingSteps <= 0 ? "ready" : "hatching",
      label: remainingSteps <= 0 ? "可孵化" : `剩餘 ${formatNumber(remainingSteps)} 步`,
      percent,
      ready: remainingSteps <= 0
    };
  }

  const assignedAt = egg.assignedAt || egg.createdAt || Date.now();
  const elapsed = Date.now() - assignedAt;
  const remainingMs = Math.max(0, egg.requiredMs - elapsed);
  const percent = clamp(Math.round((elapsed / egg.requiredMs) * 100), 0, 100);
  slot.remainingTime = remainingMs;
  slot.remainingSteps = 0;
  return {
    state: remainingMs <= 0 ? "ready" : "hatching",
    label: remainingMs <= 0 ? "可孵化" : `剩餘 ${formatTime(remainingMs)}`,
    percent,
    ready: remainingMs <= 0
  };
}

function renderBag() {
  if (!els.bagList) return;
  const eggRows = state.eggs.length > 0
    ? state.eggs.map((egg) => {
      const progress = getEggProgress(egg);
      return `
        <article class="bag-item">
          <span class="bag-icon asset-host">${renderEggAsset(egg, "asset-image bag-egg-art")}<b>蛋</b></span>
          <div>
            <h3>${escapeHtml(egg.name)}</h3>
            <p>可能孵出 ${rarityPoolLabel(egg.rarityPool)} · 進度 ${Math.max(progress.stepPercent, progress.timePercent)}%</p>
          </div>
        </article>
      `;
    }).join("")
    : `<div class="empty-state">背包裡暫時沒有龍蛋，可以去龍蛋商店看看。</div>`;

  const foodRows = Object.entries(foodTypes).map(([key, food]) => `
    <article class="bag-item compact">
      <span class="bag-icon food">${key === "jerky" ? "肉" : key === "fruit" ? "果" : "排"}</span>
      <div>
        <h3>${food.name}</h3>
        <p>持有 ${state.foods[key] ?? 0} · 恢復飢餓值 ${food.hunger}</p>
      </div>
    </article>
  `).join("");

  els.bagList.innerHTML = `
    <section class="bag-section">
      <h3>龍蛋</h3>
      <div class="bag-list">${eggRows}</div>
    </section>
    <section class="bag-section">
      <h3>食物</h3>
      <div class="bag-list">${foodRows}</div>
    </section>
  `;
}

function renderHomeCardShowcase() {
  if (!els.homeCardShowcase) return;
  const character = getSelectedCharacter();
  const pet = getSelectedPet();

  els.homeCardShowcase.innerHTML = `
    <button class="home-card-chip quick-tab-button rarity-${character?.rarity || "C"}" type="button" data-tab-target="codex">
      <span>${character ? renderCardImage(character, "home-card-art") : "?"}</span>
      <b>${character ? escapeHtml(character.name) : "選擇角色"}</b>
      <em>目前角色</em>
    </button>
    <button class="home-card-chip quick-tab-button rarity-${pet?.rarity || "C"} pet" type="button" data-tab-target="codex">
      <span>${pet ? renderCardImage(pet, "home-card-art") : "?"}</span>
      <b>${pet ? escapeHtml(pet.name) : "選擇寵物"}</b>
      <em>跟隨寵物</em>
    </button>
  `;
}

function renderGacha() {
  if (!els.gachaResult) return;

  if (els.cardFragmentCount) {
    els.cardFragmentCount.textContent = formatNumber(state.cardFragments);
  }
  if (els.gachaCoinButton) {
    els.gachaCoinButton.innerHTML = `<span>金幣單抽</span><b>${currencyIcon("coins")} ${formatNumber(gachaCosts.coins)}</b>`;
    els.gachaCoinButton.disabled = state.coins < gachaCosts.coins;
  }
  if (els.gachaDiamondButton) {
    els.gachaDiamondButton.innerHTML = `<span>鑽石單抽</span><b>${currencyIcon("diamonds")} ${formatNumber(gachaCosts.diamonds)}</b>`;
    els.gachaDiamondButton.disabled = state.diamonds < gachaCosts.diamonds;
  }

  els.gachaResult.innerHTML = state.lastGachaResult
    ? renderGachaResult(state.lastGachaResult)
    : `
      <div class="gacha-idle-card">
        ${renderAssetImage("gachaCardBg", "抽卡卡背", "asset-image gacha-back-art")}
        <span>?</span>
        <strong>點擊單抽，翻開星願卡</strong>
        <em>可能獲得角色卡或寵物卡</em>
      </div>
    `;
}

function renderGachaResult(result) {
  const card = findCard(result.kind, result.cardId);
  if (!card) return `<div class="empty-state">抽卡紀錄已更新，請再抽一次。</div>`;
  const duplicateText = result.duplicate
    ? `<p class="duplicate-note">重複卡已轉換為星願碎片 +${result.fragments}</p>`
    : `<p class="duplicate-note new">新卡已加入收藏！</p>`;

  return `
    <article class="gacha-reveal-card rarity-${card.rarity} is-revealed">
      <div class="gacha-card-glow"></div>
      <span class="rarity-ribbon" data-rarity="${card.rarity}">${card.rarity}</span>
      <div class="gacha-card-image">${renderCardImage(card, "gacha-result-art")}</div>
      <div class="gacha-card-info">
        <p>${cardKindLabels[result.kind]}</p>
        <h3>${escapeHtml(card.name)}</h3>
        <div class="meta-line">
          <span>${rarityBadge(card.rarity)}</span>
          <span>${cardElementLabel(card.element)}</span>
        </div>
        ${"skillName" in card ? `<strong>${escapeHtml(card.skillName)}</strong>` : ""}
        <span>${escapeHtml(card.description)}</span>
        ${duplicateText}
      </div>
    </article>
  `;
}

function renderExplore() {
  if (!els.exploreList) return;
  if (els.exploreTicketCount) {
    els.exploreTicketCount.textContent = formatNumber(state.inventory.ticketsExplore);
  }
  els.exploreList.innerHTML = exploreRegions.map((region) => `
    <article class="explore-card region-${region.id}">
      <div class="explore-visual">
        <span>${region.icon}</span>
      </div>
      <div>
        <h3>${region.name}</h3>
        <p>${region.description}</p>
        <div class="meta-line">
          <span>屬性傾向：${region.elements.map((item) => item.value).join(" / ")}</span>
        </div>
        <div class="button-row">
          <button class="primary-button" type="button" data-action="explore-draw" data-region-id="${region.id}" data-count="1" ${state.inventory.ticketsExplore >= 1 ? "" : "disabled"}>單抽 1 卷</button>
          <button class="secondary-button" type="button" data-action="explore-draw" data-region-id="${region.id}" data-count="10" ${state.inventory.ticketsExplore >= 10 ? "" : "disabled"}>十連 10 卷</button>
        </div>
      </div>
    </article>
  `).join("");
}

function renderItemShop() {
  if (!els.itemShopList) return;
  els.itemShopList.innerHTML = itemShopProducts.map((product) => renderNewShopProduct(product, "item")).join("");
}

function renderEquipmentShop() {
  if (!els.equipmentShopList) return;
  els.equipmentShopList.innerHTML = equipmentShopProducts.map((product) => renderNewShopProduct(product, "equipment")).join("");
}

function renderNewShopProduct(product, productType) {
  const canBuy = getCurrencyAmount(product.currency) >= product.price;
  return `
    <article class="shop-product-card">
      <div class="shop-product-icon"><span>${escapeHtml(product.icon)}</span></div>
      <div>
        <p class="eyebrow">${escapeHtml(product.category)}${product.slot ? ` / ${escapeHtml(product.slot)}` : ""}</p>
        <h3>${escapeHtml(product.name)}</h3>
        <p>${escapeHtml(product.description)}</p>
        <div class="summary-list compact">
          <div class="summary-row"><span>價格</span><strong>${currencyIcon(product.currency)} ${formatNumber(product.price)} ${currencyLabel(product.currency)}</strong></div>
        </div>
        <button class="primary-button" type="button" data-action="buy-new-shop" data-product-type="${productType}" data-product-id="${product.id}" ${canBuy ? "" : "disabled"}>購買</button>
      </div>
    </article>
  `;
}

function renderGuild() {
  if (!els.guildList) return;
  if (els.mercenaryTicketCount) {
    els.mercenaryTicketCount.textContent = formatNumber(state.inventory.ticketsMercenary);
  }
  els.guildList.innerHTML = `
    <article class="guild-pool-card">
      <div class="guild-emblem">契</div>
      <div>
        <h3>傭兵契約池</h3>
        <p>使用傭兵契約券召募角色。一般池與稀有池第一版先共用同一批測試傭兵。</p>
        <div class="mercenary-preview">
          ${mercenaryPool.map((unit) => `<span class="rarity-pill" data-rarity="${unit.rarity}">${unit.name} ${unit.rarity}</span>`).join("")}
        </div>
        <div class="button-row">
          <button class="primary-button" type="button" data-action="guild-draw" data-count="1" ${state.inventory.ticketsMercenary >= 1 ? "" : "disabled"}>單抽 1 張</button>
          <button class="secondary-button" type="button" data-action="guild-draw" data-count="10" ${state.inventory.ticketsMercenary >= 10 ? "" : "disabled"}>十連 10 張</button>
        </div>
      </div>
    </article>
  `;
}

function renderStageList() {
  if (!els.stageList) return;
  const stages = [
    { id: "sky-1", chapter: "第一章 雲海入口", name: "1-1 飄浮草坡", power: 800 },
    { id: "sky-2", chapter: "第一章 雲海入口", name: "1-2 風晶小道", power: 1200 },
    { id: "nest-1", chapter: "第二章 天空巢穴", name: "2-1 巢穴外圍", power: 1800 },
    { id: "nest-2", chapter: "第二章 天空巢穴", name: "2-2 暗影蛋坑", power: 2600 }
  ];
  els.stageList.innerHTML = stages.map((stage) => `
    <article class="stage-card">
      <div>
        <p class="eyebrow">${stage.chapter}</p>
        <h3>${stage.name}</h3>
        <span>推薦戰力 ${formatNumber(stage.power)}</span>
      </div>
      <button class="primary-button" type="button" data-action="start-stage" data-stage-id="${stage.id}">進入戰鬥</button>
    </article>
  `).join("");
}

function renderCodex() {
  if (!els.codexList || !els.codexDetail) return;
  const filter = els.codexFilter?.value || "all";
  const cards = [
    ...state.characterCards.map((card) => ({ ...card, kind: "character" })),
    ...state.petCards.map((card) => ({ ...card, kind: "pet" }))
  ];
  const visibleCards = filter === "all" ? cards : cards.filter((card) => card.rarity === filter);
  const firstOwned = visibleCards.find((card) => card.owned) || visibleCards[0];

  els.codexList.innerHTML = visibleCards.map(renderCollectionCard).join("");
  els.codexDetail.innerHTML = firstOwned ? renderCodexDetail(firstOwned) : `<div class="empty-state">目前沒有符合條件的卡片。</div>`;
}

function renderCollectionCard(card) {
  const selected = (card.kind === "character" && state.selectedCharacterId === card.id)
    || (card.kind === "pet" && state.selectedPetId === card.id);
  return `
    <button
      class="collection-card rarity-${card.rarity}${card.owned ? "" : " is-locked"}${selected ? " is-selected" : ""}"
      type="button"
      data-card-kind="${card.kind}"
      data-card-id="${card.id}"
    >
      <span class="collection-thumb">${card.owned ? renderCardImage(card, "collection-card-art", true) : "?"}</span>
      <b>${card.owned ? escapeHtml(card.name) : "未解鎖"}</b>
      <em>${cardKindLabels[card.kind]} · ${card.rarity}</em>
    </button>
  `;
}

function renderCodexDetail(card) {
  const selected = (card.kind === "character" && state.selectedCharacterId === card.id)
    || (card.kind === "pet" && state.selectedPetId === card.id);
  return `
    <article class="codex-detail-card rarity-${card.rarity}${card.owned ? "" : " is-locked"}">
      <div class="codex-detail-art">${card.owned ? renderCardImage(card, "codex-detail-image") : "<span>?</span>"}</div>
      <div>
        <p class="eyebrow">${cardKindLabels[card.kind]} CARD</p>
        <h3>${card.owned ? escapeHtml(card.name) : "未知卡片"}</h3>
        <div class="meta-line">
          <span>${rarityBadge(card.rarity)}</span>
          <span>${cardElementLabel(card.element)}</span>
          <span>${card.owned ? "已擁有" : "未擁有"}</span>
        </div>
        <p>${card.owned ? escapeHtml(card.description) : "尚未抽到這張卡。獲得後可以查看完整資料與技能。"}</p>
        ${card.kind === "character" && card.owned ? `
          <div class="skill-panel">
            <strong>${escapeHtml(card.skillName)}</strong>
            <span>${escapeHtml(card.skillDescription)}</span>
          </div>
        ` : ""}
        <button
          class="primary-button"
          type="button"
          data-card-action="select-card"
          data-card-kind="${card.kind}"
          data-card-id="${card.id}"
          ${card.owned && !selected ? "" : "disabled"}
        >
          ${selected ? "使用中" : card.kind === "character" ? "設為目前角色" : "設為跟隨寵物"}
        </button>
      </div>
    </article>
  `;
}

function renderFoodPouch() {
  els.foodPouch.innerHTML = Object.entries(foodTypes).map(([key, food]) => (
    `<span class="food-chip">${food.name} x ${state.foods[key] ?? 0}</span>`
  )).join("");
}

function renderDragons() {
  if (state.dragons.length === 0) {
    els.dragonList.innerHTML = `<div class="empty-state">還沒有龍。去孵蛋頁讓第一位夥伴破殼吧。</div>`;
    return;
  }

  els.dragonList.innerHTML = state.dragons
    .map((dragon) => renderDragonCard(dragon, { actions: true }))
    .join("");
}

function renderDragonCard(dragon, options = {}) {
  const active = state.activeDragonId === dragon.id;
  const hungerTone = dragon.hunger >= 80 ? "精神滿滿" : dragon.hunger >= 35 ? "普通" : "肚子餓";
  const activeClass = active ? " is-active" : "";

  return `
    <article class="dragon-card rarity-${dragon.rarity}${activeClass}">
      <span class="rarity-ribbon" data-rarity="${dragon.rarity}">${dragon.rarity}</span>
      ${renderDragonAvatar(dragon)}
      <div>
        <div class="dragon-title">
          <h3>${escapeHtml(dragon.name)}</h3>
          ${active ? `<span class="tag-pill">出戰</span>` : ""}
        </div>
        <div class="meta-line">
          <span class="rarity-pill" data-rarity="${dragon.rarity}">${dragon.rarity}</span>
          <span class="element-pill">${dragon.element}</span>
          <span>Lv.${dragon.level}</span>
        </div>
        <div class="stat-lines">
          <span>HP ${dragon.hp}</span>
          <span>攻擊 ${dragon.attack}</span>
          <span>防禦 ${dragon.defense}</span>
          <span>速度 ${dragon.speed}</span>
        </div>
        <div class="hunger-row">
          <strong>飢餓值 ${dragon.hunger}/100 · ${hungerTone}</strong>
          <div class="progress"><div class="progress-fill" style="width:${dragon.hunger}%"></div></div>
        </div>
        <div class="meta-line">
          <span>經驗 ${dragon.exp}/${requiredExp(dragon)}</span>
        </div>
      </div>
      ${options.actions ? renderDragonActions(dragon) : ""}
    </article>
  `;
}

function renderDragonAvatar(dragon) {
  return `
    <div class="dragon-avatar asset-host element-${elementClass[dragon.element]}" aria-hidden="true">
      ${renderAssetImage(dragonAssetKey(dragon.rarity), `${dragon.name}頭像`, "asset-image dragon-card-art")}
      <div class="dragon-placeholder">
        <div class="dragon-tail"></div>
        <div class="dragon-body"><div class="dragon-belly"></div></div>
        <div class="dragon-head"></div>
        <span class="dragon-eye left"></span>
        <span class="dragon-eye right"></span>
      </div>
    </div>
  `;
}

function renderDragonActions(dragon) {
  const foodButtons = Object.entries(foodTypes).map(([key, food]) => `
    <button class="mini-button" type="button" data-action="feed" data-dragon-id="${dragon.id}" data-food="${key}" ${state.foods[key] > 0 && dragon.hunger < 100 ? "" : "disabled"}>
      餵 ${food.name}
    </button>
  `).join("");

  return `
    <div class="card-actions button-row">
      <button class="mini-button" type="button" data-action="active" data-dragon-id="${dragon.id}" ${state.activeDragonId === dragon.id ? "disabled" : ""}>設為出戰</button>
      ${foodButtons}
      <button class="mini-button" type="button" data-action="sell" data-dragon-id="${dragon.id}">回收 ${sellPrices[dragon.rarity]} 金幣</button>
    </div>
  `;
}

function renderSelects() {
  const dragonOptions = state.dragons.map((dragon) => (
    `<option value="${dragon.id}">${dragonLabel(dragon)}</option>`
  )).join("");
  const emptyOption = `<option value="">目前沒有可選龍</option>`;

  fillSelect(els.fusionMainSelect, dragonOptions || emptyOption);
  fillSelect(els.fusionSubSelect, dragonOptions || emptyOption);
  fillSelect(els.pveDragonSelect, dragonOptions || emptyOption);
  fillSelect(els.pkDragonSelect, dragonOptions || emptyOption);

  if (state.dragons.length > 1 && els.fusionMainSelect.value === els.fusionSubSelect.value) {
    els.fusionSubSelect.value = state.dragons[1].id;
  }

  [els.pveDragonSelect, els.pkDragonSelect].forEach((select) => {
    if (state.activeDragonId && [...select.options].some((option) => option.value === state.activeDragonId)) {
      select.value = state.activeDragonId;
    }
  });
}

function fillSelect(select, html) {
  if (!select) return;
  const previous = select.value;
  select.innerHTML = html;
  if ([...select.options].some((option) => option.value === previous)) {
    select.value = previous;
  }
}

function renderFusionPreview() {
  const main = findDragon(els.fusionMainSelect.value);
  const sub = findDragon(els.fusionSubSelect.value);

  if (!main || !sub) {
    els.fusionPreview.innerHTML = `<div class="empty-state">選擇兩隻同稀有度的龍開始合體。</div>`;
    return;
  }
  if (main.id === sub.id) {
    els.fusionPreview.innerHTML = `<div class="empty-state">主龍和副龍不能是同一隻。</div>`;
    return;
  }
  if (main.rarity !== sub.rarity) {
    els.fusionPreview.innerHTML = `<div class="empty-state">兩隻龍稀有度不同，無法合體。</div>`;
    return;
  }
  if (main.rarity === "SSS") {
    els.fusionPreview.innerHTML = `<div class="empty-state">SSS 已經是最高稀有度。</div>`;
    return;
  }

  const next = getNextRarity(main.rarity);
  els.fusionPreview.innerHTML = `
    <div class="summary-list">
      <div class="summary-row"><span>合體方向</span><strong>${main.rarity} → ${next}</strong></div>
      <div class="summary-row"><span>成功率</span><strong>${fusionRates[main.rarity]}%</strong></div>
      <div class="summary-row"><span>失敗結果</span><strong>保留主龍，消耗副龍</strong></div>
    </div>
  `;
}

function renderMarket() {
  els.shopTabButtons.forEach((button) => {
    const active = button.dataset.shopTab === activeShopTab;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", String(active));
  });

  const products = state.market.filter((entry) => entry.shopTab === activeShopTab);
  if (products.length === 0) {
    els.marketList.innerHTML = `<div class="empty-state">${activeShopTab === "diamond" ? "鑽石商店" : "金幣商店"}暫時沒有商品，可以刷新看看。</div>`;
    return;
  }

  els.marketList.innerHTML = products.map((entry) => renderMarketCard(entry)).join("");
}

function renderMarketCard(entry) {
  if (entry.type === "item") return renderShopItemCard(entry);

  const eggType = eggTypes[entry.eggType] || eggTypes[defaultEggType];
  const currency = entry.currency || eggType.currency || "coins";
  const canBuy = getCurrencyAmount(currency) >= eggType.price;
  return `
    <article class="market-card egg-product-card" data-product-id="${entry.id}" data-egg-type="${eggType.type}">
      <div class="shop-egg-visual asset-host" aria-hidden="true">
        ${renderEggAsset(eggType, "asset-image shop-egg-art")}
      </div>
      <div>
        <h3>${escapeHtml(eggType.name)}</h3>
        <p class="market-description">${escapeHtml(eggType.description)}</p>
        <div class="meta-line">
          <span>可能孵出：${rarityPoolLabel(eggType.rarityPool)}</span>
          ${eggType.elementBias ? `<span class="element-pill">${eggType.elementBias}屬性偏向</span>` : ""}
        </div>
        <div class="summary-list compact">
          <div class="summary-row"><span>需要步數</span><strong>${formatNumber(eggType.requiredSteps)}</strong></div>
          <div class="summary-row"><span>價格</span><strong>${currencyIcon(currency)} ${formatNumber(eggType.price)} ${currencyLabel(currency)}</strong></div>
        </div>
        <div class="button-row">
          <button class="primary-button" type="button" data-action="buy-product" data-product-id="${entry.id}" ${canBuy ? "" : "disabled"}>購買</button>
        </div>
      </div>
    </article>
  `;
}

function renderShopItemCard(entry) {
  const canBuy = getCurrencyAmount(entry.currency) >= entry.price;
  return `
    <article class="market-card egg-product-card item-product-card" data-product-id="${entry.id}">
      <div class="shop-egg-visual shop-item-visual" aria-hidden="true">
        <span>${escapeHtml(entry.icon || "物")}</span>
      </div>
      <div>
        <h3>${escapeHtml(entry.name)}</h3>
        <p class="market-description">${escapeHtml(entry.description)}</p>
        <div class="summary-list compact">
          <div class="summary-row"><span>商品類型</span><strong>道具</strong></div>
          <div class="summary-row"><span>價格</span><strong>${currencyIcon(entry.currency)} ${formatNumber(entry.price)} ${currencyLabel(entry.currency)}</strong></div>
        </div>
        <div class="button-row">
          <button class="primary-button" type="button" data-action="buy-product" data-product-id="${entry.id}" ${canBuy ? "" : "disabled"}>購買</button>
        </div>
      </div>
    </article>
  `;
}

function statusBar(label, value, max, typeClass) {
  const percent = clamp(Math.round((value / max) * 100), 0, 100);
  return `
    <div class="status-bar">
      <span>${label}</span>
      <span class="bar-track"><b class="bar-fill ${typeClass}" style="width:${percent}%"></b></span>
      <strong>${formatNumber(value)}/${formatNumber(max)}</strong>
    </div>
  `;
}

function resourceChip(iconClass, iconLabel, value, resource, ariaLabel) {
  return `
    <div class="hud-chip" aria-label="${ariaLabel}">
      <span class="hud-icon ${iconClass}">${iconLabel}</span>
      <strong>${value}</strong>
      <button class="hud-plus" type="button" data-resource-plus="${resource}" aria-label="增加${ariaLabel}">+</button>
    </div>
  `;
}

function addStepsToEggs() {
  const stepSlots = (state.hatchIsland?.hatchSlots || []).filter((slot) => slot.unlocked && slot.slotType === "steps" && slot.currentEgg);
  if (state.eggs.length === 0 && stepSlots.length === 0) {
    showToast("目前沒有龍蛋可以累積步數。");
    return;
  }

  state.eggs.forEach((egg) => {
    egg.steps = Math.min(egg.requiredSteps, egg.steps + 100);
    egg.hatchProgress = clamp(Math.round((egg.steps / egg.requiredSteps) * 100), 0, 100);
  });
  stepSlots.forEach((slot) => {
    slot.currentEgg.steps = Math.min(slot.currentEgg.requiredSteps, (slot.currentEgg.steps || 0) + 100);
    slot.currentEgg.hatchProgress = clamp(Math.round((slot.currentEgg.steps / slot.currentEgg.requiredSteps) * 100), 0, 100);
  });
  saveGame();
  render();
  showToast("你走了 100 步，龍蛋暖呼呼地動了一下。");
}

function addStepsToHatchSlot(slotId, amount) {
  const slot = findHatchSlot(slotId);
  if (!slot?.currentEgg || slot.slotType !== "steps") return;
  slot.currentEgg.steps = Math.min(slot.currentEgg.requiredSteps, (slot.currentEgg.steps || 0) + amount);
  slot.currentEgg.hatchProgress = clamp(Math.round((slot.currentEgg.steps / slot.currentEgg.requiredSteps) * 100), 0, 100);
  saveGame();
  render();
  showToast(`步數型孵化臺 +${amount} 步。`);
}

function unlockHatchSlot(slotId) {
  const slot = findHatchSlot(slotId);
  if (!slot || slot.unlocked) return;
  if (state.diamonds < slot.unlockCostDiamonds) {
    showToast("鑽石不足，暫時無法解鎖孵化臺。");
    return;
  }
  state.diamonds -= slot.unlockCostDiamonds;
  slot.unlocked = true;
  saveGame();
  render();
  showToast("新的孵化臺已解鎖。");
}

function assignEggToHatchSlot(eggId, slotId) {
  const egg = state.eggs.find((item) => item.id === eggId);
  const slot = findHatchSlot(slotId);
  if (!egg || !slot || !slot.unlocked || slot.currentEgg) return;
  const slotType = slot.slotType || slot.type || "time";
  slot.currentEgg = {
    ...egg,
    steps: 0,
    hatchProgress: 0,
    assignedAt: Date.now(),
    createdAt: Date.now()
  };
  slot.currentEggId = egg.id;
  slot.remainingSteps = slotType === "steps" ? egg.requiredSteps : 0;
  slot.remainingTime = slotType === "time" ? egg.requiredMs : 0;
  state.eggs = state.eggs.filter((item) => item.id !== eggId);
  saveGame();
  render();
  showToast(`${egg.name} 已放入${slotType === "steps" ? "步數型" : "時間型"}孵化臺。`);
}

function hatchSlotEgg(slotId) {
  const slot = findHatchSlot(slotId);
  if (!slot?.currentEgg) return;
  const status = getHatchSlotStatus(slot);
  if (!status.ready) {
    showToast("這個孵化臺還沒有完成。");
    return;
  }

  const egg = slot.currentEgg;
  const dragon = createDragon(rollRarityForEgg(egg), rollElementForEgg(egg));
  state.dragons.push(dragon);
  state.activeDragonId = state.activeDragonId || dragon.id;
  state.totalHatched += 1;
  updateHighestRarity(dragon.rarity);
  slot.currentEgg = null;
  slot.currentEggId = null;
  slot.remainingTime = 0;
  slot.remainingSteps = 0;
  state.homeIsland = normalizeHomeIsland(state.homeIsland, state.dragons);
  saveGame();
  render();
  showToast(`孵化成功：${dragon.name} 加入休息島！`);
}

function handleEggClick(event) {
  const button = event.target.closest("button[data-action='hatch']");
  if (!button) return;

  hatchEgg(button.dataset.eggId);
}

function handleHomeDragonClick(event) {
  const slotButton = event.target.closest("[data-action='unlock-hatch-slot'], [data-action='hatch-slot'], [data-action='walk-slot'], [data-action='slot-wait']");
  if (slotButton) {
    const action = slotButton.dataset.action;
    if (action === "unlock-hatch-slot") unlockHatchSlot(slotButton.dataset.slotId);
    if (action === "hatch-slot") hatchSlotEgg(slotButton.dataset.slotId);
    if (action === "walk-slot") addStepsToHatchSlot(slotButton.dataset.slotId, 100);
    return;
  }

  const button = event.target.closest("button[data-action='active-home-dragon']");
  if (!button) return;

  setActiveDragon(button.dataset.dragonId);
  switchTab("dragons");
}

function handleEggInventoryClick(event) {
  const button = event.target.closest("[data-action='assign-egg']");
  if (!button) return;
  assignEggToHatchSlot(button.dataset.eggId, button.dataset.slotId);
}

function handleExploreClick(event) {
  const button = event.target.closest("[data-action='explore-draw']");
  if (!button) return;
  exploreRegion(button.dataset.regionId, Number(button.dataset.count) || 1);
}

function handleNewShopClick(event) {
  const button = event.target.closest("[data-action='buy-new-shop']");
  if (!button) return;
  buyNewShopProduct(button.dataset.productType, button.dataset.productId);
}

function handleGuildClick(event) {
  const button = event.target.closest("[data-action='guild-draw']");
  if (!button) return;
  drawMercenaries(Number(button.dataset.count) || 1);
}

function handleStageClick(event) {
  const button = event.target.closest("[data-action='start-stage']");
  if (!button) return;
  runStageBattle(button.dataset.stageId);
}

function hatchEgg(eggId) {
  const egg = state.eggs.find((item) => item.id === eggId);
  if (!egg) return;

  const progress = getEggProgress(egg);
  if (!progress.ready) {
    showToast("這顆龍蛋還需要更多步數或等待時間。");
    return;
  }

  // 孵化時依照蛋種機率抽稀有度，商店無法直接買到成龍。
  const dragon = createDragon(rollRarityForEgg(egg), rollElementForEgg(egg));
  state.eggs = state.eggs.filter((item) => item.id !== eggId);
  state.dragons.push(dragon);
  state.activeDragonId = state.activeDragonId || dragon.id;
  state.totalHatched += 1;
  updateHighestRarity(dragon.rarity);
  state.homeIsland = normalizeHomeIsland(state.homeIsland, state.dragons);
  saveGame();
  render();
  showToast(`孵化成功：${dragon.name} 加入收藏！`);
}

function handleDragonCardClick(event) {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const dragonId = button.dataset.dragonId;
  const action = button.dataset.action;
  if (action === "feed") feedDragon(dragonId, button.dataset.food);
  if (action === "active") setActiveDragon(dragonId);
  if (action === "sell") sellDragon(dragonId);
}

function drawGacha(currency) {
  const cost = gachaCosts[currency] || gachaCosts.coins;
  if (getCurrencyAmount(currency) < cost) {
    showToast(`${currencyLabel(currency)}不足，還不能抽卡。`);
    if (els.gachaResult) {
      els.gachaResult.innerHTML = `<div class="empty-state">${currencyLabel(currency)}不足。去冒險、商店或測試面板補充資源後再試試。</div>`;
    }
    return;
  }

  const kind = rollCardKind();
  const card = rollCardFromCatalog(kind);
  const collection = getCardCollection(kind);
  const ownedCard = collection.find((item) => item.id === card.id);
  const duplicate = Boolean(ownedCard?.owned);
  const fragments = duplicate ? duplicateFragmentRewards[card.rarity] : 0;

  spendCurrency(currency, cost);
  if (duplicate) {
    state.cardFragments += fragments;
  } else if (ownedCard) {
    ownedCard.owned = true;
  }

  state.lastGachaResult = {
    kind,
    cardId: card.id,
    rarity: card.rarity,
    duplicate,
    fragments,
    currency,
    createdAt: Date.now()
  };

  saveGame();
  render();
  showToast(duplicate ? `抽到重複${card.name}，轉為星願碎片 +${fragments}。` : `獲得新${cardKindLabels[kind]}：${card.name}！`);
}

function handleCodexClick(event) {
  const actionButton = event.target.closest("[data-card-action='select-card']");
  if (actionButton) {
    setSelectedCard(actionButton.dataset.cardKind, actionButton.dataset.cardId);
    return;
  }

  const cardButton = event.target.closest(".collection-card[data-card-id]");
  if (!cardButton) return;

  const card = findCard(cardButton.dataset.cardKind, cardButton.dataset.cardId);
  if (card && els.codexDetail) {
    els.codexDetail.innerHTML = renderCodexDetail(card);
  }
}

function setSelectedCard(kind, cardId) {
  const collection = getCardCollection(kind);
  const card = collection.find((item) => item.id === cardId);
  if (!card || !card.owned) {
    showToast("這張卡還沒有解鎖。");
    return;
  }

  if (kind === "character") {
    state.selectedCharacterId = card.id;
    state.characterCards = state.characterCards.map((item) => ({ ...item, selected: item.id === card.id }));
  } else {
    state.selectedPetId = card.id;
    state.petCards = state.petCards.map((item) => ({ ...item, selected: item.id === card.id }));
  }

  saveGame();
  render();
  showToast(`${card.name} 已設定為${kind === "character" ? "目前角色" : "跟隨寵物"}。`);
}

function feedDragon(dragonId, foodKey) {
  const dragon = findDragon(dragonId);
  const food = foodTypes[foodKey];
  if (!dragon || !food || state.foods[foodKey] <= 0) return;

  dragon.hunger = clamp(dragon.hunger + food.hunger, 0, 100);
  state.foods[foodKey] -= 1;
  saveGame();
  render();
  showToast(`${dragon.name} 吃下 ${food.name}，精神變好了。`);
}

function setActiveDragon(dragonId) {
  if (!findDragon(dragonId)) return;
  state.activeDragonId = dragonId;
  saveGame();
  render();
  showToast("出戰龍已更新。");
}

function sellDragon(dragonId) {
  const dragon = findDragon(dragonId);
  if (!dragon) return;

  const confirmed = window.confirm(`確定要回收 ${dragon.name} 嗎？可獲得 ${sellPrices[dragon.rarity]} 金幣。`);
  if (!confirmed) return;

  state.coins += sellPrices[dragon.rarity];
  removeDragon(dragon.id);
  saveGame();
  render();
  showToast(`${dragon.name} 已回收，獲得 ${sellPrices[dragon.rarity]} 金幣。`);
}

function fuseDragons() {
  const main = findDragon(els.fusionMainSelect.value);
  const sub = findDragon(els.fusionSubSelect.value);

  if (!main || !sub) {
    setResult(els.fusionResult, "請先選擇主龍與副龍。");
    return;
  }
  if (main.id === sub.id) {
    setResult(els.fusionResult, "主龍和副龍不能是同一隻。");
    return;
  }
  if (main.rarity !== sub.rarity) {
    setResult(els.fusionResult, "兩隻龍必須是相同稀有度才能合體。");
    return;
  }
  if (main.rarity === "SSS") {
    setResult(els.fusionResult, "SSS 已經是最高稀有度，不能再升級。");
    return;
  }

  const rate = fusionRates[main.rarity];
  const nextRarity = getNextRarity(main.rarity);
  const success = randomInt(1, 100) <= rate;
  removeDragon(sub.id, false);
  if (state.activeDragonId === sub.id) {
    state.activeDragonId = main.id;
  }

  if (success) {
    main.rarity = nextRarity;
    main.name = buildDragonName(main.element, main.rarity);
    main.hp += Math.round(18 * rarityPower[nextRarity]);
    main.attack += Math.round(8 * rarityPower[nextRarity]);
    main.defense += Math.round(7 * rarityPower[nextRarity]);
    main.speed += Math.round(4 * rarityPower[nextRarity]);
    main.hunger = clamp(main.hunger + 12, 0, 100);
    updateHighestRarity(main.rarity);
    setResult(els.fusionResult, `合體成功！${main.name} 升級為 ${nextRarity} 稀有度。`);
    showToast("合體成功，龍魂閃耀了一下。");
  } else {
    gainExp(main, 30);
    setResult(els.fusionResult, "合體失敗，但龍吸收了一點力量。主龍保留，副龍已消耗。");
    showToast("合體失敗，但主龍獲得了少量經驗。");
  }

  saveGame();
  render();
}

function runPveBattle() {
  const dragon = findDragon(els.pveDragonSelect.value);
  if (!dragon) {
    setResult(els.pveResult, "請先選擇一隻龍。");
    return;
  }
  if (!spendStamina(10)) {
    setResult(els.pveResult, "體力不足，等恢復或之後接任務補充。");
    return;
  }

  const monster = createMonster(dragon.level);
  const result = simulateBattle(dragon, monster);
  dragon.hunger = clamp(dragon.hunger - (result.win ? 12 : 22), 0, 100);

  const lines = [
    `遭遇 Lv.${monster.level} ${monster.name}。`,
    `我方總傷害 ${result.playerDamage}，怪物總傷害 ${result.enemyDamage}。`
  ];

  if (result.win) {
    const rewards = grantPveRewards(dragon, monster.level);
    lines.push(`戰鬥勝利！獲得 ${rewards.coins} 金幣、${rewards.exp} 經驗${rewards.foodText}${rewards.eggText}。`);
  } else {
    lines.push("戰鬥失敗。龍沒有消失，但飢餓值下降了。");
  }

  saveGame();
  render();
  setResult(els.pveResult, renderLogLines(lines));
}

function runPkBattle() {
  const dragon = findDragon(els.pkDragonSelect.value);
  if (!dragon) {
    setResult(els.pkResult, "請先選擇一隻龍。");
    return;
  }
  if (!spendStamina(8)) {
    setResult(els.pkResult, "體力不足，暫時不能挑戰競技場。");
    return;
  }

  const enemy = createEnemyDragon(dragon.level);
  const result = simulateBattle(dragon, enemy);
  dragon.hunger = clamp(dragon.hunger - 10, 0, 100);

  const scoreChange = result.win ? randomInt(14, 24) : -randomInt(5, 12);
  state.pkScore = Math.max(0, state.pkScore + scoreChange);

  const lines = [
    `敵方派出 ${enemy.name}（${enemy.rarity} / Lv.${enemy.level}）。`,
    `我方總傷害 ${result.playerDamage}，敵方總傷害 ${result.enemyDamage}。`,
    result.win
      ? `PK 勝利！排名分數 +${scoreChange}。`
      : `PK 失敗，排名分數 ${scoreChange}。`
  ];

  saveGame();
  render();
  setResult(els.pkResult, renderLogLines(lines));
}

function refreshMarket() {
  state.market = generateShopEggs();
  saveGame();
  render();
  showToast(`${activeShopTab === "diamond" ? "鑽石商店" : "金幣商店"}已刷新。`);
}

function handleMarketClick(event) {
  const button = event.target.closest("button[data-action='buy-product']");
  if (!button) return;

  buyShopProduct(button.dataset.productId);
}

function buyMarketDragon(marketId) {
  const entry = state.market.find((item) => item.id === marketId);
  if (!entry) return;

  buyShopProduct(entry.id);
}

function buyShopProduct(productId) {
  const product = state.market.find((item) => item.id === productId);
  if (!product) return;

  if (product.type === "egg") {
    buyEgg(product.eggType);
    return;
  }

  const currency = product.currency || "coins";
  if (getCurrencyAmount(currency) < product.price) {
    setResult(els.marketResult, `${currencyLabel(currency)}不足，無法購買。`);
    return;
  }

  spendCurrency(currency, product.price);
  applyShopRewards(product.rewards);
  saveGame();
  render();
  const message = `成功購買${product.name}！道具已放入背包。`;
  setResult(els.marketResult, message);
  showToast(message);
}

function buyEgg(eggType) {
  const shopEgg = eggTypes[eggType] || eggTypes[defaultEggType];
  const currency = shopEgg.currency || "coins";
  if (getCurrencyAmount(currency) < shopEgg.price) {
    setResult(els.marketResult, `${currencyLabel(currency)}不足，無法購買。`);
    return;
  }

  spendCurrency(currency, shopEgg.price);
  addEggToInventory({ type: shopEgg.type });
  saveGame();
  render();
  const message = `成功購買${shopEgg.name}！快去孵蛋吧！`;
  setResult(els.marketResult, message);
  showToast(message);
}

function buyNewShopProduct(productType, productId) {
  const catalog = productType === "equipment" ? equipmentShopProducts : itemShopProducts;
  const product = catalog.find((item) => item.id === productId);
  const resultElement = productType === "equipment" ? els.equipmentShopResult : els.itemShopResult;
  if (!product) return;
  if (getCurrencyAmount(product.currency) < product.price) {
    setResult(resultElement, `${currencyLabel(product.currency)}不足，無法購買。`);
    return;
  }

  spendCurrency(product.currency, product.price);
  if (productType === "equipment") {
    state.inventory.equipment.push({
      id: createId("equip"),
      productId: product.id,
      name: product.name,
      category: product.category,
      slot: product.slot,
      createdAt: Date.now()
    });
  } else {
    applyShopRewards(product.rewards);
  }

  saveGame();
  render();
  const message = `成功購買${product.name}。`;
  setResult(resultElement, message);
  showToast(message);
}

function applyShopRewards(rewards = {}) {
  if (typeof rewards.ticketsExplore === "number") {
    state.inventory.ticketsExplore += rewards.ticketsExplore;
  }
  if (typeof rewards.ticketsMercenary === "number") {
    state.inventory.ticketsMercenary += rewards.ticketsMercenary;
  }
  if (rewards.items) {
    Object.entries(rewards.items).forEach(([key, amount]) => {
      state.inventory.items[key] = (state.inventory.items[key] || 0) + amount;
    });
  }
  if (rewards.foods) {
    Object.entries(rewards.foods).forEach(([key, amount]) => {
      state.foods[key] = (state.foods[key] || 0) + amount;
    });
  }
  if (rewards.eggs) {
    rewards.eggs.forEach((eggType) => addEggToInventory({ type: eggType }));
  }
}

function exploreRegion(regionId, count) {
  const region = exploreRegions.find((item) => item.id === regionId);
  const drawCount = count >= 10 ? 10 : 1;
  if (!region) return;
  if (state.inventory.ticketsExplore < drawCount) {
    setResult(els.exploreResult, "探險卷不足，請到道具商店購買。");
    return;
  }

  state.inventory.ticketsExplore -= drawCount;
  const eggs = Array.from({ length: drawCount }, () => createExploredEgg(region));
  eggs.forEach((egg) => state.eggs.push(egg));
  saveGame();
  render();
  const lines = eggs.map((egg) => `獲得 ${egg.name}（${egg.eggRarity} / ${egg.elementBias || "無屬性傾向"}）`);
  setResult(els.exploreResult, renderLogLines([`${region.name}探索完成。`, ...lines]));
  showToast(`探索完成，獲得 ${drawCount} 顆龍蛋。`);
}

function createExploredEgg(region) {
  const eggType = weightedPick(exploreEggRates);
  const elementBias = weightedPick(region.elements);
  return normalizeEgg({
    ...createEgg(eggType),
    id: createId("egg"),
    elementBias,
    createdAt: Date.now()
  });
}

function drawMercenaries(count) {
  const drawCount = count >= 10 ? 10 : 1;
  if (state.inventory.ticketsMercenary < drawCount) {
    setResult(els.guildResult, "傭兵契約券不足，請到道具商店購買。");
    return;
  }
  state.inventory.ticketsMercenary -= drawCount;
  const results = Array.from({ length: drawCount }, () => {
    const rarity = weightedPick(cardRarityRates.map((item) => ({ value: item.rarity, weight: item.rate })));
    return randomItem(mercenaryPool.filter((unit) => unit.rarity === rarity) || mercenaryPool);
  });
  state.inventory.items.mercenaryContractsUsed = (state.inventory.items.mercenaryContractsUsed || 0) + drawCount;
  saveGame();
  render();
  setResult(els.guildResult, renderLogLines(["公會召募完成。", ...results.map((unit) => `召募 ${unit.name}（${unit.rarity}）`)]));
  showToast(`召募完成：${drawCount} 位傭兵結果已顯示。`);
}

function runStageBattle(stageId) {
  const dragon = getActiveDragon() || state.dragons[0];
  if (!dragon) {
    setResult(els.stageResult, "目前沒有可出戰的龍。請先探索龍蛋並孵化。");
    return;
  }
  if (!spendStamina(8)) {
    setResult(els.stageResult, "體力不足，暫時不能進入關卡。");
    return;
  }
  const monster = createMonster(dragon.level + (stageId?.startsWith("nest") ? 1 : 0));
  const result = simulateBattle(dragon, monster);
  dragon.hunger = clamp(dragon.hunger - (result.win ? 10 : 18), 0, 100);
  const lines = [
    `派出 ${dragon.name} 進入 ${stageId || "關卡"}。`,
    `遭遇 Lv.${monster.level} ${monster.name}。`,
    `我方總傷害 ${result.playerDamage}，怪物總傷害 ${result.enemyDamage}。`
  ];
  if (result.win) {
    const rewards = grantPveRewards(dragon, monster.level);
    lines.push(`戰鬥勝利！獲得 ${rewards.coins} 金幣、${rewards.exp} 經驗${rewards.foodText}${rewards.eggText}。`);
  } else {
    lines.push("戰鬥失敗。龍沒有消失，但飢餓值下降。");
  }
  saveGame();
  render();
  setResult(els.stageResult, renderLogLines(lines));
}

function getCurrencyAmount(currency) {
  return currency === "diamonds" ? state.diamonds : state.coins;
}

function spendCurrency(currency, amount) {
  if (currency === "diamonds") {
    state.diamonds = Math.max(0, state.diamonds - amount);
    return;
  }
  state.coins = Math.max(0, state.coins - amount);
}

function addEggToInventory(eggData) {
  const type = eggTypes[eggData?.type] ? eggData.type : defaultEggType;
  const eggType = eggTypes[type];
  const egg = normalizeEgg({
    id: createId("egg"),
    name: eggType.name,
    type,
    rarityPool: [...eggType.rarityPool],
    rarityRates: eggType.rarityRates.map((item) => ({ ...item })),
    elementBias: eggType.elementBias,
    hatchProgress: 0,
    steps: 0,
    requiredSteps: eggType.requiredSteps,
    image: eggType.image,
    createdAt: Date.now(),
    requiredMs: eggType.requiredMs,
    ...eggData
  });
  state.eggs.push(egg);
  return egg;
}

function cycleMimiTip() {
  mimiTipIndex = (mimiTipIndex + 1) % mimiTips.length;
  renderHomeScene();
  showToast("咪咪給了你新的冒險提示。");
}

function toggleDebugPanel() {
  const willOpen = els.debugPanel.hidden;
  els.debugPanel.hidden = !willOpen;
  els.debugToggle.setAttribute("aria-expanded", String(willOpen));
  if (willOpen) {
    renderDebugOutput("state");
  }
}

function handleDebugAction(event) {
  const button = event.target.closest("[data-debug-action]");
  if (!button) return;

  const action = button.dataset.debugAction;
  if (action === "toggle") {
    toggleDebugPanel();
    return;
  }

  if (action === "coins") {
    state.coins += 10000;
    saveGame();
    render();
    showToast("測試：金幣 +10,000");
  }

  if (action === "diamonds") {
    state.diamonds += 1000;
    saveGame();
    render();
    showToast("測試：鑽石 +1,000");
  }

  if (action === "egg") {
    state.eggs.push(createExploredEgg(exploreRegions[0]));
    saveGame();
    render();
    showToast("測試：新增龍蛋 1 顆");
  }

  if (action === "ticketExplore") {
    state.inventory.ticketsExplore += 10;
    saveGame();
    render();
    showToast("測試：探險卷 +10");
  }

  if (action === "ticketMercenary") {
    state.inventory.ticketsMercenary += 10;
    saveGame();
    render();
    showToast("測試：傭兵契約券 +10");
  }

  if (action === "readyEgg") {
    const slotWithEgg = (state.hatchIsland?.hatchSlots || []).find((slot) => slot.currentEgg);
    if (slotWithEgg) {
      if (slotWithEgg.slotType === "steps") {
        slotWithEgg.currentEgg.steps = slotWithEgg.currentEgg.requiredSteps;
      } else {
        slotWithEgg.currentEgg.assignedAt = Date.now() - slotWithEgg.currentEgg.requiredMs;
      }
      saveGame();
      render();
      showToast("測試：孵化臺已可孵化");
      renderDebugOutput("state");
      return;
    }
    if (state.eggs.length === 0) {
      state.eggs.push(createExploredEgg(exploreRegions[0]));
    }
    const egg = state.eggs[0];
    egg.steps = egg.requiredSteps;
    egg.createdAt = Date.now() - egg.requiredMs;
    saveGame();
    hatchEgg(egg.id);
  }

  if (action === "dragon") {
    const rarity = els.debugRaritySelect.value;
    const dragon = createDragon(rarity);
    state.dragons.push(dragon);
    state.activeDragonId = dragon.id;
    updateHighestRarity(dragon.rarity);
    saveGame();
    render();
    showToast(`測試：已產生 ${dragon.rarity} 龍`);
  }

  if (action === "clear") {
    localStorage.removeItem(STORAGE_KEY);
    state = createNewState();
    activeTab = "home";
    render();
    showToast("測試：遊戲存檔已清除");
  }

  renderDebugOutput(action === "assets" ? "assets" : "state");
}

function renderDebugOutput(mode) {
  if (!els.debugOutput) return;

  const payload = mode === "assets" ? getAssetDebugReport() : {
    playerName: state.playerName,
    coins: state.coins,
    diamonds: state.diamonds,
    stamina: `${state.stamina}/${state.maxStamina}`,
    inventory: state.inventory,
    hatchSlots: state.hatchIsland.hatchSlots.map((slot) => ({
      id: slot.id,
      type: slot.type || slot.slotType,
      slotType: slot.slotType,
      unlocked: slot.unlocked,
      currentEggId: slot.currentEggId || null,
      egg: slot.currentEgg?.name || null,
      remainingTime: slot.remainingTime || 0,
      remainingSteps: slot.remainingSteps || 0,
      status: getHatchSlotStatus(slot).label
    })),
    eggs: state.eggs.length,
    dragons: state.dragons.map((dragon) => ({
      name: dragon.name,
      rarity: dragon.rarity,
      level: dragon.level,
      hunger: dragon.hunger
    })),
    cards: {
      charactersOwned: state.characterCards.filter((card) => card.owned).length,
      petsOwned: state.petCards.filter((card) => card.owned).length,
      selectedCharacterId: state.selectedCharacterId,
      selectedPetId: state.selectedPetId,
      fragments: state.cardFragments,
      lastGachaResult: state.lastGachaResult
    },
    pkScore: state.pkScore,
    totalHatched: state.totalHatched,
    highestRarity: state.highestRarity
  };

  els.debugOutput.textContent = JSON.stringify(payload, null, 2);
}

function getAssetDebugReport() {
  const images = [...document.querySelectorAll("img[data-asset-key]")];
  return images.reduce((report, img) => {
    const key = img.dataset.assetKey;
    report[key] ||= { loaded: 0, missing: 0, pending: 0, currentSources: [] };
    if (img.classList.contains("is-loaded")) {
      report[key].loaded += 1;
    } else if (img.classList.contains("is-missing")) {
      report[key].missing += 1;
    } else {
      report[key].pending += 1;
    }
    const source = img.getAttribute("src");
    if (source) report[key].currentSources.push(source);
    return report;
  }, {});
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;

  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js").catch(() => {
      // PWA 註冊失敗不影響遊戲本體，開發時可在 debug 面板檢查。
    });
  });
}

function spendStamina(amount) {
  if (state.stamina < amount) return false;
  state.stamina -= amount;
  return true;
}

function grantPveRewards(dragon, monsterLevel) {
  // 飢餓值高時經驗加成，太低時經驗會打折。
  const hungerBonus = dragon.hunger >= 80 ? 1.25 : dragon.hunger < 30 ? 0.8 : 1;
  const coins = randomInt(35, 70) + monsterLevel * randomInt(8, 14);
  const exp = Math.round((randomInt(35, 58) + monsterLevel * 12) * hungerBonus);
  const foodRoll = Math.random();
  let foodText = "";

  state.coins += coins;
  gainExp(dragon, exp);

  if (foodRoll < 0.58) {
    const foodKey = weightedPick([
      { value: "jerky", weight: 60 },
      { value: "fruit", weight: 30 },
      { value: "steak", weight: 10 }
    ]);
    state.foods[foodKey] += 1;
    foodText = `、${foodTypes[foodKey].name} x1`;
  }

  return { coins, exp, foodText, eggText: "" };
}

function simulateBattle(playerDragon, enemy) {
  // 簡化回合制：速度高者先攻，每回合互相造成攻防計算後的傷害。
  const player = {
    hp: Math.round(playerDragon.hp * hungerPower(playerDragon.hunger)),
    attack: Math.round(playerDragon.attack * hungerPower(playerDragon.hunger)),
    defense: Math.round(playerDragon.defense * hungerPower(playerDragon.hunger)),
    speed: playerDragon.speed
  };
  const foe = {
    hp: enemy.hp,
    attack: enemy.attack,
    defense: enemy.defense,
    speed: enemy.speed
  };

  let playerDamage = 0;
  let enemyDamage = 0;
  let rounds = 0;
  const playerFirst = player.speed >= foe.speed;

  while (player.hp > 0 && foe.hp > 0 && rounds < 20) {
    rounds += 1;
    if (playerFirst) {
      const dealt = calculateDamage(player, foe);
      foe.hp -= dealt;
      playerDamage += dealt;
      if (foe.hp <= 0) break;
      const taken = calculateDamage(foe, player);
      player.hp -= taken;
      enemyDamage += taken;
    } else {
      const taken = calculateDamage(foe, player);
      player.hp -= taken;
      enemyDamage += taken;
      if (player.hp <= 0) break;
      const dealt = calculateDamage(player, foe);
      foe.hp -= dealt;
      playerDamage += dealt;
    }
  }

  return {
    win: foe.hp <= 0 || player.hp > foe.hp,
    playerDamage,
    enemyDamage
  };
}

function calculateDamage(attacker, defender) {
  const base = attacker.attack * randomFloat(0.82, 1.18) - defender.defense * randomFloat(0.35, 0.58);
  return Math.max(5, Math.round(base));
}

function hungerPower(hunger) {
  if (hunger < 25) return 0.72;
  if (hunger < 50) return 0.88;
  if (hunger >= 85) return 1.08;
  return 1;
}

function gainExp(dragon, amount) {
  dragon.exp += amount;
  while (dragon.exp >= requiredExp(dragon)) {
    dragon.exp -= requiredExp(dragon);
    dragon.level += 1;
    dragon.hp += randomInt(9, 15);
    dragon.attack += randomInt(3, 7);
    dragon.defense += randomInt(3, 6);
    dragon.speed += randomInt(1, 4);
  }
}

function requiredExp(dragon) {
  return dragon.level * 100;
}

function createEgg(type = defaultEggType) {
  // 每顆蛋同時有步數門檻與等待時間，任一條件達成即可孵化。
  const eggType = eggTypes[type] || eggTypes[defaultEggType];
  return {
    id: createId("egg"),
    name: eggType.name,
    type: eggType.type,
    eggRarity: eggRarityFromType(eggType.type),
    rarityPool: [...eggType.rarityPool],
    rarityRates: eggType.rarityRates.map((item) => ({ ...item })),
    elementBias: eggType.elementBias,
    hatchProgress: 0,
    steps: 0,
    requiredSteps: eggType.requiredSteps,
    image: eggType.image,
    createdAt: Date.now(),
    requiredMs: eggType.requiredMs
  };
}

function eggRarityFromType(type) {
  const map = {
    "normal-egg": "C",
    "rare-egg": "B",
    "epic-egg": "A",
    "legendary-egg": "S",
    "dark-sss-egg": "SSS"
  };
  return map[type] || "C";
}

function findHatchSlot(slotId) {
  return (state.hatchIsland?.hatchSlots || []).find((slot) => slot.id === slotId) || null;
}

function getEggProgress(egg) {
  const elapsed = Date.now() - egg.createdAt;
  const stepPercent = clamp(Math.round((egg.steps / egg.requiredSteps) * 100), 0, 100);
  const timePercent = clamp(Math.round((elapsed / egg.requiredMs) * 100), 0, 100);
  return {
    stepPercent,
    timePercent,
    remainingMs: Math.max(0, egg.requiredMs - elapsed),
    ready: egg.steps >= egg.requiredSteps || elapsed >= egg.requiredMs
  };
}

function rollRarityForEgg(egg) {
  const eggType = eggTypes[egg?.type] || eggTypes[defaultEggType];
  const rates = Array.isArray(egg?.rarityRates) && egg.rarityRates.length > 0
    ? egg.rarityRates
    : eggType.rarityRates;
  return weightedPick(rates.map((item) => ({
    value: item.value || item.rarity,
    weight: item.weight || item.rate
  })));
}

function rollElementForEgg(egg) {
  const bias = egg?.elementBias;
  if (elements.includes(bias) && Math.random() < 0.72) {
    return bias;
  }
  return randomItem(elements);
}

function createDragon(forcedRarity, forcedElement) {
  const rarity = forcedRarity || rollRarity();
  const element = forcedElement || randomItem(elements);
  const power = rarityPower[rarity];
  return {
    id: createId("dragon"),
    name: buildDragonName(element, rarity),
    rarity,
    element,
    level: 1,
    hp: Math.round(randomInt(78, 104) * power),
    attack: Math.round(randomInt(18, 28) * power),
    defense: Math.round(randomInt(12, 22) * power),
    speed: Math.round(randomInt(12, 24) * power),
    hunger: randomInt(72, 100),
    exp: 0
  };
}

function createEnemyDragon(playerLevel) {
  const rarity = weightedPick([
    { value: "C", weight: 30 },
    { value: "B", weight: 28 },
    { value: "A", weight: 20 },
    { value: "S", weight: 13 },
    { value: "SS", weight: 7 },
    { value: "SSS", weight: 2 }
  ]);
  const enemy = createDragon(rarity);
  const targetLevel = Math.max(1, playerLevel + randomInt(-2, 3));
  levelDragonTo(enemy, targetLevel);
  enemy.hunger = 100;
  return enemy;
}

function createMonster(playerLevel) {
  const level = Math.max(1, playerLevel + randomInt(-1, 2));
  const names = ["晶刺野豬", "雲谷史萊姆", "山路石像", "漂浮菇怪", "影爪盜龍", "古木守衛"];
  const scale = 1 + level * 0.12;
  return {
    name: randomItem(names),
    level,
    hp: Math.round(randomInt(78, 110) * scale),
    attack: Math.round(randomInt(15, 25) * scale),
    defense: Math.round(randomInt(8, 18) * scale),
    speed: Math.round(randomInt(8, 22) * scale)
  };
}

function levelDragonTo(dragon, targetLevel) {
  while (dragon.level < targetLevel) {
    dragon.level += 1;
    dragon.hp += randomInt(8, 14);
    dragon.attack += randomInt(3, 6);
    dragon.defense += randomInt(2, 6);
    dragon.speed += randomInt(1, 3);
  }
}

function generateShopEggs() {
  return [];
}

function rollRarity() {
  return weightedPick(rarityRates.map((item) => ({ value: item.rarity, weight: item.rate })));
}

function rollCardKind() {
  return weightedPick([
    { value: "character", weight: 50 },
    { value: "pet", weight: 50 }
  ]);
}

function rollCardFromCatalog(kind) {
  const rarity = weightedPick(cardRarityRates.map((item) => ({ value: item.rarity, weight: item.rate })));
  const catalog = getCardCatalog(kind);
  const candidates = catalog.filter((card) => card.rarity === rarity);
  return randomItem(candidates.length > 0 ? candidates : catalog);
}

function getCardCatalog(kind) {
  return kind === "pet" ? petCardCatalog : characterCardCatalog;
}

function getCardCollection(kind) {
  return kind === "pet" ? state.petCards : state.characterCards;
}

function findCard(kind, cardId) {
  const card = getCardCollection(kind).find((item) => item.id === cardId);
  return card ? { ...card, kind } : null;
}

function getSelectedCharacter() {
  return state.characterCards.find((card) => card.id === state.selectedCharacterId && card.owned)
    || state.characterCards.find((card) => card.owned)
    || null;
}

function getSelectedPet() {
  return state.petCards.find((card) => card.id === state.selectedPetId && card.owned)
    || state.petCards.find((card) => card.owned)
    || null;
}

function renderCardImage(card, className, useThumb = false) {
  const source = useThumb ? card.thumbnail : card.image;
  const fallback = useThumb ? card.image : ASSETS.cards.backgrounds.gacha;
  return `
    <img
      class="card-asset ${className}"
      src="${escapeHtml(source)}"
      alt="${escapeHtml(card.name)}"
      loading="lazy"
      data-asset-key="card-${escapeHtml(card.id)}"
      onload="this.classList.add('is-loaded')"
      onerror="this.onerror=null;this.src='${escapeHtml(fallback)}';this.classList.add('is-fallback')"
    >
  `;
}

function rarityBadge(rarity) {
  return `<b class="rarity-pill" data-rarity="${rarity}">${rarity}</b>`;
}

function cardElementLabel(element) {
  return `<b class="card-element element-${escapeHtml(element)}">${cardElementLabels[element] || element}屬性</b>`;
}

function weightedPick(items) {
  const total = items.reduce((sum, item) => sum + item.weight, 0);
  let roll = Math.random() * total;
  for (const item of items) {
    roll -= item.weight;
    if (roll <= 0) return item.value;
  }
  return items[items.length - 1].value;
}

function buildDragonName(element, rarity) {
  const base = randomItem(elementNames[element] || elementNames.火);
  return `${base}${rarityTitles[rarity]}`;
}

function getNextRarity(rarity) {
  const index = rarities.indexOf(rarity);
  return rarities[index + 1] || rarity;
}

function dragonAssetKey(rarity) {
  return `dragon${rarity}`;
}

function updateHighestRarity(rarity) {
  if (!state.highestRarity || state.highestRarity === "-") {
    state.highestRarity = rarity;
    return;
  }
  if (rarities.indexOf(rarity) > rarities.indexOf(state.highestRarity)) {
    state.highestRarity = rarity;
  }
}

function getHighestRarityFromCollection() {
  if (!state.dragons.length) return "-";
  return state.dragons.reduce((highest, dragon) => (
    rarities.indexOf(dragon.rarity) > rarities.indexOf(highest) ? dragon.rarity : highest
  ), "C");
}

function removeDragon(dragonId, updateActive = true) {
  state.dragons = state.dragons.filter((dragon) => dragon.id !== dragonId);
  if (updateActive && state.activeDragonId === dragonId) {
    state.activeDragonId = state.dragons[0]?.id ?? null;
  }
}

function findDragon(dragonId) {
  return state.dragons.find((dragon) => dragon.id === dragonId);
}

function getActiveDragon() {
  return state.dragons.find((dragon) => dragon.id === state.activeDragonId);
}

function getDisplayDragon() {
  return {
    id: "display_dragon",
    name: "雲翼守護龍",
    rarity: "SSS",
    element: "暗",
    level: 1,
    hp: 96,
    attack: 24,
    defense: 18,
    speed: 20,
    hunger: 100,
    exp: 0
  };
}

function getMimiTip() {
  const readyEggs = state.eggs.some((egg) => getEggProgress(egg).ready);
  if (readyEggs) return "你的蛋已經發光了！快去孵化，說不定會出現稀有龍。";
  if (state.dragons.length === 0) return "歡迎來到龍島！你的冒險從第一顆蛋開始。";
  return mimiTips[mimiTipIndex];
}

function getPlayerLevel(activeDragon) {
  if (activeDragon) return Math.max(1, activeDragon.level);
  return Math.max(1, Math.floor(state.totalHatched / 2) + 1);
}

function calculateBattlePower() {
  if (state.dragons.length === 0) return 12680;
  return state.dragons.reduce((total, dragon) => {
    const rarityBonus = rarities.indexOf(dragon.rarity) * 2200;
    return total + dragon.hp * 14 + dragon.attack * 75 + dragon.defense * 60 + dragon.speed * 54 + dragon.level * 450 + rarityBonus;
  }, Math.round(state.pkScore / 5));
}

function hasFusionPair() {
  const counts = state.dragons.reduce((map, dragon) => {
    map[dragon.rarity] = (map[dragon.rarity] || 0) + 1;
    return map;
  }, {});
  return Object.entries(counts).some(([rarity, count]) => rarity !== "SSS" && count >= 2);
}

function dragonLabel(dragon) {
  return `${dragon.name}｜${dragon.rarity}｜Lv.${dragon.level}｜${dragon.element}`;
}

function rarityPoolLabel(pool) {
  return (Array.isArray(pool) && pool.length > 0 ? pool : eggTypes[defaultEggType].rarityPool).join(" / ");
}

function currencyLabel(currency) {
  return currency === "diamonds" ? "鑽石" : "金幣";
}

function currencyIcon(currency) {
  return currency === "diamonds" ? "💎" : "🪙";
}

function musicTrackLabel(trackName) {
  const labels = {
    start: "登入音樂",
    intro: "開場音樂",
    home: "龍島音樂",
    battle: "戰鬥音樂",
    shop: "商店音樂",
    fusion: "合體音樂"
  };
  return labels[trackName] || "音樂播放中";
}

function setResult(element, html) {
  element.innerHTML = html;
}

function renderLogLines(lines) {
  return lines.map((line) => `<p>${escapeHtml(line)}</p>`).join("");
}

function showToast(message) {
  ensureToastInPhone();
  window.clearTimeout(toastTimer);
  els.toast.textContent = message;
  els.toast.classList.add("is-visible");
  toastTimer = window.setTimeout(() => {
    els.toast.classList.remove("is-visible");
  }, 2400);
}

function ensureToastInPhone() {
  if (!els.toast) return;
  const phone = document.querySelector("#gameShell");
  let layer = els.toastLayer || document.querySelector("#toastLayer");
  if (!layer && phone) {
    layer = document.createElement("div");
    layer.id = "toastLayer";
    layer.className = "toast-layer";
    layer.setAttribute("aria-live", "polite");
    phone.appendChild(layer);
    els.toastLayer = layer;
  }
  if (layer && els.toast.parentElement !== layer) {
    layer.appendChild(els.toast);
  }
}

function formatNumber(value) {
  return Number(value).toLocaleString("zh-TW");
}

function formatTime(ms) {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function positiveNumber(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : fallback;
}

function normalizedNonNegative(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : fallback;
}

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function createId(prefix) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// Hatch V2: time-only incubators. These overrides keep the existing worldPager
// carousel intact while replacing the old step-based hatch flow.
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
      ${homeV2Resource("🪙", formatNumber(state.coins), "金幣")}
      ${homeV2Resource("💎", formatNumber(state.diamonds), "鑽石")}
      <button class="home-v2-settings" type="button" data-v2-action="settings" aria-label="設定">
        <i>⚙</i><span>設定</span>
      </button>
    </header>

    <main id="homeScene" class="home-v2-scene" aria-label="龍島世界">
      <div id="worldPager" aria-label="可左右滑動的島嶼分頁">
        ${pages.map((page, index) => page.render(index)).join("")}
      </div>
    </main>

    <div class="homeDots" aria-label="目前島嶼">
      ${pages.map((page, index) => `<button class="homeDot${index === preservedPage ? " is-active" : ""}" type="button" data-page="${index}" aria-label="${escapeHtml(page.title)}"></button>`).join("")}
    </div>

    <section class="home-v2-dialogue" aria-label="Mimi 對話">
      ${homeV2Image(ASSETS.characters.mimiAvatar, "Mimi", "Mimi")}
      <div>
        <b>Mimi</b>
        <p>歡迎回來！這裡是休息島，龍寶們正在休息喔。</p>
      </div>
    </section>

    <button id="navLeftBtn" class="home-v2-nav-arrow is-left" type="button" data-v2-nav-arrow="-1" aria-label="往左看功能">‹</button>
    <nav id="bottomNavViewport" aria-label="底部功能導航">
      <div id="bottomNavTrack">
        ${pages.map((page, index) => homeV2NavItem(page, index, index === preservedPage)).join("")}
      </div>
    </nav>
    <button id="navRightBtn" class="home-v2-nav-arrow is-right" type="button" data-v2-nav-arrow="1" aria-label="往右看功能">›</button>
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

function renderWorldDragonCavePage(index) {
  console.log("[renderDragonCavePage]");
  const slots = (state.hatchIsland?.hatchSlots || createDefaultHatchSlots()).slice(0, 6);
  return `
    <section class="worldPage dragonCavePage" data-world-index="${index}" aria-label="龍窟">
      <div class="home-v2-title">
        <h1>龍窟</h1>
        <p>管理龍蛋與孵化器</p>
      </div>
      <section class="hatch-island-section" aria-label="孵蛋島嶼">
        <img
          class="hatch-island-art"
          src="${ASSETS.islands.hatch}"
          alt="孵蛋島嶼"
          decoding="async"
          loading="lazy"
          onerror="if(!this.dataset.fallback){this.dataset.fallback='1';this.src='${ASSETS.islands.rest}'}else{this.hidden=true;this.nextElementSibling.hidden=false}"
        >
        <div class="hatch-island-fallback" hidden aria-hidden="true"></div>
        ${renderHatchIslandOverview()}
      </section>
      <section class="hatch-machines-section" aria-label="孵化器列表">
        <div class="hatch-machines-title">孵化器列表</div>
        <div class="hatch-machines-scroll">
          ${slots.map(renderHomeV2Slot).join("")}
        </div>
        <div class="hatch-scroll-dots" aria-hidden="true">
          ${slots.map((_, dotIndex) => `<span class="${dotIndex === 0 ? "is-active" : ""}"></span>`).join("")}
        </div>
      </section>
    </section>
  `;
}

function getHatchOverviewSlots() {
  return (state.hatchIsland?.hatchSlots || [])
    .filter((slot) => slot?.unlocked && slot.currentEgg && getHatchSlotStatus(slot).state === "hatching")
    .slice(0, 6);
}

function renderHatchIslandOverview() {
  const activeSlots = getHatchOverviewSlots();
  const count = activeSlots.length;
  const featuredEgg = activeSlots[0]?.currentEgg || null;
  return `
    <div class="hatch-island-overview count-${count}" data-egg-count="${count}" aria-label="孵蛋總覽">
      <div class="hatch-nest-base${count === 0 ? " is-empty" : ""}" aria-hidden="true">
        <img
          class="hatch-nest-art"
          src="${ASSETS.islands.nest}"
          alt=""
          decoding="async"
          loading="lazy"
          onerror="this.hidden=true;this.nextElementSibling.hidden=false"
        >
        <span class="hatch-nest-fallback" hidden></span>
      </div>
      ${featuredEgg ? renderHatchOverviewEgg(featuredEgg, activeSlots[0].id) : ""}
      <div class="hatch-island-status">目前孵化中：${count}</div>
    </div>
  `;
}

function renderHatchOverviewEgg(egg, slotId) {
  return `
    <button
      class="hatch-overview-egg is-hatching"
      type="button"
      data-v2-action="focus-hatch-slot"
      data-slot-id="${slotId}"
      aria-label="${escapeHtml(egg.name)} 孵化中"
    >
      <img src="${homeV2EggImage(egg)}" alt="${escapeHtml(egg.name)}" onerror="this.hidden=true;this.nextElementSibling.hidden=false">
      <span class="hatch-featured-egg-fallback" hidden aria-hidden="true"></span>
    </button>
  `;
}

function updateHatchIslandOverviewDom() {
  const overview = document.querySelector(".dragonCavePage .hatch-island-overview");
  if (!overview) return;
  overview.outerHTML = renderHatchIslandOverview();
}

function focusHatchSlot(slotId) {
  const scroller = document.querySelector(".dragonCavePage .hatch-machines-scroll");
  const slotElement = findHatchSlotElement(slotId);
  if (!scroller || !slotElement) return;
  scroller.scrollTo({
    left: Math.max(0, slotElement.offsetLeft - 18),
    behavior: "smooth"
  });
  slotElement.classList.add("is-focused");
  window.setTimeout(() => slotElement.classList.remove("is-focused"), 900);
}

function updateHomeV2HudResources() {
  const coins = document.querySelector('.home-v2-resource[aria-label="金幣"] b');
  const diamonds = document.querySelector('.home-v2-resource[aria-label="鑽石"] b');
  if (coins) coins.textContent = formatNumber(state.coins);
  if (diamonds) diamonds.textContent = formatNumber(state.diamonds);
}

function renderHomeV2Slot(slot) {
  const status = getHatchSlotStatus(slot);

  if (!slot.unlocked || status.state === "locked") {
    return `
      <article class="hatch-slot-card home-v2-slot is-time is-locked" data-slot-id="${slot.id}">
        <header>
          <span class="home-v2-slot-type">孵化器</span>
          <h3>${escapeHtml(slot.id?.replace("slot-", "孵化器 ") || "孵化器")}</h3>
        </header>
        <div class="home-v2-slot-visual asset-host">
          ${homeV2Image(ASSETS.ui.hatchSlotLocked, "鎖定孵化器", "🔒")}
        </div>
        <p class="slot-status-text">使用 ${formatNumber(slot.unlockCostDiamonds || 0)} 鑽石解鎖</p>
        <button class="home-v2-unlock" type="button" data-v2-action="unlock-slot" data-slot-id="${slot.id}">
          解鎖 💎 ${formatNumber(slot.unlockCostDiamonds || 0)}
        </button>
      </article>
    `;
  }

  if (!slot.currentEgg || status.state === "empty") {
    return `
      <article class="hatch-slot-card home-v2-slot is-time is-empty" data-slot-id="${slot.id}">
        <header>
          <span class="home-v2-slot-type">時間孵化器</span>
          <h3>${escapeHtml(slot.id?.replace("slot-", "孵化器 ") || "孵化器")}</h3>
        </header>
        <button
          class="home-v2-slot-visual hatch-slot-plus-button asset-host"
          type="button"
          data-v2-action="open-egg-modal"
          data-slot-id="${slot.id}"
          aria-label="加入龍蛋"
        >
          ${homeV2Image(ASSETS.ui.hatchSlotEmpty, "空蛋槽", "+")}
        </button>
        <p class="slot-status-text">點擊放入龍蛋</p>
        <button class="home-v2-unlock" type="button" data-v2-action="open-egg-modal" data-slot-id="${slot.id}">
          放入龍蛋
        </button>
      </article>
    `;
  }

  return `
    <article class="hatch-slot-card home-v2-slot is-time${status.ready ? " is-ready" : ""}" data-slot-id="${slot.id}">
      <header>
        <span class="home-v2-slot-type">時間孵化器</span>
        <h3>${escapeHtml(slot.id?.replace("slot-", "孵化器 ") || "孵化器")}</h3>
      </header>
      <div class="home-v2-slot-visual">
        ${homeV2Image(homeV2EggImage(slot.currentEgg), slot.currentEgg.name, "🥚")}
      </div>
      <b class="slot-egg-name">${escapeHtml(slot.currentEgg.name)}</b>
      <p class="slot-status-text">${escapeHtml(status.label)}</p>
      <div class="home-v2-progress" aria-hidden="true"><i style="--p:${status.percent}%"></i></div>
      ${status.ready ? `
        <button class="home-v2-unlock is-claim" type="button" data-v2-action="claim-hatch" data-slot-id="${slot.id}">
          領取龍
        </button>
      ` : ""}
    </article>
  `;
}

function renderEggSelectionModal() {
  if (!eggSelectionSlotId) return "";
  const eggs = Array.isArray(state.eggInventory) ? state.eggInventory : [];

  return `
    <div class="egg-modal-backdrop" data-v2-backdrop="egg-select" role="presentation">
      <section class="egg-modal" role="dialog" aria-modal="true" aria-label="選擇要孵化的龍蛋">
        <header>
          <h2>選擇要孵化的龍蛋</h2>
          <button type="button" data-v2-action="close-egg-modal" aria-label="關閉">×</button>
        </header>
        <div class="egg-choice-list">
          ${eggs.length > 0 ? eggs.map((egg) => `
            <article class="egg-choice-card">
              <div class="egg-choice-art">
                ${homeV2Image(homeV2EggImage(egg), egg.name, "🥚")}
              </div>
              <div class="egg-choice-info">
                <b>${escapeHtml(egg.name)}</b>
                <span>稀有度：${escapeHtml(egg.rarity || egg.eggRarity || "C")}</span>
                <span>屬性傾向：${escapeHtml(egg.elementBias === "random" || !egg.elementBias ? "隨機" : egg.elementBias)}</span>
                <span>孵化時間：${formatTime((egg.hatchDuration || 60) * 1000)}</span>
              </div>
              <button type="button" data-v2-action="start-hatch" data-slot-id="${eggSelectionSlotId}" data-egg-id="${egg.id}">
                選擇
              </button>
            </article>
          `).join("") : `
            <div class="egg-empty-message">
              <b>目前沒有龍蛋</b>
              <p>請前往探索取得龍蛋。</p>
            </div>
          `}
        </div>
      </section>
    </div>
  `;
}

function handleHomeV2Click(event) {
  if (homeV2Drag.moved) {
    homeV2Drag.moved = false;
    return;
  }

  if (event.target.matches("[data-v2-backdrop='egg-select']")) {
    event.preventDefault();
    event.stopPropagation();
    closeEggSelectionModal();
    return;
  }

  const actionButton = event.target.closest("[data-v2-action]");
  if (actionButton) {
    event.preventDefault();
    event.stopPropagation();
    const action = actionButton.dataset.v2Action;
    if (action === "settings") {
      toggleDebugPanel();
      return;
    }
    if (action === "resource-plus") {
      showToast("資源加號目前保留給之後擴充。");
      return;
    }
    if (action === "unlock-slot") {
      unlockHatchSlot(actionButton.dataset.slotId);
      return;
    }
    if (action === "open-egg-modal") {
      openEggPicker(actionButton.dataset.slotId);
      return;
    }
    if (action === "close-egg-modal") {
      closeEggSelectionModal();
      return;
    }
    if (action === "start-hatch") {
      putEggToSlot(actionButton.dataset.slotId, actionButton.dataset.eggId);
      return;
    }
    if (action === "claim-hatch") {
      claimHatchedDragon(actionButton.dataset.slotId);
      return;
    }
    if (action === "focus-hatch-slot") {
      focusHatchSlot(actionButton.dataset.slotId);
      return;
    }
    if (action === "select-dragon") {
      setActiveDragon(actionButton.dataset.dragonId);
      return;
    }
  }

  const navArrow = event.target.closest("[data-v2-nav-arrow]");
  if (navArrow) {
    event.preventDefault();
    event.stopPropagation();
    const viewport = document.querySelector("#bottomNavViewport");
    if (viewport) {
      viewport.scrollBy({ left: Number(navArrow.dataset.v2NavArrow) * 80, behavior: "smooth" });
    }
    return;
  }

  const pageButton = event.target.closest("[data-page]");
  if (pageButton) {
    event.preventDefault();
    event.stopPropagation();
    goToWorldPage(Number(pageButton.dataset.page));
    return;
  }

  const navButton = event.target.closest("[data-world-page]");
  if (navButton) {
    event.preventDefault();
    event.stopPropagation();
    goToWorldPage(Number(navButton.dataset.worldPage));
  }
}

function openEggSelectionModal(slotId) {
  const slot = findHatchSlot(slotId);
  if (!slot || !slot.unlocked || slot.status === "locked") {
    showToast("這個孵化器尚未解鎖。");
    return;
  }
  if (slot.currentEgg || slot.status === "hatching" || slot.status === "ready") {
    showToast("這個孵化器已經有龍蛋了。");
    return;
  }
  eggSelectionSlotId = slotId;
  mountEggSelectionModal();
}

function openEggPicker(slotId) {
  openEggSelectionModal(slotId);
}

function closeEggSelectionModal() {
  eggSelectionSlotId = null;
  document.querySelector(".egg-modal-backdrop")?.remove();
}

function mountEggSelectionModal() {
  if (!els.homeV2Root) return;
  document.querySelector(".egg-modal-backdrop")?.remove();
  const modalHtml = renderEggSelectionModal();
  if (modalHtml) {
    els.homeV2Root.insertAdjacentHTML("beforeend", modalHtml);
  }
}

function putEggToSlot(slotId, eggId) {
  console.log("[putEggToSlot]", slotId, eggId);
  return startHatchingEgg(slotId, eggId);
}

function startHatchingEgg(slotId, eggId) {
  const slot = findHatchSlot(slotId);
  const eggs = Array.isArray(state.eggInventory) ? state.eggInventory : [];
  const eggIndex = eggs.findIndex((egg) => egg.id === eggId);
  if (!slot || !slot.unlocked || slot.currentEgg || slot.status === "locked") return;
  if (eggIndex < 0) {
    showToast("找不到這顆龍蛋。");
    return;
  }

  const egg = normalizeInventoryEgg(eggs[eggIndex]);
  const now = Date.now();
  eggs.splice(eggIndex, 1);
  slot.type = "time";
  slot.slotType = "time";
  slot.currentEgg = egg;
  slot.currentEggId = egg.id;
  slot.startTime = now;
  slot.hatchDuration = egg.hatchDuration;
  slot.finishTime = now + egg.hatchDuration * 1000;
  slot.status = "hatching";
  eggSelectionSlotId = null;

  syncPersistentAliases();
  saveGame();
  closeEggSelectionModal();
  replaceHatchSlotDom(slot.id);
  updateHatchIslandOverviewDom();
  showToast(`${egg.name} 已放入孵化器，開始倒數！`);
}

function replaceHatchSlotDom(slotId) {
  const slot = findHatchSlot(slotId);
  const slotElement = findHatchSlotElement(slotId);
  if (!slot || !slotElement) return;
  slotElement.outerHTML = renderHomeV2Slot(slot);
}

function updateHatchSlotProgress(slotId) {
  const slot = findHatchSlot(slotId);
  const slotElement = findHatchSlotElement(slotId);
  if (!slot || !slotElement) return;

  const status = getHatchSlotStatus(slot);
  const shouldReplace =
    status.ready !== slotElement.classList.contains("is-ready") ||
    status.state === "empty" ||
    status.state === "locked";

  if (shouldReplace) {
    replaceHatchSlotDom(slotId);
    updateHatchIslandOverviewDom();
    return;
  }

  const statusText = slotElement.querySelector("p");
  const progressBar = slotElement.querySelector(".home-v2-progress i");
  if (statusText) statusText.textContent = status.label;
  if (progressBar) progressBar.style.setProperty("--p", `${status.percent}%`);
}

function updateVisibleHatchSlotProgress() {
  (state.hatchIsland?.hatchSlots || []).forEach((slot) => {
    if (slot.currentEgg) updateHatchSlotProgress(slot.id);
  });
}

function findHatchSlotElement(slotId) {
  return Array.from(document.querySelectorAll(".home-v2-slot[data-slot-id]"))
    .find((element) => element.dataset.slotId === slotId) || null;
}

function claimHatchedDragon(slotId) {
  const slot = findHatchSlot(slotId);
  if (!slot?.currentEgg) return;
  const status = getHatchSlotStatus(slot);
  if (!status.ready) {
    showToast("龍蛋還在孵化中。");
    return;
  }

  const egg = slot.currentEgg;
  const dragon = hatchEggToDragon(egg);
  state.dragons.push(dragon);
  state.activeDragonId = state.activeDragonId || dragon.id;
  state.totalHatched = normalizedNonNegative(state.totalHatched, 0) + 1;
  updateHighestRarity(dragon.rarity);
  Object.assign(slot, {
    type: "time",
    slotType: "time",
    currentEgg: null,
    currentEggId: null,
    startTime: null,
    hatchDuration: 0,
    finishTime: null,
    status: "empty"
  });
  state.homeIsland = normalizeHomeIsland(state.homeIsland, state.dragons);
  syncPersistentAliases();
  saveGame();
  replaceHatchSlotDom(slot.id);
  updateHatchIslandOverviewDom();
  showToast(`孵化成功！獲得 ${dragon.rarity} ${dragon.name}`);
}

function unlockHatchSlot(slotId) {
  const slot = findHatchSlot(slotId);
  if (!slot || slot.unlocked) return;
  const cost = normalizedNonNegative(slot.unlockCostDiamonds, 999);
  if (state.diamonds < cost) {
    showToast("鑽石不足");
    return;
  }
  state.diamonds -= cost;
  Object.assign(slot, {
    unlocked: true,
    type: "time",
    slotType: "time",
    status: "empty",
    currentEgg: null,
    currentEggId: null,
    startTime: null,
    hatchDuration: 0,
    finishTime: null
  });
  syncPersistentAliases();
  saveGame();
  replaceHatchSlotDom(slot.id);
  updateHomeV2HudResources();
  showToast("孵化器已解鎖！");
}

function assignEggToHatchSlot(eggId, slotId) {
  startHatchingEgg(slotId, eggId);
}

function hatchSlotEgg(slotId) {
  claimHatchedDragon(slotId);
}

function addStepsToEggs() {
  showToast("目前孵化已改為時間倒數制。");
}

function addStepsToHatchSlot() {
  showToast("目前孵化已改為時間倒數制。");
}

function updateHatchSlots(options = {}) {
  const shouldRender = options.render !== false;
  const shouldSave = options.save !== false;
  const slots = state.hatchIsland?.hatchSlots || [];
  const now = Date.now();
  let changed = false;
  let hasRunningSlot = false;

  slots.forEach((slot) => {
    if (!slot.unlocked) {
      if (slot.status !== "locked") {
        slot.status = "locked";
        changed = true;
      }
      return;
    }
    if (!slot.currentEgg) {
      if (slot.status !== "empty") {
        slot.status = "empty";
        changed = true;
      }
      return;
    }
    if (slot.status === "ready" || (slot.finishTime && slot.finishTime <= now)) {
      if (slot.status !== "ready") {
        slot.status = "ready";
        changed = true;
      }
      return;
    }
    hasRunningSlot = true;
    if (slot.status !== "hatching") {
      slot.status = "hatching";
      changed = true;
    }
  });

  if (changed && shouldSave) {
    saveGame();
  }

  if (
    shouldRender &&
    !homeV2Drag.active &&
    gameHasStarted &&
    els.homeV2Root &&
    !els.homeV2Root.hidden &&
    (changed || hasRunningSlot || eggSelectionSlotId)
  ) {
    updateVisibleHatchSlotProgress();
  }

  return changed;
}

function getHatchSlotStatus(slot) {
  if (!slot?.unlocked) {
    return { state: "locked", label: `使用 ${formatNumber(slot?.unlockCostDiamonds || 0)} 鑽石解鎖`, percent: 0, ready: false };
  }
  if (!slot.currentEgg) {
    return { state: "empty", label: "空的孵化器", percent: 0, ready: false };
  }

  const now = Date.now();
  const durationMs = Math.max(1, (slot.hatchDuration || slot.currentEgg.hatchDuration || 60) * 1000);
  const startTime = Number(slot.startTime || now);
  const finishTime = Number(slot.finishTime || startTime + durationMs);
  const remainingMs = Math.max(0, finishTime - now);
  const ready = slot.status === "ready" || remainingMs <= 0;
  const elapsedMs = Math.max(0, durationMs - remainingMs);
  const percent = ready ? 100 : clamp(Math.round((elapsedMs / durationMs) * 100), 0, 99);

  return {
    state: ready ? "ready" : "hatching",
    label: ready ? "可孵化！" : `剩餘 ${formatTime(remainingMs)}`,
    percent,
    ready,
    remainingMs
  };
}

function hatchEggToDragon(egg) {
  const normalizedEgg = normalizeInventoryEgg(egg);
  const definition = HATCH_EGG_DEFINITIONS[normalizedEgg.type] || HATCH_EGG_DEFINITIONS["normal-egg"];
  const rarity = rollWeightedHatchRarity(definition.rarityRates);
  const element = pickHatchElement(normalizedEgg.elementBias || definition.elementBias);

  return {
    id: createId("dragon"),
    name: generateDragonName(rarity, element),
    rarity,
    element,
    level: 1,
    hp: calculateHatchDragonStat(rarity, 88, 28),
    attack: calculateHatchDragonStat(rarity, 24, 11),
    defense: calculateHatchDragonStat(rarity, 18, 8),
    speed: calculateHatchDragonStat(rarity, 14, 7),
    hunger: 100,
    exp: 0,
    image: getDragonImageByRarity(rarity)
  };
}

function rollWeightedHatchRarity(rates) {
  const entries = Array.isArray(rates) && rates.length > 0 ? rates : HATCH_EGG_DEFINITIONS["normal-egg"].rarityRates;
  const total = entries.reduce((sum, entry) => sum + Number(entry.rate || entry.weight || 0), 0);
  let roll = Math.random() * Math.max(1, total);
  for (const entry of entries) {
    roll -= Number(entry.rate || entry.weight || 0);
    if (roll <= 0) return entry.rarity || entry.value || "C";
  }
  return entries[entries.length - 1]?.rarity || "C";
}

function pickHatchElement(elementBias) {
  const hatchElements = ["火", "水", "木", "風", "雷", "土", "光", "暗"];
  if (elementBias && elementBias !== "random") {
    const rareRoll = Math.random();
    if (elementBias === "暗") return rareRoll < 0.72 ? "暗" : randomItem(hatchElements);
    return rareRoll < 0.65 ? elementBias : randomItem(hatchElements);
  }
  return randomItem(hatchElements);
}

function generateDragonName(rarity, element) {
  const rarityNames = { C: "幼龍", B: "飛龍", A: "守護龍", S: "星龍", SS: "聖龍", SSS: "神龍" };
  const elementNames = {
    火: "赤焰",
    水: "藍潮",
    木: "翠森",
    風: "疾風",
    雷: "雷鳴",
    土: "岩心",
    光: "晨光",
    暗: "深淵"
  };
  return `${elementNames[element] || "幻彩"}${rarityNames[rarity] || "幼龍"}`;
}

function calculateHatchDragonStat(rarity, base, variance) {
  const power = rarityPower[rarity] || 1;
  return Math.round(base * power + randomInt(0, variance));
}

function getDragonImageByRarity(rarity) {
  return ASSETS.dragons[String(rarity || "C").toLowerCase()] || ASSETS.dragons.c;
}

function homeV2EggImage(egg) {
  const normalized = normalizeInventoryEgg(egg);
  const definition = HATCH_EGG_DEFINITIONS[normalized.type] || HATCH_EGG_DEFINITIONS["normal-egg"];
  return normalized.image || definition.image;
}

function finishAllHatchSlotsForDebug() {
  const now = Date.now();
  let changed = false;
  (state.hatchIsland?.hatchSlots || []).forEach((slot) => {
    if (slot.unlocked && slot.currentEgg && slot.status === "hatching") {
      slot.finishTime = now - 1000;
      slot.status = "ready";
      changed = true;
    }
  });
  if (changed) {
    saveGame();
    renderHomeV2();
    showToast("所有孵化器已立即完成。");
  } else {
    showToast("目前沒有孵化中的龍蛋。");
  }
}

function clearHatchSlotsForDebug() {
  state.hatchIsland = { hatchSlots: createDefaultHatchSlots() };
  syncPersistentAliases();
  saveGame();
  renderHomeV2();
  showToast("孵化器狀態已清除。");
}

function handleDebugAction(event) {
  const button = event.target.closest("[data-debug-action]");
  if (!button) return;

  const action = button.dataset.debugAction;
  if (action === "toggle") {
    toggleDebugPanel();
    return;
  }

  if (action === "coins") {
    state.coins += 10000;
    saveGame();
    render();
    showToast("已增加金幣 +10,000");
  }

  if (action === "diamonds") {
    state.diamonds += 1000;
    saveGame();
    render();
    showToast("已增加鑽石 +1,000");
  }

  if (action === "egg" || action === "addCommonEgg") {
    state.eggInventory.push(createInventoryEgg("normal-egg"));
    syncPersistentAliases();
    saveGame();
    renderHomeV2();
    showToast("已增加普通龍蛋。");
  }

  if (action === "addDarkEgg") {
    state.eggInventory.push(createInventoryEgg("dark-sss-egg"));
    syncPersistentAliases();
    saveGame();
    renderHomeV2();
    showToast("已增加深淵混沌蛋。");
  }

  if (action === "ticketExplore") {
    state.inventory.ticketsExplore += 10;
    saveGame();
    render();
    showToast("已增加探險卷 +10");
  }

  if (action === "ticketMercenary") {
    state.inventory.ticketsMercenary += 10;
    saveGame();
    render();
    showToast("已增加契約券 +10");
  }

  if (action === "readyEgg" || action === "finishHatchSlots") {
    finishAllHatchSlotsForDebug();
  }

  if (action === "clearHatchSlots") {
    clearHatchSlotsForDebug();
  }

  if (action === "dragon") {
    const rarity = els.debugRaritySelect.value;
    const dragon = hatchEggToDragon({ type: "normal-egg", rarity });
    dragon.rarity = rarity;
    dragon.name = generateDragonName(rarity, dragon.element);
    dragon.hp = calculateHatchDragonStat(rarity, 88, 28);
    dragon.attack = calculateHatchDragonStat(rarity, 24, 11);
    dragon.defense = calculateHatchDragonStat(rarity, 18, 8);
    dragon.speed = calculateHatchDragonStat(rarity, 14, 7);
    dragon.image = getDragonImageByRarity(rarity);
    state.dragons.push(dragon);
    state.activeDragonId = dragon.id;
    updateHighestRarity(dragon.rarity);
    state.homeIsland = normalizeHomeIsland(state.homeIsland, state.dragons);
    saveGame();
    render();
    showToast(`已產生 ${dragon.rarity} 龍。`);
  }

  if (action === "clear") {
    localStorage.removeItem(STORAGE_KEY);
    state = createNewState();
    activeTab = "home";
    eggSelectionSlotId = null;
    render();
    showToast("已清除遊戲存檔。");
  }

  renderDebugOutput(action === "assets" ? "assets" : "state");
}

function formatTime(ms) {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function renderWorldHomePage(index) {
  const dragons = state.dragons.slice(0, 5);
  const readySlots = (state.hatchIsland?.hatchSlots || []).filter((slot) => slot.currentEgg && getHatchSlotStatus(slot).ready).length;
  const taskText = readySlots > 0 ? `${readySlots} 顆龍蛋可以領取` : "讓龍寶們在島上休息";

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
      <div class="home-v2-title">
        <h1>休息島</h1>
        <p>龍的休憩花園</p>
      </div>
      <aside class="home-v2-task">
        <b>今日任務</b>
        <span>${escapeHtml(taskText)}</span>
      </aside>
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
                <b>還沒有龍在休息島</b>
                <p>前往龍窟孵化龍蛋，讓牠們來島上散步吧。</p>
              </div>
            `}
          </div>
          <div class="home-v2-mimi npc-guide">
            ${homeV2Image(ASSETS.characters.mimiFull, "Mimi", "Mimi")}
            <span class="mimi-npc-shadow" aria-hidden="true"></span>
            <span class="mimi-npc-bubble">這裡很安全，龍寶們會慢慢恢復精神。</span>
          </div>
        </div>
      </div>
    </section>
  `;
}

// Dragon Cave rebuild: this final definition replaces the older prototype
// markup so the page uses one island overview and one horizontal card scroller.
function renderWorldDragonCavePage(index) {
  const slots = (state.hatchIsland?.hatchSlots || createDefaultHatchSlots()).slice(0, 6);

  return `
    <section class="worldPage dragonCavePage" data-world-index="${index}" aria-label="龍窟">
      <div class="dragon-cave-page">
        <section class="cave-title-panel">
          <h1>龍窟</h1>
          <p>管理龍蛋與孵化器</p>
        </section>

        <section class="hatch-island-section" aria-label="孵蛋島總覽">
          <img
            class="hatch-island-art"
            src="${ASSETS.islands.hatch}"
            alt="孵蛋島"
            decoding="async"
            loading="lazy"
            onerror="if(!this.dataset.fallback){this.dataset.fallback='1';this.src='${ASSETS.islands.rest}'}else{this.hidden=true}"
          >
          ${renderDragonCaveNestLayer()}
          ${renderDragonCaveStatus()}
        </section>

        <section class="hatch-machines-section" aria-label="孵化器列表">
          <div class="section-title">孵化器列表</div>
          <div class="hatch-machines-scroll">
            ${slots.map(renderHomeV2Slot).join("")}
          </div>
          <div class="hatch-dots" aria-hidden="true">
            ${slots.map((_, dotIndex) => `<span class="${dotIndex === 0 ? "is-active" : ""}"></span>`).join("")}
          </div>
        </section>
      </div>
    </section>
  `;
}

function getDragonCaveActiveSlots() {
  return (state.hatchIsland?.hatchSlots || [])
    .filter((slot) => {
      const egg = slot?.currentEgg || slot?.egg;
      if (!slot?.unlocked || !egg) return false;
      const status = getHatchSlotStatus(slot);
      return status.state === "hatching" || status.state === "ready";
    })
    .slice(0, 6);
}

function renderDragonCaveNestLayer() {
  const activeSlots = getDragonCaveActiveSlots();
  const featuredEgg = activeSlots[0]?.currentEgg || activeSlots[0]?.egg || null;

  return `
    <div class="nest-layer">
      <img
        class="nest-art"
        src="${ASSETS.islands.nest}"
        alt=""
        decoding="async"
        loading="lazy"
        onerror="this.hidden=true;this.nextElementSibling.hidden=false"
      >
      <span class="nest-art-placeholder" hidden aria-hidden="true"></span>
      ${featuredEgg ? `
        <img
          class="island-egg-preview"
          src="${homeV2EggImage(featuredEgg)}"
          alt="${escapeHtml(featuredEgg.name || "孵化中的蛋")}"
          decoding="async"
          loading="lazy"
          onerror="this.hidden=true;this.nextElementSibling.hidden=false"
        >
        <span class="island-egg-placeholder" hidden aria-hidden="true"></span>
      ` : ""}
    </div>
  `;
}

function renderDragonCaveStatus() {
  const count = getDragonCaveActiveSlots().length;
  return `<div class="hatch-island-status">目前孵化中：${count}</div>`;
}

function updateHatchIslandOverviewDom() {
  const section = document.querySelector(".dragonCavePage .hatch-island-section");
  if (!section) return;

  const nestLayer = section.querySelector(".nest-layer");
  if (nestLayer) nestLayer.outerHTML = renderDragonCaveNestLayer();

  const status = section.querySelector(".hatch-island-status");
  if (status) status.outerHTML = renderDragonCaveStatus();
}

function renderHomeV2Slot(slot) {
  const status = getHatchSlotStatus(slot);
  const slotNumber = escapeHtml(slot.id?.replace("slot-", "") || "");
  const slotTitle = `孵化器 ${slotNumber}`;

  if (!slot.unlocked || status.state === "locked") {
    return `
      <article class="hatch-slot-card cave-slot-card is-locked" data-slot-id="${slot.id}">
        <header>
          <h3>${slotTitle}</h3>
        </header>
        <div class="cave-slot-visual" aria-hidden="true">
          <span class="slot-lock-icon">🔒</span>
        </div>
        <p class="slot-state">使用 ${formatNumber(slot.unlockCostDiamonds || 0)} 鑽石解鎖</p>
        <button class="cave-slot-button" type="button" data-v2-action="unlock-slot" data-slot-id="${slot.id}">
          解鎖
        </button>
      </article>
    `;
  }

  if (!slot.currentEgg || status.state === "empty") {
    return `
      <article class="hatch-slot-card cave-slot-card is-empty" data-slot-id="${slot.id}">
        <header>
          <h3>${slotTitle}</h3>
        </header>
        <button
          class="cave-slot-visual slot-plus-button"
          type="button"
          data-v2-action="open-egg-modal"
          data-slot-id="${slot.id}"
          aria-label="放入龍蛋"
        >
          <span class="slot-plus-icon">+</span>
        </button>
        <p class="slot-state">點擊放入龍蛋</p>
        <button class="cave-slot-button" type="button" data-v2-action="open-egg-modal" data-slot-id="${slot.id}">
          放入龍蛋
        </button>
      </article>
    `;
  }

  return `
    <article class="hatch-slot-card cave-slot-card is-hatching${status.ready ? " is-ready" : ""}" data-slot-id="${slot.id}">
      <header>
        <h3>${slotTitle}</h3>
      </header>
      <div class="cave-slot-visual" aria-hidden="true">
        <img
          class="slot-egg-image"
          src="${homeV2EggImage(slot.currentEgg)}"
          alt=""
          decoding="async"
          loading="lazy"
          onerror="this.hidden=true;this.nextElementSibling.hidden=false"
        >
        <span class="slot-egg-placeholder" hidden></span>
      </div>
      <b class="slot-egg-name">${escapeHtml(slot.currentEgg.name || "孵化中的蛋")}</b>
      <p class="slot-state">${status.ready ? "可領取" : status.label}</p>
      ${status.ready ? `
        <button class="cave-slot-button is-claim" type="button" data-v2-action="claim-hatch" data-slot-id="${slot.id}">
          領取龍
        </button>
      ` : `
        <div class="slot-progress" aria-hidden="true">
          <i class="slot-progress-fill" style="--p:${status.percent}%"></i>
        </div>
      `}
    </article>
  `;
}

function replaceHatchSlotDom(slotId) {
  const slot = findHatchSlot(slotId);
  const slotElement = findHatchSlotElement(slotId);
  if (!slot || !slotElement) return;
  slotElement.outerHTML = renderHomeV2Slot(slot);
}

function updateHatchSlotProgress(slotId) {
  const slot = findHatchSlot(slotId);
  const slotElement = findHatchSlotElement(slotId);
  if (!slot || !slotElement) return;

  const status = getHatchSlotStatus(slot);
  const shouldReplace =
    status.ready !== slotElement.classList.contains("is-ready") ||
    status.state === "empty" ||
    status.state === "locked";

  if (shouldReplace) {
    replaceHatchSlotDom(slotId);
    updateHatchIslandOverviewDom();
    return;
  }

  const statusText = slotElement.querySelector(".slot-state");
  const progressBar = slotElement.querySelector(".slot-progress-fill");
  if (statusText) statusText.textContent = status.label;
  if (progressBar) progressBar.style.setProperty("--p", `${status.percent}%`);
}

function findHatchSlotElement(slotId) {
  return Array.from(document.querySelectorAll(".hatch-slot-card[data-slot-id]"))
    .find((element) => element.dataset.slotId === slotId) || null;
}
