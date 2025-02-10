import React, { useState } from "react";
import { Entidad } from "../../contextos/comun/diseño.ts";

export type CampoFormularioGenerico = {
  name: string;
  label: string;
  type: "text" | "email" | "number" | "date" | "password"; //Tipo de input
  readOnly?: boolean;
  hidden?: boolean;
  required?: boolean;
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

  return (
    <form onSubmit={handleSubmit}>
      {campos
        .filter((campo) => !campo.hidden)
        .map((campo) => (
          <div key={campo.name.toString()}>
            <label htmlFor={campo.name.toString()}>{campo.label}:</label>
            <input
              type={campo.type}
              id={campo.name.toString()}
              name={campo.name.toString()}
              value={
                entidad[campo.name] as
                  | string
                  | number
                  | readonly string[]
                  | undefined
              }
              onChange={handleChange}
              readOnly={campo.readOnly}
              required={campo.required}
            />
            {error && campo.name === "nombre" && (
              <p style={{ color: "red" }}>{error}</p>
            )}
          </div>
        ))}
      <button type="submit">Enviar</button>
    </form>
  );
};
