import PropTypes from "prop-types";
import { useStateValue, util } from "quimera";
import React, { useCallback, useEffect, useState } from "react";

import { Field } from "..";

function SelectField({ async, id, index, field, getOptions, onChange, options = [], value, translateOptions = true, ...props }) {
  const [state, dispatch] = useStateValue();
  const [localValue, setLocalValue] = useState(null);

  const stateField = field || id;
  const stateValue = value || util.getStateValue(stateField, state, null);
  const translations = options && {
    ...options,
  };

  const translatedOptions = !translateOptions ? options : options?.map(option => ({
    ...option,
    value: util.translate(option.value),
  }));

  useEffect(() => {
    async && getOptions && stateValue !== (localValue?.key ?? null) && getOptions(null, stateValue);
  }, [async, getOptions, id, localValue, stateValue]);

  const handleChange = useCallback(
    event => {
      const value = event ? event.target.value?.key : null;
      const option = event ? event.target.value?.option : null;

      dispatch({
        type: `on${util.camelId(id)}Changed`,
        payload: { field: util.lastStateField(stateField), value, option, index },
      });
    },
    [dispatch, id, stateField],
  );

  // if ((stateValue ?? null) !== null) {
  //   const valor = options.reduce((acum, o) => o.key === stateValue ? o : acum, null)
  //   valor?.key !== localValue?.key && setLocalValue(valor)
  // }
  // const valor = options.reduce((acum, o) => o.key === stateValue ? o : acum, { key: null, value: ''})
  // valor?.key !== localValue?.key && setLocalValue(valor)

  const valor = options.reduce((acum, o) => (o.key === stateValue ? o : acum), null);
  valor?.key !== localValue?.key && setLocalValue(valor);

  return (
    <Field.Autocomplete
      async={async}
      id={id}
      field={field}
      options={translatedOptions}
      getOptions={getOptions}
      onChange={onChange ?? handleChange}
      value={localValue}
      {...props}
    />
  );
}

SelectField.propTypes = {
  id: PropTypes.string.isRequired,
  field: PropTypes.string,
  /* Función que obtiene la lista de opciones.
    Controles síncronos: Puede ejecutarse una sola vez si es fija (control Agente) o cada vez que una propiedad cambie (Dirección de cliente)
    Controles asíncronos: Ver propiedad async

    Si cada opción de la lista contiene datos útiles aparte de la propia key de la opción, pueden incluirse en una clave option de cada opción. Esta clave será enviada al controlador junto con la clave value en el evento on(id)Changed (ver p.e. control Cliente). Ejemplo de opción:
    { key: '000001', value: 'Cliente 1', option: { codCliente: '000001', nombre: 'Cliente 1', cifNif:'B2020202' }}

    DEBE INCLUIRSE EN UN HOOK useCallback PARA EVITAR BUCLES Y RENDERS INNECESARIOS
  */
  getOptions: PropTypes.func,
  /* Milisegundos a esperar desde que se deja de teclear un texto hasta que se lanza getOptions
   */
  timeout: PropTypes.number,
  options: PropTypes.array,
  value: PropTypes.any,
  /* Indica si el control necesita cargar dinámicamente los datos del servidor a medida que el usuario teclea, es decir, que la lista global de opciones varía según el texto introducido. Cuando esto es necesario (por ejemplo, en el control Cliente), hay que tener en cuenta:
   - Pasar una función getOptions que acepte dos parámetros, text y key. Cuando se le pasa el texto obtiene las opciones que coinciden con el texto. Cuando se le pasa key obtiene la opción asociada. Esto último es para mostrar correctamente la etiqueta asociada a un valor al dibujar por primera vez el componente.
   - Pasar las opciones calculadas por getOptions en la propiedad options.
   - Especificar si es necesario el timeout
  */
  async: PropTypes.bool,
};

SelectField.defaultProps = {};

export default SelectField;
