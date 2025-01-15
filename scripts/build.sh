#!/bin/bash

if [ -z "$1" ]
  then
    echo "Error. Es necesario indicar un nombre de proyecto"
    exit 0
fi
mode=$2
if [ -z "$2" ]
  then
    mode="production"
fi

pnpm --filter @quimera-app/$1 build --mode $mode

if [ ! -d "dist" ]
  then
    mkdir dist
fi

if [ -f "dist/$1.tar.gz" ]
  then
    rm -rf dist/$1.tar.gz
fi

cp libs/templates/htaccessbuild apps/$1/dist/.htaccess
tar -czvf dist/$1.tar.gz apps/$1/dist
