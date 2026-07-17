import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const adventurerRoot = path.join(root, "assets", "adventurers");
const legacyRoot = path.join(adventurerRoot, "_legacy");
const rarities = ["c", "b", "a", "s", "ss", "sss"];
const elements = ["fire", "water", "wood", "light", "dark"];
const exclusiveSkillCount = { C: 0, B: 0, A: 0, S: 1, SS: 2, SSS: 3 };
const frameCounts = {
  idle: 6,
  walk: 8,
  attack: 6,
  hurt: 4,
  victory: 6,
  defeated: 4,
  "skill-01": 8,
  "skill-02": 10,
  "skill-03": 12
};

const elementSkills = {
  fire: [
    ["炎龍拳", "對單一敵人造成火屬性傷害。", 160, 3],
    ["龍炎爆發", "對全體敵人造成火屬性傷害。", 220, 5],
    ["真龍覺醒", "生命偏低時提升攻擊力。", 0, 0]
  ],
  water: [
    ["寒潮衝擊", "以寒潮對單一敵人造成水屬性傷害。", 160, 3],
    ["冰海風暴", "召喚冰海風暴攻擊全體敵人。", 220, 5],
    ["深海祝福", "提升隊伍的防禦與恢復能力。", 0, 0]
  ],
  wood: [
    ["森靈箭", "凝聚森林之力攻擊單一敵人。", 160, 3],
    ["萬木共鳴", "以藤蔓與飛葉攻擊全體敵人。", 220, 5],
    ["生命循環", "回合開始時有機會恢復生命。", 0, 0]
  ],
  light: [
    ["聖光裁決", "以聖光攻擊單一敵人。", 160, 3],
    ["星耀審判", "以星光攻擊全體敵人。", 220, 5],
    ["光之守護", "生命偏低時獲得光之護盾。", 0, 0]
  ],
  dark: [
    ["暗影突襲", "從暗影中攻擊單一敵人。", 160, 3],
    ["深淵降臨", "召喚深淵之力攻擊全體敵人。", 220, 5],
    ["黑月契約", "戰鬥中提升暴擊與速度。", 0, 0]
  ]
};

const rarityGrowth = {
  C: { base: [82, 18, 13, 13], perLevel: [7, 1.8, 1.2, 0.7] },
  B: { base: [92, 22, 15, 14], perLevel: [8, 2.2, 1.4, 0.75] },
  A: { base: [104, 27, 17, 16], perLevel: [9, 2.8, 1.8, 0.85] },
  S: { base: [116, 32, 20, 18], perLevel: [10, 3.4, 2.1, 0.95] },
  SS: { base: [130, 38, 24, 20], perLevel: [11, 4, 2.5, 1.05] },
  SSS: { base: [146, 45, 28, 23], perLevel: [12, 4.6, 2.9, 1.15] }
};

