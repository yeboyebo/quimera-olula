import { useContext } from "react";
import { Contexto } from "../../../../contextos/comun/contexto.ts";
import { Entidad } from "../../../../contextos/comun/diseño.ts";
import { Direccion } from "../../cliente/diseño.ts";
// import "./MaestroAcciones.css";

export type Acciones<T extends Entidad> = {
  obtenerTodos: () => Promise<T[]>;
  crearDireccion: (direccion: Direccion) => Promise<void>;
};

type MaestroProps<T extends Entidad> = {
  acciones: Acciones<T>;
};

export const MaestroDireccionesAcciones = <T extends Entidad>({
  acciones,
}: MaestroProps<T>) => {

  const { crearDireccion, obtenerTodos } = acciones;
  const context = useContext(Contexto);
  if (!context) {
    throw new Error("Contexto es nulo");
  }
  const { setEntidades } = context;

  const onCrearDireccion = () => {
    const direccion: Direccion = {
      nombre_via: 'Pablo Picasso',
      tipo_via: 'Calle',
      numero: '30',
      otros: '',
      cod_postal: '02640',
      ciudad: 'Almansa',
      provincia_id: 0,
      provincia: 'Albacete',
      pais_id: 'ES',
      apartado: '',
      telefono: '',
    };

    crearDireccion(direccion)
      .then(() => {
        obtenerTodos()
        .then((direcciones) => {
          setEntidades(direcciones as T[]);
        });
    });
  }

  return (
    <div className="MaestroAcciones">
      <button onClick={onCrearDireccion}>Crear direccion</button>
    </div>
  );
};
