import { applyBunch, shortcutsBunch, shortcutsState } from "quimera/lib";

import data from "./PlanificadorSemanal.ctrl.yaml";

export const state = parent => ({
  ...parent,
  ...shortcutsState(data.shortcuts),
  ...data.state,
});

export const bunch = parent => {
  const parentConShortCuts = {
    ...parent,
    ...shortcutsBunch(data.shortcuts),
    addTramo: [
      {
        type: "function",
        function: payload => {
          alert("addTramo Parent");
        },
      },
    ],
    deleteTramo: [
      {
        type: "function",
        function: (payload, state) => {
          // const { planificador } = state;
          // delete planificador[3].jornadas[0].agentes[3].tramos[1];
          const { idTramo } = payload;
          alert(`deleteTramo Parent: ${idTramo}`);
        },
      },
    ],
    updateTramo: [
      {
        type: "function",
        function: payload => {
          const { idTramo, newValue } = payload;
          //alert(`update Parent: ${idTramo}`);
        },
      },
    ],
  };

  return {
    ...parentConShortCuts,
    ...applyBunch(data.bunch, parentConShortCuts),
  };
};
