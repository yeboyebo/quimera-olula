import { useContext, useState } from "react";
import {
  CampoFormularioGenerico,
  FormularioGenerico,
} from "../../../../componentes/detalle/FormularioGenerico.tsx";
import { Contexto } from "../../../../contextos/comun/contexto.ts";
import {
  AccionesLineaPresupuesto,
  LineaPresupuesto,
} from "../../presupuesto/diseño.ts";
import { useAccionesLineaPresupuesto } from "./accionesLineaPresupuesto.ts";

type MaestroAccionesLineasPresupuestoProps = {
  acciones: AccionesLineaPresupuesto;
  camposEntidad: CampoFormularioGenerico[];
};

export const MaestroAccionesLineasPresupuesto = ({
  acciones,
  camposEntidad,
}: MaestroAccionesLineasPresupuestoProps) => {
  const context = useContext(Contexto);
  if (!context) {
    throw new Error("Contexto es nulo");
  }

  const [mostrarModal, setMostrarModal] = useState(false);
  const [entidad, setEntidad] = useState<LineaPresupuesto>(
    {} as LineaPresupuesto
  );

  const {
    onCambiarLineaPresupuesto,
    onCambiarCantidadLineaPresupuesto,
    onBorrarLineaPresupuesto,
    handleCrearLineaPresupuesto,
  } = useAccionesLineaPresupuesto(acciones);

  const abrirModal = () => {
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
  };

  return (
    <div className="MaestroAcciones">
      <button onClick={onBorrarLineaPresupuesto}>Borrar</button>
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
      <button onClick={onCambiarCantidadLineaPresupuesto}>Suma cantidad</button>
      <button onClick={onCambiarLineaPresupuesto}>Editar</button>
    </div>
  );
};
