import { useContext, useEffect } from "react";
import { useParams } from "react-router";
import { Detalle } from "../../../../componentes/detalle/Detalle.tsx";
import { CampoFormularioGenerico } from "../../../../componentes/detalle/FormularioGenerico.tsx";
import { Contexto } from "../../../comun/contexto.ts";
import { Cliente } from "../diseño.ts";
import {
  accionesCliente
} from "../infraestructura.ts";
import { MaestroDirecciones } from "./MaestroDirecciones.tsx";

export const DetalleCliente = () => {
  const { id } = useParams();
  
  const context = useContext(Contexto);
  if (!context) {
    throw new Error("Contexto is null");
  }
  const { seleccionada, setSeleccionada } = context;
  // const { seleccionada, setSeleccionada } = {
  //   seleccionada: null,
  //   setSeleccionada: () => {},
  // }

  const { obtenerUno } = accionesCliente;

  useEffect(() => {
    if (seleccionada && seleccionada.id === id) {
      return;
    }

    obtenerUno(id ?? "0").then((entidad) => setSeleccionada(entidad));
  }, [id, obtenerUno, seleccionada, setSeleccionada]);

  const titulo = (cliente: Cliente) => cliente.nombre;

  const camposCliente: CampoFormularioGenerico[] = [
    { name: "id", label: "Código", type: "text", hidden: true },
    { name: "nombre", label: "Nombre", type: "text" },
    { name: "id_fiscal", label: "CIF/NIF", type: "text" },
  ];
  console.log('refrescando');

  // const MaestroDireccionesComp = () => {
  //   if (!id) {
  //     return null;
  //   }
  //   // const acciones = {
  //   //   obtenerTodos: async () => obtenerDireccionesCliente(id),
  //   //   obtenerUno: async () => ({} as DireccionCliente),
  //   //   crearUno: async () => {},
  //   //   actualizarUno: async () => {},
  //   //   eliminarUno: async () => {},
  //   // };

  //   return <SubVista>
  //     <MaestroDirecciones id={id} />
  //     </SubVista>;
  // };

  return (
    <Detalle
      id={id ?? "0"}
      camposEntidad={camposCliente}
      acciones={accionesCliente}
      obtenerTitulo={titulo}
    >
      <h2>Direcciones</h2>
      <MaestroDirecciones id={id} />
    </Detalle>
  );
};
