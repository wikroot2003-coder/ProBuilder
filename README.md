# KICKS ProBuilder

Professional ad asset generator for social media marketing.

## Features

- 🎨 **Multi-format export** - FB Post, IG Square, IG Portrait, Story/TikTok, Web Banner
- 📱 **Multi-device preview** - See your design on laptop, tablet, and mobile
- 🎯 **Layout presets** - Classic, Split, and Overlay layouts
- 🎨 **Brand customization** - Custom colors and border radius
- 📐 **Safe zone overlay** - Ensure content stays in safe areas
- 💾 **One-click export** - Download high-resolution PNG

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open http://localhost:5173 to view in browser.

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Deployment on Railway

This project is configured for Railway deployment. Simply:

1. Push your code to GitHub
2. Connect your GitHub repo to Railway
3. Railway will auto-detect and deploy

Or use Railway CLI:

```bash
railway login
railway init
railway up
```

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- Lucide React (icons)
- html-to-image (export)
- file-saver (download)

## License

MIT
