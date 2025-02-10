import { useState } from "react";
import { Maestro } from "../../../../componentes/maestro/Maestro.tsx";
import {
  Entidad,
  MaestroContext,
  type MaestroContextType,
} from "../../../comun/diseño.ts";
import { ClienteConDirecciones } from "../diseño.ts";
import { accionesCliente } from "../infraestructura.ts";

export const MaestroCliente = <T extends Entidad>() => {
  const [entidades, setEntidades] = useState<T[]>([]);
  const [entidadSeleccionada, setEntidadSeleccionada] =
    useState<ClienteConDirecciones | null>(null);

  return (
    <MaestroContext.Provider
      value={
        {
          entidades,
          setEntidades,
          entidadSeleccionada,
          setEntidadSeleccionada,
        } as MaestroContextType<T>
      }
    >
      <Maestro acciones={accionesCliente} />
    </MaestroContext.Provider>
  );
};
