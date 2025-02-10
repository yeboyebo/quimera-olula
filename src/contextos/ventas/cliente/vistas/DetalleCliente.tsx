import { useParams } from "react-router";
import { Detalle } from "../../../../componentes/detalle/Detalle.tsx";
import { CampoFormularioGenerico } from "../../../../componentes/detalle/FormularioGenerico.tsx";
import { Maestro } from "../../../../componentes/maestro/Maestro.tsx";
import { direccionesFake } from "../direcciones/direccionesFake.ts";
import { Cliente, DireccionCliente } from "../diseño.ts";
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
    const acciones = {
      obtenerTodos: async () =>
        direccionesFake.find((d) => d.codigo_cliente === id)?.direcciones ?? [],
      obtenerUno: async () => ({} as DireccionCliente),
      crearUno: async () => {},
      actualizarUno: async () => {},
      eliminarUno: async () => {},
    };

    return <Maestro acciones={acciones} />;
  };

  return (
    <Detalle
      camposEntidad={camposCliente}
      acciones={accionesCliente}
      obtenerTitulo={titulo}
    >
      <h2>Direcciones</h2>
      <MaestroDirecciones />
    </Detalle>
  );
};
