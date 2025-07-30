import React, { useCallback, useEffect, useRef, useState } from 'react';
import { QBoton } from "../atomos/qboton.tsx";
import { QIcono } from '../atomos/qicono.tsx';
import './calendario.css';
import { CalendarioConfig, EventoBase } from './tipos';

const funcionesPorDefecto = {
  esHoy: (fecha: Date) => fecha.toDateString() === new Date().toDateString(),
  esMesActual: (fecha: Date, mesReferencia: Date) => 
    fecha.getMonth() === mesReferencia.getMonth() && 
    fecha.getFullYear() === mesReferencia.getFullYear(),
  formatearMes: (fecha: Date) => 
    fecha.toLocaleDateString('es-ES', { month: 'long' }).charAt(0).toUpperCase() + 
    fecha.toLocaleDateString('es-ES', { month: 'long' }).slice(1),
  formatearMesAño: (fecha: Date) => 
    `${fecha.toLocaleDateString('es-ES', { month: 'long' }).charAt(0).toUpperCase() + 
    fecha.toLocaleDateString('es-ES', { month: 'long' }).slice(1)} ${fecha.getFullYear()}`,
  getDiasDelMes: (fecha: Date) => {
    const año = fecha.getFullYear();
    const mes = fecha.getMonth();
    const dias = new Date(año, mes + 1, 0).getDate();
    return Array.from({ length: dias }, (_, i) => new Date(año, mes, i + 1));
  },
  getEventosPorFecha: <T extends EventoBase>(eventos: T[], fecha: Date) => 
    eventos.filter(e => {      
      const fechaEvento = typeof e.fecha === 'string' ? new Date(e.fecha) : e.fecha;
      return fechaEvento.toDateString() === fecha.toDateString();
    }),
  getSemanasDelMes: (fecha: Date) => {
    const primerDia = new Date(fecha.getFullYear(), fecha.getMonth(), 1);
    const ultimoDia = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0);
    
    let diaActual = new Date(primerDia);
    diaActual.setDate(diaActual.getDate() - diaActual.getDay());
    
    const semanas: Date[][] = [];
    while (diaActual <= ultimoDia || semanas.length < 6) {
      const semana: Date[] = [];
      for (let i = 0; i < 7; i++) {
        semana.push(new Date(diaActual));
        diaActual.setDate(diaActual.getDate() + 1);
      }
      semanas.push(semana);
    }
    return semanas;
  }
};

interface CalendarioProps<T extends EventoBase> {
  eventos: T[];
  cargando?: boolean;
  config?: Partial<CalendarioConfig<T>>;
  renderEvento?: (evento: T) => React.ReactNode;
  children?: React.ReactNode;
}

