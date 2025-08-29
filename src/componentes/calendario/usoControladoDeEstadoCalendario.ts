import { useCallback, useEffect, useRef, useState } from 'react';
import { CalendarioConfig, DatoBase, ModoCalendario } from './tipos';

interface UseControlledCalendarStateProps<T extends DatoBase> {
  config: Partial<CalendarioConfig<T>>;
  onNecesitaDatosAnteriores?: () => Promise<void>;
  onNecesitaDatosPosteriores?: () => Promise<void>;
}

export function usoControladoDeEstadoCalendario<T extends DatoBase>({
  config,
  onNecesitaDatosAnteriores,
  onNecesitaDatosPosteriores
}: UseControlledCalendarStateProps<T>) {
  // Control de fecha y modo: si no se pasa desde fuera, lo gestiona el propio componente
  const controlado = typeof config.fechaActual !== 'undefined' && typeof config.onFechaActualChange === 'function';
  const [fechaNoControlada, setFechaNoControlada] = useState(() => config.fechaActual ?? new Date());
  const fechaActual = controlado ? config.fechaActual! : fechaNoControlada;
  // Setters separados para evitar ambigüedad de tipos
  const setFechaActualControlado = config.onFechaActualChange;
  const setFechaActualNoControlado = setFechaNoControlada;
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
    if (config.cabecera?.modoCalendario) {
      setModoVista(config.cabecera.modoCalendario);
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

      // Detectar carga infinita en todos los modos, no solo año
      const container = anioGridRef.current;
      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight;
      const clientHeight = container.clientHeight;

      // Detectar si estamos en el 25% superior o inferior del scroll
      const scrollRatio = scrollTop / (scrollHeight - clientHeight);

      // Si estamos en el último 25% del scroll (scroll hacia abajo)
      if (scrollRatio > 0.75) {
        onNecesitaDatosPosteriores?.();
      }

      // Si estamos en el primer 25% del scroll (scroll hacia arriba)
      if (scrollRatio < 0.25) {
        onNecesitaDatosAnteriores?.();
      }
    }
  }, [modoVista, onNecesitaDatosAnteriores, onNecesitaDatosPosteriores]);

  return {
    controlado,
    fechaActual,
    setFechaActualControlado,
    setFechaActualNoControlado,
    modoVista,
    setModoVista,
    anioGridRef,
    scrollPosition,
    setScrollPosition,
    scrollToMes,
    handleScroll,
  };
}
