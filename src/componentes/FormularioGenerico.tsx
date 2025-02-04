import React, { useState, useEffect } from 'react';

type CampoFormularioGenerico = {
  name: string; 
  label: string; 
  type: 'text' | 'email' | 'number' | 'date' | 'password'; //Tipo de input
  readOnly?: boolean;
  hidden?: boolean;
};

type FormularioGenericoProps<T> = {
  campos: CampoFormularioGenerico[];
  id?: string;
  valoresIniciales?: T;
  onSubmit: (data: T) => void;
  validacion?: (name: keyof T, value: string) => string | null;
  obtenerUno:(id: string) => Promise<T | null>;
}

export const FormularioGenerico = <T extends Record<string, any>>({
  campos,
  id,
  valoresIniciales,
  onSubmit,
  validacion,
  obtenerUno,
}: FormularioGenericoProps<T>) => {

  const [formData, setFormData] = useState<T>(valoresIniciales || ({} as T));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id && obtenerUno && !valoresIniciales) {
      obtenerUno(id).then((entidades) => setFormData(entidades as T));
    };
  }, [id, obtenerUno, valoresIniciales]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (validacion) {
      const errorMsg = validacion(name as keyof T, value);
      setError(errorMsg);
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (error) {
      alert(error);
      return;
    }

    onSubmit(formData); 
  };

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
              value={formData[campo.name]}
              onChange={handleChange}
              readOnly={campo.readOnly} 
            />
            {error && campo.name === 'nombre' && (
              <p style={{ color: 'red' }}>{error}</p>
            )}
          </div>
        ))}
      <button type="submit">Enviar</button>
    </form>
  );
};
