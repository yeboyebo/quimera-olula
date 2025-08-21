import React from 'react';
import { QIcono } from '../atomos/qicono.tsx';
import { CabeceraCalendario } from './CabeceraCalendario';
import { MenuAccionesMovil } from './MenuAccionesMovil';

interface CabeceraGridProps {
  esMovil: boolean;
  modoAnio: boolean;
  setModoAnio: (v: boolean | ((m: boolean) => boolean)) => void;
  formatearMesAño: (fecha: Date) => string;
  fechaActual: Date;
  navegarTiempo: (dir: number) => void;
  mostrarCambioModo: boolean;
  mostrarControlesNavegacion: boolean;
  mostrarBotonHoy: boolean;
  irAHoy: () => void;
  botonesIzqModo: React.ReactNode[];
  botonesDerModo: React.ReactNode[];
  botonesIzqHoy: React.ReactNode[];
  botonesDerHoy: React.ReactNode[];
}

export const CabeceraGrid: React.FC<CabeceraGridProps> = ({
  esMovil,
  modoAnio,
  setModoAnio,
  formatearMesAño,
  fechaActual,
  navegarTiempo,
  mostrarCambioModo,
  mostrarControlesNavegacion,
  mostrarBotonHoy,
  irAHoy,
  botonesIzqModo,
  botonesDerModo,
  botonesIzqHoy,
  botonesDerHoy,
}) => {
  if (esMovil) {
    return (
      <div className="calendario-cabecera">
        <MenuAccionesMovil
          modoAnio={modoAnio}
          onCambioModo={() => setModoAnio((m: boolean) => !m)}
          botonesIzqModo={botonesIzqModo}
          botonesDerModo={botonesDerModo}
          botonesIzqHoy={botonesIzqHoy}
          botonesDerHoy={botonesDerHoy}
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
      formatearMesAño={formatearMesAño}
      fechaActual={fechaActual}
      navegarTiempo={navegarTiempo}
      mostrarCambioModo={mostrarCambioModo}
      mostrarControlesNavegacion={mostrarControlesNavegacion}
      mostrarBotonHoy={mostrarBotonHoy}
      irAHoy={irAHoy}
      botones={{
        izqModo: botonesIzqModo,
        derModo: botonesDerModo,
        izqHoy: botonesIzqHoy,
        derHoy: botonesDerHoy,
      }}
    />
  );
};
