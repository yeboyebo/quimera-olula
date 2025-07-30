import { useEffect, useState } from "react";
import { Calendario } from "../../../../../../componentes/calendario/calendario.tsx";
import { EventoCalendario } from "../diseño.ts";
import { getEventosCalendario } from "../infraestructura.ts";
import "./CalendarioEventos.css";

// Extraer tipos a una interfaz
interface CalendarioState {
  eventos: EventoCalendario[];
  fechaActual: Date;
  cargando: boolean;
  modoAnio: boolean;
  scrollPosition: number;
}

export const CalendarioEventos = () => {
  const [state, setState] = useState<CalendarioState>({
    eventos: [],
    fechaActual: new Date(),
    cargando: false,
    modoAnio: false,
    scrollPosition: 0
  });

  // Cargar eventos
  useEffect(() => {
    const cargarEventos = async () => {
      setState(prev => ({...prev, cargando: true}));
      try {
        const eventosData = await getEventosCalendario();
        setState(prev => ({...prev, eventos: eventosData}));
      } catch (error) {
        console.error("Error cargando eventos:", error);
      } finally {
        setState(prev => ({...prev, cargando: false}));
      }
    };
    cargarEventos();
  }, []);


  return (
    <div className="calendario-eventos">
      <Calendario
        eventos={state.eventos}
        cargando={state.cargando}
        // fechaActual={state.fechaActual}
        // modoAnio={state.modoAnio}
        // navegarTiempo={navegarTiempo}
        // irAHoy={irAHoy}
        // anioGridRef={anioGridRef}
        // scrollPosition={state.scrollPosition}
        // renderDia={renderDia}
      />
    </div>
  );
};