import PropTypes from "prop-types";
import React, { useState } from "react";

import { DiaPlanificador } from "../../comps";

function SemanaPlanificador({ _estilos, ...props }) {
  const {
    state,
    fechaInicio,
    codtienda,
    codAgente = null,
    editable = false,
    agenteFiltro = null,
  } = props;
  const { planificador } = state;

  const [expanded, setExpanded] = useState("panel0");
  const handleChange = panel => (_, isExpanded) => {
    setExpanded(isExpanded ? panel : "panel0");
  };

  const printDay = (dia, diaPlanificado, index, agenteFiltro) => {
    return (
      <DiaPlanificador
        dia={dia}
        diaPlanificado={diaPlanificado}
        index={index}
        expanded={expanded}
        handleChange={handleChange}
        codAgente={codAgente}
        codTienda={codtienda}
        fechaInicio={fechaInicio}
        editable={editable}
        agenteFiltro={agenteFiltro}
      />
    );
  };

  if (codtienda) {
    const planificadorFinal = planificador[0];

    return (
      <>
        {Object.keys(planificadorFinal).map((dia, index) => (
          <div key={dia} className="expandableDay">
            {printDay(dia, planificadorFinal[dia], index, agenteFiltro)}
          </div>
        ))}
      </>
    );
  }

  return null;
}

SemanaPlanificador.propTypes = {
  estilos: PropTypes.object,
};
SemanaPlanificador.defaultProps = {};

export default SemanaPlanificador;
