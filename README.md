# My Vaxine Frontend

A modern React frontend project with Vite, ESLint, and Husky pre-commit hooks for code quality and consistency.

---

## Table of Contents

- [Project Setup](#project-setup)
- [Scripts](#scripts)
- [Linting & Code Quality](#linting--code-quality)
- [Pre-commit Hooks](#pre-commit-hooks)
- [Folder Structure](#folder-structure)
- [Contributing](#contributing)
- [License](#license)

---

## Project Setup

1. Clone the repository:

```bash
git clone https://github.com/teamtechackers/salek-frontend.git
cd salek-frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## Scripts

| Command        | Description                        |
|----------------|------------------------------------|
| `npm run dev`  | Start the development server        |
| `npm run build`| Build the project for production   |
| `npm run lint` | Run ESLint for code quality checks |

---

## Linting & Code Quality

This project uses **ESLint** with custom rules:

- Enforces camelCase and PascalCase naming  
- Single quotes for strings  
- Disallows `var` and encourages `const`/`let`  
- Checks for unused variables and functions  

ESLint ignores generated files (`dist/`, `build/`) and some specific paths.

---

## Pre-commit Hooks

**Husky** is used for Git hooks:

- **Pre-commit**:  
  Checks for:
  - TODO/FIXME comments  
  - `console.log` statements (excluding `logger.js`)  
  - Invalid file naming  
  - Hardcoded strings in code  
  - Required directory structure (`core` and `ui`)  

- **Commit-msg**:  
  Enforces conventional commits using **Commitlint**  

> ⚠️ Files excluded from hardcoded string checks:  
> `App.jsx`, `App.css`, `index.css`, `main.jsx`

---

## Folder Structure

```
src/
│
├── core/             # Core utilities and services
├── ui/               # UI components
├── assets/           # Images, logos, fonts
├── App.jsx           # Main React app component
├── main.jsx          # Entry point
└── index.css         # Global styles
```

---

## Contributing

1. Fork the repo and create a new branch.  
2. Make changes and run `npm run lint` before committing.  
3. Commit using **Conventional Commits**.  
4. Push your branch and open a pull request.

---

## License

MIT License
