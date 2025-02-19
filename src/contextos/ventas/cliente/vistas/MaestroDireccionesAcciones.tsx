import { useContext } from "react";
import { Contexto } from "../../../../contextos/comun/contexto.ts";
import { Direccion, DireccionCliente } from "../../cliente/diseño.ts";
// import "./MaestroAcciones.css";

export type Acciones = {
  obtenerTodos: () => Promise<DireccionCliente[]>;
  obtenerUno: (direccionId: string) => Promise<DireccionCliente>;
  crearUno: (direccion: Direccion) => Promise<void>;
  actualizarUno: (dirClienteId: string, direccion: Direccion) => Promise<void>;
  eliminarUno: (direccionId: string) => Promise<void>;
  marcarFacturacion: (direccionId: string) => Promise<void>;
};

type MaestroProps = {
  acciones: Acciones;
};

export const MaestroDireccionesAcciones = ({
  acciones,
}: MaestroProps) => {

  const {
    actualizarUno,
    crearUno,
    obtenerTodos,
    obtenerUno,
    eliminarUno,
    marcarFacturacion,
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

  const quitarDireccion = (direccionId: string) => {
    setEntidades(entidades.filter((entidad) => entidad.id !== direccionId));
  }
  
  const onCrearDireccion = () => {
    const direccion: Direccion = direccionEjemplo;

    crearUno(direccion)
      .then(() => {
        obtenerTodos()
        .then((direcciones) => {
          setEntidades(direcciones);
        });
    });
  }

  const onCambiarDireccion = () => {
    if (!seleccionada) {
      return;
    }
    const original = buscarPorId(seleccionada.id) as DireccionCliente
    const cambiada = hacerCambioDireccion(original);
    
    actualizarUno(cambiada.id, cambiada.direccion)
      .then(() => {
        obtenerUno(cambiada.id)
        .then((direccion) => {
          actualizarDireccion(direccion as unknown as DireccionCliente);
        });
    });
  }

  const onMarcarFacturacion = () => {
    if (!seleccionada) {
      return;
    }
    const dirClienteId = seleccionada.id
    
    marcarFacturacion(dirClienteId)
      .then(() => {
        obtenerTodos()
        .then((direcciones) => {
          setEntidades(direcciones);
        });
    });
  }


  const onBorrarDireccion = () => {
    if (!seleccionada) {
      return;
    }
    const dirClienteId = seleccionada.id
    
    eliminarUno(dirClienteId)
      .then(() => {
        quitarDireccion(dirClienteId);
    });
  }

  return (
    <div className="MaestroAcciones">
      <button onClick={onCrearDireccion}>Crear</button>
      <button onClick={onCambiarDireccion}>Cambiar</button>
      <button onClick={onBorrarDireccion}>Borrar</button>
      <button onClick={onMarcarFacturacion}>Facturación</button>
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