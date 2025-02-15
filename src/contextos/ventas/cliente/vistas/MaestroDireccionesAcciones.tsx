import { useContext } from "react";
import { Contexto } from "../../../../contextos/comun/contexto.ts";
import { Entidad } from "../../../../contextos/comun/diseño.ts";
import { Direccion, DireccionCliente } from "../../cliente/diseño.ts";
// import "./MaestroAcciones.css";

export type Acciones<T extends Entidad> = {
  obtenerTodos: () => Promise<T[]>;
  obtenerUno: (direccionId: string) => Promise<T>;
  crearDireccion: (direccion: Direccion) => Promise<void>;
  cambiarDireccion: (direccion: DireccionCliente) => Promise<void>;
};

type MaestroProps<T extends Entidad> = {
  acciones: Acciones<T>;
};

export const MaestroDireccionesAcciones = <T extends Entidad>({
  acciones,
}: MaestroProps<T>) => {

  const {
    cambiarDireccion,
    crearDireccion,
    obtenerTodos,
    obtenerUno,
  } = acciones;
  
  const context = useContext(Contexto);
  if (!context) {
    throw new Error("Contexto es nulo");
  }
  const { entidades, setEntidades, seleccionada } = context;

  const buscarPorId = (id: string) => {
    return entidades.find((entidad) => entidad.id === id);
  }

  const actualizarDireccion = (direccion: DireccionCliente) => {
    console.log('direccion', direccion);

    setEntidades(entidades.map((entidad) => {
        if (entidad.id === direccion.id) {
          return direccion;
        }
        return entidad;
      })
    );
  }

  const onCrearDireccion = () => {
    const direccion: Direccion = direccionEjemplo;

    crearDireccion(direccion)
      .then(() => {
        obtenerTodos()
        .then((direcciones) => {
          setEntidades(direcciones as T[]);
        });
    });
  }

  const onCambiarDireccion = () => {
    if (!seleccionada) {
      return;
    }
    const original = buscarPorId(seleccionada.id) as DireccionCliente
    const cambiada = hacerCambioDireccion(original);
    
    cambiarDireccion(cambiada)
      .then(() => {
        obtenerUno(cambiada.id)
        .then((direccion) => {
          actualizarDireccion(direccion as unknown as DireccionCliente);
        });
    });
  }

  return (
    <div className="MaestroAcciones">
      <button onClick={onCrearDireccion}>Crear</button>
      <button onClick={onCambiarDireccion}>Cambiar</button>
    </div>
  );
};

const direccionEjemplo = {
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

const hacerCambioDireccion = (dirCliente: DireccionCliente) => {
  return {
    ...dirCliente,
    direccion: {
      ...dirCliente.direccion,
      nombre_via: dirCliente.direccion.nombre_via + "!"
    }
  };
}