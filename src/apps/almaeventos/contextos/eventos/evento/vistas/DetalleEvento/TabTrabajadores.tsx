import { useContext, useEffect, useState } from "react";
import { QBoton } from "../../../../../../../componentes/atomos/qboton.tsx";
import { ContextoError } from "../../../../../../../contextos/comun/contexto.ts";
import { Filtro } from "../../../../../../../contextos/comun/diseño.ts";
import { HookModelo } from "../../../../../../../contextos/comun/useModelo.ts";
import { Trabajador } from "../../../trabajador/diseño.ts";
import { getTrabajadores } from "../../../trabajador/infraestructura.ts";
import { TrabajadorEvento } from "../../../trabajador_evento/diseño.ts";
import { nuevoTrabajadorEventoVacio } from "../../../trabajador_evento/dominio.ts";
import { getTrabajadoresEvento, postTrabajadorEvento } from "../../../trabajador_evento/infraestructura.ts";
import { Evento } from "../../diseño.ts";
import "./TabTrabajadores.css";

interface TabTrabajadoresProps {
  evento: HookModelo<Evento>;
  recargarEvento: () => void;
}

export const TabTrabajadores = ({ evento }: TabTrabajadoresProps) => {
  const { uiProps } = evento;
  const [trabajadoresData, setTrabajadoresData] = useState<Trabajador[]>([]);
  const [trabajadoresEventoData, setTrabajadoresEventoData] = useState<TrabajadorEvento[]>([]);
  const { intentar } = useContext(ContextoError);

  useEffect(() => {
    const fetchTrabajadoresEvento = async () => {
      try {
        const trabajadoresEvento = await getTrabajadoresEvento([["codproyecto", "=", evento.modelo.id]], ["id", "DESC"]);
        setTrabajadoresEventoData(trabajadoresEvento);
        fetchTrabajadores(trabajadoresEvento);
      } catch (error) {
        console.error("Error al cargar trabajadores del evento:", error);
      }
    };    
    
    const fetchTrabajadores = async (trabajadoresEvento: TrabajadorEvento[]) => {
      try {
        // Extraer los IDs de trabajadores ya asignados al evento
        const idsAsignados = trabajadoresEvento.map(t => t.trabajador_id);
        
        // Para filtros NOT IN, necesitamos crear un array anidado con la condición
        // El formato correcto es [["campo", "operador", valor]]
        // Usamos as unknown as Filtro para hacer el casting de tipo
        const filtro = idsAsignados.length > 0 ? 
          [["id", "!in", idsAsignados]] as unknown as Filtro : 
          [] as unknown as Filtro;
        
        console.log('Filtro aplicado:', filtro);
        
        const trabajadores = await getTrabajadores(filtro, ["id", "DESC"]);
        setTrabajadoresData(trabajadores);
      } catch (error) {
        console.error("Error al cargar trabajadores disponibles:", error);
      }
    };
    
    fetchTrabajadoresEvento();
  }, [evento.modelo.id]);

  const asignarTrabajador = async (trabajador: Trabajador) => {
    nuevoTrabajadorEventoVacio.trabajador_id = trabajador.id
    nuevoTrabajadorEventoVacio.nombre = trabajador.nombre
    nuevoTrabajadorEventoVacio.coste = trabajador.coste
    nuevoTrabajadorEventoVacio.evento_id = evento.modelo.id
    nuevoTrabajadorEventoVacio.descripcion = evento.modelo.descripcion || ''
    nuevoTrabajadorEventoVacio.fecha = evento.modelo.fecha_inicio || ''
    
    const id = await intentar(() => postTrabajadorEvento(nuevoTrabajadorEventoVacio));
    
    // Crear una copia del array y añadir el nuevo elemento
    setTrabajadoresEventoData([...trabajadoresEventoData, {...nuevoTrabajadorEventoVacio, id}]);
    
    // Actualizar la lista de trabajadores disponibles
    const nuevaTrabajadoresData = trabajadoresData.filter(t => t.id !== trabajador.id);
    setTrabajadoresData(nuevaTrabajadoresData);
  };    

  const quitarTrabajador = async () => {
    // const id = await intentar(() => postEvento(nuevoEvento.modelo));
    // nuevoEvento.init(nuevoEventoVacio);
    // const EventoCreado = await getEvento(id);
    // emitir("EVENTO_CREADO", EventoCreado);
  };  
  
  return (
    <div className="TabTrabajadores">
      <quimera-formulario>
        <div className="contenedor-columnas">
          <div className="columna-izquierda">
            <h3>Trabajadores disponibles</h3>
            {trabajadoresData.length > 0 ? (
              <ul className="lista-trabajadores">
                {trabajadoresData.map(trabajador => (
                  <li key={trabajador.id} className="trabajador-item">
                    <span>{trabajador.nombre}</span>
                    <QBoton variante="borde" tamaño="pequeño" onClick={() => asignarTrabajador(trabajador)} >
                      Asignar
                    </QBoton>                    
                  </li>
                ))}
              </ul>
            ) : (
              <p>No hay trabajadores disponibles</p>
            )}
          </div>
          
          <div className="columna-derecha">
            <h3>Trabajadores asignados</h3>
            {trabajadoresEventoData.length > 0 ? (
              <ul className="lista-trabajadores">
                {trabajadoresEventoData.map(trabajadorEvento => (
                  <li key={trabajadorEvento.id} className="trabajador-item">
                    <span>{trabajadorEvento.nombre}</span>
                    <QBoton variante="borde" tamaño="pequeño" destructivo onClick={quitarTrabajador} >
                      Quitar
                    </QBoton>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No hay trabajadores asignados a este evento</p>
            )}
          </div>
        </div>
      </quimera-formulario>
    </div>
  );
};