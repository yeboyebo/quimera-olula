// --- Hooks y helpers para experiencia móvil ---
import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { useEsMovil } from "../../componentes/maestro/useEsMovil.ts";
import { QBoton } from "../atomos/qboton.tsx";
import { QIcono } from '../atomos/qicono.tsx';
import './calendario.css';
import { CalendarioConfig, DatoBase } from './tipos';
// import { useSwipe } from "../../componentes/maestro/useSwipe.ts";


function useSwipe(
  onSwipeLeft: () => void,
  onSwipeRight: () => void
): React.RefObject<HTMLDivElement> {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let x0: number | null = null;
    function onTouchStart(e: TouchEvent) {
      x0 = e.touches[0].clientX;
    }
    function onTouchEnd(e: TouchEvent) {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 50) {
        if (dx < 0) onSwipeLeft();
        else onSwipeRight();
      }
      x0 = null;
    }
    el.addEventListener('touchstart', onTouchStart);
    el.addEventListener('touchend', onTouchEnd);
    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, [onSwipeLeft, onSwipeRight]);
  return ref;
}

interface MenuAccionesMovilProps {
  esMovil: boolean;
  modoAnio: boolean;
  onCambioModo: () => void;
  botonesIzqModo?: React.ReactNode[];
  botonesDerModo?: React.ReactNode[];
  botonesIzqHoy?: React.ReactNode[];
  botonesDerHoy?: React.ReactNode[];
  mostrarCambioModo?: boolean;
}
function MenuAccionesMovil({
  esMovil,
  modoAnio,
  onCambioModo,
  botonesIzqModo = [],
  botonesDerModo = [],
  botonesIzqHoy = [],
  botonesDerHoy = [],
  mostrarCambioModo = true
}: MenuAccionesMovilProps) {
  const [abierto, setAbierto] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const ignoreNextClick = useRef(false);

  // Función toggle: abre si está cerrado, cierra si está abierto
  const toggleMenu = () => {
    if (ignoreNextClick.current) {
      ignoreNextClick.current = false;
      return;
    }
    
    setAbierto(prev => !prev);
  };


  // Función para cerrar el menú
  const cerrarMenu = useCallback(() => {
    setAbierto(false);
  }, []);

  // Función wrapper que ejecuta la acción original y luego cierra el menú
  const crearManejadorConCierre = (accionOriginal?: () => void) => {
    return () => {
      // Ejecutar la acción original si existe
      if (accionOriginal) {
        accionOriginal();
      }
      // Cerrar el menú después de la acción
      cerrarMenu();
    };
  };

  // Wrappers para las acciones principales
  const handleCambioModo = crearManejadorConCierre(onCambioModo);

  // Función para clonar botones con el manejador de cierre
  const clonarBotonConCierre = (boton: React.ReactNode, index: number): React.ReactNode => {
    if (React.isValidElement<{ onClick?: () => void }>(boton)) {
      return React.cloneElement(boton, {
        key: index,
        onClick: crearManejadorConCierre(boton.props.onClick)
      });
    }
    return boton;
  };

  // Cerrar menú al hacer click fuera
  useEffect(() => {
    if (!abierto) return;
    
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        // Marcar para ignorar el próximo clic en el botón toggle
        ignoreNextClick.current = true;
        cerrarMenu();
      }
    }
    
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [abierto, cerrarMenu]);

  // Portal para menú lateral
  const [portalNode, setPortalNode] = useState<HTMLElement | null>(null);
  useEffect(() => {
    let node = document.getElementById('menu-acciones-movil-portal');
    if (!node) {
      node = document.createElement('div');
      node.id = 'menu-acciones-movil-portal';
      document.body.appendChild(node);
    }
    setPortalNode(node);
    return () => {
      if (node && node.parentNode) node.parentNode.removeChild(node);
    };
  }, []);

  const menuLateral = (
    <menu-lateral 
      id="menu-acciones-movil"
      style={{
        border: '1px solid #ccc',
        position: 'fixed',
        top: 154,
        height: '79vh',
        zIndex: 1200,
        width: '320px',
        maxWidth: '100vw',
        overflowY: 'hidden',
        marginLeft: '1rem',
        left: abierto ? 0 : '-320px',
        visibility: abierto ? 'visible' : 'hidden',
        transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1), visibility 0.3s',
      }}
    >
      <aside ref={menuRef} style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        background: '#fff',
        boxShadow: '2px 0 16px rgba(0,0,0,0.12)'
      }}>
        <nav>
          <div className="menu-acciones">
            {botonesIzqModo.map((boton, index) => (
              <div className="menu-acciones-fila" key={index}>
                {clonarBotonConCierre(boton, index)}
              </div>
            ))}
            
            {mostrarCambioModo && <div className="menu-acciones-fila" key={'modo'}>
              <QBoton onClick={handleCambioModo} variante={esMovil ? 'texto' : 'solido'}>
                {modoAnio ? 'Modo Mes' : 'Modo Año'}
              </QBoton>
            </div>
            }

            {botonesDerModo.map((boton, index) => (
              <div className="menu-acciones-fila" key={index}>
                {clonarBotonConCierre(boton, index)}
              </div>
            ))}      
            
            {botonesIzqHoy.map((boton, index) => (
              <div className="menu-acciones-fila" key={index}>
                {clonarBotonConCierre(boton, index)}
              </div>
            ))}            

            {botonesDerHoy.map((boton, index) => (
              <div className="menu-acciones-fila" key={index}>
                {clonarBotonConCierre(boton, index)}
              </div>
            ))}           
          </div>
        </nav>
      </aside>
    </menu-lateral>
  );

  return (
    <>
      {console.log('mimensaje_abierto', abierto)
      }
      <button
        id="boton-menu-acciones-movil"
        aria-label={abierto ? "Cerrar menú acciones" : "Abrir menú acciones"}
        className="boton-menu-lateral"
        onClick={toggleMenu} // ← Cambiado a toggleMenu
        type="button"
      >
        <QIcono nombre="menu" tamaño="sm" />
      </button>
      {portalNode && ReactDOM.createPortal(menuLateral, portalNode)}
    </>
  );
}

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
  // --- Experiencia móvil integrada ---
  const esMovil = useEsMovil(640);
  // Control de fecha y modo: si no se pasa desde fuera, lo gestiona el propio componente
  const controlado = typeof config.fechaActual !== 'undefined' && typeof config.onFechaActualChange === 'function';
  const [fechaNoControlada, setFechaNoControlada] = useState(() => config.fechaActual ?? new Date());
  const fechaActual = controlado ? config.fechaActual! : fechaNoControlada;
  // Setters separados para evitar ambigüedad de tipos
  const setFechaActualControlado = config.onFechaActualChange;
  const setFechaActualNoControlado = setFechaNoControlada;
  const modoInicial = config.cabecera?.modoCalendario === 'anio';
  const [modoAnio, setModoAnio] = useState(modoInicial);

  // Swipe: el hook se llama siempre, pero solo se usa el ref si esMovil
  // setFechaActual puede ser una función (setState) o un setter directo (controlado)
  const setFechaActualAntSig = (dir: number) => {
    if (controlado && setFechaActualControlado) {
      // Controlado: setter externo
      const nueva = new Date(fechaActual);
      if (modoAnio) {
        nueva.setFullYear(nueva.getFullYear() + dir);
      } else {
        nueva.setMonth(nueva.getMonth() + dir);
      }
      setFechaActualControlado(nueva);
    } else {
      // No controlado: setState interno
      setFechaActualNoControlado((prev: Date) => {
        const nueva = new Date(prev);
        if (modoAnio) {
          nueva.setFullYear(nueva.getFullYear() + dir);
        } else {
          nueva.setMonth(nueva.getMonth() + dir);
        }
        return nueva;
      });
    }
  };
  const swipeRef = useSwipe(
    () => setFechaActualAntSig(1),
    () => setFechaActualAntSig(-1)
  );
  const calendarioRef = swipeRef; // siempre existe, pero solo se usa si esMovil
  const anioGridRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  const {
    formatearMes,
    formatearMesAño,
    // getDiasDelMes, // No usado
    // getSemanasDelMes, // No usado
    cabecera: {
      botonesIzqModo = [],
      botonesDerModo = [],
      botonesIzqHoy = [],
      botonesDerHoy = [],
      mostrarCambioModo = true,
      mostrarControlesNavegacion = true,
      mostrarBotonHoy = true,
      // modoCalendario = 'mes' // No usado
    } = {},
    // estilos: {
    //   dia: estiloDia,
    //   dato: estiloDato,
    //   cabecera: estiloCabecera,
    //   boton: estiloBoton,
    // } = {},
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
    if (controlado && setFechaActualControlado) {
      setFechaActualControlado(nuevaFecha);
    } else {
      setFechaActualNoControlado(nuevaFecha);
    }

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
    if (controlado && setFechaActualControlado) {
      setFechaActualControlado(hoy);
    } else {
      setFechaActualNoControlado(hoy);
    }

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

  // Cabecera: menú móvil o cabecera tradicional
  const renderCabecera = () => {
    if (esMovil) {
      return (
        <div className="calendario-cabecera">
          <MenuAccionesMovil
            esMovil={esMovil}
            modoAnio={modoAnio}
            onCambioModo={() => setModoAnio(m => !m)}
            botonesIzqModo={botonesIzqModo}
            botonesDerModo={botonesDerModo}
            botonesIzqHoy={botonesIzqHoy}
            botonesDerHoy={botonesDerHoy}
            mostrarCambioModo={mostrarCambioModo}
          />
          <div className="calendario-navegacion-movil">
            <h2 className="calendario-navegacion-mes-anio">{modoAnio ? fechaActual.getFullYear() : formatearMesAño(fechaActual)}</h2>
            {mostrarBotonHoy && 
                <button className="boton-hoy-movil" type="button" onClick={irAHoy}> 
                  <div 
                    className="icono-calendario-con-fecha"
                    data-dia={new Date().getDate()} // Número del día actual
                  >
                    <QIcono nombre={"calendario_vacio"} tamaño={"md"} color={"black"} />
                  </div>
                </button>
            }
          </div>
        </div>
      );
    }
    return (
      <div className="calendario-cabecera">
        {/* Oculta la izquierda si no hay contenido */}
        {(botonesIzqModo.length > 0 || mostrarCambioModo || botonesDerModo.length > 0) && (
          <div className="cabecera-izquierda">
            {botonesIzqModo}
            {mostrarCambioModo && (
              <QBoton onClick={() => setModoAnio(!modoAnio)}>
                {modoAnio ? 'Modo Mes' : 'Modo Año'}
              </QBoton>
            )}
            {botonesDerModo}
          </div>
        )}
        <div className="calendario-navegacion">
          {mostrarControlesNavegacion && (
            <>
              <QBoton onClick={() => navegarTiempo(-1)}>
                <QIcono nombre="atras" />
              </QBoton>
              <h2 className="calendario-navegacion-mes-anio">
                {modoAnio ? fechaActual.getFullYear() : formatearMesAño(fechaActual)}
              </h2>
              <QBoton onClick={() => navegarTiempo(1)}>
                <QIcono nombre="adelante" />
              </QBoton>
            </>
          )}
        </div>
        {/* Oculta la derecha si no hay contenido */}
        {(botonesIzqHoy.length > 0 || mostrarBotonHoy || botonesDerHoy.length > 0) && (
          <div className="cabecera-derecha">
            {botonesIzqHoy}
            {mostrarBotonHoy && <QBoton onClick={irAHoy}>Hoy</QBoton>}
            {botonesDerHoy}
          </div>
        )}
      </div>
    );
  };

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
    <div className="calendario-container" ref={esMovil ? calendarioRef : undefined}>
      {renderCabecera()}

      {modoAnio ? (
        <div ref={anioGridRef} className="anio-grid" onScroll={handleScroll}>
          {Array.from({ length: 12 }).map((_, i) => {
            const mesFecha = new Date(fechaActual.getFullYear(), i, 1);
            return (
              <div key={mesFecha.getFullYear() + '-' + i} className="mes-anio">
                <h3 className="calendario-mes">{formatearMes(mesFecha)}</h3>
                <div className="calendario-dias-semana">
                  {diasSemana.map(dia => (
                    <div key={dia} className="dia-semana">{dia}</div>
                  ))}
                </div>
                {funcionesPorDefecto.getSemanasDelMes(mesFecha, inicioSemana)
                  .filter(semana => semana.some(dia => dia.getMonth() === i))
                  .map((semana, j) => (
                    <div key={mesFecha.getFullYear() + '-' + i + '-semana-' + j} className="calendario-dias">
                      {semana.map(dia => {
                        const key = dia.toISOString();
                        return renderDia 
                          ? <React.Fragment key={key}>{renderDia({
                              fecha: dia,
                              datos: getDatosPorFecha(datos, dia),
                              esMesActual: esMesActual(dia, mesFecha),
                              esHoy: esHoy(dia)
                            })}</React.Fragment>
                          : <React.Fragment key={key}>{renderDiaPorDefecto(dia, mesFecha)}</React.Fragment>;
                      })}
                    </div>
                  ))
                }
              </div>
            );
          })}
        </div>
      ) : (
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
                <div key={`semana-${fechaActual.getFullYear()}-${fechaActual.getMonth()}-${indexSemana}`} className="calendario-semana">
                  {semana.map((dia) => {
                    const key = dia.toISOString();
                    const esDiaDelMes = dia.getMonth() === fechaActual.getMonth();
                    return renderDia
                      ? <React.Fragment key={key}>{renderDia({
                          fecha: dia,
                          datos: esDiaDelMes ? getDatosPorFecha(datos, dia) : [],
                          esMesActual: esDiaDelMes,
                          esHoy: esHoy(dia)
                        })}</React.Fragment>
                      : <React.Fragment key={key}>{renderDiaPorDefecto(dia, fechaActual)}</React.Fragment>;
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