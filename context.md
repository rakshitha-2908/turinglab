# TuringLab Full Context

Generated: 2026-04-19

## 1) Project Overview

TuringLab is a React + TypeScript + Vite application that provides an interactive visual simulator for multiple Turing Machine modes:

- Single-tape deterministic
- Multi-tape deterministic
- Nondeterministic branching
- Universal (interprets encoded single-tape machine JSON)

Core technologies:

- React 19
- Zustand (state/store)
- Framer Motion (animation)
- React Flow (transition graph visualization)
- Recharts (complexity chart)
- Tailwind CSS v4 (plus custom CSS)

## 2) Workspace File Structure

```text
.
|-- .gitignore
|-- README.md
|-- context.md
|-- eslint.config.js
|-- index.html
|-- package-lock.json
|-- package.json
|-- tsconfig.app.json
|-- tsconfig.json
|-- tsconfig.node.json
|-- vite.config.ts
|-- public/
|   |-- favicon.svg
|   `-- icons.svg
`-- src/
    |-- App.css
    |-- App.tsx
    |-- index.css
    |-- main.tsx
    |-- assets/
    |   |-- hero.png
    |   |-- react.svg
    |   `-- vite.svg
    |-- components/
    |   |-- ComplexityPanel.tsx
    |   |-- ControlPanel.tsx
    |   |-- ExplanationPanel.tsx
    |   |-- LandingOverlay.tsx
    |   |-- ModeNavbar.tsx
    |   |-- MultiTapeView.tsx
    |   |-- NondetTreeView.tsx
    |   |-- Sidebar.tsx
    |   |-- StatePanel.tsx
    |   |-- TapeView.tsx
    |   `-- TransitionGraph.tsx
    |-- data/
    |   `-- presets.ts
    |-- engine/
    |   `-- simulator.ts
    |-- store/
    |   `-- turingStore.ts
    `-- types/
        `-- turing.ts
```

Notes:

- `package-lock.json` is generated dependency lock data, not handwritten implementation logic.
- `src/assets/hero.png` is a binary image asset.

## 3) Runtime Architecture and Data Flow

1. Entry point (`src/main.tsx`) mounts `<App />` in `#root`.
2. `App.tsx` reads full state and actions from Zustand (`useTuringStore`).
3. Controls trigger store actions (`step`, `reset`, `setMode`, `applyEditorMachine`, etc.).
4. Store delegates machine execution to pure engine functions in `src/engine/simulator.ts`.
5. Engine returns next immutable snapshots.
6. UI components render snapshots:
   - Tape and machine state
   - Transition graph
   - Nondeterministic branch tree
   - Complexity chart
   - Explain/history panel

## 4) Complete Source Snapshot (Text Files)

### .gitignore

```gitignore
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
```

### package.json

```json
{
  "name": "turinglab",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "clsx": "^2.1.1",
    "framer-motion": "^12.38.0",
    "lucide-react": "^1.8.0",
    "react": "^19.2.4",
    "react-dom": "^19.2.4",
    "reactflow": "^11.11.4",
    "recharts": "^3.8.1",
    "zustand": "^5.0.12"
  },
  "devDependencies": {
    "@babel/core": "^7.29.0",
    "@eslint/js": "^9.39.4",
    "@rolldown/plugin-babel": "^0.2.2",
    "@tailwindcss/vite": "^4.2.2",
    "@types/babel__core": "^7.20.5",
    "@types/node": "^24.12.2",
    "@types/react": "^19.2.14",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^6.0.1",
    "babel-plugin-react-compiler": "^1.0.0",
    "eslint": "^9.39.4",
    "eslint-plugin-react-hooks": "^7.0.1",
    "eslint-plugin-react-refresh": "^0.5.2",
    "globals": "^17.4.0",
    "tailwindcss": "^4.2.2",
    "typescript": "~6.0.2",
    "typescript-eslint": "^8.58.0",
    "vite": "^8.0.4"
  }
}
```

### README.md

```md
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
```

### eslint.config.js

```js
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
])
```

### index.html

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>turinglab</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### tsconfig.json

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

### tsconfig.app.json

```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "es2023",
    "lib": ["ES2023", "DOM", "DOM.Iterable"],
    "module": "esnext",
    "types": ["vite/client"],
    "skipLibCheck": true,

    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",

    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
```

### tsconfig.node.json

```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
    "target": "es2023",
    "lib": ["ES2023"],
    "module": "esnext",
    "types": ["node"],
    "skipLibCheck": true,

    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,

    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["vite.config.ts"]
}
```

### vite.config.ts

```ts
import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
  ],
})
```

