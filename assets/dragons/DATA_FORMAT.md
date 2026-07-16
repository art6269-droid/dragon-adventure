# Dragon content format

Canonical path:

`assets/dragons/{stage}/{element}/{rarity}/{0001}/`

Stages are `baby`, `youth`, `adult`, and `evolution`. Each dragon folder contains
`data.json`, `icon.png`, `portrait.png`, and the animation folders `idle`, `walk`,
and `attack`. Animation filenames are `01.png` through `06.png`.

After adding content, run:

`node tools/build-content-catalog.mjs`

The game reads `assets/data/content-catalog.json`; no JavaScript edit is needed.
