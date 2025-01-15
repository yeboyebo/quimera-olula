#!/bin/bash

if [ -z "$1" ]
  then
    echo "Error. Es necesario indicar un nombre de proyecto"
    exit 0
fi

NODE_ENV=dev pnpm --filter @quimera-app/$1 dev
