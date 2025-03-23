import { useState } from "react";
import { Listado } from "../../../../componentes/maestro/Listado.tsx";
import { Entidad } from "../../../comun/diseño.ts";
import { actualizarEntidadEnLista } from "../../../comun/dominio.ts";
import { Presupuesto } from "../diseño.ts";
import { getPresupuestos } from "../infraestructura.ts";
import { DetallePresupuesto } from "./DetallePresupuesto.tsx";

const metaTablaPresupuesto = [
  { id: "codigo", cabecera: "Código", render: (entidad: Entidad) => entidad.codigo },
  { id: "cliente", cabecera: "Cliente", render: (entidad: Entidad) => entidad.nombre_cliente },
  { id: "total", cabecera: "Total", render: (entidad: Entidad) => entidad.total },
]

export const MaestroConDetallePresupuesto = () => {

  const [entidades, setEntidades] = useState<Presupuesto[]>([]);
  const [seleccionada, setSeleccionada] = useState<Presupuesto | null>(null);

  const actualizarEntidad = (entidad: Presupuesto) => {
    setEntidades(actualizarEntidadEnLista<Presupuesto>(entidades, entidad));
  };
  

  return (
    <div className="MaestroConDetalle" style={{ display: "flex", gap: "2rem" }}>
      <div className="Maestro" style={{ flexBasis: "50%", overflow: "auto" }}>
          <h2>Presupuestos</h2>
          <Listado
            metaTabla={metaTablaPresupuesto}
            entidades={entidades}
            setEntidades={setEntidades}
            seleccionada={seleccionada}
            setSeleccionada={setSeleccionada}
            cargar={getPresupuestos}
          />
      </div>
      <div className="Detalle" style={{ flexBasis: "50%", overflow: "auto" }}>
        <DetallePresupuesto
          presupuestoInicial={seleccionada}
          onEntidadActualizada={actualizarEntidad}
        />
      </div>
    </div>
  );
};
