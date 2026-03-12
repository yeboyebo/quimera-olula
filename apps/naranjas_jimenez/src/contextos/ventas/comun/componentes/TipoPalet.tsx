import { QSelect } from "@olula/componentes/index.js";
import { QAutocompletarProps } from "@olula/componentes/moleculas/qautocompletar.tsx";
import { useEffect, useState } from "react";
import { getItemsListaTipoPalet } from "../../tipo_palet/infraestructura.ts";

type TipoPaletProps = Omit<QAutocompletarProps, "obtenerOpciones">;

type OpcionTipoPalet = {
  valor: string;
  descripcion: string;
};

export const TipoPalet = ({
  valor,
  nombre = "tipo_palet",
  label = "Tipo Palet",
  onChange,
  ...props
}: TipoPaletProps) => {
  const [opcionesTipoPalet, setOpcionesTipoPalet] = useState<OpcionTipoPalet[]>([]);

  useEffect(() => {
    const cargarOpcionesTipoPalet = async () => {
      const items = await getItemsListaTipoPalet([], []);
      setOpcionesTipoPalet(items.map((item) => ({ valor: item.id, descripcion: item.descripcion })));
    };
    cargarOpcionesTipoPalet();
  }, []);

  return (
    <QSelect
      label={label}
      nombre={nombre}
      valor={valor}
      onChange={onChange}
      opciones={opcionesTipoPalet}
      {...props}
    />
  );
};
