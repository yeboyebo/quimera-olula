import { getTagsArticulo } from "#/ventas/articulo/infraestructura.ts";
import { QAutocompletar } from "@olula/componentes/moleculas/qautocompletar.tsx";
import { Filtro, Orden } from "@olula/lib/diseño.ts";
import { useEffect, useState } from "react";

interface ArticuloProps {
  descripcion?: string;
  valor: string;
  nombre?: string;
  label?: string;
  onChange: (opcion: { valor: string; descripcion: string } | null) => void;
}

interface ArticuloProps {
  descripcion?: string;
  valor: string;
  nombre?: string;
  label?: string;
  autoFocus?: boolean;
  ref?: React.RefObject<HTMLInputElement | null>;
  onChange: (opcion: { valor: string; descripcion: string } | null) => void;
}

export const Articulo = ({
  descripcion: descripcionProp = "",
  valor,
  nombre = "referencia",
  label = "Artículo",
  onChange,
  ...props
}: ArticuloProps) => {
    const [descripcion, setDescripcion] = useState(descripcionProp);

    useEffect(() => {
        if (valor && !descripcionProp) {
            getTagsArticulo([["id", "=", valor]], ["id"]).then((articulos) => {
                if (articulos[0]) setDescripcion(articulos[0].descripcion);
            });
        } else {
            setDescripcion(descripcionProp);
        }
    }, [valor, descripcionProp]);

    const obtenerOpciones = async (texto: string) => {
        const criteria = {
            filtro: {
                or: [
                    ["descripcion", "~", texto],
                    ["id", "~", texto],
                ],
            },
            orden: ["id"],
        };

        const articulos = await getTagsArticulo(
            criteria.filtro as unknown as Filtro,
            criteria.orden as Orden
        );

        return articulos.map((articulo) => ({
            valor: articulo.id,
            descripcion: articulo.descripcion,
            descripcionOpcion: `${articulo.id} - ${articulo.descripcion}`,
            datos: articulo,
        }));
    };

  return (
    <QAutocompletar
        label={`${label} ${valor}`}
        nombre={nombre}
        onChange={onChange}
        valor={valor}
        obtenerOpciones={obtenerOpciones}
        descripcion={descripcion}
        {...props}
    />
  );
};

// export const Articulo = ({
//   descripcion: descripcionProp = "",
//   valor,
//   nombre = "referencia",
//   label = "Artículo",
//   onChange,
//   ...props
// }: ArticuloProps) => {
//   const [descripcion, setDescripcion] = useState(descripcionProp);

//   useEffect(() => {
//     if (valor && !descripcionProp) {
//       obtenerArticulosAlmacen([["id", "=", valor]], ["id"]).then((articulos) => {
//         if (articulos[0]) setDescripcion(articulos[0].descripcion);
//       });
//     } else {
//       setDescripcion(descripcionProp);
//     }
//   }, [valor, descripcionProp]);

//   const obtenerOpciones = async (texto: string) => {
//     const criteria: Criteria = {
//       filtro: [["descripcion", "~", texto]],
//       orden: ["id"],
//       paginacion: { limite: 10, pagina: 1 },
//     };

//     const articulos = await obtenerArticulosAlmacen(
//       criteria.filtro,
//       criteria.orden
//     );

//     return articulos.map((articulo) => ({
//       valor: articulo.id,
//       descripcion: articulo.descripcion,
//     }));
//   };

//   return (
//     <QAutocompletar
//       label={label}
//       nombre={nombre}
//       onChange={onChange}
//       valor={valor}
//       obtenerOpciones={obtenerOpciones}
//       descripcion={descripcion}
//       {...props}
//     />
//   );
// };
