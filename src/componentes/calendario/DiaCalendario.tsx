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
}

export function DiaCalendario<T extends DatoBase>({
  fecha,
  mesReferencia: _mesReferencia,
  datos,
  esHoy,
  esMesActual,
  maxDatosVisibles,
  renderDato
}: DiaCalendarioProps<T>) {
  return (
    <div className={`calendario-dia ${!esMesActual ? 'otro-mes' : ''} ${esHoy ? 'hoy' : ''}`}>
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
