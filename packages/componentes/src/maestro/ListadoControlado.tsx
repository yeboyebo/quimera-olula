import {
    Criteria,
    Entidad,
    Filtro
} from "@olula/lib/diseño.ts";
import { criteriaDefecto } from "@olula/lib/dominio.js";
import { useCallback, useState } from "react";
import { QIcono } from "../atomos/qicono.tsx";
import { MetaTabla, QTabla } from "../atomos/qtabla.tsx";
import { QTarjetas } from "../atomos/qtarjetas.tsx";
import { expandirEntidad } from "../detalle/helpers.tsx";
import { SinDatos } from "../SinDatos/SinDatos.tsx";
import "./Listado.css";
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

type Modo = "tabla" | "tarjetas";

type MaestroProps<T extends Entidad> = {
  metaTabla?: MetaTabla<T>;
  tarjeta?: (entidad: T) => React.ReactNode;
  criteria?: Criteria;
  entidades: T[];
  totalEntidades: number;
  seleccionada: T | null;
  setSeleccionada: (seleccionada: T) => void;
  modo?: Modo;
  setModo?: (modo: Modo) => void;
  recargar: (criteria: Criteria) => void;
};

export const ListadoControlado = <T extends Entidad>({
  metaTabla,
  criteria = criteriaDefecto,
  tarjeta,
  entidades,
  totalEntidades,
  seleccionada,
  setSeleccionada,
  modo = "tabla",
  recargar,
  setModo,
}: MaestroProps<T>) => {

    const cargando = false;

    const [criteria_, setCriteria] = useState<Criteria>(criteria);

    const cambiarCriteria = useCallback(
        (c: Criteria) => {
            setCriteria(c);
            recargar(c);
        },
        [criteria_, setCriteria, recargar]
    );


    const entidadesFiltradas = entidades.filter((entidad) =>
        filtrarEntidad(entidad, criteria_.filtros)
    );

    const renderEntidades = () => {
        if (!entidadesFiltradas.length && !cargando) return <SinDatos />;

        const datos = entidadesFiltradas.length
        ? entidadesFiltradas
        : datosCargando<T>();

        if (modo == "tarjetas" && tarjeta) {
        return (
            <QTarjetas
                tarjeta={tarjeta}
                datos={datos}
                cargando={cargando}
                seleccionadaId={seleccionada?.id}
                onSeleccion={(entidad) => setSeleccionada(entidad as T)}
                paginacion={criteria_.paginacion}
                onPaginacion={(pagina, limite) => {
                    cambiarCriteria({ ...criteria_, paginacion: { pagina, limite } });
                }}
                totalEntidades={entidades.length}
                orden={criteria_.orden}
                onOrdenar={(clave) => {
                    const [antigua_clave, antiguo_sentido] = criteria_.orden ?? [null, null];
                    const sentido =
                    antigua_clave === clave && antiguo_sentido === "ASC"
                        ? "DESC"
                        : "ASC";

                    cambiarCriteria({
                        ...criteria_,
                        orden: [clave, sentido],
                        paginacion: { ...criteria_.paginacion, pagina: 1 },
                    });
                }}
            />
        );
        }

        if (modo == "tabla" && metaTabla) {
        return (
            <QTabla
                metaTabla={metaTabla}
                datos={datos}
                cargando={cargando}
                seleccionadaId={seleccionada?.id}
                onSeleccion={(entidad) => setSeleccionada(entidad as T)}
                orden={criteria_.orden}
                onOrdenar={(clave) => {
                    const [antigua_clave, antiguo_sentido] = criteria_.orden ?? [null, null];
                    const sentido =
                    antigua_clave === clave && antiguo_sentido === "ASC"
                        ? "DESC"
                        : "ASC";
                    cambiarCriteria({
                        ...criteria_,
                        orden: [clave, sentido],
                        paginacion: { ...criteria_.paginacion, pagina: 1 },
                    });
                }}
                paginacion={criteria_.paginacion}
                onPaginacion={(pagina, limite) => {
                    cambiarCriteria({
                        ...criteria_,
                        paginacion: { pagina, limite },
                    });
                }}
                totalEntidades={totalEntidades}
            />
        );
        }

        return null;
    };

    return (
        <div className="Listado">
        {tarjeta && metaTabla && (
            <div className="cambio-modo">
            <span
                className="cambio-modo-icono"
                onClick={() =>
                    setModo && setModo(modo === "tabla" ? "tarjetas" : "tabla")
                }
            >
                <QIcono nombre={modo === "tabla" ? "lista" : "tabla"} tamaño="md" />
            </span>
            </div>
        )}
        <MaestroFiltros
            campos={obtenerCampos(entidades[0])}
            filtro={criteria_.filtros}
            cambiarFiltro={(clave, valor, operador = "~") => {
                const nuevoFiltro: Filtro = [
                    ...criteria_.filtros.filter(([k]) => k !== clave),
                    [clave, operador, valor],
                ];
                cambiarCriteria({
                    ...criteria_,
                    filtros: nuevoFiltro,
                });
            }}
            borrarFiltro={(clave) => {
                cambiarCriteria({
                    ...criteria_,
                    filtros: criteria_.filtros.filter(([k]) => k !== clave),
                });
            }}
            resetearFiltro={() => {
                cambiarCriteria({
                    ...criteria_,
                    filtros: criteria.filtros,
                    paginacion: { ...criteria_.paginacion, pagina: 1 },
                });
            }}
        />
        {renderEntidades()}
        </div>
    );
};
