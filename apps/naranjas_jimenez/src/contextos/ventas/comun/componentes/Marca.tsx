import { QSelect } from "@olula/componentes/index.js";
import { QAutocompletarProps } from "@olula/componentes/moleculas/qautocompletar.tsx";
import { useEffect, useState } from "react";
import { ItemListaMarca } from "../../marca/diseño.ts";
import { getItemsListaSeleccionMarca } from "../../marca/infraestructura.ts";

type MarcaProps = Omit<QAutocompletarProps, "obtenerOpciones"> & {
  idVariedad?: string;
};

export const Marca = ({
  valor,
  idVariedad,
  nombre = "marca",
  label = "Marca",
  onChange,
  ...props
}: MarcaProps) => {
  const [opcionesMarca, setOpcionesMarca] = useState<ItemListaMarca[]>([]);

  useEffect(() => {
    if (!idVariedad) {
      setOpcionesMarca([]);
      return;
    }
    getItemsListaSeleccionMarca(idVariedad).then(setOpcionesMarca);
  }, [idVariedad]);

  const opciones = opcionesMarca.map((item) => ({ valor: item.id, descripcion: item.descripcion }));

  const handleChange = (opcion: { valor: string; descripcion: string } | null, e: React.ChangeEvent<HTMLElement>) => {
    if (!opcion) {
      onChange?.(null, e);
      return;
    }
    const item = opcionesMarca.find((i) => i.id === opcion.valor);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onChange?.({ ...opcion, idCategoria: item?.idCategoria } as any, e);
  };

  return (
    <QSelect
      label={label}
      nombre={nombre}
      valor={valor}
      onChange={handleChange}
      opciones={opciones}
      {...props}
    />
  );
};
