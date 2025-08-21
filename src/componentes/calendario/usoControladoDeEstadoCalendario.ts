import { useCallback, useEffect, useRef, useState } from 'react';
import { CalendarioConfig, DatoBase } from './tipos';

interface UseControlledCalendarStateProps<T extends DatoBase> {
  config: Partial<CalendarioConfig<T>>;
}

export function usoControladoDeEstadoCalendario<T extends DatoBase>({ config }: UseControlledCalendarStateProps<T>) {
  // Control de fecha y modo: si no se pasa desde fuera, lo gestiona el propio componente
  const controlado = typeof config.fechaActual !== 'undefined' && typeof config.onFechaActualChange === 'function';
  const [fechaNoControlada, setFechaNoControlada] = useState(() => config.fechaActual ?? new Date());
  const fechaActual = controlado ? config.fechaActual! : fechaNoControlada;
  // Setters separados para evitar ambigüedad de tipos
  const setFechaActualControlado = config.onFechaActualChange;
  const setFechaActualNoControlado = setFechaNoControlada;
  const modoInicial = config.cabecera?.modoCalendario === 'anio';
  const [modoAnio, setModoAnio] = useState(modoInicial);

  // Scroll y refs para modo año
  const anioGridRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  // Scroll al mes actual al cambiar a modo año
  useEffect(() => {
    if (modoAnio && anioGridRef.current) {
      const hoy = new Date();
      scrollToMes(hoy.getMonth());
    }
  }, [modoAnio]);

  useEffect(() => {
    // Sincronizar el estado interno si cambia la prop modoCalendario
    if (config.cabecera?.modoCalendario) {
      setModoAnio(config.cabecera.modoCalendario === 'anio');
    }
  }, [config.cabecera?.modoCalendario]);

  const scrollToMes = (mesIndex: number) => {
    const grid = anioGridRef.current;
    if (!grid) return;

    const meses = grid.querySelectorAll('.mes-anio');
    if (meses.length === 0 || mesIndex < 0 || mesIndex >= meses.length) return;

    let posicion = 0;
    for (let i = 0; i < mesIndex; i++) {
      posicion += meses[i].clientHeight + 32; // 32px = gap entre meses
    }

    grid.scrollTo({
      top: posicion,
      behavior: 'smooth',
    });
  };

  const handleScroll = useCallback(() => {
    if (anioGridRef.current) {
      setScrollPosition(anioGridRef.current.scrollTop);
    }
  }, []);

  return {
    controlado,
    fechaActual,
    setFechaActualControlado,
    setFechaActualNoControlado,
    modoAnio,
    setModoAnio,
    anioGridRef,
    scrollPosition,
    setScrollPosition,
    scrollToMes,
    handleScroll,
  };
}
