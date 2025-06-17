# Lightweight React Template for KAVIA

This project provides a minimal React template with a clean, modern UI and minimal dependencies.

## Features

- **Lightweight**: No heavy UI frameworks - uses only vanilla CSS and React
- **Modern UI**: Clean, responsive design with KAVIA brand styling
- **Fast**: Minimal dependencies for quick loading times
- **Simple**: Easy to understand and modify

## Important Note: Babel Configuration

This project’s `package.json` includes a `babel` section with a plugin:

```json
"babel": {
"plugins": ["./.ve/babel-plugin-jsx-editor-id.js"]
}
```

This plugin enables **visual editing functionality** in supported tools.

**Warning for AI code agents and contributors:**
**DO NOT** remove or modify this section - it is ESSENTIAL for proper operation.
Removing it will break editor integration and visual editing features.

## Getting Started

In the project directory, you can run:

### `npm start`

Runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm test`

Launches the test runner in interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

## Customization

### Colors

The main brand colors are defined as CSS variables in `src/App.css`:

```css
:root {
  --kavia-orange: #E87A41;
  --kavia-dark: #1A1A1A;
  --text-color: #ffffff;
  --text-secondary: rgba(255, 255, 255, 0.7);
  --border-color: rgba(255, 255, 255, 0.1);
}
```

### Components

This template uses pure HTML/CSS components instead of a UI framework. You can find component styles in `src/App.css`. 

Common components include:
- Buttons (`.btn`, `.btn-large`)
- Container (`.container`)
- Navigation (`.navbar`)
- Typography (`.title`, `.subtitle`, `.description`)

## Deployment for Custom Domains

You can deploy this app to **GitHub Pages**, **Netlify**, or **Vercel** and use your own custom domain. See below for host-specific instructions and setup.

---

### GitHub Pages (with Custom Domain)
1. **Add `homepage` field:**  
   In your [`package.json`](./package.json), add (or update) the `"homepage"` field with your domain (use HTTPS):
   ```json
   "homepage": "https://your.custom.domain/"
   ```
   *If serving from a subdirectory, include it:*
   ```json
   "homepage": "https://example.com/my-app/"
   ```
2. **Create CNAME for custom domain:**  
   Place a file called [`CNAME`](./CNAME) in the root of your built site (i.e., `build/`), containing _only_ your domain:
   ```
   your.custom.domain
   ```
   Most deployment tools (and GitHub Pages) will use this at publish-time.

3. **Deploy:**  
   Deploy to GitHub Pages (e.g., using [`gh-pages`](https://www.npmjs.com/package/gh-pages)) or your preferred CI/CD.  
   GitHub will recognize the `CNAME` and route your custom domain.  
   **Note:** Updating the `"homepage"` ensures assets load with the proper path.

---

### Netlify (with Custom Domain)
1. **Deploy build output:**  
   Drag-and-drop the `build/` directory, or link your repository in the [Netlify dashboard](https://app.netlify.com/).
2. **SPA routing:**  
   Ensure you include the [`_redirects`](./_redirects) file with this content (already present):
   ```
   /*    /index.html   200
   ```
   This lets Netlify serve React SPA routes directly (no 404s).

3. **Add custom domain:**  
   In your Netlify dashboard:  
   Site Settings → Domain Management → Add Custom Domain → enter your domain.

---

### Vercel (with Custom Domain)
1. **Deploy via Vercel:**  
   Use [Vercel CLI](https://vercel.com/docs/cli) or dashboard to import your project, or push your code to a Vercel-linked Git provider.
2. **Add your domain:**  
   Settings → Domains → Add Domain.  
   (No special config needed; Vercel handles SPA routing for React out of the box.)
3. **Adjust asset paths for subdirectories:**  
   If deploying to a subpath, set the `"homepage"` value accordingly (as above).

---

#### Additional Notes

- **Static Assets & Paths:**  
  Setting the correct `"homepage"` ensures all static assets and routing work both for root domains and subpaths.

- **Advanced Routing:**  
  - For Netlify, you can customize `_redirects` for complex routing needs.
  - For Vercel and GitHub Pages, SPA routing is handled per above instructions.

- **Troubleshooting:**  
  - After pointing your domain’s DNS to your host, it may take some time for changes to propagate.
  - Ensure DNS CNAME/A records are set as per your hosting provider's instructions.

- **More info:**  
  See [Create React App deployment docs](https://facebook.github.io/create-react-app/docs/deployment).

---


### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
