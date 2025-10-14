import { QBoton } from "@olula/componentes/index.ts";
import { ContextoError } from "@olula/lib/contexto.ts";
import { Filtro } from "@olula/lib/diseño.ts";
import { HookModelo } from "@olula/lib/useModelo.ts";
import { useContext, useEffect, useState } from "react";
import { Trabajador } from "../../../trabajador/diseño.ts";
import {
  getTrabajador,
  getTrabajadores,
} from "../../../trabajador/infraestructura.ts";
import { TrabajadorEvento } from "../../../trabajador_evento/diseño.ts";
import { nuevoTrabajadorEventoVacio } from "../../../trabajador_evento/dominio.ts";
import {
  deleteTrabajadorEvento,
  getTrabajadoresEvento,
  postTrabajadorEvento,
} from "../../../trabajador_evento/infraestructura.ts";
import { Evento } from "../../diseño.ts";
import "./TabTrabajadores.css";

interface TabTrabajadoresProps {
  evento: HookModelo<Evento>;
  recargarEvento: () => void;
}

export const TabTrabajadores = ({ evento }: TabTrabajadoresProps) => {
  const [trabajadoresData, setTrabajadoresData] = useState<Trabajador[]>([]);
  const [trabajadoresEventoData, setTrabajadoresEventoData] = useState<
    TrabajadorEvento[]
  >([]);
  const { intentar } = useContext(ContextoError);

  useEffect(() => {
    const fetchTrabajadoresEvento = async () => {
      try {
        const trabajadoresEvento = await getTrabajadoresEvento(
          [["codproyecto", "=", evento.modelo.evento_id]],
          ["id", "DESC"],
          { pagina: 1, limite: 100 }
        );
        setTrabajadoresEventoData(trabajadoresEvento?.datos);
        fetchTrabajadores(trabajadoresEvento?.datos);
      } catch (error) {
        console.error("Error al cargar trabajadores del evento:", error);
      }
    };

    const fetchTrabajadores = async (
      trabajadoresEvento: TrabajadorEvento[]
    ) => {
      try {
        const idsAsignados = trabajadoresEvento.map((t) => t.trabajador_id);

        // Necesitamos hacer un casting de tipo porque la estructura del filtro es compleja
        const filtro =
          idsAsignados.length > 0
            ? ([["id", "!in", idsAsignados]] as unknown as Filtro)
            : ([] as unknown as Filtro);

        const trabajadores = await getTrabajadores(filtro, ["id", "DESC"], {
          pagina: 1,
          limite: 100,
        });
        setTrabajadoresData(trabajadores?.datos);
      } catch (error) {
        console.error("Error al cargar trabajadores disponibles:", error);
      }
    };

    fetchTrabajadoresEvento();
  }, [evento.modelo.id, evento.modelo.evento_id]);

  const asignarTrabajador = async (trabajador: Trabajador) => {
    nuevoTrabajadorEventoVacio.trabajador_id = trabajador.id;
    nuevoTrabajadorEventoVacio.nombre = trabajador.nombre;
    nuevoTrabajadorEventoVacio.coste = trabajador.coste;
    nuevoTrabajadorEventoVacio.evento_id = evento.modelo.evento_id;
    nuevoTrabajadorEventoVacio.descripcion = evento.modelo.descripcion || "";
    nuevoTrabajadorEventoVacio.fecha = evento.modelo.fecha_inicio || "";

    const id = await intentar(() =>
      postTrabajadorEvento(nuevoTrabajadorEventoVacio)
    );

    // Actualizar UI sin recargar datos del servidor
    setTrabajadoresEventoData([
      ...trabajadoresEventoData,
      { ...nuevoTrabajadorEventoVacio, id },
    ]);
    setTrabajadoresData(trabajadoresData.filter((t) => t.id !== trabajador.id));
  };

  const quitarTrabajador = async (trabajadorEvento: TrabajadorEvento) => {
    await intentar(() => deleteTrabajadorEvento(trabajadorEvento.id));

    // Actualizar UI sin recargar datos del servidor
    setTrabajadoresEventoData(
      trabajadoresEventoData.filter((t) => t.id !== trabajadorEvento.id)
    );
    const trabajadorQuitado = await getTrabajador(
      trabajadorEvento.trabajador_id
    );
    setTrabajadoresData([...trabajadoresData, trabajadorQuitado]);
  };

  return (
    <div className="TabTrabajadores">
      <quimera-formulario>
        <div className="contenedor-columnas">
          <div className="columna-izquierda">
            <h3>Trabajadores disponibles</h3>
            <div className="listado-trabjadores">
              {trabajadoresData.length > 0 ? (
                <ul className="lista-trabajadores">
                  {trabajadoresData.map((trabajador) => (
                    <li key={trabajador.id} className="trabajador-item">
                      <span className="trabajador-nombre">
                        {trabajador.nombre}
                      </span>
                      <QBoton
                        variante="borde"
                        tamaño="pequeño"
                        onClick={() => asignarTrabajador(trabajador)}
                      >
                        Asignar
                      </QBoton>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No hay trabajadores disponibles</p>
              )}
            </div>
          </div>

          <div className="columna-derecha">
            <h3>Trabajadores asignados</h3>
            <div className="listado-trabjadores">
              {trabajadoresEventoData.length > 0 ? (
                <ul className="lista-trabajadores">
                  {trabajadoresEventoData.map((trabajadorEvento) => (
                    <li key={trabajadorEvento.id} className="trabajador-item">
                      <span className="trabajador-nombre">
                        {trabajadorEvento.nombre}
                      </span>
                      <QBoton
                        variante="borde"
                        tamaño="pequeño"
                        destructivo
                        onClick={() => quitarTrabajador(trabajadorEvento)}
                      >
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
        </div>
      </quimera-formulario>
    </div>
  );
};
