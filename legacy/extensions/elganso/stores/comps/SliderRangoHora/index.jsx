import "./SliderRangoHora.style.scss";

import { Slider } from "@quimera/thirdparty";
import PropTypes from "prop-types";
import { useStateValue, useWidth, util } from "quimera";
import { useState } from "react";

function crearMarcasHoras(rangoHorasEnMinutos) {
  const marcas = [];
  let minutosEntreMarcas = parseInt(
    parseInt((rangoHorasEnMinutos[1] - rangoHorasEnMinutos[0]) / 4, 10) / 2,
    10,
  );

  minutosEntreMarcas = 30;
  let showLabel = true;
  for (let i = rangoHorasEnMinutos[0]; i <= rangoHorasEnMinutos[1]; i += minutosEntreMarcas) {
    if (showLabel) {
      marcas.push({ value: i, label: util.minutosToHorasMins(i) });
      showLabel = false;
    } else {
      marcas.push({ value: i, label: "" });
      showLabel = true;
    }
  }

  return marcas;
}

function crearMarcasHorasMobile(rangoHorasEnMinutos) {
  const marcas = [];
  let minutosEntreMarcas = parseInt(
    parseInt((rangoHorasEnMinutos[1] - rangoHorasEnMinutos[0]) / 4, 10) / 2,
    10,
  );

  minutosEntreMarcas = 30;

  for (let i = rangoHorasEnMinutos[0]; i <= rangoHorasEnMinutos[1]; i += minutosEntreMarcas) {
    if (i === rangoHorasEnMinutos[0] || i === rangoHorasEnMinutos[1]) {
      marcas.push({ value: i, label: util.minutosToHorasMins(i) });
    } else {
      marcas.push({ value: i, label: "" });
    }
  }

  return marcas;
}

function valueLabelFormat(value) {
  return util.minutosToHorasMins(value);
}

function SliderRangoHora({ _estilos, ...props }) {
  const width = useWidth();
  const mobile = ["xs", "sm"].includes(width);
  const [state, dispatch] = useStateValue();
  const { tramo } = props;
  const rangoHorasEnMinutos = [util.horasMinsAMinutos("09:00"), util.horasMinsAMinutos("22:00")];
  let marcas = null;
  const [value, setValue] = useState([
    util.horasMinsAMinutos(tramo.desde),
    util.horasMinsAMinutos(tramo.hasta),
  ]);

  const handleChange = (event, newValue) => {
    const { editable } = props;
    if (editable) {
      setValue(newValue);
    }
  };

  if (mobile) {
    marcas = crearMarcasHorasMobile(rangoHorasEnMinutos);
  } else {
    marcas = crearMarcasHoras(rangoHorasEnMinutos);
  }

  // Cuando levantamos el click lo confirmamos
  const handleChangeCommitted = (event, newValue) => {
    const {
      tramo: { idTramo },
      editable,
    } = props;
    if (editable) {
      const inicio = newValue[0] > newValue[1] ? newValue[1] : newValue[0];
      const fin = newValue[0] >= newValue[1] ? newValue[0] : newValue[1];
      dispatch({
        type: "onTramoHorarioChange",
        payload: {
          idTramo,
          tramoDesde: util.minutosToHorasMins(inicio),
          tramoHasta: util.minutosToHorasMins(fin),
        },
      });
    }
  };

  if (
    value[0] !== util.horasMinsAMinutos(tramo.desde) ||
    value[1] !== util.horasMinsAMinutos(tramo.hasta)
  ) {
    setValue([util.horasMinsAMinutos(tramo.desde), util.horasMinsAMinutos(tramo.hasta)]);
  }

  return (
    <Slider
      style={{ width: "90%", color: "#072146" }}
      value={value}
      step={30}
      marks={marcas}
      min={rangoHorasEnMinutos[0]}
      max={rangoHorasEnMinutos[1]}
      disabled={false}
      onChangeCommitted={handleChangeCommitted}
      onChange={handleChange}
      valueLabelDisplay="off"
      aria-labelledby="range-slider"
      getAriaValueText={valueLabelFormat}
      valueLabelFormat={valueLabelFormat}
    />
  );
}

SliderRangoHora.propTypes = {
  estilos: PropTypes.object,
};
SliderRangoHora.defaultProps = {};

export default SliderRangoHora;
