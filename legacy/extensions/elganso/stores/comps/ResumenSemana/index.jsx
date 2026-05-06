/* eslint-disable no-console */
import "./ResumenSemana.style.scss";

import PropTypes from "prop-types";

function ResumenSemana({ _estilos, ...props }) {
  // const { state, type = "week", fechaInicio, codtienda, codAgente = null } = props;
  // const {
  //   planificador,
  //   config: { tiendas, calendarios, agentes },
  // } = state;
  // const estaEnVacaciones = (dia, vacaciones) => {
  //   let isVacaciones = false;
  //   vacaciones.forEach(tramo => {
  //     if (tramo.desde <= dia && dia <= tramo.hasta) {
  //       isVacaciones = true;
  //     }
  //   });

  //   return isVacaciones;
  // };

  const { state, codtienda } = props;
  const { planificador } = state;

  if (codtienda && planificador) {
    // // OBTENEMOS EL CALENDARIO DE LA TIENDA
    // const calendarioTienda = calendarios[tiendas[codtienda].calendario];

    // // OBTENEMOS LOS AGENTES DE LA TIENDA (Si nos viene un agente por parametro filtramos)
    // const agentesTiendaKey = tiendas[codtienda].agentes;
    // const agentesTienda = {};
    // agentesTiendaKey.forEach(agenteKey => {
    //   if (codAgente === null || (codAgente !== null && codAgente === agenteKey)) {
    //     agentesTienda[agenteKey] = agentes[agenteKey];
    //   }
    // });

    // const actualYear = fechaInicio.getFullYear();
    // const actualMonth = fechaInicio.getMonth();

    // // OBTENEMOS EL PLANIFICADOR PARA ESA TIENDA
    // const inicio = new Date(fechaInicio).toISOString().substring(0, 10);
    // let semanaPlanificada = null;

    // if (type === "week") {
    //   semanaPlanificada = planificador.filter(p => p.semana === inicio && p.tienda === codtienda);
    // } else {
    //   const semanas = planificador.filter(p => p.tienda === codtienda);
    //   if (semanas && semanas.length > 0) {
    //     const finalArray = [];
    //     semanas.forEach(sem => {
    //       sem.jornadas.map(jornada => finalArray.push(jornada));
    //     });

    //     semanaPlanificada = [
    //       {
    //         jornadas: finalArray,
    //       },
    //     ];
    //   }
    // }

    // // OBTENEMOS LOS DIAS DE LA SEMANA
    // const dateInicio = new Date(fechaInicio);
    // const diasTotales = [];
    // diasTotales.push(fechaInicio.toISOString().substring(0, 10));

    // // Calculos dias totales mes
    // const newDateMonth = new Date(actualYear, actualMonth + 1, 0);
    // // Dias a mostrar segun si enseñamos semana o mes
    // const limit = type === "week" ? 6 : newDateMonth.getDate() - 1;

    // for (let i = 0; i < limit; i++) {
    //   const dia1 = new Date(dateInicio.setDate(dateInicio.getDate() + 1))
    //     .toISOString()
    //     .substring(0, 10);
    //   diasTotales.push(dia1);
    // }

    // // PLANIFICADOR FINAL CON FESTIVOS, FIN DE SEMANA Y VACACIONES
    // const planificadorFinal = {};
    // diasTotales.forEach(dia => {
    //   if (calendarioTienda.find(c => c.dia === dia)) {
    //     planificadorFinal[dia] = { festivo: true, motivo: "festivo nacional" };
    //   } else if (semanaPlanificada && semanaPlanificada.length > 0) {
    //     const semanaPlan = semanaPlanificada[0].jornadas.find(c => c.dia === dia);
    //     if (semanaPlan) {
    //       const agentesDia = {};
    //       Object.keys(agentesTienda).forEach(agenteKey => {
    //         if (estaEnVacaciones(dia, agentesTienda[agenteKey].vacaciones)) {
    //           agentesDia[agenteKey] = { id: agenteKey, vacaciones: true };
    //         } else {
    //           const result = semanaPlan["agentes"].find(p => p.id === agenteKey);
    //           agentesDia[agenteKey] = result;
    //         }
    //       });
    //       planificadorFinal[dia] = { festivo: false, agentes: agentesDia };
    //     } else {
    //       planificadorFinal[dia] = { festivo: true, motivo: "no laborable" };
    //     }
    //   } else {
    //     planificadorFinal[dia] = { noPlanficado: true };
    //   }
    // });
    const planificadorFinal = planificador[0];

    const horasTotales = 0;
    const diasTrabajados = 0;
    const diasVacaciones = 0;

    // let horasTotales = 0;
    // let diasTrabajados = 0;
    // let diasVacaciones = 0;

    // Object.keys(planificadorFinal).forEach(dia => {
    //   if (planificadorFinal[dia].agentes) {
    //     const agente = planificadorFinal[dia].agentes[codAgente];

    //     if (agente.tramos) {
    //       agente.tramos.forEach(tramo => {
    //         horasTotales += tramo.horas;
    //       });
    //       diasTrabajados += 1;
    //     } else if (agente.vacaciones) {
    //       diasVacaciones += 1;
    //     }
    //   }
    // });

    const mediaHoras = horasTotales / diasTrabajados;

    return (
      <div id="ResumenSemana">
        <div className="itemResumen">
          <div className="tituloItem">Nº Horas Trabajadas</div>
          <div className="resulItem">{horasTotales}</div>
        </div>
        <div className="itemResumen">
          <div className="tituloItem">Nº Dias Trabajados</div>
          <div className="resulItem">{diasTrabajados}</div>
        </div>
        <div className="itemResumen">
          <div className="tituloItem">Media Horas Trabajadas</div>
          <div className="resulItem">{isNaN(mediaHoras) ? 0 : mediaHoras}</div>
        </div>
        <div className="itemResumen">
          <div className="tituloItem">Dias Vacaciones</div>
          <div className="resulItem">{diasVacaciones}</div>
        </div>
      </div>
    );
  }

  return null;
}

ResumenSemana.propTypes = {
  estilos: PropTypes.object,
};
ResumenSemana.defaultProps = {};

export default ResumenSemana;
