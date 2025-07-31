import React, { useCallback, useEffect, useRef, useState } from 'react';
import { QBoton } from "../atomos/qboton.tsx";
import { QIcono } from '../atomos/qicono.tsx';
import './calendario.css';
import { CalendarioConfig, DatoBase } from './tipos';

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
  getDatosPorFecha: <T extends DatoBase>(datos: T[], fecha: Date) => 
    datos.filter(e => {      
      const fechaDato = typeof e.fecha === 'string' ? new Date(e.fecha) : e.fecha;
      return fechaDato.toDateString() === fecha.toDateString();
    }),
  getSemanasDelMes: (fecha: Date, inicioSemana: 'lunes' | 'domingo' = 'lunes') => {
    const primerDiaMes = new Date(fecha.getFullYear(), fecha.getMonth(), 1);
    const ultimoDiaMes = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0);
    
    // Ajuste para comenzar en lunes
    let primerDiaCalendario = new Date(primerDiaMes);
    const diaSemana = primerDiaMes.getDay();
    
    if (inicioSemana === 'lunes') {
      const diferencia = diaSemana === 0 ? 6 : diaSemana - 1;
      primerDiaCalendario.setDate(primerDiaMes.getDate() - diferencia);
    } else {
      primerDiaCalendario.setDate(primerDiaMes.getDate() - diaSemana);
    }
    
    const semanas: Date[][] = [];
    let diaActual = new Date(primerDiaCalendario);
    
    // Filtramos semanas que no contengan días del mes actual
    while (diaActual <= ultimoDiaMes) {
      const semana: Date[] = [];
      let contieneDiasDelMes = false;
      
      // Primera pasada: verificar si la semana tiene días del mes
      for (let i = 0; i < 7; i++) {
        const diaVerificar = new Date(diaActual);
        diaVerificar.setDate(diaActual.getDate() + i);
        if (diaVerificar.getMonth() === fecha.getMonth()) {
          contieneDiasDelMes = true;
          break;
        }
      }
      
      // Segunda pasada: agregar semana si tiene días del mes
      if (contieneDiasDelMes) {
        for (let i = 0; i < 7; i++) {
          semana.push(new Date(diaActual));
          diaActual.setDate(diaActual.getDate() + 1);
        }
        semanas.push(semana);
      } else {
        // Saltar semana completa si no tiene días del mes
        diaActual.setDate(diaActual.getDate() + 7);
      }
    }
    
    return semanas;
  },
  getDiasSemana: (inicioSemana: 'lunes' | 'domingo' = 'lunes') => 
    inicioSemana === 'lunes' 
      ? ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
      : ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
};

interface CalendarioProps<T extends DatoBase> {
  datos: T[];
  cargando?: boolean;
  config?: Partial<CalendarioConfig<T>>;
  renderDia?: (args: {
    fecha: Date;
    datos: T[];
    esMesActual: boolean;
    esHoy: boolean;
  }) => React.ReactNode;
  renderDato?: (dato: T) => React.ReactNode;
  children?: React.ReactNode;
}

