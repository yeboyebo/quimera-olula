import React from 'react';
import { QIcono } from '../atomos/qicono.tsx';
import { CabeceraCalendario } from './CabeceraCalendario';
import { MenuAccionesMovil } from './MenuAccionesMovil';
import { ModoCalendario } from './tipos';

interface CabeceraBotones {
  izqModo?: React.ReactNode[];
  derModo?: React.ReactNode[];
  izqHoy?: React.ReactNode[];
  derHoy?: React.ReactNode[];
}

interface CabeceraGridProps {
  esMovil: boolean;
  modoAnio: boolean;
  modoVista?: ModoCalendario;
  modos?: ModoCalendario[];
  setModoAnio: (v: boolean | ((m: boolean) => boolean)) => void;
  setModoVista?: (modo: ModoCalendario) => void;
  formatearMesAño: (fecha: Date) => string;
  fechaActual: Date;
  navegarTiempo: (dir: number) => void;
  mostrarCambioModo: boolean;
  mostrarControlesNavegacion: boolean;
  mostrarBotonHoy: boolean;
  irAHoy: () => void;
  botones?: CabeceraBotones;
}

export const CabeceraGrid: React.FC<CabeceraGridProps> = ({
  esMovil,
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
  botones = {},
}) => {
  const {
    izqModo = [],
    derModo = [],
    izqHoy = [],
    derHoy = [],
  } = botones;
  if (esMovil) {
    return (
      <div className="calendario-cabecera">
        <MenuAccionesMovil
          modoAnio={modoAnio}
          onCambioModo={() => setModoAnio(!modoAnio)}
          onCambioModoVista={setModoVista}
          modos={modos}
          botonesIzqModo={izqModo}
          botonesDerModo={derModo}
          botonesIzqHoy={izqHoy}
          botonesDerHoy={derHoy}
          mostrarCambioModo={mostrarCambioModo}
        />
        <div className="calendario-navegacion-movil">
          <h2 className="calendario-navegacion-mes-anio">{modoAnio ? fechaActual.getFullYear() : formatearMesAño(fechaActual)}</h2>
          {mostrarBotonHoy && (
            <button className="boton-hoy-movil" type="button" onClick={irAHoy}>
              <div
                className="icono-calendario-con-fecha"
                data-dia={new Date().getDate()}
              >
                <QIcono nombre={"calendario_vacio"} tamaño={"md"} color={"black"} />
              </div>
            </button>
          )}
        </div>
      </div>
    );
  }
  return (
    <CabeceraCalendario
      modoAnio={modoAnio}
      setModoAnio={setModoAnio}
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
      botones={{
        izqModo,
        derModo,
        izqHoy,
        derHoy,
      }}
    />
  );
};
