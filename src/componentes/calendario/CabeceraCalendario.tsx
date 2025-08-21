import React from 'react';
import { QBoton } from '../atomos/qboton.tsx';
import { QIcono } from '../atomos/qicono.tsx';

interface CabeceraBotones {
  izqModo?: React.ReactNode[];
  derModo?: React.ReactNode[];
  izqHoy?: React.ReactNode[];
  derHoy?: React.ReactNode[];
}

interface CabeceraCalendarioProps {
  modoAnio: boolean;
  setModoAnio: (v: boolean) => void;
  formatearMesAño: (fecha: Date) => string;
  fechaActual: Date;
  navegarTiempo: (dir: number) => void;
  mostrarCambioModo?: boolean;
  mostrarControlesNavegacion?: boolean;
  mostrarBotonHoy?: boolean;
  irAHoy: () => void;
  botones?: CabeceraBotones;
}

export const CabeceraCalendario: React.FC<CabeceraCalendarioProps> = (props: CabeceraCalendarioProps) => {
  const {
    modoAnio,
    setModoAnio,
    formatearMesAño,
    fechaActual,
    navegarTiempo,
    mostrarCambioModo,
    mostrarControlesNavegacion,
    mostrarBotonHoy,
    irAHoy,
    botones,
  } = props;
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
      {(izqModo.length > 0 || _mostrarCambioModo || derModo.length > 0) && (
        <div className="cabecera-izquierda">
          {izqModo}
          {_mostrarCambioModo && (
            <QBoton onClick={() => setModoAnio(!modoAnio)}>
              {modoAnio ? 'Modo Mes' : 'Modo Año'}
            </QBoton>
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
      {(izqHoy.length > 0 || _mostrarBotonHoy || derHoy.length > 0) && (
        <div className="cabecera-derecha">
          {izqHoy}
          {_mostrarBotonHoy && <QBoton onClick={irAHoy}>Hoy</QBoton>}
          {derHoy}
        </div>
      )}
    </div>
  );
}
