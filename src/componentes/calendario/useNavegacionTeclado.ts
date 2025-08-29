import { useCallback, useEffect, useRef } from 'react';
import { ModoCalendario } from './tipos';

export interface ConfigTeclado {
  habilitado?: boolean;
  atajos?: {
    hoy?: string;
    modoMes?: string;
    modoSemana?: string;
    modoAño?: string;
    [key: string]: string | undefined;
  };
  onAccion?: (accion: string, contexto: { fechaActual: Date; modoVista: ModoCalendario }) => void;
}

const defaultConfig: Required<Omit<ConfigTeclado, 'onAccion'>> & Pick<ConfigTeclado, 'onAccion'> = {
  habilitado: true,
  atajos: {
    hoy: 'h',
    modoMes: 'm',
    modoSemana: 's',
    modoAño: 'a'
  },
  onAccion: undefined
};

interface UseNavegacionTecladoProps {
  config?: ConfigTeclado;
  modoVista: ModoCalendario;
  fechaActual: Date;
  navegarTiempo: (direccion: number) => void;
  setModoVista: (modo: ModoCalendario) => void;
  irAHoy: () => void;
  esMovil: boolean;
  anioGridRef?: React.RefObject<HTMLDivElement | null>;
  mostrarCambioModo?: boolean;
  mostrarBotonHoy?: boolean;
}

export function useNavegacionTeclado({
  config,
  modoVista,
  fechaActual,
  navegarTiempo,
  setModoVista,
  irAHoy,
  esMovil,
  anioGridRef,
  mostrarCambioModo = true,
  mostrarBotonHoy = true
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
    if (tecla === configTeclado.atajos.hoy && mostrarBotonHoy) {
      event.preventDefault();
      irAHoy();
      return;
    }

    // Atajos para cambio de modo (condicionados a mostrarCambioModo)
    if (mostrarCambioModo) {
      if (tecla === configTeclado.atajos.modoMes) {
        event.preventDefault();
        setModoVista('mes');
        return;
      }

      if (tecla === configTeclado.atajos.modoSemana) {
        event.preventDefault();
        setModoVista('semana');
        return;
      }

      if (tecla === configTeclado.atajos.modoAño) {
        event.preventDefault();
        setModoVista('anio');
        return;
      }
    }

    // Navegación con flechas según el modo
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      if (modoVista === 'anio') {
        // En modo año: cambiar 1 año
        navegarTiempo(-1);
      } else if (modoVista === 'semana') {
        // En modo semana: cambiar 1 semana (7 días)
        navegarTiempo(-7);
      } else {
        // En modo mes: cambiar 1 mes
        navegarTiempo(-1);
      }
      return;
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      if (modoVista === 'anio') {
        // En modo año: cambiar 1 año
        navegarTiempo(1);
      } else if (modoVista === 'semana') {
        // En modo semana: cambiar 1 semana (7 días)
        navegarTiempo(7);
      } else {
        // En modo mes: cambiar 1 mes
        navegarTiempo(1);
      }
      return;
    }

    // Para flechas verticales: comportamiento especial según el modo
    if (event.key === 'ArrowUp' && modoVista === 'mes') {
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

    if (event.key === 'ArrowDown' && modoVista === 'mes') {
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

    if (event.key === 'ArrowUp' && modoVista === 'anio') {
      // En modo año: dar foco al grid de años para que funcione el scroll
      if (anioGridRef?.current) {
        anioGridRef.current.focus();
      }
    }

    if (event.key === 'ArrowDown' && modoVista === 'anio') {
      // En modo año: dar foco al grid de años para que funcione el scroll
      if (anioGridRef?.current) {
        anioGridRef.current.focus();
      }
    }

    // Atajos personalizados adicionales
    if (config?.atajos) {
      for (const [accion, teclaAtajo] of Object.entries(config.atajos)) {
        if (teclaAtajo && tecla === teclaAtajo.toLowerCase() &&
          !['hoy', 'modoMes', 'modoSemana', 'modoAño'].includes(accion)) {
          event.preventDefault();
          config.onAccion?.(accion, { fechaActual, modoVista });
          return;
        }
      }
    }
  }, [
    configTeclado,
    esMovil,
    modoVista,
    fechaActual,
    navegarTiempo,
    setModoVista,
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
