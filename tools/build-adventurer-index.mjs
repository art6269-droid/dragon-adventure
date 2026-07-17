import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const adventurerRoot = path.join(root, "assets", "adventurers");
const rarities = ["c", "b", "a", "s", "ss", "sss"];
const elements = ["fire", "water", "wood", "light", "dark"];
const characters = [];

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

for (const rarity of rarities) {
  for (const element of elements) {
    const elementRoot = path.join(adventurerRoot, rarity, element);
    if (!(await exists(elementRoot))) continue;
    const entries = await fs.readdir(elementRoot, { withFileTypes: true });
    const folders = entries
      .filter((entry) => entry.isDirectory() && /^\d{4}$/.test(entry.name))
      .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
    for (const folder of folders) {
      const dataPath = path.join(elementRoot, folder.name, "data.json");
      if (!(await exists(dataPath))) continue;
      try {
        const data = JSON.parse(await fs.readFile(dataPath, "utf8"));
        const expectedId = `${rarity}-${element}-${folder.name}`;
        const characterRoot = path.dirname(dataPath);
        const requiredAssets = [
          data.assets?.card || "card.png",
          data.assets?.portrait || "portrait.png",
          data.assets?.icon || "icon.png",
          `${data.animations?.idle?.folder || "sprites/idle"}/idle-01.png`
        ];
        const missingAssets = [];
        for (const asset of requiredAssets) {
          if (!(await exists(path.join(characterRoot, asset)))) missingAssets.push(asset);
        }
        characters.push({
          id: String(data.id || expectedId).toLowerCase(),
          path: `${rarity}/${element}/${folder.name}/data.json`,
          ...(missingAssets.length ? { missingAssets } : {})
        });
      } catch (error) {
        console.warn(`Skipped invalid adventurer data: ${dataPath}`, error.message);
      }
    }
  }
}

await fs.writeFile(
  path.join(adventurerRoot, "index.json"),
  `${JSON.stringify({ characters }, null, 2)}\n`,
  "utf8"
);

console.log(`Adventurer index: ${characters.length} characters.`);
