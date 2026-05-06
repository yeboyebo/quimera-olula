/* eslint-disable prettier/prettier */
import { getSchemas, util } from "quimera";
import { applyBunch, shortcutsBunch, shortcutsState } from "quimera/lib";

import data from "./Inventarios.ctrl.yaml";

export const state = parent => ({
  ...parent,
  ...shortcutsState(data.shortcuts),
  ...data.state,
  inventarios: [],
  almacenFiltro: util.getUser().codtienda,
  anyosFiltro: null,
  inventariosDbIndexState: null,
  setInventariosDbIndexState: null
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
    setFechaFiltro: [
      {
        type: "setStateKeys",
        plug: payload => {
          const { filtroYears } = payload;

          return {
            keys: {
              anyosFiltro: filtroYears,
            },
          };
        },
      },
    ],
    getInventarios: [
      {
        // Si no tenemos datos en la bbdd indexada los pedimos al servidor
        condition: payload =>
          !payload.inventariosDbIndex || payload.inventariosDbIndex.length === 0,
        type: "get",
        schema: getSchemas().inventarios,
        params: (_, state) => {
          const { anyosFiltro, almacenFiltro } = state;

          return { anyos: JSON.stringify(anyosFiltro), almacen: almacenFiltro };
        },
        success: "setInventarios",
      },
      {
        // Si ya teníamos datos en la bbdd indexada los guardamos en el state
        condition: payload => payload.inventariosDbIndex && payload.inventariosDbIndex.length > 0,
        type: "setStateKeys",
        plug: payload => {
          const { inventariosDbIndex } = payload;

          return {
            keys: {
              inventarios: inventariosDbIndex,
            },
          };
        },
      },
    ],
    setInventarios: [
      {
        type: "setStateKeys",
        plug: (payload, state) => {
          const { setInventariosDbIndexState } = state;

          // Venimos del get, guardamos inventarios en state y en la bbdd indexada
          setInventariosDbIndexState(payload.response.data);

          return {
            keys: {
              inventarios: payload.response.data,
            },
          };
        },
      },
    ],
    getArticulos: [
      {
        // Si no tenemos datos en la bbdd indexada los pedimos al servidor
        condition: payload => !payload.articulosDbIndex || payload.articulosDbIndex.length === 0,
        type: "get",
        schema: getSchemas().articulos,
        success: "setArticulos",
      },
    ],
    setArticulos: [
      {
        type: "function",
        function: payload => {
          const { setArticulosDbIndex } = payload;

          // Venimos del get, guardamos articulos en la bbdd indexada
          setArticulosDbIndex(payload.response.data);
        },
      },
    ],
    updateRemovedInventario: [
      {
        // Actualizamos los inventarios en state y en la bbdd indexada
        type: "setStateKeys",
        plug: (payload, state) => {
          const { inventarios, setInventariosDbIndexState } = state;
          const { idInventario } = payload;

          const inventariosUpdated = inventarios.filter(
            inventario => inventario.idinventario !== idInventario,
          );

          setInventariosDbIndexState(inventariosUpdated);

          return {
            keys: {
              inventarios: inventariosUpdated,
            },
          };
        },
      },
    ],
    onSincroInventarioClicked: [
      {
        type: "userConfirm",
        question: ({ idInventario, descInventario }) => ({
          titulo: "¿Sincronizar Inventario?",
          cuerpo: `El inventario ${idInventario} - ${descInventario} se sincronizara. Una vez cerrado el inventario no se podrá volver a modificar. ¿Está seguro?`,
          textoSi: "CONFIRMAR",
          textoNo: "CANCELAR",
        }),
        onConfirm: "sincroInventario",
      },
    ],
    sincroInventario: [
      {
        type: "grape",
        name: "sincroInventarioApi",
        plug: (payload, state) => {
          const { idInventario } = payload;
          const { inventarios } = state;
          const inventarioSeleccionado = inventarios.find(
            inventario => inventario.idinventario === idInventario,
          );

          return {
            ...payload,
            lineasInventario: inventarioSeleccionado.lineasModificadas,
          };
        },
      },
    ],
    sincroInventarioSuccess: [
      {
        type: "showMessage",
        plug: payload => ({
          mensaje: payload.response.msg,
          tipoMensaje: payload.response.result ? "success" : "error",
        }),
      },
      {
        // Actualizamos los inventarios en state y en la bbdd indexada
        condition: payload => payload.response.result,
        type: "setStateKeys",
        plug: (payload, state) => {
          const { idInventario, response: { result } } = payload;
          const { inventarios, setInventariosDbIndexState } = state;

          if (result) {
            const inventarioSeleccionado = inventarios.find(
              inventario => inventario.idinventario === idInventario,
            );
            delete inventarioSeleccionado.lineasModificadas;
            inventarioSeleccionado.enviado = true;
          }

          setInventariosDbIndexState(inventarios);

          return {
            keys: {
              inventarios,
            },
          };
        },
      },
    ],
    onDeleteInventarioClicked: [
      {
        type: "userConfirm",
        question: ({ idInventario, descInventario }) => ({
          titulo: "¿Borrar Inventario?",
          cuerpo: `El inventario ${idInventario} - ${descInventario} se eliminará de la lista de tramos definitivamente`,
          textoSi: "CONFIRMAR",
          textoNo: "CANCELAR",
        }),
        onConfirm: "onBorrarInventarioClick",
      },
    ],
    descargarInventarios: [
      {
        type: "userConfirm",
        question: ({ nInventarios }) => ({
          titulo: "¿Actualizar Inventarios?",
          cuerpo:
            nInventarios > 0
              ? `Existe ${nInventarios
              } inventario/s pendientes de sincronizar. Si continua se eliminarán los cambios.`
              : "Va a actualizar el listado de inventarios.",
          textoSi: "CONFIRMAR",
          textoNo: "CANCELAR",
        }),
        onConfirm: "onActualizarInventariosClick",
      },
    ],
    onActualizarInventariosClick: [
      {
        type: "function",
        function: payload => {
          const { obtenerInventarios } = payload;
          obtenerInventarios();
        },
      },
    ],
  };

  return {
    ...parentConShortCuts,
    ...applyBunch(data.bunch, parentConShortCuts),
  };
};
