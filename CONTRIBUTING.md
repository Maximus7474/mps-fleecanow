## 🙌 Special Mentions

This template is built from **Overextended's boilerplate**, created by a team of highly dedicated open source developers in the Cfx community.

* 🌐 [Overextended GitHub Organization](https://github.com/overextended)
* ⚙️ [TypeScript Boilerplate](https://github.com/overextended/fivem-typescript-boilerplate)

As of **April 2025**, Overextended has ceased development on FiveM projects. Continued community-driven contributions are now available via:

* 🤝 [CommunityOx GitHub](https://github.com/CommunityOx)

> Open source is the backbone of many FiveM servers. Without the contributions of these developers, the platform would not be what it is today.

---

## 📐 Guidelines

### 📝 Commits

All commits must follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification.

### 🧑‍💻 Code Quality

* Code must be clean, readable, and maintainable.
* Complex logic should be clearly commented for clarity.

### 🔤 Function & Naming Conventions

#### UI Code

| Element                  | Naming Style |
| ------------------------ | ------------ |
| Components               | `PascalCase` |
| Exported Functions       | `PascalCase` |
| Local/Internal Functions | `camelCase`  |
| Types / Interfaces       | `PascalCase` |

---

## 🚀 Getting Started

### 📦 Node.js (v18+)

Install any LTS release of [`Node.js`](https://nodejs.org/) **v18 or higher**.

### 📦 pnpm

Install the [`pnpm`](https://pnpm.io/installation) package manager globally:

```bash
npm install -g pnpm
```

---

## 🛠️ Development

* Run `pnpm watch` to actively rebuild modified files during development.
* For web development, start the Vite dev server with:

```bash
pnpm web:dev
```

---

## 📦 Build

* Use `pnpm build` to build all project files in **production mode**.
* To create a GitHub release, **tag** your commit (e.g. `v1.0.0`) and push it:

```bash
git tag v1.0.0
git push origin v1.0.0
```

---

## 🗂️ Project Layout

| Folder                 | Description                                                                                         |
| ---------------------- | --------------------------------------------------------------------------------------------------- |
| [`/dist/`](dist)       | Compiled project files.                                                                             |
| [`/locales/`](locales) | JSON translation files used with [`ox_lib`](https://overextended.dev/ox_lib/Modules/Locale/Shared). |
| [`/scripts/`](scripts) | Dev scripts (not part of the compiled resource).                                                    |
| [`/src/`](src)         | Project source code.                                                                                |
| [`/static/`](static)   | Files included with the resource (not compiled).                                                    |

---

*📘 Getting Started section credit: [Overextended](https://github.com/overextended) — [Docs](https://overextended.dev)*
