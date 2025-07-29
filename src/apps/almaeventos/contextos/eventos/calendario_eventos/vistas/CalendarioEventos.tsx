import { useState, useEffect } from "react";
import { QBoton } from "../../../../../../componentes/atomos/qboton.tsx";
import { QIcono } from "../../../../../../componentes/atomos/qicono.tsx";
import { EventoCalendario } from "../diseño.ts";
import { getEventosCalendario } from "../infraestructura.ts";
import { 
    getEventosPorFecha, 
    getDiasDelMes, 
    esHoy, 
    esMesActual, 
    formatearMesAño 
} from "../dominio.ts";
import "./CalendarioEventos.css";

export const CalendarioEventos = () => {
    const [eventos, setEventos] = useState<EventoCalendario[]>([]);
    const [fechaActual, setFechaActual] = useState(new Date());
    const [cargando, setCargando] = useState(false);

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

    const navegarMes = (direccion: number) => {
        const nuevaFecha = new Date(fechaActual);
        nuevaFecha.setMonth(nuevaFecha.getMonth() + direccion);
        setFechaActual(nuevaFecha);
    };

    const irAHoy = () => {
        setFechaActual(new Date());
    };

    const dias = getDiasDelMes(fechaActual);
    const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

    return (
        <div className="calendario-eventos">
            {/* Cabecera */}
            <div className="calendario-cabecera">
                <div className="calendario-navegacion">
                    <QBoton onClick={() => navegarMes(-1)}>
                        <QIcono nombre="cerrar" />
                    </QBoton>
                    <h2>{formatearMesAño(fechaActual)}</h2>
                    <QBoton onClick={() => navegarMes(1)}>
                        <QIcono nombre="cerrar" />
                    </QBoton>
                </div>
                
                <div className="calendario-controles">
                    <QBoton onClick={irAHoy}>Hoy</QBoton>
                </div>
            </div>

            {/* Calendario */}
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

            {cargando && (
                <div className="calendario-cargando">
                    <QIcono nombre="usuario" />
                    Cargando eventos...
                </div>
            )}
        </div>
    );
};