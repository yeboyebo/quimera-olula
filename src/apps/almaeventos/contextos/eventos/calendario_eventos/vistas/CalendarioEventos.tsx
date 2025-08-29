import { useEffect, useState } from "react";
import { QBoton } from "../../../../../../componentes/atomos/qboton.tsx";
import { Calendario } from "../../../../../../componentes/calendario/calendario.tsx";
import { MaestroFiltros } from "../../../../../../componentes/maestro/maestroFiltros/MaestroFiltros.tsx";
import { useEsMovil } from "../../../../../../componentes/maestro/useEsMovil.ts";
import { QModal } from "../../../../../../componentes/moleculas/qmodal.tsx";
import { Filtro } from "../../../../../../contextos/comun/diseño.ts";
import { useLista } from "../../../../../../contextos/comun/useLista.ts";
import { Maquina, useMaquina } from "../../../../../../contextos/comun/useMaquina.ts";
import { TextoConTooltip } from "../../../comun/componentes/TextoConTooltip/TextoConTooltip.tsx";
import { AltaEvento } from "../../evento/vistas/AltaEvento.tsx";
import { EventoCalendario } from "../diseño.ts";
import { getEventosCalendario } from "../infraestructura.ts";
import "./CalendarioEventos.css";
import { FichaEventoAbierto } from "./FichaEventoAbierto.tsx";

// Define Estado type for use in MaestroEvento
type Estado = "calendario" | "alta" | "evento_abierto";

export const CalendarioEventos = () => {
  const eventosCalendarioData = useLista<EventoCalendario>([]);
  const [eventoAbierto, setEventoAbierto] = useState<EventoCalendario | null>(null);
  const [cargando, setCargando] = useState(false);
  const [filtro, setFiltro] = useState<Filtro>([]);
  const [estado, setEstado] = useState<Estado>("calendario");
  const esMovil = useEsMovil(640);
  const camposFiltro = ["descripcionref","referencia"];

  // Cargar eventos al montar el componente
  useEffect(() => {
    const fetchEventosCalendario = async () => {
      setCargando(true);
      const eventos = await getEventosCalendario(filtro, []);
      eventosCalendarioData.setLista(eventos); // Call the setLista method on the correct object
      setCargando(false);
    };
    fetchEventosCalendario();
  }, [filtro]);


  // Definir la máquina de estados
  const maquina: Maquina<Estado> = {
    alta: {
      EVENTO_CREADO: (payload: unknown) => {
        const evento = payload as EventoCalendario;        
        const eventoProcesado = {
          ...evento,
          fecha: evento.fecha_inicio
        }
        eventosCalendarioData.añadir(eventoProcesado);
        return "calendario";
      },
      ALTA_CANCELADA: "calendario",
    },
    calendario: {
      ALTA_INICIADA: "alta",
      ABRIR_EVENTO: (payload: unknown) => {
        const evento = payload as EventoCalendario;   
        setEventoAbierto(evento);     
        return "evento_abierto";
      },
    },
    evento_abierto: {
      EVENTO_CERRADO: () => {
        setEventoAbierto(null);
        return "calendario"
      }
    }
  };

  const emitir = useMaquina(maquina, estado, setEstado);

  const cambiarFiltro = (clave: string, valor: string, operador = "~") => {
    setFiltro((prev) => [
      ...prev.filter(([k]) => k !== clave),
      [clave, operador, valor],
    ]);
  };
  const borrarFiltro = (clave: string) => {
    setFiltro((prev) => prev.filter(([k]) => k !== clave));
  };
  const resetearFiltro = () => setFiltro([]);

  // Generar enlace a calendario

  return (
    <div className="calendario-eventos">
      <Calendario
        datos={eventosCalendarioData.lista}
        cargando={cargando}
        config={{
          // inicioSemana: "domingo",
          maxDatosVisibles: 5,
          teclado: {
            atajos: {
              nuevo: 'n',      // Atajo personalizado para crear evento
            },
            onAccion: (accion) => {
              if (accion === 'nuevo') {
                emitir("ALTA_INICIADA");
              }
              // Se pueden añadir más acciones personalizadas aquí
            }
          },
          cabecera: {        
            botonesDerModo: !esMovil ? [ 
              <MaestroFiltros
                key="filtros"
                campos={camposFiltro}
                filtro={filtro}
                cambiarFiltro={cambiarFiltro}
                borrarFiltro={borrarFiltro}
                resetearFiltro={resetearFiltro}
              />
            ] : [],
            botonesDerHoy: [   
              <QBoton key="nuevo-evento" onClick={() => emitir("ALTA_INICIADA")} variante={esMovil ? 'texto' : 'solido'}>Nuevo evento</QBoton>,
              // <BotonConTooltip tooltip="Generar enlace a calendario" tamaño={"pequeño"} onClick={generarEnlace}> 
              //   <QIcono nombre={"copiar"} tamaño={"sm"} color={"white"} style={{margin: '4px'}}/>
              // </BotonConTooltip>
            ],
            // mostrarBotonHoy: false,
            // mostrarCambioModo: false,
            // modoCalendario: 'anio'
          }
        }}
        renderDato={(dato: EventoCalendario) => (
          <div
            // onClick={() => window.location.href = `/eventos/calendario/evento/${dato.evento_id}`}
            onClick={() => emitir("ABRIR_EVENTO", dato)}
            className="evento-item"
          >
            <div className="texto-multilinea-wrapper">
              <TextoConTooltip texto={`${dato.hora_inicio ? `${dato.hora_inicio} - ` : ""}${dato.descripcion}`} />
            </div>
          </div>
        )}
      />
      <QModal
        nombre="modal"
        abierto={estado === "alta"}
        onCerrar={() => emitir("ALTA_CANCELADA")}
      >
        <AltaEvento emitir={emitir} />
      </QModal>

      <QModal
        nombre="fichaEvento"
        abierto={estado === "evento_abierto"}
        onCerrar={() => emitir("EVENTO_CERRADO")}
      >
        {eventoAbierto && <FichaEventoAbierto evento={eventoAbierto} />}
      </QModal>
    </div>
  );
};