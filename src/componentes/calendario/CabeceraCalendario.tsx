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

export function CabeceraCalendario({
  modoAnio,
  setModoAnio,
  formatearMesAño,
  fechaActual,
  navegarTiempo,
  mostrarCambioModo = true,
  mostrarControlesNavegacion = true,
  mostrarBotonHoy = true,
  irAHoy,
  botones = {},
}: CabeceraCalendarioProps) {
  const {
    izqModo = [],
    derModo = [],
    izqHoy = [],
    derHoy = [],
  } = botones;
  return (
    <div className="calendario-cabecera">
      {(izqModo.length > 0 || mostrarCambioModo || derModo.length > 0) && (
        <div className="cabecera-izquierda">
          {izqModo}
          {mostrarCambioModo && (
            <QBoton onClick={() => setModoAnio(!modoAnio)}>
              {modoAnio ? 'Modo Mes' : 'Modo Año'}
            </QBoton>
          )}
          {derModo}
        </div>
      )}
      <div className="calendario-navegacion">
        {mostrarControlesNavegacion && (
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
      {(izqHoy.length > 0 || mostrarBotonHoy || derHoy.length > 0) && (
        <div className="cabecera-derecha">
          {izqHoy}
          {mostrarBotonHoy && <QBoton onClick={irAHoy}>Hoy</QBoton>}
          {derHoy}
        </div>
      )}
    </div>
  );
}
