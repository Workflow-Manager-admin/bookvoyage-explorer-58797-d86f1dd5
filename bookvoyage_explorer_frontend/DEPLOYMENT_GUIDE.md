# 🚀 Deploying BookVoyage Explorer with a Custom Domain

Your app is ready for rapid deployment to GitHub Pages, Netlify, or Vercel with your own domain. These settings ensure assets and React SPA routes work perfectly.

---

## 🔵 1. GitHub Pages (with Custom Domain)

1. **Homepage config:**  
   Ensure your `package.json` contains:
   ```json
   "homepage": "https://your.custom.domain/"
   ```
   If publishing to a subdirectory, use  
   `"homepage": "https://yourdomain.com/my-app/"`

2. **Custom Domain:**  
   Make sure a file named `CNAME` (no extension) in **build/** contains only your domain:
   ```
   your.custom.domain
   ```

3. **Build and deploy:**  
   - Build: `npm run build`
   - Deploy with [gh-pages](https://www.npmjs.com/package/gh-pages) or GitHub Actions.
   - GitHub Pages will use `CNAME` and set up the custom domain.

---

## 🟢 2. Netlify

1. **Deploy**  
   - Drag-and-drop the `build/` directory to Netlify, or connect your repo.

2. **SPA Routing**  
   - Confirm `_redirects` contains:
     ```
     /*    /index.html   200
     ```
   - (Already present; ensures SPA fallback for all React routes.)

3. **Custom Domain**  
   - In Netlify dashboard:  
     Site Settings → Domain Management → Add Custom Domain

---

## 🟠 3. Vercel

1. **Deploy**  
   - Use Vercel CLI or connect your repo in Vercel dashboard.

2. **Custom Domain**  
   - Settings → Domains → Add Domain

3. **No extra config needed:**  
   - Vercel auto-detects React SPA routing for you.

---

## 🚩 Troubleshooting/Notes

- The `"homepage"` field is essential for GitHub Pages and static asset path correctness.
- Netlify’s `_redirects` ensures deep linking and browser refreshes work.
- The `CNAME` file should ONLY contain your root domain, no protocol (e.g., `www.example.com`).
- DNS changes may take time to propagate. Double-check your DNS records according to your host’s instructions.

---

For advanced options and details, see [Create React App - Deployment](https://facebook.github.io/create-react-app/docs/deployment).
