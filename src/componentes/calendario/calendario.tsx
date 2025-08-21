// --- Hooks y helpers para experiencia móvil ---
import React from 'react';
import { QIcono } from '../atomos/qicono.tsx';
import { CabeceraCalendario } from './CabeceraCalendario';
import './calendario.css';
import { DiaCalendario } from './DiaCalendario';
import { esHoy, esMesActual, formatearMes, formatearMesAño, getDatosPorFecha, getDiasSemana, getSemanasDelMes } from './helpers';
import { isMobile, useSwipe } from './hooks';
import { MenuAccionesMovil } from './MenuAccionesMovil';
import { CalendarioConfig, DatoBase } from './tipos';
import { usoControladoDeEstadoCalendario } from './usoControladoDeEstadoCalendario.ts';



interface CalendarioProps<T extends DatoBase> {
  datos: T[];
  cargando?: boolean;
  /**
   * Configuración avanzada del calendario. Solo se permite personalizar getDatosPorFecha.
   * El resto de helpers (esHoy, esMesActual, formatearMes, formatearMesAño) son internos y no se pueden personalizar.
   * inicioSemana solo acepta 'lunes' o 'domingo'.
   */
  config?: {
    cabecera?: CalendarioConfig<T>["cabecera"];
    maxDatosVisibles?: number;
    inicioSemana?: 'lunes' | 'domingo';
    getDatosPorFecha?: (datos: T[], fecha: Date) => T[];
  };
  renderDia?: (args: {
    fecha: Date;
    datos: T[];
    esMesActual: boolean;
    esHoy: boolean;
  }) => React.ReactNode;
  renderDato?: (dato: T) => React.ReactNode;
}

