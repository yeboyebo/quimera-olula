import { QSelect } from "@olula/componentes/index.js";
import { QAutocompletarProps } from "@olula/componentes/moleculas/qautocompletar.tsx";
import { useEffect, useState } from "react";
import { getItemsListaSeleccionCalibre } from "../../calibre/infraestructura.ts";

type CalibreProps = Omit<QAutocompletarProps, "obtenerOpciones"> & {
  idVariedad?: string;
  idMarca?: string;
};

type OpcionCalibre = {
  valor: string;
  descripcion: string;
};

export const Calibre = ({
  valor,
  idVariedad = "",
  idMarca = "",
  nombre = "calibre",
  label = "Calibre",
  onChange,
  ...props
}: CalibreProps) => {
  const [opcionesCalibre, setOpcionesCalibre] = useState<OpcionCalibre[]>([]);

  useEffect(() => {
    if (!idVariedad || !idMarca) {
      setOpcionesCalibre([]);
      return;
    }
    const cargarOpcionesCalibre = async () => {
      const items = await getItemsListaSeleccionCalibre(idVariedad, idMarca);
      setOpcionesCalibre(items.map((item) => ({ valor: item.id, descripcion: item.descripcion })));
    };
    cargarOpcionesCalibre();
  }, [idVariedad, idMarca]);

  return (
    <QSelect
      label={label}
      nombre={nombre}
      valor={valor}
      onChange={onChange}
      opciones={opcionesCalibre}
      {...props}
    />
  );
};
