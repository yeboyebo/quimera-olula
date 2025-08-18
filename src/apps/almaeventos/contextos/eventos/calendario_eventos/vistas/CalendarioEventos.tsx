import { useEffect, useState } from "react";
import { QBoton } from "../../../../../../componentes/atomos/qboton.tsx";
import { QIcono } from "../../../../../../componentes/atomos/qicono.tsx";
import { Calendario } from "../../../../../../componentes/calendario/calendario.tsx";
import { MaestroFiltros } from "../../../../../../componentes/maestro/maestroFiltros/MaestroFiltros.tsx";
import { Filtro } from "../../../../../../contextos/comun/diseño.ts";
import { useLista } from "../../../../../../contextos/comun/useLista.ts";
import { BotonConTooltip } from "../../../comun/componentes/BotonConTooltip/BotonConTooltip.tsx";
import { TextoConTooltip } from "../../../comun/componentes/TextoConTooltip/TextoConTooltip.tsx";
import { EventoCalendario } from "../diseño.ts";
import { getEventosCalendario } from "../infraestructura.ts";
import "./CalendarioEventos.css";


export const CalendarioEventos = () => {
  const eventosCalendarioData = useLista<EventoCalendario>([]);
  const [cargando, setCargando] = useState(false);
  const [filtro, setFiltro] = useState<Filtro>([]);
  const camposFiltro = ["descripcionref"];

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
  
  const altaEvento = () => {
      console.log('mimensaje_altaEvento_clicked');
  };

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
            botonesDerModo: [ 
              <MaestroFiltros
                campos={camposFiltro}
                filtro={filtro}
                cambiarFiltro={cambiarFiltro}
                borrarFiltro={borrarFiltro}
                resetearFiltro={resetearFiltro}
              />
            ],
            botonesDerHoy: [   
              <QBoton onClick={altaEvento}>Nuevo evento</QBoton>,
              <BotonConTooltip tooltip="Generar enlace a calendario" tamaño={"pequeño"} onClick={generarEnlace}> 
                <QIcono nombre={"copiar"} tamaño={"sm"} color={"white"} style={{margin: '4px'}}/>
              </BotonConTooltip>
            ],
            // mostrarBotonHoy: false,
            // mostrarCambioModo: false,
            // modoCalendario: 'anio'
          }
        }}    
        // ¿filtro?    
        renderDato={(dato: EventoCalendario) => (
          <div 
            onClick={() => window.location.href = `/eventos/evento/${dato.evento_id}`}
            className="evento-item"
          >
            <div className="texto-multilinea-wrapper">
              <TextoConTooltip texto={`${dato.hora_inicio} - ${dato.descripcion}`} />
            </div>
          </div>
        )}
      />
    </div>
  );
};