### public/favicon.svg

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="48" height="46" fill="none" viewBox="0 0 48 46"><path fill="#863bff" d="M25.946 44.938c-.664.845-2.021.375-2.021-.698V33.937a2.26 2.26 0 0 0-2.262-2.262H10.287c-.92 0-1.456-1.04-.92-1.788l7.48-10.471c1.07-1.497 0-3.578-1.842-3.578H1.237c-.92 0-1.456-1.04-.92-1.788L10.013.474c.214-.297.556-.474.92-.474h28.894c.92 0 1.456 1.04.92 1.788l-7.48 10.471c-1.07 1.498 0 3.579 1.842 3.579h11.377c.943 0 1.473 1.088.89 1.83L25.947 44.94z" style="fill:#863bff;fill:color(display-p3 .5252 .23 1);fill-opacity:1"/><mask id="a" width="48" height="46" x="0" y="0" maskUnits="userSpaceOnUse" style="mask-type:alpha"><path fill="#000" d="M25.842 44.938c-.664.844-2.021.375-2.021-.698V33.937a2.26 2.26 0 0 0-2.262-2.262H10.183c-.92 0-1.456-1.04-.92-1.788l7.48-10.471c1.07-1.498 0-3.579-1.842-3.579H1.133c-.92 0-1.456-1.04-.92-1.787L9.91.473c.214-.297.556-.474.92-.474h28.894c.92 0 1.456 1.04.92 1.788l-7.48 10.471c-1.07 1.498 0 3.578 1.842 3.578h11.377c.943 0 1.473 1.088.89 1.832L25.843 44.94z" style="fill:#000;fill-opacity:1"/></mask><g mask="url(#a)"><g filter="url(#b)"><ellipse cx="5.508" cy="14.704" fill="#ede6ff" rx="5.508" ry="14.704" style="fill:#ede6ff;fill:color(display-p3 .9275 .9033 1);fill-opacity:1" transform="matrix(.00324 1 1 -.00324 -4.47 31.516)"/></g><g filter="url(#c)"><ellipse cx="10.399" cy="29.851" fill="#ede6ff" rx="10.399" ry="29.851" style="fill:#ede6ff;fill:color(display-p3 .9275 .9033 1);fill-opacity:1" transform="matrix(.00324 1 1 -.00324 -39.328 7.883)"/></g><g filter="url(#d)"><ellipse cx="5.508" cy="30.487" fill="#7e14ff" rx="5.508" ry="30.487" style="fill:#7e14ff;fill:color(display-p3 .4922 .0767 1);fill-opacity:1" transform="rotate(89.814 -25.913 -14.639)scale(1 -1)"/></g><g filter="url(#e)"><ellipse cx="5.508" cy="30.599" fill="#7e14ff" rx="5.508" ry="30.599" style="fill:#7e14ff;fill:color(display-p3 .4922 .0767 1);fill-opacity:1" transform="rotate(89.814 -32.644 -3.334)scale(1 -1)"/></g><g filter="url(#f)"><ellipse cx="5.508" cy="30.599" fill="#7e14ff" rx="5.508" ry="30.599" style="fill:#7e14ff;fill:color(display-p3 .4922 .0767 1);fill-opacity:1" transform="matrix(.00324 1 1 -.00324 -34.34 30.47)"/></g><g filter="url(#g)"><ellipse cx="14.072" cy="22.078" fill="#ede6ff" rx="14.072" ry="22.078" style="fill:#ede6ff;fill:color(display-p3 .9275 .9033 1);fill-opacity:1" transform="rotate(93.35 24.506 48.493)scale(-1 1)"/></g><g filter="url(#h)"><ellipse cx="3.47" cy="21.501" fill="#7e14ff" rx="3.47" ry="21.501" style="fill:#7e14ff;fill:color(display-p3 .4922 .0767 1);fill-opacity:1" transform="rotate(89.009 28.708 47.59)scale(-1 1)"/></g><g filter="url(#i)"><ellipse cx="3.47" cy="21.501" fill="#7e14ff" rx="3.47" ry="21.501" style="fill:#7e14ff;fill:color(display-p3 .4922 .0767 1);fill-opacity:1" transform="rotate(89.009 28.708 47.59)scale(-1 1)"/></g><g filter="url(#j)"><ellipse cx=".387" cy="8.972" fill="#7e14ff" rx="4.407" ry="29.108" style="fill:#7e14ff;fill:color(display-p3 .4922 .0767 1);fill-opacity:1" transform="rotate(39.51 .387 8.972)"/></g><g filter="url(#k)"><ellipse cx="47.523" cy="-6.092" fill="#7e14ff" rx="4.407" ry="29.108" style="fill:#7e14ff;fill:color(display-p3 .4922 .0767 1);fill-opacity:1" transform="rotate(37.892 47.523 -6.092)"/></g><g filter="url(#l)"><ellipse cx="41.412" cy="6.333" fill="#47bfff" rx="5.971" ry="9.665" style="fill:#47bfff;fill:color(display-p3 .2799 .748 1);fill-opacity:1" transform="rotate(37.892 41.412 6.333)"/></g><g filter="url(#m)"><ellipse cx="-1.879" cy="38.332" fill="#7e14ff" rx="4.407" ry="29.108" style="fill:#7e14ff;fill:color(display-p3 .4922 .0767 1);fill-opacity:1" transform="rotate(37.892 -1.88 38.332)"/></g><g filter="url(#n)"><ellipse cx="-1.879" cy="38.332" fill="#7e14ff" rx="4.407" ry="29.108" style="fill:#7e14ff;fill:color(display-p3 .4922 .0767 1);fill-opacity:1" transform="rotate(37.892 -1.88 38.332)"/></g><g filter="url(#o)"><ellipse cx="35.651" cy="29.907" fill="#7e14ff" rx="4.407" ry="29.108" style="fill:#7e14ff;fill:color(display-p3 .4922 .0767 1);fill-opacity:1" transform="rotate(37.892 35.651 29.907)"/></g><g filter="url(#p)"><ellipse cx="38.418" cy="32.4" fill="#47bfff" rx="5.971" ry="15.297" style="fill:#47bfff;fill:color(display-p3 .2799 .748 1);fill-opacity:1" transform="rotate(37.892 38.418 32.4)"/></g></g><defs><filter id="b" width="60.045" height="41.654" x="-19.77" y="16.149" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="7.659"/></filter><filter id="c" width="90.34" height="51.437" x="-54.613" y="-7.533" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="7.659"/></filter><filter id="d" width="79.355" height="29.4" x="-49.64" y="2.03" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter><filter id="e" width="79.579" height="29.4" x="-45.045" y="20.029" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter><filter id="f" width="79.579" height="29.4" x="-43.513" y="21.178" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter><filter id="g" width="74.749" height="58.852" x="15.756" y="-17.901" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="7.659"/></filter><filter id="h" width="61.377" height="25.362" x="23.548" y="2.284" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter><filter id="i" width="61.377" height="25.362" x="23.548" y="2.284" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter><filter id="j" width="56.045" height="63.649" x="-27.636" y="-22.853" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter><filter id="k" width="54.814" height="64.646" x="20.116" y="-38.415" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter><filter id="l" width="33.541" height="35.313" x="24.641" y="-11.323" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter><filter id="m" width="54.814" height="64.646" x="-29.286" y="6.009" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter><filter id="n" width="54.814" height="64.646" x="-29.286" y="6.009" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter><filter id="o" width="54.814" height="64.646" x="8.244" y="-2.416" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter><filter id="p" width="39.409" height="43.623" x="18.713" y="10.588" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter></defs></svg>
```

### public/icons.svg

```svg
<svg xmlns="http://www.w3.org/2000/svg">
  <symbol id="bluesky-icon" viewBox="0 0 16 17">
    <g clip-path="url(#bluesky-clip)"><path fill="#08060d" d="M7.75 7.735c-.693-1.348-2.58-3.86-4.334-5.097-1.68-1.187-2.32-.981-2.74-.79C.188 2.065.1 2.812.1 3.251s.241 3.602.398 4.13c.52 1.744 2.367 2.333 4.07 2.145-2.495.37-4.71 1.278-1.805 4.512 3.196 3.309 4.38-.71 4.987-2.746.608 2.036 1.307 5.91 4.93 2.746 2.72-2.746.747-4.143-1.747-4.512 1.702.189 3.55-.4 4.07-2.145.156-.528.397-3.691.397-4.13s-.088-1.186-.575-1.406c-.42-.19-1.06-.395-2.741.79-1.755 1.24-3.64 3.752-4.334 5.099"/></g>
    <defs><clipPath id="bluesky-clip"><path fill="#fff" d="M.1.85h15.3v15.3H.1z"/></clipPath></defs>
  </symbol>
  <symbol id="discord-icon" viewBox="0 0 20 19">
    <path fill="#08060d" d="M16.224 3.768a14.5 14.5 0 0 0-3.67-1.153c-.158.286-.343.67-.47.976a13.5 13.5 0 0 0-4.067 0c-.128-.306-.317-.69-.476-.976A14.4 14.4 0 0 0 3.868 3.77C1.546 7.28.916 10.703 1.231 14.077a14.7 14.7 0 0 0 4.5 2.306q.545-.748.965-1.587a9.5 9.5 0 0 1-1.518-.74q.191-.14.372-.293c2.927 1.369 6.107 1.369 8.999 0q.183.152.372.294-.723.437-1.52.74.418.838.963 1.588a14.6 14.6 0 0 0 4.504-2.308c.37-3.911-.63-7.302-2.644-10.309m-9.13 8.234c-.878 0-1.599-.82-1.599-1.82 0-.998.705-1.82 1.6-1.82.894 0 1.614.82 1.599 1.82.001 1-.705 1.82-1.6 1.82m5.91 0c-.878 0-1.599-.82-1.599-1.82 0-.998.705-1.82 1.6-1.82.893 0 1.614.82 1.599 1.82 0 1-.706 1.82-1.6 1.82"/>
  </symbol>
  <symbol id="documentation-icon" viewBox="0 0 21 20">
    <path fill="none" stroke="#aa3bff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.35" d="m15.5 13.333 1.533 1.322c.645.555.967.833.967 1.178s-.322.623-.967 1.179L15.5 18.333m-3.333-5-1.534 1.322c-.644.555-.966.833-.966 1.178s.322.623.966 1.179l1.534 1.321"/>
    <path fill="none" stroke="#aa3bff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.35" d="M17.167 10.836v-4.32c0-1.41 0-2.117-.224-2.68-.359-.906-1.118-1.621-2.08-1.96-.599-.21-1.349-.21-2.848-.21-2.623 0-3.935 0-4.983.369-1.684.591-3.013 1.842-3.641 3.428C3 6.449 3 7.684 3 10.154v2.122c0 2.558 0 3.838.706 4.726q.306.383.713.671c.76.536 1.79.64 3.581.66"/>
    <path fill="none" stroke="#aa3bff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.35" d="M3 10a2.78 2.78 0 0 1 2.778-2.778c.555 0 1.209.097 1.748-.047.48-.129.854-.503.982-.982.145-.54.048-1.194.048-1.749a2.78 2.78 0 0 1 2.777-2.777"/>
  </symbol>
  <symbol id="github-icon" viewBox="0 0 19 19">
    <path fill="#08060d" fill-rule="evenodd" d="M9.356 1.85C5.05 1.85 1.57 5.356 1.57 9.694a7.84 7.84 0 0 0 5.324 7.44c.387.079.528-.168.528-.376 0-.182-.013-.805-.013-1.454-2.165.467-2.616-.935-2.616-.935-.349-.91-.864-1.143-.864-1.143-.71-.48.051-.48.051-.48.787.051 1.2.805 1.2.805.695 1.194 1.817.857 2.268.649.064-.507.27-.857.49-1.052-1.728-.182-3.545-.857-3.545-3.87 0-.857.31-1.558.8-2.104-.078-.195-.349-1 .077-2.078 0 0 .657-.208 2.14.805a7.5 7.5 0 0 1 1.946-.26c.657 0 1.328.092 1.946.26 1.483-1.013 2.14-.805 2.14-.805.426 1.078.155 1.883.078 2.078.502.546.799 1.247.799 2.104 0 3.013-1.818 3.675-3.558 3.87.284.247.528.714.528 1.454 0 1.052-.012 1.896-.012 2.156 0 .208.142.455.528.377a7.84 7.84 0 0 0 5.324-7.441c.013-4.338-3.48-7.844-7.773-7.844" clip-rule="evenodd"/>
  </symbol>
  <symbol id="social-icon" viewBox="0 0 20 20">
    <path fill="none" stroke="#aa3bff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.35" d="M12.5 6.667a4.167 4.167 0 1 0-8.334 0 4.167 4.167 0 0 0 8.334 0"/>
    <path fill="none" stroke="#aa3bff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.35" d="M2.5 16.667a5.833 5.833 0 0 1 8.75-5.053m3.837.474.513 1.035c.07.144.257.282.414.309l.93.155c.596.1.736.536.307.965l-.723.73a.64.64 0 0 0-.152.531l.207.903c.164.715-.213.991-.84.618l-.872-.52a.63.63 0 0 0-.577 0l-.872.52c-.624.373-1.003.094-.84-.618l.207-.903a.64.64 0 0 0-.152-.532l-.723-.729c-.426-.43-.289-.864.306-.964l.93-.156a.64.64 0 0 0 .412-.31l.513-1.034c.28-.562.735-.562 1.012 0"/>
  </symbol>
  <symbol id="x-icon" viewBox="0 0 19 19">
    <path fill="#08060d" fill-rule="evenodd" d="M1.893 1.98c.052.072 1.245 1.769 2.653 3.77l2.892 4.114c.183.261.333.48.333.486s-.068.089-.152.183l-.522.593-.765.867-3.597 4.087c-.375.426-.734.834-.798.905a1 1 0 0 0-.118.148c0 .01.236.017.664.017h.663l.729-.83c.4-.457.796-.906.879-.999a692 692 0 0 0 1.794-2.038c.034-.037.301-.34.594-.675l.551-.624.345-.392a7 7 0 0 1 .34-.374c.006 0 .93 1.306 2.052 2.903l2.084 2.965.045.063h2.275c1.87 0 2.273-.003 2.266-.021-.008-.02-1.098-1.572-3.894-5.547-2.013-2.862-2.28-3.246-2.273-3.266.008-.019.282-.332 2.085-2.38l2-2.274 1.567-1.782c.022-.028-.016-.03-.65-.03h-.674l-.3.342a871 871 0 0 1-1.782 2.025c-.067.075-.405.458-.75.852a100 100 0 0 1-.803.91c-.148.172-.299.344-.99 1.127-.304.343-.32.358-.345.327-.015-.019-.904-1.282-1.976-2.808L6.365 1.85H1.8zm1.782.91 8.078 11.294c.772 1.08 1.413 1.973 1.425 1.984.016.017.241.02 1.05.017l1.03-.004-2.694-3.766L7.796 5.75 5.722 2.852l-1.039-.004-1.039-.004z" clip-rule="evenodd"/>
  </symbol>
</svg>
```

### src/main.tsx

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

### src/index.css

```css
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
@import 'tailwindcss';

:root {
  --lab-white: #ffffff;
  --lab-black: #000000;
  --lab-orange: #ff6a00;
}

* {
  box-sizing: border-box;
}

html,
body,
#root {
  min-height: 100%;
}

body {
  margin: 0;
  font-family: 'Manrope', 'Segoe UI', sans-serif;
  color: #111;
  background: linear-gradient(180deg, #ffffff 0%, #f4f4f5 50%, #ffffff 100%);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

::-webkit-scrollbar {
  width: 9px;
  height: 9px;
}

::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 999px;
}
```

### src/App.css

```css
.counter {
  font-size: 16px;
  padding: 5px 10px;
  border-radius: 5px;
  color: var(--accent);
  background: var(--accent-bg);
  border: 2px solid transparent;
  transition: border-color 0.3s;
  margin-bottom: 24px;

  &:hover {
    border-color: var(--accent-border);
  }
  &:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }
}

.hero {
  position: relative;

  .base,
  .framework,
  .vite {
    inset-inline: 0;
    margin: 0 auto;
  }

  .base {
    width: 170px;
    position: relative;
    z-index: 0;
  }

  .framework,
  .vite {
    position: absolute;
  }

  .framework {
    z-index: 1;
    top: 34px;
    height: 28px;
    transform: perspective(2000px) rotateZ(300deg) rotateX(44deg) rotateY(39deg)
      scale(1.4);
  }

  .vite {
    z-index: 0;
    top: 107px;
    height: 26px;
    width: auto;
    transform: perspective(2000px) rotateZ(300deg) rotateX(40deg) rotateY(39deg)
      scale(0.8);
  }
}

#center {
  display: flex;
  flex-direction: column;
  gap: 25px;
  place-content: center;
  place-items: center;
  flex-grow: 1;

  @media (max-width: 1024px) {
    padding: 32px 20px 24px;
    gap: 18px;
  }
}

#next-steps {
  display: flex;
  border-top: 1px solid var(--border);
  text-align: left;

  & > div {
    flex: 1 1 0;
    padding: 32px;
    @media (max-width: 1024px) {
      padding: 24px 20px;
    }
  }

  .icon {
    margin-bottom: 16px;
    width: 22px;
    height: 22px;
  }

  @media (max-width: 1024px) {
    flex-direction: column;
    text-align: center;
  }
}

#docs {
  border-right: 1px solid var(--border);

  @media (max-width: 1024px) {
    border-right: none;
    border-bottom: 1px solid var(--border);
  }
}

#next-steps ul {
  list-style: none;
  padding: 0;
  display: flex;
  gap: 8px;
  margin: 32px 0 0;

  .logo {
    height: 18px;
  }

  a {
    color: var(--text-h);
    font-size: 16px;
    border-radius: 6px;
    background: var(--social-bg);
    display: flex;
    padding: 6px 12px;
    align-items: center;
    gap: 8px;
    text-decoration: none;
    transition: box-shadow 0.3s;

    &:hover {
      box-shadow: var(--shadow);
    }
    .button-icon {
      height: 18px;
      width: 18px;
    }
  }

  @media (max-width: 1024px) {
    margin-top: 20px;
    flex-wrap: wrap;
    justify-content: center;

    li {
      flex: 1 1 calc(50% - 8px);
    }

    a {
      width: 100%;
      justify-content: center;
      box-sizing: border-box;
    }
  }
}

