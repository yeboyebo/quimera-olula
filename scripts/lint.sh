#!/bin/bash

if [ -z "$1" ]
  then
    echo "Error. Es necesario indicar una ruta"
    exit 0
fi

pnpm exec eslint --ext .js,.jsx,.ts,.tsx,.json -c ./.eslintrc $@
