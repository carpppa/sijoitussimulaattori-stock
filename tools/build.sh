#!/bin/bash

# Exit bash if any command fails
set -e

# Run clean install, production build and start
npm install --only=dev
npm run build
npm prune --production
