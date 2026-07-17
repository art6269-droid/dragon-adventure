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
    navDragonHouse: "assets/ui/icon-dragon-house.png",
    navAdventurerGuild: "assets/ui/nav-adventurer-guild.png",
    characterTicket: "assets/ui/icon-character-ticket.png",
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
  tutorial: {
    bgDark: "assets/tutorial/tutorial-bg-dark.png",
    panel: "assets/tutorial/tutorial-panel.png",
    stepBadge: "assets/tutorial/tutorial-step-badge.png"
  },
  explore: {
    volcano: "assets/explore/explore-volcano.png",
    volcanoBg: "assets/explore/explore-volcano-bg.png",
    ocean: "assets/explore/explore-ocean.png",
    oceanBg: "assets/explore/explore-ocean-bg.png",
    forest: "assets/explore/explore-forest.png",
    forestBg: "assets/explore/explore-forest-bg.png",
    rare: "assets/explore/explore-rare.png",
    revealBg: "assets/explore/explore-reveal-bg.png",
    ticket: "assets/explore/explore-ticket.png",
    glow: "assets/explore/explore-glow-effect.png"
  },
  tasks: {
    banner: "assets/tasks/task-banner.png",
    rewardCoin: "assets/tasks/task-reward-coin.png",
    rewardGem: "assets/tasks/task-reward-gem.png",
    rewardTicket: "assets/tasks/task-reward-ticket.png",
    rewardBag: "assets/tasks/task-reward-bag.png"
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
    iconDragonHouse: "assets/ui/icon-dragon-house.png",
    iconDragonSearch: "assets/ui/icon-dragon-search.png",
    iconDragonFilter: "assets/ui/icon-dragon-filter.png",
    iconDragonEmptySlot: "assets/ui/icon-dragon-empty-slot.png",
    iconDragonLockedSlot: "assets/ui/icon-dragon-locked-slot.png",
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
  navDragonHouse: assetPathList(ASSETS.ui.iconDragonHouse, ASSETS.icons.navDragonHouse, ASSETS.icons.dragon),
  navDragonCave: assetPathList(ASSETS.ui.navDragonCave, ASSETS.icons.navDragonCave, ASSETS.icons.navEggs, ASSETS.icons.egg),
  navEquipmentShop: assetPathList(ASSETS.ui.navGearShop, ASSETS.icons.navEquipmentShop, ASSETS.icons.shop),
  navItemShop: assetPathList(ASSETS.ui.navItemShop, ASSETS.icons.navItemShop, ASSETS.icons.bag),
  navEggs: assetPathList(ASSETS.icons.navEggs, ASSETS.icons.egg),
  navExplore: assetPathList(ASSETS.ui.navExplore, ASSETS.icons.navExplore, ASSETS.icons.adventure),
  navGuild: assetPathList(ASSETS.icons.navGuild, ASSETS.icons.dragon),
  navAdventurerGuild: assetPathList(ASSETS.icons.navAdventurerGuild, ASSETS.icons.navGuild, ASSETS.icons.dragon),
  navStage: assetPathList(ASSETS.icons.navStage, ASSETS.icons.pk),
  navQuest: assetPathList(ASSETS.ui.navQuest, ASSETS.icons.navQuest, ASSETS.icons.egg),
  dragonHouseIcon: assetPathList(ASSETS.ui.iconDragonHouse, ASSETS.icons.dragon),
  dragonSearchIcon: assetPathList(ASSETS.ui.iconDragonSearch),
  dragonFilterIcon: assetPathList(ASSETS.ui.iconDragonFilter),
  dragonEmptySlotIcon: assetPathList(ASSETS.ui.iconDragonEmptySlot),
  dragonLockedSlotIcon: assetPathList(ASSETS.ui.iconDragonLockedSlot)
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

const DRAGON_GROWTH_ELEMENTS = ["fire", "water", "wood", "light", "dark"];
const DRAGON_GROWTH_STAGES = ["baby", "youth", "adult", "evolution"];
const DRAGON_ACTIONS = ["idle", "sleep", "walk", "fly", "eat", "train", "attack", "angry"];
const REST_RANDOM_ACTIONS = ["idle", "sleep", "walk", "fly"];
const REST_ISLAND_BOUNDS = { minX: 15, maxX: 85, minY: 35, maxY: 72 };
const REST_ISLAND_MAX_DRAGONS = 6;
const REST_INITIAL_POSITIONS = [
  { x: 24, y: 63, s: 0.94 },
  { x: 50, y: 57, s: 1.02 },
  { x: 73, y: 64, s: 0.88 },
  { x: 35, y: 75, s: 0.76 },
  { x: 64, y: 75, s: 0.74 }
];
const BATTLE_TEAM_LIMIT = 3;
const DRAGON_FALLBACK_ASSET = "assets/dragons/placeholder-dragon.png";
const DRAGON_HOUSE_DEFAULT = {
  baseRows: 5,
  columns: 5,
  purchasedUpgrades: 0,
  maxUpgrades: 10
};
const DRAGON_HOUSE_LEVEL_FILTERS = {
  all: () => true,
  "1-9": (level) => level >= 1 && level <= 9,
  "10-19": (level) => level >= 10 && level <= 19,
  "20-39": (level) => level >= 20 && level <= 39,
  "40+": (level) => level >= 40
};
const EGG_RARITY_RATES = [
  { rarity: "C", rate: 45 },
  { rarity: "B", rate: 28 },
  { rarity: "A", rate: 15 },
  { rarity: "S", rate: 7 },
  { rarity: "SS", rate: 4 },
  { rarity: "SSS", rate: 1 }
];
const TUTORIAL_STEPS = [
  {
    title: "歡迎來到《龍的冒險》！",
    body: "我是 Mimi，接下來我會陪你一起認識這座充滿驚喜的龍之世界！"
  },
  {
    title: "這裡是龍之島，也就是休息島。",
    body: "只要龍蛋成功孵化，龍寶寶就會回到這裡休息、活動，這裡就是牠們的家。"
  },
  {
    title: "想得到龍蛋嗎？當然要先去探險啦！",
    body: "我先送你 3 張「探險券」，接下來就要靠你自己努力囉！",
    grantExploreTickets: 3
  },
  {
    title: "請點擊下方的「探險」。",
    body: "你可以前往火山、海洋或森林探索龍蛋。偶爾，也可能遇見稀有的光屬性或暗屬性龍蛋喔！",
    navTarget: "explore"
  },
  {
    title: "恭喜你！你已經成功取得龍蛋了。",
    body: "接下來準備把牠帶回來孵化吧！"
  },
  {
    title: "現在請回到「孵蛋島」。",
    body: "把剛剛拿到的龍蛋放進孵化器中。",
    navTarget: "dragonCave"
  },
  {
    title: "孵出來啦！",
    body: "接下來請好好照顧你的龍寶寶，陪伴牠長大，直到牠可以出戰冒險！"
  }
];
const BEGINNER_MISSION_DEFS = [
  { id: "getEgg", title: "取得龍蛋", target: 1, reward: { coins: 200 } },
  { id: "goHatchIsland", title: "回到孵蛋島", target: 1, reward: { diamonds: 10 } },
  { id: "putInIncubator", title: "放入孵化器", target: 1, reward: { ticketsExplore: 1 } },
  { id: "finishHatch", title: "完成孵化", target: 1, reward: { coins: 300 } },
  { id: "feedOnce", title: "餵食 1 次", target: 1, reward: { diamonds: 10 } },
  { id: "trainOnce", title: "訓練 1 次", target: 1, reward: { ticketsExplore: 1 } },
  { id: "growBattleReady", title: "成長至可出戰", target: 1, reward: { items: { mysteryBag: 1 } } }
];
const MISSION_CHAPTERS = [
  {
    id: "chapter1",
    title: "第一章",
    subtitle: "龍寶寶誕生",
    missionIds: ["getEgg", "goHatchIsland", "putInIncubator", "finishHatch"]
  },
  {
    id: "chapter2",
    title: "第二章",
    subtitle: "成長與出戰",
    missionIds: ["feedOnce", "trainOnce", "growBattleReady"]
  }
];
const BEGINNER_FINAL_REWARD = {
  coins: 1000,
  diamonds: 50,
  ticketsExplore: 5,
  items: { mysteryBag: 1 }
};
const EXPLORE_AREAS = [
  {
    id: "volcano",
    name: "火山",
    mainElement: "fire",
    description: "偏火屬性龍蛋",
    icon: ASSETS.explore.volcano,
    bg: ASSETS.explore.volcanoBg,
    ticketCost: 1
  },
  {
    id: "ocean",
    name: "海洋",
    mainElement: "water",
    description: "偏水屬性龍蛋",
    icon: ASSETS.explore.ocean,
    bg: ASSETS.explore.oceanBg,
    ticketCost: 1
  },
  {
    id: "forest",
    name: "森林",
    mainElement: "wood",
    description: "偏木屬性龍蛋",
    icon: ASSETS.explore.forest,
    bg: ASSETS.explore.forestBg,
    ticketCost: 1
  }
];
const ADVENTURER_RARITY_RATES = [
  { rarity: "C", rate: 45 },
  { rarity: "B", rate: 28 },
  { rarity: "A", rate: 15 },
  { rarity: "S", rate: 7 },
  { rarity: "SS", rate: 4 },
  { rarity: "SSS", rate: 1 }
];
const ADVENTURER_SUMMON_DIAMOND_COST = 30;
const ADVENTURER_SELL_PRICES = { C: 100, B: 200, A: 500, S: 1200, SS: 3000, SSS: 8000 };
const ADVENTURER_MAX_LEVEL = 100;
const ADVENTURER_TEAM_SIZE = 4;
const EQUIPMENT_SHOP_REFRESH_MS = 2 * 60 * 60 * 1000;
const EQUIPMENT_SLOTS = ["head", "body", "legs", "weapon", "offhand", "ring", "necklace", "petContract"];
const EQUIPMENT_SLOT_LABELS = {
  head: "頭部",
  body: "身體",
  legs: "褲子",
  weapon: "武器",
  offhand: "副手",
  ring: "戒指",
  necklace: "項鍊",
  petContract: "寵物契約"
};
const EQUIPMENT_SLOT_FOLDERS = { petContract: "pet-contract" };
const EQUIPMENT_SHOP_RARITY_RATES = [
  { rarity: "A", rate: 70 },
  { rarity: "S", rate: 22 },
  { rarity: "SS", rate: 7 },
  { rarity: "SSS", rate: 1 }
];
const EQUIPMENT_BASE_PRICES = { A: 800, S: 1800, SS: 4500, SSS: 12000 };
const EQUIPMENT_SLOT_PRICE_MULTIPLIERS = {
  head: 1,
  body: 1.2,
  legs: 1,
  weapon: 1.4,
  offhand: 1.2,
  ring: 1.1,
  necklace: 1.1,
  petContract: 1.5
};
const EQUIPMENT_RARITY_STAT_RANGES = {
  A: [8, 16],
  S: [18, 28],
  SS: [30, 48],
  SSS: [55, 85]
};
const EQUIPMENT_ELEMENTS = ["fire", "water", "wood", "light", "dark"];
const EQUIPMENT_NAMES = {
  fire: { head: "赤焰頭盔", body: "熔岩戰甲", legs: "火紋戰褲", weapon: "烈焰長劍", offhand: "炎龍護盾", ring: "火晶戒指", necklace: "赤紅項鍊", petContract: "火靈契約" },
  water: { head: "潮汐冠冕", body: "深海法袍", legs: "流水護腿", weapon: "滄浪法杖", offhand: "海晶副手", ring: "藍潮戒指", necklace: "海洋項鍊", petContract: "水靈契約" },
  wood: { head: "森語兜帽", body: "古木護甲", legs: "藤蔓長褲", weapon: "翠葉短弓", offhand: "樹靈圖騰", ring: "綠芽戒指", necklace: "生命項鍊", petContract: "森靈契約" },
  light: { head: "晨曦聖冠", body: "聖耀鎧甲", legs: "光羽護腿", weapon: "日輪聖劍", offhand: "光明法典", ring: "星光戒指", necklace: "曙光項鍊", petContract: "天使契約" },
  dark: { head: "深淵面具", body: "暗夜長袍", legs: "影行護腿", weapon: "黑月匕首", offhand: "虛空魔典", ring: "暗影戒指", necklace: "黑曜項鍊", petContract: "魔獸契約" }
};
const GAME_CONFIG_URL = "config/game-config.json";
const DEFAULT_PAGE_ADMIN_CONFIG = {
  enabled: true,
  contentScale: 1,
  backgroundScale: 1,
  backgroundX: 50,
  backgroundY: 50,
  contentTop: 0,
  contentLeft: 0,
  contentWidth: 100,
  contentHeight: 100,
  paddingTop: 0,
  paddingBottom: 0,
  cardWidth: 100,
  cardHeight: 112,
  cardGap: 12,
  iconSize: 48,
  textScale: 1,
  panelOpacity: 0.92,
  panelRadius: 18,
  goldBorder: 2,
  navHeight: 92,
  scrollable: true,
  mimiWidth: 88,
  mimiBottom: 14,
  mimiAvatar: 54
};
const DEFAULT_GAME_CONFIG = {
  version: 1,
  features: {
    home: true,
    hatchery: true,
    dragonHouse: true,
    equipmentShop: true,
    itemShop: true,
    explore: true,
    adventurerGuild: true,
    missions: true,
    adventure: false
  },
  pages: Object.fromEntries(Array.from({ length: 9 }, (_, index) => [
    `page${String(index + 1).padStart(2, "0")}`,
    { ...DEFAULT_PAGE_ADMIN_CONFIG }
  ])),
  gacha: {
    adventurer: {
      rarities: Object.fromEntries(ADVENTURER_RARITY_RATES.map((entry) => [entry.rarity, entry.rate])),
      elements: { fire: 20, water: 20, wood: 20, light: 20, dark: 20 },
      diamondCost: ADVENTURER_SUMMON_DIAMOND_COST
    },
    egg: {
      rarities: { C: 45, B: 28, A: 15, S: 7, SS: 4, SSS: 1 },
      elements: { fire: 28, water: 28, wood: 28, light: 8, dark: 8 }
    }
  },
  sprites: {
    adventurers: { guildScale: 1, mapScale: 1, portraitScale: 1, anchorX: 0.5, anchorY: 1 },
    dragons: { stageScale: { baby: 0.88, youth: 0.94, adult: 1, evolution: 1.08 }, mapScale: 1, restIslandScale: 1, hatchIslandScale: 1, detailScale: 1, wrapperWidth: 68, wrapperHeight: 68, anchorX: 0.5, anchorY: 1 }
  },
  ui: {
    topHudHeight: 72, coinWidth: 132, diamondWidth: 132, settingsSize: 48,
    bottomNavHeight: 92, bottomNavIconSize: 42, bottomNavGap: 8,
    cardRadius: 18, goldBorderWidth: 2, buttonHeight: 44, buttonFontSize: 15,
    mimiAvatarSize: 54, mimiDialogueHeight: 72, modalWidth: 390, modalTop: 82,
    overlayOpacity: 0.72, toastBottom: 116, scrollbarMode: "hidden"
  },
  economy: {
    adventurerSummonDiamonds: 30, exploreTicketCost: 1, defaultHatchSeconds: 90,
    equipmentShopRefreshMinutes: 120, equipmentPriceMultiplier: 1, feedExp: 5, trainExp: 20,
    incubatorUnlockPrices: [0, 0, 100, 200, 300, 500],
    beginnerRewards: { tutorialExploreTickets: 3, final: { ...BEGINNER_FINAL_REWARD } },
    missionRewards: Object.fromEntries(BEGINNER_MISSION_DEFS.map((mission) => [mission.id, { ...mission.reward }])),
    adventurerSellPrices: { ...ADVENTURER_SELL_PRICES },
    dragonSellPrices: { C: 50, B: 100, A: 200, S: 400, SS: 800, SSS: 1500 },
    upgrade: { baseCost: 100, levelCost: 80, baseExp: 100, levelExp: 50 }
  },
  adventure: { enabled: false, chapterCount: 1, stagesPerChapter: 10, enemyLevelMultiplier: 1, recommendedPower: 100, staminaCost: 5, coinDrop: 50, expDrop: 30, equipmentDropRate: 10, equipmentRarityRates: { C: 45, B: 28, A: 15, S: 7, SS: 4, SSS: 1 }, bossRate: 10, autoBattle: false, battleSpeed: 1, teamSize: 4 }
};
let gameConfig = JSON.parse(JSON.stringify(DEFAULT_GAME_CONFIG));

function mergeGameConfig(base, override) {
  if (!override || typeof override !== "object" || Array.isArray(override)) return base;
  const merged = { ...base };
  Object.entries(override).forEach(([key, value]) => {
    merged[key] = value && typeof value === "object" && !Array.isArray(value)
      ? mergeGameConfig(base?.[key] && typeof base[key] === "object" ? base[key] : {}, value)
      : value;
  });
  return merged;
}

function renderWorldAdventureAdminPage(index) {
  const enabled = Boolean(gameConfig.features?.adventure && gameConfig.adventure?.enabled);
  if (!enabled) {
    return renderWorldPlaceholderPage(index, "adventurePage", "冒險", "冒險功能準備中", [
      ["世界地圖", "功能完成後可從後台啟用"],
      ["隊伍出戰", "目前不會消耗體力或改動玩家資料"]
    ]);
  }
  const settings = gameConfig.adventure || {};
  return renderWorldPlaceholderPage(index, "adventurePage", "冒險", "帶領隊伍探索新的關卡", [
    ["地圖章節", `${Number(settings.chapterCount) || 1} 章，每章 ${Number(settings.stagesPerChapter) || 10} 關`],
    ["推薦戰力", formatNumber(Number(settings.recommendedPower) || 0)],
    ["體力消耗", `${Number(settings.staminaCost) || 0} 點`],
    ["戰鬥設定", `${settings.autoBattle ? "自動戰鬥" : "手動戰鬥"} / ${Number(settings.battleSpeed) || 1} 倍速`]
  ]);
}

function getAdminWorldPages() {
  const pages = [
    { id: "home", configKey: "page01", featureKey: "home", label: "家", title: "龍之島", icon: "家", assetKey: "navHome", className: "homePage", render: renderWorldHomePage },
    { id: "dragonHouse", configKey: "page02", featureKey: "dragonHouse", label: "龍舍", title: "龍舍", icon: "龍", assetKey: "navDragonHouse", className: "dragonHousePage", render: renderWorldDragonHousePage },
    { id: "dragonCave", configKey: "page03", featureKey: "hatchery", label: "孵蛋島", title: "孵蛋島", icon: "蛋", assetKey: "navDragonCave", className: "dragonCavePage", render: renderWorldDragonCavePage },
    { id: "equipment", configKey: "page04", featureKey: "equipmentShop", label: "裝備商店", title: "裝備商店", icon: "裝", assetKey: "navEquipmentShop", className: "equipmentShopPage", render: renderWorldEquipmentShopPage },
    { id: "items", configKey: "page05", featureKey: "itemShop", label: "道具商店", title: "道具商店", icon: "物", assetKey: "navItemShop", className: "itemShopPage", render: (index) => renderWorldPlaceholderPage(index, "itemShopPage", "道具商店", "準備旅途中需要的補給", [["恢復道具", "補充冒險所需資源"], ["成長道具", "陪伴龍與冒險者成長"]]) },
    { id: "explore", configKey: "page06", featureKey: "explore", label: "探索", title: "探索", icon: "探", assetKey: "navExplore", className: "explorePage", render: renderWorldExplorePage },
    { id: "adventurerGuild", configKey: "page07", featureKey: "adventurerGuild", label: "冒險者工會", title: "冒險者工會", icon: "會", assetKey: "navAdventurerGuild", className: "adventurerGuildPage", render: renderWorldAdventurerGuildPage },
    { id: "quest", configKey: "page08", featureKey: "missions", label: "任務", title: "任務", icon: "任", assetKey: "navQuest", className: "questPage", render: renderWorldQuestPage },
    { id: "adventure", configKey: "page09", featureKey: "adventure", label: "冒險", title: "冒險", icon: "戰", assetKey: "navExplore", className: "adventurePage", render: renderWorldAdventureAdminPage }
  ];
  const enabled = pages.filter((page) => {
    if (gameConfig.pages?.[page.configKey]?.enabled === false) return false;
    if (page.id === "adventure") return true;
    return gameConfig.features?.[page.featureKey] !== false;
  });
  return enabled.length ? enabled : [pages[0]];
}

async function loadGameConfig() {
  try {
    const configUrl = new URL(GAME_CONFIG_URL, document.baseURI || window.location.href);
    const response = await fetch(configUrl.href, { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    gameConfig = mergeGameConfig(JSON.parse(JSON.stringify(DEFAULT_GAME_CONFIG)), await response.json());
  } catch (error) {
    console.warn("遊戲設定載入失敗，使用安全預設值。", error);
    gameConfig = JSON.parse(JSON.stringify(DEFAULT_GAME_CONFIG));
  }
  applyGameConfigCssVariables();
  return gameConfig;
}

function gameConfigNumber(path, fallback) {
  const value = path.split(".").reduce((current, key) => current?.[key], gameConfig);
  return Number.isFinite(Number(value)) ? Number(value) : fallback;
}

function applyGameConfigCssVariables() {
  const ui = gameConfig.ui || {};
  const root = document.documentElement;
  const variables = {
    "--admin-top-hud-height": `${gameConfigNumber("ui.topHudHeight", 72)}px`,
    "--admin-coin-width": `${gameConfigNumber("ui.coinWidth", 132)}px`,
    "--admin-diamond-width": `${gameConfigNumber("ui.diamondWidth", 132)}px`,
    "--admin-settings-size": `${gameConfigNumber("ui.settingsSize", 48)}px`,
    "--bottom-nav-height": `${gameConfigNumber("ui.bottomNavHeight", 92)}px`,
    "--admin-nav-icon-size": `${gameConfigNumber("ui.bottomNavIconSize", 42)}px`,
    "--admin-nav-gap": `${gameConfigNumber("ui.bottomNavGap", 8)}px`,
    "--admin-card-radius": `${gameConfigNumber("ui.cardRadius", 18)}px`,
    "--admin-gold-border": `${gameConfigNumber("ui.goldBorderWidth", 2)}px`,
    "--admin-button-height": `${gameConfigNumber("ui.buttonHeight", 44)}px`,
    "--admin-button-font-size": `${gameConfigNumber("ui.buttonFontSize", 15)}px`,
    "--admin-mimi-avatar-size": `${gameConfigNumber("ui.mimiAvatarSize", 54)}px`,
    "--admin-mimi-dialogue-height": `${gameConfigNumber("ui.mimiDialogueHeight", 72)}px`,
    "--admin-modal-width": `${gameConfigNumber("ui.modalWidth", 390)}px`,
    "--admin-modal-top": `${gameConfigNumber("ui.modalTop", 82)}px`,
    "--admin-overlay-opacity": String(gameConfigNumber("ui.overlayOpacity", 0.72)),
    "--admin-toast-bottom": `${gameConfigNumber("ui.toastBottom", 116)}px`,
    "--admin-dragon-baby-scale": String(gameConfigNumber("sprites.dragons.stageScale.baby", 0.88)),
    "--admin-dragon-youth-scale": String(gameConfigNumber("sprites.dragons.stageScale.youth", 0.94)),
    "--admin-dragon-adult-scale": String(gameConfigNumber("sprites.dragons.stageScale.adult", 1)),
    "--admin-dragon-evolution-scale": String(gameConfigNumber("sprites.dragons.stageScale.evolution", 1.08)),
    "--admin-adventurer-guild-scale": String(gameConfigNumber("sprites.adventurers.guildScale", 1)),
    "--admin-adventurer-map-scale": String(gameConfigNumber("sprites.adventurers.mapScale", 1)),
    "--admin-adventurer-portrait-scale": String(gameConfigNumber("sprites.adventurers.portraitScale", 1)),
    "--admin-dragon-wrapper-width": `${gameConfigNumber("sprites.dragons.wrapperWidth", 68)}px`,
    "--admin-dragon-wrapper-height": `${gameConfigNumber("sprites.dragons.wrapperHeight", 68)}px`
  };
  Object.entries(variables).forEach(([name, value]) => root.style.setProperty(name, value));
  root.dataset.adminScrollbar = ui.scrollbarMode || "hidden";
}

function applyGameConfigToRenderedPages() {
  getWorldPages().forEach((page, index) => {
    const element = document.querySelector(`.worldPage[data-world-index="${index}"]`);
    if (!element) return;
    const pageConfig = gameConfig.pages?.[page.configKey] || DEFAULT_PAGE_ADMIN_CONFIG;
    element.dataset.adminPage = page.configKey;
    element.dataset.adminScrollable = pageConfig.scrollable === false ? "false" : "true";
    const values = {
      "--page-content-scale": pageConfig.contentScale,
      "--page-background-scale": pageConfig.backgroundScale,
      "--page-background-x": `${pageConfig.backgroundX}%`,
      "--page-background-y": `${pageConfig.backgroundY}%`,
      "--page-content-top": `${pageConfig.contentTop}px`,
      "--page-content-left": `${pageConfig.contentLeft}px`,
      "--page-content-width": `${pageConfig.contentWidth}%`,
      "--page-content-height": `${pageConfig.contentHeight}%`,
      "--page-padding-top": `${pageConfig.paddingTop}px`,
      "--page-padding-bottom": `${pageConfig.paddingBottom}px`,
      "--page-card-width": `${pageConfig.cardWidth}%`,
      "--page-card-height": `${pageConfig.cardHeight}px`,
      "--page-card-gap": `${pageConfig.cardGap}px`,
      "--page-icon-size": `${pageConfig.iconSize}px`,
      "--page-text-scale": pageConfig.textScale,
      "--page-panel-opacity": pageConfig.panelOpacity,
      "--page-panel-radius": `${pageConfig.panelRadius}px`,
      "--page-gold-border": `${pageConfig.goldBorder}px`
    };
    Object.entries(values).forEach(([name, value]) => element.style.setProperty(name, String(value)));
  });
  applyActivePageConfig(currentWorldPage);
}

function applyActivePageConfig(index = 0) {
  const page = getWorldPages()[Number(index) || 0];
  const pageConfig = gameConfig.pages?.[page?.configKey] || DEFAULT_PAGE_ADMIN_CONFIG;
  const root = document.documentElement;
  root.style.setProperty("--bottom-nav-height", `${Number(pageConfig.navHeight) || gameConfigNumber("ui.bottomNavHeight", 92)}px`);
  root.style.setProperty("--admin-mimi-width", `${Number(pageConfig.mimiWidth) || 88}vw`);
  root.style.setProperty("--admin-mimi-bottom", `${Number(pageConfig.mimiBottom) || 14}px`);
  root.style.setProperty("--admin-mimi-avatar-size", `${Number(pageConfig.mimiAvatar) || gameConfigNumber("ui.mimiAvatarSize", 54)}px`);
}

function installDragonAdminPreviewBridge() {
  if (window.__dragonAdminPreviewBound) return;
  window.__dragonAdminPreviewBound = true;
  window.addEventListener("message", (event) => {
    let sourceUrl;
    try { sourceUrl = new URL(event.origin); } catch { return; }
    if (!["localhost", "127.0.0.1"].includes(sourceUrl.hostname)) return;
    if (event.data?.type !== "dragon-admin-preview" || !event.data.config) return;
    gameConfig = mergeGameConfig(JSON.parse(JSON.stringify(DEFAULT_GAME_CONFIG)), event.data.config);
    applyGameConfigCssVariables();
    applyGameConfigToRenderedPages();
  });
}
const EXCLUSIVE_SKILL_COUNT = { C: 0, B: 0, A: 0, S: 1, SS: 2, SSS: 3 };
const ADVENTURER_INDEX_URL = "assets/adventurers/index.json";
const ADVENTURER_SHARED_ASSETS = {
  card: "assets/adventurers/_shared/card-placeholder.png",
  portrait: "assets/adventurers/_shared/portrait-placeholder.png",
  icon: "assets/adventurers/_shared/icon-placeholder.png",
  sprite: "assets/adventurers/_shared/sprite-placeholder.png"
};
const ADVENTURER_TEMPLATE_MIGRATION = {
  "newbie-swordman-c-fire": "c-fire-0001",
  "apprentice-archer-c-wood": "c-wood-0001",
  "flame-fist-b-fire": "b-fire-0001",
  "aqua-mage-b-water": "b-water-0001",
  "forest-assassin-a-wood": "a-wood-0001",
  "light-pastor-a-light": "a-light-0001",
  "crimson-knight-s-fire": "s-fire-0001",
  "azure-sorcerer-s-water": "s-water-0001",
  "holy-guardian-ss-light": "ss-light-0001",
  "shadow-hunter-ss-dark": "ss-dark-0001",
  "alon-sss-fire": "sss-fire-0001",
  "alon_sss_fire": "sss-fire-0001",
  "star-dragonlord-sss-light": "sss-light-0001",
  "star_dragonlord_sss_light": "sss-light-0001",
  "shadow_hunter_ss_dark": "ss-dark-0001"
};
let adventurerTemplates = [];
let adventurerTemplatesById = new Map();
let adventurerDataState = {
  status: "idle",
  error: null,
  usingFallback: false,
  failedEntries: []
};
const CONTENT_CATALOG_URL = "assets/data/content-catalog.json";
const contentCatalog = {
  loaded: false,
  dragons: [],
  eggs: [],
  adventurers: [],
  islands: []
};

async function loadContentCatalog() {
  try {
    const response = await fetch(CONTENT_CATALOG_URL, { cache: "no-cache" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const catalog = await response.json();
    contentCatalog.dragons = Array.isArray(catalog.dragons) ? catalog.dragons : [];
    contentCatalog.eggs = Array.isArray(catalog.eggs) ? catalog.eggs : [];
    contentCatalog.adventurers = Array.isArray(catalog.adventurers) ? catalog.adventurers : [];
    contentCatalog.islands = Array.isArray(catalog.islands) ? catalog.islands : [];
    contentCatalog.loaded = true;
  } catch (error) {
    console.warn("內容目錄載入失敗，改用內建相容資料。", error);
  }
}

function resolveGameUrl(path, baseUrl = document.baseURI || window.location.href) {
  try {
    return new URL(String(path || ""), baseUrl).href;
  } catch (error) {
    console.warn("[Adventurer URL] 無法解析路徑", path, baseUrl, error);
    return String(path || "");
  }
}

function resolveAdventurerRelativePath(basePath, assetPath, fallback) {
  const value = String(assetPath || "").replace(/\\/g, "/");
  if (!value) return fallback;
  if (/^(?:https?:|data:|blob:)/i.test(value)) return value;
  if (value.startsWith("/") || value.startsWith("assets/")) {
    return resolveGameUrl(value, document.baseURI || window.location.href);
  }
  return resolveGameUrl(value.replace(/^\.\//, ""), basePath || document.baseURI || window.location.href);
}

function resolveTemplateAsset(template, assetPath, fallback = ADVENTURER_SHARED_ASSETS.card) {
  return resolveAdventurerRelativePath(template?.__baseUrl || template?.assetRoot, assetPath, fallback);
}

function migrateAdventurerTemplateId(templateId) {
  const value = String(templateId || "").trim();
  return ADVENTURER_TEMPLATE_MIGRATION[value] || value.toLowerCase();
}

function prepareAdventurerTemplate(source, dataPath) {
  const normalizedDataPath = String(source?.__dataUrl || dataPath || "").replace(/\\/g, "/");
  const assetRoot = source?.__baseUrl
    || resolveGameUrl("./", normalizedDataPath || document.baseURI || window.location.href);
  const templateId = migrateAdventurerTemplateId(source?.id || source?.templateId);
  const animations = source?.animations && typeof source.animations === "object" ? source.animations : {};
  const animationFrames = {};
  Object.entries(animations).forEach(([action, config]) => {
    const count = Math.max(0, Math.floor(Number(config?.frameCount) || 0));
    const folder = resolveAdventurerRelativePath(assetRoot, config?.folder || `sprites/${action}`, "");
    if (!folder || count <= 0) return;
    animationFrames[action] = Array.from({ length: count }, (_, index) => (
      `${folder.replace(/\/$/, "")}/${action}-${String(index + 1).padStart(2, "0")}.png`
    ));
  });
  const growth = source?.growth && typeof source.growth === "object" ? source.growth : {};
  const base = growth.base && typeof growth.base === "object" ? growth.base : {};
  const template = {
    ...source,
    id: templateId,
    templateId,
    number: String(source?.number || templateId.split("-").at(-1) || ""),
    rarity: String(source?.rarity || templateId.split("-")[0] || "C").toUpperCase(),
    element: String(source?.element || templateId.split("-")[1] || "fire").toLowerCase(),
    dataPath: normalizedDataPath,
    assetRoot,
    __dataUrl: normalizedDataPath,
    __baseUrl: assetRoot,
    cardAsset: resolveAdventurerRelativePath(assetRoot, source?.assets?.card, ADVENTURER_SHARED_ASSETS.card),
    portraitAsset: resolveAdventurerRelativePath(assetRoot, source?.assets?.portrait, ADVENTURER_SHARED_ASSETS.portrait),
    iconAsset: resolveAdventurerRelativePath(assetRoot, source?.assets?.icon, ADVENTURER_SHARED_ASSETS.icon),
    animations,
    animationFrames,
    actions: animationFrames,
    skills: Array.isArray(source?.skills) ? source.skills : [],
    growth: {
      base: {
        hp: positiveNumber(base.hp, 80),
        attack: positiveNumber(base.attack, 18),
        defense: positiveNumber(base.defense, 14),
        speed: positiveNumber(base.speed, 14)
      },
      perLevel: {
        hp: normalizedNonNegative(growth.perLevel?.hp, 7),
        attack: normalizedNonNegative(growth.perLevel?.attack, 2),
        defense: normalizedNonNegative(growth.perLevel?.defense, 1.2),
        speed: normalizedNonNegative(growth.perLevel?.speed, 0.7)
      },
      variance: {
        min: clamp(Number(growth.variance?.min) || 0.9, 0.5, 1.5),
        max: clamp(Number(growth.variance?.max) || 1.1, 0.5, 1.5)
      }
    }
  };
  template.baseStats = { ...template.growth.base };
  template.basePower = Math.max(1, Math.round(
    template.growth.base.hp * 0.25
    + template.growth.base.attack * 2
    + template.growth.base.defense * 1.5
    + template.growth.base.speed * 1.2
  ));
  return template;
}

function validateAdventurerTemplate(template) {
  const warnings = [];
  const validRarities = ["C", "B", "A", "S", "SS", "SSS"];
  const validElements = ["fire", "water", "wood", "light", "dark"];
  if (!template?.templateId) warnings.push("缺少 id");
  if (!validRarities.includes(template?.rarity)) warnings.push("rarity 無效");
  if (!validElements.includes(template?.element)) warnings.push("element 無效");
  if (!/^\d{4}$/.test(String(template?.number || ""))) warnings.push("number 必須是四位數");
  if (!template?.name) warnings.push("缺少名稱");
  if (!template?.growth?.base || !template?.growth?.perLevel || !template?.growth?.variance) warnings.push("growth 不完整");
  if (!template?.cardAsset || !template?.portraitAsset || !template?.iconAsset) warnings.push("assets 不完整");
  if (!template?.animations?.idle || !template?.animationFrames?.idle?.length) warnings.push("缺少 idle 動畫");
  if (Array.isArray(template?.missingAssets) && template.missingAssets.length) {
    warnings.push(`缺少素材：${template.missingAssets.join("、")}`);
  }
  const expectedSkills = EXCLUSIVE_SKILL_COUNT[template?.rarity] || 0;
  if (["S", "SS", "SSS"].includes(template?.rarity) && template.skills.length !== expectedSkills) {
    warnings.push(`${template.rarity} 應有 ${expectedSkills} 個專有技能，目前為 ${template.skills.length}`);
  }
  if (warnings.length) {
    console.warn(`[adventurer template] ${template?.templateId || template?.dataPath || "unknown"}`, warnings);
  }
  return warnings;
}

function setAdventurerTemplateRegistry(templates) {
  adventurerTemplates = Array.isArray(templates) ? templates.filter(Boolean) : [];
  adventurerTemplatesById = new Map(adventurerTemplates.map((template) => [template.templateId, template]));
  contentCatalog.adventurers = adventurerTemplates;
}

function createFallbackAdventurerTemplates() {
  const sharedAssets = {
    card: ADVENTURER_SHARED_ASSETS.card,
    portrait: ADVENTURER_SHARED_ASSETS.portrait,
    icon: ADVENTURER_SHARED_ASSETS.icon
  };
  const sources = [
    { id: "c-fire-fallback", number: "9001", name: "新人劍士", rarity: "C", element: "fire", job: "劍士", growth: { base: { hp: 82, attack: 18, defense: 13, speed: 14 }, perLevel: { hp: 7, attack: 2, defense: 1.2, speed: 0.7 }, variance: { min: 0.9, max: 1.1 } } },
    { id: "c-wood-fallback", number: "9002", name: "見習弓手", rarity: "C", element: "wood", job: "弓手", growth: { base: { hp: 74, attack: 20, defense: 11, speed: 18 }, perLevel: { hp: 6, attack: 2.2, defense: 1, speed: 0.9 }, variance: { min: 0.9, max: 1.1 } } },
    { id: "b-water-fallback", number: "9003", name: "水靈法師", rarity: "B", element: "water", job: "法師", growth: { base: { hp: 80, attack: 25, defense: 12, speed: 16 }, perLevel: { hp: 7, attack: 2.7, defense: 1.1, speed: 0.8 }, variance: { min: 0.9, max: 1.1 } } },
    { id: "s-fire-fallback", number: "9004", name: "赤焰騎士", rarity: "S", element: "fire", job: "騎士", growth: { base: { hp: 112, attack: 33, defense: 24, speed: 18 }, perLevel: { hp: 10, attack: 3.5, defense: 2.2, speed: 0.9 }, variance: { min: 0.9, max: 1.1 } }, skills: [{ id: "skill-01", name: "赤焰斬", type: "active", element: "fire", power: 150, cooldown: 3, unlockLevel: 1 }] }
  ];

  return sources.map((source) => {
    const template = prepareAdventurerTemplate({
      ...source,
      description: "冒險者索引暫時無法使用時提供的備援角色。",
      maxLevel: 100,
      assets: sharedAssets,
      animations: {},
      skills: source.skills || []
    }, resolveGameUrl(`assets/adventurers/_fallback/${source.id}/data.json`));
    template.animationFrames = { idle: [resolveGameUrl(ADVENTURER_SHARED_ASSETS.sprite)] };
    template.actions = template.animationFrames;
    template.isFallback = true;
    return template;
  });
}

async function loadAdventurerTemplates(options = {}) {
  const allowFallback = options.allowFallback !== false;
  adventurerDataState.status = "loading";
  adventurerDataState.error = null;
  adventurerDataState.usingFallback = false;
  adventurerDataState.failedEntries = [];

  try {
    const indexUrl = new URL(ADVENTURER_INDEX_URL, document.baseURI || window.location.href);
    const response = await fetch(indexUrl.href, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`冒險者索引載入失敗：${response.status} ${indexUrl.href}`);
    }
    const index = await response.json();
    const entries = Array.isArray(index.characters) ? index.characters : [];
    const results = await Promise.allSettled(entries.map(async (entry) => {
      const dataUrl = new URL(String(entry.path || ""), indexUrl);
      const dataResponse = await fetch(dataUrl.href, { cache: "no-store" });
      if (!dataResponse.ok) {
        throw new Error(`${entry.id || entry.path} 載入失敗：${dataResponse.status} ${dataUrl.href}`);
      }
      const source = await dataResponse.json();
      return prepareAdventurerTemplate({
        ...source,
        __dataUrl: dataUrl.href,
        __baseUrl: new URL("./", dataUrl).href,
        missingAssets: Array.isArray(entry.missingAssets) ? entry.missingAssets : []
      }, dataUrl.href);
    }));
    const loaded = [];
    results.forEach((result, indexPosition) => {
      if (result.status === "fulfilled") {
        validateAdventurerTemplate(result.value);
        loaded.push(result.value);
      } else {
        const failure = { entry: entries[indexPosition], error: result.reason };
        adventurerDataState.failedEntries.push(failure);
        console.warn("[Adventurer load failed]", failure.entry, failure.error);
      }
    });
    if (!loaded.length) throw new Error("沒有任何可用的冒險者資料");

    setAdventurerTemplateRegistry(loaded);
    adventurerDataState.status = "ready";
    return loaded;
  } catch (error) {
    console.error("冒險者資料初始化失敗", error);
    adventurerDataState.error = error?.message || "角色資料載入失敗";
    if (allowFallback) {
      const fallbackTemplates = createFallbackAdventurerTemplates();
      if (fallbackTemplates.length) {
        console.warn("正在使用冒險者備援角色池");
        setAdventurerTemplateRegistry(fallbackTemplates);
        adventurerDataState.status = "ready";
        adventurerDataState.usingFallback = true;
        return fallbackTemplates;
      }
    }
    setAdventurerTemplateRegistry([]);
    adventurerDataState.status = "error";
    return [];
  }
}

async function retryLoadAdventurers() {
  adventurerDataState.status = "loading";
  adventurerDataState.error = null;
  refreshAdventurerGuildPage();
  const templates = await loadAdventurerTemplates({ allowFallback: false });
  if (templates.length) ensureValidState();
  refreshAdventurerGuildPage();
  return templates.length > 0;
}

function getAdventurerTemplatePool() {
  return adventurerTemplates;
}

window.debugAdventurerLoader = function debugAdventurerLoader() {
  return {
    status: adventurerDataState.status,
    error: adventurerDataState.error,
    usingFallback: adventurerDataState.usingFallback,
    templateCount: adventurerTemplates.length,
    failedCount: adventurerDataState.failedEntries.length
  };
};

function getAdventurerTemplate(templateOrId) {
  const templateId = migrateAdventurerTemplateId(
    typeof templateOrId === "string" ? templateOrId : templateOrId?.templateId
  );
  return adventurerTemplatesById.get(templateId) || null;
}

window.debugListAdventurers = function debugListAdventurers() {
  console.table(getAdventurerTemplatePool().map((template) => ({
    templateId: template.templateId,
    name: template.name,
    rarity: template.rarity,
    element: template.element,
    skills: template.skills.length,
    dataPath: template.dataPath,
    missingAssets: (template.missingAssets || []).join("、") || "無"
  })));
  return getAdventurerTemplatePool();
};

function findDragonCatalogTemplate(criteria = {}) {
  const stage = normalizeDragonStage(criteria.stage, criteria.level);
  const rarity = String(criteria.rarity || criteria.rank || "C").toUpperCase();
  const element = normalizeDragonElement(criteria.element);
  if (criteria.templateId) {
    const exact = contentCatalog.dragons.find((item) => item.id === criteria.templateId);
    if (exact) return exact;
  }
  if (criteria.speciesId) {
    const sameSpecies = contentCatalog.dragons.find((item) => (
      item.speciesId === criteria.speciesId && normalizeDragonStage(item.stage) === stage
    ));
    if (sameSpecies) return sameSpecies;
  }
  const candidates = contentCatalog.dragons.filter((item) => (
    normalizeDragonElement(item.element) === element &&
    normalizeDragonStage(item.stage) === stage &&
    String(item.rarity || item.rank || "C").toUpperCase() === rarity
  ));
  return candidates.find((item) => !item.legacy) || candidates[0] || null;
}

function findEggCatalogTemplate(criteria = {}) {
  if (criteria.templateId) {
    const exact = contentCatalog.eggs.find((item) => item.id === criteria.templateId);
    if (exact) return exact;
  }
  const element = normalizeEggElement(criteria);
  const rarity = String(criteria.rarity || criteria.eggRarity || "C").toUpperCase();
  const candidates = contentCatalog.eggs.filter((item) => (
    normalizeEggElement(item) === element && String(item.rarity || "C").toUpperCase() === rarity
  ));
  return candidates.find((item) => !item.legacy) || candidates[0] || null;
}
const dragonElementLabels = {
  fire: "火",
  water: "水",
  wood: "木",
  light: "光",
  dark: "暗",
  火: "火",
  水: "水",
  木: "木",
  光: "光",
  暗: "暗"
};
const dragonStageLabels = {
  baby: "幼龍",
  youth: "青年",
  adult: "成龍",
  evolution: "進化",
  middle: "青年",
  evolve: "進化"
};
const dragonElementToGrowthKey = {
  fire: "fire",
  water: "water",
  wood: "wood",
  grass: "wood",
  light: "light",
  dark: "dark",
  火: "fire",
  水: "water",
  木: "wood",
  風: "wood",
  雷: "light",
  土: "wood",
  光: "light",
  暗: "dark"
};
const growthDragonNames = {
  fire: "赤焰",
  water: "藍潮",
  wood: "翠森",
  light: "晨光",
  dark: "深淵"
};
const growthStageLevel = {
  baby: 1,
  youth: 10,
  adult: 22,
  evolution: 40,
  middle: 10,
  evolve: 40
};
const growthStageRarity = {
  baby: "C",
  youth: "B",
  adult: "A",
  evolution: "S",
  middle: "B",
  evolve: "S"
};
Object.assign(elementClass, {
  fire: "fire",
  water: "water",
  wood: "grass",
  light: "light",
  dark: "dark"
});
Object.assign(elementPalettes, {
  fire: elementPalettes.火,
  water: elementPalettes.水,
  wood: elementPalettes.木,
  light: elementPalettes.光,
  dark: elementPalettes.暗
});
Object.assign(elementNames, {
  fire: elementNames.火,
  water: elementNames.水,
  wood: elementNames.木,
  light: elementNames.光,
  dark: elementNames.暗
});

let state = loadGame();
let activeTab = "home";
let activeShopTab = "coin";
let toastTimer;
let loginMessageTimer;
let mimiTipIndex = 0;
let mimiDialogueTimer = null;
let mimiDialogueHideTimer = null;
let mimiPageIntroTimer = null;
let lastMimiIntroPage = null;
let mimiProgrammaticPageId = null;
let mimiProgrammaticPageTimer = null;
const completingMissionIds = new Set();
let gameHasStarted = false;
let startGameTransitioning = false;
let audioManager;
let eggSelectionSlotId = null;
let hatchTimerId = null;
let restDragonBehaviorTimer = null;
let dragonFrameAnimationTimer = null;
let selectedRestDragonId = state?.selectedRestDragonId || null;
let lastClickedDragonId = null;
let dragonClickCount = 0;
let lastDragonClickTime = 0;
let restDragonDragState = null;
let restDragonSuppressClickUntil = 0;
let restDragonSuppressClickId = null;
let currentGachaResult = null;
let currentAdventurerGachaResult = null;
let selectedAdventurerId = null;
let equipmentShopCountdownTimer = null;
const equipmentShopPurchaseLocks = new Set();
let currentWorldPage = 0;
let lastWorldScrollDebugAt = 0;
let lastWorldScrollDebugPage = -1;
let dragonHouseFilters = { search: "", element: "all", level: "all", rarity: "all" };
let adventurerGuildFilters = { search: "", rarity: "all", element: "all", job: "all" };
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

async function initialize() {
  await loadGameConfig();
  getWorldPages = getAdminWorldPages;
  installDragonAdminPreviewBridge();
  await loadContentCatalog();
  adventurerDataState.status = "loading";
  await loadAdventurerTemplates();
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
    if (activeTab === "home" && !isHomeV2Visible()) renderHomeScene();
    if (activeTab === "eggs") renderEggInventory();
    if (activeTab === "hatch") renderEggs();
  }, 5000);
  startHatchTimer();
  startRestDragonBehaviorLoop();
  startDragonFrameAnimationLoop();
  startAdventurerFrameAnimationLoop();
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
  if (els.mimiButton) els.mimiButton.addEventListener("click", cycleMimiTip);
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
    els.homeV2Root.addEventListener("pointerdown", handleHomeV2DragonPointerShield, true);
    els.homeV2Root.addEventListener("pointermove", handleHomeV2DragonDragMove, true);
    els.homeV2Root.addEventListener("pointerup", handleHomeV2DragonDragEnd, true);
    els.homeV2Root.addEventListener("pointercancel", handleHomeV2DragonDragEnd, true);
    els.homeV2Root.addEventListener("click", handleHomeV2DragonDirectClick, true);
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

function normalizeTutorial(tutorial = {}) {
  return {
    started: tutorial?.started !== false,
    firstDrawUnlocked: Boolean(tutorial?.firstDrawUnlocked),
    firstDrawUsed: Boolean(tutorial?.firstDrawUsed)
  };
}

function createDefaultArchipelago() {
  const catalogIsland = contentCatalog.islands.find((island) => island.id === "rest");
  return {
    version: 1,
    activeIslandId: "rest",
    camera: { x: 0, y: 0, zoom: 1 },
    islands: [{
      id: "rest",
      name: catalogIsland?.name || "龍之島",
      type: "rest",
      x: 0,
      y: 0,
      level: 1,
      unlocked: true,
      asset: catalogIsland?.asset || "assets/island/island-rest.png",
      buildingSlots: positiveNumber(catalogIsland?.buildingSlots, 12),
      buildings: []
    }]
  };
}

function normalizeArchipelago(value) {
  const defaults = createDefaultArchipelago();
  const source = value && typeof value === "object" ? value : {};
  const islands = Array.isArray(source.islands) ? source.islands : defaults.islands;
  const normalizedIslands = islands.map((island, index) => ({
    id: String(island?.id || `island_${index + 1}`),
    name: String(island?.name || `島嶼 ${index + 1}`),
    type: String(island?.type || "custom"),
    x: Number.isFinite(Number(island?.x)) ? Number(island.x) : 0,
    y: Number.isFinite(Number(island?.y)) ? Number(island.y) : 0,
    level: positiveNumber(island?.level, 1),
    unlocked: island?.unlocked !== false,
    asset: String(island?.asset || "assets/island/island-rest.png"),
    buildingSlots: positiveNumber(island?.buildingSlots, 12),
    buildings: Array.isArray(island?.buildings) ? island.buildings : []
  }));
  if (!normalizedIslands.some((island) => island.id === "rest")) {
    normalizedIslands.unshift(defaults.islands[0]);
  }
  const camera = source.camera && typeof source.camera === "object" ? source.camera : defaults.camera;
  return {
    version: 1,
    activeIslandId: normalizedIslands.some((island) => island.id === source.activeIslandId)
      ? source.activeIslandId
      : "rest",
    camera: {
      x: Number(camera.x) || 0,
      y: Number(camera.y) || 0,
      zoom: clamp(Number(camera.zoom) || 1, 0.5, 2)
    },
    islands: normalizedIslands
  };
}

function normalizeDragonResources(value) {
  const source = value && typeof value === "object" ? value : {};
  const fragments = source.fragments && typeof source.fragments === "object" ? source.fragments : {};
  const materials = source.materials && typeof source.materials === "object" ? source.materials : {};
  return {
    fragments: Object.fromEntries(Object.entries(fragments).map(([id, amount]) => [id, normalizedNonNegative(amount, 0)])),
    materials: {
      ...materials,
      evolutionStone: normalizedNonNegative(materials.evolutionStone, 0)
    }
  };
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
      ticketsExplore: 0,
      ticketsMercenary: 2
    },
    homeIsland: { restDragons: [] },
    archipelago: createDefaultArchipelago(),
    dragonResources: {
      fragments: {},
      materials: { evolutionStone: 0 }
    },
    hatchIsland: { hatchSlots: starterHatchSlots },
    hatchSlots: starterHatchSlots,
    eggInventory: starterEggs,
    eggs: starterEggs,
    dragons: [],
    adventurers: [],
    equipmentInventory: [],
    equipmentShop: { refreshAt: 0, items: [] },
    adventurerTeams: createDefaultAdventurerTeams(),
    marketListings: [],
    characterTickets: 0,
    soldDragonIds: [],
    dragonHouse: normalizeDragonHouse(),
    battleTeam: [],
    tutorialSeen: false,
    tutorialStep: 0,
    beginnerQuestStarted: true,
    missions: normalizeMissions(),
    ui: {
      missionChapterExpanded: {},
      missionChapterCompleted: {},
      activeAdventurerPanel: null,
      activeAdventurerEquipmentSlot: "weapon",
      activeAdventurerTradeTab: "sell",
      activeDragonEvolutionId: null,
      bulkManage: { type: null, selectedIds: [] }
    },
    tutorial: normalizeTutorial({ tutorialSeen: false, step: 0, beginnerQuestStarted: true }),
    characterCards: initializeCardCollection(characterCardCatalog, ["char_flame_knight"], "char_flame_knight"),
    petCards: initializeCardCollection(petCardCatalog, ["pet_fire_wisp"], "pet_fire_wisp"),
    selectedCharacterId: "char_flame_knight",
    selectedPetId: "pet_fire_wisp",
    cardFragments: 0,
    lastGachaResult: null,
    market: generateShopEggs(),
    activeDragonId: null,
    selectedRestDragonId: null,
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
  state.adventurers = Array.isArray(state.adventurers) ? state.adventurers.map(normalizeAdventurer).filter(Boolean) : [];
  state.equipmentInventory = Array.isArray(state.equipmentInventory) ? state.equipmentInventory.map(normalizeEquipment) : [];
  state.equipmentShop = normalizeEquipmentShop(state.equipmentShop);
  state.adventurerTeams = normalizeAdventurerTeams(state.adventurerTeams, state.adventurers);
  state.marketListings = Array.isArray(state.marketListings) ? state.marketListings : [];
  state.characterTickets = normalizedNonNegative(state.characterTickets, 0);
  state.soldDragonIds = Array.isArray(state.soldDragonIds) ? state.soldDragonIds.filter(Boolean) : [];
  state.dragonHouse = normalizeDragonHouse(state.dragonHouse);
  state.ui = state.ui && typeof state.ui === "object" ? state.ui : {};
  state.ui.missionChapterExpanded = state.ui.missionChapterExpanded && typeof state.ui.missionChapterExpanded === "object"
    ? state.ui.missionChapterExpanded
    : {};
  state.ui.missionChapterCompleted = state.ui.missionChapterCompleted && typeof state.ui.missionChapterCompleted === "object"
    ? state.ui.missionChapterCompleted
    : {};
  state.ui.activeAdventurerPanel = ["team", "upgrade", "equipment", "trade"].includes(state.ui.activeAdventurerPanel)
    ? state.ui.activeAdventurerPanel
    : null;
  state.ui.activeAdventurerEquipmentSlot = EQUIPMENT_SLOTS.includes(state.ui.activeAdventurerEquipmentSlot)
    ? state.ui.activeAdventurerEquipmentSlot
    : "weapon";
  state.ui.activeAdventurerTradeTab = state.ui.activeAdventurerTradeTab === "market" ? "market" : "sell";
  state.ui.activeDragonEvolutionId = state.dragons.some((dragon) => dragon.id === state.ui.activeDragonEvolutionId)
    ? state.ui.activeDragonEvolutionId
    : null;
  state.ui.bulkManage = { type: null, selectedIds: [] };
  syncAdventurerEquipmentState();
  syncAdventurerTeamFlags();
  state.battleTeam = normalizeBattleTeam(state.battleTeam, state.dragons);
  syncDragonTeamFlags();
  const savedRestDragonIds = Array.isArray(state.homeIsland?.restDragons)
    ? new Set(state.homeIsland.restDragons.slice(0, REST_ISLAND_MAX_DRAGONS))
    : new Set();
  if (savedRestDragonIds.size > 0) {
    state.dragons.forEach((dragon) => {
      if (savedRestDragonIds.has(dragon.id) && !dragon.isInTeam && !dragon.sold) {
        dragon.isOnRestIsland = true;
      }
    });
  }
  state.inventory = normalizeInventory(state.inventory, defaults.inventory);
  state.tutorial = normalizeTutorial(state.tutorial);
  state.hatchIsland = normalizeHatchIsland(state.hatchIsland || { hatchSlots: state.hatchSlots }, defaults.hatchIsland);
  state.hatchSlots = state.hatchIsland.hatchSlots;
  updateHatchSlots({ render: false, save: false });
  state.homeIsland = normalizeHomeIsland(state.homeIsland, state.dragons);
  state.archipelago = normalizeArchipelago(state.archipelago);
  state.dragonResources = normalizeDragonResources(state.dragonResources);
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
  state.totalHatched = normalizedNonNegative(state.totalHatched, defaults.totalHatched);

  if (!state.activeDragonId && state.dragons.length > 0) {
    state.activeDragonId = state.dragons[0].id;
  }
  if (state.activeDragonId && !state.dragons.some((dragon) => dragon.id === state.activeDragonId)) {
    state.activeDragonId = state.dragons[0]?.id ?? null;
  }
  if (state.selectedRestDragonId && !state.dragons.some((dragon) => (
    dragon.id === state.selectedRestDragonId &&
    dragon.isOnRestIsland === true &&
    !dragon.isInTeam
  ))) {
    state.selectedRestDragonId = null;
  }
  selectedRestDragonId = state.selectedRestDragonId || null;

  if (!rarities.includes(state.highestRarity)) {
    state.highestRarity = getHighestRarityFromCollection();
  }

  saveGame();
}

function normalizeDragon(dragon) {
  const rarity = rarities.includes(dragon?.rarity) ? dragon.rarity : "C";
  const element = normalizeDragonElement(dragon?.element);
  const stage = normalizeDragonStage(dragon?.stage, dragon?.level);
  const template = findDragonCatalogTemplate({ ...dragon, rarity, element, stage });
  const fallback = createDragon(rarity, dragonElementLabels[element] || "火");
  const level = positiveNumber(dragon?.level, growthStageLevel[stage] || 1);
  const power = positiveNumber(
    dragon?.power,
    Math.round((rarityPower[rarity] || 1) * 10 + level * 2)
  );
  const assetBase = String(dragon?.assetRoot || dragon?.assetBase || template?.assetRoot || normalizeDragonAssetBase(null, element, stage));
  const angryUntil = dragon?.angryUntil ? Number(dragon.angryUntil) : null;
  const isAngry = Boolean(dragon?.isAngry && angryUntil && angryUntil > Date.now());
  const lockActionUntil = dragon?.lockActionUntil ? Number(dragon.lockActionUntil) : null;
  const savedAction = DRAGON_ACTIONS.includes(dragon?.currentAction) ? dragon.currentAction : "idle";
  const currentAction = isAngry ? "angry" : (["attack", "angry"].includes(savedAction) ? "idle" : savedAction);
  const isInTeam = Boolean(dragon?.isInTeam);
  const isOnRestIsland = typeof dragon?.isOnRestIsland === "boolean" ? dragon.isOnRestIsland : false;

  return {
    ...fallback,
    ...dragon,
    id: dragon?.id || fallback.id,
    name: String(dragon?.name || fallback.name),
    rarity,
    element,
    stage,
    templateId: dragon?.templateId || template?.id || null,
    speciesId: dragon?.speciesId || template?.speciesId || template?.id || null,
    hp: positiveNumber(dragon?.hp, template?.hp || fallback.hp),
    attack: positiveNumber(dragon?.attack, template?.atk || template?.attack || fallback.attack),
    defense: positiveNumber(dragon?.defense, template?.def || template?.defense || fallback.defense),
    speed: positiveNumber(dragon?.speed, template?.speed || fallback.speed),
    level,
    hunger: clamp(positiveNumber(dragon?.hunger, 80), 0, 100),
    mood: clamp(positiveNumber(dragon?.mood, 80), 0, 100),
    exp: Math.max(0, Number(dragon?.exp) || 0),
    power,
    isInTeam,
    isOnRestIsland,
    currentAction,
    assetBase,
    assetRoot: assetBase,
    animationFrames: dragon?.animationFrames || template?.actions || {},
    avatarAsset: dragon?.avatarAsset || template?.portraitAsset || template?.iconAsset || `${assetBase}portrait.png`,
    growth: { ...(template?.growth || {}), ...(dragon?.growth || {}) },
    nextEvolution: dragon?.nextEvolution ?? template?.nextEvolution ?? null,
    evolution: dragon?.evolution ?? template?.evolution ?? null,
    skills: Array.isArray(dragon?.skills) ? dragon.skills : (template?.skills || []),
    talents: Array.isArray(dragon?.talents) ? dragon.talents : (template?.talents || []),
    tags: Array.isArray(dragon?.tags) ? dragon.tags : (template?.tags || []),
    variant: dragon?.variant || template?.variant || "normal",
    glow: Boolean(dragon?.glow ?? template?.glow),
    boss: Boolean(dragon?.boss ?? template?.boss),
    mythical: Boolean(dragon?.mythical ?? template?.mythical),
    codexId: dragon?.codexId || template?.codexId || dragon?.speciesId || template?.speciesId || null,
    bonds: Array.isArray(dragon?.bonds) ? dragon.bonds : [],
    awakeningLevel: normalizedNonNegative(dragon?.awakeningLevel, 0),
    costumeId: dragon?.costumeId || null,
    skinId: dragon?.skinId || null,
    isAngry,
    angryUntil: isAngry ? angryUntil : null,
    lockActionUntil: lockActionUntil && lockActionUntil > Date.now() ? lockActionUntil : null,
    lockPositionUntil: dragon?.lockPositionUntil && Number(dragon.lockPositionUntil) > Date.now()
      ? Number(dragon.lockPositionUntil)
      : null,
    isDragging: false,
    lastInteractedAt: dragon?.lastInteractedAt || null,
    restX: finiteRestCoordinate(dragon?.restX),
    restY: finiteRestCoordinate(dragon?.restY),
    targetRestX: finiteRestCoordinate(dragon?.targetRestX),
    targetRestY: finiteRestCoordinate(dragon?.targetRestY),
    restScale: Number.isFinite(Number(dragon?.restScale)) ? Number(dragon.restScale) : null,
    image: getDragonAsset({
      element,
      rarity,
      stage,
      currentAction,
      assetBase,
      templateId: dragon?.templateId || template?.id,
      speciesId: dragon?.speciesId || template?.speciesId,
      animationFrames: dragon?.animationFrames || template?.actions || {}
    })
  };
}

function createStarterGrowthDragons() {
  return DRAGON_GROWTH_ELEMENTS.flatMap((elementKey) => (
    DRAGON_GROWTH_STAGES.map((stage) => {
      const id = `${elementKey}_${stage}_001`;
      const level = growthStageLevel[stage] || 1;
      const rarity = growthStageRarity[stage] || "C";
      return {
        id,
        name: `${growthDragonNames[elementKey]}${dragonStageLabels[stage]}`,
        element: elementKey,
        rarity,
        stage,
        level,
        exp: level * 10,
        power: Math.round((rarityPower[rarity] || 1) * 12 + level * 3),
        hp: Math.round(88 * (rarityPower[rarity] || 1) + level * 4),
        attack: Math.round(24 * (rarityPower[rarity] || 1) + level * 2),
        defense: Math.round(18 * (rarityPower[rarity] || 1) + level * 1.5),
        speed: Math.round(14 * (rarityPower[rarity] || 1) + level),
        hunger: 80,
        mood: 90,
        isInTeam: false,
        currentAction: "idle",
        assetBase: `assets/dragons/${elementKey}/${stage}/`,
        avatarAsset: `assets/dragons/${elementKey}/${stage}/avatar.png`,
        costumeId: null,
        skinId: null,
        isAngry: false,
        angryUntil: null,
        lockActionUntil: null,
        lastInteractedAt: null
      };
    })
  ));
}

function ensureStarterGrowthDragonData(dragons, excludedIds = []) {
  const list = Array.isArray(dragons) ? [...dragons] : [];
  const existingIds = new Set(list.map((dragon) => dragon.id));
  const blockedIds = new Set(Array.isArray(excludedIds) ? excludedIds : []);
  createStarterGrowthDragons().forEach((starterDragon) => {
    if (blockedIds.has(starterDragon.id)) return;
    if (!existingIds.has(starterDragon.id)) {
      list.push(normalizeDragon(starterDragon));
      existingIds.add(starterDragon.id);
    }
  });
  return list;
}

function normalizeDragonElement(element) {
  const key = dragonElementToGrowthKey[element] || dragonElementToGrowthKey[String(element || "").toLowerCase()];
  return key || randomItem(DRAGON_GROWTH_ELEMENTS);
}

function normalizeDragonStage(stage, level = 1) {
  const aliases = { middle: "youth", evolve: "evolution" };
  const normalized = aliases[stage] || stage;
  if (DRAGON_GROWTH_STAGES.includes(normalized)) return normalized;
  const numericLevel = positiveNumber(level, 1);
  if (numericLevel >= 40) return "evolution";
  if (numericLevel >= 20) return "adult";
  if (numericLevel >= 10) return "youth";
  return "baby";
}

function normalizeDragonAssetBase(assetBase, element, stage) {
  const legacyStage = { baby: "baby", youth: "middle", adult: "adult", evolution: "evolve" }[normalizeDragonStage(stage)] || "baby";
  return `assets/dragons/${normalizeDragonElement(element)}/${legacyStage}/`;
}

function getDragonAnimationFrames(dragon, action = null) {
  const selectedAction = DRAGON_ACTIONS.includes(action || dragon?.currentAction) ? (action || dragon.currentAction) : "idle";
  const template = findDragonCatalogTemplate(dragon || {});
  const actions = dragon?.animationFrames || template?.actions || {};
  const fallbackAction = selectedAction === "angry" ? "attack" : "idle";
  const frames = actions[selectedAction] || actions[fallbackAction] || actions.idle;
  if (Array.isArray(frames) && frames.length > 0) return frames;
  const element = normalizeDragonElement(dragon?.element);
  const stage = normalizeDragonStage(dragon?.stage, dragon?.level);
  const legacyBase = normalizeDragonAssetBase(null, element, stage);
  return [`${legacyBase}${selectedAction}.png`];
}

function getDragonAsset(dragon, action = null, frameIndex = 0) {
  const frames = getDragonAnimationFrames(dragon, action);
  return frames[Math.abs(Number(frameIndex) || 0) % frames.length] || DRAGON_FALLBACK_ASSET;
}

function getDragonAvatarAsset(dragon) {
  const template = findDragonCatalogTemplate(dragon || {});
  return dragon?.avatarAsset || template?.portraitAsset || template?.iconAsset || getDragonAsset(dragon, "idle");
}

function getDragonStageScale(stage) {
  const normalizedStage = normalizeDragonStage(stage);
  const defaults = { baby: 0.88, youth: 0.94, adult: 1, evolution: 1.08 };
  return gameConfigNumber(`sprites.dragons.stageScale.${normalizedStage}`, defaults[normalizedStage] || 0.88);
}

function finiteRestCoordinate(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function hashDragonPositionSeed(value) {
  return String(value || "")
    .split("")
    .reduce((total, char) => ((total * 31) + char.charCodeAt(0)) % 9973, 17);
}

function getDefaultRestDragonPosition(dragon, index = 0) {
  if (REST_INITIAL_POSITIONS[index]) return REST_INITIAL_POSITIONS[index];
  const seed = hashDragonPositionSeed(dragon?.id || dragon?.name || index);
  return {
    x: REST_ISLAND_BOUNDS.minX + (seed % (REST_ISLAND_BOUNDS.maxX - REST_ISLAND_BOUNDS.minX)),
    y: REST_ISLAND_BOUNDS.minY + ((Math.floor(seed / 7)) % (REST_ISLAND_BOUNDS.maxY - REST_ISLAND_BOUNDS.minY)),
    s: 0.78
  };
}

function clampRestDragonPosition(x, y) {
  return {
    x: clamp(Number(x), REST_ISLAND_BOUNDS.minX, REST_ISLAND_BOUNDS.maxX),
    y: clamp(Number(y), REST_ISLAND_BOUNDS.minY, REST_ISLAND_BOUNDS.maxY)
  };
}

function ensureRestDragonPosition(dragon, index = 0) {
  if (!dragon) return false;
  const fallback = getDefaultRestDragonPosition(dragon, index);
  const currentX = finiteRestCoordinate(dragon?.restX);
  const currentY = finiteRestCoordinate(dragon?.restY);
  const next = currentX == null || currentY == null
    ? clampRestDragonPosition(fallback.x, fallback.y)
    : clampRestDragonPosition(currentX, currentY);
  const changed = dragon.restX !== next.x || dragon.restY !== next.y;
  dragon.restX = next.x;
  dragon.restY = next.y;
  dragon.restScale = Number.isFinite(Number(dragon.restScale)) ? Number(dragon.restScale) : fallback.s;
  return changed;
}

function isRestDragonPositionLocked(dragon, now = Date.now()) {
  return Boolean(
    dragon?.isDragging ||
    (dragon?.lockPositionUntil && Number(dragon.lockPositionUntil) > now)
  );
}

function isHomeV2Visible() {
  return Boolean(
    els?.homeV2Root &&
    !els.homeV2Root.hidden &&
    document.body.classList.contains("home-v2-active")
  );
}

function normalizeBattleTeam(team, dragons) {
  const validDragonIds = new Set((dragons || []).map((dragon) => dragon.id));
  const fromTeam = Array.isArray(team) ? team : [];
  const fromDragonFlags = (dragons || []).filter((dragon) => dragon.isInTeam).map((dragon) => dragon.id);
  return [...fromTeam, ...fromDragonFlags]
    .filter((id, index, list) => validDragonIds.has(id) && list.indexOf(id) === index)
    .slice(0, BATTLE_TEAM_LIMIT);
}

function syncDragonTeamFlags() {
  const teamSet = new Set(Array.isArray(state.battleTeam) ? state.battleTeam : []);
  state.dragons.forEach((dragon) => {
    dragon.isInTeam = teamSet.has(dragon.id);
  });
}

function getRestIslandDragonCandidates() {
  return (state.dragons || [])
    .filter((dragon) => dragon?.isOnRestIsland === true && !dragon.sold && !dragon.isInTeam);
}

function getRestIslandDragons() {
  return getRestIslandDragonCandidates().slice(0, REST_ISLAND_MAX_DRAGONS);
}

function isRestIslandFull() {
  return getRestIslandDragonCandidates().length >= REST_ISLAND_MAX_DRAGONS;
}

function dragonElementText(element) {
  return dragonElementLabels[element] || dragonElementLabels[normalizeDragonElement(element)] || "未知";
}

function dragonStageText(stage) {
  return dragonStageLabels[stage] || "幼龍";
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
  const rarity = rarities.includes(egg?.rarity) ? egg.rarity : (rarities.includes(egg?.eggRarity) ? egg.eggRarity : definition.rarity);
  const element = normalizeEggElement(egg);
  const template = findEggCatalogTemplate({ ...egg, element, rarity });
  return {
    id: egg?.id || createId("egg"),
    type: definition.type,
    name: String(egg?.name || definition.name),
    rarity,
    eggRarity: rarities.includes(egg?.eggRarity) ? egg.eggRarity : rarity,
    element,
    elementHint: element,
    attribute: element,
    elementBias: element === "neutral" ? (egg?.elementBias || definition.elementBias || "random") : element,
    templateId: egg?.templateId || template?.id || null,
    dragonTemplateId: egg?.dragonTemplateId || template?.dragonTemplateId || null,
    assetRoot: egg?.assetRoot || template?.assetRoot || null,
    animationFrames: egg?.animationFrames || template?.actions || {},
    iconAsset: egg?.iconAsset || template?.iconAsset || null,
    hatchDuration: positiveNumber(egg?.hatchDuration, durationFromMs || template?.hatchTime || definition.hatchDuration),
    hatchTime: positiveNumber(egg?.hatchTime, durationFromMs || template?.hatchTime || definition.hatchDuration),
    image: getEggAsset({ ...egg, element, rarity, templateId: egg?.templateId || template?.id }),
    assignedIncubatorId: egg?.assignedIncubatorId || null,
    hatched: Boolean(egg?.hatched),
    locked: Boolean(egg?.locked),
    favorite: Boolean(egg?.favorite),
    isBeginnerEgg: Boolean(egg?.isBeginnerEgg || egg?.beginnerProtected || egg?.missionProtected),
    rarityRates: Array.isArray(egg?.rarityRates) && egg.rarityRates.length > 0
      ? egg.rarityRates.map((item) => ({
        rarity: rarities.includes(item?.rarity) ? item.rarity : definition.rarity,
        rate: positiveNumber(item?.rate, 0)
      })).filter((item) => item.rate > 0)
      : definition.rarityRates.map((item) => ({ ...item })),
    createdAt: positiveNumber(egg?.createdAt, Date.now())
  };
}

function normalizeEggElement(egg) {
  const raw = String(
    egg?.element ||
    egg?.elementHint ||
    egg?.attribute ||
    egg?.eggElement ||
    egg?.elementBias ||
    ""
  ).trim().toLowerCase();
  const map = {
    fire: "fire",
    water: "water",
    wood: "wood",
    grass: "wood",
    light: "light",
    dark: "dark",
    "火": "fire",
    "水": "water",
    "木": "wood",
    "草": "wood",
    "光": "light",
    "暗": "dark"
  };
  return map[raw] || "neutral";
}

function getEggAsset(egg) {
  const template = findEggCatalogTemplate(egg || {});
  if (egg?.iconAsset || template?.iconAsset) return egg?.iconAsset || template.iconAsset;
  const frames = egg?.animationFrames?.idle || template?.actions?.idle;
  if (Array.isArray(frames) && frames.length > 0) return frames[0];
  const element = normalizeEggElement(egg);
  const rarity = String(egg?.rarity || egg?.eggRarity || "C").toLowerCase();
  if (!["fire", "water", "wood", "light", "dark"].includes(element)) {
    return "assets/eggs/placeholder-egg.png";
  }
  return `assets/eggs/${element}/${rarity}.png`;
}

function getAvailableEggs() {
  const activeEggIds = new Set((state.hatchIsland?.hatchSlots || [])
    .map((slot) => slot?.currentEggId || slot?.currentEgg?.id)
    .filter(Boolean));
  return (Array.isArray(state.eggInventory) ? state.eggInventory : [])
    .map(normalizeInventoryEgg)
    .filter((egg) => !egg.hatched && !egg.assignedIncubatorId && !activeEggIds.has(egg.id));
}

function eggElementLabel(egg) {
  const element = normalizeEggElement(egg);
  return element === "neutral" ? "random" : element;
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
  state.battleTeam = normalizeBattleTeam(state.battleTeam, state.dragons || []);
  syncDragonTeamFlags();
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

function normalizeDragonHouse(value = {}) {
  const source = value && typeof value === "object" ? value : {};
  const maxUpgrades = Math.max(0, Math.floor(Number(source.maxUpgrades ?? DRAGON_HOUSE_DEFAULT.maxUpgrades)));
  const purchasedUpgrades = clamp(
    Math.floor(Number(source.purchasedUpgrades ?? DRAGON_HOUSE_DEFAULT.purchasedUpgrades) || 0),
    0,
    maxUpgrades
  );

  return {
    baseRows: Math.max(1, Math.floor(Number(source.baseRows ?? DRAGON_HOUSE_DEFAULT.baseRows) || DRAGON_HOUSE_DEFAULT.baseRows)),
    columns: Math.max(1, Math.floor(Number(source.columns ?? DRAGON_HOUSE_DEFAULT.columns) || DRAGON_HOUSE_DEFAULT.columns)),
    purchasedUpgrades,
    maxUpgrades
  };
}

function getDragonHouseState() {
  state.dragonHouse = normalizeDragonHouse(state.dragonHouse);
  return state.dragonHouse;
}

function getDragonHouseRows() {
  const house = getDragonHouseState();
  return house.baseRows + house.purchasedUpgrades * 2;
}

function getDragonHouseColumns() {
  return getDragonHouseState().columns;
}

function getDragonHouseCapacity() {
  return getDragonHouseRows() * getDragonHouseColumns();
}

function getDragonHouseUpgradeCost() {
  const house = getDragonHouseState();
  return 100 + house.purchasedUpgrades * 75;
}

function canAddDragon() {
  return (state.dragons || []).length < getDragonHouseCapacity();
}

function addDragonToPlayer(dragon, options = {}) {
  if (!dragon) return false;
  if (!canAddDragon()) {
    if (!options.silent) showToast("龍舍已滿，請擴充龍舍或出售龍");
    return false;
  }

  const normalizedDragon = normalizeDragon(dragon);
  if (typeof dragon.isOnRestIsland !== "boolean") {
    normalizedDragon.isOnRestIsland = !normalizedDragon.isInTeam && !isRestIslandFull();
  }
  state.dragons.push(normalizedDragon);
  state.homeIsland = normalizeHomeIsland(state.homeIsland, state.dragons);
  if (options.save !== false) saveGame();
  return true;
}

function completeTutorialTask() {
  state.tutorial = normalizeTutorial(state.tutorial);
  if (state.tutorial.firstDrawUnlocked) return;
  state.tutorial.firstDrawUnlocked = true;
  saveGame();
  showToast("完成新手任務，獲得一次抽龍機會！");
}

function claimTutorialDragonDraw() {
  state.tutorial = normalizeTutorial(state.tutorial);
  if (!state.tutorial.firstDrawUnlocked) {
    showToast("先完成新手任務，才能抽龍");
    return false;
  }
  if (state.tutorial.firstDrawUsed) {
    showToast("新手抽龍已經使用過了");
    return false;
  }

  const dragon = hatchEggToDragon(createInventoryEgg("normal-egg"));
  if (!addDragonToPlayer(dragon, { save: false })) return false;
  state.tutorial.firstDrawUsed = true;
  saveGame();
  renderHomeV2();
  showToast(`獲得 ${dragon.name}！`);
  return true;
}

window.completeTutorialTask = completeTutorialTask;
window.claimTutorialDragonDraw = claimTutorialDragonDraw;

function buyDragonHouseRows() {
  const house = getDragonHouseState();
  if (house.purchasedUpgrades >= house.maxUpgrades) {
    showToast("龍舍容量已達上限");
    return;
  }

  const cost = getDragonHouseUpgradeCost();
  if (state.diamonds < cost) {
    showToast("鑽石不足");
    return;
  }

  state.diamonds -= cost;
  house.purchasedUpgrades += 1;
  state.dragonHouse = normalizeDragonHouse(house);
  saveGame();
  renderHomeV2();
  showToast("龍舍增加 2 列，共增加 10 個位置");
}

function createDefaultHatchSlots() {
  return Array.from({ length: 6 }, (_, index) => {
    return {
      id: `slot-${index + 1}`,
      type: "time",
      slotType: "time",
      unlocked: index < 2,
      unlockCostDiamonds: gameConfig?.economy?.incubatorUnlockPrices?.[index] ?? hatchSlotUnlockCosts[index] ?? 999,
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
  const restEligibleDragons = (dragons || []).filter((dragon) => (
    dragon?.isOnRestIsland === true &&
    !dragon.sold &&
    !dragon.isInTeam
  ));
  const validIds = savedIds.filter((id) => restEligibleDragons.some((dragon) => dragon.id === id)).slice(0, REST_ISLAND_MAX_DRAGONS);
  restEligibleDragons.forEach((dragon) => {
    if (validIds.length < REST_ISLAND_MAX_DRAGONS && !validIds.includes(dragon.id)) {
      validIds.push(dragon.id);
    }
  });
  return { restDragons: validIds };
}

function serializeAdventurerInstance(adventurer) {
  return {
    id: adventurer.id,
    templateId: adventurer.templateId,
    name: adventurer.name,
    level: adventurer.level,
    exp: adventurer.exp,
    growthRoll: { ...adventurer.growthRoll },
    equipment: { ...createEmptyAdventurerEquipment(), ...(adventurer.equipment || {}) },
    locked: Boolean(adventurer.locked),
    favorite: Boolean(adventurer.favorite),
    isInTeam: Boolean(adventurer.isInTeam),
    teamId: adventurer.teamId || null,
    shards: normalizedNonNegative(adventurer.shards, 0),
    isBeginnerAdventurer: Boolean(adventurer.isBeginnerAdventurer),
    obtainedAt: positiveNumber(adventurer.obtainedAt, Date.now())
  };
}

function createPersistableGameState() {
  return {
    ...state,
    adventurers: Array.isArray(state.adventurers)
      ? state.adventurers.filter(Boolean).map(serializeAdventurerInstance)
      : []
  };
}

function saveGame() {
  console.log("[saveGame]");
  syncPersistentAliases();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(createPersistableGameState()));
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
  window.setTimeout(maybeShowTutorialOverlay, 360);
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
            ${renderRestIslandDragonsMarkup()}
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
  return getEggAsset(egg);
}

function homeV2Image(src, alt, fallback) {
  return `
    <img src="${src}" alt="${escapeHtml(alt)}" onerror="this.hidden=true;this.nextElementSibling.hidden=false">
    <span class="home-v2-dragon-fallback" hidden>${escapeHtml(fallback)}</span>
  `;
}

function renderRestIslandDragonsMarkup() {
  const dragons = getRestIslandDragons();
  if (dragons.length === 0) {
    return `
      <div class="home-v2-empty">
        <b>還沒有休息中的龍</b>
        <p>孵化龍蛋後，未出戰的龍會回到這座休息島。</p>
      </div>
    `;
  }
  let positionChanged = false;
  const markup = dragons.map((dragon, index) => {
    positionChanged = ensureRestDragonPosition(dragon, index) || positionChanged;
    return renderHomeV2Dragon(dragon, index);
  }).join("");
  if (positionChanged && typeof window !== "undefined") {
    window.setTimeout(saveGame, 0);
  }
  return markup;
}

function refreshRestIslandInteractionLayer() {
  const pager = document.getElementById("worldPager");
  const currentScrollLeft = pager?.scrollLeft || 0;
  const dragonLayer = document.querySelector(".restIsland .home-v2-dragons");
  if (dragonLayer) {
    dragonLayer.innerHTML = renderRestIslandDragonsMarkup();
  }

  const restPage = document.querySelector(".restIsland");
  if (restPage) {
    restPage.querySelector(".rest-dragon-status-panel")?.remove();
    restPage.querySelector(".dragon-evolution-backdrop")?.remove();
    const panelHtml = renderRestDragonStatusPanel();
    const stage = restPage.querySelector(".rest-island-stage");
    if (panelHtml && stage) stage.insertAdjacentHTML("beforebegin", panelHtml);
    restPage.classList.toggle("has-selected-dragon", Boolean(panelHtml));
    const evolutionHtml = renderDragonEvolutionModal();
    if (evolutionHtml) restPage.insertAdjacentHTML("beforeend", evolutionHtml);
  }

  if (pager) pager.scrollLeft = currentScrollLeft;
}

function findRestDragonElement(dragonId) {
  return Array.from(document.querySelectorAll(".restIsland .home-v2-dragon[data-dragon-id]"))
    .find((element) => element.dataset.dragonId === dragonId) || null;
}

function updateRestDragonSprite(dragon) {
  const element = findRestDragonElement(dragon?.id);
  if (!element || !dragon) return;
  const action = DRAGON_ACTIONS.includes(dragon.currentAction) ? dragon.currentAction : "idle";
  DRAGON_ACTIONS.forEach((item) => element.classList.remove(`action-${item}`));
  element.classList.add(`action-${action}`);
  element.classList.toggle("is-selected", selectedRestDragonId === dragon.id || state.selectedRestDragonId === dragon.id);
  element.classList.toggle("is-angry", Boolean(dragon.isAngry && dragon.angryUntil && dragon.angryUntil > Date.now()));
  const image = element.querySelector(".dragon-portrait img");
  if (image) {
    image.hidden = false;
    image.dataset.fallback = "";
    image.src = getDragonAsset(dragon, action);
  }
}

function applyRestDragonPosition(element, dragon) {
  if (!element || !dragon) return;
  const x = finiteRestCoordinate(dragon.restX);
  const y = finiteRestCoordinate(dragon.restY);
  if (x == null || y == null) return;
  element.style.setProperty("--x", `${x}%`);
  element.style.setProperty("--y", `${y}%`);
  element.style.setProperty("--s", dragon.restScale || 0.85);
}

function updateRestDragonElement(dragon) {
  const element = findRestDragonElement(dragon?.id);
  if (!element || !dragon) return;
  applyRestDragonPosition(element, dragon);
  updateRestDragonSprite(dragon);
}

function finishRestDragonDrag(dragon, element, lockMs = 8000) {
  if (!dragon) return;
  const next = clampRestDragonPosition(dragon.restX, dragon.restY);
  dragon.restX = next.x;
  dragon.restY = next.y;
  dragon.targetRestX = null;
  dragon.targetRestY = null;
  dragon.isDragging = false;
  dragon.lockPositionUntil = Date.now() + lockMs;
  dragon.lockActionUntil = Math.max(Number(dragon.lockActionUntil) || 0, Date.now() + lockMs);
  applyRestDragonPosition(element, dragon);
  updateRestDragonSprite(dragon);
  saveGame();
}

function pointerToRestIslandPercent(event) {
  const stage = document.querySelector(".restIsland .rest-island-stage");
  if (!stage) return null;
  const rect = stage.getBoundingClientRect();
  if (!rect.width || !rect.height) return null;
  return {
    x: ((event.clientX - rect.left) / rect.width) * 100,
    y: ((event.clientY - rect.top) / rect.height) * 100
  };
}

function handleHomeV2DragonPointerShield(event) {
  const dragonButton = event.target?.closest?.(".home-v2-dragon[data-v2-action='select-dragon']");
  if (!dragonButton || !els.homeV2Root?.contains(dragonButton)) return;
  event.preventDefault();
  event.stopPropagation();

  const dragon = getDragonById(dragonButton.dataset.dragonId);
  if (!dragon) return;
  ensureRestDragonPosition(dragon);
  dragon.currentAction = "idle";
  dragon.lockActionUntil = Date.now() + 5000;
  dragon.isDragging = true;
  updateRestDragonSprite(dragon);

  restDragonDragState = {
    pointerId: event.pointerId,
    dragonId: dragon.id,
    element: dragonButton,
    startX: event.clientX,
    startY: event.clientY,
    moved: false
  };
  dragonButton.classList.add("is-pressing");
  if (dragonButton.setPointerCapture) {
    try { dragonButton.setPointerCapture(event.pointerId); } catch (error) { /* ignore capture edge cases */ }
  }
}

function handleHomeV2DragonDragMove(event) {
  if (!restDragonDragState || restDragonDragState.pointerId !== event.pointerId) return;
  event.preventDefault();
  event.stopPropagation();

  const dragon = getDragonById(restDragonDragState.dragonId);
  if (!dragon) return;
  const distance = Math.hypot(event.clientX - restDragonDragState.startX, event.clientY - restDragonDragState.startY);
  if (distance > 6) {
    restDragonDragState.moved = true;
    restDragonDragState.element?.classList.add("is-dragging");
  }
  if (!restDragonDragState.moved) return;

  const percent = pointerToRestIslandPercent(event);
  if (!percent) return;
  const next = clampRestDragonPosition(percent.x, percent.y);
  dragon.restX = next.x;
  dragon.restY = next.y;
  dragon.targetRestX = null;
  dragon.targetRestY = null;
  dragon.currentAction = "idle";
  dragon.isDragging = true;
  dragon.lockActionUntil = Date.now() + 8000;
  dragon.lockPositionUntil = Date.now() + 8000;
  applyRestDragonPosition(restDragonDragState.element, dragon);
  updateRestDragonSprite(dragon);
}

function handleHomeV2DragonDragEnd(event) {
  if (!restDragonDragState || restDragonDragState.pointerId !== event.pointerId) return;
  event.preventDefault();
  event.stopPropagation();

  const drag = restDragonDragState;
  const dragon = getDragonById(drag.dragonId);
  drag.element?.classList.remove("is-pressing", "is-dragging");
  if (drag.element?.releasePointerCapture) {
    try { drag.element.releasePointerCapture(event.pointerId); } catch (error) { /* ignore capture edge cases */ }
  }
  restDragonDragState = null;

  if (!dragon) return;
  if (event.type === "pointercancel") {
    finishRestDragonDrag(dragon, drag.element);
    return;
  }
  if (drag.moved) {
    restDragonSuppressClickId = dragon.id;
    restDragonSuppressClickUntil = Date.now() + 450;
    finishRestDragonDrag(dragon, drag.element);
    return;
  }
  dragon.isDragging = false;
  restDragonSuppressClickId = dragon.id;
  restDragonSuppressClickUntil = Date.now() + 450;
  handleRestDragonClick(dragon.id, event);
}

function handleHomeV2DragonDirectClick(event) {
  const dragonButton = event.target?.closest?.(".home-v2-dragon[data-v2-action='select-dragon']");
  if (!dragonButton || !els.homeV2Root?.contains(dragonButton)) return;
  event.preventDefault();
  event.stopPropagation();
  if (restDragonSuppressClickId === dragonButton.dataset.dragonId && Date.now() < restDragonSuppressClickUntil) {
    return;
  }
  handleRestDragonClick(dragonButton.dataset.dragonId, event);
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
  const dragons = getRestIslandDragons();
  const readySlots = (state.hatchIsland?.hatchSlots || []).filter((slot) => slot.currentEgg && getHatchSlotStatus(slot).ready).length;
  const taskText = readySlots > 0 ? `${readySlots} 顆蛋可以孵化` : "照顧休息中的龍寶";

  return `
    <section class="worldPage homePage restIsland" data-world-index="${index}" aria-label="休息島">
      <div class="rest-ambient" aria-hidden="true">
        <span class="rest-cloud rest-cloud-a"></span>
        <span class="rest-cloud rest-cloud-b"></span>
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
      ${renderRestDragonStatusPanel()}
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
            ${renderRestIslandDragonsMarkup()}
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
    bindBeginnerFeatureButtons();
  }, 0);
}

function renderWorldHomePage(index) {
  const dragons = state.dragons.slice(0, 5);

  return `
    <section class="worldPage homePage restIsland" data-world-index="${index}" aria-label="休息島">
      <div class="rest-ambient" aria-hidden="true">
        <span class="rest-cloud rest-cloud-a"></span>
        <span class="rest-cloud rest-cloud-b"></span>
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
            ${renderRestIslandDragonsMarkup()}
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderWorldExplorePage(index) {
  state.inventory = normalizeInventory(state.inventory, createNewState().inventory);
  const ticketCount = normalizedNonNegative(state.inventory.ticketsExplore, 0);
  return `
    <section class="worldPage explorePage" data-world-index="${index}" aria-label="探險">
      <div class="explore-page-shell">
        <section class="explore-hero">
          <div>
            <h1>探險</h1>
            <p>使用探險券前往火山、海洋與森林取得龍蛋。偶爾，也可能遇見稀有的光屬性或暗屬性龍蛋。</p>
          </div>
          <img src="${ASSETS.characters.mimiGuide || ASSETS.characters.mimiFull}" alt="Mimi" onerror="this.hidden=true">
        </section>
        <div class="explore-ticket-pill">
          <img src="${ASSETS.explore.ticket}" alt="" onerror="this.hidden=true">
          探險券 ${formatNumber(ticketCount)}
        </div>
        ${renderExploreMissionStrip()}
        <div class="explore-area-grid">
          ${EXPLORE_AREAS.map((area) => `
            <article class="explore-area-card explore-${area.id}" aria-label="${escapeHtml(area.name)}" style="background-image:url('${escapeHtml(area.bg)}')">
              <div class="explore-card-icon" aria-hidden="true">
                <img src="${area.icon}" alt="" onerror="this.hidden=true">
                <span>${escapeHtml(dragonElementText(area.mainElement))}</span>
              </div>
              <div class="explore-card-content">
                <h2>${escapeHtml(area.name)}</h2>
                <p>${escapeHtml(area.description)}</p>
                <span>消耗探險券 x${getConfiguredExploreTicketCost(area)}</span>
              </div>
              <button class="explore-start-btn" type="button" data-v2-action="start-explore" data-area-id="${area.id}">開始探險</button>
            </article>
          `).join("")}
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

function createEmptyAdventurerEquipment() {
  return EQUIPMENT_SLOTS.reduce((slots, slot) => {
    slots[slot] = null;
    return slots;
  }, {});
}

function createDefaultAdventurerTeams() {
  return {
    activeTeamId: "team1",
    teams: [1, 2, 3].map((number) => ({
      id: `team${number}`,
      name: `隊伍 ${number}`,
      memberIds: []
    }))
  };
}

function normalizeEquipmentStats(stats = {}) {
  return {
    hp: normalizedNonNegative(stats.hp, 0),
    attack: normalizedNonNegative(stats.attack, 0),
    defense: normalizedNonNegative(stats.defense, 0),
    speed: normalizedNonNegative(stats.speed, 0)
  };
}

function calculateEquipmentItemPower(stats = {}) {
  const normalized = normalizeEquipmentStats(stats);
  return Math.max(1, Math.round(
    normalized.hp * 0.25
    + normalized.attack * 2
    + normalized.defense * 1.5
    + normalized.speed * 1.2
  ));
}

function normalizeEquipment(equipment) {
  const source = equipment && typeof equipment === "object" ? equipment : {};
  const slot = EQUIPMENT_SLOTS.includes(source.slot) ? source.slot : "weapon";
  const rarity = ["A", "S", "SS", "SSS"].includes(String(source.rarity || "").toUpperCase())
    ? String(source.rarity).toUpperCase()
    : "A";
  const element = EQUIPMENT_ELEMENTS.includes(normalizeDragonElement(source.element))
    ? normalizeDragonElement(source.element)
    : "fire";
  const stats = normalizeEquipmentStats(source.stats);
  const folder = EQUIPMENT_SLOT_FOLDERS[slot] || slot;
  return {
    ...source,
    id: source.id || createId("equip"),
    templateId: source.templateId || `${element}_${slot}_${rarity.toLowerCase()}_001`,
    name: source.name || EQUIPMENT_NAMES[element]?.[slot] || "冒險裝備",
    slot,
    rarity,
    element,
    level: positiveNumber(source.level, 1),
    requiredLevel: positiveNumber(source.requiredLevel, 1),
    stats,
    power: positiveNumber(source.power, calculateEquipmentItemPower(stats)),
    iconAsset: source.iconAsset || `assets/equipment/icons/${folder}/${folder}-${rarity.toLowerCase()}-001.png`,
    equippedBy: source.equippedBy || null,
    locked: Boolean(source.locked),
    obtainedAt: positiveNumber(source.obtainedAt, Date.now()),
    source: source.source || "shop"
  };
}

function normalizeEquipmentShop(equipmentShop) {
  const source = equipmentShop && typeof equipmentShop === "object" ? equipmentShop : {};
  return {
    refreshAt: normalizedNonNegative(source.refreshAt, 0),
    items: Array.isArray(source.items) ? source.items.map((item) => ({
      shopItemId: item?.shopItemId || createId("shop"),
      equipment: normalizeEquipment(item?.equipment),
      price: positiveNumber(item?.price, 800),
      sold: Boolean(item?.sold)
    })) : []
  };
}

function normalizeAdventurerTeams(adventurerTeams, adventurers = []) {
  const defaults = createDefaultAdventurerTeams();
  const source = adventurerTeams && typeof adventurerTeams === "object" ? adventurerTeams : {};
  const savedTeams = Array.isArray(source.teams) ? source.teams : [];
  const validIds = new Set(adventurers.map((adventurer) => adventurer.id));
  const assignedIds = new Set();
  const teams = defaults.teams.map((defaultTeam) => {
    const saved = savedTeams.find((team) => team?.id === defaultTeam.id) || {};
    const memberIds = [];
    (Array.isArray(saved.memberIds) ? saved.memberIds : []).forEach((id) => {
      if (validIds.has(id) && !assignedIds.has(id) && memberIds.length < ADVENTURER_TEAM_SIZE) {
        memberIds.push(id);
        assignedIds.add(id);
      }
    });
    return {
      id: defaultTeam.id,
      name: String(saved.name || defaultTeam.name),
      memberIds
    };
  });

  adventurers.forEach((adventurer) => {
    if (!adventurer.isInTeam || assignedIds.has(adventurer.id)) return;
    const preferred = teams.find((team) => team.id === adventurer.teamId) || teams[0];
    if (preferred.memberIds.length < ADVENTURER_TEAM_SIZE) {
      preferred.memberIds.push(adventurer.id);
      assignedIds.add(adventurer.id);
    }
  });

  return {
    activeTeamId: teams.some((team) => team.id === source.activeTeamId) ? source.activeTeamId : "team1",
    teams
  };
}

function syncAdventurerTeamFlags() {
  if (!Array.isArray(state?.adventurers) || !Array.isArray(state?.adventurerTeams?.teams)) return;
  const teamByMember = new Map();
  state.adventurerTeams.teams.forEach((team) => {
    team.memberIds = team.memberIds.filter((id, index, ids) => (
      ids.indexOf(id) === index && !teamByMember.has(id) && Boolean(getAdventurerById(id))
    )).slice(0, ADVENTURER_TEAM_SIZE);
    team.memberIds.forEach((id) => teamByMember.set(id, team.id));
  });
  state.adventurers.forEach((adventurer) => {
    adventurer.teamId = teamByMember.get(adventurer.id) || null;
    adventurer.isInTeam = Boolean(adventurer.teamId);
  });
}

function calculateEquipmentStats(adventurer) {
  const totals = { hp: 0, attack: 0, defense: 0, speed: 0, power: 0 };
  if (!adventurer) return totals;
  EQUIPMENT_SLOTS.forEach((slot) => {
    const equipmentId = adventurer.equipment?.[slot];
    const item = (state.equipmentInventory || []).find((equipment) => equipment.id === equipmentId);
    if (!item || item.equippedBy !== adventurer.id) return;
    totals.hp += item.stats.hp;
    totals.attack += item.stats.attack;
    totals.defense += item.stats.defense;
    totals.speed += item.stats.speed;
    totals.power += item.power;
  });
  return totals;
}

function calculateFinalStats(adventurer) {
  const template = getAdventurerTemplate(adventurer);
  const base = template
    ? calculateAdventurerBaseStats(template, adventurer?.level, adventurer?.growthRoll)
    : adventurer?.baseStats || { hp: 100, attack: 10, defense: 10, speed: 10 };
  const equipment = calculateEquipmentStats(adventurer);
  return {
    hp: base.hp + equipment.hp,
    attack: base.attack + equipment.attack,
    defense: base.defense + equipment.defense,
    speed: base.speed + equipment.speed,
    equipment
  };
}

function calculateAdventurerPower(adventurer) {
  const finalStats = calculateFinalStats(adventurer);
  return Math.max(1, Math.round(
    finalStats.hp * 0.25
    + finalStats.attack * 2
    + finalStats.defense * 1.5
    + finalStats.speed * 1.2
    + finalStats.equipment.power
  ));
}

function recalculateAdventurerDerivedStats(adventurer) {
  if (!adventurer) return;
  const finalStats = calculateFinalStats(adventurer);
  const template = getAdventurerTemplate(adventurer);
  adventurer.baseStats = template
    ? calculateAdventurerBaseStats(template, adventurer.level, adventurer.growthRoll)
    : adventurer.baseStats;
  adventurer.hp = finalStats.hp;
  adventurer.attack = finalStats.attack;
  adventurer.defense = finalStats.defense;
  adventurer.speed = finalStats.speed;
  adventurer.equipmentPower = finalStats.equipment.power;
  adventurer.power = calculateAdventurerPower(adventurer);
}

function syncAdventurerEquipmentState() {
  if (!Array.isArray(state?.adventurers) || !Array.isArray(state?.equipmentInventory)) return;
  const equipmentById = new Map(state.equipmentInventory.map((item) => [item.id, item]));
  const savedOwners = new Map(state.equipmentInventory.map((item) => [item.id, item.equippedBy]));
  const assigned = new Set();
  state.equipmentInventory.forEach((item) => { item.equippedBy = null; });

  state.adventurers.forEach((adventurer) => {
    adventurer.equipment = { ...createEmptyAdventurerEquipment(), ...(adventurer.equipment || {}) };
    EQUIPMENT_SLOTS.forEach((slot) => {
      const equipmentId = adventurer.equipment[slot];
      const item = equipmentById.get(equipmentId);
      if (!item || item.slot !== slot || assigned.has(item.id)) {
        adventurer.equipment[slot] = null;
        return;
      }
      item.equippedBy = adventurer.id;
      assigned.add(item.id);
    });
  });

  state.equipmentInventory.forEach((item) => {
    if (assigned.has(item.id)) return;
    const owner = getAdventurerById(savedOwners.get(item.id));
    if (!owner || owner.equipment[item.slot]) return;
    owner.equipment[item.slot] = item.id;
    item.equippedBy = owner.id;
    assigned.add(item.id);
  });

  state.adventurers.forEach(recalculateAdventurerDerivedStats);
}

function adventurerGrowthValue(seed, stat) {
  const value = `${seed}:${stat}`;
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) / 4294967295;
}

function createAdventurerGrowthRoll(template, seed = `${Date.now()}-${Math.random()}`) {
  const min = Number(template?.growth?.variance?.min) || 0.9;
  const max = Number(template?.growth?.variance?.max) || 1.1;
  return Object.fromEntries(["hp", "attack", "defense", "speed"].map((stat) => [
    stat,
    Number((min + (max - min) * adventurerGrowthValue(seed, stat)).toFixed(4))
  ]));
}

function normalizeAdventurerGrowthRoll(growthRoll, template, seed) {
  const min = Number(template?.growth?.variance?.min) || 0.9;
  const max = Number(template?.growth?.variance?.max) || 1.1;
  const fallback = createAdventurerGrowthRoll(template, seed);
  return Object.fromEntries(["hp", "attack", "defense", "speed"].map((stat) => [
    stat,
    clamp(Number(growthRoll?.[stat]) || fallback[stat], min, max)
  ]));
}

function calculateAdventurerBaseStats(template, level = 1, growthRoll = null) {
  const safeLevel = clamp(Math.floor(Number(level) || 1), 1, positiveNumber(template?.maxLevel, ADVENTURER_MAX_LEVEL));
  const roll = normalizeAdventurerGrowthRoll(growthRoll, template, template?.templateId || "adventurer");
  return Object.fromEntries(["hp", "attack", "defense", "speed"].map((stat) => {
    const base = Number(template?.growth?.base?.[stat]) || 0;
    const perLevel = Number(template?.growth?.perLevel?.[stat]) || 0;
    return [stat, Math.max(1, Math.round((base + perLevel * (safeLevel - 1)) * roll[stat]))];
  }));
}

function deriveLegacyAdventurerGrowthRoll(source, template, level) {
  if (source?.growthRoll) return normalizeAdventurerGrowthRoll(source.growthRoll, template, source.id);
  const nominal = calculateAdventurerBaseStats(template, level, { hp: 1, attack: 1, defense: 1, speed: 1 });
  const legacy = source?.baseStats && typeof source.baseStats === "object" ? source.baseStats : source;
  const min = Number(template?.growth?.variance?.min) || 0.9;
  const max = Number(template?.growth?.variance?.max) || 1.1;
  const derived = {};
  ["hp", "attack", "defense", "speed"].forEach((stat) => {
    const saved = Number(legacy?.[stat]);
    derived[stat] = saved > 0 && nominal[stat] > 0
      ? clamp(saved / nominal[stat], min, max)
      : createAdventurerGrowthRoll(template, source?.id || source?.name || template.templateId)[stat];
  });
  return derived;
}

const warnedMissingAdventurerTemplates = new Set();

function createMissingAdventurerTemplate(source, requestedTemplateId) {
  const templateId = requestedTemplateId || `legacy-${String(source?.id || createId("template")).toLowerCase()}`;
  if (!warnedMissingAdventurerTemplates.has(templateId)) {
    console.warn(`[Adventurer template missing] ${templateId}，保留玩家角色並使用 placeholder。`);
    warnedMissingAdventurerTemplates.add(templateId);
  }
  const sourceBase = source?.baseStats && typeof source.baseStats === "object" ? source.baseStats : source;
  const template = prepareAdventurerTemplate({
    id: templateId,
    number: /^\d{4}$/.test(String(source?.number || "")) ? String(source.number) : "0000",
    name: source?.name || "未知冒險者",
    rarity: String(source?.rarity || "C").toUpperCase(),
    element: String(source?.element || "fire").toLowerCase(),
    job: source?.job || "冒險者",
    description: source?.description || "舊存檔冒險者資料。",
    maxLevel: positiveNumber(source?.maxLevel, ADVENTURER_MAX_LEVEL),
    assets: {
      card: source?.cardAsset || ADVENTURER_SHARED_ASSETS.card,
      portrait: source?.portraitAsset || ADVENTURER_SHARED_ASSETS.portrait,
      icon: source?.iconAsset || ADVENTURER_SHARED_ASSETS.icon
    },
    growth: {
      base: {
        hp: positiveNumber(sourceBase?.hp, 100),
        attack: positiveNumber(sourceBase?.attack, 10),
        defense: positiveNumber(sourceBase?.defense, 10),
        speed: positiveNumber(sourceBase?.speed, 10)
      },
      perLevel: { hp: 7, attack: 2, defense: 1.2, speed: 0.7 },
      variance: { min: 0.9, max: 1.1 }
    },
    skills: Array.isArray(source?.skills) ? source.skills : [],
    animations: {}
  }, resolveGameUrl(`assets/adventurers/_legacy-runtime/${encodeURIComponent(templateId)}/data.json`));
  template.animationFrames = source?.animationFrames && Object.keys(source.animationFrames).length
    ? source.animationFrames
    : { idle: [resolveGameUrl(source?.spriteAsset || ADVENTURER_SHARED_ASSETS.sprite)] };
  template.actions = template.animationFrames;
  template.isMissingTemplate = true;
  adventurerTemplatesById.set(templateId, template);
  return template;
}

function normalizeAdventurer(adventurer) {
  const source = adventurer && typeof adventurer === "object" ? adventurer : {};
  const templateId = migrateAdventurerTemplateId(source.templateId);
  const templatePool = getAdventurerTemplatePool();
  const template = getAdventurerTemplate(templateId)
    || templatePool.find((item) => item.name === source.name)
    || createMissingAdventurerTemplate(source, templateId);
  if (!template) return null;
  const level = clamp(positiveNumber(source.level, 1), 1, positiveNumber(template.maxLevel, ADVENTURER_MAX_LEVEL));
  const growthRoll = deriveLegacyAdventurerGrowthRoll(source, template, level);
  const baseStats = calculateAdventurerBaseStats(template, level, growthRoll);
  const equipment = { ...createEmptyAdventurerEquipment() };
  EQUIPMENT_SLOTS.forEach((slot) => {
    equipment[slot] = source.equipment?.[slot] || null;
  });

  return {
    id: source.id || createId("adv"),
    templateId: template.templateId,
    name: source.name || template.name,
    rarity: template.rarity,
    element: template.element,
    job: template.job,
    description: template.description || "",
    level,
    exp: normalizedNonNegative(source.exp, 0),
    growthRoll,
    power: positiveNumber(source.power, template.basePower),
    hp: baseStats.hp,
    attack: baseStats.attack,
    defense: baseStats.defense,
    speed: baseStats.speed,
    baseStats,
    equipment,
    equipmentPower: normalizedNonNegative(source.equipmentPower, 0),
    locked: Boolean(source.locked),
    favorite: Boolean(source.favorite),
    isBeginnerAdventurer: Boolean(source.isBeginnerAdventurer || source.beginnerProtected || source.missionProtected),
    isInTeam: Boolean(source.isInTeam),
    teamId: source.teamId || null,
    shards: normalizedNonNegative(source.shards, 0),
    obtainedAt: positiveNumber(source.obtainedAt, Date.now()),
    assetRoot: template.assetRoot,
    animationFrames: template.animationFrames,
    animations: template.animations,
    portraitAsset: template.portraitAsset,
    iconAsset: template.iconAsset,
    cardAsset: template.cardAsset,
    spriteAsset: template.animationFrames?.idle?.[0] || ADVENTURER_SHARED_ASSETS.sprite,
    skills: template.skills
  };
}

function getAdventurerById(adventurerId) {
  return (state.adventurers || []).find((item) => item.id === adventurerId) || null;
}

function adventurerElementLabel(element) {
  return dragonElementText(normalizeDragonElement(element));
}

function resolveAdventurerAsset(templateOrInstance, assetType = "card", action = "idle") {
  const template = getAdventurerTemplate(templateOrInstance) || templateOrInstance;
  if (!template) return ADVENTURER_SHARED_ASSETS[assetType] || ADVENTURER_SHARED_ASSETS.sprite;
  if (assetType === "card") return template.cardAsset || ADVENTURER_SHARED_ASSETS.card;
  if (assetType === "portrait") return template.portraitAsset || ADVENTURER_SHARED_ASSETS.portrait;
  if (assetType === "icon") return template.iconAsset || ADVENTURER_SHARED_ASSETS.icon;
  if (assetType === "effect") {
    const skill = (template.skills || []).find((item) => item.id === action);
    return resolveTemplateAsset(template, skill?.effect, ADVENTURER_SHARED_ASSETS.sprite);
  }
  if (assetType === "audio") {
    return resolveTemplateAsset(template, `audio/${action}.mp3`, "");
  }
  const fallbackActions = action.startsWith("skill-")
    ? [action, "attack", "idle"]
    : action === "idle"
      ? ["idle"]
      : [action, "idle"];
  for (const fallbackAction of fallbackActions) {
    const frames = template.animationFrames?.[fallbackAction];
    if (Array.isArray(frames) && frames.length) return frames[0];
  }
  return ADVENTURER_SHARED_ASSETS.sprite;
}

function getAdventurerCardAsset(adventurer) {
  return resolveAdventurerAsset(adventurer, "card");
}

function getAdventurerPortraitAsset(adventurer) {
  return resolveAdventurerAsset(adventurer, "portrait");
}

function getAdventurerIconAsset(adventurer) {
  return resolveAdventurerAsset(adventurer, "icon");
}

function getAdventurerAnimationFrames(adventurer, action = "idle") {
  const template = getAdventurerTemplate(adventurer);
  if (!template) return [ADVENTURER_SHARED_ASSETS.sprite];
  const fallbackActions = action.startsWith("skill-")
    ? [action, "attack", "idle"]
    : action === "idle"
      ? ["idle"]
      : [action, "idle"];
  for (const fallbackAction of fallbackActions) {
    const frames = template.animationFrames?.[fallbackAction];
    if (Array.isArray(frames) && frames.length) return frames;
  }
  return [ADVENTURER_SHARED_ASSETS.sprite];
}

function getAdventurerSpriteAsset(adventurer, action = "idle") {
  return getAdventurerAnimationFrames(adventurer, action)[0];
}

function getAdventurerCardFallback(rarity) {
  return ADVENTURER_SHARED_ASSETS.card;
}

function renderAdventurerImage(src, fallback, className, alt, extraAttributes = "") {
  const fallbackList = [...new Set((Array.isArray(fallback) ? fallback : [fallback]).filter(Boolean))];
  const encodedFallbacks = encodeURIComponent(JSON.stringify(fallbackList));
  return `<img class="${className}" src="${escapeHtml(src)}" alt="${escapeHtml(alt || "")}" decoding="async" loading="lazy" data-fallback-index="0" data-fallbacks="${encodedFallbacks}" ${extraAttributes} onerror="this.dataset.fallbackUsed='1';const q=JSON.parse(decodeURIComponent(this.dataset.fallbacks||'%5B%5D'));const i=Number(this.dataset.fallbackIndex||0);if(i<q.length){this.dataset.fallbackIndex=String(i+1);this.src=q[i]}else{this.hidden=true}">`;
}

function renderAdventurerAnimatedImage(adventurer, action, className, alt) {
  const template = getAdventurerTemplate(adventurer);
  const display = template?.display || {};
  const scale = className.includes("detail")
    ? Number(display.portraitScale) || 1
    : className.includes("map")
      ? Number(display.mapScale) || 1
      : Number(display.guildScale) || 1;
  const anchorX = clamp(Number(display.anchorX ?? 0.5), 0, 1);
  const anchorY = clamp(Number(display.anchorY ?? 1), 0, 1);
  const fallbacks = action.startsWith("skill-")
    ? [resolveAdventurerAsset(adventurer, "sprite", "attack"), resolveAdventurerAsset(adventurer, "sprite", "idle"), ADVENTURER_SHARED_ASSETS.sprite]
    : [resolveAdventurerAsset(adventurer, "sprite", "idle"), ADVENTURER_SHARED_ASSETS.sprite];
  return renderAdventurerImage(
    getAdventurerSpriteAsset(adventurer, action),
    fallbacks,
    className,
    alt,
    `data-adventurer-animation="${escapeHtml(action)}" data-adventurer-id="${escapeHtml(adventurer.id)}" style="--adventurer-instance-scale:${scale};--adventurer-anchor-x:${anchorX * 100}%;--adventurer-anchor-y:${anchorY * 100}%"`
  );
}

function startAdventurerFrameAnimationLoop() {
  if (window.__adventurerFrameTimer) return;
  window.__adventurerFrameTimer = window.setInterval(() => {
    document.querySelectorAll("[data-adventurer-animation][data-adventurer-id]").forEach((image) => {
      if (image.dataset.fallbackUsed === "1") return;
      const adventurer = getAdventurerById(image.dataset.adventurerId);
      if (!adventurer) return;
      const action = image.dataset.adventurerAnimation || "idle";
      const frames = getAdventurerAnimationFrames(adventurer, action);
      if (frames.length <= 1) return;
      const template = getAdventurerTemplate(adventurer);
      const duration = positiveNumber(template?.animations?.[action]?.frameDuration, 150);
      const index = Math.floor(Date.now() / duration) % frames.length;
      if (image.getAttribute("src") !== frames[index]) image.src = frames[index];
    });
  }, 80);
}

function weightedRandom(items, getWeight = (item) => item?.rate ?? item?.weight ?? 0) {
  const weightedItems = (Array.isArray(items) ? items : [])
    .map((item) => ({ item, weight: Math.max(0, Number(getWeight(item)) || 0) }))
    .filter((entry) => entry.weight > 0);
  const total = weightedItems.reduce((sum, entry) => sum + entry.weight, 0);
  if (!total) return null;
  let roll = Math.random() * total;
  for (const entry of weightedItems) {
    roll -= entry.weight;
    if (roll < 0) return entry.item;
  }
  return weightedItems.at(-1)?.item || null;
}

function getConfiguredAdventurerRarityRates() {
  const configured = gameConfig?.gacha?.adventurer?.rarities || {};
  return ADVENTURER_RARITY_RATES.map((entry) => ({
    rarity: entry.rarity,
    rate: Math.max(0, Number(configured[entry.rarity]) || 0)
  }));
}

function getConfiguredAdventurerElementRates() {
  const configured = gameConfig?.gacha?.adventurer?.elements || {};
  return ["fire", "water", "wood", "light", "dark"].map((element) => ({
    element,
    rate: Math.max(0, Number(configured[element]) || 0)
  }));
}

function getAvailableAdventurerPool(rarity, element) {
  return getAdventurerTemplatePool().filter((template) => (
    (!rarity || template.rarity === rarity)
    && (!element || template.element === element)
    && !String(template.__dataPath || "").includes("/_shared/")
    && !String(template.__dataPath || "").includes("/_legacy/")
  ));
}

function rollAdventurerRarity(availableRarities = null) {
  const allowed = availableRarities ? new Set(availableRarities) : null;
  const rates = getConfiguredAdventurerRarityRates()
    .filter((entry) => !allowed || allowed.has(entry.rarity));
  return weightedRandom(rates)?.rarity || null;
}

function rollAdventurerElement(availableElements = null) {
  const allowed = availableElements ? new Set(availableElements) : null;
  const rates = getConfiguredAdventurerElementRates()
    .filter((entry) => !allowed || allowed.has(entry.element));
  return weightedRandom(rates)?.element || null;
}

function rollAdventurerTemplate() {
  const templates = getAdventurerTemplatePool();
  if (!templates.length) return null;

  const availableRarities = [...new Set(templates.map((template) => template.rarity))];
  let rarity = rollAdventurerRarity();
  if (!rarity || !availableRarities.includes(rarity)) {
    console.warn("[Adventurer gacha] Empty rarity pool; rerolling from available rarities.", rarity, availableRarities);
    rarity = rollAdventurerRarity(availableRarities);
  }
  if (!rarity) return null;

  const rarityPool = getAvailableAdventurerPool(rarity);
  const availableElements = [...new Set(rarityPool.map((template) => template.element))];
  let element = rollAdventurerElement();
  if (!element || !availableElements.includes(element)) {
    console.warn(`[Adventurer gacha] Empty ${rarity}/${element || "unknown"} pool; rerolling from available elements.`, availableElements);
    element = rollAdventurerElement(availableElements);
  }
  if (!element) return null;

  const candidates = getAvailableAdventurerPool(rarity, element);
  if (!candidates.length) {
    console.warn(`[Adventurer gacha] No valid templates in ${rarity}/${element}.`);
    return null;
  }
  return candidates[Math.floor(Math.random() * candidates.length)] || null;
}

function createAdventurerInstance(template) {
  return normalizeAdventurer({
    id: createId("adv"),
    templateId: template.templateId,
    name: template.name,
    level: 1,
    exp: 0,
    growthRoll: createAdventurerGrowthRoll(template, `${Date.now()}-${Math.random()}`),
    locked: false,
    favorite: false,
    isInTeam: false,
    teamId: null,
    equipment: createEmptyAdventurerEquipment(),
    shards: 0,
    obtainedAt: Date.now()
  });
}

function getFilteredAdventurers() {
  const keyword = String(adventurerGuildFilters.search || "").trim().toLowerCase();
  return (state.adventurers || []).filter((adventurer) => {
    const searchable = [
      adventurer.name,
      adventurer.rarity,
      adventurer.element,
      adventurerElementLabel(adventurer.element),
      adventurer.job,
      `lv${adventurer.level}`
    ].join(" ").toLowerCase();
    return (!keyword || searchable.includes(keyword))
      && (adventurerGuildFilters.rarity === "all" || adventurer.rarity === adventurerGuildFilters.rarity)
      && (adventurerGuildFilters.element === "all" || adventurer.element === adventurerGuildFilters.element)
      && (adventurerGuildFilters.job === "all" || adventurer.job === adventurerGuildFilters.job);
  });
}

let pendingBulkOperation = null;
let bulkLongPressTimer = null;
let bulkLongPressPointer = null;
let bulkSuppressClickUntil = 0;
let bulkSuppressItemId = null;

function normalizeBulkManageState(value = {}) {
  const type = ["adventurer", "egg"].includes(value?.type) ? value.type : null;
  const selectedIds = type && Array.isArray(value?.selectedIds)
    ? [...new Set(value.selectedIds.filter((id) => typeof id === "string" && id))]
    : [];
  return { type, selectedIds };
}

function getBulkManageState() {
  state.ui = state.ui && typeof state.ui === "object" ? state.ui : {};
  state.ui.bulkManage = normalizeBulkManageState(state.ui.bulkManage);
  return state.ui.bulkManage;
}

function isBulkManaging(type) {
  return getBulkManageState().type === type;
}

function adventurerHasEquipment(adventurer) {
  if (!adventurer) return false;
  const hasSlotEquipment = EQUIPMENT_SLOTS.some((slot) => Boolean(adventurer.equipment?.[slot]));
  const hasOwnedEquipment = (state.equipmentInventory || []).some((item) => item.equippedBy === adventurer.id);
  return hasSlotEquipment || hasOwnedEquipment;
}

function adventurerHasTeamReference(adventurer) {
  if (!adventurer) return false;
  return Boolean(adventurer.isInTeam || adventurer.teamId)
    || (state.adventurerTeams?.teams || []).some((team) => team.memberIds?.includes(adventurer.id));
}

function canDeleteAdventurer(adventurer) {
  if (!adventurer) return false;
  const rarity = String(adventurer.rarity || "C").toUpperCase();
  return !adventurer.locked
    && !adventurer.favorite
    && !adventurer.isBeginnerAdventurer
    && !adventurer.beginnerProtected
    && !adventurer.missionProtected
    && !["SS", "SSS"].includes(rarity)
    && !adventurerHasTeamReference(adventurer)
    && !adventurerHasEquipment(adventurer);
}

function isBeginnerHatchFlowComplete() {
  const step = state.missions?.beginner?.steps?.finishHatch;
  return Boolean(step && Number(step.current) >= Number(step.target || 1));
}

function getProtectedBeginnerEggId() {
  const eggs = Array.isArray(state.eggInventory) ? state.eggInventory : [];
  const explicit = eggs.find((egg) => egg.isBeginnerEgg || egg.beginnerProtected || egg.missionProtected);
  if (explicit) return explicit.id;
  if (isBeginnerHatchFlowComplete()) return null;
  return [...eggs].sort((a, b) => Number(a.createdAt || 0) - Number(b.createdAt || 0))[0]?.id || null;
}

function eggHasIncubatorReference(egg) {
  if (!egg) return false;
  if (egg.assignedIncubatorId || egg.incubatorId || egg.isHatching || egg.status === "hatching") return true;
  return (state.hatchIsland?.hatchSlots || []).some((slot) => (
    slot?.currentEggId === egg.id || slot?.currentEgg?.id === egg.id
  ));
}

function canDeleteEgg(egg) {
  if (!egg) return false;
  const rarity = String(egg.rarity || egg.eggRarity || "C").toUpperCase();
  return !eggHasIncubatorReference(egg)
    && !egg.locked
    && !egg.favorite
    && !["SS", "SSS"].includes(rarity)
    && egg.id !== getProtectedBeginnerEggId();
}

function getVisibleBulkItems(type = getBulkManageState().type) {
  if (type === "adventurer") return getFilteredAdventurers();
  if (type === "egg") return getAvailableEggs();
  return [];
}

function getBulkItem(type, id) {
  if (type === "adventurer") return getAdventurerById(id);
  if (type === "egg") return (state.eggInventory || []).find((egg) => egg.id === id) || null;
  return null;
}

function canDeleteBulkItem(type, item) {
  if (type === "adventurer") return canDeleteAdventurer(item);
  if (type === "egg") return canDeleteEgg(item);
  return false;
}

function showBulkProtectedToast(type) {
  showToast(type === "egg"
    ? "正在孵化、已鎖定、收藏中或高稀有度龍蛋不可刪除"
    : "已鎖定、已編隊、已裝備、收藏中或高稀有度角色不可刪除");
}

function enterBulkManage(type) {
  if (!["adventurer", "egg"].includes(type)) return;
  const bulk = getBulkManageState();
  if (bulk.type !== type) bulk.selectedIds = [];
  bulk.type = type;
  getBulkOverlayHost()?.classList.add("is-bulk-managing");
  if (type === "adventurer") closeAdventurerDetail();
  refreshBulkManageSurface(type);
  mountBulkManageToolbar();
}

function exitBulkManage(options = {}) {
  const bulk = getBulkManageState();
  const previousType = bulk.type;
  bulk.type = null;
  bulk.selectedIds = [];
  pendingBulkOperation = null;
  getBulkOverlayHost()?.classList.remove("is-bulk-managing");
  document.querySelector(".bulk-manage-toolbar")?.remove();
  document.querySelector(".bulk-confirm-backdrop")?.remove();
  if (options.refresh !== false && previousType) refreshBulkManageSurface(previousType);
}

function toggleBulkSelection(id) {
  const bulk = getBulkManageState();
  if (!bulk.type || !id) return;
  const item = getBulkItem(bulk.type, id);
  if (!canDeleteBulkItem(bulk.type, item)) {
    showBulkProtectedToast(bulk.type);
    return;
  }
  const selected = new Set(bulk.selectedIds);
  if (selected.has(id)) selected.delete(id);
  else selected.add(id);
  bulk.selectedIds = [...selected];
  refreshBulkManageSurface(bulk.type);
  mountBulkManageToolbar();
}

function selectAllVisible() {
  const bulk = getBulkManageState();
  if (!bulk.type) return;
  bulk.selectedIds = getVisibleBulkItems(bulk.type)
    .filter((item) => canDeleteBulkItem(bulk.type, item))
    .map((item) => item.id);
  refreshBulkManageSurface(bulk.type);
  mountBulkManageToolbar();
}

function invertVisibleSelection() {
  const bulk = getBulkManageState();
  if (!bulk.type) return;
  const visibleDeletableIds = new Set(getVisibleBulkItems(bulk.type)
    .filter((item) => canDeleteBulkItem(bulk.type, item))
    .map((item) => item.id));
  const selected = new Set(bulk.selectedIds.filter((id) => !visibleDeletableIds.has(id)));
  visibleDeletableIds.forEach((id) => {
    if (!bulk.selectedIds.includes(id)) selected.add(id);
  });
  bulk.selectedIds = [...selected];
  refreshBulkManageSurface(bulk.type);
  mountBulkManageToolbar();
}

function clearBulkSelection() {
  const bulk = getBulkManageState();
  if (!bulk.type) return;
  bulk.selectedIds = [];
  refreshBulkManageSurface(bulk.type);
  mountBulkManageToolbar();
}

function renderBulkManageToolbar() {
  const bulk = getBulkManageState();
  if (!bulk.type) return "";
  const unit = bulk.type === "egg" ? "顆" : "位";
  return `
    <div class="bulk-manage-toolbar" data-bulk-type="${bulk.type}" role="toolbar" aria-label="批次管理工具列">
      <div class="bulk-manage-count">已選擇 <b>${bulk.selectedIds.length}</b> ${unit}</div>
      <div class="bulk-manage-actions">
        <button type="button" data-bulk-action="cancel">取消</button>
        <button type="button" data-bulk-action="select-all">全選</button>
        <button type="button" data-bulk-action="invert">反選</button>
        <button type="button" data-bulk-action="cleanup">清理普通</button>
        <button type="button" class="is-danger" data-bulk-action="delete">刪除</button>
      </div>
    </div>
  `;
}

function getBulkOverlayHost() {
  return document.querySelector("#gameShell") || els?.homeV2Root || document.querySelector(".phone");
}

function mountBulkManageToolbar() {
  document.querySelector(".bulk-manage-toolbar")?.remove();
  const html = renderBulkManageToolbar();
  const host = getBulkOverlayHost();
  if (host && html) host.insertAdjacentHTML("beforeend", html);
}

function refreshBulkManageSurface(type) {
  if (type === "adventurer") refreshAdventurerGuildPage();
  if (type === "egg") {
    renderEggInventory();
    if (eggSelectionSlotId && document.querySelector(".egg-modal-backdrop")) mountEggSelectionModal();
  }
}

function removeAdventurerReferences(deletedIds) {
  const deleted = new Set(deletedIds);
  (state.adventurerTeams?.teams || []).forEach((team) => {
    team.memberIds = (team.memberIds || []).filter((id) => !deleted.has(id));
  });
  (state.equipmentInventory || []).forEach((equipment) => {
    if (deleted.has(equipment.equippedBy)) equipment.equippedBy = null;
  });
  if (deleted.has(selectedAdventurerId)) {
    selectedAdventurerId = null;
    closeAdventurerDetail();
  }
}

function bulkDeleteAdventurers(ids) {
  const requested = new Set(Array.isArray(ids) ? ids : []);
  const existing = (state.adventurers || []).filter((item) => requested.has(item.id));
  const deletable = existing.filter(canDeleteAdventurer);
  const deletedIds = new Set(deletable.map((item) => item.id));
  const protectedCount = existing.length - deletable.length;
  if (deletedIds.size > 0) {
    state.adventurers = state.adventurers.filter((item) => !deletedIds.has(item.id));
    removeAdventurerReferences(deletedIds);
    getBulkManageState().selectedIds = getBulkManageState().selectedIds.filter((id) => !deletedIds.has(id));
    syncAdventurerTeamFlags();
    saveGame();
    refreshAdventurerGuildPage();
  }
  return { deletedCount: deletedIds.size, protectedCount };
}

function bulkDeleteEggs(ids) {
  const requested = new Set(Array.isArray(ids) ? ids : []);
  const existing = (state.eggInventory || []).filter((item) => requested.has(item.id));
  const deletable = existing.filter(canDeleteEgg);
  const deletedIds = new Set(deletable.map((item) => item.id));
  const protectedCount = existing.length - deletable.length;
  if (deletedIds.size > 0) {
    state.eggInventory = state.eggInventory.filter((item) => !deletedIds.has(item.id));
    state.eggs = state.eggInventory;
    getBulkManageState().selectedIds = getBulkManageState().selectedIds.filter((id) => !deletedIds.has(id));
    saveGame();
    renderEggInventory();
    if (eggSelectionSlotId && document.querySelector(".egg-modal-backdrop")) mountEggSelectionModal();
  }
  return { deletedCount: deletedIds.size, protectedCount };
}

function cleanupCommonAdventurers() {
  const ids = (state.adventurers || [])
    .filter((item) => ["C", "B"].includes(String(item.rarity || "C").toUpperCase()))
    .filter(canDeleteAdventurer)
    .map((item) => item.id);
  return bulkDeleteAdventurers(ids);
}

function cleanupCommonEggs() {
  const ids = (state.eggInventory || [])
    .filter((item) => ["C", "B"].includes(String(item.rarity || item.eggRarity || "C").toUpperCase()))
    .filter(canDeleteEgg)
    .map((item) => item.id);
  return bulkDeleteEggs(ids);
}

function getBulkCleanupCandidates(type) {
  const source = type === "egg" ? (state.eggInventory || []) : (state.adventurers || []);
  return source.filter((item) => {
    const rarity = String(item.rarity || item.eggRarity || "C").toUpperCase();
    return ["C", "B"].includes(rarity) && canDeleteBulkItem(type, item);
  });
}

function renderBulkConfirmModal(operation, type, count) {
  const isEgg = type === "egg";
  const isCleanup = operation === "cleanup";
  const title = isCleanup
    ? `清理普通${isEgg ? "龍蛋" : "冒險者"}`
    : `刪除${isEgg ? "龍蛋" : "冒險者"}`;
  const message = isCleanup
    ? `將刪除所有可刪除的 C、B ${isEgg ? "龍蛋" : "冒險者"}，共 ${count} ${isEgg ? "顆" : "位"}。`
    : `確定刪除 ${count} ${isEgg ? "顆龍蛋" : "位冒險者"}嗎？刪除後無法復原。`;
  return `
    <div class="bulk-confirm-backdrop" data-bulk-confirm-backdrop>
      <section class="bulk-confirm-modal" role="dialog" aria-modal="true" aria-label="${title}">
        <h2>${title}</h2>
        <p>${message}</p>
        <div>
          <button type="button" data-bulk-action="close-confirm">取消</button>
          <button type="button" class="is-danger" data-bulk-action="confirm">確認${isCleanup ? "清理" : "刪除"}</button>
        </div>
      </section>
    </div>
  `;
}

function openBulkConfirm(operation) {
  const bulk = getBulkManageState();
  if (!bulk.type) return;
  const ids = operation === "cleanup"
    ? getBulkCleanupCandidates(bulk.type).map((item) => item.id)
    : [...bulk.selectedIds];
  if (ids.length === 0) {
    showToast(operation === "cleanup"
      ? `沒有可清理的普通${bulk.type === "egg" ? "龍蛋" : "冒險者"}`
      : `請先選擇要刪除的${bulk.type === "egg" ? "龍蛋" : "冒險者"}`);
    return;
  }
  pendingBulkOperation = { operation, type: bulk.type, ids };
  document.querySelector(".bulk-confirm-backdrop")?.remove();
  getBulkOverlayHost()?.insertAdjacentHTML("beforeend", renderBulkConfirmModal(operation, bulk.type, ids.length));
}

function confirmBulkOperation() {
  const pending = pendingBulkOperation;
  if (!pending) return;
  pendingBulkOperation = null;
  document.querySelector(".bulk-confirm-backdrop")?.remove();
  const result = pending.operation === "cleanup"
    ? (pending.type === "egg" ? cleanupCommonEggs() : cleanupCommonAdventurers())
    : (pending.type === "egg" ? bulkDeleteEggs(pending.ids) : bulkDeleteAdventurers(pending.ids));
  if (result.protectedCount > 0) {
    showToast(`已自動略過 ${result.protectedCount} ${pending.type === "egg" ? "顆" : "位"}受保護項目`);
  }
  if (result.deletedCount > 0) {
    showToast(`已${pending.operation === "cleanup" ? "清理" : "刪除"} ${result.deletedCount} ${pending.type === "egg" ? "顆龍蛋" : "位冒險者"}`);
  }
  mountBulkManageToolbar();
}

function handleBulkManageClick(event) {
  const actionButton = event.target.closest("[data-bulk-action]");
  if (actionButton) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    const action = actionButton.dataset.bulkAction;
    if (action === "enter") enterBulkManage(actionButton.dataset.bulkType);
    if (action === "cancel") exitBulkManage();
    if (action === "select-all") selectAllVisible();
    if (action === "invert") invertVisibleSelection();
    if (action === "clear") clearBulkSelection();
    if (action === "cleanup") openBulkConfirm("cleanup");
    if (action === "delete") openBulkConfirm("delete");
    if (action === "close-confirm") {
      pendingBulkOperation = null;
      document.querySelector(".bulk-confirm-backdrop")?.remove();
    }
    if (action === "confirm") confirmBulkOperation();
    return;
  }

  const item = event.target.closest("[data-bulk-item-type][data-bulk-item-id]");
  if (!item) return;
  const bulk = getBulkManageState();
  if (bulk.type !== item.dataset.bulkItemType) return;
  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();
  toggleBulkSelection(item.dataset.bulkItemId);
}

function clearBulkLongPressTimer() {
  if (bulkLongPressTimer) clearTimeout(bulkLongPressTimer);
  bulkLongPressTimer = null;
  bulkLongPressPointer = null;
}

function handleBulkLongPressStart(event) {
  const item = event.target.closest("[data-bulk-item-type][data-bulk-item-id]");
  if (!item || isBulkManaging(item.dataset.bulkItemType)) return;
  clearBulkLongPressTimer();
  bulkLongPressPointer = {
    id: event.pointerId,
    x: event.clientX,
    y: event.clientY,
    type: item.dataset.bulkItemType,
    itemId: item.dataset.bulkItemId
  };
  bulkLongPressTimer = setTimeout(() => {
    const press = bulkLongPressPointer;
    if (!press) return;
    bulkSuppressClickUntil = Date.now() + 800;
    bulkSuppressItemId = press.itemId;
    enterBulkManage(press.type);
    toggleBulkSelection(press.itemId);
    clearBulkLongPressTimer();
  }, 500);
}

function handleBulkLongPressMove(event) {
  if (!bulkLongPressPointer || bulkLongPressPointer.id !== event.pointerId) return;
  if (Math.hypot(event.clientX - bulkLongPressPointer.x, event.clientY - bulkLongPressPointer.y) > 8) {
    clearBulkLongPressTimer();
  }
}

function handleBulkLongPressEnd(event) {
  if (!bulkLongPressPointer || bulkLongPressPointer.id === event.pointerId) clearBulkLongPressTimer();
}

function suppressBulkLongPressClick(event) {
  const item = event.target.closest("[data-bulk-item-id]");
  if (Date.now() >= bulkSuppressClickUntil || !item || item.dataset.bulkItemId !== bulkSuppressItemId) return;
  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();
  bulkSuppressClickUntil = 0;
  bulkSuppressItemId = null;
}

function attachBulkManageEvents() {
  if (document.documentElement.dataset.bulkManageBound === "true") return;
  document.addEventListener("click", suppressBulkLongPressClick, true);
  document.addEventListener("click", handleBulkManageClick, true);
  document.addEventListener("pointerdown", handleBulkLongPressStart, true);
  document.addEventListener("pointermove", handleBulkLongPressMove, true);
  document.addEventListener("pointerup", handleBulkLongPressEnd, true);
  document.addEventListener("pointercancel", handleBulkLongPressEnd, true);
  document.documentElement.dataset.bulkManageBound = "true";
}

attachBulkManageEvents();

function renderAdventurerSelectOptions(options, selected) {
  return options.map(([value, label]) => (
    `<option value="${escapeHtml(value)}"${value === selected ? " selected" : ""}>${escapeHtml(label)}</option>`
  )).join("");
}

function renderWorldAdventurerGuildPage(index) {
  return `
    <section class="worldPage adventurerGuildPage" data-world-index="${index}" aria-label="冒險者工會">
      ${renderAdventurerGuildPageInner()}
    </section>
  `;
}

function renderAdventurerGuildPageInner() {
  const adventurers = getFilteredAdventurers();
  const total = (state.adventurers || []).length;
  const tickets = normalizedNonNegative(state.characterTickets, 0);
  const jobs = [...new Set(getAdventurerTemplatePool().map((item) => item.job))];
  const summonCostText = tickets > 0 ? "角色券 x1" : `${getAdventurerSummonDiamondCost()} 鑽石`;
  const bulk = getBulkManageState();
  const isManaging = bulk.type === "adventurer";
  const isDataLoading = adventurerDataState.status === "idle" || adventurerDataState.status === "loading";
  const isDataError = adventurerDataState.status === "error";

  return `
    <div class="adventurer-guild-page">
      <section class="adventurer-guild-heading">
        <div>
          <h1>冒險者工會</h1>
          <p>召喚角色卡，建立你的冒險者名冊。</p>
        </div>
        <div class="adventurer-heading-actions">
          <span class="adventurer-count">${isManaging ? `已選擇 ${bulk.selectedIds.length} 位` : `持有 ${formatNumber(total)}`}</span>
          <button type="button" class="bulk-manage-entry" data-bulk-action="${isManaging ? "cancel" : "enter"}" data-bulk-type="adventurer">
            ${isManaging ? "完成" : "管理"}
          </button>
        </div>
      </section>

      <section class="adventurer-summon-bar">
        <div class="adventurer-ticket-count">
          ${renderAdventurerImage(ASSETS.icons.characterTicket, ADVENTURER_SHARED_ASSETS.icon, "adventurer-ticket-icon", "角色召喚券")}
          <span>角色券 <b>${formatNumber(tickets)}</b></span>
        </div>
        <button type="button" data-v2-action="summon-adventurer"${isDataLoading || isDataError ? " disabled aria-disabled=\"true\"" : ""}>
          <span>召喚角色</span>
          <small>${summonCostText}</small>
        </button>
      </section>

      <section class="adventurer-guild-tools" aria-label="角色搜尋與篩選">
        <input type="search" data-adventurer-search placeholder="搜尋角色名稱或職業" value="${escapeHtml(adventurerGuildFilters.search)}">
        <div>
          <select data-adventurer-filter="rarity" aria-label="依稀有度篩選">
            ${renderAdventurerSelectOptions([["all", "全部稀有度"], ["C", "C"], ["B", "B"], ["A", "A"], ["S", "S"], ["SS", "SS"], ["SSS", "SSS"]], adventurerGuildFilters.rarity)}
          </select>
          <select data-adventurer-filter="element" aria-label="依屬性篩選">
            ${renderAdventurerSelectOptions([["all", "全部屬性"], ["fire", "火"], ["water", "水"], ["wood", "木"], ["light", "光"], ["dark", "暗"]], adventurerGuildFilters.element)}
          </select>
          <select data-adventurer-filter="job" aria-label="依職業篩選">
            ${renderAdventurerSelectOptions([["all", "全部職業"], ...jobs.map((job) => [job, job])], adventurerGuildFilters.job)}
          </select>
        </div>
      </section>

      <section class="adventurer-grid" aria-label="持有角色">
        ${isDataLoading
          ? `<div class="adventurer-empty-state"><b>冒險者資料載入中</b><span>請稍候片刻。</span></div>`
          : isDataError
            ? `<div class="adventurer-empty-state"><b>冒險者資料載入失敗</b><span>${escapeHtml(adventurerDataState.error || "請檢查角色資料或重新載入")}</span><button type="button" data-v2-action="retry-load-adventurers">重新載入角色資料</button></div>`
            : adventurers.length
              ? adventurers.map(renderAdventurerGuildCard).join("")
              : `<div class="adventurer-empty-state"><b>尚無符合條件的角色</b><span>使用召喚券或鑽石召喚第一位冒險者。</span></div>`}
      </section>
    </div>
  `;
}

function renderAdventurerGuildCard(adventurer) {
  const bulk = getBulkManageState();
  const isManaging = bulk.type === "adventurer";
  const isSelected = isManaging && bulk.selectedIds.includes(adventurer.id);
  const isProtected = isManaging && !canDeleteAdventurer(adventurer);
  return `
    <button class="adventurer-card rarity-${adventurer.rarity.toLowerCase()}${isManaging ? " bulk-selectable" : ""}${isSelected ? " bulk-selected" : ""}${isProtected ? " bulk-protected" : ""}" type="button" data-v2-action="open-adventurer-detail" data-adventurer-id="${adventurer.id}" data-bulk-item-type="adventurer" data-bulk-item-id="${adventurer.id}" aria-label="查看 ${escapeHtml(adventurer.name)}"${isManaging ? ` aria-pressed="${isSelected}"` : ""}>
      ${isManaging ? `<span class="bulk-selection-indicator" aria-hidden="true">${isProtected ? "鎖" : (isSelected ? "✓" : "")}</span>` : ""}
      <span class="adventurer-card-sprite">
        ${renderAdventurerAnimatedImage(adventurer, "idle", "adventurer-pixel", adventurer.name)}
      </span>
      ${renderAdventurerImage(getAdventurerIconAsset(adventurer), ADVENTURER_SHARED_ASSETS.icon, "adventurer-card-icon", `${adventurer.name} icon`)}
      <b>${escapeHtml(adventurer.name)}</b>
      <small>${escapeHtml(adventurerElementLabel(adventurer.element))} / ${escapeHtml(adventurer.job)}</small>
      <span class="adventurer-card-meta"><em>${escapeHtml(adventurer.rarity)}</em><i>Lv.${formatNumber(adventurer.level)}</i></span>
      ${adventurer.locked ? `<span class="adventurer-lock-mark" aria-label="已鎖定">鎖</span>` : ""}
    </button>
  `;
}

function refreshAdventurerGuildPage(options = {}) {
  const page = document.querySelector(".adventurerGuildPage");
  if (!page) return;
  page.innerHTML = renderAdventurerGuildPageInner();
  if (options.focusSearch) {
    requestAnimationFrame(() => {
      const input = page.querySelector("[data-adventurer-search]");
      if (!input) return;
      input.focus({ preventScroll: true });
      input.setSelectionRange(input.value.length, input.value.length);
    });
  }
}

function canPayAdventurerSummon() {
  return normalizedNonNegative(state.characterTickets, 0) > 0
    || normalizedNonNegative(state.diamonds, 0) >= getAdventurerSummonDiamondCost();
}

function getAdventurerSummonDiamondCost() {
  return Math.max(0, Math.round(gameConfigNumber(
    "economy.adventurerSummonDiamonds",
    gameConfigNumber("gacha.adventurer.diamondCost", ADVENTURER_SUMMON_DIAMOND_COST)
  )));
}

function consumeAdventurerSummonCost() {
  state.characterTickets = normalizedNonNegative(state.characterTickets, 0);
  if (state.characterTickets > 0) {
    state.characterTickets -= 1;
    return "ticket";
  }
  const diamondCost = getAdventurerSummonDiamondCost();
  if (normalizedNonNegative(state.diamonds, 0) >= diamondCost) {
    state.diamonds -= diamondCost;
    return "diamonds";
  }
  return null;
}

async function handleAdventurerSummon() {
  if (adventurerDataState.status === "idle" || adventurerDataState.status === "loading") {
    showToast("冒險者資料仍在載入，請稍候");
    return false;
  }
  if (adventurerDataState.status === "error") {
    showToast(adventurerDataState.error || "冒險者資料載入失敗");
    return false;
  }
  return summonAdventurer();
}

function summonAdventurer() {
  const templatePool = getAdventurerTemplatePool();
  if (!templatePool.length) {
    showToast("目前沒有可召喚的冒險者");
    return false;
  }
  if (!canPayAdventurerSummon()) {
    showToast("角色召喚券與鑽石都不足");
    return false;
  }
  const template = rollAdventurerTemplate();
  if (!template) {
    showToast("目前沒有符合抽卡設定的冒險者角色池");
    return false;
  }
  const paidWith = consumeAdventurerSummonCost();
  if (!paidWith) return false;

  const adventurer = createAdventurerInstance(template);
  state.adventurers.push(adventurer);
  currentAdventurerGachaResult = { adventurer, paidWith, claimed: false };
  saveGame();
  updateHomeV2HudResources();
  refreshAdventurerGuildPage();
  showAdventurerGachaOverlay(adventurer);
  return true;
}

function getAdventurerCardBack(rarity) {
  if (rarity === "SSS") return "assets/adventurers/card-backs/card-back-sss.png";
  if (rarity === "S" || rarity === "SS") return "assets/adventurers/card-backs/card-back-rare.png";
  return "assets/adventurers/card-backs/card-back-normal.png";
}

function showAdventurerGachaOverlay(adventurer) {
  closeAdventurerGachaOverlay();
  mountHomeV2Overlay(`
    <div class="adventurer-gacha-backdrop" data-adventurer-backdrop="gacha">
      <section class="adventurer-gacha-modal rarity-${adventurer.rarity.toLowerCase()}" role="dialog" aria-modal="true" aria-label="角色召喚結果">
        <header><span>角色召喚</span><b>${escapeHtml(adventurer.rarity)}</b></header>
        <div class="adventurer-card-flip" aria-live="polite">
          <div class="adventurer-card-flip-inner">
            <div class="adventurer-card-face adventurer-card-back">
              ${renderAdventurerImage(getAdventurerCardBack(adventurer.rarity), "assets/adventurers/card-backs/card-back-normal.png", "adventurer-card-art", "角色卡背")}
            </div>
            <div class="adventurer-card-face adventurer-card-front">
              ${renderAdventurerImage(getAdventurerCardAsset(adventurer), getAdventurerCardFallback(adventurer.rarity), "adventurer-card-art", adventurer.name)}
            </div>
          </div>
        </div>
        <div class="adventurer-gacha-copy">
          <span>召喚成功</span>
          <h2>${escapeHtml(adventurer.name)}</h2>
          <p>${escapeHtml(adventurerElementLabel(adventurer.element))}屬性・${escapeHtml(adventurer.job)}・${escapeHtml(adventurer.rarity)}級</p>
        </div>
        <div class="adventurer-gacha-actions">
          <button type="button" data-v2-action="accept-adventurer">收下角色</button>
          <button type="button" data-v2-action="summon-adventurer-again">繼續召喚</button>
        </div>
      </section>
    </div>
  `);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => document.querySelector(".adventurer-card-flip")?.classList.add("is-revealed"));
  });
}

function closeAdventurerGachaOverlay() {
  document.querySelector(".adventurer-gacha-backdrop")?.remove();
}

function acceptAdventurerGacha() {
  if (!currentAdventurerGachaResult || currentAdventurerGachaResult.claimed) return;
  currentAdventurerGachaResult.claimed = true;
  const name = currentAdventurerGachaResult.adventurer.name;
  closeAdventurerGachaOverlay();
  refreshAdventurerGuildPage();
  showToast(`${name} 已加入冒險者名冊`);
}

function summonAdventurerAgain() {
  if (!currentAdventurerGachaResult || currentAdventurerGachaResult.claimed) return;
  if (!canPayAdventurerSummon()) {
    showToast("角色召喚券與鑽石都不足");
    return;
  }
  currentAdventurerGachaResult.claimed = true;
  closeAdventurerGachaOverlay();
  summonAdventurer();
}

function renderEquipmentIcon(equipment, className = "equipment-icon") {
  if (!equipment) return `<span class="${className} is-empty" aria-hidden="true">＋</span>`;
  return renderAdventurerImage(
    equipment.iconAsset,
    "assets/equipment/placeholders/equipment-fallback.png",
    className,
    equipment.name
  );
}

function renderAdventurerTeamSubpanel(adventurer) {
  const teamState = state.adventurerTeams;
  const activeTeam = teamState.teams.find((team) => team.id === teamState.activeTeamId) || teamState.teams[0];
  const isActiveMember = activeTeam.memberIds.includes(adventurer.id);
  const isMemberElsewhere = Boolean(adventurer.teamId && adventurer.teamId !== activeTeam.id);
  return `
    <div class="adventurer-team-tabs" role="tablist" aria-label="切換冒險者隊伍">
      ${teamState.teams.map((team) => `
        <button type="button" data-v2-action="select-adventurer-team" data-team-id="${team.id}" class="${team.id === activeTeam.id ? "is-active" : ""}">${escapeHtml(team.name)}</button>
      `).join("")}
    </div>
    <div class="adventurer-team-summary">
      <b>${escapeHtml(activeTeam.name)}</b>
      <span>${activeTeam.memberIds.length}/${ADVENTURER_TEAM_SIZE}</span>
    </div>
    <div class="adventurer-team-slots">
      ${Array.from({ length: ADVENTURER_TEAM_SIZE }, (_, index) => {
        const member = getAdventurerById(activeTeam.memberIds[index]);
        return member ? `
          <div class="adventurer-team-slot is-filled">
            ${renderAdventurerAnimatedImage(member, "idle", "adventurer-team-avatar", member.name)}
            <small>${escapeHtml(member.name)}</small>
          </div>
        ` : `<div class="adventurer-team-slot"><span>${index + 1}</span><small>空位</small></div>`;
      }).join("")}
    </div>
    <div class="adventurer-selected-member">
      ${renderAdventurerAnimatedImage(adventurer, "idle", "adventurer-selected-avatar", adventurer.name)}
      <div><b>${escapeHtml(adventurer.name)}</b><small>${adventurer.teamId ? `目前：${escapeHtml(state.adventurerTeams.teams.find((team) => team.id === adventurer.teamId)?.name || "已編隊")}` : "尚未加入隊伍"}</small></div>
      <button type="button" data-v2-action="toggle-adventurer-team" ${isMemberElsewhere ? "disabled" : ""}>${isActiveMember ? "移出隊伍" : isMemberElsewhere ? "已在其他隊伍" : "加入隊伍"}</button>
    </div>
  `;
}

function getAdventurerUpgradeCost(adventurer) {
  return Math.round(
    gameConfigNumber("economy.upgrade.baseCost", 100)
    + positiveNumber(adventurer?.level, 1) * gameConfigNumber("economy.upgrade.levelCost", 80)
  );
}

function getAdventurerExpRequired(adventurer) {
  return Math.round(
    gameConfigNumber("economy.upgrade.baseExp", 100)
    + positiveNumber(adventurer?.level, 1) * gameConfigNumber("economy.upgrade.levelExp", 50)
  );
}

function getConfiguredAdventurerSellPrice(adventurer) {
  const rarity = String(adventurer?.rarity || "C").toUpperCase();
  return Math.max(0, Math.round(gameConfigNumber(`economy.adventurerSellPrices.${rarity}`, ADVENTURER_SELL_PRICES[rarity] || 100)));
}

function getConfiguredExploreTicketCost(area) {
  return Math.max(0, Math.round(gameConfigNumber("economy.exploreTicketCost", Number(area?.ticketCost) || 1)));
}

function getConfiguredEquipmentShopRefreshMs() {
  return Math.max(60_000, gameConfigNumber("economy.equipmentShopRefreshMinutes", 120) * 60_000);
}

function renderAdventurerUpgradeSubpanel(adventurer) {
  const cost = getAdventurerUpgradeCost(adventurer);
  const expRequired = getAdventurerExpRequired(adventurer);
  const atMaxLevel = adventurer.level >= ADVENTURER_MAX_LEVEL;
  return `
    <div class="adventurer-upgrade-level">
      <span>目前等級</span><b>Lv.${formatNumber(adventurer.level)}</b>
      <small>經驗 ${formatNumber(adventurer.exp)} / ${formatNumber(expRequired)}</small>
    </div>
    <div class="adventurer-upgrade-preview">
      <div><span>生命</span><b>${formatNumber(adventurer.baseStats.hp)}</b><i>+10</i></div>
      <div><span>攻擊</span><b>${formatNumber(adventurer.baseStats.attack)}</b><i>+4</i></div>
      <div><span>防禦</span><b>${formatNumber(adventurer.baseStats.defense)}</b><i>+3</i></div>
      <div><span>速度</span><b>${formatNumber(adventurer.baseStats.speed)}</b><i>+1</i></div>
    </div>
    <button class="adventurer-upgrade-button" type="button" data-v2-action="upgrade-adventurer" ${atMaxLevel ? "disabled" : ""}>
      ${atMaxLevel ? "已達最高等級" : `升級・${formatNumber(cost)} 金幣`}
    </button>
  `;
}

function renderEquipmentStatSummary(equipment) {
  if (!equipment) return "空";
  return Object.entries(equipment.stats)
    .filter(([, value]) => value > 0)
    .map(([key, value]) => `${({ hp: "生命", attack: "攻擊", defense: "防禦", speed: "速度" })[key]} +${value}`)
    .join("・");
}

function renderAdventurerEquipmentSubpanel(adventurer) {
  const selectedSlot = EQUIPMENT_SLOTS.includes(state.ui.activeAdventurerEquipmentSlot)
    ? state.ui.activeAdventurerEquipmentSlot
    : "weapon";
  const equipmentById = new Map(state.equipmentInventory.map((item) => [item.id, item]));
  const currentEquipment = equipmentById.get(adventurer.equipment[selectedSlot]) || null;
  const available = state.equipmentInventory
    .filter((item) => item.slot === selectedSlot && (!item.equippedBy || item.equippedBy === adventurer.id))
    .sort((left, right) => right.power - left.power);
  const equipmentBonus = calculateEquipmentStats(adventurer);
  return `
    <div class="adventurer-equipment-stats">
      <span>基礎＋裝備</span>
      <b>生命 ${adventurer.baseStats.hp} +${equipmentBonus.hp}</b><b>攻擊 ${adventurer.baseStats.attack} +${equipmentBonus.attack}</b><b>防禦 ${adventurer.baseStats.defense} +${equipmentBonus.defense}</b><b>速度 ${adventurer.baseStats.speed} +${equipmentBonus.speed}</b>
    </div>
    <div class="adventurer-equipment-slots">
      ${EQUIPMENT_SLOTS.map((slot) => {
        const item = equipmentById.get(adventurer.equipment[slot]);
        return `
          <button type="button" data-v2-action="select-adventurer-equipment-slot" data-slot="${slot}" class="equipment-slot-button${slot === selectedSlot ? " is-active" : ""}">
            <small>${EQUIPMENT_SLOT_LABELS[slot]}</small>
            ${renderEquipmentIcon(item, "equipment-slot-icon")}
            <b>${escapeHtml(item?.name || "空")}</b>
          </button>
        `;
      }).join("")}
    </div>
    <div class="adventurer-equipment-list-heading">
      <b>${EQUIPMENT_SLOT_LABELS[selectedSlot]}背包</b>
      <span>${available.length} 件</span>
    </div>
    <div class="adventurer-equipment-list">
      ${available.length ? available.map((item) => {
        const equippedHere = currentEquipment?.id === item.id;
        const levelBlocked = adventurer.level < item.requiredLevel;
        return `
          <article class="adventurer-equipment-item rarity-${item.rarity.toLowerCase()}${equippedHere ? " is-equipped" : ""}">
            ${renderEquipmentIcon(item, "adventurer-equipment-icon")}
            <b>${escapeHtml(item.name)}</b>
            <small>${item.rarity}・戰力 ${formatNumber(item.power)}</small>
            <em>${escapeHtml(renderEquipmentStatSummary(item))}</em>
            <button type="button" data-v2-action="${equippedHere ? "unequip-adventurer-equipment" : "equip-adventurer-equipment"}" data-equipment-id="${item.id}" ${levelBlocked ? "disabled" : ""}>${equippedHere ? "卸下" : levelBlocked ? `Lv.${item.requiredLevel}` : "穿戴"}</button>
          </article>
        `;
      }).join("") : `<div class="adventurer-equipment-empty">目前沒有可穿戴的${EQUIPMENT_SLOT_LABELS[selectedSlot]}裝備</div>`}
    </div>
  `;
}

function renderAdventurerTradeSubpanel(adventurer) {
  const activeTab = state.ui.activeAdventurerTradeTab === "market" ? "market" : "sell";
  const price = getConfiguredAdventurerSellPrice(adventurer);
  return `
    <div class="adventurer-trade-tabs">
      <button type="button" data-v2-action="select-adventurer-trade-tab" data-trade-tab="sell" class="${activeTab === "sell" ? "is-active" : ""}">賣出</button>
      <button type="button" data-v2-action="select-adventurer-trade-tab" data-trade-tab="market" class="${activeTab === "market" ? "is-active" : ""}">市場</button>
    </div>
    ${activeTab === "sell" ? `
      <div class="adventurer-sell-panel">
        <div><span>出售價格</span><b>${formatNumber(price)} 金幣</b></div>
        <p>${adventurer.locked ? "這位冒險者已鎖定。" : adventurer.isInTeam ? "這位冒險者正在隊伍中。" : "出售後將從冒險者名冊移除，裝備會自動卸下。"}</p>
        <div class="adventurer-sell-panel-actions">
          <button type="button" data-v2-action="toggle-adventurer-lock" data-adventurer-id="${adventurer.id}">${adventurer.locked ? "解除鎖定" : "鎖定角色"}</button>
          <button type="button" data-v2-action="open-adventurer-sell" data-adventurer-id="${adventurer.id}" ${adventurer.locked || adventurer.isInTeam ? "disabled" : ""}>出售角色</button>
        </div>
      </div>
    ` : `
      <div class="adventurer-market-placeholder">
        <b>冒險者市場尚未開放</b>
        <p>玩家交易需要伺服器與帳號資料，現在不會建立假的線上市場。</p>
      </div>
    `}
  `;
}

function renderAdventurerDetailSubpanel(adventurer) {
  const activePanel = state.ui.activeAdventurerPanel;
  if (!activePanel) return "";
  const titles = { team: "隊伍編排", upgrade: "冒險者升級", equipment: "裝備管理", trade: "交易" };
  const content = activePanel === "team"
    ? renderAdventurerTeamSubpanel(adventurer)
    : activePanel === "upgrade"
      ? renderAdventurerUpgradeSubpanel(adventurer)
      : activePanel === "equipment"
        ? renderAdventurerEquipmentSubpanel(adventurer)
        : renderAdventurerTradeSubpanel(adventurer);
  return `
    <section class="adventurer-detail-subpanel" aria-label="${titles[activePanel]}">
      <header><b>${titles[activePanel]}</b><button type="button" data-v2-action="toggle-adventurer-panel" data-panel="${activePanel}" aria-label="收合">−</button></header>
      <div class="adventurer-subpanel-content">${content}</div>
    </section>
  `;
}

function renderAdventurerDetailModal(adventurer) {
  recalculateAdventurerDerivedStats(adventurer);
  const equipmentBonus = calculateEquipmentStats(adventurer);
  const activePanel = state.ui.activeAdventurerPanel;
  return `
    <div class="adventurer-detail-backdrop" data-adventurer-backdrop="detail">
      <div class="adventurer-detail-stack">
        <section class="adventurer-detail-panel rarity-${adventurer.rarity.toLowerCase()}" role="dialog" aria-modal="false" aria-label="${escapeHtml(adventurer.name)}詳細資訊">
          <button class="adventurer-modal-close" type="button" data-v2-action="close-adventurer-detail" aria-label="關閉">×</button>
          <div class="adventurer-detail-visual">
            ${renderAdventurerImage(getAdventurerCardAsset(adventurer), getAdventurerCardFallback(adventurer.rarity), "adventurer-detail-card-art", adventurer.name)}
            ${renderAdventurerAnimatedImage(adventurer, "idle", "adventurer-detail-pixel", adventurer.name)}
          </div>
          <div class="adventurer-detail-info">
            <span class="adventurer-detail-rarity">${escapeHtml(adventurer.rarity)}${adventurer.locked ? "・已鎖定" : ""}</span>
            <h2>${escapeHtml(adventurer.name)}</h2>
            <p>${escapeHtml(adventurerElementLabel(adventurer.element))}屬性・${escapeHtml(adventurer.job)}・Lv.${formatNumber(adventurer.level)}${adventurer.teamId ? "・出戰中" : ""}</p>
            <dl>
              <div><dt>戰力</dt><dd>${formatNumber(adventurer.power)}</dd></div>
              <div><dt>生命</dt><dd>${formatNumber(adventurer.hp)} <i>裝+${equipmentBonus.hp}</i></dd></div>
              <div><dt>攻擊</dt><dd>${formatNumber(adventurer.attack)} <i>裝+${equipmentBonus.attack}</i></dd></div>
              <div><dt>防禦</dt><dd>${formatNumber(adventurer.defense)} <i>裝+${equipmentBonus.defense}</i></dd></div>
              <div><dt>速度</dt><dd>${formatNumber(adventurer.speed)} <i>裝+${equipmentBonus.speed}</i></dd></div>
              <div><dt>碎片</dt><dd>${formatNumber(adventurer.shards)}</dd></div>
            </dl>
            <div class="adventurer-detail-skills" aria-label="專有技能">
              ${(adventurer.skills || []).length
                ? adventurer.skills.map((skill) => `
                  <span title="${escapeHtml(skill.description || "")}">
                    <b>${escapeHtml(skill.name)}</b>
                    <small>Lv.${formatNumber(skill.unlockLevel || 1)} 解鎖</small>
                  </span>
                `).join("")
                : `<span class="is-empty"><b>無專有技能</b><small>可使用普通攻擊與共通技能</small></span>`}
            </div>
            <div class="adventurer-main-actions">
              ${[["team", "加入隊伍"], ["upgrade", "升級"], ["equipment", "裝備"], ["trade", "交易"]].map(([panel, label]) => `
                <button type="button" data-v2-action="toggle-adventurer-panel" data-panel="${panel}" class="${activePanel === panel ? "is-active" : ""}">${label}</button>
              `).join("")}
            </div>
          </div>
        </section>
        ${renderAdventurerDetailSubpanel(adventurer)}
      </div>
    </div>
  `;
}

function openAdventurerDetail(adventurerId) {
  const adventurer = getAdventurerById(adventurerId);
  if (!adventurer) {
    showToast("找不到這位冒險者");
    refreshAdventurerGuildPage();
    return;
  }
  selectedAdventurerId = adventurer.id;
  state.ui.activeAdventurerPanel = null;
  if (mimiPageIntroTimer) {
    clearTimeout(mimiPageIntroTimer);
    mimiPageIntroTimer = null;
  }
  hideMimiDialogue();
  document.querySelector(".adventurer-detail-backdrop")?.remove();
  mountHomeV2Overlay(renderAdventurerDetailModal(adventurer));
  saveGame();
}

function refreshAdventurerDetailPanel() {
  const adventurer = getAdventurerById(selectedAdventurerId);
  const backdrop = document.querySelector(".adventurer-detail-backdrop");
  if (!adventurer) {
    closeAdventurerDetail();
    return;
  }
  if (backdrop) backdrop.outerHTML = renderAdventurerDetailModal(adventurer);
}

function closeAdventurerDetail() {
  document.querySelector(".adventurer-detail-backdrop")?.remove();
  state.ui.activeAdventurerPanel = null;
  selectedAdventurerId = null;
}

function toggleAdventurerSubpanel(panel) {
  if (!["team", "upgrade", "equipment", "trade"].includes(panel)) return;
  const adventurer = getAdventurerById(selectedAdventurerId);
  if (!adventurer) return;
  state.ui.activeAdventurerPanel = state.ui.activeAdventurerPanel === panel ? null : panel;
  if (panel === "team" && adventurer.teamId) state.adventurerTeams.activeTeamId = adventurer.teamId;
  saveGame();
  refreshAdventurerDetailPanel();
}

function selectAdventurerTeam(teamId) {
  if (!state.adventurerTeams.teams.some((team) => team.id === teamId)) return;
  state.adventurerTeams.activeTeamId = teamId;
  saveGame();
  refreshAdventurerDetailPanel();
}

function toggleAdventurerTeamMembership() {
  const adventurer = getAdventurerById(selectedAdventurerId);
  const activeTeam = state.adventurerTeams.teams.find((team) => team.id === state.adventurerTeams.activeTeamId);
  if (!adventurer || !activeTeam) return;
  if (adventurer.teamId && adventurer.teamId !== activeTeam.id) {
    showToast("這位冒險者已在其他隊伍中");
    return;
  }
  if (activeTeam.memberIds.includes(adventurer.id)) {
    activeTeam.memberIds = activeTeam.memberIds.filter((id) => id !== adventurer.id);
    syncAdventurerTeamFlags();
    saveGame();
    refreshAdventurerGuildPage();
    refreshAdventurerDetailPanel();
    showToast(`${adventurer.name} 已移出隊伍`);
    return;
  }
  if (activeTeam.memberIds.length >= ADVENTURER_TEAM_SIZE) {
    showToast("隊伍已滿");
    return;
  }
  activeTeam.memberIds.push(adventurer.id);
  syncAdventurerTeamFlags();
  saveGame();
  refreshAdventurerGuildPage();
  refreshAdventurerDetailPanel();
  showToast(`${adventurer.name} 已加入 ${activeTeam.name}`);
}

function upgradeAdventurer() {
  const adventurer = getAdventurerById(selectedAdventurerId);
  if (!adventurer) return;
  if (adventurer.level >= ADVENTURER_MAX_LEVEL) {
    showToast("已達最高等級");
    return;
  }
  const cost = getAdventurerUpgradeCost(adventurer);
  if (state.coins < cost) {
    showToast("金幣不足");
    return;
  }
  state.coins -= cost;
  adventurer.level += 1;
  recalculateAdventurerDerivedStats(adventurer);
  saveGame();
  updateHomeV2HudResources();
  refreshAdventurerGuildPage();
  refreshAdventurerDetailPanel();
  showToast(`${adventurer.name} 升級至 Lv.${adventurer.level}`);
}

function selectAdventurerEquipmentSlot(slot) {
  if (!EQUIPMENT_SLOTS.includes(slot)) return;
  state.ui.activeAdventurerEquipmentSlot = slot;
  saveGame();
  refreshAdventurerDetailPanel();
}

function equipAdventurerEquipment(equipmentId) {
  const adventurer = getAdventurerById(selectedAdventurerId);
  const equipment = state.equipmentInventory.find((item) => item.id === equipmentId);
  if (!adventurer || !equipment) {
    showToast("找不到這件裝備");
    return;
  }
  if (equipment.equippedBy && equipment.equippedBy !== adventurer.id) {
    showToast("這件裝備已由其他冒險者穿戴");
    return;
  }
  if (adventurer.level < equipment.requiredLevel) {
    showToast(`需要 Lv.${equipment.requiredLevel}`);
    return;
  }
  const oldEquipment = state.equipmentInventory.find((item) => item.id === adventurer.equipment[equipment.slot]);
  if (oldEquipment) oldEquipment.equippedBy = null;
  adventurer.equipment[equipment.slot] = equipment.id;
  equipment.equippedBy = adventurer.id;
  recalculateAdventurerDerivedStats(adventurer);
  saveGame();
  refreshAdventurerGuildPage();
  refreshAdventurerDetailPanel();
  showToast(`已穿戴 ${equipment.name}`);
}

function unequipAdventurerEquipment(equipmentId) {
  const adventurer = getAdventurerById(selectedAdventurerId);
  const equipment = state.equipmentInventory.find((item) => item.id === equipmentId);
  if (!adventurer || !equipment || equipment.equippedBy !== adventurer.id) return;
  adventurer.equipment[equipment.slot] = null;
  equipment.equippedBy = null;
  recalculateAdventurerDerivedStats(adventurer);
  saveGame();
  refreshAdventurerGuildPage();
  refreshAdventurerDetailPanel();
  showToast(`已卸下 ${equipment.name}`);
}

function selectAdventurerTradeTab(tab) {
  state.ui.activeAdventurerTradeTab = tab === "market" ? "market" : "sell";
  saveGame();
  refreshAdventurerDetailPanel();
}

function rollEquipmentShopRarity() {
  let roll = Math.random() * 100;
  for (const entry of EQUIPMENT_SHOP_RARITY_RATES) {
    roll -= entry.rate;
    if (roll < 0) return entry.rarity;
  }
  return "A";
}

function shuffledEquipmentSlots() {
  const slots = [...EQUIPMENT_SLOTS];
  for (let index = slots.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [slots[index], slots[swapIndex]] = [slots[swapIndex], slots[index]];
  }
  return slots;
}

function generateEquipmentStats(slot, rarity) {
  const [minimum, maximum] = EQUIPMENT_RARITY_STAT_RANGES[rarity] || EQUIPMENT_RARITY_STAT_RANGES.A;
  let points = randomInt(minimum, maximum);
  const stats = { hp: 0, attack: 0, defense: 0, speed: 0 };
  const preferences = {
    head: ["hp", "defense"],
    body: ["hp", "defense"],
    legs: ["hp", "speed", "defense"],
    weapon: ["attack", "speed"],
    offhand: ["attack", "defense"],
    ring: ["attack", "speed"],
    necklace: ["hp", "attack", "defense"],
    petContract: ["hp", "attack", "defense", "speed"]
  };
  const preferredStats = preferences[slot] || ["hp", "attack", "defense", "speed"];
  while (points > 0) {
    const stat = randomItem(preferredStats);
    const amount = Math.min(points, randomInt(1, Math.max(2, Math.ceil(maximum / 8))));
    stats[stat] += amount;
    points -= amount;
  }
  return stats;
}

function generateEquipmentShopItem(slot) {
  const rarity = rollEquipmentShopRarity();
  const element = randomItem(EQUIPMENT_ELEMENTS);
  const stats = generateEquipmentStats(slot, rarity);
  const folder = EQUIPMENT_SLOT_FOLDERS[slot] || slot;
  const equipment = normalizeEquipment({
    id: createId("equip"),
    templateId: `${element}_${slot}_${rarity.toLowerCase()}_${randomInt(1, 999).toString().padStart(3, "0")}`,
    name: EQUIPMENT_NAMES[element]?.[slot] || "冒險裝備",
    slot,
    rarity,
    element,
    level: 1,
    requiredLevel: { A: 1, S: 10, SS: 20, SSS: 35 }[rarity],
    stats,
    power: calculateEquipmentItemPower(stats),
    iconAsset: `assets/equipment/icons/${folder}/${folder}-${rarity.toLowerCase()}-001.png`,
    equippedBy: null,
    locked: false,
    obtainedAt: Date.now(),
    source: "shop"
  });
  const price = Math.round(
    (EQUIPMENT_BASE_PRICES[rarity] || EQUIPMENT_BASE_PRICES.A)
    * (EQUIPMENT_SLOT_PRICE_MULTIPLIERS[slot] || 1)
    * gameConfigNumber("economy.equipmentPriceMultiplier", 1)
  );
  return {
    shopItemId: createId("shop"),
    equipment,
    price,
    sold: false
  };
}

function refreshEquipmentShopInventory(options = {}) {
  state.equipmentShop = {
    refreshAt: Date.now() + getConfiguredEquipmentShopRefreshMs(),
    items: shuffledEquipmentSlots().map(generateEquipmentShopItem)
  };
  if (options.save !== false) saveGame();
}

function ensureEquipmentShopFresh(options = {}) {
  state.equipmentShop = normalizeEquipmentShop(state.equipmentShop);
  const expired = state.equipmentShop.refreshAt <= Date.now();
  const incomplete = state.equipmentShop.items.length !== EQUIPMENT_SLOTS.length;
  if (expired || incomplete) refreshEquipmentShopInventory(options);
  return state.equipmentShop;
}

function formatEquipmentShopCountdown(ms) {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function renderEquipmentShopCard(shopItem) {
  const equipment = shopItem.equipment;
  return `
    <article class="equipment-shop-card rarity-${equipment.rarity.toLowerCase()}${shopItem.sold ? " is-sold" : ""}" data-shop-item-id="${shopItem.shopItemId}">
      <header><span>${EQUIPMENT_SLOT_LABELS[equipment.slot]}</span><b>${equipment.rarity}</b></header>
      ${renderEquipmentIcon(equipment, "equipment-shop-icon")}
      <h3>${escapeHtml(equipment.name)}</h3>
      <p>${escapeHtml(renderEquipmentStatSummary(equipment))}</p>
      <div><span>戰力 ${formatNumber(equipment.power)}</span><b>${formatNumber(shopItem.price)} 金幣</b></div>
      <button type="button" data-v2-action="buy-equipment-shop-item" data-shop-item-id="${shopItem.shopItemId}" ${shopItem.sold ? "disabled" : ""}>${shopItem.sold ? "已售出" : "購買"}</button>
    </article>
  `;
}

function renderEquipmentShopPageInner() {
  const shop = ensureEquipmentShopFresh();
  const availableCount = shop.items.filter((item) => !item.sold).length;
  return `
    <div class="equipment-shop-page-scroll">
      <section class="equipment-shop-heading">
        <div><h1>裝備商店</h1><p>為冒險者挑選更強大的裝備</p></div>
        <span>金幣 ${formatNumber(state.coins)}</span>
      </section>
      <section class="equipment-shop-status">
        <div><small>下次更新</small><b data-equipment-shop-countdown>${formatEquipmentShopCountdown(shop.refreshAt - Date.now())}</b></div>
        <span>商品 ${availableCount}/${EQUIPMENT_SLOTS.length}</span>
      </section>
      <section class="equipment-shop-grid" aria-label="裝備商品">
        ${shop.items.map(renderEquipmentShopCard).join("")}
      </section>
    </div>
  `;
}

function renderWorldEquipmentShopPage(index) {
  ensureEquipmentShopFresh();
  window.setTimeout(startEquipmentShopCountdown, 0);
  return `
    <section class="worldPage equipmentShopPage" data-world-index="${index}" aria-label="裝備商店">
      ${renderEquipmentShopPageInner()}
    </section>
  `;
}

function refreshEquipmentShopPage() {
  const page = document.querySelector(".equipmentShopPage");
  if (!page) return;
  const scrollTop = page.querySelector(".equipment-shop-page-scroll")?.scrollTop || 0;
  page.innerHTML = renderEquipmentShopPageInner();
  const nextScroll = page.querySelector(".equipment-shop-page-scroll");
  if (nextScroll) nextScroll.scrollTop = scrollTop;
  startEquipmentShopCountdown();
}

function startEquipmentShopCountdown() {
  if (equipmentShopCountdownTimer) window.clearInterval(equipmentShopCountdownTimer);
  const tick = () => {
    if (!state?.equipmentShop) return;
    const remaining = state.equipmentShop.refreshAt - Date.now();
    if (remaining <= 0) {
      refreshEquipmentShopInventory();
      refreshEquipmentShopPage();
      return;
    }
    document.querySelectorAll("[data-equipment-shop-countdown]").forEach((element) => {
      element.textContent = formatEquipmentShopCountdown(remaining);
    });
  };
  tick();
  equipmentShopCountdownTimer = window.setInterval(tick, 1000);
}

function buyEquipmentShopItem(shopItemId) {
  if (!shopItemId || equipmentShopPurchaseLocks.has(shopItemId)) return;
  const shopItem = state.equipmentShop.items.find((item) => item.shopItemId === shopItemId);
  if (!shopItem || shopItem.sold) {
    showToast("這件商品已售出");
    return;
  }
  if (state.coins < shopItem.price) {
    showToast("金幣不足");
    return;
  }
  equipmentShopPurchaseLocks.add(shopItemId);
  state.coins -= shopItem.price;
  const equipment = normalizeEquipment({
    ...shopItem.equipment,
    equippedBy: null,
    obtainedAt: Date.now(),
    source: "shop"
  });
  state.equipmentInventory.push(equipment);
  shopItem.sold = true;
  saveGame();
  updateHomeV2HudResources();
  refreshEquipmentShopPage();
  equipmentShopPurchaseLocks.delete(shopItemId);
  showToast(`已獲得裝備：${equipment.name}`);
}

function toggleAdventurerLock(adventurerId) {
  const adventurer = getAdventurerById(adventurerId || selectedAdventurerId);
  if (!adventurer) return;
  adventurer.locked = !adventurer.locked;
  saveGame();
  refreshAdventurerGuildPage();
  refreshAdventurerDetailPanel();
  showToast(adventurer.locked ? "角色已鎖定" : "已解除角色鎖定");
}

function openAdventurerSellConfirm(adventurerId) {
  const adventurer = getAdventurerById(adventurerId || selectedAdventurerId);
  if (!adventurer) {
    showToast("找不到這位冒險者");
    return;
  }
  if (adventurer.locked) {
    showToast("已鎖定的角色不能出售");
    return;
  }
  if (adventurer.isInTeam) {
    showToast("隊伍中的角色不能出售");
    return;
  }
  const price = getConfiguredAdventurerSellPrice(adventurer);
  document.querySelector(".adventurer-sell-backdrop")?.remove();
  mountHomeV2Overlay(`
    <div class="adventurer-sell-backdrop" data-adventurer-backdrop="sell">
      <section class="adventurer-sell-modal" role="dialog" aria-modal="true" aria-label="確認出售角色">
        <h2>出售角色</h2>
        <p>確定要出售「${escapeHtml(adventurer.name)}」嗎？出售後無法復原，將獲得 ${formatNumber(price)} 金幣。</p>
        <div>
          <button type="button" data-v2-action="close-adventurer-sell">取消</button>
          <button type="button" data-v2-action="confirm-adventurer-sell" data-adventurer-id="${adventurer.id}">確認出售</button>
        </div>
      </section>
    </div>
  `);
}

function closeAdventurerSellConfirm() {
  document.querySelector(".adventurer-sell-backdrop")?.remove();
}

function confirmAdventurerSell(adventurerId) {
  const adventurer = getAdventurerById(adventurerId || selectedAdventurerId);
  if (!adventurer) {
    closeAdventurerSellConfirm();
    closeAdventurerDetail();
    refreshAdventurerGuildPage();
    showToast("這位冒險者已不存在");
    return;
  }
  if (adventurer.locked) {
    showToast("已鎖定的角色不能出售");
    return;
  }
  if (adventurer.isInTeam) {
    showToast("隊伍中的角色不能出售");
    return;
  }
  const price = getConfiguredAdventurerSellPrice(adventurer);
  EQUIPMENT_SLOTS.forEach((slot) => {
    const equipment = state.equipmentInventory.find((item) => item.id === adventurer.equipment?.[slot]);
    if (equipment) equipment.equippedBy = null;
    if (adventurer.equipment) adventurer.equipment[slot] = null;
  });
  state.adventurers = state.adventurers.filter((item) => item.id !== adventurer.id);
  state.adventurerTeams.teams.forEach((team) => {
    team.memberIds = team.memberIds.filter((id) => id !== adventurer.id);
  });
  state.coins = normalizedNonNegative(state.coins, 0) + price;
  selectedAdventurerId = null;
  closeAdventurerSellConfirm();
  closeAdventurerDetail();
  saveGame();
  updateHomeV2HudResources();
  refreshAdventurerGuildPage();
  showToast(`已出售 ${adventurer.name}，獲得 ${price} 金幣`);
}

function handleAdventurerGuildClick(event) {
  const backdrop = event.target.closest("[data-adventurer-backdrop]");
  const actionButton = event.target.closest("[data-v2-action]");
  const guildActions = new Set([
    "summon-adventurer", "accept-adventurer", "summon-adventurer-again",
    "open-adventurer-detail", "close-adventurer-detail", "toggle-adventurer-panel",
    "select-adventurer-team", "toggle-adventurer-team", "upgrade-adventurer",
    "select-adventurer-equipment-slot", "equip-adventurer-equipment", "unequip-adventurer-equipment",
    "select-adventurer-trade-tab", "toggle-adventurer-lock", "open-adventurer-sell",
    "close-adventurer-sell", "confirm-adventurer-sell", "buy-equipment-shop-item",
    "retry-load-adventurers"
  ]);
  const action = actionButton?.dataset.v2Action;
  if (!backdrop && (!action || !guildActions.has(action))) return;

  event.preventDefault();
  event.stopImmediatePropagation();

  if (backdrop && event.target === backdrop) {
    if (backdrop.dataset.adventurerBackdrop === "detail") closeAdventurerDetail();
    if (backdrop.dataset.adventurerBackdrop === "sell") closeAdventurerSellConfirm();
    return;
  }
  if (!actionButton) return;

  const adventurerId = actionButton.dataset.adventurerId;
  if (action === "summon-adventurer") handleAdventurerSummon();
  if (action === "retry-load-adventurers") retryLoadAdventurers();
  if (action === "accept-adventurer") acceptAdventurerGacha();
  if (action === "summon-adventurer-again") summonAdventurerAgain();
  if (action === "open-adventurer-detail") openAdventurerDetail(adventurerId);
  if (action === "close-adventurer-detail") closeAdventurerDetail();
  if (action === "toggle-adventurer-panel") toggleAdventurerSubpanel(actionButton.dataset.panel);
  if (action === "select-adventurer-team") selectAdventurerTeam(actionButton.dataset.teamId);
  if (action === "toggle-adventurer-team") toggleAdventurerTeamMembership();
  if (action === "upgrade-adventurer") upgradeAdventurer();
  if (action === "select-adventurer-equipment-slot") selectAdventurerEquipmentSlot(actionButton.dataset.slot);
  if (action === "equip-adventurer-equipment") equipAdventurerEquipment(actionButton.dataset.equipmentId);
  if (action === "unequip-adventurer-equipment") unequipAdventurerEquipment(actionButton.dataset.equipmentId);
  if (action === "select-adventurer-trade-tab") selectAdventurerTradeTab(actionButton.dataset.tradeTab);
  if (action === "toggle-adventurer-lock") toggleAdventurerLock(adventurerId);
  if (action === "open-adventurer-sell") openAdventurerSellConfirm(adventurerId);
  if (action === "close-adventurer-sell") closeAdventurerSellConfirm();
  if (action === "confirm-adventurer-sell") confirmAdventurerSell(adventurerId);
  if (action === "buy-equipment-shop-item") buyEquipmentShopItem(actionButton.dataset.shopItemId);
}

function attachAdventurerGuildEventBridge() {
  const root = els.homeV2Root || document.querySelector("#homeV2Root");
  if (!root || root.dataset.adventurerGuildBound === "true") return;
  root.addEventListener("click", handleAdventurerGuildClick, true);
  root.dataset.adventurerGuildBound = "true";
}

attachAdventurerGuildEventBridge();

function handleBeginnerFeatureClick(event) {
  const actionButton = event.target.closest("[data-v2-action]");
  if (!actionButton || !els?.homeV2Root?.contains(actionButton)) return;
  const action = actionButton.dataset.v2Action;
  const beginnerActions = new Set([
    "tutorial-next",
    "start-explore",
    "claim-explore-egg",
    "draw-explore-again",
    "claim-mission",
    "claim-final-mission"
  ]);
  if (!beginnerActions.has(action)) return;

  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();

  if (action === "tutorial-next") {
    advanceTutorial();
    return;
  }
  if (action === "start-explore") {
    startExplore(actionButton.dataset.areaId);
    return;
  }
  if (action === "claim-explore-egg") {
    claimExploreEggResult({ closeOverlay: true });
    return;
  }
  if (action === "draw-explore-again") {
    drawExploreAgain();
    return;
  }
  if (action === "claim-mission") {
    claimBeginnerMissionReward(actionButton.dataset.missionId);
    return;
  }
  if (action === "claim-final-mission") {
    claimBeginnerFinalReward();
  }
}

function attachBeginnerFeatureEventBridge() {
  if (!els?.homeV2Root || els.homeV2Root.dataset.beginnerFeatureBound === "true") return;
  els.homeV2Root.addEventListener("click", handleBeginnerFeatureClick, true);
  els.homeV2Root.dataset.beginnerFeatureBound = "true";
}

function bindBeginnerFeatureButtons() {
  if (!els?.homeV2Root) return;
  const selector = [
    "[data-v2-action='tutorial-next']",
    "[data-v2-action='start-explore']",
    "[data-v2-action='claim-explore-egg']",
    "[data-v2-action='draw-explore-again']",
    "[data-v2-action='claim-mission']",
    "[data-v2-action='claim-final-mission']"
  ].join(",");
  els.homeV2Root.querySelectorAll(selector).forEach((button) => {
    if (button.dataset.beginnerBound === "true") return;
    button.addEventListener("click", handleBeginnerFeatureClick, true);
    button.dataset.beginnerBound = "true";
  });
}

attachBeginnerFeatureEventBridge();

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
  if (page !== 0 && (selectedRestDragonId || state.selectedRestDragonId)) {
    selectedRestDragonId = null;
    state.selectedRestDragonId = null;
    saveGame();
  }

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
  if (els.mimiButton) els.mimiButton.innerHTML = renderMimiHead("mini");
  if (els.mimiBubble) els.mimiBubble.textContent = "左右滑動龍島：左邊讓龍休息，右邊管理孵化臺。";
}

function renderRestIsland() {
  const dragons = getRestIslandDragons();

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
  ensureRestDragonPosition(dragon, index);
  const x = finiteRestCoordinate(dragon.restX) ?? 50;
  const y = finiteRestCoordinate(dragon.restY) ?? 58;
  const scale = Number.isFinite(Number(dragon.restScale)) ? Number(dragon.restScale) : 0.85;
  const delay = -index * 0.45;
  return `
    <button
      class="rest-dragon rarity-${dragon.rarity}"
      type="button"
      data-action="active-home-dragon"
      data-dragon-id="${dragon.id}"
      style="--x:${x}%;--y:${y}%;--scale:${scale};--delay:${delay}s;"
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
  const bulk = getBulkManageState();
  const isManaging = bulk.type === "egg";
  if (state.eggs.length === 0) {
    els.eggInventoryList.innerHTML = `<div class="empty-state">目前沒有龍蛋。前往探索，用探險卷尋找新的龍蛋。</div>`;
    return;
  }

  els.eggInventoryList.innerHTML = `
    <div class="egg-inventory-manage-row">
      <span>${isManaging ? `已選擇 ${bulk.selectedIds.length} 顆` : `龍蛋 ${state.eggs.length} 顆`}</span>
      <button type="button" data-bulk-action="${isManaging ? "cancel" : "enter"}" data-bulk-type="egg">${isManaging ? "完成" : "管理"}</button>
    </div>
    ${state.eggs.map((egg) => {
      const isSelected = isManaging && bulk.selectedIds.includes(egg.id);
      const isProtected = isManaging && !canDeleteEgg(egg);
      return `
    <article class="egg-manage-card rarity-${egg.eggRarity || "C"}${isManaging ? " bulk-selectable" : ""}${isSelected ? " bulk-selected" : ""}${isProtected ? " bulk-protected" : ""}" data-bulk-item-type="egg" data-bulk-item-id="${egg.id}">
      ${isManaging ? `<span class="bulk-selection-indicator" aria-hidden="true">${isProtected ? "鎖" : (isSelected ? "✓" : "")}</span>` : ""}
      <div class="egg-manage-art asset-host">${renderEggAsset(egg, "asset-image egg-manage-image")}</div>
      <div>
        <h3>${escapeHtml(egg.name)}</h3>
        <div class="meta-line">
          <span>${rarityBadge(egg.eggRarity || "C")}</span>
          ${egg.elementBias ? `<span class="element-pill">${egg.elementBias}屬性傾向</span>` : "<span>無固定屬性傾向</span>"}
        </div>
        <p>可能孵出：${rarityPoolLabel(egg.rarityPool)} · 需要 ${formatNumber(egg.requiredSteps)} 步 / ${formatTime(egg.requiredMs)}</p>
        <div class="slot-assign-row${isManaging ? " is-bulk-hidden" : ""}">
          ${emptySlots.length > 0 ? emptySlots.map((slot) => `
            <button class="mini-button" type="button" data-action="assign-egg" data-egg-id="${egg.id}" data-slot-id="${slot.id}">
              放入${(slot.slotType || slot.type) === "steps" ? "步數" : "時間"}臺 ${slot.id.replace("slot-", "")}
            </button>
          `).join("") : `<span class="empty-mini-note">目前沒有空的孵化臺</span>`}
        </div>
      </div>
    </article>
      `;
    }).join("")}
  `;
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
  if (!addDragonToPlayer(dragon, { save: false })) return;
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
  if (!addDragonToPlayer(dragon, { save: false })) return;
  state.eggs = state.eggs.filter((item) => item.id !== eggId);
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

function getMimiPageIntro(pageId) {
  const messages = {
    home: "這裡是龍之島，也是龍寶寶們休息與活動的家。",
    rest: "這裡是龍之島，也是龍寶寶們休息與活動的家。",
    dragonCave: "這裡是孵蛋島，把取得的龍蛋放進孵化器，等待新的夥伴誕生吧！",
    hatch: "這裡是孵蛋島，把取得的龍蛋放進孵化器，等待新的夥伴誕生吧！",
    dragonHouse: "這裡是龍舍，你擁有的龍都可以在這裡查看與管理。",
    explore: "這裡是探索區，使用探險券前往火山、海洋或森林尋找龍蛋吧！",
    inventory: "這裡是道具背包，你獲得的道具與資源都會收在這裡。",
    equipment: "這裡是裝備店，可以替龍和冒險者準備更好的裝備。",
    items: "這裡是道具店，旅途中需要的補給都可以在這裡找到。",
    itemShop: "這裡是道具店，旅途中需要的補給都可以在這裡找到。",
    quest: "這裡是任務頁，完成任務可以獲得金幣、鑽石與探險券。",
    missions: "這裡是任務頁，完成任務可以獲得金幣、鑽石與探險券。",
    adventurerGuild: "這裡是冒險者工會，你召喚到的冒險者都會在這裡集合。",
    characterGacha: "這裡是冒險者召喚，消耗召喚券或鑽石，有機會遇見稀有夥伴！"
  };
  return messages[pageId] || "歡迎回來，繼續你的冒險吧！";
}

function showMimiDialogue(message, options = {}) {
  const dialogue = document.getElementById("mimiDialogue");
  const textEl = dialogue?.querySelector(".mimi-dialogue-text");
  if (!dialogue || !textEl) return;

  const duration = Math.max(0, Number(options.duration ?? 5000) || 5000);
  if (mimiDialogueTimer) {
    clearTimeout(mimiDialogueTimer);
    mimiDialogueTimer = null;
  }
  if (mimiDialogueHideTimer) {
    clearTimeout(mimiDialogueHideTimer);
    mimiDialogueHideTimer = null;
  }

  textEl.textContent = String(message || "");
  dialogue.classList.remove("is-visible", "is-hiding");
  dialogue.setAttribute("aria-hidden", "false");
  void dialogue.offsetWidth;
  dialogue.classList.add("is-visible");

  mimiDialogueTimer = window.setTimeout(() => {
    mimiDialogueTimer = null;
    hideMimiDialogue();
  }, duration);
}

function hideMimiDialogue() {
  const dialogue = document.getElementById("mimiDialogue");
  if (mimiDialogueTimer) {
    clearTimeout(mimiDialogueTimer);
    mimiDialogueTimer = null;
  }
  if (!dialogue) return;

  dialogue.classList.remove("is-visible");
  dialogue.classList.add("is-hiding");
  if (mimiDialogueHideTimer) clearTimeout(mimiDialogueHideTimer);
  mimiDialogueHideTimer = window.setTimeout(() => {
    dialogue.classList.remove("is-hiding");
    dialogue.setAttribute("aria-hidden", "true");
    mimiDialogueHideTimer = null;
  }, 260);
}

function showMimiPageIntro(pageId) {
  if (!pageId || lastMimiIntroPage === pageId) return;
  lastMimiIntroPage = pageId;
  showMimiDialogue(getMimiPageIntro(pageId), { duration: 5000 });
}

function queueMimiPageIntro(pageId) {
  if (mimiPageIntroTimer) clearTimeout(mimiPageIntroTimer);
  mimiPageIntroTimer = window.setTimeout(() => {
    mimiPageIntroTimer = null;
    showMimiPageIntro(pageId);
  }, 140);
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
    if (!addDragonToPlayer(dragon, { save: false })) return;
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
  if (state.dragons.length === 0) return 0;
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

    <button id="navLeftBtn" class="home-v2-nav-arrow is-left" type="button" data-v2-nav-arrow="-1" aria-label="往左看功能">‹</button>
    <nav id="bottomNavViewport" aria-label="底部功能導航">
      <div id="bottomNavTrack">
        ${pages.map((page, index) => homeV2NavItem(page, index, index === preservedPage)).join("")}
      </div>
    </nav>
    <button id="navRightBtn" class="home-v2-nav-arrow is-right" type="button" data-v2-nav-arrow="1" aria-label="往右看功能">›</button>
    ${renderEggSelectionModal()}
  `;
  applyGameConfigToRenderedPages();

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
  const eggs = getAvailableEggs();
  const bulk = getBulkManageState();
  const isManaging = bulk.type === "egg";

  return `
    <div class="egg-modal-backdrop" data-v2-backdrop="egg-select" role="presentation">
      <section class="egg-modal" role="dialog" aria-modal="true" aria-label="選擇要孵化的龍蛋">
        <header>
          <h2>選擇要孵化的龍蛋</h2>
          <div class="egg-modal-header-actions">
            ${isManaging ? `<span>已選擇 ${bulk.selectedIds.length} 顆</span>` : ""}
            <button type="button" class="bulk-manage-entry" data-bulk-action="${isManaging ? "cancel" : "enter"}" data-bulk-type="egg">${isManaging ? "完成" : "管理"}</button>
            <button type="button" data-v2-action="close-egg-modal" aria-label="關閉">×</button>
          </div>
        </header>
        <div class="egg-choice-list">
          ${eggs.length > 0 ? eggs.map((egg) => {
            const isSelected = isManaging && bulk.selectedIds.includes(egg.id);
            const isProtected = isManaging && !canDeleteEgg(egg);
            return `
            <article class="egg-choice-card egg-list-item${isManaging ? " bulk-selectable" : ""}${isSelected ? " bulk-selected" : ""}${isProtected ? " bulk-protected" : ""}" data-bulk-item-type="egg" data-bulk-item-id="${egg.id}">
              ${isManaging ? `<span class="bulk-selection-indicator" aria-hidden="true">${isProtected ? "鎖" : (isSelected ? "✓" : "")}</span>` : ""}
              <div class="egg-choice-art egg-thumb-wrap">
                <img class="egg-thumb" src="${getEggAsset(egg)}" alt="${escapeHtml(egg.name)}" onerror="this.src='assets/eggs/placeholder-egg.png'">
              </div>
              <div class="egg-choice-info egg-info">
                <div class="egg-name">${escapeHtml(egg.name)}</div>
                <div class="egg-rarity">稀有度：${escapeHtml(egg.rarity || egg.eggRarity || "C")}</div>
                <div class="egg-element">屬性傾向：${escapeHtml(eggElementLabel(egg))}</div>
                <div class="egg-time">孵化時間：${formatTime((egg.hatchDuration || egg.hatchTime || 60) * 1000)}</div>
              </div>
              ${isManaging
                ? `<span class="egg-bulk-state">${isProtected ? "受保護" : (isSelected ? "已選取" : "點選")}</span>`
                : `<button class="egg-select-btn" type="button" data-v2-action="start-hatch" data-slot-id="${eggSelectionSlotId}" data-egg-id="${egg.id}">選擇</button>`}
            </article>
          `; }).join("") : `
            <div class="egg-empty-message">
              <b>目前沒有龍蛋</b>
              <p>目前沒有可放入的龍蛋，請前往探索取得龍蛋。</p>
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
  if (isBulkManaging("egg")) exitBulkManage({ refresh: false });
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
  if (!addDragonToPlayer(dragon, { save: false })) return;
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
  return getEggAsset(egg);
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
    if (!addDragonToPlayer(dragon, { save: false })) return;
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
            ${renderRestIslandDragonsMarkup()}
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
          onerror="this.src='assets/eggs/placeholder-egg.png'"
        >
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
          onerror="this.src='assets/eggs/placeholder-egg.png'"
        >
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

// Final rest-island placement tuning. This override keeps the current
// worldPager intact while giving dragons room to stand on the enlarged island.
function renderHomeV2Dragon(dragon, index) {
  ensureRestDragonPosition(dragon, index);
  const stageScale = getDragonStageScale(dragon.stage);
  const pos = {
    x: dragon.restX,
    y: dragon.restY,
    s: (dragon.restScale || getDefaultRestDragonPosition(dragon, index).s) * stageScale
  };
  const rarity = String(dragon.rarity || "C");
  const action = DRAGON_ACTIONS.includes(dragon.currentAction) ? dragon.currentAction : "idle";
  const image = getDragonAsset(dragon, action);
  const rarityClass = `is-rarity-${rarity.toLowerCase()}`;
  const isSelected = selectedRestDragonId === dragon.id || state.selectedRestDragonId === dragon.id;
  const isAngry = Boolean(dragon.isAngry && dragon.angryUntil && dragon.angryUntil > Date.now());
  return `
    <button
      class="home-v2-dragon ${rarityClass} action-${action}${isSelected ? " is-selected" : ""}${isAngry ? " is-angry dragon-angry-effect" : ""}"
      type="button"
      data-v2-action="select-dragon"
      data-dragon-id="${dragon.id}"
      data-dragon-stage="${normalizeDragonStage(dragon.stage)}"
      style="--x:${pos.x}%;--y:${pos.y}%;--s:${pos.s};--stage-scale:${stageScale};--idle-delay:${index * -0.45}s;"
      aria-label="${escapeHtml(dragon.name || "龍夥伴")}"
    >
      <span class="dragon-ground-shadow" aria-hidden="true"></span>
      <span class="dragon-aura" aria-hidden="true"></span>
      <span class="dragon-portrait">
        <img
          src="${image}"
          alt="${escapeHtml(dragon.name || "龍夥伴")}"
          decoding="async"
          loading="lazy"
          onerror="if(!this.dataset.fallback){this.dataset.fallback='1';this.src='${DRAGON_FALLBACK_ASSET}'}else{this.hidden=true;this.nextElementSibling.hidden=false}"
        >
        <span class="home-v2-dragon-fallback" hidden>${escapeHtml(dragonElementText(dragon.element))}</span>
      </span>
      <span class="dragon-nameplate">
        <b>${escapeHtml(dragon.name || "龍夥伴")}</b>
        <span><i>${rarity}</i>${escapeHtml(dragonElementText(dragon.element))}</span>
      </span>
      ${isAngry ? `<span class="dragon-angry-bubble">不要一直點我！</span>` : ""}
    </button>
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

  if (event.target.matches("[data-v2-backdrop='rest-dragon-menu']")) {
    event.preventDefault();
    event.stopPropagation();
    closeRestDragonActionSheet();
    return;
  }

  if (event.target.matches("[data-v2-backdrop='dragon-info']")) {
    event.preventDefault();
    event.stopPropagation();
    closeDragonInfoModal();
    return;
  }

  if (event.target.matches("[data-v2-backdrop='team-editor']")) {
    event.preventDefault();
    event.stopPropagation();
    closeTeamModal();
    return;
  }

  if (event.target.matches("[data-v2-backdrop='dragon-sell']")) {
    event.preventDefault();
    event.stopPropagation();
    closeSellDragonConfirm();
    return;
  }

  const actionButton = event.target.closest("[data-v2-action]");
  if (actionButton) {
    event.preventDefault();
    event.stopPropagation();
    const action = actionButton.dataset.v2Action;
    const dragonId = actionButton.dataset.dragonId;

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
      handleRestDragonClick(dragonId);
      return;
    }
    if (action === "close-rest-dragon-panel") {
      closeRestDragonStatusPanel();
      return;
    }
    if (action === "close-rest-dragon-menu") {
      closeRestDragonActionSheet();
      return;
    }
    if (action === "feed-dragon") {
      feedRestDragon(dragonId);
      return;
    }
    if (action === "train-dragon") {
      trainRestDragon(dragonId);
      return;
    }
    if (action === "show-dragon-info") {
      openDragonInfoModal(dragonId);
      return;
    }
    if (action === "open-team-modal") {
      openTeamModal(dragonId);
      return;
    }
    if (action === "open-sell-dragon") {
      openSellDragonConfirm(dragonId);
      return;
    }
    if (action === "close-sell-dragon") {
      closeSellDragonConfirm();
      return;
    }
    if (action === "confirm-sell-dragon") {
      confirmSellDragon(dragonId);
      return;
    }
    if (action === "send-dragon-back-to-house" || action === "backToHouse") {
      sendDragonBackToHouse(dragonId || selectedRestDragonId || state.selectedRestDragonId);
      return;
    }
    if (action === "trade-dragon-placeholder") {
      showToast("交易功能開發中");
      return;
    }
    if (action === "close-dragon-info") {
      closeDragonInfoModal();
      return;
    }
    if (action === "close-team-modal") {
      closeTeamModal();
      return;
    }
    if (action === "add-to-team") {
      addDragonToTeam(dragonId);
      return;
    }
    if (action === "remove-from-team") {
      removeDragonFromTeam(dragonId);
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
    if (Number(pageButton.dataset.page) !== 0) closeRestDragonStatusPanel(false);
    goToWorldPage(Number(pageButton.dataset.page));
    return;
  }

  const navButton = event.target.closest("[data-world-page]");
  if (navButton) {
    event.preventDefault();
    event.stopPropagation();
    if (Number(navButton.dataset.worldPage) !== 0) closeRestDragonStatusPanel(false);
    goToWorldPage(Number(navButton.dataset.worldPage));
  }
}

function renderWorldExplorePage(index) {
  state.inventory = normalizeInventory(state.inventory, createNewState().inventory);
  const ticketCount = normalizedNonNegative(state.inventory.ticketsExplore, 0);
  return `
    <section class="worldPage explorePage" data-world-index="${index}" aria-label="探險">
      <div class="explore-page-shell">
        <section class="explore-hero">
          <div>
            <h1>探險</h1>
            <p>使用探險券前往火山、海洋與森林取得龍蛋。偶爾，也可能遇見稀有的光屬性或暗屬性龍蛋。</p>
          </div>
          <img src="${ASSETS.characters.mimiGuide || ASSETS.characters.mimiFull}" alt="Mimi" onerror="this.hidden=true">
        </section>
        <div class="explore-ticket-pill">
          <img src="${ASSETS.explore.ticket}" alt="" onerror="this.hidden=true">
          探險券 ${formatNumber(ticketCount)}
        </div>
        ${renderExploreMissionStrip()}
        <div class="explore-area-grid">
          ${EXPLORE_AREAS.map((area) => `
            <article class="explore-area-card explore-${area.id}" aria-label="${escapeHtml(area.name)}" style="background-image:url('${escapeHtml(area.bg)}')">
              <div class="explore-card-content">
                <h2>${escapeHtml(area.name)}</h2>
                <p>${escapeHtml(area.description)}</p>
                <span>消耗探險券 x${getConfiguredExploreTicketCost(area)}</span>
                <button type="button" data-v2-action="start-explore" data-area-id="${area.id}">開始探險</button>
              </div>
            </article>
          `).join("")}
        </div>
      </div>
    </section>
  `;
}

function mountHomeV2Overlay(html) {
  if (!els.homeV2Root) return;
  els.homeV2Root.insertAdjacentHTML("beforeend", html);
}

function closeRestDragonActionSheet() {
  document.querySelector(".rest-dragon-action-backdrop")?.remove();
}

function openRestDragonActionSheet(dragonId) {
  const dragon = getDragonById(dragonId);
  if (!dragon) return;
  closeRestDragonActionSheet();
  closeDragonInfoModal();
  closeTeamModal();
  mountHomeV2Overlay(`
    <div class="rest-dragon-action-backdrop" data-v2-backdrop="rest-dragon-menu">
      <section class="rest-dragon-sheet" role="dialog" aria-modal="true" aria-label="${escapeHtml(dragon.name)} 操作選單">
        <header>
          <img src="${getDragonAsset(dragon)}" alt="" onerror="this.src='${DRAGON_FALLBACK_ASSET}'">
          <div>
            <b>${escapeHtml(dragon.name)}</b>
            <span>${dragonStageText(dragon.stage)}｜${dragonElementText(dragon.element)}｜${dragon.rarity}</span>
          </div>
        </header>
        <div class="rest-dragon-actions">
          <button type="button" data-v2-action="feed-dragon" data-dragon-id="${dragon.id}">餵食</button>
          <button type="button" data-v2-action="train-dragon" data-dragon-id="${dragon.id}">訓練</button>
          <button type="button" data-v2-action="open-team-modal" data-dragon-id="${dragon.id}">出戰</button>
          <button type="button" data-v2-action="show-dragon-info" data-dragon-id="${dragon.id}">查看資訊</button>
          <button type="button" class="is-muted" data-v2-action="close-rest-dragon-menu">關閉</button>
        </div>
      </section>
    </div>
  `);
}

function getDragonById(dragonId) {
  return (state.dragons || []).find((dragon) => dragon.id === dragonId) || null;
}

function setDragonTemporaryAction(dragon, action) {
  dragon.currentAction = action;
  dragon.lockActionUntil = Date.now() + 2000;
  saveGame();
  refreshRestIslandInteractionLayer();
  window.setTimeout(() => {
    const latestDragon = getDragonById(dragon.id);
    if (!latestDragon || latestDragon.currentAction !== action) return;
    latestDragon.currentAction = "idle";
    saveGame();
    if (gameHasStarted && els.homeV2Root && !els.homeV2Root.hidden) {
      refreshRestIslandInteractionLayer();
    }
  }, 1500);
}

function feedRestDragon(dragonId) {
  const dragon = getDragonById(dragonId);
  if (!dragon) return;
  closeRestDragonActionSheet();
  dragon.hunger = Math.min(100, normalizedNonNegative(dragon.hunger, 80) + 10);
  dragon.mood = Math.min(100, normalizedNonNegative(dragon.mood, 80) + 5);
  dragon.exp = normalizedNonNegative(dragon.exp, 0) + gameConfigNumber("economy.feedExp", 5);
  setDragonTemporaryAction(dragon, "eat");
  showToast("已餵食，龍看起來更有精神了！");
}

function trainRestDragon(dragonId) {
  const dragon = getDragonById(dragonId);
  if (!dragon) return;
  closeRestDragonActionSheet();
  dragon.exp = normalizedNonNegative(dragon.exp, 0) + gameConfigNumber("economy.trainExp", 20);
  dragon.power = normalizedNonNegative(dragon.power, 10) + 5;
  dragon.hunger = Math.max(0, normalizedNonNegative(dragon.hunger, 80) - 10);
  dragon.mood = Math.max(0, normalizedNonNegative(dragon.mood, 80) - 5);
  setDragonTemporaryAction(dragon, "train");
  showToast("訓練完成，戰力提升！");
}

function closeDragonInfoModal() {
  document.querySelector(".dragon-info-backdrop")?.remove();
}

function openDragonInfoModal(dragonId) {
  const dragon = getDragonById(dragonId);
  if (!dragon) return;
  closeRestDragonActionSheet();
  closeDragonInfoModal();
  mountHomeV2Overlay(`
    <div class="dragon-info-backdrop" data-v2-backdrop="dragon-info">
      <section class="dragon-info-modal" role="dialog" aria-modal="true" aria-label="${escapeHtml(dragon.name)} 資訊">
        <header>
          <img src="${getDragonAsset(dragon)}" alt="" onerror="this.src='${DRAGON_FALLBACK_ASSET}'">
          <div>
            <h2>${escapeHtml(dragon.name)}</h2>
            <p>${dragonElementText(dragon.element)}屬性｜${dragon.rarity}｜${dragonStageText(dragon.stage)}</p>
          </div>
        </header>
        <dl>
          <div><dt>等級</dt><dd>Lv.${formatNumber(dragon.level || 1)}</dd></div>
          <div><dt>經驗</dt><dd>${formatNumber(dragon.exp || 0)}</dd></div>
          <div><dt>戰力</dt><dd>${formatNumber(dragon.power || 0)}</dd></div>
          <div><dt>飽食度</dt><dd>${formatNumber(dragon.hunger || 0)} / 100</dd></div>
          <div><dt>心情</dt><dd>${formatNumber(dragon.mood || 0)} / 100</dd></div>
          <div><dt>出戰中</dt><dd>${dragon.isInTeam ? "是" : "否"}</dd></div>
        </dl>
        <button type="button" data-v2-action="close-dragon-info">關閉</button>
      </section>
    </div>
  `);
}

function closeTeamModal() {
  document.querySelector(".team-editor-backdrop")?.remove();
}

const restDragonSellPrices = { C: 50, B: 100, A: 200, S: 400, SS: 800, SSS: 1500 };

function getRestDragonSellPrice(dragon) {
  return Math.max(0, Math.round(Number(dragon?.sellPrice) || restDragonSellPrices[dragon?.rarity] || 50));
}

function closeSellDragonConfirm() {
  document.querySelector(".dragon-sell-backdrop")?.remove();
}

function openSellDragonConfirm(dragonId) {
  const dragon = getDragonById(dragonId);
  if (!dragon) {
    selectedRestDragonId = null;
    state.selectedRestDragonId = null;
    showToast("這隻龍已不存在，無法出售");
    refreshRestIslandInteractionLayer();
    return;
  }
  state.battleTeam = normalizeBattleTeam(state.battleTeam, state.dragons);
  if (dragon.isInTeam || state.battleTeam.includes(dragon.id)) {
    showToast("此龍已編入隊伍，請先解除出戰後再出售");
    return;
  }

  closeSellDragonConfirm();
  closeRestDragonActionSheet();
  closeDragonInfoModal();
  closeTeamModal();
  const price = getRestDragonSellPrice(dragon);
  mountHomeV2Overlay(`
    <div class="dragon-sell-backdrop" data-v2-backdrop="dragon-sell">
      <section class="dragon-sell-modal" role="dialog" aria-modal="true" aria-label="出售龍確認">
        <header>
          <img src="${getDragonAsset(dragon, "idle")}" alt="${escapeHtml(dragon.name)}" onerror="this.src='${DRAGON_FALLBACK_ASSET}'">
          <div>
            <h2>確定要出售【${escapeHtml(dragon.name)}】嗎？</h2>
            <p>出售後會從休息島移除｜售價 ${formatNumber(price)} 金幣</p>
          </div>
        </header>
        <div class="dragon-sell-actions">
          <button type="button" class="is-muted" data-v2-action="close-sell-dragon">取消</button>
          <button type="button" data-v2-action="confirm-sell-dragon" data-dragon-id="${dragon.id}">確認出售</button>
        </div>
      </section>
    </div>
  `);
}

function confirmSellDragon(dragonId) {
  const dragon = getDragonById(dragonId);
  if (!dragon) {
    closeSellDragonConfirm();
    selectedRestDragonId = null;
    state.selectedRestDragonId = null;
    saveGame();
    refreshRestIslandInteractionLayer();
    showToast("這隻龍已不存在，無法出售");
    return;
  }
  state.battleTeam = normalizeBattleTeam(state.battleTeam, state.dragons);
  if (dragon.isInTeam || state.battleTeam.includes(dragon.id)) {
    closeSellDragonConfirm();
    showToast("此龍已編入隊伍，請先解除出戰後再出售");
    return;
  }

  const price = getRestDragonSellPrice(dragon);
  state.coins = normalizedNonNegative(state.coins, 0) + price;
  state.soldDragonIds = Array.isArray(state.soldDragonIds) ? state.soldDragonIds : [];
  if (!state.soldDragonIds.includes(dragon.id)) state.soldDragonIds.push(dragon.id);
  state.dragons = state.dragons.filter((item) => item.id !== dragon.id);
  state.battleTeam = normalizeBattleTeam((state.battleTeam || []).filter((id) => id !== dragon.id), state.dragons);
  syncDragonTeamFlags();
  if (state.activeDragonId === dragon.id) state.activeDragonId = state.dragons[0]?.id || null;
  selectedRestDragonId = null;
  state.selectedRestDragonId = null;
  state.homeIsland = normalizeHomeIsland(state.homeIsland, state.dragons);
  closeSellDragonConfirm();
  saveGame();
  renderHomeV2();
  showToast(`${dragon.name} 已出售，獲得 ${formatNumber(price)} 金幣`);
}

function openTeamModal(selectedDragonId = null) {
  const selectedDragon = getDragonById(selectedDragonId);
  closeRestDragonActionSheet();
  closeTeamModal();
  mountHomeV2Overlay(renderTeamModal(selectedDragon));
}

function renderTeamModal(selectedDragon) {
  const teamIds = normalizeBattleTeam(state.battleTeam, state.dragons);
  const teamCards = Array.from({ length: BATTLE_TEAM_LIMIT }, (_, index) => {
    const dragon = getDragonById(teamIds[index]);
    return `
      <article class="team-slot ${dragon ? "has-dragon" : "is-empty"}">
        <b>隊伍位置 ${index + 1}</b>
        ${dragon ? `
          <span>${escapeHtml(dragon.name)}</span>
          <small>${dragonElementText(dragon.element)}｜${dragon.rarity}</small>
          <button type="button" data-v2-action="remove-from-team" data-dragon-id="${dragon.id}">移出隊伍</button>
        ` : `
          <span>空隊伍欄位</span>
          <small>最多 3 隻龍</small>
        `}
      </article>
    `;
  }).join("");

  return `
    <div class="team-editor-backdrop" data-v2-backdrop="team-editor">
      <section class="team-editor-modal" role="dialog" aria-modal="true" aria-label="隊伍編排">
        <header>
          <h2>隊伍編排</h2>
          <button type="button" data-v2-action="close-team-modal" aria-label="關閉">×</button>
        </header>
        ${selectedDragon ? `
          <div class="team-selected-dragon">
            <img src="${getDragonAsset(selectedDragon)}" alt="" onerror="this.src='${DRAGON_FALLBACK_ASSET}'">
            <div>
              <b>目前選取：${escapeHtml(selectedDragon.name)}</b>
              <span>${dragonStageText(selectedDragon.stage)}｜${dragonElementText(selectedDragon.element)}｜${selectedDragon.rarity}</span>
            </div>
          </div>
        ` : ""}
        <div class="team-slots">${teamCards}</div>
        <div class="team-editor-actions">
          ${selectedDragon ? `
            <button type="button" data-v2-action="add-to-team" data-dragon-id="${selectedDragon.id}">加入隊伍</button>
          ` : ""}
          <button type="button" class="is-muted" data-v2-action="close-team-modal">關閉</button>
        </div>
      </section>
    </div>
  `;
}

function addDragonToTeam(dragonId) {
  const dragon = getDragonById(dragonId);
  if (!dragon) return;
  state.battleTeam = normalizeBattleTeam(state.battleTeam, state.dragons);
  if (state.battleTeam.includes(dragon.id)) {
    showToast("這隻龍已經在隊伍中");
    return;
  }
  if (state.battleTeam.length >= BATTLE_TEAM_LIMIT) {
    showToast("隊伍已滿，請先移除一隻龍");
    return;
  }
  state.battleTeam.push(dragon.id);
  dragon.isInTeam = true;
  selectedRestDragonId = null;
  state.selectedRestDragonId = null;
  state.homeIsland = normalizeHomeIsland(state.homeIsland, state.dragons);
  saveGame();
  renderHomeV2();
  openTeamModal(dragon.id);
  showToast("已加入隊伍");
}

function removeDragonFromTeam(dragonId) {
  const dragon = getDragonById(dragonId);
  state.battleTeam = normalizeBattleTeam(state.battleTeam, state.dragons)
    .filter((id) => id !== dragonId);
  if (dragon) dragon.isInTeam = false;
  state.homeIsland = normalizeHomeIsland(state.homeIsland, state.dragons);
  saveGame();
  renderHomeV2();
  openTeamModal(dragon?.id || null);
  showToast("已移出隊伍");
}

function startRestDragonBehaviorLoop() {
  if (restDragonBehaviorTimer) return;
  const tick = () => {
    restDragonBehaviorTimer = null;
    randomizeRestDragonActions();
    restDragonBehaviorTimer = window.setTimeout(tick, randomInt(5000, 8000));
  };
  restDragonBehaviorTimer = window.setTimeout(tick, randomInt(5000, 8000));
}

function startDragonFrameAnimationLoop() {
  if (dragonFrameAnimationTimer) return;
  let frameIndex = 0;
  dragonFrameAnimationTimer = window.setInterval(() => {
    frameIndex += 1;
    document.querySelectorAll(".restIsland .home-v2-dragon[data-dragon-id] img").forEach((image) => {
      const dragonId = image.closest(".home-v2-dragon")?.dataset.dragonId;
      const dragon = getDragonById(dragonId);
      if (!dragon || dragon.isDragging) return;
      const nextSource = getDragonAsset(dragon, dragon.currentAction, frameIndex);
      if (nextSource && image.getAttribute("src") !== nextSource) {
        image.dataset.fallback = "";
        image.src = nextSource;
      }
    });
  }, 180);
}

function randomizeRestDragonActions() {
  const restDragons = getRestIslandDragons();
  let changed = false;
  restDragons.forEach((dragon) => {
    const now = Date.now();
    if (dragon.id === selectedRestDragonId || dragon.id === state.selectedRestDragonId) return;
    if (isRestDragonPositionLocked(dragon, now)) return;
    if (dragon.lockActionUntil && dragon.lockActionUntil > now) return;
    if (dragon.isAngry && dragon.angryUntil && dragon.angryUntil > now) return;
    if (["eat", "train", "attack", "angry"].includes(dragon.currentAction)) return;
    ensureRestDragonPosition(dragon);
    if (Math.random() <= 0.72) {
      dragon.currentAction = randomItem(REST_RANDOM_ACTIONS);
      changed = true;
    }
    if (Math.random() <= 0.68) {
      const next = clampRestDragonPosition(
        dragon.restX + randomInt(-10, 11),
        dragon.restY + randomInt(-6, 7)
      );
      dragon.targetRestX = next.x;
      dragon.targetRestY = next.y;
      dragon.restX = next.x;
      dragon.restY = next.y;
      if (dragon.currentAction === "idle") dragon.currentAction = "walk";
      changed = true;
    }
    updateRestDragonElement(dragon);
  });
  if (!changed) return;
  saveGame();
}

function hatchEggToDragon(egg) {
  const normalizedEgg = normalizeInventoryEgg(egg);
  const definition = HATCH_EGG_DEFINITIONS[normalizedEgg.type] || HATCH_EGG_DEFINITIONS["normal-egg"];
  const rarity = rollWeightedHatchRarity(definition.rarityRates);
  const element = normalizeDragonElement(pickHatchElement(normalizedEgg.elementBias || definition.elementBias));
  const stage = "baby";
  const dragon = {
    id: createId("dragon"),
    name: generateDragonName(rarity, dragonElementText(element)),
    rarity,
    element,
    stage,
    level: 1,
    hp: calculateHatchDragonStat(rarity, 88, 28),
    attack: calculateHatchDragonStat(rarity, 24, 11),
    defense: calculateHatchDragonStat(rarity, 18, 8),
    speed: calculateHatchDragonStat(rarity, 14, 7),
    hunger: 100,
    mood: 90,
    exp: 0,
    power: Math.round((rarityPower[rarity] || 1) * 12),
    isInTeam: false,
    currentAction: "idle",
    assetBase: `assets/dragons/${element}/${stage}/`,
    avatarAsset: `assets/dragons/${element}/${stage}/avatar.png`,
    costumeId: null,
    skinId: null,
    isAngry: false,
    angryUntil: null,
    lockActionUntil: null,
    lastInteractedAt: null
  };
  dragon.image = getDragonAsset(dragon);
  return dragon;
}

function renderWorldHomePage(index) {
  const dragons = getRestIslandDragons();
  const readySlots = (state.hatchIsland?.hatchSlots || []).filter((slot) => slot.currentEgg && getHatchSlotStatus(slot).ready).length;
  const taskText = readySlots > 0 ? `${readySlots} 顆龍蛋可以領取` : "讓龍寶們在島上休息";

  const selectedDragon = getDragonById(selectedRestDragonId || state.selectedRestDragonId);
  const activeIsland = state.archipelago?.islands?.find((island) => island.id === state.archipelago.activeIslandId)
    || state.archipelago?.islands?.[0]
    || createDefaultArchipelago().islands[0];
  return `
    <section class="worldPage homePage restIsland dragon-archipelago-page${selectedDragon ? " has-selected-dragon" : ""}" data-world-index="${index}" data-island-id="${escapeHtml(activeIsland.id)}" aria-label="龍之島">
      <div class="rest-ambient" aria-hidden="true">
        <span class="rest-cloud rest-cloud-a"></span>
        <span class="rest-cloud rest-cloud-b"></span>
        <span class="rest-far-crystal rest-far-crystal-a"></span>
        <span class="rest-far-crystal rest-far-crystal-b"></span>
        <span class="rest-particle particle-a"></span>
        <span class="rest-particle particle-b"></span>
        <span class="rest-particle particle-c"></span>
        <span class="rest-particle particle-d"></span>
      </div>
      <div class="home-v2-title">
        <h1>${escapeHtml(activeIsland.name || "龍之島")}</h1>
        <p>龍之群島 · 休憩主島</p>
      </div>
      <aside class="home-v2-task">
        <b>今日任務</b>
        <span>${escapeHtml(taskText)}</span>
      </aside>
      ${renderRestDragonStatusPanel()}
      <div class="rest-island-stage">
        <div class="rest-island-glow" aria-hidden="true"></div>
        <img
          class="rest-island-art"
          src="${escapeHtml(activeIsland.asset || ASSETS.islands.rest)}"
          alt="${escapeHtml(activeIsland.name || "龍之島")}"
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
        <div class="archipelago-building-layer" aria-hidden="true">
          ${Array.from({ length: Math.min(12, positiveNumber(activeIsland.buildingSlots, 12)) }, (_, slotIndex) => (
            `<span class="archipelago-building-slot slot-${slotIndex + 1}" data-building-slot="${slotIndex + 1}"></span>`
          )).join("")}
        </div>
        <div class="rest-island-characters">
          <div class="home-v2-dragons">
            ${renderRestIslandDragonsMarkup()}
          </div>
          <div class="home-v2-mimi npc-guide">
            ${homeV2Image(ASSETS.characters.mimiFull, "Mimi", "Mimi")}
            <span class="mimi-npc-shadow" aria-hidden="true"></span>
            <span class="mimi-npc-bubble">這裡很安全，龍寶們會慢慢恢復精神。</span>
          </div>
        </div>
      </div>
      ${renderDragonEvolutionModal()}
    </section>
  `;
}

function renderRestDragonStatusPanel() {
  const dragon = getDragonById(selectedRestDragonId || state.selectedRestDragonId);
  if (!dragon || dragon.isInTeam || dragon.isOnRestIsland !== true) return "";
  const now = Date.now();
  if (dragon.angryUntil && dragon.angryUntil > now) return "";
  const avatar = getDragonAvatarAsset(dragon);
  return `
    <section class="rest-dragon-status-panel" aria-label="${escapeHtml(dragon.name)} 狀態面板">
      <button class="dragon-status-close" type="button" data-v2-action="close-rest-dragon-panel" aria-label="關閉">×</button>
      <div class="dragon-status-avatar-wrap">
        <img
          class="dragon-status-avatar"
          src="${avatar}"
          alt="${escapeHtml(dragon.name)} 大頭貼"
          onerror="if(!this.dataset.fallback){this.dataset.fallback='1';this.src='${getDragonAsset(dragon, "idle")}'}else{this.src='${DRAGON_FALLBACK_ASSET}'}"
        >
        <div class="dragon-costume-badge">時裝</div>
      </div>
      <div class="dragon-status-info">
        <header>
          <h2>${escapeHtml(dragon.name)}</h2>
          <p>${dragonElementText(dragon.element)} / ${dragon.rarity} / Lv.${formatNumber(dragon.level || 1)}</p>
        </header>
        <div class="dragon-stat-rows">
          <span>階段 <b>${dragonStageText(dragon.stage)}</b></span>
          <span>戰力 <b>${formatNumber(dragon.power || 0)}</b></span>
          <span>飽食 <b>${formatNumber(dragon.hunger || 0)}</b></span>
          <span>心情 <b>${formatNumber(dragon.mood || 0)}</b></span>
        </div>
        <div class="dragon-status-actions">
          <button type="button" data-v2-action="feed-dragon" data-dragon-id="${dragon.id}">餵食</button>
          <button type="button" data-v2-action="train-dragon" data-dragon-id="${dragon.id}">訓練</button>
          <button type="button" data-v2-action="open-team-modal" data-dragon-id="${dragon.id}">出戰</button>
          <button type="button" data-v2-action="open-dragon-evolution" data-dragon-id="${dragon.id}">進化</button>
          <button type="button" data-v2-action="open-sell-dragon" data-dragon-id="${dragon.id}">出售</button>
          <button type="button" data-v2-action="send-dragon-back-to-house" data-action="backToHouse" data-dragon-id="${dragon.id}">回龍舍</button>
        </div>
      </div>
    </section>
  `;
}

function getDragonEvolutionTemplate(dragon) {
  if (!dragon) return null;
  const currentTemplate = findDragonCatalogTemplate(dragon);
  if (currentTemplate?.nextEvolution) {
    const exact = contentCatalog.dragons.find((item) => item.id === currentTemplate.nextEvolution);
    if (exact) return exact;
  }
  const order = ["baby", "youth", "adult", "evolution"];
  const nextStage = order[order.indexOf(normalizeDragonStage(dragon.stage)) + 1];
  if (!nextStage) return null;
  if (dragon.speciesId || currentTemplate?.speciesId) {
    const sameSpecies = contentCatalog.dragons.find((item) => (
      item.speciesId === (dragon.speciesId || currentTemplate.speciesId) &&
      normalizeDragonStage(item.stage) === nextStage
    ));
    if (sameSpecies) return sameSpecies;
  }
  return findDragonCatalogTemplate({ ...dragon, stage: nextStage, templateId: null });
}

function getDragonEvolutionRequirements(dragon) {
  const stage = normalizeDragonStage(dragon?.stage);
  const defaults = {
    baby: { coins: 300, fragments: 5, materials: { evolutionStone: 1 } },
    youth: { coins: 1200, fragments: 15, materials: { evolutionStone: 2 } },
    adult: { coins: 5000, fragments: 40, materials: { evolutionStone: 5 } }
  };
  const template = findDragonCatalogTemplate(dragon || {});
  return template?.evolution || dragon?.evolution || defaults[stage] || null;
}

function getDragonFragmentKey(dragon) {
  return dragon?.speciesId || findDragonCatalogTemplate(dragon || {})?.speciesId || dragon?.templateId || dragon?.id;
}

function getEvolutionPreviewStats(dragon, nextTemplate) {
  return {
    hp: positiveNumber(nextTemplate?.hp, dragon.hp + positiveNumber(dragon.growth?.hp, 8) * 10),
    attack: positiveNumber(nextTemplate?.atk || nextTemplate?.attack, dragon.attack + positiveNumber(dragon.growth?.atk, 2) * 10),
    defense: positiveNumber(nextTemplate?.def || nextTemplate?.defense, dragon.defense + positiveNumber(dragon.growth?.def, 1) * 10),
    speed: positiveNumber(nextTemplate?.speed, dragon.speed + positiveNumber(dragon.growth?.speed, 1) * 5)
  };
}

function renderDragonEvolutionModal() {
  const dragonId = state?.ui?.activeDragonEvolutionId;
  const dragon = getDragonById(dragonId);
  if (!dragon) return "";
  const nextTemplate = getDragonEvolutionTemplate(dragon);
  const requirements = getDragonEvolutionRequirements(dragon);
  const fragmentKey = getDragonFragmentKey(dragon);
  const fragments = normalizedNonNegative(state.dragonResources?.fragments?.[fragmentKey], 0);
  const stones = normalizedNonNegative(state.dragonResources?.materials?.evolutionStone, 0);
  const preview = nextTemplate ? getEvolutionPreviewStats(dragon, nextTemplate) : null;
  const canEvolve = Boolean(nextTemplate && requirements && state.coins >= requirements.coins && fragments >= requirements.fragments && stones >= requirements.materials.evolutionStone);
  return `
    <div class="dragon-evolution-backdrop" data-v2-backdrop="dragon-evolution">
      <section class="dragon-evolution-modal" role="dialog" aria-modal="true" aria-label="龍進化">
        <header>
          <div>
            <small>龍成長</small>
            <h2>進化</h2>
          </div>
          <button type="button" data-v2-action="close-dragon-evolution" aria-label="關閉">×</button>
        </header>
        ${nextTemplate && requirements ? `
          <div class="dragon-evolution-path">
            <article>
              <img src="${getDragonAvatarAsset(dragon)}" alt="" onerror="this.src='${DRAGON_FALLBACK_ASSET}'">
              <b>${escapeHtml(dragonStageText(dragon.stage))}</b>
              <span>${escapeHtml(dragon.name)}</span>
            </article>
            <i aria-hidden="true">→</i>
            <article class="is-next">
              <img src="${escapeHtml(nextTemplate.portraitAsset || nextTemplate.iconAsset || getDragonAsset({ ...dragon, templateId: nextTemplate.id, stage: nextTemplate.stage }, "idle"))}" alt="">
              <b>${escapeHtml(dragonStageText(nextTemplate.stage))}</b>
              <span>${escapeHtml(nextTemplate.name || dragon.name)}</span>
            </article>
          </div>
          <div class="dragon-evolution-stats">
            <span>生命 <b>${formatNumber(dragon.hp)} → ${formatNumber(preview.hp)}</b></span>
            <span>攻擊 <b>${formatNumber(dragon.attack)} → ${formatNumber(preview.attack)}</b></span>
            <span>防禦 <b>${formatNumber(dragon.defense)} → ${formatNumber(preview.defense)}</b></span>
            <span>速度 <b>${formatNumber(dragon.speed)} → ${formatNumber(preview.speed)}</b></span>
          </div>
          <div class="dragon-evolution-costs">
            <span class="${state.coins >= requirements.coins ? "is-ready" : ""}">金幣 ${formatNumber(state.coins)} / ${formatNumber(requirements.coins)}</span>
            <span class="${fragments >= requirements.fragments ? "is-ready" : ""}">龍碎片 ${formatNumber(fragments)} / ${formatNumber(requirements.fragments)}</span>
            <span class="${stones >= requirements.materials.evolutionStone ? "is-ready" : ""}">進化石 ${formatNumber(stones)} / ${formatNumber(requirements.materials.evolutionStone)}</span>
          </div>
          <button class="dragon-evolution-confirm" type="button" data-v2-action="confirm-dragon-evolution" data-dragon-id="${dragon.id}" ${canEvolve ? "" : "aria-disabled=\"true\""}>進化</button>
        ` : `
          <div class="dragon-evolution-max">
            <img src="${getDragonAvatarAsset(dragon)}" alt="">
            <h3>已達最高階段</h3>
            <p>這隻龍目前沒有下一階段資料。</p>
          </div>
        `}
      </section>
    </div>
  `;
}

function openDragonEvolution(dragonId) {
  const dragon = getDragonById(dragonId);
  if (!dragon) {
    showToast("找不到這隻龍");
    return;
  }
  state.ui.activeDragonEvolutionId = dragon.id;
  document.querySelector(".dragon-evolution-backdrop")?.remove();
  mountHomeV2Overlay(renderDragonEvolutionModal());
}

function closeDragonEvolution() {
  if (state?.ui) state.ui.activeDragonEvolutionId = null;
  document.querySelectorAll(".dragon-evolution-backdrop").forEach((element) => element.remove());
}

function confirmDragonEvolution(dragonId) {
  const dragon = getDragonById(dragonId);
  if (!dragon) {
    closeDragonEvolution();
    showToast("找不到這隻龍");
    return;
  }
  const nextTemplate = getDragonEvolutionTemplate(dragon);
  const requirements = getDragonEvolutionRequirements(dragon);
  if (!nextTemplate || !requirements) {
    showToast("這隻龍已達最高階段");
    return;
  }
  const fragmentKey = getDragonFragmentKey(dragon);
  const fragments = normalizedNonNegative(state.dragonResources.fragments[fragmentKey], 0);
  const stones = normalizedNonNegative(state.dragonResources.materials.evolutionStone, 0);
  if (state.coins < requirements.coins) return showToast("金幣不足");
  if (fragments < requirements.fragments) return showToast("龍碎片不足");
  if (stones < requirements.materials.evolutionStone) return showToast("進化石不足");

  const stats = getEvolutionPreviewStats(dragon, nextTemplate);
  state.coins -= requirements.coins;
  state.dragonResources.fragments[fragmentKey] = fragments - requirements.fragments;
  state.dragonResources.materials.evolutionStone = stones - requirements.materials.evolutionStone;
  Object.assign(dragon, {
    templateId: nextTemplate.id,
    speciesId: nextTemplate.speciesId || dragon.speciesId,
    stage: normalizeDragonStage(nextTemplate.stage),
    level: Math.max(dragon.level || 1, growthStageLevel[normalizeDragonStage(nextTemplate.stage)] || 1),
    hp: stats.hp,
    attack: stats.attack,
    defense: stats.defense,
    speed: stats.speed,
    power: Math.round(stats.hp * 0.25 + stats.attack * 2 + stats.defense * 1.5 + stats.speed * 1.2),
    assetBase: nextTemplate.assetRoot,
    assetRoot: nextTemplate.assetRoot,
    avatarAsset: nextTemplate.portraitAsset || nextTemplate.iconAsset,
    animationFrames: nextTemplate.actions || {},
    growth: nextTemplate.growth || {},
    nextEvolution: nextTemplate.nextEvolution || null,
    evolution: nextTemplate.evolution || null,
    skills: nextTemplate.skills || dragon.skills || [],
    talents: nextTemplate.talents || dragon.talents || [],
    tags: nextTemplate.tags || dragon.tags || [],
    variant: nextTemplate.variant || dragon.variant || "normal",
    glow: Boolean(nextTemplate.glow),
    boss: Boolean(nextTemplate.boss),
    mythical: Boolean(nextTemplate.mythical),
    currentAction: "idle"
  });
  closeDragonEvolution();
  saveGame();
  updateHomeV2HudResources();
  refreshRestIslandInteractionLayer();
  refreshDragonHousePage();
  showToast(`${dragon.name} 進化成功！`);
}

function handleRestDragonClick(dragonId, event = null) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  const dragon = getDragonById(dragonId);
  if (!dragon) return;
  const now = Date.now();
  if (dragon.angryUntil && dragon.angryUntil > now) {
    showToast("牠生氣了，暫時不想理你！");
    return;
  }

  if (lastClickedDragonId === dragonId && now - lastDragonClickTime < 2000) {
    dragonClickCount += 1;
  } else {
    lastClickedDragonId = dragonId;
    dragonClickCount = 1;
  }
  lastDragonClickTime = now;
  if (dragonClickCount > 6) {
    triggerDragonAngry(dragon);
    dragonClickCount = 0;
    return;
  }

  dragon.currentAction = "idle";
  dragon.lockActionUntil = now + 5000;
  dragon.isDragging = false;
  dragon.isAngry = false;
  dragon.angryUntil = null;
  dragon.lastInteractedAt = now;
  selectedRestDragonId = dragon.id;
  state.selectedRestDragonId = dragon.id;
  saveGame();
  updateRestDragonSprite(dragon);
  refreshRestIslandInteractionLayer();
}

function triggerDragonAngry(dragon) {
  const now = Date.now();
  dragon.currentAction = "angry";
  dragon.isAngry = true;
  dragon.angryUntil = now + 5000;
  dragon.lockActionUntil = now + 5000;
  dragon.lastInteractedAt = now;
  selectedRestDragonId = null;
  state.selectedRestDragonId = null;
  saveGame();
  refreshRestIslandInteractionLayer();
  showToast("不要一直點我！");
  window.setTimeout(() => {
    const latest = getDragonById(dragon.id);
    if (!latest || !latest.angryUntil || latest.angryUntil > Date.now()) return;
    latest.isAngry = false;
    latest.angryUntil = null;
    latest.lockActionUntil = null;
    latest.currentAction = "idle";
    saveGame();
    if (gameHasStarted && els.homeV2Root && !els.homeV2Root.hidden) refreshRestIslandInteractionLayer();
  }, 5100);
}

function closeRestDragonStatusPanel(shouldRender = true) {
  const selectedId = selectedRestDragonId || state?.selectedRestDragonId;
  const dragon = selectedId ? getDragonById(selectedId) : null;
  if (dragon && (!dragon.angryUntil || dragon.angryUntil <= Date.now())) {
    dragon.lockActionUntil = null;
  }
  selectedRestDragonId = null;
  if (state) state.selectedRestDragonId = null;
  if (shouldRender && gameHasStarted && els.homeV2Root && !els.homeV2Root.hidden) {
    saveGame();
    refreshRestIslandInteractionLayer();
  }
}

function getHomeV2DragTarget(target) {
  if (!target) return null;
  if (target.closest("#bottomNavViewport")) return null;
  if (
    target.closest(
      "button, select, input, textarea, a, [data-v2-action], [data-world-page], [data-page], .egg-modal, .egg-modal-backdrop, .egg-choice-card, .rest-dragon-status-panel, .rest-dragon-action-backdrop, .rest-dragon-sheet, .dragon-info-backdrop, .dragon-info-modal, .team-editor-backdrop, .team-editor-modal, .dragon-sell-backdrop, .dragon-sell-modal"
    )
  ) {
    return null;
  }
  return target.closest("#worldPager");
}

// Dragon House: final page integration. This page uses the same state.dragons
// list as rest island, so selling, team state, rename, and hatching stay in sync.
function getWorldPages() {
  return [
    { id: "home", label: "家", title: "休息島", icon: "家", assetKey: "navHome", className: "homePage", render: renderWorldHomePage },
    { id: "dragonHouse", label: "龍舍", title: "龍舍", icon: "龍", assetKey: "navDragonHouse", className: "dragonHousePage", render: renderWorldDragonHousePage },
    { id: "dragonCave", label: "龍窟", title: "龍窟", icon: "蛋", assetKey: "navDragonCave", className: "dragonCavePage", render: renderWorldDragonCavePage },
    { id: "equipment", label: "裝備店", title: "裝備店", icon: "裝", assetKey: "navEquipmentShop", className: "equipmentShopPage", render: (index) => renderWorldPlaceholderPage(index, "equipmentShopPage", "裝備店", "販售寵物與傭兵裝備的預留頁。", [
      ["寵物頭盔", "提升龍寵防禦"],
      ["寵物胸甲", "提升龍寵耐久"],
      ["傭兵武器", "提升角色攻擊"],
      ["傭兵鞋靴", "提升速度"]
    ]) },
    { id: "items", label: "道具店", title: "道具店", icon: "包", assetKey: "navItemShop", className: "itemShopPage", render: (index) => renderWorldPlaceholderPage(index, "itemShopPage", "道具店", "販售探險卷、契約券、食物與孵化道具。", [
      ["探險卷", "探索區域取得龍蛋"],
      ["傭兵契約券", "冒險公會抽傭兵"],
      ["寵物食物", "恢復飽食與心情"],
      ["孵化道具", "加速孵化流程"]
    ]) },
    { id: "explore", label: "探索", title: "探索", icon: "探", assetKey: "navExplore", className: "explorePage", render: (index) => renderWorldPlaceholderPage(index, "explorePage", "探索", "使用探險卷前往火山、海洋與森林取得龍蛋。", [
      ["火山", "偏火屬性龍蛋"],
      ["海洋", "偏水屬性龍蛋"],
      ["森林", "偏木與土屬性龍蛋"],
      ["稀有氣息", "低機率光 / 暗屬性"]
    ]) },
    { id: "quest", label: "任務", title: "任務", icon: "任", assetKey: "navQuest", className: "questPage", render: renderWorldQuestPage }
  ];
}

function scrollHomeV2To(target) {
  const pageMap = {
    home: 0,
    rest: 0,
    dragonHouse: 1,
    house: 1,
    dragonCave: 2,
    hatch: 2,
    eggs: 2,
    equipment: 3,
    items: 4,
    explore: 5,
    adventurerGuild: 6,
    guild: 6,
    quest: 7
  };
  const index = typeof target === "number" ? target : pageMap[target] ?? 0;
  goToWorldPage(index);
}

function updateHomeV2ActiveSlide() {
  const pager = document.querySelector("#worldPager");
  if (!pager) return;
  const page = clamp(Math.round(pager.scrollLeft / Math.max(1, pager.clientWidth)), 0, (pager.children.length || 1) - 1);
  currentWorldPage = page;
  const pageId = getWorldPages()[page]?.id || "home";
  if (!mimiProgrammaticPageId || pageId === mimiProgrammaticPageId) {
    if (pageId === mimiProgrammaticPageId) {
      mimiProgrammaticPageId = null;
      if (mimiProgrammaticPageTimer) {
        clearTimeout(mimiProgrammaticPageTimer);
        mimiProgrammaticPageTimer = null;
      }
    }
    queueMimiPageIntro(pageId);
  }

  if (page !== 0 && (selectedRestDragonId || state.selectedRestDragonId)) {
    selectedRestDragonId = null;
    state.selectedRestDragonId = null;
    saveGame();
  }

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

}

function renderWorldDragonHousePage(index) {
  return `
    <section class="worldPage dragonHousePage" data-world-index="${index}" aria-label="龍舍">
      ${renderDragonHousePageInner()}
    </section>
  `;
}

function renderDragonHousePageInner() {
  const capacity = getDragonHouseCapacity();
  const total = (state.dragons || []).length;
  const rows = getDragonHouseRows();
  const cost = getDragonHouseUpgradeCost();
  const house = getDragonHouseState();
  const filters = getDragonHouseFilters();

  return `
    <div class="dragon-house-page">
      <section class="dragon-house-header">
        <div>
          <h1>龍舍</h1>
          <p>管理目前所有已擁有的龍</p>
        </div>
        <div class="dragon-house-capacity">
          <b>${formatNumber(total)} / ${formatNumber(capacity)}</b>
          <span>${formatNumber(rows)} 列容量</span>
        </div>
      </section>

      <section class="dragon-house-tools" aria-label="龍舍搜尋與篩選">
        <label class="dragon-house-search">
          ${renderAssetImage("dragonSearchIcon", "搜尋", "asset-image dragon-house-tool-icon")}
          <input type="search" data-dragon-house-search placeholder="搜尋龍名稱、屬性、稀有度" value="${escapeHtml(filters.search)}">
        </label>
        <div class="dragon-house-filters">
          <label>
            <span>屬性</span>
            <select data-dragon-house-filter="element">
              ${renderDragonHouseSelectOptions([
                ["all", "全部"],
                ["fire", "火"],
                ["water", "水"],
                ["wood", "木"],
                ["light", "光"],
                ["dark", "暗"]
              ], filters.element)}
            </select>
          </label>
          <label>
            <span>等級</span>
            <select data-dragon-house-filter="level">
              ${renderDragonHouseSelectOptions([
                ["all", "全部"],
                ["1-9", "Lv.1-9"],
                ["10-19", "Lv.10-19"],
                ["20-39", "Lv.20-39"],
                ["40+", "Lv.40+"]
              ], filters.level)}
            </select>
          </label>
          <label>
            <span>稀有度</span>
            <select data-dragon-house-filter="rarity">
              ${renderDragonHouseSelectOptions([
                ["all", "全部"],
                ["C", "C"],
                ["B", "B"],
                ["A", "A"],
                ["S", "S"],
                ["SS", "SS"],
                ["SSS", "SSS"],
                ["SSSS", "SSSS"]
              ], filters.rarity)}
            </select>
          </label>
        </div>
      </section>

      <section class="dragon-house-grid" aria-label="所有龍">
        ${renderDragonHouseGrid()}
      </section>

      <section class="dragon-house-upgrade">
        <div>
          <b>擴充龍舍</b>
          <span>每次增加 2 列，共 10 個位置</span>
        </div>
        <button type="button" data-v2-action="buy-dragon-house-rows" ${house.purchasedUpgrades >= house.maxUpgrades ? "disabled" : ""}>
          ${house.purchasedUpgrades >= house.maxUpgrades ? "已滿" : `+2列 ${formatNumber(cost)}鑽`}
        </button>
      </section>
    </div>
  `;
}

function renderDragonHouseSelectOptions(options, selectedValue) {
  return options.map(([value, label]) => (
    `<option value="${escapeHtml(value)}"${value === selectedValue ? " selected" : ""}>${escapeHtml(label)}</option>`
  )).join("");
}

function getDragonHouseFilters() {
  if (!dragonHouseFilters || typeof dragonHouseFilters !== "object") {
    dragonHouseFilters = { search: "", element: "all", level: "all", rarity: "all" };
  }
  return dragonHouseFilters;
}

function getDragonHouseFilteredDragons() {
  const filters = getDragonHouseFilters();
  const keyword = String(filters.search || "").trim().toLowerCase();
  const levelMatcher = DRAGON_HOUSE_LEVEL_FILTERS[filters.level] || DRAGON_HOUSE_LEVEL_FILTERS.all;

  return (state.dragons || []).filter((dragon) => {
    const element = normalizeDragonElement(dragon.element);
    const level = positiveNumber(dragon.level, 1);
    const rarity = dragon.rarity || "C";
    const searchable = [
      dragon.name,
      element,
      dragonElementText(element),
      rarity,
      `lv${level}`,
      String(level)
    ].join(" ").toLowerCase();

    return (!keyword || searchable.includes(keyword))
      && (filters.element === "all" || element === filters.element)
      && (filters.rarity === "all" || rarity === filters.rarity)
      && levelMatcher(level);
  });
}

function isDragonHouseFiltering() {
  const filters = getDragonHouseFilters();
  return Boolean(filters.search) || filters.element !== "all" || filters.level !== "all" || filters.rarity !== "all";
}

function renderDragonHouseGrid() {
  const dragons = getDragonHouseFilteredDragons();
  const capacity = getDragonHouseCapacity();
  const slotCount = isDragonHouseFiltering() ? Math.max(5, dragons.length) : capacity;
  const cells = [];

  for (let index = 0; index < slotCount; index += 1) {
    const dragon = dragons[index];
    cells.push(dragon ? renderDragonHouseCard(dragon) : renderDragonHouseEmptySlot(index));
  }

  return cells.join("");
}

function renderDragonHouseCard(dragon) {
  const element = normalizeDragonElement(dragon.element);
  const action = dragon.currentAction && DRAGON_ACTIONS.includes(dragon.currentAction) ? dragon.currentAction : "idle";
  const isTeam = Boolean(dragon.isInTeam);
  return `
    <button class="dragon-house-card rarity-${String(dragon.rarity || "C").toLowerCase()}" type="button" data-v2-action="open-dragon-house-detail" data-dragon-id="${dragon.id}" aria-label="${escapeHtml(dragon.name)}">
      <span class="dragon-house-thumb">
        <img src="${getDragonAsset(dragon, action)}" alt="" decoding="async" loading="lazy" onerror="if(!this.dataset.fallback){this.dataset.fallback='1';this.src='${DRAGON_FALLBACK_ASSET}'}else{this.hidden=true}">
      </span>
      <b>${escapeHtml(dragon.name)}</b>
      <small>${escapeHtml(dragonElementText(element))} / ${escapeHtml(dragon.rarity || "C")}</small>
      <em>Lv.${formatNumber(dragon.level || 1)}</em>
      <i class="${isTeam ? "is-team" : "is-rest"}">${isTeam ? "出戰" : "休息"}</i>
    </button>
  `;
}

function renderDragonHouseEmptySlot(index) {
  return `
    <div class="dragon-house-empty-slot" aria-label="空龍格 ${index + 1}">
      ${renderAssetImage("dragonEmptySlotIcon", "空格", "asset-image dragon-empty-slot-icon")}
      <span>空</span>
    </div>
  `;
}

function refreshDragonHousePage() {
  const page = document.querySelector(".dragonHousePage");
  if (!page) return;
  page.innerHTML = renderDragonHousePageInner();
}

function openDragonHouseDetail(dragonId) {
  const dragon = getDragonById(dragonId);
  if (!dragon) {
    showToast("這隻龍已不存在");
    refreshDragonHousePage();
    return;
  }

  closeDragonHouseDetail();
  closeDragonRenameModal();
  mountHomeV2Overlay(renderDragonHouseDetailModal(dragon));
}

function closeDragonHouseDetail() {
  document.querySelector(".dragon-house-detail-backdrop")?.remove();
}

function goToHomePage() {
  if (typeof scrollHomeV2To === "function") {
    scrollHomeV2To("home");
    return;
  }
  goToWorldPage(0);
}

function sendDragonHome(dragonId) {
  const dragon = getDragonById(dragonId);

  if (!dragon) {
    showToast("找不到這隻龍");
    closeDragonHouseDetail();
    refreshDragonHousePage();
    return;
  }

  if (dragon.isInTeam) {
    showToast("這隻龍正在出戰，請先移出隊伍");
    return;
  }

  if (dragon.isOnRestIsland) {
    closeDragonHouseDetail();
    goToHomePage();
    return;
  }

  if (isRestIslandFull()) {
    showToast("休息島已滿");
    return;
  }

  dragon.isOnRestIsland = true;
  ensureRestDragonPosition(dragon, getRestIslandDragons().length);
  state.homeIsland = normalizeHomeIsland(state.homeIsland, state.dragons);
  saveGame();
  closeDragonHouseDetail();
  renderHomeV2();
  window.setTimeout(() => goToHomePage(), 0);
  showToast(`${dragon.name} 已回到休息島`);
}

function sendDragonBackToHouse(dragonId) {
  const targetId = dragonId || selectedRestDragonId || state?.selectedRestDragonId;
  if (!targetId) {
    showToast("請先選擇一隻龍");
    return;
  }

  const dragon = getDragonById(targetId);
  if (!dragon) {
    showToast("找不到這隻龍");
    if (selectedRestDragonId === targetId) selectedRestDragonId = null;
    if (state?.selectedRestDragonId === targetId) state.selectedRestDragonId = null;
    closeRestDragonStatusPanel(false);
    refreshRestIslandInteractionLayer();
    return;
  }

  dragon.isOnRestIsland = false;
  dragon.isDragging = false;
  dragon.lockActionUntil = null;

  if (selectedRestDragonId === targetId) selectedRestDragonId = null;
  if (state.selectedRestDragonId === targetId) state.selectedRestDragonId = null;

  state.homeIsland = normalizeHomeIsland(state.homeIsland, state.dragons);
  closeRestDragonStatusPanel(false);
  saveGame();
  refreshRestIslandInteractionLayer();
  refreshDragonHousePage();

  if (typeof scrollHomeV2To === "function") {
    scrollHomeV2To("dragonHouse");
  }

  showToast(`${dragon.name} 已回到龍舍`);
}

function renderDragonHouseDetailModal(dragon) {
  const isTeam = Boolean(dragon.isInTeam);
  const locationText = isTeam ? "出戰中" : (dragon.isOnRestIsland ? "休息島" : "龍舍");
  return `
    <div class="dragon-house-detail-backdrop" data-v2-backdrop="dragon-house-detail">
      <section class="dragon-house-detail-modal" role="dialog" aria-modal="true" aria-label="${escapeHtml(dragon.name)} 詳細資料">
        <header>
          <img src="${getDragonAvatarAsset(dragon)}" alt="${escapeHtml(dragon.name)}" onerror="if(!this.dataset.fallback){this.dataset.fallback='1';this.src='${getDragonAsset(dragon, "idle")}'}else{this.src='${DRAGON_FALLBACK_ASSET}'}">
          <div>
            <h2>${escapeHtml(dragon.name)}</h2>
            <p>${escapeHtml(dragonElementText(dragon.element))} / ${escapeHtml(dragon.rarity || "C")} / ${escapeHtml(dragonStageText(dragon.stage))}</p>
          </div>
          <button type="button" data-v2-action="close-dragon-house-detail" aria-label="關閉">×</button>
        </header>
        <dl>
          <div><dt>等級</dt><dd>Lv.${formatNumber(dragon.level || 1)}</dd></div>
          <div><dt>經驗</dt><dd>${formatNumber(dragon.exp || 0)}</dd></div>
          <div><dt>戰力</dt><dd>${formatNumber(dragon.power || 0)}</dd></div>
          <div><dt>飽食</dt><dd>${formatNumber(dragon.hunger || 0)} / 100</dd></div>
          <div><dt>心情</dt><dd>${formatNumber(dragon.mood || 0)} / 100</dd></div>
          <div><dt>狀態</dt><dd>${locationText}</dd></div>
        </dl>
        <div class="dragon-house-detail-actions">
          <button type="button" data-v2-action="open-dragon-rename" data-dragon-id="${dragon.id}">改名</button>
          <button type="button" data-v2-action="show-dragon-info" data-dragon-id="${dragon.id}">查看</button>
          <button type="button" data-v2-action="${isTeam ? "remove-from-team" : "open-team-modal"}" data-dragon-id="${dragon.id}">${isTeam ? "移出隊伍" : "出戰"}</button>
          <button type="button" data-v2-action="open-dragon-evolution" data-dragon-id="${dragon.id}">進化</button>
          <button type="button" data-v2-action="open-sell-dragon" data-dragon-id="${dragon.id}">出售</button>
          <button type="button" data-v2-action="trade-dragon-placeholder" data-dragon-id="${dragon.id}">交易</button>
          <button type="button" class="is-muted" data-v2-action="send-dragon-home" data-dragon-id="${dragon.id}">回家</button>
        </div>
      </section>
    </div>
  `;
}

function openDragonRenameModal(dragonId) {
  const dragon = getDragonById(dragonId);
  if (!dragon) {
    showToast("這隻龍已不存在");
    return;
  }
  closeDragonRenameModal();
  mountHomeV2Overlay(`
    <div class="dragon-rename-backdrop" data-v2-backdrop="dragon-rename">
      <section class="dragon-rename-modal" role="dialog" aria-modal="true" aria-label="改名">
        <h2>替 ${escapeHtml(dragon.name)} 改名</h2>
        <p>最多 8 個中文字或 16 個英文字。</p>
        <input class="dragon-rename-input" type="text" value="${escapeHtml(dragon.name)}" maxlength="16" data-rename-dragon-id="${dragon.id}">
        <div>
          <button type="button" class="is-muted" data-v2-action="close-dragon-rename">取消</button>
          <button type="button" data-v2-action="confirm-dragon-rename" data-dragon-id="${dragon.id}">儲存</button>
        </div>
      </section>
    </div>
  `);
  window.setTimeout(() => document.querySelector(".dragon-rename-input")?.focus(), 0);
}

function closeDragonRenameModal() {
  document.querySelector(".dragon-rename-backdrop")?.remove();
}

function getDragonNameLengthCost(name) {
  return Array.from(String(name || "")).reduce((total, char) => (
    total + (char.charCodeAt(0) > 127 ? 2 : 1)
  ), 0);
}

function confirmDragonRename(dragonId) {
  const dragon = getDragonById(dragonId);
  const input = document.querySelector(".dragon-rename-input");
  const nextName = String(input?.value || "").trim();
  if (!dragon) {
    closeDragonRenameModal();
    closeDragonHouseDetail();
    showToast("這隻龍已不存在");
    return;
  }
  if (!nextName) {
    showToast("名稱不能空白");
    return;
  }
  if (getDragonNameLengthCost(nextName) > 16) {
    showToast("名稱太長");
    return;
  }

  dragon.name = nextName;
  saveGame();
  closeDragonRenameModal();
  closeDragonHouseDetail();
  renderHomeV2();
  showToast("龍的名字已更新");
}

function handleHomeV2Input(event) {
  const adventurerSearch = event.target.closest("[data-adventurer-search]");
  if (adventurerSearch) {
    adventurerGuildFilters.search = adventurerSearch.value;
    refreshAdventurerGuildPage({ focusSearch: true });
    return;
  }
  const searchInput = event.target.closest("[data-dragon-house-search]");
  if (!searchInput) return;
  getDragonHouseFilters().search = searchInput.value;
  refreshDragonHousePage();
}

function handleHomeV2Change(event) {
  const adventurerFilter = event.target.closest("[data-adventurer-filter]");
  if (adventurerFilter) {
    adventurerGuildFilters[adventurerFilter.dataset.adventurerFilter] = adventurerFilter.value;
    refreshAdventurerGuildPage();
    return;
  }
  const filter = event.target.closest("[data-dragon-house-filter]");
  if (!filter) return;
  const filters = getDragonHouseFilters();
  filters[filter.dataset.dragonHouseFilter] = filter.value;
  refreshDragonHousePage();
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
  if (event.target.matches("[data-v2-backdrop='rest-dragon-menu']")) {
    event.preventDefault();
    event.stopPropagation();
    closeRestDragonActionSheet();
    return;
  }
  if (event.target.matches("[data-v2-backdrop='dragon-info']")) {
    event.preventDefault();
    event.stopPropagation();
    closeDragonInfoModal();
    return;
  }
  if (event.target.matches("[data-v2-backdrop='team-editor']")) {
    event.preventDefault();
    event.stopPropagation();
    closeTeamModal();
    return;
  }
  if (event.target.matches("[data-v2-backdrop='dragon-sell']")) {
    event.preventDefault();
    event.stopPropagation();
    closeSellDragonConfirm();
    return;
  }
  if (event.target.matches("[data-v2-backdrop='dragon-house-detail']")) {
    event.preventDefault();
    event.stopPropagation();
    closeDragonHouseDetail();
    return;
  }
  if (event.target.matches("[data-v2-backdrop='dragon-rename']")) {
    event.preventDefault();
    event.stopPropagation();
    closeDragonRenameModal();
    return;
  }
  if (event.target.matches("[data-v2-backdrop='dragon-evolution']")) {
    event.preventDefault();
    event.stopPropagation();
    closeDragonEvolution();
    return;
  }

  const actionButton = event.target.closest("[data-v2-action]");
  if (actionButton) {
    event.preventDefault();
    event.stopPropagation();
    const action = actionButton.dataset.v2Action;
    const dragonId = actionButton.dataset.dragonId;

    if (action === "settings") {
      toggleDebugPanel();
      return;
    }
    if (action === "resource-plus") {
      showToast("資源加號先保留給之後擴充。");
      return;
    }
    if (action === "buy-dragon-house-rows") {
      buyDragonHouseRows();
      return;
    }
    if (action === "open-dragon-house-detail") {
      openDragonHouseDetail(dragonId);
      return;
    }
    if (action === "close-dragon-house-detail") {
      closeDragonHouseDetail();
      return;
    }
    if (action === "send-dragon-home") {
      sendDragonHome(dragonId);
      return;
    }
    if (action === "open-dragon-rename") {
      openDragonRenameModal(dragonId);
      return;
    }
    if (action === "close-dragon-rename") {
      closeDragonRenameModal();
      return;
    }
    if (action === "confirm-dragon-rename") {
      confirmDragonRename(dragonId);
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
      handleRestDragonClick(dragonId);
      return;
    }
    if (action === "close-rest-dragon-panel") {
      closeRestDragonStatusPanel();
      return;
    }
    if (action === "close-rest-dragon-menu") {
      closeRestDragonActionSheet();
      return;
    }
    if (action === "feed-dragon") {
      feedRestDragon(dragonId);
      refreshDragonHousePage();
      return;
    }
    if (action === "train-dragon") {
      trainRestDragon(dragonId);
      refreshDragonHousePage();
      return;
    }
    if (action === "show-dragon-info") {
      closeDragonHouseDetail();
      openDragonInfoModal(dragonId);
      return;
    }
    if (action === "open-team-modal") {
      closeDragonHouseDetail();
      openTeamModal(dragonId);
      return;
    }
    if (action === "open-dragon-evolution") {
      closeDragonHouseDetail();
      openDragonEvolution(dragonId);
      return;
    }
    if (action === "close-dragon-evolution") {
      closeDragonEvolution();
      return;
    }
    if (action === "confirm-dragon-evolution") {
      confirmDragonEvolution(dragonId);
      return;
    }
    if (action === "open-sell-dragon") {
      closeDragonHouseDetail();
      openSellDragonConfirm(dragonId);
      return;
    }
    if (action === "close-sell-dragon") {
      closeSellDragonConfirm();
      return;
    }
    if (action === "confirm-sell-dragon") {
      confirmSellDragon(dragonId);
      return;
    }
    if (action === "send-dragon-back-to-house" || action === "backToHouse") {
      sendDragonBackToHouse(dragonId || selectedRestDragonId || state.selectedRestDragonId);
      return;
    }
    if (action === "trade-dragon-placeholder") {
      showToast("交易功能開發中");
      return;
    }
    if (action === "close-dragon-info") {
      closeDragonInfoModal();
      return;
    }
    if (action === "close-team-modal") {
      closeTeamModal();
      return;
    }
    if (action === "add-to-team") {
      addDragonToTeam(dragonId);
      return;
    }
    if (action === "remove-from-team") {
      closeDragonHouseDetail();
      removeDragonFromTeam(dragonId);
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
    if (Number(pageButton.dataset.page) !== 0) closeRestDragonStatusPanel(false);
    goToWorldPage(Number(pageButton.dataset.page));
    return;
  }

  const navButton = event.target.closest("[data-world-page]");
  if (navButton) {
    event.preventDefault();
    event.stopPropagation();
    if (Number(navButton.dataset.worldPage) !== 0) closeRestDragonStatusPanel(false);
    goToWorldPage(Number(navButton.dataset.worldPage));
  }
}

function getHomeV2DragTarget(target) {
  if (!target) return null;
  if (target.closest("#bottomNavViewport")) return null;
  if (
    target.closest(
      "button, select, input, textarea, a, [data-v2-action], [data-world-page], [data-page], .egg-modal, .egg-modal-backdrop, .egg-choice-card, .rest-dragon-status-panel, .rest-dragon-action-backdrop, .rest-dragon-sheet, .dragon-info-backdrop, .dragon-info-modal, .team-editor-backdrop, .team-editor-modal, .dragon-sell-backdrop, .dragon-sell-modal, .dragon-house-detail-backdrop, .dragon-house-detail-modal, .dragon-rename-backdrop, .dragon-rename-modal, .dragon-house-tools, .dragon-house-grid, .adventurer-gacha-backdrop, .adventurer-detail-backdrop, .adventurer-sell-backdrop, .adventurer-guild-tools, .adventurer-grid"
    )
  ) {
    return null;
  }
  return target.closest("#worldPager");
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
  if (!addDragonToPlayer(dragon, { save: false })) {
    return;
  }

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
  refreshDragonHousePage();
  showToast(`孵化成功！獲得 ${dragon.rarity} ${dragon.name}`);
}

function attachDragonHouseEventBridge() {
  if (!els?.homeV2Root || els.homeV2Root.dataset.dragonHouseBound === "true") return;
  els.homeV2Root.addEventListener("input", handleHomeV2Input);
  els.homeV2Root.addEventListener("change", handleHomeV2Change);
  els.homeV2Root.dataset.dragonHouseBound = "true";
}

attachDragonHouseEventBridge();

// Beginner tutorial, exploration, and mission flow. These overrides are kept at
// the end of the file so they integrate with the current Home V2 worldPager
// without rebuilding unrelated pages.
function normalizeTutorial(tutorial = {}) {
  const source = tutorial && typeof tutorial === "object" ? tutorial : {};
  const seen = Boolean(source.tutorialSeen || source.seen || source.completed);
  const step = clamp(Math.floor(Number(source.step ?? source.tutorialStep ?? 0) || 0), 0, TUTORIAL_STEPS.length - 1);
  return {
    started: source.started !== false,
    tutorialSeen: seen,
    seen,
    completed: seen,
    step,
    tutorialStep: step,
    beginnerQuestStarted: source.beginnerQuestStarted !== false,
    ticketsGranted: Boolean(source.ticketsGranted),
    waitingFor: source.waitingFor || null,
    firstDrawUnlocked: Boolean(source.firstDrawUnlocked),
    firstDrawUsed: Boolean(source.firstDrawUsed)
  };
}

function createDefaultBeginnerMissions() {
  const steps = {};
  BEGINNER_MISSION_DEFS.forEach((mission) => {
    steps[mission.id] = { current: 0, target: mission.target, claimed: false };
  });
  return {
    beginner: {
      started: true,
      completed: false,
      steps,
      finalClaimed: false
    }
  };
}

function normalizeBeginnerMissionStep(step, mission) {
  const source = step && typeof step === "object" ? step : {};
  const target = positiveNumber(source.target, mission.target);
  return {
    current: clamp(Math.floor(Number(source.current) || 0), 0, target),
    target,
    claimed: Boolean(source.claimed)
  };
}

function normalizeMissions(missions = {}) {
  const defaults = createDefaultBeginnerMissions();
  const savedBeginner = missions?.beginner && typeof missions.beginner === "object" ? missions.beginner : {};
  const steps = {};
  BEGINNER_MISSION_DEFS.forEach((mission) => {
    steps[mission.id] = normalizeBeginnerMissionStep(savedBeginner.steps?.[mission.id], mission);
  });
  const beginner = {
    ...defaults.beginner,
    ...savedBeginner,
    steps,
    started: savedBeginner.started !== false,
    finalClaimed: Boolean(savedBeginner.finalClaimed)
  };
  beginner.completed = BEGINNER_MISSION_DEFS.every((mission) => {
    const step = beginner.steps[mission.id];
    return step.current >= step.target && step.claimed;
  });
  return { ...defaults, ...missions, beginner };
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
  state.inventory = normalizeInventory(state.inventory, createNewState().inventory);
  state.adventurers = Array.isArray(state.adventurers) ? state.adventurers.map(normalizeAdventurer).filter(Boolean) : [];
  state.equipmentInventory = Array.isArray(state.equipmentInventory) ? state.equipmentInventory.map(normalizeEquipment) : [];
  state.equipmentShop = normalizeEquipmentShop(state.equipmentShop);
  state.adventurerTeams = normalizeAdventurerTeams(state.adventurerTeams, state.adventurers);
  state.marketListings = Array.isArray(state.marketListings) ? state.marketListings : [];
  state.ui = state.ui && typeof state.ui === "object" ? state.ui : {};
  state.ui.activeAdventurerPanel = ["team", "upgrade", "equipment", "trade"].includes(state.ui.activeAdventurerPanel)
    ? state.ui.activeAdventurerPanel
    : null;
  state.ui.activeAdventurerEquipmentSlot = EQUIPMENT_SLOTS.includes(state.ui.activeAdventurerEquipmentSlot)
    ? state.ui.activeAdventurerEquipmentSlot
    : "weapon";
  state.ui.activeAdventurerTradeTab = state.ui.activeAdventurerTradeTab === "market" ? "market" : "sell";
  state.ui.bulkManage = normalizeBulkManageState(state.ui.bulkManage);
  syncAdventurerEquipmentState();
  syncAdventurerTeamFlags();
  state.characterTickets = normalizedNonNegative(state.characterTickets, 0);
  state.tutorial = normalizeTutorial(state.tutorial);
  state.tutorialSeen = state.tutorial.tutorialSeen;
  state.tutorialStep = state.tutorial.step;
  state.beginnerQuestStarted = state.tutorial.beginnerQuestStarted;
  state.missions = normalizeMissions(state.missions);
  state.battleTeam = normalizeBattleTeam(state.battleTeam, state.dragons || []);
  syncDragonTeamFlags();
}

function getBeginnerMissionState() {
  state.missions = normalizeMissions(state.missions);
  return state.missions.beginner;
}

function getBeginnerMissionStep(id) {
  return getBeginnerMissionState().steps[id] || null;
}

function updateBeginnerMissionProgress(id, amount = 1, options = {}) {
  const mission = BEGINNER_MISSION_DEFS.find((item) => item.id === id);
  const step = getBeginnerMissionStep(id);
  if (!mission || !step || step.current >= step.target) return false;
  step.current = clamp(step.current + amount, 0, step.target);
  state.missions.beginner.completed = false;
  if (options.save !== false) saveGame();
  if (options.render !== false) refreshMissionPage();
  return true;
}

function isBeginnerMissionReady(id) {
  const step = getBeginnerMissionStep(id);
  return Boolean(step && step.current >= step.target);
}

function getBeginnerMissionCompletedCount() {
  const beginner = getBeginnerMissionState();
  return BEGINNER_MISSION_DEFS.filter((mission) => {
    const step = beginner.steps[mission.id];
    return step && step.current >= step.target;
  }).length;
}

function getMissionChapterProgress(chapter, beginner = getBeginnerMissionState()) {
  const missions = chapter.missionIds
    .map((id) => BEGINNER_MISSION_DEFS.find((mission) => mission.id === id))
    .filter(Boolean);
  const claimedCount = missions.filter((mission) => Boolean(beginner.steps[mission.id]?.claimed)).length;
  const hasCompletingMission = missions.some((mission) => completingMissionIds.has(mission.id));
  return {
    missions,
    completed: claimedCount,
    total: missions.length,
    isComplete: missions.length > 0 && claimedCount >= missions.length && !hasCompletingMission
  };
}

function isMissionChapterUnlocked(chapterId, beginner = getBeginnerMissionState()) {
  const chapterIndex = MISSION_CHAPTERS.findIndex((chapter) => chapter.id === chapterId);
  if (chapterIndex <= 0) return chapterIndex === 0;
  return getMissionChapterProgress(MISSION_CHAPTERS[chapterIndex - 1], beginner).isComplete;
}

function syncMissionChapterUiState(beginner = getBeginnerMissionState(), options = {}) {
  state.ui = state.ui && typeof state.ui === "object" ? state.ui : {};
  const expanded = state.ui.missionChapterExpanded && typeof state.ui.missionChapterExpanded === "object"
    ? state.ui.missionChapterExpanded
    : {};
  const completion = state.ui.missionChapterCompleted && typeof state.ui.missionChapterCompleted === "object"
    ? state.ui.missionChapterCompleted
    : {};
  let changed = false;

  MISSION_CHAPTERS.forEach((chapter, index) => {
    const progress = getMissionChapterProgress(chapter, beginner);
    const unlocked = index === 0 || getMissionChapterProgress(MISSION_CHAPTERS[index - 1], beginner).isComplete;
    if (!Object.prototype.hasOwnProperty.call(expanded, chapter.id)) {
      expanded[chapter.id] = unlocked && !progress.isComplete;
      changed = true;
    }
    if (!unlocked && expanded[chapter.id]) {
      expanded[chapter.id] = false;
      changed = true;
    }
    if (completion[chapter.id] !== progress.isComplete) {
      completion[chapter.id] = progress.isComplete;
      expanded[chapter.id] = progress.isComplete ? false : unlocked;
      const nextChapter = MISSION_CHAPTERS[index + 1];
      if (progress.isComplete && nextChapter) expanded[nextChapter.id] = true;
      changed = true;
    }
  });

  state.ui.missionChapterExpanded = expanded;
  state.ui.missionChapterCompleted = completion;
  if (changed && options.save !== false) saveGame();
  return state.ui;
}

function toggleMissionChapter(chapterId) {
  const chapter = MISSION_CHAPTERS.find((item) => item.id === chapterId);
  if (!chapter) return;
  const beginner = getBeginnerMissionState();
  if (!isMissionChapterUnlocked(chapterId, beginner)) {
    showToast("完成上一章後解鎖");
    return;
  }
  const ui = syncMissionChapterUiState(beginner, { save: false });
  ui.missionChapterExpanded[chapterId] = !ui.missionChapterExpanded[chapterId];
  saveGame();
  refreshMissionPage();
}

function getConfiguredMissionReward(id, fallback = {}) {
  const configured = gameConfig?.economy?.missionRewards?.[id];
  return configured && typeof configured === "object" ? configured : fallback;
}

function getConfiguredBeginnerFinalReward() {
  const configured = gameConfig?.economy?.beginnerRewards?.final;
  return configured && typeof configured === "object" ? configured : BEGINNER_FINAL_REWARD;
}

function applyMissionReward(reward = {}) {
  if (!reward || typeof reward !== "object") return;
  state.coins = normalizedNonNegative(state.coins, 0) + normalizedNonNegative(reward.coins, 0);
  state.diamonds = normalizedNonNegative(state.diamonds, 0) + normalizedNonNegative(reward.diamonds, 0);
  state.inventory = normalizeInventory(state.inventory, createNewState().inventory);
  state.inventory.ticketsExplore = normalizedNonNegative(state.inventory.ticketsExplore, 0) + normalizedNonNegative(reward.ticketsExplore, 0);
  if (reward.items && typeof reward.items === "object") {
    state.inventory.items = state.inventory.items || {};
    Object.entries(reward.items).forEach(([itemId, count]) => {
      state.inventory.items[itemId] = normalizedNonNegative(state.inventory.items[itemId], 0) + normalizedNonNegative(count, 0);
    });
  }
}

function renderMissionRewardLabel(reward = {}) {
  const parts = [];
  if (reward.coins) parts.push(`金幣 x${formatNumber(reward.coins)}`);
  if (reward.diamonds) parts.push(`鑽石 x${formatNumber(reward.diamonds)}`);
  if (reward.ticketsExplore) parts.push(`探險券 x${formatNumber(reward.ticketsExplore)}`);
  if (reward.items?.mysteryBag) parts.push(`神秘獎勵袋 x${formatNumber(reward.items.mysteryBag)}`);
  return parts.join(" / ") || "獎勵";
}

function claimBeginnerMissionReward(id) {
  const mission = BEGINNER_MISSION_DEFS.find((item) => item.id === id);
  const step = getBeginnerMissionStep(id);
  if (!mission || !step) return;
  if (step.current < step.target) {
    showToast("任務尚未完成");
    return;
  }
  if (step.claimed) {
    showToast("獎勵已領取");
    return;
  }
  const reward = getConfiguredMissionReward(id, mission.reward);
  applyMissionReward(reward);
  step.claimed = true;
  completingMissionIds.add(id);
  saveGame();
  updateHomeV2HudResources();
  refreshMissionPage();
  showToast(`已領取：${renderMissionRewardLabel(reward)}`);
  window.setTimeout(() => {
    completingMissionIds.delete(id);
    syncMissionChapterUiState(getBeginnerMissionState(), { save: false });
    saveGame();
    refreshMissionPage();
  }, 620);
}

function claimBeginnerFinalReward() {
  const beginner = getBeginnerMissionState();
  const allReady = BEGINNER_MISSION_DEFS.every((mission) => {
    const step = beginner.steps[mission.id];
    return step.current >= step.target;
  });
  if (!allReady) {
    showToast("還有新手任務尚未完成");
    return;
  }
  if (beginner.finalClaimed) {
    showToast("總獎勵已領取");
    return;
  }
  applyMissionReward(getConfiguredBeginnerFinalReward());
  beginner.finalClaimed = true;
  beginner.completed = true;
  saveGame();
  updateHomeV2HudResources();
  refreshMissionPage();
  showToast("已領取新手任務總獎勵");
}

function checkGrowBattleReadyMission(options = {}) {
  const hasBattleReadyDragon = (state.dragons || []).some((dragon) => (
    !dragon.sold &&
    (dragon.stage !== "baby" || normalizedNonNegative(dragon.level, 1) >= 3 || normalizedNonNegative(dragon.exp, 0) >= 25 || normalizedNonNegative(dragon.power, 0) >= 15)
  ));
  if (hasBattleReadyDragon) {
    updateBeginnerMissionProgress("growBattleReady", 1, options);
  }
}

function refreshMissionPage() {
  const page = document.querySelector(".questPage");
  if (!page) return;
  const scrollTop = page.querySelector(".mission-scroll")?.scrollTop || 0;
  const worldIndex = Number(page.dataset.worldIndex) || 6;
  page.outerHTML = renderWorldQuestPage(worldIndex);
  const nextScroll = document.querySelector(".questPage .mission-scroll");
  if (nextScroll) nextScroll.scrollTop = scrollTop;
  updateHomeV2ActiveSlide();
}

function refreshExplorePage() {
  const page = document.querySelector(".explorePage");
  if (!page) return;
  page.outerHTML = renderWorldExplorePage(Number(page.dataset.worldIndex) || 5);
  updateHomeV2ActiveSlide();
}

function grantTutorialExploreTickets() {
  state.tutorial = normalizeTutorial(state.tutorial);
  if (state.tutorial.ticketsGranted) return;
  state.inventory = normalizeInventory(state.inventory, createNewState().inventory);
  const ticketGift = Math.max(0, Math.round(gameConfigNumber("economy.beginnerRewards.tutorialExploreTickets", 3)));
  state.inventory.ticketsExplore = normalizedNonNegative(state.inventory.ticketsExplore, 0) + ticketGift;
  state.tutorial.ticketsGranted = true;
  state.tutorial.beginnerQuestStarted = true;
  state.beginnerQuestStarted = true;
  saveGame();
  updateHomeV2HudResources();
  refreshExplorePage();
  showToast(`Mimi 送你 ${ticketGift} 張探險券！`);
}

function maybeShowTutorialOverlay() {
  if (!gameHasStarted || !els.homeV2Root || els.homeV2Root.hidden) return;
  state.tutorial = normalizeTutorial(state.tutorial);
  if (state.tutorial.tutorialSeen) return;
  showTutorialOverlay(state.tutorial.step);
}

function closeTutorialOverlay() {
  document.querySelector(".tutorial-overlay")?.remove();
}

function showTutorialOverlay(stepIndex = 0) {
  if (!els.homeV2Root) return;
  closeTutorialOverlay();
  const step = clamp(Number(stepIndex) || 0, 0, TUTORIAL_STEPS.length - 1);
  state.tutorial = normalizeTutorial({ ...state.tutorial, step });
  const active = TUTORIAL_STEPS[step];
  const buttonLabel = step === TUTORIAL_STEPS.length - 1 ? "完成引導" : "點擊繼續";
  els.homeV2Root.insertAdjacentHTML("beforeend", `
    <div class="tutorial-overlay" role="dialog" aria-modal="true" aria-label="新手引導">
      <div class="tutorial-card">
        <img class="tutorial-logo-mark" src="assets/ui/logo-dragon-adventure.png" alt="龍的冒險" onerror="this.hidden=true">
        <div class="tutorial-step-badge">新手引導 ${step + 1}/${TUTORIAL_STEPS.length}</div>
        <div class="tutorial-steps">
          ${TUTORIAL_STEPS.map((item, index) => `
            <div class="tutorial-step${index === step ? " is-active" : ""}">
              <span>${index + 1}</span>
              <p>${escapeHtml(index === step ? `${item.title}\n${item.body}` : item.title)}</p>
            </div>
          `).join("")}
        </div>
        <img class="tutorial-mimi" src="${ASSETS.characters.mimiFull}" alt="Mimi" onerror="this.hidden=true">
        <button class="tutorial-continue" type="button" data-v2-action="tutorial-next">${buttonLabel}</button>
      </div>
    </div>
  `);
  bindBeginnerFeatureButtons();
}

function advanceTutorial() {
  state.tutorial = normalizeTutorial(state.tutorial);
  const current = state.tutorial.step;
  if (current === 2) {
    grantTutorialExploreTickets();
  }
  if (current === 3) {
    state.tutorial.waitingFor = "explore";
    saveGame();
    closeTutorialOverlay();
    scrollHomeV2To("explore");
    showToast("請點擊探險卡片開始尋龍之旅");
    return;
  }
  if (current === 5) {
    state.tutorial.waitingFor = "incubator";
    saveGame();
    closeTutorialOverlay();
    scrollHomeV2To("dragonCave");
    updateBeginnerMissionProgress("goHatchIsland", 1, { render: false });
    return;
  }
  if (current >= TUTORIAL_STEPS.length - 1) {
    state.tutorial.tutorialSeen = true;
    state.tutorial.seen = true;
    state.tutorial.completed = true;
    state.tutorial.waitingFor = null;
    state.tutorial.step = TUTORIAL_STEPS.length - 1;
    state.tutorialSeen = true;
    state.tutorialStep = state.tutorial.step;
    saveGame();
    closeTutorialOverlay();
    showToast("新手引導完成，任務頁已開放！");
    return;
  }
  state.tutorial.step = clamp(current + 1, 0, TUTORIAL_STEPS.length - 1);
  state.tutorial.tutorialStep = state.tutorial.step;
  saveGame();
  showTutorialOverlay(state.tutorial.step);
}

function handleTutorialEvent(type) {
  state.tutorial = normalizeTutorial(state.tutorial);
  if (state.tutorial.tutorialSeen) return;
  if (type === "getEgg" && state.tutorial.step <= 4) {
    state.tutorial.step = 4;
    state.tutorial.waitingFor = null;
    saveGame();
    showTutorialOverlay(4);
    return;
  }
  if (type === "finishHatch" && state.tutorial.step <= 6) {
    state.tutorial.step = 6;
    state.tutorial.waitingFor = null;
    saveGame();
    showTutorialOverlay(6);
  }
}

function rollWeightedOption(options, valueKey) {
  const total = options.reduce((sum, item) => sum + normalizedNonNegative(item.rate, 0), 0);
  let roll = Math.random() * Math.max(1, total);
  for (const item of options) {
    roll -= normalizedNonNegative(item.rate, 0);
    if (roll <= 0) return item[valueKey];
  }
  return options[0]?.[valueKey];
}

function rollExploreEggRarity() {
  const configured = gameConfig?.gacha?.egg?.rarities || {};
  const rates = EGG_RARITY_RATES.map((entry) => ({ rarity: entry.rarity, rate: Number(configured[entry.rarity]) || 0 }));
  return rollWeightedOption(rates, "rarity") || "C";
}

function rollExploreElement(area) {
  const areaId = typeof area === "string" ? area : area?.id;
  const mainElement = typeof area === "object" && area?.mainElement ? area.mainElement : null;
  const r = Math.random();

  const lightRate = Math.max(0, Number(gameConfig?.gacha?.egg?.elements?.light) || 8) / 100;
  const darkRate = Math.max(0, Number(gameConfig?.gacha?.egg?.elements?.dark) || 8) / 100;
  if (r < lightRate) return "light";
  if (r < lightRate + darkRate) return "dark";

  if (areaId === "volcano") return "fire";
  if (areaId === "ocean") return "water";
  if (areaId === "forest") return "wood";

  return normalizeDragonElement(mainElement || "fire");
}

function getEggImageForExploreResult(rarity, element) {
  return getEggAsset({ rarity, element });
}

function getEggTypeForExploreResult(rarity, element) {
  if (element === "dark" && ["S", "SS", "SSS"].includes(rarity)) return "dark-sss-egg";
  if (["SS", "SSS"].includes(rarity)) return "legendary-egg";
  if (rarity === "S") return "epic-egg";
  if (rarity === "A") return "rare-egg";
  return "normal-egg";
}

function getHatchDurationForRarity(rarity) {
  const durations = { C: 60, B: 90, A: 120, S: 180, SS: 240, SSS: 300 };
  return Math.max(1, Math.round(gameConfigNumber("economy.defaultHatchSeconds", durations[rarity] || 60)));
}

function createExplorationEgg(area) {
  const rarity = rollExploreEggRarity();
  const element = rollExploreElement(area);
  const type = getEggTypeForExploreResult(rarity, element);
  const candidates = contentCatalog.eggs.filter((item) => (
    normalizeEggElement(item) === element && String(item.rarity || "C").toUpperCase() === rarity
  ));
  const template = randomItem(candidates.filter((item) => !item.legacy)) || randomItem(candidates) || null;
  return normalizeInventoryEgg({
    id: createId("egg"),
    type,
    name: template?.name || `${dragonElementText(element)}屬性 ${rarity} 級龍蛋`,
    element,
    elementHint: element,
    attribute: element,
    rarity,
    eggRarity: rarity,
    elementBias: element,
    hatchDuration: getHatchDurationForRarity(rarity),
    image: getEggImageForExploreResult(rarity, element),
    rarityRates: [{ rarity, rate: 100 }],
    templateId: template?.id || null,
    dragonTemplateId: template?.dragonTemplateId || null,
    assetRoot: template?.assetRoot || null,
    animationFrames: template?.actions || {},
    iconAsset: template?.iconAsset || null,
    createdAt: Date.now()
  });
}

function startExplore(areaId) {
  const area = EXPLORE_AREAS.find((item) => item.id === areaId);
  if (!area) return;
  beginExploreDraw(area);
}

function closeExploreReveal() {
  document.querySelector(".explore-reveal-backdrop")?.remove();
  currentGachaResult = null;
}

function beginExploreDraw(area) {
  state.inventory = normalizeInventory(state.inventory, createNewState().inventory);
  const tickets = normalizedNonNegative(state.inventory.ticketsExplore, 0);
  const ticketCost = getConfiguredExploreTicketCost(area);
  if (tickets < ticketCost) {
    showToast("探險券不足");
    return false;
  }

  state.inventory.ticketsExplore = tickets - ticketCost;
  const egg = createExplorationEgg(area);
  syncPersistentAliases();
  saveGame();
  refreshExplorePage();
  updateHomeV2HudResources();
  showExploreReveal(egg, area);
  return true;
}

function showExploreReveal(egg, area) {
  if (!els.homeV2Root) return;
  closeExploreReveal();
  const element = normalizeDragonElement(egg.element || egg.elementHint || egg.elementBias);
  const isRareElement = element === "light" || element === "dark";
  const elementText = dragonElementText(element);
  const rarity = String(egg.rarity || "C").toLowerCase();

  currentGachaResult = {
    egg,
    area,
    areaId: area.id,
    claimed: false
  };

  els.homeV2Root.insertAdjacentHTML("beforeend", `
    <div class="explore-reveal-backdrop" role="dialog" aria-modal="true" aria-label="獲得龍蛋">
      <section class="explore-reveal-card gacha-result-card rarity-${escapeHtml(rarity)}${isRareElement ? " is-rare-element" : ""}">
        <div class="gacha-flash" aria-hidden="true"></div>
        <div class="explore-reveal-glow" aria-hidden="true"></div>
        <p class="explore-reveal-phase">龍蛋出現！</p>
        <p class="explore-reveal-area">${escapeHtml(area.name)}探索成功！</p>
        <img class="explore-reveal-egg gacha-result-egg" src="${homeV2EggImage(egg)}" alt="${escapeHtml(egg.name)}" onerror="this.src='assets/eggs/placeholder-egg.png'">
        <div class="gacha-result-text" hidden>
          ${isRareElement ? `<p class="explore-reveal-rare">稀有氣息出現！</p>` : ""}
          <h2>獲得龍蛋！</h2>
          <p>獲得：${escapeHtml(elementText)}屬性 ${escapeHtml(egg.rarity)} 級龍蛋</p>
        </div>
        <div class="explore-reveal-actions gacha-result-actions">
          <button class="gacha-result-btn primary" type="button" data-v2-action="claim-explore-egg">獲得龍蛋</button>
          <button class="gacha-result-btn secondary" type="button" data-v2-action="draw-explore-again">繼續抽獎</button>
        </div>
      </section>
    </div>
  `);
  bindBeginnerFeatureButtons();

  window.setTimeout(() => {
    document.querySelector(".gacha-result-egg")?.classList.add("charging");
  }, 500);

  window.setTimeout(() => {
    const card = document.querySelector(".gacha-result-card");
    const eggImage = document.querySelector(".gacha-result-egg");
    eggImage?.classList.remove("charging");
    card?.classList.add("is-revealed");
    card?.querySelector(".gacha-flash")?.classList.add("is-active");
    const resultText = card?.querySelector(".gacha-result-text");
    if (resultText) resultText.hidden = false;
  }, 1500);
}

function claimExploreEggResult({ closeOverlay = true } = {}) {
  if (!currentGachaResult || currentGachaResult.claimed) return false;
  currentGachaResult.claimed = true;
  document.querySelectorAll(".gacha-result-btn").forEach((button) => {
    button.disabled = true;
  });
  const egg = currentGachaResult.egg;

  state.eggInventory = Array.isArray(state.eggInventory) ? state.eggInventory : [];
  state.eggInventory.push(egg);
  state.eggs = state.eggInventory;
  updateBeginnerMissionProgress("getEgg", 1, { save: false, render: false });
  syncPersistentAliases();
  saveGame();
  refreshExplorePage();
  refreshMissionPage();
  updateHomeV2HudResources();
  handleTutorialEvent("getEgg");

  if (closeOverlay) closeExploreReveal();
  return true;
}

function drawExploreAgain() {
  if (!currentGachaResult) return;
  const area = currentGachaResult.area || EXPLORE_AREAS.find((item) => item.id === currentGachaResult.areaId);
  if (!claimExploreEggResult({ closeOverlay: false })) return;
  if (!area) {
    closeExploreReveal();
    return;
  }

  state.inventory = normalizeInventory(state.inventory, createNewState().inventory);
  const tickets = normalizedNonNegative(state.inventory.ticketsExplore, 0);
  if (tickets < getConfiguredExploreTicketCost(area)) {
    showToast("探險券不足");
    closeExploreReveal();
    return;
  }

  beginExploreDraw(area);
}

function renderExploreMissionStrip() {
  const step = getBeginnerMissionStep("getEgg");
  const current = step?.current || 0;
  const target = step?.target || 1;
  return `
    <section class="explore-mission-strip">
      <b>新手任務：使用探險券，取得你的第一顆龍蛋</b>
      <div class="mission-strip-progress"><i style="width:${clamp((current / target) * 100, 0, 100)}%"></i></div>
      <span>${current} / ${target}</span>
    </section>
  `;
}

function renderWorldExplorePage(index) {
  state.inventory = normalizeInventory(state.inventory, createNewState().inventory);
  const ticketCount = normalizedNonNegative(state.inventory.ticketsExplore, 0);
  return `
    <section class="worldPage explorePage" data-world-index="${index}" aria-label="探險">
      <div class="explore-page-shell">
        <section class="explore-hero">
          <div>
            <h1>探險</h1>
            <p>使用探險券前往火山、海洋與森林取得龍蛋。偶爾，也可能遇見稀有的光屬性或暗屬性龍蛋。</p>
          </div>
          <img src="${ASSETS.characters.mimiGuide || ASSETS.characters.mimiFull}" alt="Mimi" onerror="this.hidden=true">
        </section>
        <div class="explore-ticket-pill">
          <img src="${ASSETS.explore.ticket}" alt="" onerror="this.hidden=true">
          探險券 ${formatNumber(ticketCount)}
        </div>
        ${renderExploreMissionStrip()}
        <div class="explore-area-grid">
          ${EXPLORE_AREAS.map((area) => `
            <article class="explore-area-card explore-${area.id}" aria-label="${escapeHtml(area.name)}" style="background-image:url('${escapeHtml(area.bg)}')">
              <div class="explore-card-icon" aria-hidden="true">
                <img src="${area.icon}" alt="" onerror="this.hidden=true">
                <span>${escapeHtml(dragonElementText(area.mainElement))}</span>
              </div>
              <div class="explore-card-content">
                <h2>${escapeHtml(area.name)}</h2>
                <p>${escapeHtml(area.description)}</p>
                <span>消耗探險券 x${getConfiguredExploreTicketCost(area)}</span>
              </div>
              <button class="explore-start-btn" type="button" data-v2-action="start-explore" data-area-id="${area.id}">開始探險</button>
            </article>
          `).join("")}
        </div>
      </div>
    </section>
  `;
}

function renderWorldQuestPage(index) {
  const beginner = getBeginnerMissionState();
  const missionUi = syncMissionChapterUiState(beginner);
  const completedCount = getBeginnerMissionCompletedCount();
  const allReady = completedCount >= BEGINNER_MISSION_DEFS.length;
  const chaptersHtml = MISSION_CHAPTERS.map((chapter) => {
    const progress = getMissionChapterProgress(chapter, beginner);
    const unlocked = isMissionChapterUnlocked(chapter.id, beginner);
    const expanded = unlocked && Boolean(missionUi.missionChapterExpanded[chapter.id]);
    const chapterStatus = !unlocked
      ? "完成上一章後解鎖"
      : progress.isComplete
        ? "✓ 已完成"
        : "進行中";
    const missionsHtml = progress.missions.map((mission) => {
      const missionIndex = BEGINNER_MISSION_DEFS.findIndex((item) => item.id === mission.id) + 1;
      const step = beginner.steps[mission.id];
      const target = step?.target || mission.target;
      const current = step?.current || 0;
      const percent = clamp((current / target) * 100, 0, 100);
      const ready = percent >= 100;
      const claimed = Boolean(step?.claimed);
      const completing = completingMissionIds.has(mission.id);

      if (claimed && !completing) {
        return `
          <article class="mission-item mission-row is-completed" data-mission-id="${mission.id}">
            <span class="mission-complete-check" aria-hidden="true">✓</span>
            <div class="mission-complete-copy">
              <h3>${escapeHtml(mission.title)}</h3>
              <small>已完成</small>
            </div>
          </article>
        `;
      }

      return `
        <article class="mission-item mission-row${ready ? " is-ready" : ""}${completing ? " is-completing" : ""}" data-mission-id="${mission.id}">
          <span class="mission-index">${missionIndex}</span>
          <div class="mission-row-main">
            <h3>${escapeHtml(mission.title)}</h3>
            <div class="mission-row-progress"><i style="width:${percent}%"></i></div>
            <small>${current}/${target}</small>
          </div>
          <div class="mission-reward">${renderMissionRewardLabel(getConfiguredMissionReward(mission.id, mission.reward))}</div>
          <button type="button" data-v2-action="claim-mission" data-mission-id="${mission.id}" ${!ready || claimed ? "disabled" : ""}>${claimed ? "已完成" : ready ? "領取" : "進行中"}</button>
        </article>
      `;
    }).join("");

    return `
      <section class="mission-chapter${expanded ? " is-expanded" : ""}${progress.isComplete ? " is-complete" : ""}${!unlocked ? " is-locked" : ""}" data-chapter-id="${chapter.id}">
        <button class="mission-chapter-header" type="button" data-v2-action="toggle-mission-chapter" data-chapter-id="${chapter.id}" aria-expanded="${expanded}" aria-disabled="${!unlocked}">
          <span class="mission-chapter-heading">
            <span class="mission-chapter-title">${escapeHtml(chapter.title)}</span>
            <b>${escapeHtml(chapter.subtitle)}</b>
          </span>
          <span class="mission-chapter-meta">
            <span>${progress.completed}/${progress.total}</span>
            <small>${chapterStatus}</small>
          </span>
          <span class="mission-chapter-toggle" aria-hidden="true">${unlocked ? "⌄" : "🔒"}</span>
        </button>
        ${expanded ? `<div class="mission-chapter-body"><div class="mission-list">${missionsHtml}</div></div>` : ""}
      </section>
    `;
  }).join("");

  return `
    <section class="worldPage questPage" data-world-index="${index}" aria-label="任務">
      <div class="quest-page-shell mission-scroll">
        <section class="mission-hero">
          <div class="mission-hero-copy">
            <h1>任務</h1>
            <p>完成任務，陪伴龍寶寶一步步成長吧！<br>Mimi 會一直在你身邊幫助你喔～</p>
          </div>
          <img class="mission-hero-mimi" src="${ASSETS.characters.mimiGuide || ASSETS.characters.mimiFull}" alt="Mimi" onerror="this.hidden=true">
        </section>
        <section class="quest-main-card">
          <header>
            <div>
              <b>新手任務</b>
            </div>
            <span>${completedCount}/${BEGINNER_MISSION_DEFS.length} 完成</span>
          </header>
          <div class="quest-overall-progress"><i style="width:${clamp((completedCount / BEGINNER_MISSION_DEFS.length) * 100, 0, 100)}%"></i></div>
          <div class="mission-chapters">${chaptersHtml}</div>
        </section>
        <section class="quest-final-reward">
          <div>
            <b>完成新手任務可獲得</b>
            <p>${renderMissionRewardLabel(getConfiguredBeginnerFinalReward())}</p>
          </div>
          <button type="button" data-v2-action="claim-final-mission" ${!allReady || beginner.finalClaimed ? "disabled" : ""}>${beginner.finalClaimed ? "已領取" : allReady ? "領取總獎勵" : "進行中"}</button>
        </section>
      </div>
    </section>
  `;
}

function getWorldPages() {
  return [
    { id: "home", label: "家", title: "休息島", icon: "家", assetKey: "navHome", className: "homePage", render: renderWorldHomePage },
    { id: "dragonHouse", label: "龍舍", title: "龍舍", icon: "龍", assetKey: "navDragonHouse", className: "dragonHousePage", render: renderWorldDragonHousePage },
    { id: "dragonCave", label: "孵蛋島", title: "孵蛋島", icon: "蛋", assetKey: "navDragonCave", className: "dragonCavePage", render: renderWorldDragonCavePage },
    { id: "equipment", label: "裝備店", title: "裝備店", icon: "裝", assetKey: "navEquipmentShop", className: "equipmentShopPage", render: renderWorldEquipmentShopPage },
    { id: "items", label: "道具店", title: "道具店", icon: "物", assetKey: "navItemShop", className: "itemShopPage", render: (index) => renderWorldPlaceholderPage(index, "itemShopPage", "道具店", "探險券、恢復藥、食物與孵化道具之後會放在這裡。", [
      ["探險券", "用來前往探索取得龍蛋"],
      ["恢復藥", "戰鬥後恢復狀態"],
      ["龍果實", "餵食龍寶寶"],
      ["孵化沙漏", "縮短孵化時間"]
    ]) },
    { id: "explore", label: "探險", title: "探險", icon: "探", assetKey: "navExplore", className: "explorePage", render: renderWorldExplorePage },
    { id: "adventurerGuild", label: "冒險者工會", title: "冒險者工會", icon: "會", assetKey: "navAdventurerGuild", className: "adventurerGuildPage", render: renderWorldAdventurerGuildPage },
    { id: "quest", label: "任務", title: "任務", icon: "任", assetKey: "navQuest", className: "questPage", render: renderWorldQuestPage }
  ];
}

function goToWorldPage(index) {
  console.log("[goToWorldPage]", index);
  const pager = document.getElementById("worldPager");
  if (!pager) return;
  const pageWidth = pager.clientWidth;
  const pageCount = pager.children.length || 1;
  const previousPageId = getWorldPages()[currentWorldPage]?.id;
  const targetIndex = clamp(Number(index) || 0, 0, pageCount - 1);
  currentWorldPage = targetIndex;
  const pageId = getWorldPages()[targetIndex]?.id;
  if (pageId && previousPageId && pageId !== previousPageId && getBulkManageState().type) {
    exitBulkManage({ refresh: false });
  }
  if (pageId && pageId !== "adventurerGuild" && document.querySelector(".adventurer-detail-backdrop")) {
    closeAdventurerDetail();
  }
  if (pageId) {
    applyActivePageConfig(targetIndex);
    if (mimiPageIntroTimer) {
      clearTimeout(mimiPageIntroTimer);
      mimiPageIntroTimer = null;
    }
    if (mimiProgrammaticPageTimer) clearTimeout(mimiProgrammaticPageTimer);
    mimiProgrammaticPageId = pageId;
    showMimiPageIntro(pageId);
    mimiProgrammaticPageTimer = window.setTimeout(() => {
      mimiProgrammaticPageId = null;
      mimiProgrammaticPageTimer = null;
    }, 1400);
  }
  if (pageId === "dragonCave") {
    updateBeginnerMissionProgress("goHatchIsland", 1, { render: false });
  }
  pager.scrollTo({
    left: pageWidth * targetIndex,
    behavior: "smooth"
  });
  window.setTimeout(updateHomeV2ActiveSlide, 180);
}

function hatchEggToDragon(egg) {
  const normalizedEgg = normalizeInventoryEgg(egg);
  const definition = HATCH_EGG_DEFINITIONS[normalizedEgg.type] || HATCH_EGG_DEFINITIONS["normal-egg"];
  const rates = Array.isArray(normalizedEgg.rarityRates) && normalizedEgg.rarityRates.length > 0
    ? normalizedEgg.rarityRates
    : definition.rarityRates;
  const rarity = rollWeightedHatchRarity(rates);
  const element = normalizeDragonElement(pickHatchElement(normalizedEgg.elementBias || definition.elementBias));
  const stage = "baby";
  const template = findDragonCatalogTemplate({
    templateId: normalizedEgg.dragonTemplateId,
    element,
    rarity,
    stage
  });
  const dragon = {
    id: createId("dragon"),
    name: template?.name || generateDragonName(rarity, dragonElementText(element)),
    rarity,
    element,
    stage,
    level: 1,
    templateId: template?.id || null,
    speciesId: template?.speciesId || null,
    hp: positiveNumber(template?.hp, calculateHatchDragonStat(rarity, 88, 28)),
    attack: positiveNumber(template?.atk || template?.attack, calculateHatchDragonStat(rarity, 24, 11)),
    defense: positiveNumber(template?.def || template?.defense, calculateHatchDragonStat(rarity, 18, 8)),
    speed: positiveNumber(template?.speed, calculateHatchDragonStat(rarity, 14, 7)),
    hunger: 100,
    mood: 90,
    exp: 0,
    power: Math.round((rarityPower[rarity] || 1) * 12),
    isInTeam: false,
    isOnRestIsland: false,
    currentAction: "idle",
    assetBase: template?.assetRoot || normalizeDragonAssetBase(null, element, stage),
    assetRoot: template?.assetRoot || normalizeDragonAssetBase(null, element, stage),
    avatarAsset: template?.portraitAsset || template?.iconAsset || null,
    animationFrames: template?.actions || {},
    growth: template?.growth || {},
    nextEvolution: template?.nextEvolution || null,
    evolution: template?.evolution || null,
    skills: template?.skills || [],
    talents: template?.talents || [],
    tags: template?.tags || [],
    variant: template?.variant || "normal",
    glow: Boolean(template?.glow),
    boss: Boolean(template?.boss),
    mythical: Boolean(template?.mythical),
    costumeId: null,
    skinId: null,
    isAngry: false,
    angryUntil: null,
    lockActionUntil: null,
    lastInteractedAt: null
  };
  dragon.image = getDragonAsset(dragon);
  return dragon;
}

function startHatchingEgg(slotId, eggId) {
  const slot = findHatchSlot(slotId);
  const eggs = Array.isArray(state.eggInventory) ? state.eggInventory : [];
  const eggIndex = eggs.findIndex((egg) => egg.id === eggId);
  if (!slot || !slot.unlocked || slot.currentEgg || slot.status === "locked") return;
  if (eggIndex < 0) {
    showToast("找不到這顆龍蛋");
    return;
  }

  const egg = normalizeInventoryEgg(eggs[eggIndex]);
  const alreadyAssigned = Boolean(egg.assignedIncubatorId) || (state.hatchIsland?.hatchSlots || [])
    .some((item) => item?.id !== slot.id && (item?.currentEggId === egg.id || item?.currentEgg?.id === egg.id));
  if (alreadyAssigned) {
    showToast("這顆龍蛋已經在孵化器中");
    closeEggSelectionModal();
    return;
  }
  const now = Date.now();
  egg.assignedIncubatorId = slot.id;
  egg.startedAt = now;
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
  updateBeginnerMissionProgress("putInIncubator", 1, { save: false, render: false });

  syncPersistentAliases();
  saveGame();
  closeEggSelectionModal();
  replaceHatchSlotDom(slot.id);
  updateHatchIslandOverviewDom();
  refreshMissionPage();
  showToast(`${egg.name} 已放入孵化器`);
}

function claimHatchedDragon(slotId) {
  const slot = findHatchSlot(slotId);
  if (!slot?.currentEgg) return;
  const status = getHatchSlotStatus(slot);
  if (!status.ready) {
    showToast("龍蛋還在孵化中");
    return;
  }

  const egg = slot.currentEgg;
  const dragon = hatchEggToDragon(egg);
  if (!addDragonToPlayer(dragon, { save: false })) {
    return;
  }

  state.activeDragonId = state.activeDragonId || dragon.id;
  state.totalHatched = normalizedNonNegative(state.totalHatched, 0) + 1;
  updateHighestRarity(dragon.rarity);
  updateBeginnerMissionProgress("finishHatch", 1, { save: false, render: false });
  checkGrowBattleReadyMission({ save: false, render: false });
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
  refreshDragonHousePage();
  refreshMissionPage();
  handleTutorialEvent("finishHatch");
  showToast(`孵化成功：${dragon.rarity} ${dragon.name}`);
}

function feedRestDragon(dragonId) {
  const dragon = getDragonById(dragonId);
  if (!dragon) return;
  closeRestDragonActionSheet();
  dragon.hunger = Math.min(100, normalizedNonNegative(dragon.hunger, 80) + 10);
  dragon.mood = Math.min(100, normalizedNonNegative(dragon.mood, 80) + 5);
  dragon.exp = normalizedNonNegative(dragon.exp, 0) + gameConfigNumber("economy.feedExp", 5);
  updateBeginnerMissionProgress("feedOnce", 1, { save: false, render: false });
  checkGrowBattleReadyMission({ save: false, render: false });
  setDragonTemporaryAction(dragon, "eat");
  refreshMissionPage();
  showToast("已餵食，龍看起來更有精神了！");
}

function trainRestDragon(dragonId) {
  const dragon = getDragonById(dragonId);
  if (!dragon) return;
  closeRestDragonActionSheet();
  dragon.exp = normalizedNonNegative(dragon.exp, 0) + gameConfigNumber("economy.trainExp", 20);
  dragon.power = normalizedNonNegative(dragon.power, 10) + 5;
  dragon.hunger = Math.max(0, normalizedNonNegative(dragon.hunger, 80) - 10);
  dragon.mood = Math.max(0, normalizedNonNegative(dragon.mood, 80) - 5);
  updateBeginnerMissionProgress("trainOnce", 1, { save: false, render: false });
  checkGrowBattleReadyMission({ save: false, render: false });
  setDragonTemporaryAction(dragon, "train");
  refreshMissionPage();
  showToast("訓練完成，戰力提升！");
}

function handleHomeV2Click(event) {
  if (event.target.matches("[data-v2-backdrop='dragon-evolution']")) {
    event.preventDefault();
    event.stopPropagation();
    closeDragonEvolution();
    return;
  }
  const evolutionButton = event.target.closest("[data-v2-action='open-dragon-evolution'], [data-v2-action='close-dragon-evolution'], [data-v2-action='confirm-dragon-evolution']");
  if (evolutionButton) {
    event.preventDefault();
    event.stopPropagation();
    const evolutionAction = evolutionButton.dataset.v2Action;
    if (evolutionAction === "open-dragon-evolution") {
      closeDragonHouseDetail();
      openDragonEvolution(evolutionButton.dataset.dragonId);
    } else if (evolutionAction === "close-dragon-evolution") {
      closeDragonEvolution();
    } else {
      confirmDragonEvolution(evolutionButton.dataset.dragonId);
    }
    return;
  }
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
  if (event.target.matches("[data-v2-backdrop='rest-dragon-menu']")) {
    event.preventDefault();
    event.stopPropagation();
    closeRestDragonActionSheet();
    return;
  }
  if (event.target.matches("[data-v2-backdrop='dragon-info']")) {
    event.preventDefault();
    event.stopPropagation();
    closeDragonInfoModal();
    return;
  }
  if (event.target.matches("[data-v2-backdrop='team-editor']")) {
    event.preventDefault();
    event.stopPropagation();
    closeTeamModal();
    return;
  }
  if (event.target.matches("[data-v2-backdrop='dragon-sell']")) {
    event.preventDefault();
    event.stopPropagation();
    closeSellDragonConfirm();
    return;
  }
  if (event.target.matches("[data-v2-backdrop='dragon-house-detail']")) {
    event.preventDefault();
    event.stopPropagation();
    closeDragonHouseDetail();
    return;
  }
  if (event.target.matches("[data-v2-backdrop='dragon-rename']")) {
    event.preventDefault();
    event.stopPropagation();
    closeDragonRenameModal();
    return;
  }

  const actionButton = event.target.closest("[data-v2-action]");
  if (actionButton) {
    event.preventDefault();
    event.stopPropagation();
    const action = actionButton.dataset.v2Action;
    const dragonId = actionButton.dataset.dragonId;

    if (action === "tutorial-next") {
      advanceTutorial();
      return;
    }
    if (action === "start-explore") {
      startExplore(actionButton.dataset.areaId);
      return;
    }
    if (action === "claim-explore-egg") {
      claimExploreEggResult({ closeOverlay: true });
      return;
    }
    if (action === "draw-explore-again") {
      drawExploreAgain();
      return;
    }
    if (action === "claim-mission") {
      claimBeginnerMissionReward(actionButton.dataset.missionId);
      return;
    }
    if (action === "claim-final-mission") {
      claimBeginnerFinalReward();
      return;
    }
    if (action === "toggle-mission-chapter") {
      toggleMissionChapter(actionButton.dataset.chapterId);
      return;
    }
    if (action === "settings") {
      toggleDebugPanel();
      return;
    }
    if (action === "resource-plus") {
      showToast("資源補充功能之後開放");
      return;
    }
    if (action === "buy-dragon-house-rows") {
      buyDragonHouseRows();
      return;
    }
    if (action === "open-dragon-house-detail") {
      openDragonHouseDetail(dragonId);
      return;
    }
    if (action === "close-dragon-house-detail") {
      closeDragonHouseDetail();
      return;
    }
    if (action === "send-dragon-home") {
      sendDragonHome(dragonId);
      return;
    }
    if (action === "open-dragon-rename") {
      openDragonRenameModal(dragonId);
      return;
    }
    if (action === "close-dragon-rename") {
      closeDragonRenameModal();
      return;
    }
    if (action === "confirm-dragon-rename") {
      confirmDragonRename(dragonId);
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
      handleRestDragonClick(dragonId);
      return;
    }
    if (action === "close-rest-dragon-panel") {
      closeRestDragonStatusPanel();
      return;
    }
    if (action === "close-rest-dragon-menu") {
      closeRestDragonActionSheet();
      return;
    }
    if (action === "feed-dragon") {
      feedRestDragon(dragonId);
      refreshDragonHousePage();
      return;
    }
    if (action === "train-dragon") {
      trainRestDragon(dragonId);
      refreshDragonHousePage();
      return;
    }
    if (action === "show-dragon-info") {
      closeDragonHouseDetail();
      openDragonInfoModal(dragonId);
      return;
    }
    if (action === "open-team-modal") {
      closeDragonHouseDetail();
      openTeamModal(dragonId);
      return;
    }
    if (action === "open-sell-dragon") {
      closeDragonHouseDetail();
      openSellDragonConfirm(dragonId);
      return;
    }
    if (action === "close-sell-dragon") {
      closeSellDragonConfirm();
      return;
    }
    if (action === "confirm-sell-dragon") {
      confirmSellDragon(dragonId);
      return;
    }
    if (action === "send-dragon-back-to-house" || action === "backToHouse") {
      sendDragonBackToHouse(dragonId || selectedRestDragonId || state.selectedRestDragonId);
      return;
    }
    if (action === "trade-dragon-placeholder") {
      showToast("交易功能開發中");
      return;
    }
    if (action === "close-dragon-info") {
      closeDragonInfoModal();
      return;
    }
    if (action === "close-team-modal") {
      closeTeamModal();
      return;
    }
    if (action === "add-to-team") {
      addDragonToTeam(dragonId);
      return;
    }
    if (action === "remove-from-team") {
      closeDragonHouseDetail();
      removeDragonFromTeam(dragonId);
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
    if (Number(pageButton.dataset.page) !== 0) closeRestDragonStatusPanel(false);
    goToWorldPage(Number(pageButton.dataset.page));
    return;
  }

  const navButton = event.target.closest("[data-world-page]");
  if (navButton) {
    event.preventDefault();
    event.stopPropagation();
    if (Number(navButton.dataset.worldPage) !== 0) closeRestDragonStatusPanel(false);
    goToWorldPage(Number(navButton.dataset.worldPage));
  }
}
