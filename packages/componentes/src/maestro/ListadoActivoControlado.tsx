import { Criteria, Entidad } from "@olula/lib/diseño.ts";
import { criteriaDefecto } from "@olula/lib/dominio.js";
import { MetaTabla } from "../atomos/qtabla.tsx";
import { QTablaControlada } from "../atomos/qtablacontrolada.tsx";
import { QTarjetas } from "../atomos/qtarjetas.tsx";
import { SinDatos } from "../SinDatos/SinDatos.tsx";
import "./Listado.css";
import { MaestroFiltrosControlado } from "./maestroFiltros/MaestroFiltrosControlado.tsx";

const datosCargando = <T extends Entidad>() =>
  new Array(10).fill(null).map(
    (_, i) =>
      ({
        id: i.toString(),
        ...Object.fromEntries(
          new Array(10).fill(null).map((_, j) => [j, "U00A0"])
        ),
      }) as T
  );

type Modo = "tabla" | "tarjetas";

type MaestroProps<T extends Entidad> = {
  metaTabla?: MetaTabla<T>;
  metaFiltro?: boolean;
  cargando?: boolean;
  tarjeta?: (entidad: T) => React.ReactNode;
  criteriaInicial?: Criteria;
  criteria?: Criteria;
  entidades: T[];
  totalEntidades: number;
  seleccionada?: string;
  onSeleccion: (seleccionada: string) => void;
  modo?: Modo;
  onCriteriaChanged: (criteria: Criteria) => void;
};

export const ListadoActivoControlado = <T extends Entidad>({
  metaTabla,
  metaFiltro = false, // TODO: Pasar una estructura que defina el filtro y no mostrar filtro si es undefined
  cargando = false,
  criteriaInicial = criteriaDefecto,
  criteria = criteriaDefecto,
  tarjeta,
  entidades,
  totalEntidades,
  seleccionada,
  onSeleccion,
  modo = "tabla",
  onCriteriaChanged,
}: MaestroProps<T>) => {
  const renderEntidades = () => {
    if (!entidades.length && !cargando) return <SinDatos />;

    const datos = entidades.length ? entidades : datosCargando<T>();

    if (modo == "tarjetas" && tarjeta) {
      return (
        <QTarjetas
          tarjeta={tarjeta}
          datos={datos}
          cargando={cargando}
          seleccionadaId={seleccionada}
          onSeleccion={(e: T) => onSeleccion(e.id)}
          paginacion={criteria.paginacion}
          onPaginacion={(pagina, limite) => {
            onCriteriaChanged({ ...criteria, paginacion: { pagina, limite } });
          }}
          totalEntidades={entidades.length}
          orden={criteria.orden}
        />
      );
    }

    if (modo == "tabla" && metaTabla) {
      return (
        <QTablaControlada
          metaTabla={metaTabla}
          datos={datos}
          cargando={cargando}
          seleccionadaId={seleccionada}
          onSeleccion={(e: T) => onSeleccion(e.id)}
          orden={criteria.orden}
          onOrdenChanged={(orden) => {
            onCriteriaChanged({
              ...criteria,
              orden,
              paginacion: { ...criteria.paginacion, pagina: 1 },
            });
          }}
          paginacion={criteria.paginacion}
          onPaginacionChanged={(paginacion) => {
            onCriteriaChanged({
              ...criteria,
              paginacion,
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
      {/* {tarjeta && metaTabla && (
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
        )} */}
      {metaFiltro && (
        <MaestroFiltrosControlado
          campos={metaTabla?.map((c) => c.id) ?? []}
          filtro={criteria.filtro}
          filtroInicial={criteriaInicial.filtro}
          onFiltroChanged={(filtro) => {
            onCriteriaChanged({
              ...criteria,
              filtro,
            });
          }}
        />
      )}
      {renderEntidades()}
    </div>
  );
};
