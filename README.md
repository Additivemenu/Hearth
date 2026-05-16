# Hearth

A personal Chrome extension (MV3) that replaces the new tab page with a dashboard. First feature: a tab manager.

## Stack

Vite + `@crxjs/vite-plugin` · React + TypeScript · Tailwind CSS · `chrome.tabs` / `chrome.storage`

## Develop

```bash
pnpm install
pnpm dev
```

Then load the unpacked extension in Chrome:

1. Open `chrome://extensions`
2. Toggle **Developer mode** on
3. Click **Load unpacked** and select the `dist/` folder
4. Open a new tab — you should see Hearth

`pnpm dev` keeps HMR running for the new-tab page; the extension reloads automatically on changes.

## Build

```bash
pnpm build
```

Outputs a production bundle to `dist/`.
