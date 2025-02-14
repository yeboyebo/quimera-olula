import { useContext } from "react";
import { Detalle } from "../../../../componentes/detalle/Detalle.tsx";
import { CampoFormularioGenerico } from "../../../../componentes/detalle/FormularioGenerico.tsx";
import { Maestro } from "../../../../componentes/maestro/Maestro.tsx";
import { Contexto } from "../../../comun/contexto.ts";
import { Cliente, ClienteConDirecciones } from "../diseño.ts";
import {
  accionesCliente
} from "../infraestructura.ts";
import { MaestroDirecciones } from "./MaestroDirecciones.tsx";

export const MaestroConDetalleCliente = () => {
  const context = useContext(Contexto);
  if (!context) {
    throw new Error("Contexto is null");
  }
  const { seleccionada, entidades, setEntidades } = context;

  const titulo = (cliente: Cliente) => cliente.nombre;

  const camposCliente: CampoFormularioGenerico[] = [
    { name: "id", label: "Código", type: "text", hidden: true },
    { name: "nombre", label: "Nombre", type: "text" },
    { name: "id_fiscal", label: "CIF/NIF", type: "text" },
  ];

  const actualizarCliente = (cliente: Cliente) => {
    setEntidades([
      ...entidades.map((c) => c.id !== cliente.id ? c : cliente),
    ])
  }

  const obtenerUno = async () => {
    return seleccionada as ClienteConDirecciones;
  };

  const AccionesClienteMaestroConDetalle = {
    ...accionesCliente,
    obtenerUno,
  };
  // console.log('seleccionada', seleccionada);

  // const MaestroDireccionesComp = () => {
  //   if (!seleccionada) {
  //     return null;
  //   }

  //   return <MaestroDirecciones id={seleccionada.id} />;
  // };

  return (
    <div className="MaestroConDetalle" style={{ display: "flex", gap: "2rem" }}>
      <div className="Maestro" style={{ flexBasis: "50%", overflow: "auto" }}>
        <Maestro acciones={AccionesClienteMaestroConDetalle} />
      </div>
      <div className="Detalle" style={{ flexBasis: "50%", overflow: "auto" }}>
        <Detalle
          id={seleccionada?.id ?? "0"}
          camposEntidad={camposCliente}
          acciones={{
            ...accionesCliente,
            actualizarUno: async (cliente) => {
              accionesCliente.actualizarUno(cliente).then(() => {
                cliente.id &&
                accionesCliente.obtenerUno(cliente.id).then((cliente) => {
                  actualizarCliente(cliente);
                });
              });
            } ,
          }}
          obtenerTitulo={titulo}
        >
          <h2>Direcciones</h2>
            <MaestroDirecciones id={seleccionada?.id} />
        </Detalle>
      </div>
    </div>
  );
};