#spacer {
  height: 88px;
  border-top: 1px solid var(--border);
  @media (max-width: 1024px) {
    height: 48px;
  }
}

.ticks {
  position: relative;
  width: 100%;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: -4.5px;
    border: 5px solid transparent;
  }

  &::before {
    left: 0;
    border-left-color: var(--border);
  }
  &::after {
    right: 0;
    border-right-color: var(--border);
  }
}
```

### src/types/turing.ts

```ts
export type Move = 'L' | 'R' | 'S'

export type Mode = 'single' | 'multi' | 'nondet' | 'universal'

export interface SingleTransition {
    newState: string
    write: string
    move: Move
}

export interface MultiTransition {
    newState: string
    writes: string[]
    moves: Move[]
}

export interface SingleMachine {
    states: string[]
    inputAlphabet: string[]
    tapeAlphabet: string[]
    transitions: Record<string, SingleTransition[]>
    startState: string
    acceptState: string
    rejectState: string
    blankSymbol: string
}

export interface MultiMachine {
    states: string[]
    tapesCount: number
    transitions: Record<string, MultiTransition[]>
    startState: string
    acceptState: string
    rejectState: string
    blankSymbol: string
}

export interface TapeSnapshot {
    tape: string[]
    head: number
}

export interface SingleSnapshot {
    state: string
    tape: string[]
    head: number
    steps: number
    halted: boolean
    result: 'accept' | 'reject' | 'running'
    currentSymbol: string
    lastTransition: string
    explanation: string
}

export interface MultiSnapshot {
    state: string
    tapes: string[][]
    heads: number[]
    steps: number
    halted: boolean
    result: 'accept' | 'reject' | 'running'
    currentSymbols: string[]
    lastTransition: string
    explanation: string
}

export interface NondetBranch {
    id: string
    parentId?: string
    state: string
    tape: string[]
    head: number
    halted: boolean
    result: 'accept' | 'reject' | 'running'
    depth: number
    label: string
}

export interface NondetSnapshot {
    branches: NondetBranch[]
    steps: number
    halted: boolean
    acceptedBranchId?: string
    explanation: string
}

export interface UniversalSnapshot {
    encoded: string
    decodedOk: boolean
    decodeMessage: string
    inner: SingleSnapshot
}

export interface ComplexityPoint {
    inputSize: number
    steps: number
    tapeUsage: number
    mode: Mode
}

export interface MachinePreset {
    id: string
    name: string
    description: string
    mode: Mode
    machine: SingleMachine | MultiMachine | string
    sampleInput: string
}
```

### src/data/presets.ts

```ts
import type { MachinePreset, MultiMachine, SingleMachine } from '../types/turing'

export const binaryIncrementer: SingleMachine = {
    states: ['q0', 'q1', 'qAccept', 'qReject'],
    inputAlphabet: ['0', '1'],
    tapeAlphabet: ['0', '1', '_'],
    startState: 'q0',
    acceptState: 'qAccept',
    rejectState: 'qReject',
    blankSymbol: '_',
    transitions: {
        'q0|0': [{ newState: 'q0', write: '0', move: 'R' }],
        'q0|1': [{ newState: 'q0', write: '1', move: 'R' }],
        'q0|_': [{ newState: 'q1', write: '_', move: 'L' }],
        'q1|1': [{ newState: 'q1', write: '0', move: 'L' }],
        'q1|0': [{ newState: 'qAccept', write: '1', move: 'S' }],
        'q1|_': [{ newState: 'qAccept', write: '1', move: 'S' }],
    },
}

export const palindromeChecker: SingleMachine = {
    states: ['q0', 'qR0', 'qR1', 'qL', 'qAccept', 'qReject'],
    inputAlphabet: ['0', '1'],
    tapeAlphabet: ['0', '1', 'X', '_'],
    startState: 'q0',
    acceptState: 'qAccept',
    rejectState: 'qReject',
    blankSymbol: '_',
    transitions: {
        'q0|X': [{ newState: 'q0', write: 'X', move: 'R' }],
        'q0|0': [{ newState: 'qR0', write: 'X', move: 'R' }],
        'q0|1': [{ newState: 'qR1', write: 'X', move: 'R' }],
        'q0|_': [{ newState: 'qAccept', write: '_', move: 'S' }],

        'qR0|0': [{ newState: 'qR0', write: '0', move: 'R' }],
        'qR0|1': [{ newState: 'qR0', write: '1', move: 'R' }],
        'qR0|X': [{ newState: 'qR0', write: 'X', move: 'R' }],
        'qR0|_': [{ newState: 'qL', write: '_', move: 'L' }],

        'qR1|0': [{ newState: 'qR1', write: '0', move: 'R' }],
        'qR1|1': [{ newState: 'qR1', write: '1', move: 'R' }],
        'qR1|X': [{ newState: 'qR1', write: 'X', move: 'R' }],
        'qR1|_': [{ newState: 'qL', write: '_', move: 'L' }],

        'qL|X': [{ newState: 'qL', write: 'X', move: 'L' }],
        'qL|0': [{ newState: 'q0', write: 'X', move: 'L' }],
        'qL|1': [{ newState: 'q0', write: 'X', move: 'L' }],
        'qL|_': [{ newState: 'q0', write: '_', move: 'R' }],
    },
}

export const anbnRecognizer: SingleMachine = {
    states: ['q0', 'q1', 'q2', 'qAccept', 'qReject'],
    inputAlphabet: ['a', 'b'],
    tapeAlphabet: ['a', 'b', 'X', 'Y', '_'],
    startState: 'q0',
    acceptState: 'qAccept',
    rejectState: 'qReject',
    blankSymbol: '_',
    transitions: {
        'q0|X': [{ newState: 'q0', write: 'X', move: 'R' }],
        'q0|a': [{ newState: 'q1', write: 'X', move: 'R' }],
        'q0|Y': [{ newState: 'q0', write: 'Y', move: 'R' }],
        'q0|_': [{ newState: 'qAccept', write: '_', move: 'S' }],

        'q1|a': [{ newState: 'q1', write: 'a', move: 'R' }],
        'q1|Y': [{ newState: 'q1', write: 'Y', move: 'R' }],
        'q1|b': [{ newState: 'q2', write: 'Y', move: 'L' }],

        'q2|a': [{ newState: 'q2', write: 'a', move: 'L' }],
        'q2|X': [{ newState: 'q0', write: 'X', move: 'R' }],
        'q2|Y': [{ newState: 'q2', write: 'Y', move: 'L' }],
    },
}

export const copierMultiTape: MultiMachine = {
    states: ['q0', 'q1', 'qAccept', 'qReject'],
    tapesCount: 2,
    startState: 'q0',
    acceptState: 'qAccept',
    rejectState: 'qReject',
    blankSymbol: '_',
    transitions: {
        'q0|0,_': [{ newState: 'q0', writes: ['0', '0'], moves: ['R', 'R'] }],
        'q0|1,_': [{ newState: 'q0', writes: ['1', '1'], moves: ['R', 'R'] }],
        'q0|_,_': [{ newState: 'qAccept', writes: ['_', '_'], moves: ['S', 'S'] }],
    },
}

export const presets: MachinePreset[] = [
    {
        id: 'binary-increment',
        name: 'Binary Incrementer',
        description: 'Adds 1 to a binary integer on a single tape.',
        mode: 'single',
        machine: binaryIncrementer,
        sampleInput: '1011',
    },
    {
        id: 'palindrome-checker',
        name: 'Palindrome Checker',
        description: 'Marks matching symbols from ends toward center.',
        mode: 'single',
        machine: palindromeChecker,
        sampleInput: '0110',
    },
    {
        id: 'anbn-recognizer',
        name: 'a^n b^n Recognizer',
        description: 'Marks paired a and b symbols to verify balanced structure.',
        mode: 'single',
        machine: anbnRecognizer,
        sampleInput: 'aaabbb',
    },
    {
        id: 'string-copier',
        name: 'String Copier (2-Tape)',
        description: 'Copies tape 1 input to tape 2 symbol by symbol.',
        mode: 'multi',
        machine: copierMultiTape,
        sampleInput: '101001',
    },
    {
        id: 'universal-binary',
        name: 'Universal: Encoded Incrementer',
        description: 'Loads encoded single-tape machine into universal mode.',
        mode: 'universal',
        machine: JSON.stringify(binaryIncrementer, null, 2),
        sampleInput: '111',
    },
]
```

### src/engine/simulator.ts

```ts
import type {
    MultiMachine,
    MultiSnapshot,
    MultiTransition,
    NondetBranch,
    NondetSnapshot,
    SingleMachine,
    SingleSnapshot,
    SingleTransition,
    UniversalSnapshot,
} from '../types/turing'

const clampIndex = (idx: number) => Math.max(0, idx)

const ensureCell = (tape: string[], index: number, blankSymbol: string) => {
    while (index >= tape.length) tape.push(blankSymbol)
    return tape[index] ?? blankSymbol
}

const moveHead = (head: number, move: 'L' | 'R' | 'S') => {
    if (move === 'L') return clampIndex(head - 1)
    if (move === 'R') return head + 1
    return head
}

const singleKey = (state: string, symbol: string) => `${state}|${symbol}`

const multiKey = (state: string, symbols: string[]) => `${state}|${symbols.join(',')}`

export const initializeSingle = (machine: SingleMachine, input: string): SingleSnapshot => {
    const tape = input.length > 0 ? input.split('') : [machine.blankSymbol]
    const currentSymbol = tape[0] ?? machine.blankSymbol

    return {
        state: machine.startState,
        tape,
        head: 0,
        steps: 0,
        halted: false,
        result: 'running',
        currentSymbol,
        lastTransition: 'None',
        explanation: 'Machine initialized and ready to run.',
    }
}

export const stepSingle = (machine: SingleMachine, snapshot: SingleSnapshot): SingleSnapshot => {
    if (snapshot.halted) return snapshot

    const tape = [...snapshot.tape]
    const symbol = ensureCell(tape, snapshot.head, machine.blankSymbol)
    const transitions = machine.transitions[singleKey(snapshot.state, symbol)] ?? []
    const transition = transitions[0]

    if (!transition) {
        return {
            ...snapshot,
            tape,
            currentSymbol: symbol,
            steps: snapshot.steps + 1,
            halted: true,
            result: 'reject',
            lastTransition: `δ(${snapshot.state}, ${symbol}) is undefined`,
            explanation: `No transition is defined for state ${snapshot.state} while reading ${symbol}. The machine halts and rejects.`,
        }
    }

    tape[snapshot.head] = transition.write
    const nextHead = moveHead(snapshot.head, transition.move)
    ensureCell(tape, nextHead, machine.blankSymbol)
    const nextSymbol = tape[nextHead] ?? machine.blankSymbol
    const halted = transition.newState === machine.acceptState || transition.newState === machine.rejectState

    return {
        ...snapshot,
        tape,
        head: nextHead,
        state: transition.newState,
        currentSymbol: nextSymbol,
        steps: snapshot.steps + 1,
        halted,
        result: transition.newState === machine.acceptState ? 'accept' : transition.newState === machine.rejectState ? 'reject' : 'running',
        lastTransition: `δ(${snapshot.state}, ${symbol}) → (${transition.newState}, ${transition.write}, ${transition.move})`,
        explanation: `Reading ${symbol} in state ${snapshot.state}, writing ${transition.write}, moving ${transition.move === 'L' ? 'left' : transition.move === 'R' ? 'right' : 'stay'}, and transitioning to ${transition.newState}.`,
    }
}

