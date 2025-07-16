import { useEffect, useState } from "react";
import {
  Criteria,
  Entidad,
  Filtro,
  Orden,
  Paginacion,
} from "../../contextos/comun/diseño.ts";
import { MetaTabla, QTabla } from "../atomos/qtabla.tsx";
import { expandirEntidad } from "../detalle/helpers.tsx";
import { SinDatos } from "../SinDatos/SinDatos.tsx";
import { filtrarEntidad } from "./maestroFiltros/filtro.ts";
import { MaestroFiltros } from "./maestroFiltros/MaestroFiltros.tsx";

const datosCargando = <T extends Entidad>() =>
  new Array(10).fill(null).map(
    (_, i) =>
      ({
        id: i.toString(),
        ...Object.fromEntries(
          new Array(10).fill(null).map((_, j) => [j, "U00A0"])
        ),
      } as T)
  );

const obtenerCampos = (entidad: Entidad | null): string[] => {
  if (!entidad) return [];

  return expandirEntidad(entidad).map(([clave]) => clave);
};

export type MaestroProps<T extends Entidad> = {
  metaTabla: MetaTabla<T>;
  criteria?: Criteria;
  entidades: T[];
  setEntidades: (entidades: T[]) => void;
  seleccionada: T | null;
  setSeleccionada: (seleccionada: T) => void;
  cargar: (
    filtro: Filtro,
    orden: Orden,
    paginacion?: Paginacion
  ) => Promise<T[]>;
  modoPaginacion?: "clasica" | "scroll";
};

export const Listado = <T extends Entidad>({
  metaTabla,
  criteria = {
    filtros: [],
    orden: ["id", "DESC"],
    paginacion: { tamaño: 5, pagina: 1 },
  },
  entidades,
  setEntidades,
  seleccionada,
  setSeleccionada,
  cargar,
  modoPaginacion = "scroll",
}: MaestroProps<T>) => {
  const [cargando, setCargando] = useState(true);
  const [filtro, setFiltro] = useState<Filtro>(criteria.filtros);
  const [orden, setOrden] = useState<Orden>(criteria.orden);
  const [paginacion, setPaginacion] = useState<Paginacion>(
    criteria.paginacion || { tamaño: 5, pagina: 1 }
  );
  const [total, setTotal] = useState(0);

  useEffect(() => {
    let hecho = false;
    setCargando(true);

    cargar(filtro, orden, paginacion).then((entidadesNuevas) => {
      if (hecho) return;
      if (modoPaginacion === "scroll" && paginacion.pagina > 1) {
        setEntidades((prev) => [...prev, ...(entidadesNuevas as T[])]);
      } else {
        setEntidades(entidadesNuevas as T[]);
      }
      setTotal(20);
      setCargando(false);
    });

    return () => {
      hecho = true;
    };
  }, [filtro, orden, paginacion, cargar, setEntidades, modoPaginacion]);

  useEffect(() => {
    setPaginacion((p) => ({ ...p, pagina: 1 }));
    setEntidades([]);
  }, [filtro, orden, modoPaginacion, setEntidades]);

  const entidadesFiltradas = entidades.filter((entidad) =>
    filtrarEntidad(entidad, filtro)
  );

  const renderEntidades = () => {
    if (!entidadesFiltradas.length && !cargando) return <SinDatos />;

    const datos = entidadesFiltradas.length
      ? entidadesFiltradas
      : datosCargando<T>();

    return (
      <QTabla
        metaTabla={metaTabla}
        datos={datos}
        cargando={cargando}
        seleccionadaId={seleccionada?.id}
        onSeleccion={(entidad) => setSeleccionada(entidad as T)}
        orden={orden}
        onOrdenar={(clave) => {
          setOrden([clave]);
        }}
      />
    );
  };

  const renderPaginacionClasica = () => {
    const totalPaginas = Math.ceil(total / paginacion.tamaño);
    return (
      <div className="paginacion">
        <button
          disabled={paginacion.pagina === 1}
          onClick={() => setPaginacion((p) => ({ ...p, pagina: p.pagina - 1 }))}
        >
          Anterior
        </button>
        <span>
          Página {paginacion.pagina} de {totalPaginas}
        </span>
        <button
          disabled={paginacion.pagina === totalPaginas}
          onClick={() => setPaginacion((p) => ({ ...p, pagina: p.pagina + 1 }))}
        >
          Siguiente
        </button>
        {/* <select
          value={paginacion.tamaño}
          onChange={(e) => {
            setPaginacion({ tamaño: Number(e.target.value), pagina: 1 });
          }}
        >
          {[5, 10, 20, 50, 100].map((n) => (
            <option key={n} value={n}>
              {n} por página
            </option>
          ))}
        </select> */}
      </div>
    );
  };

  const renderScrollSiguiente = () => {
    const totalPaginas = Math.ceil(total / paginacion.tamaño);
    return (
      <div
        className="scroll-paginacion"
        style={{ textAlign: "center", margin: "1em 0" }}
      >
        <button
          disabled={paginacion.pagina >= totalPaginas}
          onClick={() => setPaginacion((p) => ({ ...p, pagina: p.pagina + 1 }))}
        >
          Siguiente
        </button>
        <span>
          {entidades.length} / {total}
        </span>
      </div>
    );
  };

  return (
    <div className="Listado">
      <MaestroFiltros
        campos={obtenerCampos(entidades[0])}
        filtro={filtro}
        cambiarFiltro={(clave, valor, operador = "~") => {
          const nuevoFiltro: Filtro = [
            ...filtro.filter(([k]) => k !== clave),
            [clave, operador, valor],
          ];
          setFiltro(nuevoFiltro);
        }}
        borrarFiltro={(clave) => {
          setFiltro(filtro.filter(([k]) => k !== clave));
        }}
        resetearFiltro={() => {
          setFiltro(criteria.filtros);
          setPaginacion({ tamaño: 5, pagina: 1 });
          setEntidades([]);
        }}
      />
      {renderEntidades()}
      {modoPaginacion === "clasica" && renderPaginacionClasica()}
      {modoPaginacion === "scroll" && renderScrollSiguiente()}
    </div>
  );
};
