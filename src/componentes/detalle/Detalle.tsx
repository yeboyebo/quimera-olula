import { PropsWithChildren, useContext, useEffect } from "react";
import { Contexto } from "../../contextos/comun/contexto.ts";
import { Acciones, Entidad } from "../../contextos/comun/diseño.ts";
// import { buscar } from "../../contextos/ventas/cliente/dominio.ts";
import estilos from "./detalle.module.css";
import {
  CampoFormularioGenerico,
  FormularioGenerico,
} from "./FormularioGenerico";

interface DetalleProps<T extends Entidad> {
  id: string;
  acciones: Acciones<T>;
  onCampoCambiado?: (campo: string, valor: string) => Promise<void>;
  obtenerTitulo?: (entidad: T) => string;
  camposEntidad: CampoFormularioGenerico[];
  entidad: T | null;
  setEntidad: (entidad: T) => void;
  buscar?: (id: string) => Promise<T>;
}

export function Detalle<T extends Entidad>({
  id,
  camposEntidad,
  acciones,
  obtenerTitulo,
  children,
  onCampoCambiado,
  entidad,
  setEntidad,
  buscar,
}: PropsWithChildren<DetalleProps<T>>) {
  const { detalle } = estilos;

  const context = useContext(Contexto);
  if (!context) {
    throw new Error("Contexto is null");
  }
  const { setEntidades } = context;

  // const [entidad, setEntidad] = useState<T | null>(null);

  const esNuevo = id === "";
  const existe = id !== "0";

  const { actualizarUno, obtenerUno, crearUno } = acciones;

  useEffect(() => {
    if (!entidad || id !== entidad.id) {
      if (!existe) return;
      const load = async () => {
        const cliente = buscar
          ? await buscar(id)
          : await obtenerUno(id);
        if(cliente) {
          setEntidad(cliente);
        }
      }
      load();
    }
  }, [id, entidad, existe]);

  // if (!entidad || id !== entidad.id) {
  //   if (!existe) return;

  //   if (esNuevo) {
  //     const nuevaEntidad = camposEntidad.reduce((acc, campo) => {
  //       return { ...acc, [campo.nombre]: campo.valorInicial || "" };
  //     }, {}) as T;
  //     setEntidad(nuevaEntidad);
  //     return;
  //   }

  //   obtenerUno(id)
  //     .then((entidad) => {
  //       setEntidad(entidad as T);
  //     })
  //     .catch(() => {
  //       setEntidad({} as T);
  //     });
  // }

  if (!entidad) {
    return <>No se ha encontrado la entidad con Id: {id}</>;
  }

  const crear = (data: T) =>
    crearUno(data).then(({ id }) => {
      obtenerUno(id).then((entidad: T | null) => {
        if (!entidad) return;
        setEntidades((entidades) => [...entidades, entidad]);
      });
    });

  const actualizar = (data: T) =>
    actualizarUno(id, data).then(() => {
      setEntidades((entidades) => {
        const indice = entidades.findIndex((e) => e.id === id);
        if (indice === -1) return entidades;

        return entidades.with(indice, data);
      });
    });

  const handleSubmit = async (data: T) =>
    esNuevo ? crear(data) : actualizar(data);

  // const onCampoCambiado= (campo: string) => {
  //   console.log(`Campo cambiado: ${campo}`);
  // };

  return (
    <div className={detalle}>
      {obtenerTitulo && <h2>{obtenerTitulo(entidad)}</h2>}
      {
        camposEntidad && camposEntidad.length > 0 &&
        <FormularioGenerico
          campos={camposEntidad}
          entidad={entidad}
          setEntidad={setEntidad}
          onSubmit={handleSubmit}
          onCampoCambiado={onCampoCambiado}
        />
      }
      {children}
    </div>
  );
}
