#!/bin/bash

if [ -z "$1" ]
  then
    echo "Error. Es necesario indicar un nombre de proyecto"
    exit 0
fi

mkdir apps/$1
cp -R libs/templates/app/* apps/$1
cp -R libs/templates/app/.env apps/$1/
cp -R libs/templates/app/.env.production apps/$1/

sed -i 's/__template__/'$1'/g' apps/$1/index.html
sed -i 's/__template__/'$1'/g' apps/$1/package.json
sed -i 's/__template__/'$1'/g' apps/$1/.env
sed -i 's/__template__/'$1'/g' apps/$1/.env.production
sed -i 's/__template__/'$1'/g' apps/$1/src/project.ts

