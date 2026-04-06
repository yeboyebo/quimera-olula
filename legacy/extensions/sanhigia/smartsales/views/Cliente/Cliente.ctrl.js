import { applyBunch, shortcutsBunch, shortcutsState } from "quimera/lib";
import Quimera, { util } from "quimera";
import data from "./Cliente.ctrl.yaml";

export const state = parent => ({
  ...parent,
  ...shortcutsState(data.shortcuts),
  ...data.state,
});

export const bunch = parent => {
  const parentConShortCuts = {
    ...parent,
    ...shortcutsBunch(data.shortcuts),
    onInit: [
      // {
      //   type: "setStateKey",
      //   plug: ({ initCliente }) => ({
      //     path: "lineaseventos.filter.and",
      //     value: [["codevento", "eq", `${initCliente?.codCliente}`]],
      //   }),
      // },
      // {
      //   type: "grape",
      //   name: "getLineaseventos",
      // },
      {
        type: "grape",
        name: "dameContactos",
      },
      {
        type: "grape",
        name: "dameTratosPendientes",
      },
      {
        type: "grape",
        name: "dameTareasPendientes",
      },
      {
        type: "grape",
        name: "damePresupuestosPendientes",
      },
    ],
    dameContactos: [
      {
        type: "setStateKey",
        plug: ({ initCliente }, { cliente }) => ({
          path: "contactos.filter.and",
          value: [["crm_contactos.codcliente", "eq", "'" + cliente.data?.codCliente + "'"]],
        }),
      },
      {
        type: "grape",
        name: "getContactos",
      },
    ],
    dameTratosPendientes: [
      {
        type: "function",
        function: (_, { cliente }) => {
          const agenteSmartsalesEnabled = util.getUser()?.superuser || util.getUser().group === "MKT" || util.getUser().group === "Responsable de marketing" ? true : false;
          let filtros = { and: [["codcliente", "eq", cliente.data?.codCliente]] };

          !agenteSmartsalesEnabled && filtros["and"].push(["codagente", "eq", util.getUser()?.codagente])

          return { filtros: filtros };
        },
        success: [
          {
            type: "setStateKey",
            plug: ({ response }) => ({ path: "tratosPendientes.filter.and", value: response.filtros }),
          },
        ],
      },
      {
        type: "grape",
        name: "getTratosPendientes",
      },
    ],
    dameTareasPendientes: [
      {
        type: "function",
        function: (_, { cliente }) => {
          const agenteSmartsalesEnabled = util.getUser()?.superuser || util.getUser().group === "MKT" || util.getUser().group === "Responsable de marketing" ? true : false;
          let filtros = { and: [["codcliente", "eq", cliente.data?.codCliente]] };

          !agenteSmartsalesEnabled && filtros["and"].push(["codagente", "eq", util.getUser()?.codagente])

          return { filtros: filtros };
        },
        success: [
          {
            type: "setStateKey",
            plug: ({ response }) => ({ path: "tareasPendientes.filter.and", value: response.filtros }),
          },
        ],
      },
      {
        type: "grape",
        name: "getTareasPendientes",
      },
    ],
    damePresupuestosPendientes: [
      {
        type: "function",
        function: (_, { cliente }) => {
          const agenteSmartsalesEnabled = util.getUser()?.superuser || util.getUser().group === "MKT" || util.getUser().group === "Responsable de marketing" ? true : false;
          let filtros = { and: [["codcliente", "eq", cliente.data?.codCliente]] };

          !agenteSmartsalesEnabled && filtros["and"].push(["codagente", "eq", util.getUser()?.codagente])

          return { filtros: filtros };
        },
        success: [
          {
            type: "setStateKey",
            plug: ({ response }) => ({ path: "presupuestosPendientes.filter.and", value: response.filtros }),
          },
        ],
      },
      {
        type: "grape",
        name: "getPresupuestosPendientes",
      },
    ],
    onCrearNuevoContactoClicked: [
      {
        type: "setStateKey",
        plug: () => ({ path: "modalCrearContactoVisible", value: true }),
      },
    ],
    onCerrarCrearContacto: [
      {
        type: "grape",
        name: "dameContactos",
      },
      {
        type: "setStateKey",
        plug: () => ({ path: "modalCrearContactoVisible", value: false }),
      },
    ],
    onAnadirContactoClicked: [
      {
        type: "setStateKey",
        plug: () => ({ path: "modalCrearContactoVisible", value: true }),
      },
    ],
    onCerrarAnadirContacto: [
      {
        type: "grape",
        name: "dameContactos",
      },
      {
        type: "setStateKey",
        plug: () => ({ path: "modalCrearContactoVisible", value: false }),
      },
    ],
  };

  return {
    ...parentConShortCuts,
    ...applyBunch(data.bunch, parentConShortCuts),

  };
};
