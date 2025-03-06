import { Entidad } from "../../contextos/comun/diseño.ts";

export type CampoFormularioGenerico = {
  nombre: string;
  etiqueta: string;
  tipo: "text" | "email" | "number" | "date" | "password" | "space" | "select";
  soloLectura?: boolean;
  oculto?: boolean;
  requerido?: boolean;
  valorInicial?: string;
  ancho?: string;
  opciones?: [];
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

  const renderSelect = (campo: CampoFormularioGenerico) => {
    console.log(campo);
    return (
      <div>
        <label htmlFor={campo.nombre.toString()}>{campo.etiqueta}:</label>
        <select>
          {campo.opciones?.map((opcion) => (
            <option key={opcion[campo.nombre]} value={opcion[campo.nombre]}>
              {opcion["descripcion"]}
            </option>
          ))}
        </select>
      </div>
    );
  };

  const renderInput = (campo: CampoFormularioGenerico) => {
    const attrs = {
      nombre: campo.nombre,
      label: campo.etiqueta,
      placeholder: `Introduce el valor de ${campo.etiqueta.toLowerCase()}`,
      valor: entidad[campo.nombre],
      opcional: !campo.requerido ? "true" : undefined,
      deshabilitado: campo.soloLectura ? "true" : undefined,
      "todo-ancho": campo.ancho === "100%" ? "true" : undefined,
    };
    return <quimera-input key={campo.nombre} {...attrs}></quimera-input>;
  };

  const renderSpace = () => {
    return <div key="space" style={{ height: "1rem", width: "100%" }}></div>;
  };

  return (
    <form action={handleAction}>
      {campos
        .filter((campo) => !campo.oculto)
        .map((campo) =>
          campo.tipo === "space"
            ? renderSpace()
            : campo.tipo === "select"
            ? renderSelect(campo)
            : renderInput(campo)
        )}
      <quimera-boton tipo="submit">Enviar</quimera-boton>
    </form>
  );
};
