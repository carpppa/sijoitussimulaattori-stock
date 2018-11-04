[![Build Status](https://travis-ci.com/carpppa/sijoitussimulaattori-stock.svg?token=xQqx3oEyeT4LX1PHsDTx&branch=master)](https://travis-ci.com/carpppa/sijoitussimulaattori-stock)

# sijoitussimulaattori-stock

## Getting started

Prerequisities:

- Node (v10 or higher)
- npm (v6 or higher)
- Docker

Clone the project and run `npm install` and `npm run build-ts`.

## Project setup instructions for vscode (recommended)

Install the following plugins:

- Prettier code formatter
  - automatic code formatting on save
  - settings from `.prettierrc`
  - add `"editor.formatOnSave": true` to `settings.json`
- EditorConfig
  - automatic formatting on save
  - settings from `.editorconfig`
- TypeScript Hero
  - automatic imports organizing for TypeScript
  - add the following to `settings.json`

```(json)
  "typescriptHero.imports.grouping": ["Modules", "Workspace", "Plains"],
  "typescriptHero.imports.organizeOnSave": true,
```

## Running the project

- Development:
  - run `docker-compose up db`
  - run `npm run start:dev` in another console

## Running tests

- Run `npm test`
