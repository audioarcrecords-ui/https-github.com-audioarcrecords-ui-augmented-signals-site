# Augmented Signals — website

Sci-fi themed landing site for Augmented Signals + the **Glitch in time** plugin.
Static HTML/CSS/JS — no build step, hosts anywhere.

```
index.html      — the page
css/style.css   — theme
js/main.js      — background, live download counter, form, analytics hooks
```

---

## ⭐ Recommended free hosting: Cloudflare Pages

Best free combo for your needs (fast, free **unlimited** privacy-first analytics,
custom domain support, generous bandwidth):

1. Push this folder to a GitHub repo (e.g. `augmented-signals-site`).
2. Go to **Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect to Git**.
3. Pick the repo. Build command: *(none)*. Output dir: `/`.
4. Deploy → you get `https://augmented-signals-site.pages.dev` (add a custom domain later, free).

**Alternatives:** Netlify (free; has built-in forms — see below), GitHub Pages
(free; push to a repo, enable Pages on the `main` branch root), Vercel.

---

## 1. Download file + download analytics  →  GitHub Releases

Host the installer as a **GitHub Release asset** — free, unlimited bandwidth, and
GitHub counts downloads automatically (the site reads & displays that count).

1. In the `glitch-in-time` repo: **Releases → Draft a new release**.
2. Tag `v1.0.0`, upload `GlitchInTime-1.0.0-Setup.exe`, publish.
3. The download button already points at `…/releases/latest`. To link the exe
   directly, set `#download-btn`'s `href` to the asset URL:
   `https://github.com/audioarcrecords-ui/glitch-in-time/releases/download/v1.0.0/GlitchInTime-1.0.0-Setup.exe`
4. The live "downloads" counter on the page pulls real counts from the GitHub API
   (`GITHUB_REPO` in `js/main.js`).

---

## 2. Visit analytics  →  pick one (free)

Open `index.html` and paste a snippet in the marked `<head>` block:

- **Cloudflare Web Analytics** (recommended, free, no cookie banner needed):
  Cloudflare dashboard → Web Analytics → add a site → paste the beacon `<script>`.
  *Auto-tracks outbound clicks, so downloads are counted with zero extra setup.*
- **GoatCounter** (free, supports custom events): create an account, paste its
  script. The download button already fires a `download-glitch-in-time` event.
- **Plausible** (paid after trial) also wired in `main.js` if you ever switch.

---

## 3. Contact form  →  Web3Forms (free, no backend)

1. Go to **https://web3forms.com**, enter `audioarcrecords@gmail.com`, get an
   **access key** (emailed instantly).
2. In `index.html`, replace `YOUR_WEB3FORMS_ACCESS_KEY` with it.
3. Done — submissions arrive in your inbox. Free tier = 250 submissions/month.

*If you host on **Netlify** instead, you can use built-in Netlify Forms: add
`data-netlify="true"` to the `<form>` and drop the Web3Forms key.*

---

## Quick checklist before going live
- [ ] Publish the GitHub Release + upload the installer
- [ ] Set the download button href to the asset (optional)
- [ ] Paste an analytics snippet in `<head>`
- [ ] Add your Web3Forms access key
- [ ] Deploy to Cloudflare Pages
