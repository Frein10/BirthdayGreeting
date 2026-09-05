# Host your birthday greeting free on GitHub

This guide uses **GitHub Pages**, which serves the website from your GitHub repository. Sending a GitHub repository link does not show the birthday page; send the Pages link after deployment.

## 1. Personalize and preview

Open the `practice-app` folder in VS Code. Edit `src/birthday.config.js` to set the receiver's name, your name, the letter, the candle surprise, and photo paths. Copy your photos into `public/memories/` and reference them as `memories/filename.jpg`.

In the VS Code terminal:

```powershell
npm install
npm start
```

Open http://localhost:3000. Tap the gift, open your letter, try the photo arrows, blow out all five candles, and toggle Sound. Press Ctrl+C in the terminal when finished.

## 2. Create a free repository

1. Sign into [GitHub](https://github.com/).
2. Click **+ → New repository**.
3. Name it `BirthdayGreeting` (or another name you like).
4. Select **Public** for GitHub Pages on GitHub Free. Your uploaded photos and text will be publicly accessible, so use content you are happy to share publicly.
5. Leave “Add a README”, “Add .gitignore”, and “Choose a license” unchecked because the local project already includes its files.
6. Click **Create repository**.

Official reference: [Creating a GitHub Pages site](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site).

## 3. Upload the project

The top level of the repository must contain `package.json`, `package-lock.json`, `src/`, `public/`, `tailwind.config.js`, and `.github/workflows/deploy.yml`.

### Recommended: VS Code terminal with Git

Open the terminal **inside `practice-app`**. The commands below already use your repository, `Frein10/BirthdayGreeting`. This project already has a Git repository; these commands add a separate remote named `birthday-github` and leave any existing `origin` unchanged.

```powershell
git status
git add -u
git add src public package.json package-lock.json tailwind.config.js .github README.md HOSTING.md ASSETS.md .gitignore
git commit -m "Build interactive birthday greeting"
git remote add birthday-github https://github.com/Frein10/BirthdayGreeting.git
git push -u birthday-github HEAD:main
```

Sign into GitHub when prompted. If `birthday-github` already exists, check its address with `git remote -v`; skip `git remote add` if the address is already correct. Do not force-push over another project. On future edits use:

```powershell
git add src public README.md HOSTING.md ASSETS.md package.json package-lock.json tailwind.config.js .github
git commit -m "Personalize birthday greeting"
git push birthday-github HEAD:main
```

### Alternative: GitHub website upload

Use **Add file → Upload files** to upload `src/`, `public/`, `package.json`, `package-lock.json`, `tailwind.config.js`, `.gitignore`, `README.md`, `HOSTING.md`, and `ASSETS.md` from inside `practice-app`. Do not upload the enclosing `practice-app` folder, `.git`, `node_modules`, `build`, or `.openai`.

Dotfolders can be missed by drag-and-drop. Create the workflow manually with **Add file → Create new file**. Name it `.github/workflows/deploy.yml`, paste the entire contents of the local file with that exact name, and commit to `main`.

## 4. Enable GitHub Pages

1. In your new repository, go to **Settings → Pages**.
2. Under **Build and deployment**, set **Source → GitHub Actions**.
3. Go to **Actions → Deploy birthday page**.
4. Click **Run workflow**, select **main**, and click the green **Run workflow** button. This also fixes an initial workflow run that failed before you enabled Pages.
5. Wait until both `build` and `deploy` are green. The workflow installs dependencies, runs tests, builds the React app, and publishes the build.
6. Return to **Settings → Pages** and click **Visit site**. Keep HTTPS enabled.

Official references: [Configure a publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site) and [GitHub Pages custom workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

For a repository named `BirthdayGreeting`, the address normally looks like:

```text
https://Frein10.github.io/BirthdayGreeting/
```

Keep the trailing slash. The project's `homepage: "."` setting lets scripts, photos, and artwork load beneath the repository path. You do not need to insert your GitHub username into the app code.

## 5. Test on Android, then share through Messenger

1. Open the **HTTPS GitHub Pages URL** on your Android phone. Do not use `localhost`, your PC's local network address, or the GitHub source-code URL.
2. Test at normal phone zoom in portrait and landscape. Confirm text stays readable and buttons can be tapped.
3. Tap **Unwrap your gift**. Check the letter and music. Browsers commonly block sound before a user interaction, so silence before this first tap is expected. [MDN autoplay guide](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay).
4. Close the letter, check the photo arrows and expanded photo view, and tap all five candles. Confirm the surprise appears and the relight button resets the cake.
5. Tap **Let’s celebrate** and **Sound off/on**.
6. Send the Pages URL to yourself in Messenger, then open it from the message to test that specific in-app browser.
7. If the in-app browser has a playback or rendering problem, use its menu to open the link in Chrome; menu wording varies by Messenger version. Tap Sound on again. The whole greeting still works without sound.
8. Send the verified Pages URL to the receiver.

A simple message you can send:

> I made a little birthday surprise for you 🎁 Open this and tap “Unwrap your gift”: [paste your Pages link]

No app installation, account, microphone permission, or sign-in is needed to view the public greeting. Audio stops when the page is hidden; tap Sound on when you return.

## Troubleshooting

- **404:** check that `deploy` is green, Pages uses GitHub Actions, and the URL includes the correct repository name. Allow a few minutes for the first deployment.
- **Blank page:** ensure the repository root has `package.json`, the workflow publishes `build`, and `homepage` remains `.`. Open the Pages URL, not a downloaded `index.html` file.
- **Workflow says package.json missing:** you uploaded the containing `practice-app` folder. Move its contents to the repository root, or deliberately update every workflow working directory and artifact/cache path for a nested layout.
- **Photo missing:** match filename capitalization and use `memories/photo.jpg`, not a Windows path or `public/memories/photo.jpg`.
- **Old preview in Messenger:** Messenger can cache link previews. Try sharing the same URL with a fresh query, such as `?v=2`; caching behavior varies. The page itself can still be refreshed normally.
- **No music:** check the device volume, tap Sound on, or open in Chrome. The page doesn't request microphone access.

## Optional alternatives

This is a static React app. For an existing Netlify or Vercel account, import the repository, set the build command to `npm run build`, and publish the `build` output folder. GitHub Pages is the fully configured path in this project.
