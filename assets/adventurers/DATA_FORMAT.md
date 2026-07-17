# Adventurer data format

Adventurers use a rarity-first data layout:

```text
assets/adventurers/{rarity}/{element}/{number}/
  data.json
  card.png
  portrait.png
  icon.png
  sprites/{action}/{action}-01.png
  effects/
  audio/
```

- `rarity`: `c`, `b`, `a`, `s`, `ss`, or `sss`
- `element`: `fire`, `water`, `wood`, `light`, or `dark`
- `number`: four digits from `0001` to `9999`
- `templateId`: `{rarity}-{element}-{number}`
- Player instances use a separate `adv_*` ID.

`data.json` owns names, descriptions, growth, skills, assets, and animation
metadata. The runtime loads templates from `assets/adventurers/index.json`.

After adding a new numbered folder, rebuild the index and content catalog:

```powershell
node tools/build-adventurer-index.mjs
node tools/build-content-catalog.mjs
```

The browser cannot enumerate GitHub Pages directories, so the generated index
is the deploy-safe directory scan result. No `app.js` pool edit is required.

Missing card, portrait, icon, animation, effect, or audio files are allowed.
Runtime image fallback assets live in `assets/adventurers/_shared/`.
