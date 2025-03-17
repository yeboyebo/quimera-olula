import { FormEvent, useContext } from "react";
import { Contexto } from "../../../contextos/comun/contexto.ts";
import { Acciones, Entidad } from "../../../contextos/comun/diseño.ts";
import {
  CampoFormularioGenerico,
  OpcionCampo,
} from "../../detalle/FormularioGenerico.tsx";
import {
  expandirEntidad,
  formatearClave,
  renderInput,
  renderSelect,
} from "../../detalle/helpers.tsx";
import "./MaestroFiltros.css";
import { Filtro } from "./filtro.ts";

const obtenerCampos = (entidad: Entidad | null): OpcionCampo[] => {
  if (!entidad) return [];

  const entidadExpandida = expandirEntidad(entidad);

  return entidadExpandida.map(([clave]) => [clave, formatearClave(clave)]);
};

const selectorCampo = (campos: OpcionCampo[]) => {
  const attrsCampo: CampoFormularioGenerico = {
    nombre: "campo",
    etiqueta: "Filtro",
    tipo: "select",
    requerido: true,
    opciones: campos,
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

type MaestroProps<T extends Entidad> = {
  acciones: Acciones<T>;
  filtro: Filtro;
  setFiltro: (filtro: Filtro) => void;
};

export const MaestroFiltros = <T extends Entidad>({
  acciones,
  filtro,
  setFiltro,
}: MaestroProps<T>) => {
  const { buscar } = acciones;

  const context = useContext(Contexto);
  if (!context) {
    throw new Error("Contexto is null");
  }

  const { entidades, setEntidades } = context;

  const campos = obtenerCampos(entidades[0]);

  const filtrosActuales = Object.entries(filtro ?? {}).map(([clave, valor]) => {
    const etiqueta = campos.find((campo) => campo[0] === clave)?.[1];
    const valorMostrado = valor.like;

    return (
      <div
        key={clave}
        onClick={() => {
          const { [clave]: _, ...resto } = filtro ?? {};
          setFiltro(resto);
        }}
      >
        <span>{etiqueta}:</span>
        <span>{valorMostrado}</span>
      </div>
    );
  });

  const onBuscar = (event: FormEvent): void => {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);
    const campo = formData.get("campo") as string;
    const valor = formData.get("valor") as string;

    if (!campo) return;

    setFiltro({ ...(filtro ?? {}), [campo]: { like: valor } });

    if (!buscar) return;

    buscar(campo, valor).then((entidades) => setEntidades(entidades as T[]));
  };

  const onLimpiar = () => {
    setFiltro(null);
  };

  return (
    <div className="MaestroFiltros">
      <form onSubmit={onBuscar} onReset={onLimpiar}>
        {selectorCampo(campos)}
        {inputFiltro()}
        <quimera-boton tipo="submit" tamaño="pequeño">
          Buscar
        </quimera-boton>
        <quimera-boton tipo="reset" variante="texto" tamaño="pequeño">
          Limpiar
        </quimera-boton>
      </form>
      <etiquetas-filtro>{filtrosActuales}</etiquetas-filtro>
    </div>
  );
};
