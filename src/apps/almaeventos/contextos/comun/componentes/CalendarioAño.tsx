import React from 'react';

interface Props {
  año: number;
  eventos: [];
}

const CalendarioAño: React.FC<Props> = ({ año, eventos }) => {
  // Renderiza el calendario en modo año
  return (
    <div className="calendario-año">
      {año}
      <div className="meses">
        {getMesesDelAño(año).map((mes, index) => (
          <div key={index} className="mes">
            <h2>{mes.nombre}</h2>
            <div className="semanas">
              {getSemanasDelMes(mes, eventos).map((semana, index) => (
                <div key={index} className="semana">
                  {semana.dias.map((dia, index) => (
                    <div key={index} className="dia">
                      {dia.fecha.getDate()}
                      {dia.eventos.map((evento, index) => (
                        <div key={index} className="evento">
                          {evento.descripcion}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarioAño;