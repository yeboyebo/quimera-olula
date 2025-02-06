import { CampoFormularioGenerico } from "../../../componentes/FormularioGenerico";
import { Cliente as ClienteType } from "../clientes/Clientes";
import { clientesFake } from "../clientes/clientesFake.ts";
import { RestAPI } from "../../comun/api/rest_api.ts";
import { useParams } from "react-router";
// import { DireccionesCliente } from "../direcciones_cliente/DireccionesCliente.tsx";
import { Detail } from "../../../componentes/Detail";
import { useEffect, useState } from "react";
import { DireccionesCliente } from "../direcciones_cliente/DireccionesCliente.tsx";

export const Cliente = () => {
  const { id } = useParams();
  const [cliente, setCliente] = useState<ClienteType>({
    id: "",
    nombre: "",
    id_fiscal: "",
  });

  useEffect(() => {
    if (id) {
      obtenerUnCliente(id).then((cliente) =>
        setCliente(cliente as ClienteType)
      );
    }
  }, [id]);

  if (!id) {
    return <>No se encuentra</>;
  }

  const obtenerUnCliente = async (id: string) =>
    RestAPI.get<ClienteType>(`/quimera/ventas/cliente/${id}`).catch(
      () => clientesFake.find((cliente) => cliente.id === id) ?? null
    );

  const camposCliente: CampoFormularioGenerico[] = [
    { name: "id", label: "Código", type: "text", hidden: true },
    { name: "nombre", label: "Nombre", type: "text" },
    { name: "id_fiscal", label: "CIF/NIF", type: "text" },
  ];

  // const camposRelatedItems: CampoFormularioGenerico[] | undefined = [];

  // const relatedEntity: ClienteType[] | undefined = [];

  // const actualizarUnRelacionado = (data: ClienteType[]) => {
  //   console.log("Cliente editado:", data);
  // };

  const actualizarUno = async (entidad: Partial<ClienteType>) => {
    console.log("Cliente editado", entidad);
  };

  const renderCabecera = (item: ClienteType) => {
    return <span>{item.nombre}</span>;
  };

  const renderRelated = () => {
    return <DireccionesCliente codCliente={id} />;
  };

  // Validación para el nombre (debe estar en mayúsculas)
  // const validacion = (name: string, value: string) => {
  //   if (name === "nombre" && value !== value.toUpperCase()) {
  //     return "El nombre del  debe estar en mayúsculas.";
  //   }
  //   return null;
  // };

  return (
    <div>
      <Detail
        entity={cliente}
        camposEntidad={camposCliente}
        renderCabecera={renderCabecera}
        actualizarUno={actualizarUno}
        renderRelated={renderRelated}
        // relatedEntity={relatedEntity}
        // camposRelatedItems={camposRelatedItems}
        // actualizarUnRelacionado={actualizarUnRelacionado}
      />
    </div>
  );
};
