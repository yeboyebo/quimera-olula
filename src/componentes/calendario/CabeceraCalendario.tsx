import React, { useEffect, useRef, useState } from 'react';
import { QBoton } from '../atomos/qboton.tsx';
import { QIcono } from '../atomos/qicono.tsx';
import { SelectorModo } from './SelectorModo.tsx';
import { ModoCalendario } from './tipos.ts';

interface CabeceraBotones {
  izqModo?: React.ReactNode[];
  derModo?: React.ReactNode[];
  izqHoy?: React.ReactNode[];
  derHoy?: React.ReactNode[];
}

interface CabeceraCalendarioProps {
  modoAnio: boolean;
  setModoAnio: (v: boolean) => void;
  modoVista?: ModoCalendario;
  setModoVista?: (modo: ModoCalendario) => void;
  modos?: ModoCalendario[];
  formatearMesAño: (fecha: Date) => string;
  fechaActual: Date;
  navegarTiempo: (dir: number) => void;
  mostrarCambioModo?: boolean;
  mostrarControlesNavegacion?: boolean;
  mostrarBotonHoy?: boolean;
  irAHoy: () => void;
  botones?: CabeceraBotones;
  /** Mostrar botón de playground */
  playground?: boolean;
  /** Callback para abrir playground */
  onAbrirPlayground?: () => void;
}

export const CabeceraCalendario: React.FC<CabeceraCalendarioProps> = (props: CabeceraCalendarioProps) => {
  const {
    modoAnio,
    setModoAnio,
    modoVista,
    setModoVista,
    modos,
    formatearMesAño,
    fechaActual,
    navegarTiempo,
    mostrarCambioModo,
    mostrarControlesNavegacion,
    mostrarBotonHoy,
    irAHoy,
    botones,
    playground = false,
    onAbrirPlayground,
  } = props;

  // Estado para el dropdown
  const [dropdownAbierto, setDropdownAbierto] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickFuera = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownAbierto(false);
      }
    };

    if (dropdownAbierto) {
      document.addEventListener('mousedown', handleClickFuera);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickFuera);
    };
  }, [dropdownAbierto]);

  const _mostrarCambioModo = mostrarCambioModo !== undefined ? mostrarCambioModo : true;
  const _mostrarControlesNavegacion = mostrarControlesNavegacion !== undefined ? mostrarControlesNavegacion : true;
  const _mostrarBotonHoy = mostrarBotonHoy !== undefined ? mostrarBotonHoy : true;
  const _botones = botones || {};
  const {
    izqModo = [],
    derModo = [],
    izqHoy = [],
    derHoy = [],
  } = _botones;
  return (
    <div className="calendario-cabecera">
      {(izqModo.length > 0 || derModo.length > 0 || (modoVista && setModoVista && _mostrarCambioModo)) && (
        <div className="cabecera-izquierda">
          {izqModo}
          {modoVista && setModoVista && _mostrarCambioModo && (
            <div className="dropdown-modo" ref={dropdownRef}>
              <QBoton onClick={() => setDropdownAbierto(!dropdownAbierto)}>
                {modoVista === 'semana' ? 'Semana' : modoVista === 'mes' ? 'Mes' : 'Año'}
                <span style={{ marginLeft: '8px' }}>{dropdownAbierto ? '▲' : '▼'}</span>
              </QBoton>
              <div className={`dropdown-modo-contenido ${dropdownAbierto ? 'abierto' : ''}`}>
                <SelectorModo 
                  modoActual={modoVista} 
                  onCambioModo={(nuevoModo) => {
                    setModoVista(nuevoModo);
                    setDropdownAbierto(false);
                  }}
                  variante="vertical"
                  modos={modos}
                />
              </div>
            </div>
          )}
          {derModo}
        </div>
      )}
      <div className="calendario-navegacion">
        {_mostrarControlesNavegacion && (
          <>
            <QBoton onClick={() => navegarTiempo(-1)}>
              <QIcono nombre="atras" />
            </QBoton>
            <h2 className="calendario-navegacion-mes-anio">
              {modoAnio ? fechaActual.getFullYear() : formatearMesAño(fechaActual)}
            </h2>
            <QBoton onClick={() => navegarTiempo(1)}>
              <QIcono nombre="adelante" />
            </QBoton>
          </>
        )}
      </div>
      {(izqHoy.length > 0 || _mostrarBotonHoy || derHoy.length > 0 || playground) && (
        <div className="cabecera-derecha">
          {izqHoy}
          {_mostrarBotonHoy && <QBoton onClick={irAHoy}>Hoy</QBoton>}
          {playground && (
            <QBoton 
              onClick={onAbrirPlayground}
              variante="borde"
            >
              📚 Playground
            </QBoton>
          )}
          {derHoy}
        </div>
      )}
    </div>
  );
}
