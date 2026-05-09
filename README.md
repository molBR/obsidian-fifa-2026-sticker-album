# World Cup 2026 Cards

An Obsidian plugin to track your **FIFA World Cup 2026 Panini sticker collection**.

## Features

- **All 994 stickers** from the official Panini FIFA World Cup 2026 album — 48 nations × 20 cards each, plus FIFA/FWC and Coca-Cola special stickers
- **Organised by World Cup group** (Group A through L) matching the actual 2026 draw
- **Tap to collect** — tap once to mark a sticker collected, tap again to unmark
- **Duplicate tracking** — hold any sticker for 500 ms to set how many copies you have; cards with more than one copy show a `[N]` badge
- **Search** — filter by country name (`argentina`) or card code (`ARG5`, `5`) from a single search bar
- **Missing / Duplicates filter** — instantly see only the stickers you still need, or only the ones you can trade
- **Progress bars** at the overall, group, and team level
- **ASCII terminal style** — monospace font, flat borders, block-character progress bars
- Data persists automatically inside your Obsidian vault

## How to use

1. Click the **trophy icon** in the left ribbon, or run the command **Open World Cup 2026 Cards**.
2. Expand a group, then a team to see its stickers.
3. **Tap** a sticker to toggle collected / uncollected.
4. **Hold** a sticker to enter an exact count (useful for duplicates).
5. Use the **search bar** to jump straight to a country or a specific card number.
6. Use the **MISSING** filter to see what you still need, or **DUPLICATES** to see what you can trade.

## Manual installation

1. Download `main.js`, `styles.css`, and `manifest.json` from the [latest release](../../releases/latest).
2. Copy them into `<your vault>/.obsidian/plugins/world-cup-cards/`.
3. In Obsidian go to **Settings → Community plugins**, disable Restricted mode, and enable **World Cup 2026 Cards**.

## Development

```bash
npm install       # install dependencies
npm run dev       # watch mode — rebuilds on save
npm run build     # production build
```

After building, reload the plugin in Obsidian: **Settings → Community plugins → toggle off/on**.

## Author

Pedro Vallese (Coding Giant Codes)
