#!/bin/bash
while getopts e:n:k:c:s:l:f: flag
do
    case "${flag}" in
        n) name=${OPTARG};;
        s) schemaName=${OPTARG};;
        k) pk=${OPTARG};;
        e) extension=${OPTARG};;
        c) createComponent=CREATE;;
        l) createLineas=LINEAS;;
        f) createFilter=FILTER;;
    esac
done

# if [ ! -z "$createComponent" ]
#   then
#     echo "crea componente"
# fi

# extension=$1
clean_extension_path=${extension//-/_}
master_view_path=./extensions/$clean_extension_path/views/"${name^}"\Master
nuevo_view_path=./extensions/$clean_extension_path/views/"${name^}"\Nuevo
detail_view_path=./extensions/$clean_extension_path/views/"${name^}"\Detail
libs_path=./libs/templates/masterDetail

if [ -d "$master_view_path" ]; then
  echo "Ya existe una view ${master_view_path}..."
  exit 0
fi

mkdir $master_view_path
touch $master_view_path/index.js $master_view_path/"${name^}".ctrl.yaml
sed -e 's/templateName/'$name'/g' $libs_path/ViewTemplate.ctrl.js  > $master_view_path/"${name^}".ctrl.js
sed -e 's/TemplateName/'"${name^}"'/g' -e 's/templateName/'$name'/g' -e 's/templatePK/'$pk'/g' -e 's/templateSchema/'$schemaName'/g' $libs_path/ViewTemplate.ctrl.yaml >  $master_view_path/"${name^}".ctrl.yaml
cp $libs_path/ViewTemplate.style.js  $master_view_path/"${name^}".style.js
sed -e 's/TemplateName/'"${name^}"'/g' -e 's/templateName/'$name'/g' -e 's/templatePK/'$pk'/g' -e 's/templateSchema/'$schemaName'/g' $libs_path/ViewTemplate.ui.jsx >  $master_view_path/"${name^}".ui.jsx
sed -e 's/TemplateName/'"${name^}"'/g' $libs_path/index.js > $master_view_path/index.js

echo "Vista "${name^}""Master" creada en $master_view_path"

# Creamos subview Master
mkdir $master_view_path/"${name^}"MasterSubView

cp $libs_path/ViewTemplateMaster/ViewTemplateMaster.style.js $master_view_path/"${name^}"MasterSubView/"${name^}"MasterSubView.style.js
sed -e 's/TemplateName/'"${name^}"'/g' -e 's/templateName/'$name'/g' -e 's/templatePK/'$pk'/g' -e 's/templateSchema/'$schemaName'/g'  $libs_path/ViewTemplateMaster/ViewTemplateMaster.ui.jsx >  $master_view_path/"${name^}"MasterSubView/"${name^}"MasterSubView.ui.jsx
sed  -e 's/TemplateName/'"${name^}"'/g' $libs_path/ViewTemplateMaster/index.js >  $master_view_path/"${name^}"MasterSubView/index.js

echo "Vista "${name^}""MasterSubView" creada en $master_subview_path"

# Creamos subview Filtro
mkdir $master_view_path/"${name^}"Filtro

cp $libs_path/ViewTemplateFiltro/ViewTemplateFiltro.style.js $master_view_path/"${name^}"Filtro/"${name^}"Filtro.style.js
sed -e 's/TemplateName/'"${name^}"'/g' -e 's/templateName/'$name'/g' -e 's/templatePK/'$pk'/g' -e 's/templateSchema/'$schemaName'/g'  $libs_path/ViewTemplateFiltro/ViewTemplateFiltro.ui.jsx >  $master_view_path/"${name^}"MasterSubView/"${name^}"Filtro.ui.jsx
sed  -e 's/TemplateName/'"${name^}"'/g' $libs_path/ViewTemplateMaster/index.js >  $master_view_path/"${name^}"Filtro/index.js

echo "Vista "${name^}""Filtro" creada en $master_subview_path"

# Creamos view Nuevo
if [ -d "$nuevo_view_path" ]; then
  echo "Ya existe una view ${nuevo_view_path}..."
  exit 0
fi

mkdir $nuevo_view_path
touch $nuevo_view_path/index.js $nuevo_view_path/"${name^}"Nuevo.ctrl.yaml
sed -e 's/templateName/'$name'/g' $libs_path/ViewTemplateNuevo/ViewTemplateNuevo.ctrl.js  > $nuevo_view_path/"${name^}"Nuevo.ctrl.js
sed -e 's/TemplateName/'"${name^}"'/g' -e 's/templateName/'$name'/g' -e 's/templatePK/'$pk'/g' -e 's/templateSchema/'$schemaName'/g' $libs_path/ViewTemplateNuevo/ViewTemplateNuevo.ctrl.yaml >  $nuevo_view_path/"${name^}"Nuevo.ctrl.yaml
cp $libs_path/ViewTemplateNuevo/ViewTemplateNuevo.style.js  $nuevo_view_path/"${name^}"Nuevo.style.js
sed -e 's/TemplateName/'"${name^}"'/g' -e 's/templateName/'$name'/g' -e 's/templatePK/'$pk'/g' -e 's/templateSchema/'$schemaName'/g' $libs_path/ViewTemplateNuevo/ViewTemplateNuevo.ui.jsx >  $nuevo_view_path/"${name^}"Nuevo.ui.jsx
sed -e 's/TemplateName/'"${name^}"'/g' $libs_path/ViewTemplateNuevo/index.js > $nuevo_view_path/index.js

echo "Vista "${name^}""Nuevo" creada en $nuevo_view_path"

if [ ! -z "$createLineas" ]
  then
    read -p "Name: " lineasName
    read -p "Schema: " lineasSchema
    read -p "PK: " lineasPk
    # echo $lineasName;
    # echo $lineasSchema;
    # echo $lineasPk;
fi

if [ ! -z "$createComponent" ]
  then
    echo "Creamos componentes, proximamente";
fi

echo "Vista "${name^}" creada en $clean_extension_path"

