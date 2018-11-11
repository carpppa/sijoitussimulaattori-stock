#!/bin/bash

# Exit bash if any command fails
set -e

# Run clean install, production build and start
npm install --only=dev
./node_modules/.bin/knex migrate:latest
npm run build
npm prune --production
