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

### GitHub Pages
- Add the `homepage` field to your `package.json` with your intended domain (**replace `your.custom.domain` below**):

  ```json
  "homepage": "https://your.custom.domain/"
  ```

- To deploy, use a tool like [`gh-pages`](https://www.npmjs.com/package/gh-pages) or your CI workflow.
- For custom domains, create a `CNAME` file (in the `build/` output) containing only your custom domain, e.g.:
  ```
  your.custom.domain
  ```
  GitHub Pages will route your domain properly if both `homepage` and `CNAME` are set.

### Netlify
- Deploy the app folder (the build output) to Netlify.
- The included [`_redirects`](./_redirects) file ensures proper single-page-app routing.
- In Netlify dashboard, add your custom domain under Site Settings > Domain Management > Add custom domain.

### Vercel
- Deploy via the Vercel dashboard or using the CLI.
- In Vercel dashboard, add your domain under Settings > Domains.
- No special config is needed for SPAs (Vercel handles rewrites automatically).

---

**IMPORTANT:**  
- If you use a custom domain, update all instances of the default deployment URL with your actual domain.
- If you serve from a subpath (i.e., not root), update the `homepage` field in `package.json` accordingly, e.g. `"homepage": "https://example.com/subdir/"`.

See more at [Create React App deployment docs](https://facebook.github.io/create-react-app/docs/deployment).

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

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
