import { useCallback, useEffect, useRef, useState } from "react";
import { QBoton } from "../../../../../../componentes/atomos/qboton.tsx";
import { QIcono } from "../../../../../../componentes/atomos/qicono.tsx";
import { EventoCalendario } from "../diseño.ts";
import { esHoy, esMesActual, formatearMes, formatearMesAño, getDiasDelMes, getEventosPorFecha, getSemanasDelMes } from "../dominio.ts";
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

  const anioGridRef = useRef<HTMLDivElement>(null);

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

  // Scroll en modo año
  const handleScroll = useCallback(() => {
    if (anioGridRef.current) {
      setState(prev => ({...prev, scrollPosition: anioGridRef.current?.scrollTop || 0}));
    }
  }, []);

  // Navegación
  const navegarTiempo = (direccion: number) => {
    const nuevaFecha = new Date(state.fechaActual);
    state.modoAnio 
      ? nuevaFecha.setFullYear(nuevaFecha.getFullYear() + direccion)
      : nuevaFecha.setMonth(nuevaFecha.getMonth() + direccion);
    setState(prev => ({...prev, fechaActual: nuevaFecha}));
  };

  // Ir a hoy
  const irAHoy = () => {
    const hoy = new Date();
    setState(prev => ({...prev, fechaActual: hoy}));
    
    if (state.modoAnio && anioGridRef.current) {
      const mesActual = hoy.getMonth();
      const meses = Array.from(anioGridRef.current.querySelectorAll('.mes-anio'));
      const scrollPos = meses.slice(0, mesActual).reduce((acc, mes) => acc + mes.clientHeight + 32, 0);
      
      anioGridRef.current.scrollTo({ top: scrollPos, behavior: 'smooth' });
    }
  };

  // Renderizado de día (componente interno)
  const renderDia = (dia: Date, mesReferencia: Date, maxEventos: number) => {
    const esDiaDelMes = esMesActual(dia, mesReferencia);
    const eventosDelDia = esDiaDelMes ? getEventosPorFecha(state.eventos, dia) : [];
    
    return (
      <div key={dia.toString()} className={`calendario-dia ${!esDiaDelMes ? 'otro-mes' : ''} ${esHoy(dia) && esDiaDelMes ? 'hoy' : ''}`}>
        <div className="dia-numero">{dia.getDate()}</div>
        {esDiaDelMes && (
          <div className="dia-eventos">
            {eventosDelDia.slice(0, maxEventos).map(evento => (
              <div key={evento.evento_id} className={`evento-item ${evento.estado_id?.toLowerCase() || 'sin-estado'}`}
                   title={`${evento.descripcion} - ${evento.lugar} (${evento.hora_inicio})`}>
                <span className="evento-hora">{evento.hora_inicio?.substring(0, 5)}</span>
                <span className="evento-titulo">{evento.descripcion}</span>
              </div>
            ))}
            {eventosDelDia.length > maxEventos && <div className="eventos-mas">+{eventosDelDia.length - maxEventos} más</div>}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="calendario-eventos">
      {/* Cabecera */}
      <div className="calendario-cabecera">
        <div className="calendario-controles">
          <QBoton onClick={() => setState(prev => ({...prev, modoAnio: !prev.modoAnio}))}>
            {state.modoAnio ? 'Modo Mes' : 'Modo Año'}
          </QBoton>
        </div>

        <div className="calendario-navegacion">
          <QBoton onClick={() => navegarTiempo(-1)}>
            <QIcono nombre="atras" />
          </QBoton>
          <h2>{state.modoAnio ? state.fechaActual.getFullYear() : formatearMesAño(state.fechaActual)}</h2>
          <QBoton onClick={() => navegarTiempo(1)}>
            <QIcono nombre="adelante" />
          </QBoton>
        </div>
        
        <div className="calendario-controles">
          <QBoton onClick={irAHoy}>Hoy</QBoton>
        </div>
      </div>

      {/* Contenido */}
      {state.modoAnio ? (
        <div ref={anioGridRef} className="anio-grid" onScroll={handleScroll}>
          {Array.from({ length: 12 }).map((_, i) => {
            const mesFecha = new Date(state.fechaActual.getFullYear(), i, 1);
            return (
              <div key={i} className="mes-anio">
                <h3>{formatearMes(mesFecha)}</h3>
                {getSemanasDelMes(mesFecha).map((semana, j) => (
                  <div key={j} className="semana-anio">
                    {semana.map(dia => renderDia(dia, mesFecha, 2))}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="calendario-grid">
          <div className="calendario-dias-semana">
            {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(dia => (
              <div key={dia} className="dia-semana">{dia}</div>
            ))}
          </div>
          <div className="calendario-dias">
            {getDiasDelMes(state.fechaActual).map(dia => renderDia(dia, state.fechaActual, 3))}
          </div>
        </div>
      )}

      {state.cargando && (
        <div className="calendario-cargando">
          <QIcono nombre="usuario" />
          Cargando eventos...
        </div>
      )}
    </div>
  );
};