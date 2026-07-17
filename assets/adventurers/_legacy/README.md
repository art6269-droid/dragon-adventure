# Legacy adventurer sources

These files are retained only as migration sources and are not loaded by the
game or service worker.

Runtime adventurer data lives under:

```text
assets/adventurers/{rarity}/{element}/{number}/
```

Use `tools/migrate-adventurers.mjs` only when the legacy source artwork needs
to be copied into the numbered runtime folders again.