export const initializeMulti = (machine: MultiMachine, input: string): MultiSnapshot => {
    const tapes = Array.from({ length: machine.tapesCount }, (_, idx) => {
        if (idx === 0) return input.length ? input.split('') : [machine.blankSymbol]
        return [machine.blankSymbol]
    })

    return {
        state: machine.startState,
        tapes,
        heads: Array.from({ length: machine.tapesCount }, () => 0),
        steps: 0,
        halted: false,
        result: 'running',
        currentSymbols: tapes.map((tape) => tape[0] ?? machine.blankSymbol),
        lastTransition: 'None',
        explanation: 'Multi-tape machine initialized.',
    }
}

export const stepMulti = (machine: MultiMachine, snapshot: MultiSnapshot): MultiSnapshot => {
    if (snapshot.halted) return snapshot

    const tapes = snapshot.tapes.map((t) => [...t])
    const symbols = tapes.map((tape, idx) => ensureCell(tape, snapshot.heads[idx], machine.blankSymbol))
    const transitions = machine.transitions[multiKey(snapshot.state, symbols)] ?? []
    const transition = transitions[0]

    if (!transition) {
        return {
            ...snapshot,
            tapes,
            currentSymbols: symbols,
            halted: true,
            result: 'reject',
            steps: snapshot.steps + 1,
            lastTransition: `δ(${snapshot.state}, [${symbols.join(',')}]) is undefined`,
            explanation: `No valid multi-tape transition exists from state ${snapshot.state}. The machine rejects.`,
        }
    }

    const heads = [...snapshot.heads]

    tapes.forEach((tape, idx) => {
        tape[heads[idx]] = transition.writes[idx] ?? machine.blankSymbol
        heads[idx] = moveHead(heads[idx], transition.moves[idx] ?? 'S')
        ensureCell(tape, heads[idx], machine.blankSymbol)
    })

    const currentSymbols = tapes.map((tape, idx) => tape[heads[idx]] ?? machine.blankSymbol)
    const halted = transition.newState === machine.acceptState || transition.newState === machine.rejectState

    return {
        ...snapshot,
        state: transition.newState,
        tapes,
        heads,
        currentSymbols,
        steps: snapshot.steps + 1,
        halted,
        result: transition.newState === machine.acceptState ? 'accept' : transition.newState === machine.rejectState ? 'reject' : 'running',
        lastTransition: `δ(${snapshot.state}, [${symbols.join(',')}]) → (${transition.newState}, [${transition.writes.join(',')}], [${transition.moves.join(',')}])`,
        explanation: `Reading [${symbols.join(', ')}], writing [${transition.writes.join(', ')}], moving heads [${transition.moves.join(', ')}], then entering ${transition.newState}.`,
    }
}

const branchStep = (
    machine: SingleMachine,
    branch: NondetBranch,
    idSeed: number,
): { spawned: NondetBranch[]; nextSeed: number } => {
    if (branch.halted) return { spawned: [branch], nextSeed: idSeed }

    const tape = [...branch.tape]
    const symbol = ensureCell(tape, branch.head, machine.blankSymbol)
    const transitions = machine.transitions[singleKey(branch.state, symbol)] ?? []

    if (transitions.length === 0) {
        return {
            spawned: [
                {
                    ...branch,
                    tape,
                    halted: true,
                    result: 'reject',
                    label: `${branch.label} · reject`,
                },
            ],
            nextSeed: idSeed,
        }
    }

    let localSeed = idSeed

    const spawned = transitions.map((transition: SingleTransition) => {
        const nextTape = [...tape]
        nextTape[branch.head] = transition.write
        const nextHead = moveHead(branch.head, transition.move)
        ensureCell(nextTape, nextHead, machine.blankSymbol)
        localSeed += 1
        const halted = transition.newState === machine.acceptState || transition.newState === machine.rejectState
        const result: NondetBranch['result'] = transition.newState === machine.acceptState ? 'accept' : transition.newState === machine.rejectState ? 'reject' : 'running'

        return {
            id: `b-${localSeed}`,
            parentId: branch.id,
            state: transition.newState,
            tape: nextTape,
            head: nextHead,
            depth: branch.depth + 1,
            halted,
            result,
            label: `${branch.state}/${symbol}→${transition.newState}`,
        }
    })

    return { spawned, nextSeed: localSeed }
}

export const initializeNondet = (machine: SingleMachine, input: string): NondetSnapshot => {
    const initialTape = input.length > 0 ? input.split('') : [machine.blankSymbol]

    return {
        branches: [
            {
                id: 'b-0',
                state: machine.startState,
                tape: initialTape,
                head: 0,
                halted: false,
                result: 'running',
                depth: 0,
                label: 'root',
            },
        ],
        steps: 0,
        halted: false,
        explanation: 'Nondeterministic root branch initialized.',
    }
}

export const stepNondet = (machine: SingleMachine, snapshot: NondetSnapshot): NondetSnapshot => {
    if (snapshot.halted) return snapshot

    let seed = snapshot.branches.length
    const nextBranches: NondetBranch[] = []

    snapshot.branches.forEach((branch) => {
        const { spawned, nextSeed } = branchStep(machine, branch, seed)
        seed = nextSeed
        nextBranches.push(...spawned)
    })

    const limited = nextBranches.slice(0, 64)
    const accepted = limited.find((branch) => branch.result === 'accept')
    const halted = Boolean(accepted) || limited.every((branch) => branch.halted)

    return {
        branches: limited,
        steps: snapshot.steps + 1,
        halted,
        acceptedBranchId: accepted?.id,
        explanation: accepted
            ? `A branch reached an accepting state (${accepted.state}).`
            : `Expanded to ${limited.length} branches at depth ${Math.max(...limited.map((b) => b.depth))}.`,
    }
}

const parseEncodedMachine = (encoded: string): { ok: true; machine: SingleMachine } | { ok: false; reason: string } => {
    try {
        const parsed = JSON.parse(encoded) as SingleMachine
        if (!parsed.startState || !parsed.acceptState || !parsed.rejectState || !parsed.transitions) {
            return { ok: false, reason: 'Encoded machine is missing required fields.' }
        }
        return { ok: true, machine: parsed }
    } catch {
        return { ok: false, reason: 'Encoded machine must be valid JSON.' }
    }
}

export const initializeUniversal = (encoded: string, input: string): UniversalSnapshot => {
    const decoded = parseEncodedMachine(encoded)

    if (!decoded.ok) {
        return {
            encoded,
            decodedOk: false,
            decodeMessage: decoded.reason,
            inner: {
                state: 'decode-error',
                tape: input ? input.split('') : ['_'],
                head: 0,
                steps: 0,
                halted: true,
                result: 'reject',
                currentSymbol: input[0] ?? '_',
                lastTransition: 'None',
                explanation: decoded.reason,
            },
        }
    }

    return {
        encoded,
        decodedOk: true,
        decodeMessage: 'Encoded machine decoded successfully.',
        inner: initializeSingle(decoded.machine, input),
    }
}

export const stepUniversal = (snapshot: UniversalSnapshot): UniversalSnapshot => {
    const decoded = parseEncodedMachine(snapshot.encoded)
    if (!decoded.ok) {
        return {
            ...snapshot,
            decodedOk: false,
            decodeMessage: decoded.reason,
            inner: {
                ...snapshot.inner,
                halted: true,
                result: 'reject',
                explanation: decoded.reason,
            },
        }
    }

    return {
        ...snapshot,
        decodedOk: true,
        decodeMessage: 'Decoding complete. Executing one interpreted step.',
        inner: stepSingle(decoded.machine, snapshot.inner),
    }
}

export const summarizeTapeUsage = (tape: string[], blankSymbol: string) => tape.filter((s) => s !== blankSymbol).length

export const summarizeMultiTapeUsage = (tapes: string[][], blankSymbol: string) =>
    tapes.reduce((acc, tape) => acc + tape.filter((s) => s !== blankSymbol).length, 0)

export const flattenSingleTransitions = (machine: SingleMachine) => {
    const output: Array<{ from: string; read: string; transition: SingleTransition }> = []
    Object.entries(machine.transitions).forEach(([key, transitions]) => {
        const [from, read] = key.split('|')
        transitions.forEach((transition) => output.push({ from, read, transition }))
    })
    return output
}

export const flattenMultiTransitions = (machine: MultiMachine) => {
    const output: Array<{ from: string; reads: string[]; transition: MultiTransition }> = []
    Object.entries(machine.transitions).forEach(([key, transitions]) => {
        const [from, reads] = key.split('|')
        transitions.forEach((transition) => output.push({ from, reads: reads.split(','), transition }))
    })
    return output
}
```

### src/store/turingStore.ts

```ts
import { create } from 'zustand'
import { presets, binaryIncrementer, copierMultiTape } from '../data/presets'
import {
    flattenMultiTransitions,
    flattenSingleTransitions,
    initializeMulti,
    initializeNondet,
    initializeSingle,
    initializeUniversal,
    stepMulti,
    stepNondet,
    stepSingle,
    stepUniversal,
    summarizeMultiTapeUsage,
    summarizeTapeUsage,
} from '../engine/simulator'
import type { ComplexityPoint, Mode, MultiMachine, MultiSnapshot, NondetSnapshot, SingleMachine, SingleSnapshot, UniversalSnapshot } from '../types/turing'

interface TuringState {
    mode: Mode
    running: boolean
    speed: number
    input: string
    singleMachine: SingleMachine
    multiMachine: MultiMachine
    nondetMachine: SingleMachine
    universalEncoded: string
    singleSnapshot: SingleSnapshot
    multiSnapshot: MultiSnapshot
    nondetSnapshot: NondetSnapshot
    universalSnapshot: UniversalSnapshot
    machineEditor: string
    explainHistory: string[]
    activeTransition: string
    validationError: string
    complexityData: ComplexityPoint[]
    selectedPreset: string
    setMode: (mode: Mode) => void
    setSpeed: (speed: number) => void
    setInput: (input: string) => void
    setRunning: (running: boolean) => void
    step: () => void
    reset: () => void
    updateMachineEditor: (raw: string) => void
    applyEditorMachine: () => void
    loadPreset: (id: string) => void
}

const universalSeed = JSON.stringify(binaryIncrementer, null, 2)

const safeParse = <T,>(raw: string): { ok: true; value: T } | { ok: false; reason: string } => {
    try {
        return { ok: true, value: JSON.parse(raw) as T }
    } catch {
        return { ok: false, reason: 'JSON parsing failed. Please check syntax.' }
    }
}

const appendExplain = (history: string[], explanation: string) => [explanation, ...history].slice(0, 20)

