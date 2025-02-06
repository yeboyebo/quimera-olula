import { useParams } from "react-router";
import { Detalle } from "../../../../componentes/detalle/Detalle.tsx";
import { CampoFormularioGenerico } from "../../../../componentes/detalle/FormularioGenerico.tsx";
import { DireccionesCliente } from "../direcciones/DireccionesCliente.tsx";
import { Cliente } from "../diseño.ts";
import { accionesCliente } from "../infraestructura.ts";

export const DetalleCliente = () => {
  const { id } = useParams();

  const titulo = (cliente: Cliente) => cliente.nombre;

  const camposCliente: CampoFormularioGenerico[] = [
    { name: "id", label: "Código", type: "text", hidden: true },
    { name: "nombre", label: "Nombre", type: "text" },
    { name: "id_fiscal", label: "CIF/NIF", type: "text" },
  ];

  const MaestroDirecciones = () => {
    return <DireccionesCliente codCliente={id!} />;
  };

  return (
    <Detalle
      camposEntidad={camposCliente}
      acciones={accionesCliente}
      obtenerTitulo={titulo}
    >
      <MaestroDirecciones />
    </Detalle>
  );
};
