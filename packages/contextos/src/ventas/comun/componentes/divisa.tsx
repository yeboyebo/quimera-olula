import { QSelect } from "@olula/componentes/atomos/qselect.tsx";
import { obtenerOpcionesSelector } from "@olula/lib/infraestructura.ts";
import { useEffect, useState } from "react";

interface DivisasProps {
  valor: string;
  nombre?: string;
  onChange: (opcion: { valor: string; descripcion: string } | null) => void;
  getProps?: (campo: string) => Record<string, unknown>;
}

export const Divisa = ({
  valor,
  nombre = "divisa_id",
  onChange,
  ...props
}: DivisasProps) => {
  const [opcionesDivisa, setOpcionesDivisa] = useState<
    { valor: string; descripcion: string }[]
  >([]);

  useEffect(() => {
    const cargarOpcionesDivisa = async () => {
      const opciones = await obtenerOpcionesSelector("divisa")();
      const opcionesMapeadas = opciones.map((opcion) => ({
        valor: opcion[0],
        descripcion: opcion[1],
        // tasa_conversion: i * 3.02
      }));
      setOpcionesDivisa(opcionesMapeadas);
    };

    cargarOpcionesDivisa();
  }, []);

  return (
    <QSelect
      label="Divisa"
      nombre={nombre}
      valor={valor}
      onChange={onChange}
      opciones={opcionesDivisa}
      {...props}
    />
  );
};
