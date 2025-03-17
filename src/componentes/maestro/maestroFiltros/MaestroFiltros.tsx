import { FormEvent, useContext } from "react";
import { Contexto } from "../../../contextos/comun/contexto.ts";
import { Acciones, Entidad } from "../../../contextos/comun/diseño.ts";
import { CampoFormularioGenerico } from "../../detalle/FormularioGenerico.tsx";
import {
  expandirEntidad,
  formatearClave,
  renderInput,
  renderSelect,
} from "../../detalle/helpers.tsx";
import "./MaestroFiltros.css";

type MaestroProps<T extends Entidad> = {
  acciones: Acciones<T>;
  setFiltro: (filtro: { [campo: string]: string } | null) => void;
};

export const MaestroFiltros = <T extends Entidad>({
  acciones,
  setFiltro,
}: MaestroProps<T>) => {
  const { buscar } = acciones;

  const context = useContext(Contexto);
  if (!context) {
    throw new Error("Contexto is null");
  }

  const { entidades, setEntidades } = context;

  const onBuscar = (event: FormEvent): void => {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);
    const campo = formData.get("campo") as string;
    const valor = formData.get("valor") as string;

    if (!buscar) {
      setFiltro({ [campo]: valor });
      return;
    }

    buscar(campo, valor).then((entidades) => setEntidades(entidades as T[]));
  };

  const onLimpiar = () => {
    setFiltro(null);
  };

  const obtenerCampos = () => {
    const entidad = entidades[0];
    if (!entidad) return [];

    const entidadExpandida = expandirEntidad(entidad);

    return entidadExpandida.map(([clave]) => ({
      campo: clave,
      descripcion: formatearClave(clave),
    }));
  };

  const selectorCampo = () => {
    const attrsCampo: CampoFormularioGenerico = {
      nombre: "campo",
      etiqueta: "Filtro",
      tipo: "select",
      requerido: true,
      opciones: obtenerCampos(),
      condensado: true,
    };

    return renderSelect(attrsCampo, {} as Entidad);
  };

  const inputFiltro = () => {
    const attrsValor: CampoFormularioGenerico = {
      nombre: "valor",
      etiqueta: "&nbsp;",
      placeholder: "Valor a filtrar",
      tipo: "text",
      requerido: true,
      condensado: true,
    };
    return renderInput(attrsValor, {} as Entidad);
  };

  return (
    <div className="MaestroFiltros">
      <form onSubmit={onBuscar} onReset={onLimpiar}>
        {selectorCampo()}
        {inputFiltro()}
        <quimera-boton tipo="submit" tamaño="pequeño">
          Buscar
        </quimera-boton>
        <quimera-boton tipo="reset" variante="texto" tamaño="pequeño">
          Limpiar
        </quimera-boton>
      </form>
    </div>
  );
};
