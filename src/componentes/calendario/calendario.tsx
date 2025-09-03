// --- Hooks y helpers para experiencia móvil ---
import React, { useEffect, useState } from 'react';
import { QIcono } from '../atomos/qicono.tsx';
import { CabeceraGrid } from './CabeceraGrid';
import './calendario.css';
import { CalendarioGrid } from './CalendarioGrid';
import { CalendarioPlayground } from './CalendarioPlayground';
import { esHoy, esMesActual, formatearMes, formatearMesAño, getDatosPorFecha, getDiasSemana } from './helpers';
import { isMobile, useSwipe } from './hooks';
import { CalendarioConfig, DatoBase } from './tipos';
import { ConfigTeclado, useNavegacionTeclado } from './useNavegacionTeclado';
import { useSeleccionFechas } from './useSeleccionFechas';
import { usoControladoDeEstadoCalendario } from './usoControladoDeEstadoCalendario.ts';



export interface CalendarioProps<T extends DatoBase> {
  calendarioId?: string;
  datos: T[];
  cargando?: boolean;
  /** Mostrar botón de Playground para explorar funcionalidades */
  playground?: boolean;
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
    onNecesitaDatosAnteriores?: (fechaActual: Date) => Promise<void>;
    onNecesitaDatosPosteriores?: (fechaActual: Date) => Promise<void>;
    /** Configuración para selección de fechas */
    seleccion?: import('./tipos').ConfiguracionSeleccion;
  };
  renderDia?: (args: {
    fecha: Date;
    datos: T[];
    esMesActual: boolean;
    esHoy: boolean;
    /** Estados de selección para styling personalizado */
    estaSeleccionada?: boolean;
    esSeleccionable?: boolean;
  }) => React.ReactNode;
  renderDato?: (dato: T) => React.ReactNode;
  /** Callback cuando cambia la selección de fechas */
  onSeleccionCambio?: (seleccion: import('./tipos').EstadoSeleccion) => void;
}

export function Calendario<T extends DatoBase>({
  calendarioId,
  datos = [],
  cargando = false,
  playground = false,
  config = {},
  renderDia,
  renderDato,
  onSeleccionCambio,
}: CalendarioProps<T>) {
  // --- Experiencia móvil integrada ---
  const esMovil = isMobile(640);

  // Estado del playground
  const [mostrarPlayground, setMostrarPlayground] = useState(false);

  // Extraer configuración primero
  const {
    cabecera = {},
    maxDatosVisibles = 3, // Será ajustado por modo después
    inicioSemana = 'lunes',
    getDatosPorFecha: getDatosPorFechaConfig,
    onNecesitaDatosAnteriores,
    onNecesitaDatosPosteriores,
    seleccion: configuracionSeleccion
  } = config;

  // Hook para selección de fechas (opcional)
  const seleccionFechas = useSeleccionFechas(configuracionSeleccion);

  // Notificar cambios de selección
  useEffect(() => {
    if (configuracionSeleccion && onSeleccionCambio) {
      onSeleccionCambio(seleccionFechas.seleccion);
    }
  }, [seleccionFechas.seleccion, onSeleccionCambio, configuracionSeleccion]);

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
    navegarTiempo, // ✅ Usar la función del hook
  } = usoControladoDeEstadoCalendario({ 
    config,
    onNecesitaDatosAnteriores,
    onNecesitaDatosPosteriores
  });

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

  // Ajustar maxDatosVisibles según el modo
  const maxDatosVisiblesAjustado = maxDatosVisibles || (modoVista === 'anio' ? 2 : modoVista === 'semana' ? 1 : 3);

  const {
    botonesIzqModo = [],
    botonesDerModo = [],
    botonesIzqHoy = [],
    botonesDerHoy = [],
    mostrarCambioModo = true,
    modos = ['semana', 'mes', 'anio'], // Todos los modos por defecto
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

  // Estado para forzar scroll tras cambio de año
  const [scrollToMesIndex, setScrollToMesIndex] = useState<number|null>(null);

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
    anioGridRef,
    mostrarCambioModo: config.cabecera?.mostrarCambioModo,
    mostrarBotonHoy: config.cabecera?.mostrarBotonHoy,
    hayPlayground: mostrarPlayground,
    calendarioId
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
        playground={playground}
        onAbrirPlayground={() => setMostrarPlayground(true)}
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
        maxDatosVisibles={maxDatosVisiblesAjustado}
        onClickFecha={configuracionSeleccion ? seleccionFechas.manejarClickFecha : undefined}
        esFechaSeleccionada={configuracionSeleccion ? seleccionFechas.esFechaSeleccionada : undefined}
        esFechaSeleccionable={configuracionSeleccion ? seleccionFechas.esFechaValida : undefined}
      />
      {cargando && (
        <div className="calendario-cargando">
          <QIcono nombre="cargando" />
          Cargando datos...
        </div>
      )}
      
      {/* Modal del Playground */}
      {mostrarPlayground && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }} onClick={() => setMostrarPlayground(false)}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            width: '95vw',
            height: '90vh',
            maxWidth: '1400px',
            overflow: 'auto',
            position: 'relative'
          }} onClick={(e) => e.stopPropagation()}>
            {/* Botón cerrar */}
            <button
              onClick={() => setMostrarPlayground(false)}
              style={{
                position: 'absolute',
                top: '10px',
                right: '15px',
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                zIndex: 10000,
                padding: '5px',
                borderRadius: '50%',
                width: '35px',
                height: '35px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ✕
            </button>
            
            <CalendarioPlayground />
          </div>
        </div>
      )}
    </div>
  );
}