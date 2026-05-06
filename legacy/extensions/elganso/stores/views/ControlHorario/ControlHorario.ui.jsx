import Quimera, { PropValidation } from "quimera";

// import { Grid, Button, Column, Field, Table, Dialog, DialogContent, IconButton, Icon, Typography } from '@quimera/comps'
import { ControlHorarioComp, SemanaControlHorasComp } from "../../comps";

function ControlHorario() {
  const render = () => {
    return (
      <>
        <ControlHorarioComp />
        <SemanaControlHorasComp />
      </>
    );
  };

  return <Quimera.Template id="ControlHorario">{render()}</Quimera.Template>;
}

ControlHorario.propTypes = PropValidation.propTypes;
ControlHorario.defaultProps = PropValidation.defaultProps;
export default ControlHorario;
