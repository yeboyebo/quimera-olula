import React from 'react';
import { DiaCalendario } from './DiaCalendario';
import { getSemanaActual, getSemanasDelMes } from './helpers';
import { DatoBase, ModoCalendario } from './tipos';

interface CalendarioGridProps<T extends DatoBase> {
  modoAnio: boolean;
  modoVista?: ModoCalendario; // Nueva prop para futura compatibilidad
  fechaActual: Date;
  anioGridRef?: React.RefObject<HTMLDivElement | null>;
  handleScroll: () => void;
  diasSemana: string[];
  inicioSemana: 'lunes' | 'domingo';
  getDatosPorFechaFn: (datos: T[], fecha: Date) => T[];
  esHoyFn: (fecha: Date) => boolean;
  esMesActualFn: (fecha: Date, mesReferencia: Date) => boolean;
  formatearMesFn: (fecha: Date) => string;
  formatearMesAñoFn?: (fecha: Date) => string;
  datos: T[];
  renderDia?: (args: {
    fecha: Date;
    datos: T[];
    esMesActual: boolean;
    esHoy: boolean;
    estaSeleccionada?: boolean;
    esSeleccionable?: boolean;
  }) => React.ReactNode;
  renderDato?: (dato: T) => React.ReactNode;
  maxDatosVisibles: number;
  // Props para selección de fechas
  onClickFecha?: (fecha: Date) => void;
  esFechaSeleccionada?: (fecha: Date) => boolean;
  esFechaSeleccionable?: (fecha: Date) => boolean;
}

export function CalendarioGrid<T extends DatoBase>({
  modoAnio,
  modoVista,
  fechaActual,
  anioGridRef,
  handleScroll,
  diasSemana,
  inicioSemana,
  getDatosPorFechaFn,
  esHoyFn,
  esMesActualFn,
  formatearMesFn,
  // formatearMesAñoFn, // No se usa actualmente
  datos,
  renderDia,
  renderDato,
  maxDatosVisibles,
  onClickFecha,
  esFechaSeleccionada,
  esFechaSeleccionable,
}: CalendarioGridProps<T>) {
  // Si se pasa modoVista, usamos esa información
  const modoCalendario = modoVista || (modoAnio ? 'anio' : 'mes');

  const renderDiaPorDefecto = (fecha: Date, mesReferencia: Date) => {
    const esDiaDelMes = esMesActualFn(fecha, mesReferencia);
    const datosDelDia: T[] = esDiaDelMes ? getDatosPorFechaFn(datos, fecha) : [];
    // En modo semana, permitir más eventos visibles para aprovechar el espacio vertical
    const maxEventosVisibles = modoCalendario === 'semana' ? 50 : maxDatosVisibles;
    
    const estaSeleccionada = esFechaSeleccionada?.(fecha) || false;
    const esSeleccionable = esFechaSeleccionable?.(fecha) ?? true;
    
    // Si hay renderDia personalizado, pasarle los estados de selección
    if (renderDia) {
      return renderDia({
        fecha,
        datos: datosDelDia,
        esMesActual: esDiaDelMes,
        esHoy: esHoyFn(fecha),
        estaSeleccionada,
        esSeleccionable,
      });
    }
    
    return (
      <DiaCalendario
        fecha={fecha}
        mesReferencia={mesReferencia}
        datos={datosDelDia}
        esHoy={esHoyFn(fecha)}
        esMesActual={esDiaDelMes}
        maxDatosVisibles={maxEventosVisibles}
        renderDato={renderDato}
        onClick={onClickFecha}
        estaSeleccionada={estaSeleccionada}
        esSeleccionable={esSeleccionable}
      />
    );
  };

  if (modoCalendario === 'anio' || modoAnio) {
    return (
      <div 
        ref={anioGridRef} 
        className="anio-grid" 
        onScroll={handleScroll}
        tabIndex={0}
        style={{ outline: 'none' }}
      >
        {Array.from({ length: 12 }).map((_, i) => {
          const mesFecha = new Date(fechaActual.getFullYear(), i, 1);
          return (
            <div key={mesFecha.getFullYear() + '-' + i} className="mes-anio">
              <h3 className="calendario-mes">{formatearMesFn(mesFecha)}</h3>
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

  // Modo semana
  if (modoCalendario === 'semana') {
    const semanaActual = getSemanaActual(fechaActual, inicioSemana);
    
    return (
      <div className="calendario-grid calendario-grid-semana">
        <div className="calendario-dias-semana">
          {diasSemana.map(dia => (
            <div key={dia} className="dia-semana">{dia}</div>
          ))}
        </div>
        <div className="calendario-semanas calendario-semanas-semana">
          <div className="calendario-semana calendario-semana-modo-semana">
            {semanaActual.map((dia) => {
              const key = dia.toISOString();
              return renderDia
                ? <React.Fragment key={key}>{renderDia({
                    fecha: dia,
                    datos: getDatosPorFechaFn(datos, dia),
                    esMesActual: esMesActualFn(dia, fechaActual),
                    esHoy: esHoyFn(dia)
                  })}</React.Fragment>
                : <React.Fragment key={key}>{renderDiaPorDefecto(dia, fechaActual)}</React.Fragment>;
            })}
          </div>
        </div>
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