export const useTuringStore = create<TuringState>((set, get) => ({
    mode: 'single',
    running: false,
    speed: 700,
    input: '1011',
    singleMachine: binaryIncrementer,
    multiMachine: copierMultiTape,
    nondetMachine: {
        ...binaryIncrementer,
        transitions: {
            ...binaryIncrementer.transitions,
            'q0|1': [
                { newState: 'q0', write: '1', move: 'R' },
                { newState: 'q1', write: '1', move: 'L' },
            ],
        },
    },
    universalEncoded: universalSeed,
    singleSnapshot: initializeSingle(binaryIncrementer, '1011'),
    multiSnapshot: initializeMulti(copierMultiTape, '1011'),
    nondetSnapshot: initializeNondet(
        {
            ...binaryIncrementer,
            transitions: {
                ...binaryIncrementer.transitions,
                'q0|1': [
                    { newState: 'q0', write: '1', move: 'R' },
                    { newState: 'q1', write: '1', move: 'L' },
                ],
            },
        },
        '1011',
    ),
    universalSnapshot: initializeUniversal(universalSeed, '1011'),
    machineEditor: JSON.stringify(binaryIncrementer, null, 2),
    explainHistory: ['Welcome to TuringLab. Configure a machine and press Run.'],
    activeTransition: 'None',
    validationError: '',
    complexityData: [],
    selectedPreset: presets[0].id,

    setMode: (mode) =>
        set((state) => ({
            mode,
            running: false,
            validationError: '',
            machineEditor:
                mode === 'single'
                    ? JSON.stringify(state.singleMachine, null, 2)
                    : mode === 'multi'
                        ? JSON.stringify(state.multiMachine, null, 2)
                        : mode === 'nondet'
                            ? JSON.stringify(state.nondetMachine, null, 2)
                            : state.universalEncoded,
        })),

    setSpeed: (speed) => set({ speed }),
    setInput: (input) => set({ input }),
    setRunning: (running) => set({ running }),

    step: () => {
        const state = get()

        if (state.mode === 'single') {
            const next = stepSingle(state.singleMachine, state.singleSnapshot)
            const halted = next.halted
            set((prev) => ({
                singleSnapshot: next,
                activeTransition: next.lastTransition,
                running: halted ? false : prev.running,
                explainHistory: appendExplain(prev.explainHistory, next.explanation),
                complexityData: halted
                    ? [
                        ...prev.complexityData,
                        {
                            inputSize: prev.input.length,
                            steps: next.steps,
                            tapeUsage: summarizeTapeUsage(next.tape, prev.singleMachine.blankSymbol),
                            mode: 'single',
                        },
                    ]
                    : prev.complexityData,
            }))
            return
        }

        if (state.mode === 'multi') {
            const next = stepMulti(state.multiMachine, state.multiSnapshot)
            const halted = next.halted
            set((prev) => ({
                multiSnapshot: next,
                activeTransition: next.lastTransition,
                running: halted ? false : prev.running,
                explainHistory: appendExplain(prev.explainHistory, next.explanation),
                complexityData: halted
                    ? [
                        ...prev.complexityData,
                        {
                            inputSize: prev.input.length,
                            steps: next.steps,
                            tapeUsage: summarizeMultiTapeUsage(next.tapes, prev.multiMachine.blankSymbol),
                            mode: 'multi',
                        },
                    ]
                    : prev.complexityData,
            }))
            return
        }

        if (state.mode === 'nondet') {
            const next = stepNondet(state.nondetMachine, state.nondetSnapshot)
            const accepted = next.branches.find((branch) => branch.result === 'accept')
            set((prev) => ({
                nondetSnapshot: next,
                activeTransition: accepted ? `Accepted on ${accepted.id}` : `Branches: ${next.branches.length}`,
                running: next.halted ? false : prev.running,
                explainHistory: appendExplain(prev.explainHistory, next.explanation),
                complexityData: next.halted
                    ? [
                        ...prev.complexityData,
                        {
                            inputSize: prev.input.length,
                            steps: next.steps,
                            tapeUsage: next.branches.length,
                            mode: 'nondet',
                        },
                    ]
                    : prev.complexityData,
            }))
            return
        }

        const next = stepUniversal(state.universalSnapshot)
        set((prev) => ({
            universalSnapshot: next,
            activeTransition: next.inner.lastTransition,
            running: next.inner.halted ? false : prev.running,
            explainHistory: appendExplain(prev.explainHistory, `${next.decodeMessage} ${next.inner.explanation}`),
            complexityData: next.inner.halted
                ? [
                    ...prev.complexityData,
                    {
                        inputSize: prev.input.length,
                        steps: next.inner.steps,
                        tapeUsage: summarizeTapeUsage(next.inner.tape, '_'),
                        mode: 'universal',
                    },
                ]
                : prev.complexityData,
        }))
    },

    reset: () => {
        const state = get()
        set((prev) => ({
            running: false,
            singleSnapshot: initializeSingle(state.singleMachine, state.input),
            multiSnapshot: initializeMulti(state.multiMachine, state.input),
            nondetSnapshot: initializeNondet(state.nondetMachine, state.input),
            universalSnapshot: initializeUniversal(state.universalEncoded, state.input),
            activeTransition: 'None',
            explainHistory: appendExplain(prev.explainHistory, 'Simulation reset.'),
        }))
    },

    updateMachineEditor: (raw) => set({ machineEditor: raw }),

    applyEditorMachine: () => {
        const state = get()

        if (state.mode === 'universal') {
            set({ universalEncoded: state.machineEditor, validationError: '' })
            get().reset()
            return
        }

        if (state.mode === 'multi') {
            const parsed = safeParse<MultiMachine>(state.machineEditor)
            if (!parsed.ok || !parsed.value.tapesCount) {
                set({ validationError: parsed.ok ? 'Multi-tape machine must define tapesCount.' : parsed.reason })
                return
            }
            set({ multiMachine: parsed.value, validationError: '' })
            get().reset()
            return
        }

        const parsed = safeParse<SingleMachine>(state.machineEditor)
        if (!parsed.ok || !parsed.value.startState || !parsed.value.transitions) {
            set({ validationError: parsed.ok ? 'Machine is missing startState or transitions.' : parsed.reason })
            return
        }

        if (state.mode === 'single') {
            set({ singleMachine: parsed.value, validationError: '' })
        } else {
            set({ nondetMachine: parsed.value, validationError: '' })
        }

        get().reset()
    },

    loadPreset: (id) => {
        const preset = presets.find((p) => p.id === id)
        if (!preset) return

        if (preset.mode === 'single') {
            const machine = preset.machine as SingleMachine
            set({
                mode: 'single',
                selectedPreset: id,
                singleMachine: machine,
                input: preset.sampleInput,
                machineEditor: JSON.stringify(machine, null, 2),
                validationError: '',
            })
            get().reset()
            return
        }

        if (preset.mode === 'multi') {
            const machine = preset.machine as MultiMachine
            set({
                mode: 'multi',
                selectedPreset: id,
                multiMachine: machine,
                input: preset.sampleInput,
                machineEditor: JSON.stringify(machine, null, 2),
                validationError: '',
            })
            get().reset()
            return
        }

        set({
            mode: 'universal',
            selectedPreset: id,
            universalEncoded: preset.machine as string,
            input: preset.sampleInput,
            machineEditor: preset.machine as string,
            validationError: '',
        })
        get().reset()
    },
}))

export const selectGraphData = (state: TuringState) => {
    if (state.mode === 'multi') {
        return flattenMultiTransitions(state.multiMachine).map((edge, index) => ({
            id: `e-${index}`,
            source: edge.from,
            target: edge.transition.newState,
            label: `${edge.reads.join('/')}:${edge.transition.writes.join('/')},${edge.transition.moves.join('/')}`,
        }))
    }

    const parsedUniversal = safeParse<SingleMachine>(state.universalEncoded)
    const machine =
        state.mode === 'nondet'
            ? state.nondetMachine
            : state.mode === 'single'
                ? state.singleMachine
                : parsedUniversal.ok
                    ? parsedUniversal.value
                    : state.singleMachine

    return flattenSingleTransitions(machine).map((edge, index) => ({
        id: `e-${index}`,
        source: edge.from,
        target: edge.transition.newState,
        label: `${edge.read}:${edge.transition.write},${edge.transition.move}`,
    }))
}
```

### src/components/ComplexityPanel.tsx

```tsx
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { ComplexityPoint } from '../types/turing'

interface ComplexityPanelProps {
    data: ComplexityPoint[]
}

