import { getSchemas } from "quimera";
import { applyBunch, shortcutsBunch, shortcutsState } from "quimera/lib";

import data from "./EditEnvio.ctrl.yaml";

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
              lineasEnvios: payload.lineasEnvios,
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
              lineasEnvios: payload.lineasEnvios,
            },
          };
        },
      },
    ],
    getLineasEnvio: [
      {
        // SI No tengo lineas de envio indexadas tengo que obtenerlas, asociarlas al envio indexado,
        // almacenar el envio indexado y setear lineasEnvios para que funcione como al inicio setLineasEnvios
        condition: payload =>
          !payload.envioSeleccionado ||
          !("lineas" in payload.envioSeleccionado) ||
          Object.keys(payload.envioSeleccionado.lineas).length === 0,
        type: "get",
        schema: getSchemas().lineas_envios,
        params: payload => ({
          idViaje: payload["idviajemultitransFiltro"],
        }),
        success: "setLineasEnvios",
      },
      {
        // Si tengo lineas de envio indexadas solo tengo que setear lineas envio
        condition: payload =>
          payload.envioSeleccionado &&
          "lineas" in payload.envioSeleccionado &&
          Object.keys(payload.envioSeleccionado.lineas).length > 0,
        type: "setStateKeys",
        plug: payload => {
          const { envioSeleccionado } = payload;

          return {
            keys: {
              lineasEnvios: envioSeleccionado.lineas,
            },
          };
        },
      },
    ],
    setLineasEnvios: [
      {
        type: "function",
        function: payload => {
          const { enviosIndexados, idviajemultitransFiltro, response, setEnviosDbIndex } = payload;

          if (enviosIndexados) {
            const envioSeleccionado = enviosIndexados.find(
              envio => envio.idviajemultitrans === idviajemultitransFiltro,
            );
            envioSeleccionado.lineas = response.data;
            setEnviosDbIndex(enviosIndexados);
          }
        },
      },
      {
        type: "setStateKeys",
        plug: payload => {
          const { response } = payload;

          return {
            keys: {
              lineasEnvios: response.data,
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
