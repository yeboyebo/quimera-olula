// --- Hooks y helpers para experiencia móvil ---
import React from 'react';
import { QIcono } from '../atomos/qicono.tsx';
import { CabeceraGrid } from './CabeceraGrid';
import './calendario.css';
import { CalendarioGrid } from './CalendarioGrid';
import { esHoy, esMesActual, formatearMes, formatearMesAño, getDatosPorFecha, getDiasSemana } from './helpers';
import { isMobile, useSwipe } from './hooks';
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
    cabecera = {},
    maxDatosVisibles = modoAnio ? 2 : 3,
    inicioSemana = 'lunes',
    getDatosPorFecha: getDatosPorFechaConfig,
  } = config;
  const {
    botonesIzqModo = [],
    botonesDerModo = [],
    botonesIzqHoy = [],
    botonesDerHoy = [],
    mostrarCambioModo = true,
    mostrarControlesNavegacion = true,
    mostrarBotonHoy = true,
  } = cabecera;

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

  // Cabecera: ahora es un componente externo

  return (
    <div className="calendario-container" ref={esMovil ? calendarioRef : undefined}>
      <CabeceraGrid
        esMovil={esMovil}
        modoAnio={modoAnio}
        setModoAnio={setModoAnio}
        formatearMesAño={formatearMesAño}
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
      <CalendarioGrid
        modoAnio={modoAnio}
        fechaActual={fechaActual}
        anioGridRef={anioGridRef}
        handleScroll={handleScroll}
        diasSemana={diasSemana}
        inicioSemana={inicioSemana}
        getDatosPorFechaFn={getDatosPorFechaFn}
        esHoyFn={esHoyFn}
        esMesActualFn={esMesActualFn}
        formatearMesFn={formatearMesFn}
        formatearMesAñoFn={formatearMesAñoFn}
        datos={datos}
        renderDia={renderDia}
        renderDato={renderDato}
        maxDatosVisibles={maxDatosVisibles}
      />
      {cargando && (
        <div className="calendario-cargando">
          <QIcono nombre="cargando" />
          Cargando datos...
        </div>
      )}
    </div>
  );
}