export function Calendario<T extends EventoBase>({
  eventos = [],
  cargando = false,
  config = {},
  renderEvento,
  children
}: CalendarioProps<T>) {
  const [fechaActual, setFechaActual] = useState(new Date());
  const [modoAnio, setModoAnio] = useState(false);
  const anioGridRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  const {
    esHoy,
    esMesActual,
    formatearMes,
    formatearMesAño,
    getDiasDelMes,
    getEventosPorFecha,
    getSemanasDelMes
  } = { ...funcionesPorDefecto, ...config };

  // Scroll al mes actual al cambiar a modo año
  useEffect(() => {
    if (modoAnio && anioGridRef.current) {
      const hoy = new Date();
      scrollToMes(hoy.getMonth());
    }
  }, [modoAnio]);

  const scrollToMes = (mesIndex: number) => {
    const grid = anioGridRef.current;
    if (!grid) return;

    const meses = grid.querySelectorAll('.mes-anio');
    if (meses.length === 0 || mesIndex < 0 || mesIndex >= meses.length) return;

    let posicion = 0;
    for (let i = 0; i < mesIndex; i++) {
      posicion += meses[i].clientHeight + 32; // 32px = gap entre meses
    }

    grid.scrollTo({
      top: posicion,
      behavior: 'smooth'
    });
  };

  const handleScroll = useCallback(() => {
    if (anioGridRef.current) {
      setScrollPosition(anioGridRef.current.scrollTop);
    }
  }, []);

  const navegarTiempo = (direccion: number) => {
    const nuevaFecha = new Date(fechaActual);
    if (modoAnio) {
      nuevaFecha.setFullYear(nuevaFecha.getFullYear() + direccion);
    } else {
      nuevaFecha.setMonth(nuevaFecha.getMonth() + direccion);
    }
    setFechaActual(nuevaFecha);

    // Mantener posición de scroll relativa en modo año
    if (modoAnio && anioGridRef.current) {
      setTimeout(() => {
        if (anioGridRef.current) {
          anioGridRef.current.scrollTop = scrollPosition;
        }
      }, 0);
    }
  };

  const irAHoy = () => {
    const hoy = new Date();
    setFechaActual(hoy); // Actualiza la fecha siempre

    // Solo hace scroll en modo año si no está visible el mes actual
    if (modoAnio && anioGridRef.current) {
      const mesActual = hoy.getMonth();
      const meses = anioGridRef.current.querySelectorAll('.mes-anio');
      
      // Verifica si el mes actual ya está visible
      const mesVisible = Array.from(meses).some(mes => {
        const rect = mes.getBoundingClientRect();
        return rect.top >= 0 && rect.bottom <= window.innerHeight;
      });

      if (!mesVisible) {
        scrollToMes(mesActual); // 👈 Scroll solo si es necesario
      }
    }
  };

  const renderDia = (dia: Date, mesReferencia: Date, maxEventos: number) => {
    const esDiaDelMes = esMesActual(dia, mesReferencia);
    const eventosDelDia = esDiaDelMes ? getEventosPorFecha(eventos, dia) : [];
    
    return (
      <div 
        key={dia.toString()} 
        className={`calendario-dia ${!esDiaDelMes ? 'otro-mes' : ''} ${esHoy(dia) && esDiaDelMes ? 'hoy' : ''}`}
      >
        <div className="dia-numero">{dia.getDate()}</div>
        {esDiaDelMes && (
          <div className="dia-eventos">
            {eventosDelDia.slice(0, maxEventos).map(evento => (
              renderEvento ? renderEvento(evento) : (
                <div 
                  key={evento.id} 
                  className="evento-item"
                  title={evento.descripcion}
                >
                  <span className="evento-titulo">{evento.descripcion}</span>
                </div>
              )
            ))}
            {eventosDelDia.length > maxEventos && (
              <div className="eventos-mas">+{eventosDelDia.length - maxEventos} más</div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="calendario-container">
      <div className="calendario-cabecera">
        <div className="calendario-controles">
          <QBoton onClick={() => setModoAnio(!modoAnio)}>
            {modoAnio ? 'Modo Año' : 'Modo Mes'}
          </QBoton>
          {children}
        </div>

        <div className="calendario-navegacion">
          <QBoton onClick={() => navegarTiempo(-1)}>
            <QIcono nombre="atras" />
          </QBoton>
          {
            modoAnio
            ? <h2>{fechaActual.getFullYear()}</h2>
            : <h2 className="calendario-navegacion-mes-anio">{formatearMesAño(fechaActual)}</h2>
          }
          {/* <h2>{modoAnio ? fechaActual.getFulslYear() : formatearMesAño(fechaActual)}</h2> */}
          <QBoton onClick={() => navegarTiempo(1)}>
            <QIcono nombre="adelante" />
          </QBoton>
        </div>
        
        <div className="calendario-controles">
          <QBoton onClick={irAHoy}>Hoy</QBoton>
        </div>
      </div>

      {modoAnio ? (
        <div ref={anioGridRef} className="anio-grid" onScroll={handleScroll}>
          {Array.from({ length: 12 }).map((_, i) => {
            const mesFecha = new Date(fechaActual.getFullYear(), i, 1);
            return (
              <div key={i} className="mes-anio">
                <h3 className="calendario-mes">{formatearMes(mesFecha)}</h3>
                <div className="calendario-dias-semana">
                  {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(dia => (
                    <div key={dia} className="dia-semana">{dia}</div>
                  ))}
                </div>
                {getSemanasDelMes(mesFecha).map((semana, j) => (
                  <div key={j} className="calendario-dias">
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
            {getDiasDelMes(fechaActual).map(dia => renderDia(dia, fechaActual, 3))}
          </div>
        </div>
      )}

      {cargando && (
        <div className="calendario-cargando">
          <QIcono nombre="cargando" />
          Cargando eventos...
        </div>
      )}
    </div>
  );
}