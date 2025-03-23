import { useState } from "react";
import { Listado } from "../../../../componentes/maestro/Listado.tsx";
import { Entidad } from "../../../comun/diseño.ts";
import { Contexto, ContextoSet } from "../contexto.ts";
import { Presupuesto } from "../diseño.ts";
import {
  getPresupuestos
} from "../infraestructura.ts";
import { DetallePresupuesto } from "./DetallePresupuesto.tsx";

const metaTablaPresupuesto = [
  { id: "codigo", cabecera: "Código", render: (entidad: Entidad) => entidad.codigo },
  { id: "cliente", cabecera: "Cliente", render: (entidad: Entidad) => entidad.nombre_cliente },
  { id: "total", cabecera: "Total", render: (entidad: Entidad) => entidad.total },
]


export const MaestroConDetallePresupuesto = () => {
  // const context = useContext(Contexto);
  // if (!context) {
  //   throw new Error("Contexto is null");
  // }
  const [entidades, setEntidades] = useState<Presupuesto[]>([]);
  const [seleccionada, setSeleccionada] = useState<Presupuesto | null>(null);

  const actualizarEntidad = (entidad: Presupuesto) => {
    setEntidades((entidades) => {
      const index = entidades.findIndex((e) => e.id === entidad.id);
      if (index === -1) {
        return [...entidades, entidad];
      }
      return entidades.map((e) => (e.id === entidad.id ? entidad : e));
    });
  };
  

  // console.log("Seleccionada presup id", seleccionada?.id);

  // useEffect(
  //   () => {
  //     setSeleccionada(null);
  //     setEntidades([]);
  //     return () => {
  //       setEntidades([]);
  //       setSeleccionada(null);
  //     }
  //   }
  //   , []
    
  // );

  // const titulo = (presupuesto: Entidad) =>
  //   (presupuesto as Presupuesto).codigo as string;

  // const onCrearPresupuesto = async (
  //   presupuesto: Partial<Presupuesto>
  // ): Promise<void> => {
  //   const objPresupuestoNuevo = {
  //     cliente: {
  //       cliente_id: presupuesto.cliente_id,
  //       direccion_id: presupuesto.direccion_id,
  //     },
  //     empresa_id: presupuesto.empresa_id,
  //   };
  //   accionesPresupuesto.crearUno(objPresupuestoNuevo).then(() => {
  //     accionesPresupuesto.obtenerTodos().then((presupuestos) => {
  //       setEntidades(presupuestos);
  //     });
  //   });
  // };
  // console.log("Entidades", entidades);

  return (
    <div className="MaestroConDetalle" style={{ display: "flex", gap: "2rem" }}>
      <Contexto.Provider
        value={{
          entidades,
          setEntidades: setEntidades as ContextoSet<Presupuesto[]>,
          seleccionada,
          setSeleccionada: setSeleccionada as ContextoSet<Presupuesto | null>,
        }}
      >
        <div className="Maestro" style={{ flexBasis: "50%", overflow: "auto" }}>
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
            onEntidadActualizada={actualizarEntidad}
          />
          {/* <DetalleCliente onEntidadActualizada={actualizarEntidad}/> */}
        </div>
      </Contexto.Provider>
    </div>
  );
};
