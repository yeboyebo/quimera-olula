import { PropsWithChildren, useState } from "react";
// import { Contexto, ContextoSet } from "../../contextos/comun/contexto.ts";
import { Outlet } from "react-router";
import {
  ContextoError,
  Intentar,
  QError,
} from "../../contextos/comun/contexto.ts";

// import { Entidad } from "../../contextos/comun/diseño.ts";
import { QModal } from "../moleculas/qmodal.tsx";
import { Plantilla } from "../plantilla/Plantilla.tsx";
import { Slot } from "../slot/Slot.tsx";

export const Vista = ({ children }: PropsWithChildren<object>) => {
  const slots = { hijos: children };
  const [error, setError] = useState<QError | null>(null);

  // async function intentar<Out>(f: () => Out, setError: (error: QError) => void): Promise<Out> {
  //   try {
  //     const result = await f();
  //     return result;
  //   } catch (error) {
  //     setError(error as QError);
  //     throw error;
  //   }
  // }
  const intentar: Intentar = async (f) => {
    try {
      const result = await f();
      return result;
    } catch (error) {
      const apiError = error as QError;
      setError({
        nombre: apiError.nombre,
        descripcion: apiError.descripcion,
      });
      throw error;
    }
  };

  const contenido = children ?? <Outlet />;

  return (
    <ContextoError.Provider value={{ error, setError, intentar }}>
      <Slot nombre="contenido" {...slots}>
        <Plantilla>{contenido}</Plantilla>
      </Slot>
      <QModal
        nombre="error"
        abierto={error !== null}
        onCerrar={() => setError(null)}
      >
        <div>
          <h2>{error?.nombre}</h2>
          <p>{error?.descripcion}</p>
        </div>
      </QModal>
    </ContextoError.Provider>
  );
};

// export const SubVista = <T extends Entidad>({
//   children,
// }: PropsWithChildren<object>) => {
//   // const slots = { hijos: children };

//   const [entidades, setEntidades] = useState<T[]>([]);
//   const [seleccionada, setSeleccionada] = useState<T | null>(null);

//   return (
//     <Contexto.Provider
//       value={{
//         entidades,
//         setEntidades: setEntidades as ContextoSet<Entidad[]>,
//         seleccionada,
//         setSeleccionada: setSeleccionada as ContextoSet<Entidad | null>,
//       }}
//     >
//       {children}
//     </Contexto.Provider>
//   );
// };
