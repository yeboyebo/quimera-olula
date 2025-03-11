import { useContext, useState } from "react";
import {
  CampoFormularioGenerico,
  FormularioGenerico,
} from "../../../../componentes/detalle/FormularioGenerico.tsx";
import { Contexto } from "../../../../contextos/comun/contexto.ts";
import { Acciones, Entidad } from "../../../../contextos/comun/diseño.ts";
import { LineaPresupuesto } from "../../presupuesto/diseño.ts";

type MaestroProps<T extends Entidad> = {
  acciones: Acciones<T>;
  camposEntidad: CampoFormularioGenerico[];
};
export const MaestroAccionesLineasPresupuesto = ({
  acciones,
  camposEntidad,
}: MaestroProps<LineaPresupuesto>) => {
  const { actualizarUno, crearUno, obtenerTodos, obtenerUno, eliminarUno } =
    acciones;

  const context = useContext(Contexto);
  if (!context) {
    throw new Error("Contexto es nulo");
  }
  const { entidades, setEntidades, seleccionada } = context;
  const [mostrarModal, setMostrarModal] = useState(false);
  const [entidad, setEntidad] = useState<LineaPresupuesto>(
    {} as LineaPresupuesto
  );

  const buscarPorId = (id: string) => {
    return entidades.find((entidad) => entidad.id === id);
  };

  const actualizarLineaPresupuesto = (lineaPresupuesto: LineaPresupuesto) => {
    setEntidades(
      entidades.map((entidad) => {
        if (entidad.id === lineaPresupuesto.id) {
          return lineaPresupuesto;
        }
        return entidad;
      })
    );
  };

  const quitarLineaPresupuesto = (lineaPresupuestoId: string) => {
    setEntidades(
      entidades.filter((entidad) => entidad.id !== lineaPresupuestoId)
    );
  };

  const onCrearLineaPresupuesto = () => {
    const lineaPresupuesto: LineaPresupuesto = lineaPresupuestoEjemplo;

    crearUno(lineaPresupuesto).then(() => {
      obtenerTodos().then((lineasPresupuesto) => {
        setEntidades(lineasPresupuesto);
      });
    });
  };

  const onCambiarLineaPresupuesto = () => {
    if (!seleccionada) {
      return;
    }
    const original = buscarPorId(seleccionada.id) as LineaPresupuesto;
    const cambiada = hacerCambioLineaPresupuesto(original);

    actualizarUno(cambiada.id, cambiada).then(() => {
      obtenerUno(cambiada.id).then((lineaPresupuesto) => {
        actualizarLineaPresupuesto(
          lineaPresupuesto as unknown as LineaPresupuesto
        );
      });
    });
  };

  const onBorrarLineaPresupuesto = () => {
    if (!seleccionada) {
      return;
    }
    const lineaPresupuestoId = seleccionada.id;

    eliminarUno(lineaPresupuestoId).then(() => {
      quitarLineaPresupuesto(lineaPresupuestoId);
    });
  };

  const abrirModal = () => {
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
  };

  const handleCrearLineaPresupuesto = async (
    id: string,
    data: LineaPresupuesto
  ) => {
    if (!id) {
      // Si no hay id, creamos una nueva línea de presupuesto
      crearUno(data).then(() => {
        obtenerTodos().then((lineasPresupuesto) => {
          setEntidades(lineasPresupuesto);
        });
      });
    }
    cerrarModal();
  };

  return (
    <div className="MaestroAcciones">
      <button onClick={onCrearLineaPresupuesto}>Crear</button>
      {mostrarModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={cerrarModal}>
              &times;
            </span>
            <FormularioGenerico
              campos={camposEntidad}
              entidad={entidad}
              setEntidad={setEntidad}
              onSubmit={handleCrearLineaPresupuesto}
            />
          </div>
        </div>
      )}
      <button onClick={abrirModal}>Crear Línea de Presupuesto</button>
      <button onClick={onCambiarLineaPresupuesto}>Cambiar</button>
      <button onClick={onBorrarLineaPresupuesto}>Borrar</button>
    </div>
  );
};

const lineaPresupuestoEjemplo = {
  id: "0",
  descripcion: "Línea de Presupuesto Ejemplo",
  cantidad: 1,
  precio: 100,
  referencia: "REF-001",
  pvp_unitario: 100,
  pvp_total: 100,
  // Otros campos específicos de LineaPresupuesto
};

const hacerCambioLineaPresupuesto = (lineaPresupuesto: LineaPresupuesto) => {
  return {
    ...lineaPresupuesto,
    descripcion: lineaPresupuesto.descripcion + "!",
  };
};
