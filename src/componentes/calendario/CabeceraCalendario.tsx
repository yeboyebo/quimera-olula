import React from 'react';
import { QBoton } from '../atomos/qboton.tsx';
import { QIcono } from '../atomos/qicono.tsx';

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
  botonesIzqModo?: React.ReactNode[];
  botonesDerModo?: React.ReactNode[];
  botonesIzqHoy?: React.ReactNode[];
  botonesDerHoy?: React.ReactNode[];
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
  botonesIzqModo = [],
  botonesDerModo = [],
  botonesIzqHoy = [],
  botonesDerHoy = [],
}: CabeceraCalendarioProps) {
  return (
    <div className="calendario-cabecera">
      {(botonesIzqModo.length > 0 || mostrarCambioModo || botonesDerModo.length > 0) && (
        <div className="cabecera-izquierda">
          {botonesIzqModo}
          {mostrarCambioModo && (
            <QBoton onClick={() => setModoAnio(!modoAnio)}>
              {modoAnio ? 'Modo Mes' : 'Modo Año'}
            </QBoton>
          )}
          {botonesDerModo}
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
      {(botonesIzqHoy.length > 0 || mostrarBotonHoy || botonesDerHoy.length > 0) && (
        <div className="cabecera-derecha">
          {botonesIzqHoy}
          {mostrarBotonHoy && <QBoton onClick={irAHoy}>Hoy</QBoton>}
          {botonesDerHoy}
        </div>
      )}
    </div>
  );
}
