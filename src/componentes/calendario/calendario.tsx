// --- Hooks y helpers para experiencia móvil ---
import React, { useEffect, useState } from 'react';
import { QIcono } from '../atomos/qicono.tsx';
import { CabeceraGrid } from './CabeceraGrid';
import './calendario.css';
import { CalendarioGrid } from './CalendarioGrid';
import { esHoy, esMesActual, formatearMes, formatearMesAño, getDatosPorFecha, getDiasSemana } from './helpers';
import { isMobile, useSwipe } from './hooks';
import { CalendarioConfig, DatoBase } from './tipos';
import { ConfigTeclado, useNavegacionTeclado } from './useNavegacionTeclado';
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
    teclado?: ConfigTeclado;
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
    modoVista,
    setModoVista,
    anioGridRef,
    scrollPosition,
    scrollToMes,
    handleScroll,
  } = usoControladoDeEstadoCalendario({ config });

  // Swipe: el hook se llama siempre, pero solo se usa el ref si esMovil
  const setFechaActualAntSig = (dir: number) => {
    if (controlado && setFechaActualControlado) {
      const nueva = new Date(fechaActual);
      if (modoVista === 'anio') {
        nueva.setFullYear(nueva.getFullYear() + dir);
      } else if (modoVista === 'semana') {
        nueva.setDate(nueva.getDate() + (dir * 7));
      } else {
        nueva.setMonth(nueva.getMonth() + dir);
      }
      setFechaActualControlado(nueva);
    } else {
      setFechaActualNoControlado((prev: Date) => {
        const nueva = new Date(prev);
        if (modoVista === 'anio') {
          nueva.setFullYear(nueva.getFullYear() + dir);
        } else if (modoVista === 'semana') {
          nueva.setDate(nueva.getDate() + (dir * 7));
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
    maxDatosVisibles = modoVista === 'anio' ? 2 : modoVista === 'semana' ? 1 : 3,
    inicioSemana = 'lunes',
    getDatosPorFecha: getDatosPorFechaConfig,
  } = config;
  const {
    botonesIzqModo = [],
    botonesDerModo = [],
    botonesIzqHoy = [],
    botonesDerHoy = [],
    mostrarCambioModo = true,
    modos = ['dia', 'semana', 'mes', 'anio'], // Todos los modos por defecto
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

  // Estado para forzar scroll tras cambio de año
  const [scrollToMesIndex, setScrollToMesIndex] = useState<number|null>(null);

  const navegarTiempo = (direccion: number) => {
    const nueva = new Date(fechaActual);
    if (modoVista === 'anio') {
      nueva.setFullYear(nueva.getFullYear() + direccion);
    } else if (modoVista === 'semana') {
      nueva.setDate(nueva.getDate() + direccion);
    } else {
      // Modo mes y modo día usan meses
      nueva.setMonth(nueva.getMonth() + direccion);
    }
    if (controlado && setFechaActualControlado) {
      setFechaActualControlado(nueva);
    } else {
      setFechaActualNoControlado(nueva);
    }

    // Mantener posición de scroll relativa en modo año
    if (modoVista === 'anio' && anioGridRef.current) {
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
    // En modo año, forzar scroll tras el render
    if (modoVista === 'anio') {
      setScrollToMesIndex(hoy.getMonth());
    }
  };

  // Efecto: cuando scrollToMesIndex cambia, hacer scroll tras el render
  useEffect(() => {
    if (scrollToMesIndex !== null && modoVista === 'anio' && anioGridRef.current) {
      // Esperar al siguiente tick para asegurar render
      setTimeout(() => {
        scrollToMes(scrollToMesIndex);
        setScrollToMesIndex(null);
      }, 0);
    }
  }, [scrollToMesIndex, modoVista, scrollToMes, anioGridRef]);

  // Navegación por teclado
  const { containerRef } = useNavegacionTeclado({
    config: config.teclado,
    modoVista,
    fechaActual,
    navegarTiempo,
    setModoVista,
    irAHoy,
    esMovil,
    anioGridRef
  });

  return (
    <div 
      className="calendario-container" 
      ref={esMovil ? calendarioRef : containerRef}
      tabIndex={0}
      style={{ outline: 'none' }}
    >
      <CabeceraGrid
        esMovil={esMovil}
        modoAnio={modoVista === 'anio'}
        setModoAnio={(valor) => setModoVista(valor ? 'anio' : 'mes')}
        modoVista={modoVista}
        setModoVista={setModoVista}
        modos={modos}
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
        modoAnio={modoVista === 'anio'}
        modoVista={modoVista}
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