import { useEffect, useState } from "react";
import { QSelect } from "../../../../componentes/atomos/qselect.tsx";
import { obtenerOpcionesSelector } from "../../presupuesto/infraestructura.ts";

interface DivisasProps {
  valor: string;
  onChange: (opcion: { valor: string; descripcion: string } | null) => void;
  getProps?: (campo: string) => Record<string, unknown>;
}

export const Divisas = ({ valor, onChange, getProps }: DivisasProps) => {
  const [opcionesDivisa, setOpcionesDivisa] = useState<
    { valor: string; descripcion: string }[]
  >([]);

  useEffect(() => {
    const cargarOpcionesDivisa = async () => {
      const opciones = await obtenerOpcionesSelector("divisa")();
      const opcionesMapeadas = opciones.map((opcion) => ({
        valor: opcion[0],
        descripcion: opcion[1],
      }));
      setOpcionesDivisa(opcionesMapeadas);
    };

    cargarOpcionesDivisa();
  }, []);

  return (
    <QSelect
      label="Divisa"
      nombre="divisa_id"
      valor={valor}
      onChange={onChange}
      opciones={opcionesDivisa}
      {...(getProps ? getProps("divisa_id") : {})}
    />
  );
};
