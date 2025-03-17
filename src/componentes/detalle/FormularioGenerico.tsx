import { Entidad } from "../../contextos/comun/diseño.ts";
import { renderInput, renderSelect, renderSpace } from "./helpers.tsx";

export type CampoFormularioGenerico = {
  nombre: string;
  etiqueta: string;
  placeholder?: string;
  tipo: "text" | "email" | "number" | "date" | "password" | "space" | "select";
  soloLectura?: boolean;
  oculto?: boolean;
  requerido?: boolean;
  valorInicial?: string;
  ancho?: string;
  condensado?: boolean;
  opciones?: { [campo: string]: string; descripcion: string }[];
};

type FormularioGenericoProps<T> = {
  campos: CampoFormularioGenerico[];
  entidad: T;
  setEntidad: (entidad: T) => void;
  onSubmit: (id: string, data: T) => Promise<void>;
  validacion?: (entidad: T) => string | null;
};

export const FormularioGenerico = <T extends Entidad>({
  campos,
  entidad,
  setEntidad,
  onSubmit,
  validacion,
}: FormularioGenericoProps<T>) => {
  const handleAction = (formData: FormData) => {
    const data = Object.fromEntries(formData);

    const nuevaEntidad = { ...entidad, ...data };

    const error = validacion ? validacion(nuevaEntidad) : null;

    if (error) {
      alert(error);
      return;
    }

    onSubmit(entidad.id, nuevaEntidad).then(() => setEntidad(nuevaEntidad));
  };

  if (!entidad) {
    return <>No encontrado</>;
  }

  return (
    <form action={handleAction}>
      {campos
        .filter((campo) => !campo.oculto)
        .map((campo) =>
          campo.tipo === "space"
            ? renderSpace()
            : campo.tipo === "select"
            ? renderSelect(campo, entidad)
            : renderInput(campo, entidad)
        )}
      <quimera-boton tipo="submit">Enviar</quimera-boton>
    </form>
  );
};
