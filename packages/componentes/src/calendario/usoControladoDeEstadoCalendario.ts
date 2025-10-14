import { useCallback, useEffect, useRef, useState } from 'react';
import { CalendarioConfig, DatoBase, ModoCalendario } from './tipos';

interface UseControlledCalendarStateProps<T extends DatoBase> {
  // ✅ Usar CalendarioConfig directamente
  config?: CalendarioConfig<T>;
  onNecesitaDatosAnteriores?: (fechaActual: Date) => Promise<void>;
  onNecesitaDatosPosteriores?: (fechaActual: Date) => Promise<void>;
}

export function useControladoDeEstadoCalendario<T extends DatoBase>({
  config = {},
  onNecesitaDatosAnteriores,
  onNecesitaDatosPosteriores,
}: UseControlledCalendarStateProps<T>) {
  // ✅ CORRECCIÓN: Usar las funciones del config primero, luego los parámetros del hook
  const funcionAnteriores = config.onNecesitaDatosAnteriores || onNecesitaDatosAnteriores;
  const funcionPosteriores = config.onNecesitaDatosPosteriores || onNecesitaDatosPosteriores;

  // Control de fecha y modo
  const controlado = typeof config.fechaActual !== 'undefined' && typeof config.onFechaActualChange === 'function';
  const [fechaNoControlada, setFechaNoControlada] = useState(() => config.fechaActual ?? new Date());
  const fechaActual = controlado ? config.fechaActual! : fechaNoControlada;

  // Setters separados para evitar ambigüedad de tipos
  const setFechaActualControlado = config.onFechaActualChange;
  const setFechaActualNoControlado = setFechaNoControlada;

  // Safe access con optional chaining y valor por defecto
  const modoInicial = config.cabecera?.modoCalendario || 'mes';
  const [modoVista, setModoVista] = useState<ModoCalendario>(modoInicial);

  // Scroll y refs para modo año
  const anioGridRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  // Scroll al mes actual al cambiar a modo año
  useEffect(() => {
    if (modoVista === 'anio' && anioGridRef.current) {
      const hoy = new Date();
      scrollToMes(hoy.getMonth());
    }
  }, [modoVista]);

  useEffect(() => {
    // Sincronizar el estado interno si cambia la prop modoCalendario
    if (config?.cabecera?.modoCalendario) {
      setModoVista(config.cabecera.modoCalendario);
    }
  }, [config?.cabecera?.modoCalendario]);

  const scrollToMes = (mesIndex: number) => {
    const grid = anioGridRef.current;
    if (!grid) return;

    const meses = grid.querySelectorAll('.mes-anio');
    if (meses.length === 0 || mesIndex < 0 || mesIndex >= meses.length) return;

    let posicion = 0;
    for (let i = 0; i < mesIndex; i++) {
      posicion += meses[i].clientHeight + 32;
    }

    grid.scrollTo({
      top: posicion,
      behavior: 'smooth',
    });
  };

  const handleScroll = useCallback(() => {
    if (anioGridRef.current) {
      setScrollPosition(anioGridRef.current.scrollTop);

      const container = anioGridRef.current;
      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight;
      const clientHeight = container.clientHeight;

      const scrollRatio = scrollTop / (scrollHeight - clientHeight);

      // ✅ CORRECCIÓN: Usar las funciones unificadas
      if (scrollRatio > 0.75) {
        funcionPosteriores?.(fechaActual);
      }

      if (scrollRatio < 0.25) {
        funcionAnteriores?.(fechaActual);
      }
    }
  }, [funcionAnteriores, funcionPosteriores, fechaActual]);

  const navegarTiempo = useCallback(async (direccion: number) => {
    const nueva = new Date(fechaActual);
    if (modoVista === 'anio') {
      nueva.setFullYear(nueva.getFullYear() + direccion);
    } else if (modoVista === 'semana') {
      nueva.setDate(nueva.getDate() + direccion);
    } else {
      nueva.setMonth(nueva.getMonth() + direccion);
    }

    // ✅ CORRECCIÓN: Usar las funciones unificadas
    if (direccion < 0 && funcionAnteriores) {
      await funcionAnteriores(nueva);
    }

    if (direccion > 0 && funcionPosteriores) {
      await funcionPosteriores(nueva);
    }

    // Actualizar la fecha
    if (controlado && setFechaActualControlado) {
      setFechaActualControlado(nueva);
    } else {
      setFechaActualNoControlado(nueva);
    }
  }, [fechaActual, modoVista, funcionAnteriores, funcionPosteriores, controlado, setFechaActualControlado, setFechaActualNoControlado]);

  return {
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
    navegarTiempo,
  };
}
