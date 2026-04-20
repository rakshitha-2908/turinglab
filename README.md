# 🎯 TuringLab

<div align="center">
  <img src="./src/assets/hero.png" alt="TuringLab Hero" width="600" />

  <p><strong>Interactive Turing Machine Studio</strong></p>
  <p>Explore the foundations of computation with our beautiful, animated Turing machine simulator</p>

  <p>
    <a href="#features">Features</a> •
    <a href="#installation">Installation</a> •
    <a href="#usage">Usage</a> •
    <a href="#tech-stack">Tech Stack</a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/React-19.2.4-61DAFB?style=flat-square&logo=react" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-6.0-3178C6?style=flat-square&logo=typescript" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Vite-8.0-646CFF?style=flat-square&logo=vite" alt="Vite" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-4.2-38B2AC?style=flat-square&logo=tailwind-css" alt="Tailwind CSS" />
  </p>
</div>

---

## ✨ Features

TuringLab provides a comprehensive platform for exploring Turing machines with multiple simulation modes:

### 🎪 Simulation Modes
- **Single-Tape Deterministic**: Classic Turing machine with one tape and deterministic transitions
- **Multi-Tape Deterministic**: Enhanced machines with multiple tapes for complex computations
- **Nondeterministic Branching**: Explore all possible execution paths with tree visualization
- **Universal Machine**: Execute encoded Turing machines - the ultimate in computational universality

### 🎨 Interactive Interface
- **Visual Tape Editor**: Click and edit tape cells directly
- **Real-time Animation**: Watch transitions happen with smooth animations
- **Transition Graph**: See the complete state machine as an interactive graph
- **Complexity Analysis**: Monitor space and time complexity with live charts
- **Step-by-Step Control**: Run, pause, step through, or fast-forward execution

### 🧠 Educational Tools
- **Built-in Presets**: Pre-loaded examples including palindrome checker, binary adder, and more
- **State Inspector**: Examine current machine state and configuration
- **Explanation Panel**: Get detailed explanations of each transition
- **Validation**: Real-time syntax checking and error highlighting

## 🚀 Installation

### Prerequisites
- Node.js 18+
- npm or yarn

### Quick Start
```bash
# Clone the repository
git clone https://github.com/yourusername/turinglab.git
cd turinglab

# Install dependencies
npm install

# Start the development server
npm run dev

# Open http://localhost:5173 in your browser
```

### Build for Production
```bash
# Build the project
npm run build

# Preview the production build
npm run preview
```

## 📖 Usage

1. **Choose a Mode**: Select from Single, Multi-tape, Nondeterministic, or Universal modes
2. **Load a Preset**: Use built-in examples or create your own machine
3. **Edit the Tape**: Click on tape cells to modify input
4. **Configure States**: Define states, transitions, and rules in the sidebar
5. **Run Simulation**: Use controls to step through or run continuously
6. **Analyze Results**: View complexity metrics and execution paths

### Creating Custom Machines

TuringLab supports defining machines through a simple JSON-like syntax:

```json
{
  "states": ["q0", "q1", "halt"],
  "alphabet": ["0", "1", "_"],
  "transitions": {
    "q0": {
      "0": ["q1", "1", "R"],
      "1": ["q0", "0", "L"],
      "_": ["halt", "_", "S"]
    }
  },
  "start": "q0",
  "accept": ["halt"]
}
```

## 🛠️ Tech Stack

- **Frontend**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4 with custom gradients and animations
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Visualizations**: React Flow (graphs), Recharts (charts)
- **Icons**: Lucide React
- **Linting**: ESLint with TypeScript support

## 🤝 Contributing

We welcome contributions! Please feel free to submit issues, feature requests, or pull requests.

### Development Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run linting
npm run lint

# Build for production
npm run build
```

### Guidelines
- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Use conventional commits

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <p>Made with ❤️ for computer science education</p>
  <p>
    <a href="#turinglab">Back to top ↑</a>
  </p>
</div>js
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
