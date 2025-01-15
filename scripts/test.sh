#!/bin/bash

if [ -z "$1" ]
  then
    echo "Error. Es necesario indicar una ruta"
    exit 0
fi

NODE_ENV=test pnpm exec jest --watch --config=jest.config.js $@
