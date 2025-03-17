import React from "react";
import { Entidad } from "../../contextos/comun/diseño.ts";
import { Select } from "../wrappers/select.tsx";

const renderSelect = (campo: CampoFormularioGenerico, entidad: Entidad) => {
  const attrs = {
    nombre: campo.nombre,
    label: campo.etiqueta,
    placeholder: `Selecciona un/a ${campo.etiqueta.toLowerCase()}`,
    opcional: !campo.requerido,
    deshabilitado: campo.soloLectura,
    valor: entidad[campo.nombre] as string,
    opciones: campo.opciones?.map((opcion) => ({
      valor: opcion[campo.nombre],
      descripcion: opcion["descripcion"],
    })),
    "todo-ancho": campo.ancho === "100%" ? "true" : undefined,
  };

  return <Select key={campo.nombre} {...attrs} />;
};

const renderInput = (campo: CampoFormularioGenerico, entidad: Entidad) => {
  const attrs = {
    nombre: campo.nombre,
    label: campo.etiqueta,
    placeholder: `Introduce el valor de ${campo.etiqueta.toLowerCase()}`,
    valor: entidad[campo.nombre] as string,
    opcional: !campo.requerido,
    deshabilitado: campo.soloLectura,
    "todo-ancho": campo.ancho === "100%" ? "true" : undefined,
  };
  return (
    <React.Fragment key={campo.nombre}>
      <quimera-input {...attrs}></quimera-input>
    </React.Fragment>
  );
};

const renderSpace = () => {
  return <div key="space" style={{ height: "1rem", width: "100%" }}></div>;
};

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
