import { QSelect } from "@olula/componentes/index.js";
import { QAutocompletarProps } from "@olula/componentes/moleculas/qautocompletar.tsx";
import { useEffect, useState } from "react";
import { getItemsListaSeleccionMarca } from "../../marca/infraestructura.ts";

type MarcaProps = Omit<QAutocompletarProps, "obtenerOpciones"> & {
  idVariedad?: string;
};

type OpcionMarca = {
  valor: string;
  descripcion: string;
};

export const Marca = ({
  valor,
  idVariedad,
  nombre = "marca",
  label = "Marca",
  onChange,
  ...props
}: MarcaProps) => {
  const [opcionesMarca, setOpcionesMarca] = useState<OpcionMarca[]>([]);
  useEffect(() => {
    if (!idVariedad) {
      setOpcionesMarca([]);
      return;
    }
    // const criteria: Criteria = {
    //   filtro: ["variedad_id", idVariedad], // Cargo marcas disponibles para esta variedad
    //   orden: ["descripcion"],
    //   paginacion: { limite: 1000, pagina: 1 },
    // };
    const cargarOpcionesMarca = async () => {
      const opciones = await getItemsListaSeleccionMarca(idVariedad);
      const opcionesMapeadas = opciones.map((opcion) => ({
        valor: opcion.id,
        descripcion: opcion.descripcion,
        // tasa_conversion: i * 3.02
      }));
      setOpcionesMarca(opcionesMapeadas);
    };

    cargarOpcionesMarca();
  }, []);

  return (
    <QSelect
      label={label}
      nombre={nombre}
      valor={valor}
      onChange={onChange}
      opciones={opcionesMarca}
      {...props}
    />
  );
};
