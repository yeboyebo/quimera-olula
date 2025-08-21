import React from 'react';
import { DiaCalendario } from './DiaCalendario';
import { getSemanasDelMes } from './helpers';
import { DatoBase } from './tipos';

interface CalendarioGridProps<T extends DatoBase> {
  modoAnio: boolean;
  fechaActual: Date;
  anioGridRef?: React.RefObject<HTMLDivElement | null>;
  handleScroll: () => void;
  diasSemana: string[];
  inicioSemana: 'lunes' | 'domingo';
  getDatosPorFechaFn: (datos: T[], fecha: Date) => T[];
  esHoyFn: (fecha: Date) => boolean;
  esMesActualFn: (fecha: Date, mesReferencia: Date) => boolean;
  formatearMesFn: (fecha: Date) => string;
  formatearMesAñoFn: (fecha: Date) => string;
  datos: T[];
  renderDia?: (args: {
    fecha: Date;
    datos: T[];
    esMesActual: boolean;
    esHoy: boolean;
  }) => React.ReactNode;
  renderDato?: (dato: T) => React.ReactNode;
  maxDatosVisibles: number;
}

export function CalendarioGrid<T extends DatoBase>({
  modoAnio,
  fechaActual,
  anioGridRef,
  handleScroll,
  diasSemana,
  inicioSemana,
  getDatosPorFechaFn,
  esHoyFn,
  esMesActualFn,
  formatearMesFn,
  formatearMesAñoFn,
  datos,
  renderDia,
  renderDato,
  maxDatosVisibles,
}: CalendarioGridProps<T>) {
  const renderDiaPorDefecto = (fecha: Date, mesReferencia: Date) => {
    const esDiaDelMes = esMesActualFn(fecha, mesReferencia);
    const datosDelDia: T[] = esDiaDelMes ? getDatosPorFechaFn(datos, fecha) : [];
    return (
      <DiaCalendario
        fecha={fecha}
        mesReferencia={mesReferencia}
        datos={datosDelDia}
        esHoy={esHoyFn(fecha)}
        esMesActual={esDiaDelMes}
        maxDatosVisibles={maxDatosVisibles}
        renderDato={renderDato}
      />
    );
  };

  if (modoAnio) {
    return (
      <div ref={anioGridRef} className="anio-grid" onScroll={handleScroll}>
        {Array.from({ length: 12 }).map((_, i) => {
          const mesFecha = new Date(fechaActual.getFullYear(), i, 1);
          return (
            <div key={mesFecha.getFullYear() + '-' + i} className="mes-anio">
              <h3 className="calendario-mes">{formatearMesAñoFn(mesFecha)}</h3>
              <div className="calendario-dias-semana">
                {diasSemana.map(dia => (
                  <div key={dia} className="dia-semana">{dia}</div>
                ))}
              </div>
              {getSemanasDelMes(mesFecha, inicioSemana)
                .filter(semana => semana.some(dia => dia.getMonth() === i))
                .map((semana, j) => (
                  <div key={mesFecha.getFullYear() + '-' + i + '-semana-' + j} className="calendario-dias">
                    {semana.map(dia => {
                      const key = dia.toISOString();
                      return renderDia
                        ? <React.Fragment key={key}>{renderDia({
                            fecha: dia,
                            datos: getDatosPorFechaFn(datos, dia),
                            esMesActual: esMesActualFn(dia, mesFecha),
                            esHoy: esHoyFn(dia)
                          })}</React.Fragment>
                        : <React.Fragment key={key}>{renderDiaPorDefecto(dia, mesFecha)}</React.Fragment>;
                    })}
                  </div>
                ))
              }
            </div>
          );
        })}
      </div>
    );
  }
  // Modo mes
  return (
    <div className="calendario-grid">
      <div className="calendario-dias-semana">
        {diasSemana.map(dia => (
          <div key={dia} className="dia-semana">{dia}</div>
        ))}
      </div>
      <div className="calendario-semanas">
        {getSemanasDelMes(fechaActual, inicioSemana)
          .filter(semana => semana.some(dia => dia.getMonth() === fechaActual.getMonth()))
          .map((semana, indexSemana) => (
            <div key={`semana-${fechaActual.getFullYear()}-${fechaActual.getMonth()}-${indexSemana}`} className="calendario-semana">
              {semana.map((dia) => {
                const key = dia.toISOString();
                const esDiaDelMes = dia.getMonth() === fechaActual.getMonth();
                return renderDia
                  ? <React.Fragment key={key}>{renderDia({
                      fecha: dia,
                      datos: esDiaDelMes ? getDatosPorFechaFn(datos, dia) : [],
                      esMesActual: esDiaDelMes,
                      esHoy: esHoyFn(dia)
                    })}</React.Fragment>
                  : <React.Fragment key={key}>{renderDiaPorDefecto(dia, fechaActual)}</React.Fragment>;
              })}
            </div>
          ))
        }
      </div>
    </div>
  );
}