export function Calendario<T extends DatoBase>({
  datos = [],
  cargando = false,
  config = {},
  renderDia,
  renderDato,
}: CalendarioProps<T>) {
  // --- Experiencia móvil integrada ---
  const esMovil = isMobile(640);
  const {
    controlado,
    fechaActual,
    setFechaActualControlado,
    setFechaActualNoControlado,
    modoAnio,
    setModoAnio,
    anioGridRef,
    scrollPosition,
    scrollToMes,
    handleScroll,
  } = usoControladoDeEstadoCalendario({ config });

  // Swipe: el hook se llama siempre, pero solo se usa el ref si esMovil
  const setFechaActualAntSig = (dir: number) => {
    if (controlado && setFechaActualControlado) {
      const nueva = new Date(fechaActual);
      if (modoAnio) {
        nueva.setFullYear(nueva.getFullYear() + dir);
      } else {
        nueva.setMonth(nueva.getMonth() + dir);
      }
      setFechaActualControlado(nueva);
    } else {
      setFechaActualNoControlado((prev: Date) => {
        const nueva = new Date(prev);
        if (modoAnio) {
          nueva.setFullYear(nueva.getFullYear() + dir);
        } else {
          nueva.setMonth(nueva.getMonth() + dir);
        }
        return nueva;
      });
    }
  };
  const swipeRef = useSwipe(
    () => setFechaActualAntSig(1),
    () => setFechaActualAntSig(-1)
  );
  const calendarioRef = swipeRef;

  const {
    cabecera: {
      botonesIzqModo = [],
      botonesDerModo = [],
      botonesIzqHoy = [],
      botonesDerHoy = [],
      mostrarCambioModo = true,
      mostrarControlesNavegacion = true,
      mostrarBotonHoy = true,
    } = {},
    maxDatosVisibles = modoAnio ? 2 : 3,
    inicioSemana = 'lunes',
    getDatosPorFecha: getDatosPorFechaConfig,
  } = config;

  // Solo getDatosPorFecha es personalizable, el resto de helpers son internos
  const getDatosPorFechaFn = getDatosPorFechaConfig || getDatosPorFecha;
  const esHoyFn = esHoy;
  const esMesActualFn = esMesActual;
  const formatearMesFn = formatearMes;
  const formatearMesAñoFn = formatearMesAño;
  const diasSemana = getDiasSemana(inicioSemana);

  // ...el resto de la lógica permanece igual, usando los valores del hook extraído...

  const navegarTiempo = (direccion: number) => {
    const nuevaFecha = new Date(fechaActual);
    if (modoAnio) {
      nuevaFecha.setFullYear(nuevaFecha.getFullYear() + direccion);
    } else {
      nuevaFecha.setMonth(nuevaFecha.getMonth() + direccion);
    }
    if (controlado && setFechaActualControlado) {
      setFechaActualControlado(nuevaFecha);
    } else {
      setFechaActualNoControlado(nuevaFecha);
    }

    // Mantener posición de scroll relativa en modo año
    if (modoAnio && anioGridRef.current) {
      setTimeout(() => {
        if (anioGridRef.current) {
          anioGridRef.current.scrollTop = scrollPosition;
        }
      }, 0);
    }
  };

  const irAHoy = () => {
    const hoy = new Date();
    if (controlado && setFechaActualControlado) {
      setFechaActualControlado(hoy);
    } else {
      setFechaActualNoControlado(hoy);
    }

    // Solo hace scroll en modo año si no está visible el mes actual
    if (modoAnio && anioGridRef.current) {
      const mesActual = hoy.getMonth();
      const meses = anioGridRef.current.querySelectorAll('.mes-anio');
      
      // Verifica si el mes actual ya está visible
      const mesVisible = Array.from(meses).some(mes => {
        const rect = mes.getBoundingClientRect();
        return rect.top >= 0 && rect.bottom <= window.innerHeight;
      });

      if (!mesVisible) {
        scrollToMes(mesActual); // 👈 Scroll solo si es necesario
      }
    }
  };

  // Cabecera: menú móvil o cabecera tradicional
  const renderCabecera = () => {
    if (esMovil) {
      return (
        <div className="calendario-cabecera">
          <MenuAccionesMovil
            modoAnio={modoAnio}
            onCambioModo={() => setModoAnio(m => !m)}
            botonesIzqModo={botonesIzqModo}
            botonesDerModo={botonesDerModo}
            botonesIzqHoy={botonesIzqHoy}
            botonesDerHoy={botonesDerHoy}
            mostrarCambioModo={mostrarCambioModo}
          />
          <div className="calendario-navegacion-movil">
            <h2 className="calendario-navegacion-mes-anio">{modoAnio ? fechaActual.getFullYear() : formatearMesAñoFn(fechaActual)}</h2>
            {mostrarBotonHoy &&
              <button className="boton-hoy-movil" type="button" onClick={irAHoy}>
                <div
                  className="icono-calendario-con-fecha"
                  data-dia={new Date().getDate()}
                >
                  <QIcono nombre={"calendario_vacio"} tamaño={"md"} color={"black"} />
                </div>
              </button>
            }
          </div>
        </div>
      );
    }
    return (
      <CabeceraCalendario
        modoAnio={modoAnio}
        setModoAnio={setModoAnio}
        formatearMesAño={formatearMesAñoFn}
        fechaActual={fechaActual}
        navegarTiempo={navegarTiempo}
        mostrarCambioModo={mostrarCambioModo}
        mostrarControlesNavegacion={mostrarControlesNavegacion}
        mostrarBotonHoy={mostrarBotonHoy}
        irAHoy={irAHoy}
        botones={{
          izqModo: botonesIzqModo,
          derModo: botonesDerModo,
          izqHoy: botonesIzqHoy,
          derHoy: botonesDerHoy,
        }}
      />
    );
  };

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

  return (
    <div className="calendario-container" ref={esMovil ? calendarioRef : undefined}>
      {renderCabecera()}

      {modoAnio ? (
        <div ref={anioGridRef} className="anio-grid" onScroll={handleScroll}>
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
      ) : (
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
      )}

      {cargando && (
        <div className="calendario-cargando">
          <QIcono nombre="cargando" />
          Cargando datos...
        </div>
      )}
    </div>
  );
}