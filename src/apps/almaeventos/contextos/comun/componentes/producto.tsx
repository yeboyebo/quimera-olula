// import { QAutocompletar } from "../../../../componentes/moleculas/qautocompletar.tsx";

import { QAutocompletar } from "../../../../../componentes/moleculas/qautocompletar.tsx";
import { Filtro, Orden } from "../../../../../contextos/comun/diseño.ts";
import { getProductos } from "../../../contextos/eventos/producto/infraestructura.ts";

interface ProductoProps {
  descripcion?: string;
  valor: string;
  nombre?: string;
  label?: string;
  onChange: (opcion: { valor: string; descripcion: string } | null) => void;
  // textoValidacion?: string;
  // deshabilitado?: boolean;
  // erroneo?: boolean;
  // advertido?: boolean;
  // valido?: boolean;
}

export const Producto = ({
  descripcion = "",
  valor,
  // descripcion = "producto_id",
  label = "Producto",
  onChange,
  ...props
}: ProductoProps) => {
  const obtenerOpciones = async (valor: string) => {
    if (valor.length < 3) return [];

    const criteria = {
      filtro: [["descripcion", "~", valor]],
      orden: ["id","DESC"],
    };

    const productos = await getProductos(
      criteria.filtro as unknown as Filtro,
      criteria.orden as Orden
    );    

    return productos.map((producto) => ({
      valor: producto.id,
      descripcion: producto.descripcion,
    }));
  };

  return (
    <QAutocompletar
      label={label}
      nombre={descripcion}
      onChange={onChange}
      valor={valor}
      autoSeleccion
      obtenerOpciones={obtenerOpciones}
      descripcion={descripcion}
      {...props}
    />
  );
};
