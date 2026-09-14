# akash-samanta.github.io

Personal portfolio for Akash Samanta — Full-Stack Software Engineer.

Live at [aks-samanta.github.io](https://aks-samanta.github.io/).

## Stack

Plain HTML, CSS, and vanilla JavaScript — no build step, no framework, no bundler.
Deployed directly by GitHub Pages from `main`.

- `index.html` — page markup
- `css/` — one stylesheet per component/section (`tokens.css` holds the design tokens; light/dark theme lives entirely in CSS custom properties)
- `js/` — one classic script per feature (theme toggle, nav/scrollspy, scroll reveal, the hero's WebGL/Canvas2D network visualization, card tilt, GitHub stats, contact form)
- `img/`, `pdf/` — static assets

The hero's 3D node network (Three.js, loaded conditionally) falls back to a lightweight
Canvas2D version on mobile, when `prefers-reduced-motion` is set, or if WebGL/the CDN
is unavailable.

## Local development

No build tooling is required. Serve the directory with any static file server, e.g.:

```bash
npx serve .
```

Then open the printed local URL. Editing any `.html`/`.css`/`.js` file and refreshing
is enough — nothing needs to be compiled.

## Deployment

GitHub Pages serves this repository's `main` branch directly — there is no CI build
step. Pushing to `main` is the deploy.