export function Calendario<T extends DatoBase>({
  datos = [],
  cargando = false,
  config = {},
  renderDia,
  renderDato,
  children
}: CalendarioProps<T>) {
  const [fechaActual, setFechaActual] = useState(new Date());
   const modoInicial = config.cabecera?.modoCalendario === 'anio';
  const [modoAnio, setModoAnio] = useState(modoInicial);
  const anioGridRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  const {
    formatearMes,
    formatearMesAño,
    getDiasDelMes,
    getSemanasDelMes,
    cabecera: {
      botonesIzquierda = [],
      botonesDerecha = [],
      mostrarCambioModo = true,
      mostrarControlesNavegacion = true,
      mostrarBotonHoy = true,
      modoCalendario = 'mes'
    } = {},
    estilos: {
      dia: estiloDia,
      dato: estiloDato,
      cabecera: estiloCabecera,
      boton: estiloBoton,
    } = {},
    maxDatosVisibles = modoAnio ? 2 : 3,
    inicioSemana = 'lunes',
    getDatosPorFecha = (datos: T[], fecha: Date) => 
      datos.filter((d: T) => new Date(d.fecha).toDateString() === fecha.toDateString()),
    esHoy = (fecha: Date) => fecha.toDateString() === new Date().toDateString(),
    esMesActual = (fecha: Date, mesReferencia: Date) => 
      fecha.getMonth() === mesReferencia.getMonth() && 
      fecha.getFullYear() === mesReferencia.getFullYear(),    
  } = { ...funcionesPorDefecto, ...config };

  const diasSemana = funcionesPorDefecto.getDiasSemana(inicioSemana);
  // Scroll al mes actual al cambiar a modo año
  useEffect(() => {
    if (modoAnio && anioGridRef.current) {
      const hoy = new Date();
      scrollToMes(hoy.getMonth());
    }
  }, [modoAnio]);

  useEffect(() => {
    // Sincronizar el estado interno si cambia la prop modoCalendario
    if (config.cabecera?.modoCalendario) {
      setModoAnio(config.cabecera.modoCalendario === 'anio');
    }
  }, [config.cabecera?.modoCalendario]);  

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

  const renderCabecera = () => (
    <div className="calendario-cabecera">
      <div className="cabecera-izquierda">
        {mostrarCambioModo && (
          <QBoton onClick={() => setModoAnio(!modoAnio)}>
            {modoAnio ? 'Modo Mes' : 'Modo Año'}
          </QBoton>
        )}
        {botonesIzquierda}
      </div>

      <div className="calendario-navegacion">
        {mostrarControlesNavegacion && (
          <>
            <QBoton onClick={() => navegarTiempo(-1)}>
              <QIcono nombre="atras" />
            </QBoton>
            {(modoAnio 
              ? <h2>{fechaActual.getFullYear()}</h2>
              : <h2 className="calendario-navegacion-mes-anio">{formatearMesAño(fechaActual)}</h2>
            )}
            <QBoton onClick={() => navegarTiempo(1)}>
              <QIcono nombre="adelante" />
            </QBoton>
          </>
        )}
      </div>

      <div className="cabecera-derecha">
        {botonesDerecha}
        {mostrarBotonHoy && <QBoton onClick={irAHoy}>Hoy</QBoton>}
      </div>
    </div>
  );  

  const renderDiaPorDefecto = (fecha: Date, mesReferencia: Date) => {
    const esDiaDelMes = esMesActual(fecha, mesReferencia);
    const datosDelDia: T[] = esDiaDelMes ? getDatosPorFecha(datos, fecha) : [];

    return (
      <div className={`calendario-dia ${!esDiaDelMes ? 'otro-mes' : ''} ${esHoy(fecha) ? 'hoy' : ''}`}>
        <div className="dia-numero">{fecha.getDate()}</div>
        {esDiaDelMes && datosDelDia.slice(0, maxDatosVisibles).map((dato: T) => (
          renderDato 
            ? renderDato(dato)
            : <div key={dato.id} className="dato-item">{dato.descripcion}</div>
        ))}
      </div>
    );
  };

  return (
    <div className="calendario-container">
      {renderCabecera()}

      {modoAnio ? (
            <div ref={anioGridRef} className="anio-grid" onScroll={handleScroll}>
              {Array.from({ length: 12 }).map((_, i) => {
                const mesFecha = new Date(fechaActual.getFullYear(), i, 1);
                return (
                  <div key={i} className="mes-anio">
                    <h3 className="calendario-mes">{formatearMes(mesFecha)}</h3>
                    <div className="calendario-dias-semana">
                      {diasSemana.map(dia => (
                        <div key={dia} className="dia-semana">{dia}</div>
                      ))}
                    </div>
                    {funcionesPorDefecto.getSemanasDelMes(mesFecha, inicioSemana)
                      .filter(semana => semana.some(dia => dia.getMonth() === i))
                      .map((semana, j) => (
                        <div key={j} className="calendario-dias">
                          {semana.map(dia => (
                            renderDia 
                              ? renderDia({
                                  fecha: dia,
                                  datos: getDatosPorFecha(datos, dia),
                                  esMesActual: esMesActual(dia, mesFecha),
                                  esHoy: esHoy(dia)
                                })
                              : renderDiaPorDefecto(dia, mesFecha)
                          ))}
                        </div>
                      ))
                    }
                  </div>
                );
              })}
            </div>
          ): (
          <div className="calendario-grid">
            <div className="calendario-dias-semana">
              {diasSemana.map(dia => (
                <div key={dia} className="dia-semana">{dia}</div>
              ))}
            </div>
            <div className="calendario-semanas">
              {funcionesPorDefecto.getSemanasDelMes(fechaActual, inicioSemana)
                .filter(semana => semana.some(dia => dia.getMonth() === fechaActual.getMonth()))
                .map((semana, indexSemana) => (
                  <div key={`semana-${indexSemana}`} className="calendario-semana">
                    {semana.map((dia, indexDia) => {
                      const esDiaDelMes = dia.getMonth() === fechaActual.getMonth();
                      return renderDia
                        ? renderDia({
                            fecha: dia,
                            datos: esDiaDelMes ? getDatosPorFecha(datos, dia) : [],
                            esMesActual: esDiaDelMes,
                            esHoy: esHoy(dia)
                          })
                        : renderDiaPorDefecto(dia, fechaActual);
                    })}
                  </div>
                ))
              }
            </div>
          </div>
      )}

      {cargando && (
        <div className="calendario-cargando">
          <QIcono nombre="cargando" />
          Cargando datos...
        </div>
      )}
    </div>
  );
}