import { useEffect, useState } from "react";
import { QBoton } from "../../../../../../componentes/atomos/qboton.tsx";
import { QIcono } from "../../../../../../componentes/atomos/qicono.tsx";
import { EventoCalendario } from "../diseño.ts";
import { esHoy, esMesActual, formatearMesAño, getDiasDelMes, getEventosPorFecha, getSemanasDelMes } from "../dominio.ts";
import { getEventosCalendario } from "../infraestructura.ts";
import "./CalendarioEventos.css";

export const CalendarioEventos = () => {
    const [eventos, setEventos] = useState<EventoCalendario[]>([]);
    const [fechaActual, setFechaActual] = useState(new Date());
    const [cargando, setCargando] = useState(false);
    const [modoAnio, setModoAnio] = useState(false);
    const [scrollPosition, setScrollPosition] = useState(0);

    useEffect(() => {
        const cargarEventos = async () => {
            setCargando(true);
            try {
                const eventosData = await getEventosCalendario();
                setEventos(eventosData);
            } catch (error) {
                console.error("Error cargando eventos:", error);
            } finally {
                setCargando(false);
            }
        };
        cargarEventos();
    }, []);

    useEffect(() => {
        if (modoAnio) {
            // Scroll al mes actual cuando cambiamos a modo año
            const hoy = new Date();
            const scrollToMonth = hoy.getMonth() * 300; // Ajusta este valor según tu diseño
            setScrollPosition(scrollToMonth);
        }
    }, [modoAnio]);

    const navegarMes = (direccion: number) => {
        const nuevaFecha = new Date(fechaActual);
        nuevaFecha.setMonth(nuevaFecha.getMonth() + direccion);
        setFechaActual(nuevaFecha);
    };

    const navegarAnio = (direccion: number) => {
        const nuevaFecha = new Date(fechaActual);
        nuevaFecha.setFullYear(nuevaFecha.getFullYear() + direccion);
        setFechaActual(nuevaFecha);
    };

    const irAHoy = () => {
        const hoy = new Date();
        setFechaActual(hoy);
        
        if (modoAnio) {
            const scrollToMonth = hoy.getMonth() * 300;
            setScrollPosition(scrollToMonth);
        }
    };

    const toggleModo = () => {
        setModoAnio(!modoAnio);
    };

    const dias = getDiasDelMes(fechaActual);
    const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

    const renderMes = () => {
        return (
            <div className="calendario-grid">
                {/* Cabecera días de la semana */}
                <div className="calendario-dias-semana">
                    {diasSemana.map(dia => (
                        <div key={dia} className="dia-semana">{dia}</div>
                    ))}
                </div>

                {/* Días del mes */}
                <div className="calendario-dias">
                    {dias.map((fecha, index) => {
                        const eventosDelDia = getEventosPorFecha(eventos, fecha);
                        return (
                            <div 
                                key={index}
                                className={`calendario-dia ${
                                    !esMesActual(fecha, fechaActual) ? 'otro-mes' : ''
                                } ${esHoy(fecha) ? 'hoy' : ''}`}
                            >
                                <div className="dia-numero">{fecha.getDate()}</div>
                                <div className="dia-eventos">
                                    {eventosDelDia.slice(0, 3).map(evento => (
                                        <div 
                                            key={evento.evento_id}
                                            className={`evento-item ${evento.estado_id?.toLowerCase() || 'sin-estado'}`}
                                            title={`${evento.descripcion} - ${evento.lugar} (${evento.hora_inicio})`}
                                        >
                                            <span className="evento-hora">
                                                {evento.hora_inicio?.substring(0, 5)}
                                            </span>
                                            <span className="evento-titulo">
                                                {evento.descripcion}
                                            </span>
                                        </div>
                                    ))}
                                    {eventosDelDia.length > 3 && (
                                        <div className="eventos-mas">
                                            +{eventosDelDia.length - 3} más
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    const renderAnio = () => {
        const meses = [];
        const hoy = new Date(); // Fecha actual
        
        for (let i = 0; i < 12; i++) {
            const mesFecha = new Date(fechaActual.getFullYear(), i, 1);
            const semanas = getSemanasDelMes(mesFecha);
            
            meses.push(
                <div key={i} className="mes-anio">
                    <h3>{formatearMesAño(mesFecha)}</h3>
                    <div className="semanas-mes">
                        {semanas.map((semana, semanaIndex) => (
                            <div key={semanaIndex} className="semana-anio">
                                {semana.map((dia, diaIndex) => {
                                    const esDiaDelMes = esMesActual(dia, mesFecha);
                                    const esHoyEnEsteMes = esHoy(dia) && esDiaDelMes;
                                    const eventosDelDia = esDiaDelMes ? getEventosPorFecha(eventos, dia) : [];
                                    
                                    return (
                                        <div 
                                            key={diaIndex}
                                            className={`calendario-dia ${
                                                !esDiaDelMes ? 'otro-mes' : ''
                                            } ${
                                                esHoyEnEsteMes ? 'hoy' : ''
                                            }`}
                                        >
                                            <div className="dia-numero">{dia.getDate()}</div>
                                            {esDiaDelMes && (
                                                <div className="dia-eventos">
                                                    {eventosDelDia.slice(0, 2).map(evento => (
                                                        <div 
                                                            key={evento.evento_id}
                                                            className={`evento-item ${evento.estado_id?.toLowerCase() || 'sin-estado'}`}
                                                            title={`${evento.descripcion} - ${evento.lugar} (${evento.hora_inicio})`}
                                                        >
                                                            <span className="evento-hora">
                                                                {evento.hora_inicio?.substring(0, 5)}
                                                            </span>
                                                        </div>
                                                    ))}
                                                    {eventosDelDia.length > 2 && (
                                                        <div className="eventos-mas">
                                                            +{eventosDelDia.length - 2}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
        
        return (
            <div 
                className="anio-grid" 
                onScroll={(e) => setScrollPosition(e.currentTarget.scrollTop)}
                ref={(el) => {
                    if (el) el.scrollTop = scrollPosition;
                }}
            >
                {meses}
            </div>
        );
    };


    return (
        <div className="calendario-eventos">
            {/* Cabecera */}
            <div className="calendario-cabecera">
                <div className="calendario-controles">
                    <QBoton onClick={toggleModo}>
                        {modoAnio ? 'Modo Mes' : 'Modo Año'}
                    </QBoton>
                </div>

                <div className="calendario-navegacion">
                    <QBoton onClick={() => modoAnio ? navegarAnio(-1) : navegarMes(-1)}>
                        <QIcono nombre="atras" />
                    </QBoton>
                    <h2>{modoAnio ? fechaActual.getFullYear() : formatearMesAño(fechaActual)}</h2>
                    <QBoton onClick={() => modoAnio ? navegarAnio(1) : navegarMes(1)}>
                        <QIcono nombre="adelante" />
                    </QBoton>
                </div>
                
                <div className="calendario-controles">
                    <QBoton onClick={irAHoy}>Hoy</QBoton>
                </div>
            </div>

            {/* Calendario */}
            {modoAnio ? renderAnio() : renderMes()}

            {cargando && (
                <div className="calendario-cargando">
                    <QIcono nombre="usuario" />
                    Cargando eventos...
                </div>
            )}
        </div>
    );
};