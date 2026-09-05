# A little celebration

A responsive birthday greeting built with React, Tailwind CSS, Framer Motion, canvas-confetti, and lucide-react. Includes a tap-to-open gift, music-box birthday tune, animated letter, memory viewer, confetti, and five interactive birthday candles.

## Run locally

Open a terminal in `practice-app`, then run:

```sh
npm install
npm start
```

Visit http://localhost:3000. To create the production build, use `npm run build`. Run the interaction tests with `npm test -- --watchAll=false --runInBand`.

## Personalize before sharing

Edit `src/birthday.config.js`:

- `name`: birthday person's name. Currently set to “Mom”.
- `from`: your name or sign-off.
- `greeting`: first line in the letter.
- `message`: paragraphs of your personal birthday letter.
- `surprise`: the message revealed after all candles go out.
- `memories`: your photo paths, captions, and meaningful descriptions in `alt`.

Put your photos in `public/memories/`. For example, if your file is `public/memories/our-trip.jpg`, use `src: 'memories/our-trip.jpg'`. Do not include `public/` in the path. Use JPG or WebP, preferably below 500 KB per picture. File names are case-sensitive on GitHub Pages.

Your three family photos (`mom1.jpg`, `mom2.jpg`, and `mom3.jpg`) are connected to the memory cards. Frames keep the entire picture visible, including portrait photos. An empty or broken photo path displays a simple fallback. Artwork details are in `ASSETS.md`.

The title in the browser includes the configured name. Messenger reads static metadata before JavaScript runs: personalize `og:title`, `og:description`, and `<title>` in `public/index.html` if you want the preview text to include the name. No social preview image is configured.

## Host free on GitHub Pages

See [HOSTING.md](HOSTING.md) for the complete beginner walkthrough, deployment instructions, Android/Messenger checks, and troubleshooting. The ready-to-use workflow is `.github/workflows/deploy.yml`. It tests, builds, and publishes on every push to `main` after Pages is enabled.

The repository must have the **contents of `practice-app` at its root**, so `package.json` and `.github/` are directly at the top level. Do not upload `node_modules` or `build`.

## Android and Messenger

- Fluid layout with a single-column mobile view and 44px minimum interactive targets.
- Music begins only after tapping the gift or sound button. It stops when the page is hidden; tap Sound to resume.
- All artwork and family photos are bundled locally. No third-party font or audio requests.
- No microphone permission: tap each candle to blow it out.
- Native accessible dialogs, keyboard controls, focus restoration, and reduced-motion support.
- All assets use relative paths for GitHub repository subdirectories.

This targets modern Android Chrome and Android System WebView. A real Android/Messenger device check is still recommended before sending; desktop component tests cannot certify every in-app browser or device. If Messenger blocks sound, open the same link in Chrome and tap Sound on.

## Project notes

Unrelated planner code, old React logos, sample photos, and unused web-vitals code have been removed. The existing tool-managed `.openai/hosting.json` is not used by the GitHub Pages workflow.
