# Digital Resume

An interactive, scroll-driven CV built with React and Vite — part portfolio site, part résumé. A 3D hero anchors the page; GSAP and Lenis handle motion and smooth scrolling. Content is driven from simple data files, so you can update experience, skills, and projects without touching layout code.

**Live site:** [smorrison-digital-resume.vercel.app](https://smorrison-digital-resume.vercel.app/)

## Features

- **3D hero** — GLB character scene with React Three Fiber, theme-aware lighting, and orbit controls
- **Scroll storytelling** — pinned hero, section fades, and phone mockup motion via GSAP ScrollTrigger + Lenis
- **Light / dark themes** — semantic CSS tokens, persisted preference, synced across the phone preview iframe
- **iPhone preview** — live self-embed of the site inside an About-section device mockup
- **Portfolio grid** — static screenshot cards linking to deployed projects
- **Responsive nav** — collapses to a hamburger when links overflow; theme toggle stays visible
- **PDF download** — optional résumé file from `public/resume.pdf`
- **Vercel Analytics** — privacy-friendly traffic insights on production deploys

## Tech stack

| Layer | Tools |
|--------|--------|
| UI | React 18, TypeScript, CSS Modules |
| Build | Vite 5 |
| 3D | Three.js, React Three Fiber, drei |
| Motion | GSAP + ScrollTrigger, Lenis |
| Analytics | [@vercel/analytics](https://vercel.com/docs/analytics) |

## Getting started

**Requirements:** Node.js 18+ and npm.

```bash
git clone https://github.com/shereemorrison/digital-resume.git
cd digital-resume
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the production build locally |

### 3D model

The hero GLB lives at `public/Meshy_AI_Purple_Code_Muse_0514125713_texture.glb`. Camera pose and model rotation are tuned via constants at the top of `src/components/BackgroundScene.tsx`.

## Project structure

```
src/
├── components/
│   ├── CvPage.tsx          # Main page layout, nav, sections, scroll setup
│   ├── BackgroundScene.tsx # Three.js hero
│   ├── PhoneBrowser.tsx    # iPhone iframe preview
│   ├── SitePreviewCard.tsx # Portfolio project cards
│   └── PhoneEmbedResume.tsx# Compact view for ?embed=1
├── data/
│   ├── resume.ts           # CV content
│   └── portfolio.ts        # Portfolio projects
├── theme/                  # Light/dark theme provider + tokens
└── lib/
    └── portfolioPreview.ts # Phone iframe URL helpers
public/
├── images/                 # Portfolio screenshots
├── resume.pdf
└── *.glb                   # Hero 3D model
```