export function ComplexityPanel({ data }: ComplexityPanelProps) {
    return (
        <div className="h-72 rounded-3xl border border-white/60 bg-white/55 p-4 backdrop-blur-2xl">
            <h3 className="mb-3 text-base font-semibold text-black">Complexity Analyzer</h3>
            <ResponsiveContainer width="100%" height="88%">
                <LineChart data={data} margin={{ left: 0, right: 18, top: 8, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                    <XAxis dataKey="inputSize" stroke="#3f3f46" />
                    <YAxis stroke="#3f3f46" />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="steps" stroke="#ff6a00" strokeWidth={2.5} dot={{ r: 3 }} name="Steps" />
                    <Line type="monotone" dataKey="tapeUsage" stroke="#111111" strokeWidth={2.1} dot={{ r: 3 }} name="Tape Usage" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}
```

### src/components/ControlPanel.tsx

```tsx
import { Pause, Play, RotateCcw, StepForward } from 'lucide-react'
import { motion } from 'framer-motion'

interface ControlPanelProps {
    running: boolean
    speed: number
    onRunPause: () => void
    onStep: () => void
    onReset: () => void
    onSpeed: (value: number) => void
}

const baseButton =
    'flex items-center gap-2 rounded-2xl border border-white/70 bg-white/70 px-4 py-2 text-sm font-semibold text-zinc-800 shadow-sm backdrop-blur-lg transition hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-[0_0_25px_rgba(255,106,0,0.18)]'

export function ControlPanel({ running, speed, onRunPause, onStep, onReset, onSpeed }: ControlPanelProps) {
    return (
        <motion.div
            layout
            className="rounded-3xl border border-white/60 bg-white/55 p-4 backdrop-blur-2xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className="flex flex-wrap items-center gap-3">
                <button className={baseButton} onClick={onRunPause}>
                    {running ? <Pause size={16} /> : <Play size={16} />}
                    {running ? 'Pause' : 'Run'}
                </button>
                <button className={baseButton} onClick={onStep}>
                    <StepForward size={16} />
                    Step Forward
                </button>
                <button className={baseButton} onClick={onReset}>
                    <RotateCcw size={16} />
                    Reset
                </button>
                <div className="ml-auto flex min-w-56 items-center gap-3 rounded-2xl border border-zinc-200/60 bg-white/90 px-3 py-2">
                    <label htmlFor="speed" className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                        Speed
                    </label>
                    <input
                        id="speed"
                        type="range"
                        min={120}
                        max={1200}
                        step={10}
                        value={speed}
                        onChange={(event) => onSpeed(Number(event.target.value))}
                        className="w-full accent-orange-500"
                    />
                </div>
            </div>
        </motion.div>
    )
}
```

### src/components/ExplanationPanel.tsx

```tsx
import { motion } from 'framer-motion'

interface ExplanationPanelProps {
    history: string[]
}

export function ExplanationPanel({ history }: ExplanationPanelProps) {
    return (
        <div className="rounded-3xl border border-white/60 bg-white/55 p-4 backdrop-blur-2xl">
            <h3 className="mb-3 text-base font-semibold text-black">Explain Mode</h3>
            <div className="max-h-52 space-y-2 overflow-auto pr-2">
                {history.map((line, idx) => (
                    <motion.p
                        key={`${line}-${idx}`}
                        className="rounded-xl bg-white/80 px-3 py-2 text-sm text-zinc-700"
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: idx * 0.02 }}
                    >
                        {line}
                    </motion.p>
                ))}
            </div>
        </div>
    )
}
```

### src/components/LandingOverlay.tsx

```tsx
import { motion } from 'framer-motion'

interface LandingOverlayProps {
    open: boolean
    onStart: () => void
}

export function LandingOverlay({ open, onStart }: LandingOverlayProps) {
    if (!open) return null

    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 p-6 backdrop-blur-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                className="w-full max-w-3xl rounded-[32px] border border-white/70 bg-gradient-to-br from-white via-white to-orange-50 p-10 text-center shadow-[0_35px_70px_rgba(0,0,0,0.12)]"
                initial={{ y: 20, scale: 0.98 }}
                animate={{ y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
            >
                <div className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-orange-600">TuringLab</div>
                <h1 className="text-4xl font-bold leading-tight text-black md:text-6xl">Visual Computing for Turing Machines</h1>
                <p className="mx-auto mt-5 max-w-2xl text-zinc-600">
                    Explore deterministic, multi-tape, nondeterministic, and universal computation with rich animation, explain mode, and graph-level insights.
                </p>
                <button
                    onClick={onStart}
                    className="mt-8 rounded-2xl border border-orange-300 bg-gradient-to-r from-orange-500 to-orange-400 px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(255,106,0,0.35)] transition hover:scale-[1.02]"
                >
                    Start Simulation
                </button>
            </motion.div>
        </motion.div>
    )
}
```

### src/components/ModeNavbar.tsx

```tsx
import { motion } from 'framer-motion'
import { Bot, GitBranchPlus, Layers3, Orbit } from 'lucide-react'
import type { ReactNode } from 'react'
import type { Mode } from '../types/turing'

interface ModeNavbarProps {
    mode: Mode
    onMode: (mode: Mode) => void
}

const items: Array<{ mode: Mode; label: string; icon: ReactNode }> = [
    { mode: 'single', label: 'Single Tape', icon: <Layers3 size={16} /> },
    { mode: 'multi', label: 'Multi Tape', icon: <Bot size={16} /> },
    { mode: 'nondet', label: 'Non-Deterministic', icon: <GitBranchPlus size={16} /> },
    { mode: 'universal', label: 'Universal', icon: <Orbit size={16} /> },
]

export function ModeNavbar({ mode, onMode }: ModeNavbarProps) {
    return (
        <div className="rounded-3xl border border-white/60 bg-white/55 p-3 backdrop-blur-2xl">
            <div className="flex flex-wrap items-center gap-2">
                {items.map((item) => (
                    <button
                        key={item.mode}
                        onClick={() => onMode(item.mode)}
                        className={`relative flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold transition ${mode === item.mode ? 'text-black' : 'text-zinc-600 hover:text-black'
                            }`}
                    >
                        {mode === item.mode ? (
                            <motion.span
                                layoutId="mode-pill"
                                className="absolute inset-0 rounded-2xl border border-orange-300 bg-orange-100"
                                transition={{ type: 'spring', stiffness: 280, damping: 26 }}
                            />
                        ) : null}
                        <span className="relative z-10 flex items-center gap-2">
                            {item.icon}
                            {item.label}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    )
}
```

### src/components/MultiTapeView.tsx

```tsx
import { TapeView } from './TapeView'

interface MultiTapeViewProps {
    tapes: string[][]
    heads: number[]
}

export function MultiTapeView({ tapes, heads }: MultiTapeViewProps) {
    return (
        <div className="space-y-4">
            {tapes.map((tape, idx) => (
                <TapeView key={`tape-${idx}`} tape={tape} head={heads[idx] ?? 0} title={`Tape ${idx + 1}`} />
            ))}
        </div>
    )
}
```

### src/components/NondetTreeView.tsx

```tsx
import { motion } from 'framer-motion'
import type { NondetSnapshot } from '../types/turing'

interface NondetTreeViewProps {
    snapshot: NondetSnapshot
}

export function NondetTreeView({ snapshot }: NondetTreeViewProps) {
    return (
        <div className="rounded-3xl border border-white/60 bg-white/55 p-4 backdrop-blur-2xl">
            <h3 className="mb-3 text-base font-semibold text-black">Branching Execution Tree</h3>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
                {snapshot.branches.map((branch, idx) => (
                    <motion.div
                        key={branch.id}
                        className={`rounded-2xl border px-3 py-2 text-sm ${branch.result === 'accept'
                                ? 'border-emerald-200 bg-emerald-50'
                                : branch.result === 'reject'
                                    ? 'border-rose-200 bg-rose-50'
                                    : 'border-zinc-200 bg-white/85'
                            }`}
                        initial={{ opacity: 0, scale: 0.94 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.22, delay: idx * 0.02 }}
                    >
                        <div className="font-semibold text-zinc-800">{branch.id}</div>
                        <div className="text-zinc-600">state: {branch.state}</div>
                        <div className="text-zinc-600">depth: {branch.depth}</div>
                        <div className="text-zinc-600">from: {branch.parentId ?? 'root'}</div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
```

### src/components/Sidebar.tsx

```tsx
import { useRef } from 'react'
import type { ChangeEvent } from 'react'
import { Download, FileUp, Sparkles } from 'lucide-react'
import { presets } from '../data/presets'
import type { Mode } from '../types/turing'

interface SidebarProps {
    mode: Mode
    input: string
    machineEditor: string
    validationError: string
    selectedPreset: string
    onInput: (value: string) => void
    onEditor: (value: string) => void
    onApply: () => void
    onLoadPreset: (id: string) => void
}

export function Sidebar({
    mode,
    input,
    machineEditor,
    validationError,
    selectedPreset,
    onInput,
    onEditor,
    onApply,
    onLoadPreset,
}: SidebarProps) {
    const importRef = useRef<HTMLInputElement | null>(null)

    const onImport = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = () => {
            const content = String(reader.result ?? '')
            onEditor(content)
        }
        reader.readAsText(file)
    }

    const onExport = () => {
        const blob = new Blob([machineEditor], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const anchor = document.createElement('a')
        anchor.href = url
        anchor.download = `turinglab-${mode}-machine.json`
        anchor.click()
        URL.revokeObjectURL(url)
    }

    return (
        <aside className="rounded-3xl border border-white/60 bg-white/55 p-5 backdrop-blur-2xl">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-black">Machine Config</h2>
                <Sparkles className="text-orange-500" size={18} />
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Preset Library</label>
                    <select
                        value={selectedPreset}
                        onChange={(event) => onLoadPreset(event.target.value)}
                        className="w-full rounded-2xl border border-zinc-200 bg-white/90 px-3 py-2 text-sm"
                    >
                        {presets.map((preset) => (
                            <option key={preset.id} value={preset.id}>
                                {preset.name} ({preset.mode})
                            </option>
                        ))}
                    </select>
                    <p className="text-xs text-zinc-500">{presets.find((preset) => preset.id === selectedPreset)?.description}</p>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Input String</label>
                    <input
                        value={input}
                        onChange={(event) => onInput(event.target.value)}
                        className="w-full rounded-2xl border border-zinc-200 bg-white/90 px-3 py-2 text-sm"
                        placeholder="Enter tape input"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Machine JSON</label>
                    <textarea
                        value={machineEditor}
                        onChange={(event) => onEditor(event.target.value)}
                        className="h-72 w-full rounded-2xl border border-zinc-200 bg-white/90 p-3 font-mono text-xs text-zinc-700"
                        spellCheck={false}
                    />
                </div>

                {validationError ? <p className="rounded-xl bg-rose-50 px-3 py-2 text-xs text-rose-700">{validationError}</p> : null}

                <div className="grid grid-cols-2 gap-2">
                    <button
                        onClick={onApply}
                        className="rounded-2xl border border-orange-300 bg-gradient-to-r from-orange-500 to-orange-400 px-3 py-2 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(255,106,0,0.3)]"
                    >
                        Apply Machine
                    </button>
                    <button
                        onClick={onExport}
                        className="flex items-center justify-center gap-1 rounded-2xl border border-zinc-200 bg-white/90 px-3 py-2 text-sm font-semibold text-zinc-700"
                    >
                        <Download size={14} /> Export
                    </button>
                </div>

                <button
                    onClick={() => importRef.current?.click()}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border border-zinc-200 bg-white/90 px-3 py-2 text-sm font-semibold text-zinc-700"
                >
                    <FileUp size={14} /> Import JSON
                </button>
                <input ref={importRef} type="file" accept="application/json" className="hidden" onChange={onImport} />
            </div>
        </aside>
    )
}
```

### src/components/StatePanel.tsx

```tsx
import { motion } from 'framer-motion'

interface StatePanelProps {
    title: string
    state: string
    symbol: string
    transition: string
    steps: number
    result: string
}

export function StatePanel({ title, state, symbol, transition, steps, result }: StatePanelProps) {
    return (
        <motion.div
            layout
            className="rounded-3xl border border-white/60 bg-white/55 p-5 backdrop-blur-2xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
        >
            <div className="mb-3 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-black">{title}</h3>
                <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${result === 'accept'
                            ? 'bg-emerald-100 text-emerald-700'
                            : result === 'reject'
                                ? 'bg-rose-100 text-rose-700'
                                : 'bg-zinc-100 text-zinc-700'
                        }`}
                >
                    {result}
                </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm text-zinc-700">
                <div className="rounded-2xl bg-white/90 p-3">Current State: <strong>{state}</strong></div>
                <div className="rounded-2xl bg-white/90 p-3">Current Symbol: <strong>{symbol}</strong></div>
                <div className="col-span-2 rounded-2xl bg-white/90 p-3">Transition: <strong>{transition}</strong></div>
                <div className="col-span-2 rounded-2xl bg-white/90 p-3">Steps: <strong>{steps}</strong></div>
            </div>
        </motion.div>
    )
}
```

### src/components/TapeView.tsx

```tsx
import { motion } from 'framer-motion'

interface TapeViewProps {
    tape: string[]
    head: number
    title?: string
    blankSymbol?: string
}

const CELL_SIZE = 56

export function TapeView({ tape, head, title, blankSymbol = '_' }: TapeViewProps) {
    const safeTape = tape.length ? tape : [blankSymbol]
    const windowStart = Math.max(0, head - 10)
    const windowEnd = Math.min(safeTape.length, head + 11)
    const visible = safeTape.slice(windowStart, windowEnd)
    const localHead = head - windowStart

    return (
        <div className="space-y-3">
            {title ? <div className="text-sm font-medium text-zinc-600">{title}</div> : null}
            <div className="relative overflow-hidden rounded-2xl border border-white/60 bg-white/60 p-4 backdrop-blur-xl">
                <motion.div
                    className="flex items-center gap-3"
                    animate={{ x: (10 - localHead) * 2 }}
                    transition={{ type: 'spring', stiffness: 180, damping: 20 }}
                >
                    {visible.map((symbol, idx) => {
                        const absoluteIdx = windowStart + idx
                        const isHead = absoluteIdx === head

                        return (
                            <motion.div
                                key={`${absoluteIdx}-${symbol}`}
                                initial={{ opacity: 0.6, rotateX: -35 }}
                                animate={{ opacity: 1, rotateX: 0 }}
                                transition={{ duration: 0.25 }}
                                className={`relative flex h-14 w-14 items-center justify-center rounded-2xl border text-xl font-semibold shadow-sm ${isHead
                                        ? 'border-orange-400 bg-gradient-to-b from-orange-100 to-white text-black shadow-orange-200'
                                        : 'border-zinc-200 bg-white/85 text-zinc-800'
                                    }`}
                                style={{ minWidth: CELL_SIZE }}
                            >
                                {symbol}
                            </motion.div>
                        )
                    })}
                </motion.div>

                <motion.div
                    className="pointer-events-none absolute -top-2 left-0 h-full"
                    animate={{ x: 16 + localHead * (CELL_SIZE + 12) }}
                    transition={{ type: 'spring', stiffness: 240, damping: 22 }}
                >
                    <div className="h-3 w-3 rounded-full bg-orange-500 shadow-[0_0_24px_rgba(255,106,0,0.7)]" />
                </motion.div>
            </div>
        </div>
    )
}
```

### src/components/TransitionGraph.tsx

```tsx
import { useMemo } from 'react'
import ReactFlow, { Background, Position } from 'reactflow'
import type { Edge, Node } from 'reactflow'
import 'reactflow/dist/style.css'

interface TransitionGraphProps {
    states: string[]
    edges: Array<{ id: string; source: string; target: string; label: string }>
    activeTransition: string
}

export function TransitionGraph({ states, edges, activeTransition }: TransitionGraphProps) {
    const nodes = useMemo<Node[]>(() => {
        const radius = 120
        const centerX = 220
        const centerY = 180

        return states.map((state, idx) => {
            const angle = (idx / Math.max(states.length, 1)) * Math.PI * 2
            const x = centerX + radius * Math.cos(angle)
            const y = centerY + radius * Math.sin(angle)

            return {
                id: state,
                position: { x, y },
                data: { label: state },
                sourcePosition: Position.Right,
                targetPosition: Position.Left,
                style: {
                    borderRadius: 20,
                    border: '1px solid rgba(255,255,255,0.8)',
                    background: 'rgba(255,255,255,0.8)',
                    padding: 8,
                    color: '#111',
                    fontWeight: 600,
                    boxShadow: '0 10px 24px rgba(0,0,0,0.08)',
                },
            }
        })
    }, [states])

    const flowEdges = useMemo<Edge[]>(
        () =>
            edges.map((edge) => ({
                id: edge.id,
                source: edge.source,
                target: edge.target,
                label: edge.label,
                type: 'smoothstep',
                style: {
                    stroke: activeTransition.includes(edge.source) && activeTransition.includes(edge.target) ? '#ff6a00' : '#595959',
                    strokeWidth: activeTransition.includes(edge.source) && activeTransition.includes(edge.target) ? 2.8 : 1.6,
                },
                labelStyle: {
                    fill: '#222',
                    fontSize: 11,
                    fontWeight: 600,
                },
            })),
        [activeTransition, edges],
    )

    return (
        <div className="h-[360px] rounded-3xl border border-white/60 bg-white/55 backdrop-blur-2xl">
            <ReactFlow fitView nodes={nodes} edges={flowEdges} proOptions={{ hideAttribution: true }}>
                <Background color="rgba(0,0,0,0.07)" gap={18} />
            </ReactFlow>
        </div>
    )
}
```

### src/App.tsx

```tsx
import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ComplexityPanel } from './components/ComplexityPanel'
import { ControlPanel } from './components/ControlPanel'
import { ExplanationPanel } from './components/ExplanationPanel'
import { LandingOverlay } from './components/LandingOverlay'
import { ModeNavbar } from './components/ModeNavbar'
import { MultiTapeView } from './components/MultiTapeView'
import { NondetTreeView } from './components/NondetTreeView'
import { Sidebar } from './components/Sidebar'
import { StatePanel } from './components/StatePanel'
import { TapeView } from './components/TapeView'
import { TransitionGraph } from './components/TransitionGraph'
import { selectGraphData, useTuringStore } from './store/turingStore'

function App() {
  const [showLanding, setShowLanding] = useState(true)
  const state = useTuringStore()

  useEffect(() => {
    if (!state.running) return
    const timer = window.setInterval(() => state.step(), state.speed)
    return () => window.clearInterval(timer)
  }, [state, state.running, state.speed])

  const graphEdges = useMemo(() => selectGraphData(state), [state])

  const graphStates = useMemo(() => {
    if (state.mode === 'multi') return state.multiMachine.states
    if (state.mode === 'nondet') return state.nondetMachine.states
    if (state.mode === 'single') return state.singleMachine.states
    try {
      const decoded = JSON.parse(state.universalEncoded) as { states?: string[] }
      return decoded.states ?? state.singleMachine.states
    } catch {
      return state.singleMachine.states
    }
  }, [state])

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-white via-zinc-100 to-white px-4 pb-8 pt-6 md:px-6">
      <div className="pointer-events-none absolute -left-24 top-16 h-72 w-72 rounded-full bg-orange-200/50 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-1/3 h-80 w-80 rounded-full bg-zinc-200/70 blur-3xl" />

      <AnimatePresence>
        <LandingOverlay open={showLanding} onStart={() => setShowLanding(false)} />
      </AnimatePresence>

      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="mx-auto mb-4 flex w-full max-w-[1480px] items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-black md:text-4xl">TuringLab</h1>
          <p className="text-sm text-zinc-600">Interactive Turing Machine Studio</p>
        </div>
      </motion.header>

      <main className="mx-auto grid w-full max-w-[1480px] grid-cols-1 gap-4 xl:grid-cols-[360px_1fr]">
        <Sidebar
          mode={state.mode}
          input={state.input}
          machineEditor={state.machineEditor}
          validationError={state.validationError}
          selectedPreset={state.selectedPreset}
          onInput={state.setInput}
          onEditor={state.updateMachineEditor}
          onApply={state.applyEditorMachine}
          onLoadPreset={state.loadPreset}
        />

        <section className="space-y-4">
          <ModeNavbar mode={state.mode} onMode={state.setMode} />

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_350px]">
            <div className="space-y-4 rounded-3xl border border-white/60 bg-white/40 p-4 backdrop-blur-2xl">
              {state.mode === 'single' ? <TapeView tape={state.singleSnapshot.tape} head={state.singleSnapshot.head} title="Single Tape" /> : null}
              {state.mode === 'multi' ? <MultiTapeView tapes={state.multiSnapshot.tapes} heads={state.multiSnapshot.heads} /> : null}
              {state.mode === 'nondet' ? (
                <>
                  <TapeView
                    tape={state.nondetSnapshot.branches[0]?.tape ?? ['_']}
                    head={state.nondetSnapshot.branches[0]?.head ?? 0}
                    title="Representative Tape"
                  />
                  <NondetTreeView snapshot={state.nondetSnapshot} />
                </>
              ) : null}
              {state.mode === 'universal' ? (
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <div className="rounded-2xl border border-zinc-200 bg-white/90 p-3">
                    <div className="mb-2 text-sm font-semibold text-zinc-700">Encoded Machine</div>
                    <pre className="max-h-56 overflow-auto whitespace-pre-wrap text-xs text-zinc-600">{state.universalSnapshot.encoded}</pre>
                  </div>
                  <div>
                    <TapeView tape={state.universalSnapshot.inner.tape} head={state.universalSnapshot.inner.head} title="Execution Tape" />
                  </div>
                </div>
              ) : null}

              <TransitionGraph states={graphStates} edges={graphEdges} activeTransition={state.activeTransition} />
            </div>

            <div className="space-y-4">
              <StatePanel
                title="State Display"
                state={
                  state.mode === 'single'
                    ? state.singleSnapshot.state
                    : state.mode === 'multi'
                      ? state.multiSnapshot.state
                      : state.mode === 'nondet'
                        ? state.nondetSnapshot.branches[0]?.state ?? 'none'
                        : state.universalSnapshot.inner.state
                }
                symbol={
                  state.mode === 'single'
                    ? state.singleSnapshot.currentSymbol
                    : state.mode === 'multi'
                      ? state.multiSnapshot.currentSymbols.join(',')
                      : state.mode === 'nondet'
                        ? state.nondetSnapshot.branches[0]?.tape[state.nondetSnapshot.branches[0]?.head ?? 0] ?? '_'
                        : state.universalSnapshot.inner.currentSymbol
                }
                transition={state.activeTransition}
                steps={
                  state.mode === 'single'
                    ? state.singleSnapshot.steps
                    : state.mode === 'multi'
                      ? state.multiSnapshot.steps
                      : state.mode === 'nondet'
                        ? state.nondetSnapshot.steps
                        : state.universalSnapshot.inner.steps
                }
                result={
                  state.mode === 'single'
                    ? state.singleSnapshot.result
                    : state.mode === 'multi'
                      ? state.multiSnapshot.result
                      : state.mode === 'nondet'
                        ? state.nondetSnapshot.halted
                          ? state.nondetSnapshot.acceptedBranchId
                            ? 'accept'
                            : 'reject'
                          : 'running'
                        : state.universalSnapshot.inner.result
                }
              />
              <ExplanationPanel history={state.explainHistory} />
            </div>
          </div>

          <ControlPanel
            running={state.running}
            speed={state.speed}
            onRunPause={() => state.setRunning(!state.running)}
            onStep={() => state.step()}
            onReset={state.reset}
            onSpeed={state.setSpeed}
          />

          <ComplexityPanel data={state.complexityData} />

          <div className="rounded-2xl border border-white/60 bg-white/55 p-3 text-sm text-zinc-600 backdrop-blur-2xl">
            Comparison Insight: current mode is <strong className="text-black">{state.mode}</strong>. Run different presets and compare the complexity chart to contrast single-tape and multi-tape behavior.
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
```

### src/assets/react.svg

```svg
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--logos" width="35.93" height="32" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 228"><path fill="#00D8FF" d="M210.483 73.824a171.49 171.49 0 0 0-8.24-2.597c.465-1.9.893-3.777 1.273-5.621c6.238-30.281 2.16-54.676-11.769-62.708c-13.355-7.7-35.196.329-57.254 19.526a171.23 171.23 0 0 0-6.375 5.848a155.866 155.866 0 0 0-4.241-3.917C100.759 3.829 77.587-4.822 63.673 3.233C50.33 10.957 46.379 33.89 51.995 62.588a170.974 170.974 0 0 0 1.892 8.48c-3.28.932-6.445 1.924-9.474 2.98C17.309 83.498 0 98.307 0 113.668c0 15.865 18.582 31.778 46.812 41.427a145.52 145.52 0 0 0 6.921 2.165a167.467 167.467 0 0 0-2.01 9.138c-5.354 28.2-1.173 50.591 12.134 58.266c13.744 7.926 36.812-.22 59.273-19.855a145.567 145.567 0 0 0 5.342-4.923a168.064 168.064 0 0 0 6.92 6.314c21.758 18.722 43.246 26.282 56.54 18.586c13.731-7.949 18.194-32.003 12.4-61.268a145.016 145.016 0 0 0-1.535-6.842c1.62-.48 3.21-.974 4.76-1.488c29.348-9.723 48.443-25.443 48.443-41.52c0-15.417-17.868-30.326-45.517-39.844Zm-6.365 70.984c-1.4.463-2.836.91-4.3 1.345c-3.24-10.257-7.612-21.163-12.963-32.432c5.106-11 9.31-21.767 12.459-31.957c2.619.758 5.16 1.557 7.61 2.4c23.69 8.156 38.14 20.213 38.14 29.504c0 9.896-15.606 22.743-40.946 31.14Zm-10.514 20.834c2.562 12.94 2.927 24.64 1.23 33.787c-1.524 8.219-4.59 13.698-8.382 15.893c-8.067 4.67-25.32-1.4-43.927-17.412a156.726 156.726 0 0 1-6.437-5.87c7.214-7.889 14.423-17.06 21.459-27.246c12.376-1.098 24.068-2.894 34.671-5.345a134.17 134.17 0 0 1 1.386 6.193ZM87.276 214.515c-7.882 2.783-14.16 2.863-17.955.675c-8.075-4.657-11.432-22.636-6.853-46.752a156.923 156.923 0 0 1 1.869-8.499c10.486 2.32 22.093 3.988 34.498 4.994c7.084 9.967 14.501 19.128 21.976 27.15a134.668 134.668 0 0 1-4.877 4.492c-9.933 8.682-19.886 14.842-28.658 17.94ZM50.35 144.747c-12.483-4.267-22.792-9.812-29.858-15.863c-6.35-5.437-9.555-10.836-9.555-15.216c0-9.322 13.897-21.212 37.076-29.293c2.813-.98 5.757-1.905 8.812-2.773c3.204 10.42 7.406 21.315 12.477 32.332c-5.137 11.18-9.399 22.249-12.634 32.792a134.718 134.718 0 0 1-6.318-1.979Zm12.378-84.26c-4.811-24.587-1.616-43.134 6.425-47.789c8.564-4.958 27.502 2.111 47.463 19.835a144.318 144.318 0 0 1 3.841 3.545c-7.438 7.987-14.787 17.08-21.808 26.988c-12.04 1.116-23.565 2.908-34.161 5.309a160.342 160.342 0 0 1-1.76-7.887Zm110.427 27.268a347.8 347.8 0 0 0-7.785-12.803c8.168 1.033 15.994 2.404 23.343 4.08c-2.206 7.072-4.956 14.465-8.193 22.045a381.151 381.151 0 0 0-7.365-13.322Zm-45.032-43.861c5.044 5.465 10.096 11.566 15.065 18.186a322.04 322.04 0 0 0-30.257-.006c4.974-6.559 10.069-12.652 15.192-18.18ZM82.802 87.83a323.167 323.167 0 0 0-7.227 13.238c-3.184-7.553-5.909-14.98-8.134-22.152c7.304-1.634 15.093-2.97 23.209-3.984a321.524 321.524 0 0 0-7.848 12.897Zm8.081 65.352c-8.385-.936-16.291-2.203-23.593-3.793c2.26-7.3 5.045-14.885 8.298-22.6a321.187 321.187 0 0 0 7.257 13.246c2.594 4.48 5.28 8.868 8.038 13.147Zm37.542 31.03c-5.184-5.592-10.354-11.779-15.403-18.433c4.902.192 9.899.29 14.978.29c5.218 0 10.376-.117 15.453-.343c-4.985 6.774-10.018 12.97-15.028 18.486Zm52.198-57.817c3.422 7.8 6.306 15.345 8.596 22.52c-7.422 1.694-15.436 3.058-23.88 4.071a382.417 382.417 0 0 0 7.859-13.026a347.403 347.403 0 0 0 7.425-13.565Zm-16.898 8.101a358.557 358.557 0 0 1-12.281 19.815a329.4 329.4 0 0 1-23.444.823c-7.967 0-15.716-.248-23.178-.732a310.202 310.202 0 0 1-12.513-19.846h.001a307.41 307.41 0 0 1-10.923-20.627a310.278 310.278 0 0 1 10.89-20.637l-.001.001a307.318 307.318 0 0 1 12.413-19.761c7.613-.576 15.42-.876 23.31-.876H128c7.926 0 15.743.303 23.354.883a329.357 329.357 0 0 1 12.335 19.695a358.489 358.489 0 0 1 11.036 20.54a329.472 329.472 0 0 1-11 20.722Zm22.56-122.124c8.572 4.944 11.906 24.881 6.52 51.026c-.344 1.668-.73 3.367-1.15 5.09c-10.622-2.452-22.155-4.275-34.23-5.408c-7.034-10.017-14.323-19.124-21.64-27.008a160.789 160.789 0 0 1 5.888-5.4c18.9-16.447 36.564-22.941 44.612-18.3ZM128 90.808c12.625 0 22.86 10.235 22.86 22.86s-10.235 22.86-22.86 22.86s-22.86-10.235-22.86-22.86s10.235-22.86 22.86-22.86Z"></path></svg>
```

### src/assets/vite.svg

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="77" height="47" fill="none" aria-labelledby="vite-logo-title" viewBox="0 0 77 47"><title id="vite-logo-title">Vite</title><style>.parenthesis{fill:#000}@media (prefers-color-scheme:dark){.parenthesis{fill:#fff}}</style><path fill="#9135ff" d="M40.151 45.71c-.663.844-2.02.374-2.02-.699V34.708a2.26 2.26 0 0 0-2.262-2.262H24.493c-.92 0-1.457-1.04-.92-1.788l7.479-10.471c1.07-1.498 0-3.578-1.842-3.578H15.443c-.92 0-1.456-1.04-.92-1.788l9.696-13.576c.213-.297.556-.474.92-.474h28.894c.92 0 1.456 1.04.92 1.788l-7.48 10.472c-1.07 1.497 0 3.578 1.842 3.578h11.376c.944 0 1.474 1.087.89 1.83L40.153 45.712z"/><mask id="a" width="48" height="47" x="14" y="0" maskUnits="userSpaceOnUse" style="mask-type:alpha"><path fill="#000" d="M40.047 45.71c-.663.843-2.02.374-2.02-.699V34.708a2.26 2.26 0 0 0-2.262-2.262H24.389c-.92 0-1.457-1.04-.92-1.788l7.479-10.472c1.07-1.497 0-3.578-1.842-3.578H15.34c-.92 0-1.456-1.04-.92-1.788l9.696-13.575c.213-.297.556-.474.92-.474H53.93c.92 0 1.456 1.04.92 1.788L47.37 13.03c-1.07 1.498 0 3.578 1.842 3.578h11.376c.944 0 1.474 1.088.89 1.831L40.049 45.712z"/></mask><g mask="url(#a)"><g filter="url(#b)"><ellipse cx="5.508" cy="14.704" fill="#eee6ff" rx="5.508" ry="14.704" transform="rotate(269.814 20.96 11.29)scale(-1 1)"/></g><g filter="url(#c)"><ellipse cx="10.399" cy="29.851" fill="#eee6ff" rx="10.399" ry="29.851" transform="rotate(89.814 -16.902 -8.275)scale(1 -1)"/></g><g filter="url(#d)"><ellipse cx="5.508" cy="30.487" fill="#8900ff" rx="5.508" ry="30.487" transform="rotate(89.814 -19.197 -7.127)scale(1 -1)"/></g><g filter="url(#e)"><ellipse cx="5.508" cy="30.599" fill="#8900ff" rx="5.508" ry="30.599" transform="rotate(89.814 -25.928 4.177)scale(1 -1)"/></g><g filter="url(#f)"><ellipse cx="5.508" cy="30.599" fill="#8900ff" rx="5.508" ry="30.599" transform="rotate(89.814 -25.738 5.52)scale(1 -1)"/></g><g filter="url(#g)"><ellipse cx="14.072" cy="22.078" fill="#eee6ff" rx="14.072" ry="22.078" transform="rotate(93.35 31.245 55.578)scale(-1 1)"/></g><g filter="url(#h)"><ellipse cx="3.47" cy="21.501" fill="#8900ff" rx="3.47" ry="21.501" transform="rotate(89.009 35.419 55.202)scale(-1 1)"/></g><g filter="url(#i)"><ellipse cx="3.47" cy="21.501" fill="#8900ff" rx="3.47" ry="21.501" transform="rotate(89.009 35.419 55.202)scale(-1 1)"/></g><g filter="url(#j)"><ellipse cx="14.592" cy="9.743" fill="#8900ff" rx="4.407" ry="29.108" transform="rotate(39.51 14.592 9.743)"/></g><g filter="url(#k)"><ellipse cx="61.728" cy="-5.321" fill="#8900ff" rx="4.407" ry="29.108" transform="rotate(37.892 61.728 -5.32)"/></g><g filter="url(#l)"><ellipse cx="55.618" cy="7.104" fill="#00c2ff" rx="5.971" ry="9.665" transform="rotate(37.892 55.618 7.104)"/></g><g filter="url(#m)"><ellipse cx="12.326" cy="39.103" fill="#8900ff" rx="4.407" ry="29.108" transform="rotate(37.892 12.326 39.103)"/></g><g filter="url(#n)"><ellipse cx="12.326" cy="39.103" fill="#8900ff" rx="4.407" ry="29.108" transform="rotate(37.892 12.326 39.103)"/></g><g filter="url(#o)"><ellipse cx="49.857" cy="30.678" fill="#8900ff" rx="4.407" ry="29.108" transform="rotate(37.892 49.857 30.678)"/></g><g filter="url(#p)"><ellipse cx="52.623" cy="33.171" fill="#00c2ff" rx="5.971" ry="15.297" transform="rotate(37.892 52.623 33.17)"/></g></g><path d="M6.919 0c-9.198 13.166-9.252 33.575 0 46.789h6.215c-9.25-13.214-9.196-33.623 0-46.789zm62.424 0h-6.215c9.198 13.166 9.252 33.575 0 46.789h6.215c9.25-13.214 9.196-33.623 0-46.789" class="parenthesis"/><defs><filter id="b" width="60.045" height="41.654" x="-5.564" y="16.92" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="7.659"/></filter><filter id="c" width="90.34" height="51.437" x="-40.407" y="-6.762" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="7.659"/></filter><filter id="d" width="79.355" height="29.4" x="-35.435" y="2.801" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="e" width="79.579" height="29.4" x="-30.84" y="20.8" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="f" width="79.579" height="29.4" x="-29.307" y="21.949" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="g" width="74.749" height="58.852" x="29.961" y="-17.13" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="7.659"/></filter><filter id="h" width="61.377" height="25.362" x="37.754" y="3.055" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="i" width="61.377" height="25.362" x="37.754" y="3.055" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="j" width="56.045" height="63.649" x="-13.43" y="-22.082" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="k" width="54.814" height="64.646" x="34.321" y="-37.644" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="l" width="33.541" height="35.313" x="38.847" y="-10.552" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="m" width="54.814" height="64.646" x="-15.081" y="6.78" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="n" width="54.814" height="64.646" x="-15.081" y="6.78" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="o" width="54.814" height="64.646" x="22.45" y="-1.645" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="p" width="39.409" height="43.623" x="32.919" y="11.36" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter></defs></svg>
```

## 5) Implementation Notes

- Main simulation logic is fully centralized in `src/engine/simulator.ts` and is pure (snapshot in -> snapshot out).
- Global app orchestration is in Zustand store (`src/store/turingStore.ts`), including reset/step/preset behavior.
- `src/App.tsx` is primarily composition and mode-specific rendering.
- UI is mostly Tailwind utility-driven with Framer Motion transitions.
- `src/App.css` appears to contain leftover template styles and is not imported by current runtime entry flow.

## 6) Completeness Statement

This context file includes all major project text implementations and structure.

Excluded from inline code snapshot:

- `package-lock.json` (generated lockfile)
- `src/assets/hero.png` (binary image)

Everything else in the project workspace (as listed in structure) is represented above.
