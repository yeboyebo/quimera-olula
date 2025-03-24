import { useState } from "react";
import { Listado } from "../../../../componentes/maestro/Listado.tsx";
import { Entidad } from "../../../../contextos/comun/diseño.ts";
import { actualizarEntidadEnLista } from "../../../comun/dominio.ts";
import { Cliente } from "../diseño.ts";
import { getClientes } from "../infraestructura.ts";
import { DetalleCliente } from "./DetalleCliente.tsx";

const metaTablaCliente = [
  { id: "id", cabecera: "Id" },
  { id: "nombre", cabecera: "Nombre" },
  { id: "id_fiscal", cabecera: "Id Fiscal", render: (entidad: Entidad) => `${entidad.tipo_id_fiscal}: ${entidad.id_fiscal}` },
]

export const MaestroConDetalleCliente = () => {
 
  const [entidades, setEntidades] = useState<Cliente[]>([]);
  const [seleccionada, setSeleccionada] = useState<Cliente | null>(null);

  const actualizarEntidad = (entidad: Cliente) => {
    setEntidades(actualizarEntidadEnLista<Cliente>(entidades, entidad));
  };
  
  return (
    <>
      <div
        className="Maestro"
        style={{
          width: "50%",
          overflowX: "hidden",
        }}
      >
        <h2>Clientes</h2>
        <Listado
          metaTabla={metaTablaCliente}
          entidades={entidades}
          setEntidades={setEntidades}
          seleccionada={seleccionada}
          setSeleccionada={setSeleccionada}
          cargar={getClientes}
        />
      </div>
      <div className="Detalle" style={{ width: "50%", overflowX: "hidden" }}>
        <DetalleCliente
          clienteInicial={seleccionada}
          onEntidadActualizada={actualizarEntidad}
        />
      </div>
    </>
  );
};
