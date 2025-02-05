import { useEffect, useState, useContext } from "react";
import {type Entidad, MasterContext, type MasterProps } from "../Master";
import './MasterFiltros.css';


export const MasterFiltros = <T extends Entidad>({ acciones }: MasterProps<T>) => {
  // const { crearUno, actualizarUno } = acciones;
  const [originalEntidades, setOriginalEntidades] = useState<T[]>([]);
  const context = useContext(MasterContext);
  if (!context) {
    throw new Error("MasterContext is null");
  }
  const { entidades, setEntidades } = context;

  useEffect(() => {
    setOriginalEntidades(entidades);
  }, []);

  const onBuscar = (formData: { get: (arg0: string) => any; }) => {
    const nombre = formData.get("nombre");
    const id = formData.get("id");
    if(nombre && nombre != ""){
      const entidadesFiltradas = entidades.filter(entidad => entidad.nombre.includes(nombre));
      setEntidades(entidadesFiltradas);
    }else if(id && id != ""){
      console.log(id);
      const entidadesFiltradas = entidades.filter(entidad => entidad.id.includes(id));
      setEntidades(entidadesFiltradas);
    }
  };
  const onLimpiar = () => {
    setEntidades(originalEntidades);
  };

  return (
    <div className="MasterFiltros">
      <form action={onBuscar}>
        <input type="text" name="nombre" placeholder="Nombre" />
        <input type="text" name="id" placeholder="Id Fiscal" />
        <button>Buscar</button>
      </form>
      <form action={onLimpiar}>
        <button>Limpiar</button>
      </form>
    </div>
  );
};
