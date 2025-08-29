import { useCallback, useEffect, useRef } from 'react';

export interface ConfigTeclado {
  habilitado?: boolean;
  atajos?: {
    hoy?: string;
    modoMes?: string;
    modoAño?: string;
    [key: string]: string | undefined;
  };
  onAccion?: (accion: string, contexto: { fechaActual: Date; modoAnio: boolean }) => void;
}

const defaultConfig: Required<Omit<ConfigTeclado, 'onAccion'>> & Pick<ConfigTeclado, 'onAccion'> = {
  habilitado: true,
  atajos: {
    hoy: 'h',
    modoMes: 'm',
    modoAño: 'a'
  },
  onAccion: undefined
};

interface UseNavegacionTecladoProps {
  config?: ConfigTeclado;
  modoAnio: boolean;
  fechaActual: Date;
  navegarTiempo: (direccion: number) => void;
  setModoAnio: (modo: boolean) => void;
  irAHoy: () => void;
  esMovil: boolean;
  anioGridRef?: React.RefObject<HTMLDivElement | null>;
}

export function useNavegacionTeclado({
  config,
  modoAnio,
  fechaActual,
  navegarTiempo,
  setModoAnio,
  irAHoy,
  esMovil,
  anioGridRef
}: UseNavegacionTecladoProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Configuración final combinando defaults con config del usuario
  const configTeclado = {
    ...defaultConfig,
    ...config,
    atajos: { ...defaultConfig.atajos, ...config?.atajos }
  };

  const manejarTecla = useCallback((event: KeyboardEvent) => {
    // Solo procesar si el teclado está habilitado y no estamos en móvil
    if (!configTeclado.habilitado || esMovil) {
      return;
    }

    // No procesar si hay inputs con foco
    const elementoActivo = document.activeElement;
    if (elementoActivo && (
      elementoActivo.tagName === 'INPUT' ||
      elementoActivo.tagName === 'TEXTAREA' ||
      (elementoActivo as HTMLElement).contentEditable === 'true'
    )) {
      return;
    }

    const tecla = event.key.toLowerCase();

    // Atajos básicos del calendario
    if (tecla === configTeclado.atajos.hoy) {
      event.preventDefault();
      irAHoy();
      return;
    }

    if (tecla === configTeclado.atajos.modoMes && modoAnio) {
      event.preventDefault();
      setModoAnio(false);
      return;
    }

    if (tecla === configTeclado.atajos.modoAño && !modoAnio) {
      event.preventDefault();
      setModoAnio(true);
      return;
    }

    // Navegación con flechas según el modo
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      if (modoAnio) {
        // En modo año: cambiar 1 año
        navegarTiempo(-1);
      } else {
        // En modo mes: cambiar 1 mes
        navegarTiempo(-1);
      }
      return;
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      if (modoAnio) {
        // En modo año: cambiar 1 año
        navegarTiempo(1);
      } else {
        // En modo mes: cambiar 1 mes
        navegarTiempo(1);
      }
      return;
    }

    // Para flechas verticales: comportamiento especial según el modo
    if (event.key === 'ArrowUp' && !modoAnio) {
      // Solo procesar en modo mes
      const container = containerRef.current;

      if (container && container.scrollTop === 0) {
        // Si estamos arriba del todo, cambiar año (12 meses)
        event.preventDefault();
        navegarTiempo(-12);
        return;
      }
      // Si no estamos arriba, dar foco y permitir scroll natural
      if (container) {
        container.focus();
      }
      return;
    }

    if (event.key === 'ArrowDown' && !modoAnio) {
      // Solo procesar en modo mes
      const container = containerRef.current;

      if (container && container.scrollTop >= container.scrollHeight - container.clientHeight) {
        // Si estamos abajo del todo, cambiar año (12 meses)
        event.preventDefault();
        navegarTiempo(12);
        return;
      }
      // Si no estamos abajo, dar foco y permitir scroll natural
      if (container) {
        container.focus();
      }
      return;
    }

    if (event.key === 'ArrowUp' && modoAnio) {
      // En modo año: dar foco al grid de años para que funcione el scroll
      if (anioGridRef?.current) {
        anioGridRef.current.focus();
      }
    }

    if (event.key === 'ArrowDown' && modoAnio) {
      // En modo año: dar foco al grid de años para que funcione el scroll
      if (anioGridRef?.current) {
        anioGridRef.current.focus();
      }
    }

    // Atajos personalizados adicionales
    if (config?.atajos) {
      for (const [accion, teclaAtajo] of Object.entries(config.atajos)) {
        if (teclaAtajo && tecla === teclaAtajo.toLowerCase() &&
          !['hoy', 'modoMes', 'modoAño'].includes(accion)) {
          event.preventDefault();
          config.onAccion?.(accion, { fechaActual, modoAnio });
          return;
        }
      }
    }
  }, [
    configTeclado,
    esMovil,
    modoAnio,
    fechaActual,
    navegarTiempo,
    setModoAnio,
    irAHoy,
    config
  ]);

  useEffect(() => {
    if (!configTeclado.habilitado || esMovil) return;

    document.addEventListener('keydown', manejarTecla);
    return () => {
      document.removeEventListener('keydown', manejarTecla);
    };
  }, [manejarTecla, configTeclado.habilitado, esMovil]);

  return {
    containerRef,
    configTeclado
  };
}
