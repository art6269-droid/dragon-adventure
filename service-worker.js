const CACHE_NAME = "dragon-adventure-v35";

const CORE_ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./style.css?v=14",
  "./style.css?v=15",
  "./style.css?v=16",
  "./style.css?v=17",
  "./style.css?v=18",
  "./style.css?v=19",
  "./style.css?v=20",
  "./style.css?v=21",
  "./style.css?v=22",
  "./home-v2.css",
  "./home-v2.css?v=15",
  "./home-v2.css?v=17",
  "./home-v2.css?v=18",
  "./home-v2.css?v=19",
  "./home-v2.css?v=20",
  "./home-v2.css?v=21",
  "./home-v2.css?v=22",
  "./home-v2.css?v=23",
  "./home-v2.css?v=24",
  "./home-v2.css?v=25",
  "./home-v2.css?v=26",
  "./app.js",
  "./app.js?v=14",
  "./app.js?v=15",
  "./app.js?v=17",
  "./app.js?v=18",
  "./app.js?v=19",
  "./app.js?v=20",
  "./app.js?v=21",
  "./app.js?v=22",
  "./app.js?v=23",
  "./app.js?v=24",
  "./app.js?v=25",
  "./app.js?v=26",
  "./app.js?v=27",
  "./app.js?v=28",
  "./app.js?v=29",
  "./app.js?v=30",
  "./home-v2-overrides.js",
  "./home-v2-overrides.js?v=1",
  "./manifest.json",
  "./assets/icons/icon-192.svg",
  "./assets/icons/icon-512.svg",
  "./assets/icons/icon-coin.png",
  "./assets/icons/icon-gem.png",
  "./assets/icons/icon-energy.png",
  "./assets/icons/icon-egg.png",
  "./assets/icons/icon-bag.png",
  "./assets/icons/icon-dragon.png",
  "./assets/icons/icon-home.png",
  "./assets/icons/icon-fusion.png",
  "./assets/icons/icon-shop.png",
  "./assets/icons/icon-adventure.png",
  "./assets/icons/icon-pk.png",
  "./assets/icons/icon-settings.png",
  "./assets/icons/icon-account.png",
  "./assets/icons/icon-notice.png",
  "./assets/icons/nav-home.png",
  "./assets/icons/nav-dragon-cave.png",
  "./assets/icons/nav-shop-equipment.png",
  "./assets/icons/nav-shop-items.png",
  "./assets/icons/nav-eggs.png",
  "./assets/icons/nav-explore.png",
  "./assets/icons/nav-guild.png",
  "./assets/icons/nav-stage.png",
  "./assets/ui/nav-home.png",
  "./assets/ui/nav-dragon-cave.png",
  "./assets/ui/nav-gear-shop.png",
  "./assets/ui/nav-item-shop.png",
  "./assets/ui/nav-explore.png",
  "./assets/ui/nav-quest.png",
  "./assets/backgrounds/bg-home-dragon-island.png",
  "./assets/backgrounds/bg-login-dragon-adventure.png",
  "./assets/backgrounds/bg-battle-skyland.png",
  "./assets/backgrounds/bg-market-shop.png",
  "./assets/backgrounds/bg-fusion-shrine.png",
  "./assets/backgrounds/bg-pk-arena.png",
  "./assets/islands/island-rest.png",
  "./assets/islands/island-hatch.png",
  "./assets/island/island-rest.png",
  "./assets/island/island-hatch.png",
  "./assets/characters/mimi-guide-full.png",
  "./assets/characters/mimi-head.png",
  "./assets/characters/mimi-avatar.png",
  "./assets/characters/mimi-emote-happy.png",
  "./assets/characters/mimi-emote-surprised.png",
  "./assets/characters/mimi-emote-sad.png",
  "./assets/eggs/egg-common.png",
  "./assets/eggs/egg-rare.png",
  "./assets/eggs/egg-epic.png",
  "./assets/eggs/egg-legendary.png",
  "./assets/eggs/egg-dark-sss.png",
  "./assets/eggs/egg-crack-01.png",
  "./assets/eggs/egg-crack-02.png",
  "./assets/dragons/dragon-home-main.png",
  "./assets/dragons/dragon-rank-c.png",
  "./assets/dragons/dragon-rank-b.png",
  "./assets/dragons/dragon-rank-a.png",
  "./assets/dragons/dragon-rank-s.png",
  "./assets/dragons/dragon-rank-ss.png",
  "./assets/dragons/dragon-rank-sss.png",
  "./assets/dragons/dragon-rest-sleep.png",
  "./assets/dragons/dragon-rest-walk-1.png",
  "./assets/dragons/dragon-rest-walk-2.png",
  "./assets/dragons/dragon-rest-fly-1.png",
  "./assets/dragons/dragon-rest-fly-2.png",
  "./assets/monsters/monster-fluff-dark.png",
  "./assets/monsters/monster-slime-purple.png",
  "./assets/monsters/monster-boss-shadow.png",
  "./assets/monsters/monster-1.png",
  "./assets/items/item-meat-small.png",
  "./assets/items/item-fruit-dragon.png",
  "./assets/items/item-meat-premium.png",
  "./assets/items/item-chest-gold.png",
  "./assets/items/shop.png",
  "./assets/items/item-ticket-explore.png",
  "./assets/items/item-ticket-mercenary.png",
  "./assets/items/item-potion.png",
  "./assets/items/item-scroll.png",
  "./assets/items/item-food.png",
  "./assets/items/item-hatch-tool.png",
  "./assets/equipment/equipment-helmet.png",
  "./assets/equipment/equipment-armor.png",
  "./assets/equipment/equipment-weapon.png",
  "./assets/equipment/equipment-boots.png",
  "./assets/effects/fx-hatch-glow.png",
  "./assets/effects/fx-magic-circle.png",
  "./assets/effects/fx-fusion-burst.png",
  "./assets/effects/fx-rarity-frame.png",
  "./assets/effects/fx-rainbow-legend.png",
  "./assets/effects/fx-hit-burst.png",
  "./assets/ui/ui-style-board.png",
  "./assets/ui/logo-dragon-adventure.png",
  "./assets/ui/btn-start-game.png",
  "./assets/ui/mimi-placeholder.png",
  "./assets/ui/hatch-slot-time.png",
  "./assets/ui/hatch-slot-step.png",
  "./assets/ui/hatch-slot-empty.png",
  "./assets/ui/hatch-slot-locked.png",
  "./assets/ui/hatch-progress-bar.png",
  "./assets/ui/icon-lock.png",
  "./assets/ui/icon-plus.png",
  "./assets/ui/dragon-shadow.png",
  "./assets/ui/dragon-glow.png",
  "./assets/ui/gacha/gacha-button.png",
  "./assets/cards/backgrounds/bg-gacha-card.png",
  "./assets/cards/effects/fx-card-glow.png",
  "./assets/cards/effects/fx-card-sss.png",
  "./assets/cards/characters/char-flame-knight.png",
  "./assets/cards/characters/char-tide-mage.png",
  "./assets/cards/characters/char-leaf-ranger.png",
  "./assets/cards/characters/char-shadow-princess.png",
  "./assets/cards/characters/char-light-oracle.png",
  "./assets/cards/characters/char-star-dragonlord.png",
  "./assets/cards/characters/thumb-char-flame-knight.png",
  "./assets/cards/characters/thumb-char-tide-mage.png",
  "./assets/cards/characters/thumb-char-leaf-ranger.png",
  "./assets/cards/characters/thumb-char-shadow-princess.png",
  "./assets/cards/characters/thumb-char-light-oracle.png",
  "./assets/cards/characters/thumb-char-star-dragonlord.png",
  "./assets/cards/pets/pet-fire-wisp.png",
  "./assets/cards/pets/pet-aqua-puff.png",
  "./assets/cards/pets/pet-grass-sprout.png",
  "./assets/cards/pets/pet-shadow-cat.png",
  "./assets/cards/pets/pet-light-bunny.png",
  "./assets/cards/pets/pet-abyss-drake.png",
  "./assets/cards/pets/thumb-pet-fire-wisp.png",
  "./assets/cards/pets/thumb-pet-aqua-puff.png",
  "./assets/cards/pets/thumb-pet-grass-sprout.png",
  "./assets/cards/pets/thumb-pet-shadow-cat.png",
  "./assets/cards/pets/thumb-pet-light-bunny.png",
  "./assets/cards/pets/thumb-pet-abyss-drake.png",
  "./assets/audio/start.mp3",
  "./assets/audio/sfx/sfx-start-game.mp3",
  "./assets/audio/intro.mp3",
  "./assets/audio/home.mp3",
  "./assets/audio/battle.mp3",
  "./assets/audio/shop.mp3",
  "./assets/audio/fusion.mp3"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => Promise.allSettled(
        CORE_ASSETS.map((url) => cache.add(new Request(url, { cache: "reload" })))
      ))
      .catch(() => undefined)
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const requestUrl = new URL(event.request.url);
  const isFreshCoreFile = event.request.mode === "navigate"
    || event.request.destination === "document"
    || event.request.destination === "script"
    || event.request.destination === "style"
    || requestUrl.pathname.endsWith("/index.html")
    || requestUrl.pathname.endsWith("/app.js")
    || requestUrl.pathname.endsWith("/style.css")
    || requestUrl.pathname.endsWith("/service-worker.js");

  if (isFreshCoreFile) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request).then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      });
    })
  );
});
