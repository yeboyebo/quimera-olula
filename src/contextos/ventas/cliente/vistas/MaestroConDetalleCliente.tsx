import { useState } from "react";
import { Maestro } from "../../../../componentes/maestro/Maestro.tsx";
import { Entidad } from "../../../../contextos/comun/diseño.ts";
import { Contexto, ContextoSet } from "../contexto.ts";

import { accionesCliente, camposCliente } from "../infraestructura.ts";
import { DetalleCliente } from "./DetalleCliente.tsx";

export const MaestroConDetalleCliente = <T extends Entidad>() => {
  
  // const context = useContext(Contexto);
  // if (!context) {
  //   throw new Error("Contexto is null");
  // }

  // const { setSeleccionada, seleccionada, setEntidades } = context;

  // console.log("Seleccionada cliente id", seleccionada?.id);
 
  const [entidades, setEntidades] = useState<T[]>([]);
  const [seleccionada, setSeleccionada] = useState<T | null>(null);
  
  console.log("MaestroConDetalleCliente", entidades, seleccionada);

  // useEffect(
  //   () => {
  //     setSeleccionada(null);
  //     setEntidades([]);
  //     return () => {
  //       setEntidades([]);
  //       setSeleccionada(null);
  //       console.log("Cliente cleanup");
  //     }
  //   }
  //   , []
  // );
  const actualizarEntidad = (entidad: T) => {
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
            setEntidades: setEntidades as ContextoSet<Entidad[]>,
            seleccionada,
            setSeleccionada: setSeleccionada as ContextoSet<Entidad | null>,
          }}
        >
      <div
        className="Maestro"
        style={{
          width: "50%",
          overflowX: "hidden",
        }}
      >
        {/* entidades, setEntidades, seleccionada, setSeleccionada */}
        <Maestro
          acciones={accionesCliente}
          camposEntidad={camposCliente}
          entidades={entidades}
          setEntidades={setEntidades}
          seleccionada={seleccionada}
          setSeleccionada={setSeleccionada}
        />
      </div>
      <div className="Detalle" style={{ width: "50%", overflowX: "hidden" }}>
        <DetalleCliente onEntidadActualizada={actualizarEntidad}/>
      </div>
    </Contexto.Provider>
  );
};
