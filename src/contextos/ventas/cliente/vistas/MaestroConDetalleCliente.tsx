import { useState } from "react";
import { Listado } from "../../../../componentes/maestro/Listado.tsx";
import { Entidad } from "../../../../contextos/comun/diseño.ts";
import { Contexto, ContextoSet } from "../contexto.ts";
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
    setEntidades((entidades) => {
      const index = entidades.findIndex((e) => e.id === entidad.id);
      if (index === -1) {
        return [...entidades, entidad];
      }
      return entidades.map((e) => (e.id === entidad.id ? entidad : e));
    });
  };

  return (
    <Contexto.Provider
          value={{
            entidades,
            setEntidades: setEntidades as ContextoSet<Cliente[]>,
            seleccionada,
            setSeleccionada: setSeleccionada as ContextoSet<Cliente | null>,
          }}
        >
      <div
        className="Maestro"
        style={{
          width: "50%",
          overflowX: "hidden",
        }}
      >
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
        <DetalleCliente onEntidadActualizada={actualizarEntidad}/>
      </div>
    </Contexto.Provider>
  );
};
