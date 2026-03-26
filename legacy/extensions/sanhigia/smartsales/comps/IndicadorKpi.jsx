import { Box, Collapse, Icon, IconButton } from "@quimera/comps";
import { makeStyles } from "@quimera/styles";
import { useState } from "react";

const useStyles = makeStyles(theme => ({
  contenedorKpi: {
    display: "flex",
    flexDirection: "column",
    // gap: "8px",
    marginBottom: "8px",
  },
  cabeceraKpi: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "8px 12px",
    backgroundColor: theme.palette.grey[100],
    borderRadius: "4px",
  },
  tituloKpi: {
    fontSize: "1rem",
    fontWeight: "600",
    flex: 1,
  },
  resumenKpi: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginRight: "8px",
  },
  contadorKpi: {
    fontSize: "1.1rem",
    fontWeight: "bold",
    padding: "4px 8px",
    borderRadius: "4px",
    minWidth: "30px",
    textAlign: "center",
  },
  rojo: {
    backgroundColor: "#ffebee",
    color: theme.palette.error.main,
  },
  naranja: {
    backgroundColor: "#fff3e0",
    color: theme.palette.warning.main,
  },
  verde: {
    backgroundColor: "#e8f5e9",
    color: theme.palette.success.main,
  },
  listaDetalle: {
    display: "flex",
    flexDirection: "column",
    borderTop: `1px solid ${theme.palette.grey[400]}`,
    // gap: "4px",
    // padding: "8px",
  },
  itemDetalle: {
    padding: "8px 12px",
    // borderRadius: "4px",
    fontSize: "0.9rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.palette.grey[100],
    borderBottom: `1px solid ${theme.palette.grey[400]}`,
  },
  etiquetaDetalle: {
    flex: 1,
  },
  porcentajeDetalle: {
    fontWeight: "bold",
    marginLeft: "8px",
  },
  botonExpandir: {
    transition: "transform 0.3s",
  },
  botonExpandirAbierto: {
    transform: "rotate(180deg)",
  },
}));

const obtenerClaseColor = (porcentaje, classes) => {
  if (porcentaje < 50) {
    return classes.rojo;
  }
  if (porcentaje < 100) {
    return classes.naranja;
  }

  return classes.verde;
};

export default function IndicadorKpi({ titulo, periodo, resumen, detalle }) {
  const classes = useStyles();
  const [expandido, setExpandido] = useState(false);

  if (!resumen) {
    return null;
  }

  return (
    <Box className={classes.contenedorKpi}>
      <Box>
        <Box mb={1} className={classes.tituloKpi}>
          {periodo || ""}
        </Box>
      </Box>
      <Box className={classes.cabeceraKpi}>
        <Box className={classes.tituloKpi}>{titulo}</Box>
        <Box className={classes.resumenKpi}>
          <Box className={`${classes.contadorKpi} ${classes.rojo}`}>
            {resumen.alcance_por_debajo || 0}
          </Box>
          <Box className={`${classes.contadorKpi} ${classes.naranja}`}>
            {resumen.alcance_en_progreso || 0}
          </Box>
          <Box className={`${classes.contadorKpi} ${classes.verde}`}>
            {resumen.alcance_cumplido || 0}
          </Box>
        </Box>
        <IconButton
          size="small"
          onClick={() => setExpandido(!expandido)}
          disabled={detalle?.length === 0}
        >
          <Icon
            className={`${classes.botonExpandir} ${expandido ? classes.botonExpandirAbierto : ""}`}
          >
            expand_more
          </Icon>
        </IconButton>
      </Box>

      <Collapse in={expandido}>
        <Box className={classes.listaDetalle}>
          {detalle?.map((item, index) => (
            <Box key={index} className={`${classes.itemDetalle}`}>
              <Box className={classes.etiquetaDetalle}>{item.etiqueta}</Box>
              <Box
                className={`${classes.contadorKpi} ${obtenerClaseColor(item.porcentaje, classes)}`}
              >
                {item.porcentaje?.toFixed(1)}%
              </Box>
            </Box>
          ))}
        </Box>
      </Collapse>
    </Box>
  );
}
