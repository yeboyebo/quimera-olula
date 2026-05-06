import "./DiaPlanificador.style.scss";

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import { Icon } from "@quimera/comps";
import PropTypes from "prop-types";

import { AgentePlanificador } from "../../comps";

const renderCabecera = dia => {
  const date = new Date(dia);
  const diasSemana = {
    0: "Domingo",
    1: "Lunes",
    2: "Martes",
    3: "Miercoles",
    4: "Jueves",
    5: "Viernes",
    6: "Sabado",
  };
  const meses = {
    0: "Enero",
    1: "Febrero",
    2: "Marzo",
    3: "Abril",
    4: "Mayo",
    5: "Junio",
    6: "Julio",
    7: "Agosto",
    8: "Septiembre",
    9: "Octubre",
    10: "Noviembre",
    11: "Diciembre",
  };

  const diaFormated = `${diasSemana[date.getDay()]}, ${date.getDate()} de 
  ${meses[date.getMonth()]}
   de ${date.getFullYear()}`;

  return <div className="cabeceraDia">{diaFormated}</div>;
};
const renderAgentes = (
  diaPlanificado,
  codAgente,
  dia,
  codTienda,
  fechaInicio,
  editable,
  agenteFiltro,
) => {
  const { agentes } = diaPlanificado;

  const agentesVacios = Object.keys(agentes).filter(agente => !agentes[agente]);
  const creaUsuariosSinTramos = i => {
    agentes[i] = { id: i, tramos: [] };
  };

  agentesVacios.forEach(creaUsuariosSinTramos);

  if (agentes) {
    return Object.keys(agentes).map(agente => {
      if (agenteFiltro && agenteFiltro !== agentes[agente].id) {
        return null;
      }

      return (
        <div key={agente} className="containerAgente">
          <AgentePlanificador
            agente={agentes[agente]}
            codAgente={codAgente}
            dia={dia}
            codTienda={codTienda}
            fechaInicio={fechaInicio}
            editable={editable}
          />
        </div>
      );
    });
  }

  return null;
};

function DiaPlanificador({ _estilos, ...props }) {
  const {
    dia,
    diaPlanificado,
    index,
    expanded,
    handleChange,
    codAgente = null,
    codTienda,
    fechaInicio,
    editable,
    agenteFiltro,
  } = props;

  return (
    <Accordion expanded={expanded === `panel${index}`} onChange={handleChange(`panel${index}`)}>
      <AccordionSummary
        expandIcon={<Icon>arrow_drop_down</Icon>}
        aria-controls="panel1-content"
        id="panel1-header"
      >
        {renderCabecera(dia)}
      </AccordionSummary>
      {/* <AccordionDetails>
        <div className="diaPlanificado">
          {"festivo" in diaPlanificado && diaPlanificado.festivo ? (
            <div className="diaFestivo">{diaPlanificado.motivo}</div>
          ) : (
            renderAgentes(diaPlanificado, codAgente, dia, codTienda, fechaInicio)
          )}
        </div>
      </AccordionDetails> */}
      <AccordionDetails>
        <div className="diaPlanificado">
          {renderAgentes(
            diaPlanificado,
            codAgente,
            dia,
            codTienda,
            fechaInicio,
            editable,
            agenteFiltro,
          )}
        </div>
      </AccordionDetails>
    </Accordion>
  );
}

DiaPlanificador.propTypes = {
  estilos: PropTypes.object,
};
DiaPlanificador.defaultProps = {};

export default DiaPlanificador;
