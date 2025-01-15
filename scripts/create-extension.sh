#!/bin/bash

if [ -z "$1" ]
  then
    echo "Error. Es necesario indicar un nombre de extension"
    exit 0
fi

clean=$1
cleanpath=${clean//-/_}
cleanpkg=${cleanpath//\//-}

mkdir -p ./extensions/$cleanpath
cp -R libs/templates/extension/* extensions/$cleanpath

sed -i 's/__template__/'$cleanpkg'/g' extensions/$cleanpath/index.ts
sed -i 's/__template__/'$cleanpkg'/g' extensions/$cleanpath/package.json
