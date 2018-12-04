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

- If you don't want to call the Alpha Vantage API, `npm run start:av-dev-server` starts the development server serving Alpha Vantage mock data
  - On the first time you must run `npm run install:av-dev-server` to install the development server dependencies.
- run `docker-compose up db redis`
- see sections **Database** and **Redis** on how to setup the services
- run `npm run start:dev` in another console

### Database

- To make all migrations run `npm run migrate:make`
- To rollback all migrations run `npm run migrate:rollback`
- To create a new migration run `npm run migrate:create <migration-name>`
- To populate the database run `npm run populate-db:dev`

### Redis

- To populate the cache run `npm run populate-cache:dev`
- To flush the cache run `npm run flush-cache:dev`

## Running tests

- Start the test database: `docker-compose up test-db test-redis`
- Run `npm test`

## Environment variables

The following environment variables are used:

- `NODE_ENV` : `production | development | test`
- `LOG_LEVEL` : one of `winston` [log levels](https://github.com/winstonjs/winston#logging-levels) (optional, default value `info`)
- `DATABASE_URL` : the database connection string: `postgres://<db_username>:<db_password>@<db_hostname>:<db_port>/<database>`
- `REDIS_URL` : the redis cache connection string: `redis://<redis_username>:<redis_password>@<redis_hostname>:<redis_port>`
- `ALPHA_VANTAGE_URL` : the base URL for Alpha Vantage API service
- `ALPHA_VANTAGE_API_KEY` : the API key for Alpha Vantage service. Can be anything when `NODE_ENV !== 'production'`
