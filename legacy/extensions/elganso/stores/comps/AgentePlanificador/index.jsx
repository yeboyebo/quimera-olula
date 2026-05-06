import "./AgentePlanificador.style.scss";

import { Button, Icon, IconButton } from "@quimera/comps";
import PropTypes from "prop-types";
import { useStateValue, useWidth, util } from "quimera";

import { SliderRangoHora } from "../../comps";

const renderCabeceraAgente = (agente, addTramo) => {
  const { id, nombre, tramos = [], vacaciones = false } = agente;
  let totalHoras = 0;

  tramos.forEach(tramo => {
    totalHoras += (util.horasMinsAMinutos(tramo.hasta) - util.horasMinsAMinutos(tramo.desde)) / 60;
  });

  return (
    <div className="cabeceraAgente">
      <div>{nombre}:</div>
      {!vacaciones ? (
        <>
          <div className="infoTramo">
            <span>
              <strong>Jornada:</strong> {totalHoras} horas
            </span>
          </div>
        </>
      ) : (
        ""
      )}
    </div>
  );
};

const renderTramosAgente = (tramos, mobile, codAgente, fechaInicio, codTienda, editable) => {
  const [state, dispatch] = useStateValue();

  const deleteTramo = idTramo => {
    dispatch({
      type: "onBorrarTramoHorarioClick",
      payload: {
        idTramo,
        fechaInicio,
        codTienda,
      },
    });
  };

  return (
    <>
      {Object.keys(tramos).map(tramo => (
        <div key={tramo} className="containerInfoSlider">
          {mobile || codAgente ? (
            <div className="infoTramo">
              <span>
                <strong>Tramo:</strong> {tramos[tramo].desde} - {tramos[tramo].hasta}
              </span>
              <span>
                <strong>Horas:</strong> {tramos[tramo].horas}
              </span>
            </div>
          ) : null}
          <div className="containerSlider">
            {editable ? (
              <IconButton
                id="idButtonDeleteTramo"
                className="button-delete-tramo"
                onClick={() => deleteTramo(tramos[tramo].idTramo)}
              >
                <Icon>delete</Icon>
              </IconButton>
            ) : (
              <span className="button-delete-tramo-p"></span>
            )}
            <SliderRangoHora tramo={tramos[tramo]} id={tramo} editable={editable} />
          </div>
        </div>
      ))}
    </>
  );
};

function AgentePlanificador({ _estilos, ...props }) {
  const { agente, codAgente = null, fechaInicio, codTienda } = props;
  const width = useWidth();
  const mobile = ["xs", "sm"].includes(width);
  const [state, dispatch] = useStateValue();

  const isEditable = () => {
    const { editable, dia } = props;

    if (editable) {
      const ahora = new Date();
      const diaP = new Date(dia);
      if (ahora >= diaP) {
        return !editable;
      }
    }

    return editable;
  };

  const addTramo = () => {
    const {
      dia,
      agente: { id: idAgente },
    } = props;
    dispatch({
      type: "onAddTramoClicked",
      payload: {
        dia,
        idAgente,
      },
    });
  };

  return (
    <>
      {renderCabeceraAgente(agente, addTramo)}
      <div className="diaPlanificado">
        {"vacaciones" in agente && agente.vacaciones ? (
          <div className="agenteVacaciones">Vacaciones</div>
        ) : (
          <div className="containerTramos">
            {renderTramosAgente(
              agente.tramos,
              mobile,
              codAgente,
              fechaInicio,
              codTienda,
              isEditable(),
            )}
            <div className="buttonNuevoTramo-wrapper">
              {isEditable() ? (
                <Button
                  id="nuevoTramo"
                  className="buttonNuevoTramo"
                  text="Nuevo Tramo"
                  variant="outlined"
                  startIcon={<Icon>add_circle_outline</Icon>}
                  onClick={addTramo}
                />
              ) : null}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

AgentePlanificador.propTypes = {
  estilos: PropTypes.object,
};
AgentePlanificador.defaultProps = {};

export default AgentePlanificador;
