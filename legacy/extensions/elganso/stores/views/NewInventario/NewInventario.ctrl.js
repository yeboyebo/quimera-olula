import { util } from "quimera";
import { applyBunch, shortcutsBunch, shortcutsState } from "quimera/lib";

import data from "./NewInventario.ctrl.yaml";

export const state = parent => ({
  ...parent,
  ...shortcutsState(data.shortcuts),
  ...data.state,
  inventariosDbIndexState: null,
  setInventariosDbIndexState: null,
  codAlmacen: util.getUser().codtienda,
  superfamilias: [],
  familias: [],
  gruposmoda: [],
  annos: [],
  temporadas: [],
  articulos: [],
  inventario: {
    fecha: util.today(),
    hora: util.now(),
    descripcion: null,
    inventarioTotal: false,
    superfamilia: null,
    familia: null,
    grupomoda: null,
    anno: null,
    temporada: null,
    referencia: null,
    motivo: "Otros*",
    tipoinventario: "Ajuste referencias",
  },
});

export const bunch = parent => {
  const parentConShortCuts = {
    ...parent,
    ...shortcutsBunch(data.shortcuts),
    setIndexDb: [
      {
        type: "setStateKeys",
        plug: payload => {
          const { inventariosDbIndex, setInventariosDbIndex } = payload;

          return {
            keys: {
              inventariosDbIndexState: inventariosDbIndex,
              setInventariosDbIndexState: setInventariosDbIndex,
            },
          };
        },
      },
    ],
    setFechayHoraActual: [
      {
        type: "setStateKey",
        plug: () => ({
          path: "inventario.fecha",
          value: util.today(),
        }),
      },
      {
        type: "setStateKey",
        plug: () => ({
          path: "inventario.hora",
          value: util.now(),
        }),
      },
    ],
    onCheckboxInventarioClicked: [
      // Actualizamos fecha y hora cada vez que se cambia el checkbox de inventario total
      {
        type: "grape",
        name: "setFechayHoraActual",
      },
      {
        type: "setStateKey",
        plug: (...[, { inventarioTotal }]) => ({
          path: "inventarioTotal",
          value: !inventarioTotal,
        }),
      },
    ],
    setStateInventarioValue: [
      // Actualizamos fecha y hora cada vez que se cambia un valor del inventario
      {
        type: "grape",
        name: "setFechayHoraActual",
      },
      {
        type: "setStateKey",
        plug: ({ key, data }) => ({
          path: `inventario.${key}`,
          value: data,
        }),
      },
      {
        type: "grape",
        name: "getArticulos",
      },
    ],
    onCrearNuevoInventarioClicked: [
      // Actualizamos fecha y hora en este momento ya que esta guardada la del inicio de apertura del componente
      {
        type: "grape",
        name: "setFechayHoraActual",
      },
      {
        type: "grape",
        name: "createInventario",
      },
    ],
    onSuccessCreate: [
      {
        type: "grape",
        name: "onNewInventarioSuccess",
      },
      {
        type: "function",
        function: (payload, state) => {
          const { inventariosDbIndexState, setInventariosDbIndexState } = state;
          const { response } = payload;
          const inv = response.data[0];
          const result = [...inventariosDbIndexState, inv];

          // Actualizamos la bbdd indexada con el nuevo inventario
          setInventariosDbIndexState(result);
        },
      },
      {
        type: "navigate",
        url: payload => `/inventarios/edit/${payload.response.data[0].idsincro}`,
      },
    ],
  };

  return {
    ...parentConShortCuts,
    ...applyBunch(data.bunch, parentConShortCuts),
  };
};