const characters = [
  {
    id: "c-fire-0001",
    name: "新手劍士",
    rarity: "C",
    element: "fire",
    job: "劍士",
    description: "踏上冒險旅程的年輕劍士。",
    card: "cards/newbie-swordman-c-fire.png",
    sprite: "newbie-swordman-c-fire"
  },
  {
    id: "c-wood-0001",
    name: "見習弓手",
    rarity: "C",
    element: "wood",
    job: "弓手",
    description: "在森林中練習弓術的見習冒險者。",
    card: "cards/apprentice-archer-c-wood.png",
    sprite: "apprentice-archer-c-wood"
  },
  {
    id: "b-fire-0001",
    name: "烈焰拳士",
    rarity: "B",
    element: "fire",
    job: "拳士",
    description: "以熱血拳法戰鬥的火屬性冒險者。",
    card: "cards/flame-fist-b-fire.png",
    sprite: "flame-fist-b-fire"
  },
  {
    id: "b-water-0001",
    name: "水靈法師",
    rarity: "B",
    element: "water",
    job: "法師",
    description: "能操縱水流的年輕法師。",
    card: "cards/aqua-mage-b-water.png",
    sprite: "aqua-mage-b-water"
  },
  {
    id: "a-wood-0001",
    name: "森林刺客",
    rarity: "A",
    element: "wood",
    job: "刺客",
    description: "穿梭林間、行動敏捷的刺客。",
    card: "cards/forest-assassin-a-wood.png",
    sprite: "forest-assassin-a-wood"
  },
  {
    id: "a-light-0001",
    name: "光之牧師",
    rarity: "A",
    element: "light",
    job: "牧師",
    description: "以柔和聖光守護同伴的牧師。",
    card: "cards/light-pastor-a-light.png",
    sprite: "light-pastor-a-light"
  },
  {
    id: "s-fire-0001",
    name: "赤焰騎士",
    rarity: "S",
    element: "fire",
    job: "騎士",
    description: "身披赤焰、勇往直前的騎士。",
    card: "cards/crimson-knight-s-fire.png",
    sprite: "crimson-knight-s-fire"
  },
  {
    id: "s-water-0001",
    name: "蒼藍術士",
    rarity: "S",
    element: "water",
    job: "術士",
    description: "精通潮汐與冰霜法術的術士。",
    card: "cards/azure-sorcerer-s-water.png",
    sprite: "azure-sorcerer-s-water"
  },
  {
    id: "ss-fire-0001",
    name: "蘿莉菈",
    rarity: "SS",
    element: "fire",
    job: "炎舞劍姬",
    description: "以烈焰劍舞席捲戰場的少女。",
    card: "cards/crimson-knight-s-fire.png",
    sprite: "crimson-knight-s-fire"
  },
  {
    id: "ss-wood-0001",
    name: "達西德",
    rarity: "SS",
    element: "wood",
    job: "森林守護者",
    description: "與森林猛禽締結契約的守護者。",
    card: "cards/ChatGPT Image 2026年7月16日 下午04_42_41.png",
    sprite: "forest-assassin-a-wood"
  },
  {
    id: "ss-light-0001",
    name: "聖光守護者",
    rarity: "SS",
    element: "light",
    job: "守護者",
    description: "以聖盾守護隊伍的光之戰士。",
    card: "cards/holy-guardian-ss-light.png",
    sprite: "holy-guardian-ss-light"
  },
  {
    id: "ss-dark-0001",
    name: "暗獵",
    rarity: "SS",
    element: "dark",
    job: "獵人",
    description: "追蹤深淵魔物的暗影獵人。",
    card: "cards/shadow-hunter-ss-dark.png",
    sprite: "shadow-hunter-ss-dark"
  },
  {
    id: "sss-fire-0001",
    name: "阿龍",
    rarity: "SSS",
    element: "fire",
    job: "龍裔戰士",
    description: "擁有火龍血脈的少年戰士。",
    card: "cards/alon-sss-fire.png",
    sprite: "alon-sss-fire"
  },
  {
    id: "sss-water-0001",
    name: "米卡斯",
    rarity: "SSS",
    element: "water",
    job: "冰龍巫女",
    description: "與冰龍共同守護雪境的巫女。",
    card: "cards/S__83836945_0.jpg",
    sprite: "aqua-mage-b-water"
  },
  {
    id: "sss-wood-0001",
    name: "卡蘿娜",
    rarity: "SSS",
    element: "wood",
    job: "森語神射手",
    description: "與翼蛇同行的森林精靈神射手。",
    card: "cards/S__83836948_0.jpg",
    sprite: "forest-assassin-a-wood"
  },
  {
    id: "sss-light-0001",
    name: "米克羅",
    rarity: "SSS",
    element: "light",
    job: "星龍領主",
    description: "承載星光與龍之祝福的領主。",
    card: "cards/star-dragonlord-sss-light.png",
    sprite: "star-dragonlord-sss-light"
  },
  {
    id: "sss-dark-0001",
    name: "黑曜龍巫",
    rarity: "SSS",
    element: "dark",
    job: "深淵龍巫",
    description: "能與黑曜魔龍共鳴的神秘術士。",
    card: "cards/shadow-hunter-ss-dark.png",
    sprite: "shadow-hunter-ss-dark"
  }
];

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function copyOrFallback(source, fallback, destination) {
  const selected = await exists(source) ? source : fallback;
  await fs.mkdir(path.dirname(destination), { recursive: true });
  await fs.copyFile(selected, destination);
}

function createSkills(character) {
  const count = exclusiveSkillCount[character.rarity] || 0;
  return Array.from({ length: count }, (_, index) => {
    const number = index + 1;
    const [name, description, power, cooldown] = elementSkills[character.element][index];
    return {
      id: `skill-${String(number).padStart(2, "0")}`,
      name,
      type: number === 3 ? "passive" : "active",
      element: character.element,
      description,
      ...(power ? { power } : {}),
      ...(cooldown ? { cooldown } : {}),
      unlockLevel: number === 1 ? 1 : number === 2 ? 20 : 40,
      animation: `sprites/skill-${String(number).padStart(2, "0")}`,
      effect: `effects/skill-${String(number).padStart(2, "0")}-effect.png`
    };
  });
}

function createAnimations(skillCount) {
  const actions = ["idle", "walk", "attack", "hurt", "victory", "defeated"];
  for (let index = 1; index <= skillCount; index += 1) {
    actions.push(`skill-${String(index).padStart(2, "0")}`);
  }
  return Object.fromEntries(actions.map((action) => [action, {
    folder: `sprites/${action}`,
    frameCount: frameCounts[action],
    frameDuration: action === "idle" || action === "victory"
      ? 150
      : action === "walk"
        ? 120
        : action === "defeated"
          ? 180
          : 90,
    loop: ["idle", "walk", "victory"].includes(action)
  }]));
}

