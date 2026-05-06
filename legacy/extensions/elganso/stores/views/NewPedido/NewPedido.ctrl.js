import { util } from "quimera";
import { applyBunch, shortcutsBunch, shortcutsState } from "quimera/lib";

import data from "./NewPedido.ctrl.yaml";

export const state = parent => ({
  ...parent,
  ...shortcutsState(data.shortcuts),
  ...data.state,
  jornadaAbierta: false,
  puntosVenta: [],
  puntoVentaSeleccionado: null,
  msgSuccess: "",
  msgError: "",
  barcode: null,
  newPedido: {
    fecha: util.today(),
    hora: util.now(),
    codTienda: util.getUser().codtienda,
    codAgente: util.getUser().user,
    descripcionAgente: util.getUser().descripcion,
    idEmpresa: util.getUser().empresa.idEmpresa,
    idArqueo: null,
    idComanda: null,
    datosCliente: {
      nombre: "",
      cifnif: "",
      codTarjetaPuntos: "",
    },
    direccionCliente: {
      tipovia: "",
      direccion: "",
      numero: "",
      otros: "",
      ciudad: "",
      provincia: "",
      cpostal: "",
      pais: "",
    },
    lineas: [],
  },
});

export const bunch = parent => {
  const parentConShortCuts = {
    ...parent,
    ...shortcutsBunch(data.shortcuts),
    setStatePuntoVentaValue: [
      {
        type: "setStateKey",
        plug: ({ key, data }) => {
          localStorage.setItem(key, data);

          return {
            path: `${key}`,
            value: data,
          };
        },
      },
      {
        condition: (payload, { jornadaAbierta, puntoVentaSeleccionado }) =>
          jornadaAbierta && puntoVentaSeleccionado !== null,
        type: "grape",
        name: "getIdArqueo",
      },
    ],
    checkPuntoVenta: [
      {
        type: "setStateKeys",
        plug: () => {
          let puntoVentaSeleccionado = null;

          if (localStorage.getItem("puntoVentaSeleccionado")) {
            puntoVentaSeleccionado = localStorage.getItem("puntoVentaSeleccionado");
          }

          return {
            keys: {
              puntoVentaSeleccionado,
            },
          };
        },
      },
      {
        condition: (payload, { puntoVentaSeleccionado }) => puntoVentaSeleccionado === null,
        type: "grape",
        name: "getPuntosVenta",
      },
      {
        condition: (payload, { jornadaAbierta, puntoVentaSeleccionado }) =>
          jornadaAbierta && puntoVentaSeleccionado !== null,
        type: "grape",
        name: "getIdArqueo",
      },
    ],
    setMessageSuccess: [
      {
        type: "setStateKeys",
        plug: ({ linea }, _) => {
          return {
            keys: {
              msgSuccess: `Se ha añadido el producto con referencia ${linea.id}`,
            },
          };
        },
      },
    ],
    setMessageError: [
      {
        type: "setStateKeys",
        plug: (_, { barcode }) => {
          return {
            keys: {
              msgError: `No se ha encontrado ningún producto con referencia ${barcode}`,
            },
          };
        },
      },
    ],
    setReloadMessages: [
      {
        type: "setStateKeys",
        plug: () => {
          return {
            keys: {
              msgSuccess: "",
              msgError: "",
            },
          };
        },
      },
    ],
    onChangeCantidad: [
      {
        type: "setStateKeys",
        plug: ({ idLinea, newCantidad }, { newPedido, newPedido: { lineas } }) => {
          const newLineas = lineas.map(linea => {
            if (linea.id === idLinea) {
              return {
                ...linea,
                cantidad: newCantidad,
              };
            }

            return linea;
          });

          return {
            keys: {
              newPedido: {
                ...newPedido,
                lineas: newLineas,
              },
            },
          };
        },
      },
    ],
    onDeleteLineaInventarioClicked: [
      {
        type: "userConfirm",
        question: ({ descriptionLinea }) => ({
          titulo: "¿Borrar Linea?",
          cuerpo: `El producto ${descriptionLinea} se eliminará definitivamente`,
          textoSi: "CONFIRMAR",
          textoNo: "CANCELAR",
        }),
        onConfirm: "deleteLinea",
      },
    ],
    deleteLinea: [
      {
        type: "setStateKeys",
        plug: ({ idLinea }, { newPedido, newPedido: { lineas } }) => {
          const newLineas = lineas.filter(linea => linea.id !== idLinea);

          return {
            keys: {
              newPedido: {
                ...newPedido,
                lineas: newLineas,
              },
            },
          };
        },
      },
      {
        type: "grape",
        name: "onDeleteLineaSuccess",
      },
    ],
    onClickAddNewLinea: [
      {
        type: "grape",
        name: "createNewLinea",
      },
    ],
    saveNewLineaPedido: [
      {
        type: "setStateKeys",
        plug: ({ response }, { newPedido, newPedido: { lineas } }) => {
          const { linea, msgSuccess, msgError } = response;

          if (msgError && msgError !== "") {
            return {
              keys: {
                msgError,
              },
            };
          }

          const newLineas = [...lineas, linea];

          return {
            keys: {
              newPedido: {
                ...newPedido,
                lineas: newLineas,
              },
              msgSuccess,
            },
          };
        },
      },
    ],
    onCrearNuevoPedidoClicked: [
      {
        type: "function",
        function: (_, { newPedido: { codAgente, codTienda }, puntoVentaSeleccionado }) => {
          const url = "http://localhost:8006/tpv/venta";
          const token = "7636698a0ad794d5d3e0b3715acd78f7";
          const fetchData = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
              "tenant_id": codTienda,
            },
            body: JSON.stringify({
              agente_id: codAgente,
              punto_venta_id: puntoVentaSeleccionado,
            }),
          };

          fetch(url, fetchData)
            .then(async response => {
              if (response.ok) {
                const responseData = await response.json();
                console.log("responseData: ", responseData);

                // if (responseData?.id !== undefined) {
                //   return {
                //     keys: {
                //       newPedido: {
                //         ...newPedido,
                //         idComanda: responseData.id,
                //       },
                //     },
                //   };
                // }
              } else {
                const errorText = response.text();
                console.log("errorText: ", errorText);
                // error(errorText);
              }
            })
            .catch(errorResponse => {
              console.log("++++++++++++++");
              console.log(errorResponse);

              // const message = "message" in errorResponse ? errorResponse.message : errorResponse;
              // error(message);
            });
        },
      },
    ],
  };

  return {
    ...parentConShortCuts,
    ...applyBunch(data.bunch, parentConShortCuts),
  };
};
