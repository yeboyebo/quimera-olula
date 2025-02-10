import { useState } from "react";
import { Detalle } from "../../../../componentes/detalle/Detalle.tsx";
import { CampoFormularioGenerico } from "../../../../componentes/detalle/FormularioGenerico.tsx";
import { Maestro } from "../../../../componentes/maestro/Maestro.tsx";
import {
  Entidad,
  MaestroContext,
  type MaestroContextType,
} from "../../../comun/diseño.ts";
import { DireccionesCliente } from "../direcciones/DireccionesCliente.tsx";
import { Cliente, ClienteConDirecciones } from "../diseño.ts";
import { accionesCliente } from "../infraestructura.ts";

export const MaestroConDetalleCliente = <T extends Entidad>() => {
  const [entidades, setEntidades] = useState<T[]>([]);
  const [entidadSeleccionada, setEntidadSeleccionada] =
    useState<ClienteConDirecciones | null>(null);
  const titulo = (cliente: Cliente) => cliente.nombre;

  const camposCliente: CampoFormularioGenerico[] = [
    { name: "id", label: "Código", type: "text", hidden: true },
    { name: "nombre", label: "Nombre", type: "text" },
    { name: "id_fiscal", label: "CIF/NIF", type: "text" },
  ];

  const obtenerUno = async (
    id: string
  ): Promise<ClienteConDirecciones | null> => {
    if (!id || id === "0") {
      return entidadSeleccionada as ClienteConDirecciones;
    }
    return accionesCliente.obtenerUno(id);
  };
  const seleccionarEntidad = (e: Entidad) => {
    setEntidadSeleccionada(e as ClienteConDirecciones);
  };

  const AccionesClienteMaestroConDetalle = {
    ...accionesCliente,
    obtenerUno,
    seleccionarEntidad,
  };

  const MaestroDirecciones = () => {
    if (!entidadSeleccionada) {
      return null;
    }
    return <DireccionesCliente codCliente={entidadSeleccionada.id!} />;
  };

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
      <div className="MaestroConDetalle">
        <div className="Maestro" style={{ width: "50%", float: "left" }}>
          <Maestro acciones={AccionesClienteMaestroConDetalle} />
        </div>
        <div
          className="Detalle"
          style={{
            width: "calc( 50% - 10px)",
            float: "left",
            paddingLeft: "10px",
          }}
        >
          <Detalle
            acciones={AccionesClienteMaestroConDetalle}
            obtenerTitulo={titulo}
            camposEntidad={camposCliente}
          />
          <MaestroDirecciones />
        </div>
      </div>
    </MaestroContext.Provider>
  );
};
