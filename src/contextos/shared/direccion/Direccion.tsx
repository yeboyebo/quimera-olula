import {
  FormularioGenerico,
  CampoFormularioGenerico,
} from "../../../componentes/FormularioGenerico.tsx";
import { useParams } from "react-router";

export type DireccionType = {
  nombre_via: string;
  tipo_via: string;
  numero: string;
  otros: string;
  cod_postal: string;
  ciudad: string;
  provincia_id: string;
  provincia: string;
  pais_id: string;
  apartado: string;
  telefono: string;
};

export const Direccion = ({ direccion }: { direccion: DireccionType }) => {
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

  const handleSubmit = (data: DireccionType) => {
    console.log("Direccion editada:", data);
  };

  const handleChange = (name: string, value: unknown) => {
    console.log(name, " editado con: ", value);
  };

  const validacion = (name: string, value: string) => {
    console.log("validacion", name, value);
    return null;
  };
  return (
    <div>
      <h1>Direccion</h1>
      <FormularioGenerico
        campos={camposDireccion}
        // id={id}
        valoresIniciales={direccion}
        onSubmit={handleSubmit}
        onChange={handleChange}
        validacion={validacion}
      />
    </div>
  );
};
