import { useContext } from "react";
import { Contexto } from "../../../contextos/comun/contexto.ts";
import { Acciones, Entidad } from "../../../contextos/comun/diseño.ts";
import "./MaestroAcciones.css";

type MaestroProps<T extends Entidad> = {
  acciones: Acciones<T>;
};

export const MaestroAcciones = <T extends Entidad>({
  acciones,
}: MaestroProps<T>) => {
  const { crearUno, actualizarUno } = acciones;
  const context = useContext(Contexto);
  if (!context) {
    throw new Error("Contexto es nulo");
  }
  const { entidades, setEntidades } = context;

  const onCrearNuevo = () => {
    const nuevaEntidad = {
      id: (entidades.length + 1).toString().padStart(6, "0"),
      nombre: [
        "Michel Jordan",
        "Lebron James",
        "Kobe Bryant",
        "Stephen Curry",
        "Kevin Durant",
        "James Harden",
        "Anthony Davis",
        "Giannis Antetokounmpo",
        "Luka Doncic",
        "Damian Lillard",
      ][entidades.length % 10],
      id_fiscal: "53631867F",
    } as unknown as T;

    console.log("nuevaEntidad = ", nuevaEntidad);

    crearUno(
      // nuevaEntidad
      {
      // id: nuevaEntidad.id,
      nombre: nuevaEntidad.nombre,
      id_fiscal: nuevaEntidad.id_fiscal,
      tipo_id_fiscal: "NIF",
      empresa_id: "1",
    }
  ).then((entidadCreada) => {
    console.log('entidadCreada = ', entidadCreada);
      setEntidades([entidadCreada, ...entidades]);
    });
  };

  const onActualizarPrimero = () => {
    const primeraEntidad = entidades[0];

    const nuevaEntidad = {
      id: primeraEntidad.id,
      nombre: primeraEntidad.nombre + " (actualizado)",
      nada: "",
    } as unknown as Partial<T>;

    actualizarUno(nuevaEntidad).then(() => {
      setEntidades([
        { ...primeraEntidad, nombre: nuevaEntidad.nombre },
        ...entidades.slice(1),
      ]);
    });
  };

  const onEliminarPrimero = () => {
    acciones.eliminarUno(entidades[0].id).then(() => {
      setEntidades(entidades.slice(1));
    });
  };

  return (
    <div className="MaestroAcciones">
      <button onClick={onCrearNuevo}>Crear nuevo</button>
      <button onClick={onActualizarPrimero}>Actualizar primero</button>
      <button onClick={onEliminarPrimero}>Eliminar primero</button>
    </div>
  );
};
