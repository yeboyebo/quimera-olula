import { useEffect, useState } from "react";
import { Calendario } from "../../../../../../componentes/calendario/calendario.tsx";
import { useLista } from "../../../../../../contextos/comun/useLista.ts";
import { TextoConTooltip } from "../../../comun/componentes/TextoConTooltip/TextoConTooltip.tsx";
import { EventoCalendario } from "../diseño.ts";
import { getEventosCalendario } from "../infraestructura.ts";
import "./CalendarioEventos.css";


export const CalendarioEventos = () => {
  const eventosCalendarioData = useLista<EventoCalendario>([]);
  const [cargando, setCargando] = useState(false);

  // Cargar eventos al montar el componente
  useEffect(() => {
    const fetchEventosCalendario = async () => {
      setCargando(true);
      const eventos = await getEventosCalendario([], []);
      eventosCalendarioData.setLista(eventos); // Call the setLista method on the correct object
      setCargando(false);
    };
    fetchEventosCalendario();
  }, []);

  // console.log('mimensaje_aaaaaaaaaaaaaaaa', eventosCalendarioData);
  


  return (
    <div className="calendario-eventos">
      <Calendario
        datos={eventosCalendarioData.lista}
        cargando={cargando}
        config={{
          maxDatosVisibles: 3,
          cabecera: {
            // mostrarBotonHoy: false,
            mostrarCambioModo: false,
            modoCalendario: 'anio'
          }
        }}        
        renderDato={(dato: EventoCalendario) => (
          <div 
            onClick={() => window.location.href = `/eventos/evento/${dato.evento_id}`}
            className="evento-item"
          >
            <div className="texto-multilinea-wrapper">
              <TextoConTooltip texto={`${dato.hora_inicio} - ${dato.descripcion}`} />
            </div>
          </div>
        )}
      />
    </div>
  );
};