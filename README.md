# Ashish Dixit — Product Designer Portfolio

An interactive, 3D-enhanced personal portfolio showcasing product design and development expertise. This project features a custom high-fidelity 3D interactive hero section and responsive UI built with modern web technologies.

## 🚀 Tech Stack

- **Framework:** React 18
- **Build Tool:** Vite
- **Routing:** React Router v6
- **3D Graphics:** Three.js / Spline Tool
- **Styling:** Vanilla CSS (Global & Scoped)

## 📁 Project Structure

```text
/
├── public/               # Static assets (images, models, global css, HTML pages)
├── src/                  # React source code
│   ├── components/       # Reusable React components (Nav, BrainHero, HUD, etc.)
│   ├── pages/            # Page-level components (Home, About, etc.)
│   ├── styles/           # Component and page-specific CSS
│   ├── App.jsx           # Main application routing
│   └── main.jsx          # React entry point
├── index.html            # Main HTML template
├── jsconfig.json         # JavaScript configuration
├── package.json          # Dependencies and scripts
└── vite.config.js        # Vite bundler configuration
```

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs all project dependencies                |
| `npm run dev`             | Starts local dev server at `http://localhost:5173`|
| `npm run build`           | Builds the production site to `./dist/`          |
| `npm run preview`         | Previews your production build locally           |

## ✨ Features

- **Interactive 3D Hero:** A fully integrated "neural tour" featuring an interactive 3D human brain model with automated highlights and manual controls.
- **Dynamic HUD:** A technical overlay providing real-time feedback and navigation.
- **Responsive Design:** Fluid layouts that adapt beautifully across desktop and mobile devices.
- **Modern UI Aesthetics:** Deep "regular red" industrial wireframe styling mixed with vibrant, modern highlights.
