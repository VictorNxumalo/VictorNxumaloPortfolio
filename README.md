# Mlungisi Nxumalo — Portfolio

Static portfolio site (HTML, CSS, vanilla JS). No build step required for local preview.

## Project structure

```text
VictorNxumaloPortfolio/
├── index.html                 # Homepage
├── .htaccess                  # Apache cache & compression (optional)
├── package.json               # Optional dev tools only
├── Assets/
│   ├── docs/                  # CV download
│   └── images/
│       ├── profile/
│       ├── projects/
│       ├── services-icons/
│       ├── misc/
│       └── testimonials/
├── pages/
│   ├── classes.html           # Line By Line classes
│   ├── testimonials.html
│   ├── experience-sun-international.html
│   └── experience-university-johannesburg.html
├── scripts/
│   ├── site.js                # UI behaviour
│   ├── motion.js              # Scroll reveals & counters
│   ├── experience-detail.js   # Experience detail pages
│   └── dev/
│       └── optimize-images.js # Optional WebP conversion
└── styles/
    ├── portfolio.css          # Main design system
    ├── experience-detail.css
    └── secondary-pages.css
```

## Run locally

1. Open the `VictorNxumaloPortfolio` folder in VS Code / Cursor.
2. Right-click `index.html` → **Open with Live Server** (or any static server).

Do not open HTML via `file://` if you need fetch-based features; Live Server is recommended.

## Optional: optimize images

```bash
npm install
npm run optimize:images
```

Outputs WebP files to `Assets/webp/` (gitignored).

## Deploy

Push to GitHub and enable **GitHub Pages** from the `main` branch (root `/`).

Ensure `Assets/` is committed so images and the CV download work on the live site.

## Pages

| Page | Path |
|------|------|
| Home | `index.html` |
| Classes | `pages/classes.html` |
| Testimonials | `pages/testimonials.html` |
| Sun International | `pages/experience-sun-international.html` |
| UJ academic record | `pages/experience-university-johannesburg.html` |
| CV | `Assets/docs/Mlungisi_Nxumalo_CV_Software_Engineer.docx` |
