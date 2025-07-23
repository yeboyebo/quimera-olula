import { useEffect, useState } from "react";
import { QSelect } from "../../../../../componentes/atomos/qselect.tsx";
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

  const [opcionesProducto, setOpcionesProducto] = useState<
    { valor: string; descripcion: string }[]
  >([]);

  useEffect(() => {
    const cargarOpciones = async () => {
      // Cargar todas las opciones al inicio
      const criteria = {
        filtro: [] as unknown as Filtro,
        orden: ["descripcion", "ASC"] as Orden,
      };
      
      const productos = await getProductos(criteria.filtro, criteria.orden);
      const opciones = productos.map((producto) => ({
        valor: producto.id,
        descripcion: producto.descripcion,
      }));
      
      setOpcionesProducto(opciones);
    };
    
    cargarOpciones();
  }, []);

  return (
    <QSelect
      label={label}
      nombre={descripcion}
      valor={valor}
      onChange={onChange}
      opciones={opcionesProducto}
      {...props}
    />
  );
};
