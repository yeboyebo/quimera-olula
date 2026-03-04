import "./SemanaControlHoras.style.scss";

// import { DataGrid } from "@mui/x-data-grid";
import { Icon, IconButton } from "@quimera/comps";
import PropTypes from "prop-types";
import { useStateValue } from "quimera";
import React, { useEffect, useState } from "react";

function SemanaControlHoras({ _estilos, ...props }) {
  const [state, dispatch] = useStateValue();
  const [inicioSemana, setInicioSemana] = useState(new Date());
  const [finSemana, setFinSemana] = useState(new Date());
  const inicio = new Date(inicioSemana).toISOString().substring(0, 10);
  const fin = new Date(finSemana).toISOString().substring(0, 10);

  useEffect(() => {
    const date = new Date();
    while (date.getDay() !== 1) {
      date.setDate(date.getDate() - 1);
    }
    setInicioSemana(new Date(date));
    date.setDate(date.getDate() + 6);
    setFinSemana(new Date(date));
    dispatch({
      type: "init",
    });
  }, [dispatch]);

  const clickAnterior = () => {
    const date = new Date(inicioSemana);
    date.setDate(date.getDate() - 7);
    setInicioSemana(date);
    const dateFin = new Date(finSemana);
    dateFin.setDate(dateFin.getDate() - 7);
    setFinSemana(dateFin);
  };

  const clickSiguiente = () => {
    const date = new Date(inicioSemana);
    date.setDate(date.getDate() + 7);
    setInicioSemana(date);
    const dateFin = new Date(finSemana);
    dateFin.setDate(dateFin.getDate() + 7);
    setFinSemana(dateFin);
  };

  return (
    <>
      <div className="selectorSemanal">
        <IconButton id="psButtonLeft" className="icon-button" onClick={clickAnterior}>
          <Icon>chevron_left</Icon>
        </IconButton>
        <span id="semana">
          {inicio} - {fin}
        </span>
        <IconButton id="psButtonRight" className="icon-button" onClick={clickSiguiente}>
          <Icon>chevron_right</Icon>
        </IconButton>
      </div>
      {/* <DataGrid
        // rows={tramosTiempoFormat}
        disableColumnFilter
        disableColumnSelector
        disableDensitySelector
        disableColumnMenu
        disableRowSelectionOnClick
        // columns={columns}
        getRowId={row => row.idtramo}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            printOptions: { disableToolbarButton: true },
            csvOptions: { disableToolbarButton: true },
          },
          pagination: {
            labelRowsPerPage: "Líneas por página",
            labelDisplayedRows: ({ from, to, count }) => `${from}-${to} de ${count}`,
          },
        }}
      /> */}
    </>
  );
}

SemanaControlHoras.propTypes = {
  estilos: PropTypes.object,
};
SemanaControlHoras.defaultProps = {};

export default SemanaControlHoras;
