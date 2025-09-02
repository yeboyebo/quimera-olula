import React from 'react';
import { DatoBase } from './tipos';

interface DiaCalendarioProps<T extends DatoBase> {
  fecha: Date;
  mesReferencia: Date;
  datos: T[];
  esHoy: boolean;
  esMesActual: boolean;
  maxDatosVisibles: number;
  renderDato?: (dato: T) => React.ReactNode;
  // Props para selección
  onClick?: (fecha: Date) => void;
  estaSeleccionada?: boolean;
  esSeleccionable?: boolean;
}

export function DiaCalendario<T extends DatoBase>({
  fecha,
  mesReferencia: _mesReferencia,
  datos,
  esHoy,
  esMesActual,
  maxDatosVisibles,
  renderDato,
  onClick,
  estaSeleccionada,
  esSeleccionable = true,
}: DiaCalendarioProps<T>) {
  const manejarClick = () => {
    if (onClick && esSeleccionable) {
      onClick(fecha);
    }
  };

  const clasesDia = [
    'calendario-dia',
    !esMesActual ? 'otro-mes' : '',
    esHoy ? 'hoy' : '',
    estaSeleccionada ? 'seleccionada' : '',
    onClick && esSeleccionable ? 'seleccionable' : '',
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={clasesDia}
      onClick={manejarClick}
      style={{ cursor: onClick && esSeleccionable ? 'pointer' : 'default' }}
    >
      <div className="dia-numero">{fecha.getDate()}</div>
      <div className="eventos-container">
        {esMesActual && datos.slice(0, maxDatosVisibles).map((dato) => (
          renderDato
            ? renderDato(dato)
            : <div key={dato.id} className="dato-item">{dato.descripcion}</div>
        ))}
      </div>
    </div>
  );
}
