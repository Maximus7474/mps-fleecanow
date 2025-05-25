## Special Mentions

This template is built from Overextended's boilerplate. This was a team of heavily invested open source developers in the Cfx development community.
- Overextended [Github Organisation](https://github.com/overextended)
- [Typescript Boilerplate](https://github.com/overextended/fivem-typescript-boilerplate)

They have since end of April 2025 stopped all work on FiveM, people interested in their work can contribute in the community driven organisation.
- [CommunityOx](https://github.com/CommunityOx)

Remember, open source is what powers many of the servers out there and these resources are a vital backbone for so many, without these developers FiveM would most definetly not be what it is now.

## Guidelines

- Commits:
All commits should follow the shared conventions on this subject, these are viewable here: [conventionalcommits.org](https://www.conventionalcommits.org/en/v1.0.0/)

- Code:
Code should be cleanly written, complex functions or methods should be commented in a clear manner.

Function Naming:
  - ui:
    - Components: PascalCase
    - Exported Functions: PascalCase
    - Localized Functions: camelCase
    - Types/Interfaces: PascalCase

## Getting Started

### Node.js v18+

Install any LTS release of [`Node.js`](https://nodejs.org/) from v18.

### pnpm

Install the [`pnpm`](https://pnpm.io/installation) package manager globally.

```
npm install -g pnpm
```

## Development

Use `pnpm watch` to actively rebuild modified files while developing the resource.

During web development, use `pnpm web:dev` to start vite's webserver and watch for changes.

## Build

Use `pnpm build` to build all project files in production mode.

To build and create GitHub releases, tag your commit (e.g. `v1.0.0`) and push it.

## Layout

- [/dist/](dist)
  - Compiled project files.
- [/locales/](locales)
  - JSON files used for translations with [ox_lib](https://overextended.dev/ox_lib/Modules/Locale/Shared).
- [/scripts/](scripts)
  - Scripts used in the development process, but not part of the compiled resource.
- [/src/](src)
  - Project source code.
- [/static/](static)
  - Files to include with the resource that aren't compiled or loaded (e.g. config).

*Guide Credit to Overextended - ([github](https://github.com/overextended)) - ([more info](https://overextended.dev))*
