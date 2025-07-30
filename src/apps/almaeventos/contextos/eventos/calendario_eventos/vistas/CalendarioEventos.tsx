import { useCallback, useEffect, useRef, useState } from "react";
import { QBoton } from "../../../../../../componentes/atomos/qboton.tsx";
import { QIcono } from "../../../../../../componentes/atomos/qicono.tsx";
import { EventoCalendario } from "../diseño.ts";
import { esHoy, esMesActual, formatearMes, formatearMesAño, getDiasDelMes, getEventosPorFecha, getSemanasDelMes } from "../dominio.ts";
import { getEventosCalendario } from "../infraestructura.ts";
import "./CalendarioEventos.css";

export const CalendarioEventos = () => {
    const [state, setState] = useState({
        eventos: [] as EventoCalendario[],
        fechaActual: new Date(),
        cargando: false,
        modoAnio: false,
        scrollPosition: 0
    });

    const anioGridRef = useRef<HTMLDivElement>(null);

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

    useEffect(() => {
        if (state.modoAnio && anioGridRef.current) {
            const handleScroll = () => {
                setState(prev => ({...prev, scrollPosition: anioGridRef.current?.scrollTop || 0}));
            };
            
            anioGridRef.current.addEventListener('scroll', handleScroll);
            return () => {
                anioGridRef.current?.removeEventListener('scroll', handleScroll);
            };
        }
    }, [state.modoAnio]);    

    const calcularPosicionScroll = (mesTarget: number) => {
        if (!anioGridRef.current) return 0;
        
        const meses = Array.from(anioGridRef.current.querySelectorAll('.mes-anio'));
        
        return meses.slice(0, mesTarget).reduce((acc, mes) => {
            return acc + mes.clientHeight + 32; // Suma altura del mes + gap
        }, 0);
    };

    const irAHoy = () => {
        const hoy = new Date();
        const mesActual = hoy.getMonth();
        
        setState(prev => ({...prev, fechaActual: hoy}));
        
        if (state.modoAnio && anioGridRef.current) {
            const targetPosition = calcularPosicionScroll(mesActual);
            anioGridRef.current.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    };


    const navegarTiempo = (direccion: number) => {
        const nuevaFecha = new Date(state.fechaActual);
        state.modoAnio 
            ? nuevaFecha.setFullYear(nuevaFecha.getFullYear() + direccion)
            : nuevaFecha.setMonth(nuevaFecha.getMonth() + direccion);
        setState(prev => ({...prev, fechaActual: nuevaFecha}));
    };

    const renderDia = (dia: Date, mesReferencia: Date, maxEventos: number) => {
        const esDiaDelMes = esMesActual(dia, mesReferencia);
        const eventosDelDia = esDiaDelMes ? getEventosPorFecha(state.eventos, dia) : [];
        
        return (
            <div key={dia.toString()} className={`calendario-dia ${
                !esDiaDelMes ? 'otro-mes' : ''
            } ${
                esHoy(dia) && esDiaDelMes ? 'hoy' : ''
            }`}>
                <div className="dia-numero">{dia.getDate()}</div>
                {esDiaDelMes && (
                    <div className="dia-eventos">
                        {eventosDelDia.slice(0, maxEventos).map(evento => (
                            <Evento key={evento.evento_id} evento={evento} />
                        ))}
                        {eventosDelDia.length > maxEventos && (
                            <div className="eventos-mas">+{eventosDelDia.length - maxEventos} más</div>
                        )}
                    </div>
                )}
            </div>
        );
    };

    const Evento = ({ evento }: { evento: EventoCalendario }) => (
        <div className={`evento-item ${evento.estado_id?.toLowerCase() || 'sin-estado'}`}
             title={`${evento.descripcion} - ${evento.lugar} (${evento.hora_inicio})`}>
            <span className="evento-hora">{evento.hora_inicio?.substring(0, 5)}</span>
            <span className="evento-titulo">{evento.descripcion}</span>
        </div>
    );

    const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
        if (anioGridRef.current) {
            setState(prev => ({...prev, scrollPosition: anioGridRef.current?.scrollTop || 0}));
        }
    }, []);    

    return (
        <div className="calendario-eventos">
            <div className="calendario-cabecera">
                <div className="calendario-controles">
                    <QBoton onClick={() => setState(prev => ({...prev, modoAnio: !prev.modoAnio}))}>
                        {state.modoAnio ? 'Modo Año' : 'Modo Mes'}
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

            {state.modoAnio ? (
                <div 
                    ref={anioGridRef}
                    className="anio-grid" 
                    onScroll={handleScroll}
                >
                    {Array.from({ length: 12 }).map((_, i) => {
                        const mesFecha = new Date(state.fechaActual.getFullYear(), i, 1);
                        return (
                            <div key={i} className="mes-anio" id={`mes-${i}`}>
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