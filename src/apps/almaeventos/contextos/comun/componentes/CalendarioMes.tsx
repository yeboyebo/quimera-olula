import React from 'react';
import { getDiasDelMes } from '../dominio';

interface Props {
  eventos: [];
}

const CalendarioMes: React.FC<Props> = ({ eventos }) => {
  const fechaActual = new Date();
  const dias = getDiasDelMes(fechaActual);

  return (
    <div className="calendario-mes">
      <h2>{fechaActual.toLocaleString('es-ES', { month: 'long', year: 'numeric' })}</h2>
      <div className="semanas">
        {dias.map((dia, index) => (
          <div key={index} className="semana">
            {dia.getDate()}
            {eventos.filter((evento) => evento.fecha.getDate() === dia.getDate()).map((evento, index) => (
              <div key={index} className="evento">
                {evento.descripcion}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarioMes;