import { useEffect, useState } from "react";
import {
  Criteria,
  Entidad,
  Filtro,
  Orden,
  Paginacion,
  RespuestaLista,
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
  tamañoPagina?: number;
  cargar: (
    filtro: Filtro,
    orden: Orden,
    paginacion?: Paginacion
  ) => RespuestaLista<T>;
};

export const Listado = <T extends Entidad>({
  metaTabla,
  criteria = { filtros: [], orden: ["id", "ASC"] },
  entidades,
  setEntidades,
  seleccionada,
  setSeleccionada,
  tamañoPagina = 5,
  cargar,
}: MaestroProps<T>) => {
  const [cargando, setCargando] = useState(true);
  const [filtro, setFiltro] = useState<Filtro>(criteria.filtros);
  const [orden, setOrden] = useState<Orden>(criteria.orden);
  const [paginacion, setPaginacion] = useState<Paginacion>(
    criteria.paginacion || { limite: tamañoPagina, pagina: 1 }
  );
  const [totalRegistros, setTotalRegistros] = useState(0);

  useEffect(() => {
    let hecho = false;
    setCargando(true);

    cargar(filtro, orden, paginacion).then(({ datos, total }) => {
      if (hecho) return;
      if (datos.length > 0) {
        setEntidades(datos as T[]);
        if (total && total > 0) {
          setTotalRegistros(total);
        }
      }
      setCargando(false);
    });

    return () => {
      hecho = true;
    };
  }, [filtro, orden, paginacion, cargar, setEntidades]);

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
          const [antigua_clave, antiguo_sentido] = orden ?? [null, null];
          const sentido =
            antigua_clave === clave && antiguo_sentido === "ASC"
              ? "DESC"
              : "ASC";

          setOrden([clave, sentido]);
        }}
        paginacion={paginacion}
        onPaginacion={(pagina, limite) => {
          setPaginacion({ pagina, limite });
        }}
        totalEntidades={totalRegistros}
      />
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
          setPaginacion({ limite: tamañoPagina, pagina: 1 });
          setEntidades([]);
        }}
      />
      {renderEntidades()}
    </div>
  );
};
