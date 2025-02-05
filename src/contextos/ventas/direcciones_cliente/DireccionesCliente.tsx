import { FormularioGenerico, CampoFormularioGenerico } from "../../../componentes/FormularioGenerico";
import { Direccion, DireccionType } from "../../shared/direccion/Direccion";
import { useState, useEffect } from 'react';
import { direccionesFake } from "./direccionesFake.ts";

export type DireccionCliente = {
  id: string;
  direccion: DireccionType;
  dir_envio: boolean;
  dir_facturacion: boolean;
};

export type DireccionesCliente = {
  codigo_cliente: string;
  direcciones: DireccionCliente[];
};

export const DireccionesCliente = ({ codCliente }: { codCliente: string }) => {

  const [dirCliente, setDirCliente] = useState<DireccionesCliente | null>(null);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    if (codCliente) {
      const dirCliente = direccionesFake.find((d) => d.codigo_cliente === codCliente) ?? null;
      if (dirCliente){
        setDirCliente(dirCliente);
      } else {
        setError("No se encontraron direcciones para el cliente.");
      }
    };
  }, [codCliente]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!dirCliente) {
    return <div>Cargando direcciones...</div>;
  }
  console.log(dirCliente);
  return (
    <div>
      <h2>Direcciones del Cliente: {codCliente}</h2>
      <ul>
        {dirCliente.direcciones.map((dir) => (
          <li key={dirCliente.codigo_cliente}>
            { dir.direccion.nombre_via }
          </li>
        ))}
      </ul>
    </div>
  )

}