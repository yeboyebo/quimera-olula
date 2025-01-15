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

extension=$1
clean_extension_path=${extension//-/_}
view_path=./extensions/$clean_extension_path/views/$2

cp -rf ./libs/templates/view/ $view_path

sed -i 's/ViewTemplate/'$2'/g' $view_path/ViewTemplate.ctrl.js
sed -i 's/ViewTemplate/'$2'/g' $view_path/ViewTemplate.ctrl.yaml
sed -i 's/ViewTemplate/'$2'/g' $view_path/ViewTemplate.style.js
sed -i 's/ViewTemplate/'$2'/g' $view_path/ViewTemplate.ui.jsx
sed -i 's/ViewTemplate/'$2'/g' $view_path/index.js

mv $view_path/ViewTemplate.ctrl.js $view_path/$2.ctrl.js
mv $view_path/ViewTemplate.ctrl.yaml $view_path/$2.ctrl.yaml
mv $view_path/ViewTemplate.style.js $view_path/$2.style.js
mv $view_path/ViewTemplate.ui.jsx $view_path/$2.ui.jsx

echo "Vista $2 creada en $clean_extension_path"

