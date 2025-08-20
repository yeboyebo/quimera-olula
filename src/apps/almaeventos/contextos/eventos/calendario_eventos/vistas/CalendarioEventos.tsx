import { useEffect, useState } from "react";
import { QBoton } from "../../../../../../componentes/atomos/qboton.tsx";
import { Calendario } from "../../../../../../componentes/calendario/calendario.tsx";
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

// Define Estado type for use in MaestroEvento
type Estado = "calendario" | "alta";

export const CalendarioEventos = () => {
  const eventosCalendarioData = useLista<EventoCalendario>([]);
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
    },
  };

  const emitir = useMaquina(maquina, estado, setEstado);  

  // console.log('mimensaje_aaaaaaaaaaaaaaaa', eventosCalendarioData);

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
  
  const generarEnlace = () => {
      console.log('mimensaje_generarEnlace_clicked');
  };  

  // Generar enlace a calendario

  return (
    <div className="calendario-eventos">
      <Calendario
        datos={eventosCalendarioData.lista}
        cargando={cargando}
        config={{
          maxDatosVisibles: 3,
          cabecera: {
            botonesIzqModo: [ 
              <QBoton onClick={() => emitir("ALTA_INICIADA")} variante={esMovil ? 'texto' : 'solido'}>UNO</QBoton>,
              <QBoton onClick={() => emitir("ALTA_INICIADA")} variante={esMovil ? 'texto' : 'solido'}>DOS</QBoton>,
            ],            
            botonesDerModo: [ 
              // <MaestroFiltros
              //   campos={camposFiltro}
              //   filtro={filtro}
              //   cambiarFiltro={cambiarFiltro}
              //   borrarFiltro={borrarFiltro}
              //   resetearFiltro={resetearFiltro}
              // />
              <QBoton onClick={() => emitir("ALTA_INICIADA")} variante={esMovil ? 'texto' : 'solido'}>tres</QBoton>,
              <QBoton onClick={() => emitir("ALTA_INICIADA")} variante={esMovil ? 'texto' : 'solido'}>CUATRO</QBoton>,
            ],
            botonesDerHoy: [   
              <QBoton onClick={() => emitir("ALTA_INICIADA")} variante={esMovil ? 'texto' : 'solido'}>Nuevo evento</QBoton>,
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
            onClick={() => window.location.href = `/eventos/calendario/evento/${dato.evento_id}`}
            className="evento-item"
          >
            <div className="texto-multilinea-wrapper">
              <TextoConTooltip texto={`${dato.hora_inicio} - ${dato.descripcion}`} />
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
    </div>
  );
};