import React, { useState } from "react";
import { Entidad } from "../../contextos/comun/diseño.ts";

export type CampoFormularioGenerico = {
  nombre: string;
  etiqueta: string;
  tipo: "text" | "email" | "number" | "date" | "password" | "space";
  soloLectura?: boolean;
  oculto?: boolean;
  requerido?: boolean;
  valorInicial?: string;
  ancho?: string;
};

type FormularioGenericoProps<T> = {
  campos: CampoFormularioGenerico[];
  entidad: T;
  setEntidad: (entidad: T) => void;
  onSubmit: (data: T) => void;
  validacion?: (entidad: T) => string | null;
};

export const FormularioGenerico = <T extends Entidad>({
  campos,
  entidad,
  setEntidad,
  onSubmit,
  validacion,
}: FormularioGenericoProps<T>) => {
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const nuevaEntidad = {
      ...entidad,
      [name]: value,
    };

    if (validacion) {
      const errorMsg = validacion(nuevaEntidad);
      setError(errorMsg);
    }

    setEntidad(nuevaEntidad);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (error) {
      alert(error);
      return;
    }

    onSubmit(entidad);
  };

  if (!entidad) {
    return <>No encontrado</>;
  }

  const renderInput = (campo: CampoFormularioGenerico) => {
    const props = {
      label: campo.etiqueta,
      name: campo.nombre,
      placeholder: `Introduce el valor de ${campo.etiqueta.toLowerCase()}`,
      valor: entidad[campo.nombre],
      opcional: !campo.requerido ? "true" : undefined,
      deshabilitado: campo.soloLectura ? "true" : undefined,
      "todo-ancho": campo.ancho === "100%" ? "true" : undefined,
    };
    return <quimera-input {...props}></quimera-input>;
  };

  const renderSpace = () => {
    return <div style={{ height: "1rem", width: "100%" }}></div>;
  };

  return (
    <form onSubmit={handleSubmit}>
      {campos
        .filter((campo) => !campo.oculto)
        .map((campo) =>
          campo.tipo === "space" ? renderSpace() : renderInput(campo)
        )}
      <button type="submit">Enviar</button>
    </form>
  );
};
