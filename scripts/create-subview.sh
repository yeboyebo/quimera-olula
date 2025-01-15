#!/bin/bash

if [ -z "$1" ]
  then
    echo "Error. Es necesario indicar un nombre de extensión"
    exit 0
fi

if [ -z "$2" ]
  then
    echo "Error. Es necesario indicar un nombre de view"
    exit 0
fi

if [ -z "$3" ]
  then
    echo "Error. Es necesario indicar un nombre de subview"
    exit 0
fi

extension=$1
clean_extension_path=${extension//-/_}
subview_path=./extensions/$clean_extension_path/views/$2/$3

cp -rf ./libs/templates/subview/ $subview_path

sed -i 's/SubviewTemplate/'$3'/g' $subview_path/SubviewTemplate.style.js
sed -i 's/SubviewTemplate/'$3'/g' $subview_path/SubviewTemplate.ui.jsx
sed -i 's/SubviewTemplate/'$3'/g' $subview_path/index.js

mv $subview_path/SubviewTemplate.style.js $subview_path/$3.style.js
mv $subview_path/SubviewTemplate.ui.jsx $subview_path/$3.ui.jsx

echo "Subvista $2/$3 creada en $clean_extension_path"

