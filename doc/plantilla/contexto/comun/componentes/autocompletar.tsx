import { QAutocompletar } from "../../../../../src/componentes/moleculas/qautocompletar.tsx";
import { Filtro } from "../../../../../src/contextos/comun/diseño.ts";
import { getModulos } from "../../modulo/infraestructura.ts";

interface AutocompletarProps {
  descripcion?: string;
  valor: string;
  nombre?: string;
  label?: string;
  deshabilitado?: boolean;
  onChange?: (opcion: { valor: string; descripcion: string } | null) => void;
}

export const Autocompletar = ({
  descripcion = "",
  valor,
  nombre = "Nombre_defecto",
  label = "Autocompletar",
  deshabilitado = false,
  onChange,
  ...props
}: AutocompletarProps) => {
  const obtenerOpciones = async (texto: string) => {
    const criteria = {
      filtro: [["campo", "~", texto]],
      orden: ["id"],
    };

    const modulos = await getModulos(criteria.filtro as Filtro, criteria.orden);

    return modulos.datos.map((modulo) => ({
      valor: modulo.id,
      descripcion: modulo.nombre,
    }));
  };

  return (
    <QAutocompletar
      label={label}
      nombre={nombre}
      onChange={onChange}
      valor={valor}
      obtenerOpciones={obtenerOpciones}
      descripcion={descripcion}
      deshabilitado={deshabilitado}
      {...props}
    />
  );
};
