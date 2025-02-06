import { useParams } from "react-router";
import {
  CampoFormularioGenerico,
  FormularioGenerico,
} from "../../../../componentes/detalle/FormularioGenerico.tsx";
import { DireccionCliente } from "../diseño.ts";

export const Direccion = ({ direccion }: { direccion: DireccionCliente }) => {
  const { id } = useParams();
  if (!id) {
    return <>No se encuentra</>;
  }

  const camposDireccion: CampoFormularioGenerico[] = [
    { name: "nombre_via", label: "Nombre Vía", type: "text", required: true },
    { name: "tipo_via", label: "Tipo Vía", type: "text", required: true },
    { name: "numero", label: "Número", type: "text", required: true },
    { name: "otros", label: "Otros", type: "text" },
    {
      name: "cod_postal",
      label: "Código Postal",
      type: "text",
      required: true,
    },
    { name: "ciudad", label: "Ciudad", type: "text", required: true },
    {
      name: "provincia_id",
      label: "Provincia ID",
      type: "text",
      required: true,
    },
    { name: "provincia", label: "Provincia", type: "text", required: true },
    { name: "pais_id", label: "País ID", type: "text", required: true },
    { name: "apartado", label: "Apartado", type: "text" },
    { name: "telefono", label: "Teléfono", type: "text" },
  ];

  const handleSubmit = (data: DireccionCliente) => {
    console.log("Direccion editada:", data);
  };

  const validacion = (direccion: DireccionCliente) => {
    console.log("validacion", direccion);
    return null;
  };
  return (
    <div>
      <h1>Direccion</h1>
      <FormularioGenerico
        campos={camposDireccion}
        valoresIniciales={direccion}
        onSubmit={handleSubmit}
        validacion={validacion}
      />
    </div>
  );
};
