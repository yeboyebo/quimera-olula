import { QSelect } from "@olula/componentes/atomos/qselect.tsx";
import { obtenerOpcionesSelector } from "@olula/lib/infraestructura.ts";
import { useEffect, useState } from "react";

interface FormaPagoProps {
  valor: string;
  label?: string;
  nombre?: string;
  onChange: (opcion: { valor: string; descripcion: string } | null) => void;
}

export const GrupoIvaNegocio = ({
  valor,
  label = "Grupo IVA",
  nombre = "grupo_iva_id",
  onChange,
  ...props
}: FormaPagoProps) => {
  const [opciones, setOpciones] = useState<
    { valor: string; descripcion: string }[]
  >([]);

  useEffect(() => {
    const cargarOpciones = async () => {
      const opciones = await obtenerOpcionesSelector("grupo_iva_negocio")();
      const opcionesMapeadas = opciones.map((opcion) => ({
        valor: opcion[0],
        descripcion: opcion[1],
      }));
      setOpciones(opcionesMapeadas);
    };

    cargarOpciones();
  }, []);

  return (
    <QSelect
      {...props}
      label={label}
      nombre={nombre}
      valor={valor}
      onChange={onChange}
      opciones={opciones}
    />
  );
};
