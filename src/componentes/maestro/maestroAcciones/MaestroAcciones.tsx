import { useContext } from "react";
import { Contexto } from "../../../contextos/comun/contexto.ts";
import { Acciones, Entidad } from "../../../contextos/comun/diseño.ts";
import { CampoFormularioGenerico } from "../../detalle/FormularioGenerico.tsx";

type MaestroProps<T extends Entidad> = {
  acciones: Acciones<T>;
  camposEntidad: CampoFormularioGenerico[];
};

const crearEntidadVacia = <T extends Entidad>(
  camposEntidad: CampoFormularioGenerico[]
): T => {
  return camposEntidad.reduce((acc, campo) => {
    return { ...acc, [campo.nombre]: campo.valorInicial || "" };
  }, {} as Partial<T>) as T;
};

export const MaestroAcciones = <T extends Entidad>({
  acciones,
  camposEntidad,
}: MaestroProps<T>) => {
  const { eliminarUno } = acciones;
  const context = useContext(Contexto);
  if (!context) {
    throw new Error("Contexto es nulo");
  }
  const { entidades, setEntidades, setSeleccionada, seleccionada } = context;

  const onCrearNuevo = () => {
    const entidadVacia = crearEntidadVacia<T>(camposEntidad);
    setSeleccionada(entidadVacia);
  };

  const onEliminarSeleccionado = () => {
    if (!seleccionada) {
      return;
    }

    eliminarUno(seleccionada.id).then(() => {
      setEntidades(
        (entidades as T[]).filter(
          (entidad: T) => entidad.id !== seleccionada.id
        )
      );
    });
  };

  return (
    <div className="MaestroAcciones">
      <button onClick={onCrearNuevo}>Crear</button>
      <button onClick={onEliminarSeleccionado}>Borrar</button>
    </div>
  );
};