function createGrowth(character, index) {
  const preset = rarityGrowth[character.rarity];
  const offset = (index % 3) - 1;
  return {
    base: {
      hp: preset.base[0] + offset * 3,
      attack: preset.base[1] + offset,
      defense: preset.base[2] + (index % 2),
      speed: preset.base[3] + (index % 2)
    },
    perLevel: {
      hp: preset.perLevel[0] + (index % 2) * 0.4,
      attack: preset.perLevel[1] + (index % 3) * 0.1,
      defense: preset.perLevel[2] + (index % 2) * 0.1,
      speed: preset.perLevel[3] + (index % 3) * 0.03
    },
    variance: { min: 0.9, max: 1.1 }
  };
}

async function createSharedAssets() {
  const sharedRoot = path.join(adventurerRoot, "_shared");
  await fs.mkdir(sharedRoot, { recursive: true });
  await copyOrFallback(
    path.join(legacyRoot, "placeholders", "card-c.png"),
    path.join(legacyRoot, "cards", "newbie-swordman-c-fire.png"),
    path.join(sharedRoot, "card-placeholder.png")
  );
  for (const name of ["portrait-placeholder.png", "icon-placeholder.png", "sprite-placeholder.png"]) {
    await copyOrFallback(
      path.join(legacyRoot, "placeholders", "pixel-character.png"),
      path.join(legacyRoot, "pixel", "newbie-swordman-c-fire-idle.png"),
      path.join(sharedRoot, name)
    );
  }
  for (const folder of ["effects", "ui", "common-skills"]) {
    const target = path.join(sharedRoot, folder);
    await fs.mkdir(target, { recursive: true });
    await fs.writeFile(path.join(target, ".gitkeep"), "", "utf8");
  }
}

async function createCharacter(character, index) {
  const [rarity, element, number] = character.id.split("-");
  const characterRoot = path.join(adventurerRoot, rarity, element, number);
  const legacyCard = path.join(legacyRoot, character.card);
  const cardFallback = path.join(legacyRoot, "placeholders", `card-${rarity}.png`);
  const legacySpriteRoot = path.join(legacyRoot, "pixel");
  const sharedSprite = path.join(adventurerRoot, "_shared", "sprite-placeholder.png");
  const idleSource = path.join(legacySpriteRoot, `${character.sprite}-idle.png`);
  const skills = createSkills(character);
  const animations = createAnimations(skills.length);

  await fs.mkdir(characterRoot, { recursive: true });
  await copyOrFallback(legacyCard, cardFallback, path.join(characterRoot, "card.png"));
  await copyOrFallback(legacyCard, cardFallback, path.join(characterRoot, "portrait.png"));
  await copyOrFallback(idleSource, sharedSprite, path.join(characterRoot, "icon.png"));

  for (const [action, animation] of Object.entries(animations)) {
    const actionRoot = path.join(characterRoot, animation.folder);
    await fs.mkdir(actionRoot, { recursive: true });
    const legacyAction = ["idle", "walk", "attack"].includes(action) ? action : action.startsWith("skill") ? "attack" : action === "hurt" || action === "defeated" ? "attack" : "idle";
    const source = path.join(legacySpriteRoot, `${character.sprite}-${legacyAction}.png`);
    for (let frame = 1; frame <= animation.frameCount; frame += 1) {
      const fileName = `${action}-${String(frame).padStart(2, "0")}.png`;
      await copyOrFallback(source, idleSource, path.join(actionRoot, fileName));
    }
  }

  const effectsRoot = path.join(characterRoot, "effects");
  await fs.mkdir(effectsRoot, { recursive: true });
  for (let skill = 1; skill <= skills.length; skill += 1) {
    const fileName = `skill-${String(skill).padStart(2, "0")}-effect.png`;
    await copyOrFallback(sharedSprite, idleSource, path.join(effectsRoot, fileName));
  }

  const audioRoot = path.join(characterRoot, "audio");
  await fs.mkdir(audioRoot, { recursive: true });
  await fs.writeFile(path.join(audioRoot, ".gitkeep"), "", "utf8");

  const data = {
    id: character.id,
    number,
    name: character.name,
    rarity: character.rarity,
    element: character.element,
    job: character.job,
    description: character.description,
    maxLevel: 100,
    assets: {
      card: "card.png",
      portrait: "portrait.png",
      icon: "icon.png"
    },
    growth: createGrowth(character, index),
    skills,
    animations
  };
  await fs.writeFile(path.join(characterRoot, "data.json"), `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

await createSharedAssets();

for (const rarity of rarities) {
  for (const element of elements) {
    const folder = path.join(adventurerRoot, rarity, element);
    await fs.mkdir(folder, { recursive: true });
    const hasCharacter = characters.some((character) => character.rarity.toLowerCase() === rarity && character.element === element);
    const keepPath = path.join(folder, ".gitkeep");
    if (!hasCharacter) await fs.writeFile(keepPath, "", "utf8");
    else if (await exists(keepPath)) await fs.unlink(keepPath);
  }
}

for (const [index, character] of characters.entries()) {
  await createCharacter(character, index);
}

console.log(`Migrated ${characters.length} adventurer templates.`);
