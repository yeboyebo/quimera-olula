import { FormularioGenerico, CampoFormularioGenerico } from "../../../componentes/FormularioGenerico";
import { Cliente as ClienteType } from '../clientes/Clientes';
import { clientesFake } from "../clientes/clientesFake.ts";
import { RestAPI } from "../../comun/api/rest_api.ts";
import { useParams } from 'react-router';
import { DireccionesCliente } from "../direcciones_cliente/DireccionesCliente.tsx"

export const Cliente = () => {
  const { id } = useParams();
  if (!id) {
    return <>No se encuentra</>
  }

  const obtenerUnCliente = async (id: string) =>
    RestAPI.get<ClienteType>(`/quimera/ventas/cliente/${id}`).catch(
      () => clientesFake.find((cliente) => cliente.id === id) ?? null
    );

  // const valoresInicialesCliente: ClienteType =   {
  //   id: "",
  //   nombre: "",
  //   id_fiscal: "",
  // };

  const camposCliente: CampoFormularioGenerico[] = [
    { name: 'id', label: 'Código', type: 'text', hidden: true },
    { name: 'nombre', label: 'Nombre', type: 'text' },
    { name: 'id_fiscal', label: 'CIF/NIF', type: 'text' },
  ];

  const handleSubmit = (data: ClienteType) => {
    console.log('Cliente editado:', data);
  };

  const handleChange= (name: string, value: any) => {
    console.log(name, ' editado con: ', value);
  };

  // Validación para el nombre (debe estar en mayúsculas)
  const validacion = (name: string, value: string) => {
    if (name === 'nombre' && value !== value.toUpperCase()) {
      return 'El nombre del  debe estar en mayúsculas.';
    }
    return null;
  };
  
  console.log(id);
  return (
    <div>
      <h1>Cliente</h1>
      <FormularioGenerico
        campos={camposCliente}
        id={id}
        obtenerUno={obtenerUnCliente}
        // valoresIniciales={valoresInicialesCliente}
        onSubmit={handleSubmit}
        onChange={handleChange}
        validacion={validacion}
      />
      <DireccionesCliente codCliente={id}/>
    </div>
  );
};
