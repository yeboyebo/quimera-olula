import React, { useState } from "react";
import { Entidad } from "../../contextos/comun/diseño.ts";

export type CampoFormularioGenerico = {
  nombre: string;
  etiqueta: string;
  tipo: "text" | "email" | "number" | "date" | "password"; //Tipo de input
  soloLectura?: boolean;
  oculto?: boolean;
  requerido?: boolean;
  valorInicial?: string;
};

type FormularioGenericoProps<T> = {
  campos: CampoFormularioGenerico[];
  entidad: T;
  setEntidad: (entidad: T) => void;
  onSubmit: (id: string, data: T) => void;
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

    onSubmit(entidad.id, entidad);
  };

  if (!entidad) {
    return <>No encontrado</>;
  }

  return (
    <form onSubmit={handleSubmit}>
      {campos
        .filter((campo) => !campo.oculto)
        .map((campo) => (
          <div key={campo.nombre.toString()}>
            <label htmlFor={campo.nombre.toString()}>{campo.etiqueta}:</label>
            <input
              type={campo.tipo}
              id={campo.nombre.toString()}
              name={campo.nombre.toString()}
              value={
                entidad[campo.nombre] as
                  | string
                  | number
                  | readonly string[]
                  | undefined
              }
              onChange={handleChange}
              readOnly={campo.soloLectura}
              required={campo.requerido}
            />
            {error && campo.nombre === "nombre" && (
              <p style={{ color: "red" }}>{error}</p>
            )}
          </div>
        ))}
      <button type="submit">Enviar</button>
    </form>
  );
};
