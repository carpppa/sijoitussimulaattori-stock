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
  - see section **Database** on how to setup the database
  - run `npm run start:dev` in another console

## Running tests

- Run `npm test`

## Database

- To make all migrations run `npm run migrate:make`
- To rollback last migration run `npm run migrate:rollback`
- To create a new migration run `npm run migrate:create <migration-name>`
- To populate the database:
  - `npm run start:av-dev-server`: starts the development server serving Alpha Vantage data
    - On the first time, you must go to the development server folder and run `npm install`
  - `npm run populate-db:dev`: populates the database

## Environment variables

The following environment variables are used:

- `NODE_ENV` : `production | development | test`
- `LOG_LEVEL` : one of `winston` [log levels](https://github.com/winstonjs/winston#logging-levels) (optional, default value `info`)
- `DATABASE_URL` : the database connection string: `postgres://<db_username>:<db_password>@<db_hostname>:<db_port>/<database>`
- `ALPHA_VANTAGE_URL` : the base URL for Alpha Vantage API service. Not used when `NODE_ENV !== 'production'` and therefore optional
- `ALPHA_VANTAGE_API_KEY` : the API key for Alpha Vantage service. Can be anything when `NODE_ENV !== 'production'`
