import { useContext } from "react";
import { Detalle } from "../../../../componentes/detalle/Detalle.tsx";
import { CampoFormularioGenerico } from "../../../../componentes/detalle/FormularioGenerico.tsx";
import { Maestro } from "../../../../componentes/maestro/Maestro.tsx";
import { Vista } from "../../../../componentes/vista/Vista.tsx";
import { Contexto } from "../../../comun/contexto.ts";
import { Cliente, ClienteConDirecciones, DireccionCliente } from "../diseño.ts";
import { accionesCliente } from "../infraestructura.ts";

export const MaestroConDetalleCliente = () => {
  const context = useContext(Contexto);
  if (!context) {
    throw new Error("Contexto is null");
  }
  const { seleccionada } = context;

  const titulo = (cliente: Cliente) => cliente.nombre;

  const camposCliente: CampoFormularioGenerico[] = [
    { name: "id", label: "Código", type: "text", hidden: true },
    { name: "nombre", label: "Nombre", type: "text" },
    { name: "id_fiscal", label: "CIF/NIF", type: "text" },
  ];

  const obtenerUno = async () => {
    return seleccionada as ClienteConDirecciones;
  };

  const AccionesClienteMaestroConDetalle = {
    ...accionesCliente,
    obtenerUno,
  };

  const MaestroDirecciones = () => {
    if (!seleccionada) {
      return null;
    }

    const acciones = {
      obtenerTodos: async () =>
        (seleccionada.direcciones ?? []) as DireccionCliente[],
      obtenerUno: async () => ({} as DireccionCliente),
      crearUno: async () => {},
      actualizarUno: async () => {},
      eliminarUno: async () => {},
    };

    return <Maestro acciones={acciones} />;
  };

  return (
    <div className="MaestroConDetalle" style={{ display: "flex", gap: "2rem" }}>
      <div className="Maestro">
        <Maestro acciones={AccionesClienteMaestroConDetalle} />
      </div>
      <div className="Detalle">
        <Detalle
          id={seleccionada?.id ?? "0"}
          camposEntidad={camposCliente}
          acciones={accionesCliente}
          obtenerTitulo={titulo}
        >
          <h2>Direcciones</h2>
          <Vista>
            <MaestroDirecciones slot="contenido" />
          </Vista>
        </Detalle>
      </div>
    </div>
  );
};
