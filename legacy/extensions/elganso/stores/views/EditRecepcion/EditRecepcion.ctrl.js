import { getSchemas } from "quimera";
import { applyBunch, shortcutsBunch, shortcutsState } from "quimera/lib";

import data from "./EditRecepcion.ctrl.yaml";

export const state = parent => ({
  ...parent,
  ...shortcutsState(data.shortcuts),
  ...data.state,
});

export const bunch = parent => {
  const parentConShortCuts = {
    ...parent,
    ...shortcutsBunch(data.shortcuts),
    updateLinea: [
      {
        type: "setStateKeys",
        plug: (payload, { response }, state) => {
          return {
            keys: {
              lineasRecepcion: payload.lineasRecepcion,
            },
          };
        },
      },
    ],
    blockLinea: [
      {
        type: "setStateKeys",
        plug: (payload, { response }, state) => {
          return {
            keys: {
              lineasRecepcion: payload.lineasRecepcion,
            },
          };
        },
      },
    ],
    getLineasRecepcion: [
      {
        // SI No tengo lineas de envio indexadas tengo que obtenerlas, asociarlas a la recepcion indexada,
        // almacenar la recepcion indexada y setear lineasRecepcion para que funcione como al inicio setLineasRecepcion
        condition: payload =>
          !payload.recepcionSeleccionada ||
          !("lineas" in payload.recepcionSeleccionada) ||
          Object.keys(payload.recepcionSeleccionada.lineas).length === 0,
        type: "get",
        schema: getSchemas().lineas_envios,
        params: payload => ({
          idViaje: payload["idviajemultitransFiltro"],
        }),
        success: "setLineasRecepcion",
      },
      {
        // Si tengo lineas de envio indexadas solo tengo que setear lineas envio
        condition: payload =>
          payload.recepcionSeleccionada &&
          "lineas" in payload.recepcionSeleccionada &&
          Object.keys(payload.recepcionSeleccionada.lineas).length > 0,
        type: "setStateKeys",
        plug: payload => {
          const { recepcionSeleccionada } = payload;

          return {
            keys: {
              lineasRecepcion: recepcionSeleccionada.lineas,
            },
          };
        },
      },
    ],
    setLineasRecepcion: [
      {
        type: "function",
        function: payload => {
          const { recepcionesIndexadas, idviajemultitransFiltro, response, setRecepcionesDbIndex } =
            payload;

          if (recepcionesIndexadas) {
            const recepcionSeleccionada = recepcionesIndexadas.find(
              recepcion => recepcion.idviajemultitrans === idviajemultitransFiltro,
            );
            recepcionSeleccionada.lineas = response.data;
            setRecepcionesDbIndex(recepcionesIndexadas);
          }
        },
      },
      {
        type: "setStateKeys",
        plug: payload => {
          const { response } = payload;

          return {
            keys: {
              lineasRecepcion: response.data,
            },
          };
        },
      },
    ],
  };

  return {
    ...parentConShortCuts,
    ...applyBunch(data.bunch, parentConShortCuts),
  };
};
