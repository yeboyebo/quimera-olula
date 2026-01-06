import {
  Criteria,
  Entidad,
  Filtro,
  Orden,
  Paginacion
} from "@olula/lib/diseño.ts";
import { useState } from "react";
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
  // setEntidades: (entidades: T[]) => void;
  seleccionada: T | null;
  setSeleccionada: (seleccionada: T) => void;
  modo?: Modo;
  setModo?: (modo: Modo) => void;
  recargar: (filtro: Filtro, orden: Orden, paginacion: Paginacion) => void;
  // cargar: (
  //   filtro: Filtro,
  //   orden: Orden,
  //   paginacion: Paginacion
  // ) => RespuestaLista<T>;
};

export const ListadoControlado = <T extends Entidad>({
  metaTabla,
  criteria = {
    filtros: [],
    orden: ["id", "DESC"],
    paginacion: { limite: 10, pagina: 1 },
  },
  tarjeta,
  entidades,
  totalEntidades,
  seleccionada,
  setSeleccionada,
  modo = "tabla",
  recargar,
  setModo,
}: MaestroProps<T>) => {
  const [cargando, setCargando] = useState(false);
  const [filtro, setFiltro] = useState<Filtro>(criteria.filtros);
  const [orden, setOrden] = useState<Orden>(criteria.orden);
  const [paginacion, setPaginacion] = useState<Paginacion>(criteria.paginacion);
  // const [totalRegistros, setTotalRegistros] = useState(0);
  // const { setError } = useContext(ContextoError);

  // useEffect(() => {
  //   let hecho = false;
  //   setCargando(true);
  //   cargar(filtro, orden, paginacion)
  //     .then(({ datos, total }) => {
  //       if (hecho) return;
  //       if (datos.length > 0) {
  //         setEntidades(datos as T[]);
  //         if (total && total > 0) {
  //           setTotalRegistros(total);
  //         }
  //       }
  //       setCargando(false);
  //     })
  //     .catch((error) => {
  //       if (hecho) return;
  //       const apiError = error as QError;
  //       setError({
  //         nombre: apiError.nombre,
  //         descripcion: apiError.descripcion,
  //       });
  //     });

  //   return () => {
  //     hecho = true;
  //   };
  // }, [filtro, orden, paginacion, cargar, setEntidades, setError]);

  const entidadesFiltradas = entidades.filter((entidad) =>
    filtrarEntidad(entidad, filtro)
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
          // onSeleccion={(entidad) => setSeleccionada(entidad as T)}
          onSeleccion={(entidad) => setSeleccionada(entidad as T)}
          paginacion={paginacion}
          onPaginacion={(pagina, limite) => {
            setPaginacion({ pagina, limite });
            recargar(filtro, orden, { ...paginacion, pagina, limite });
          }}
          // totalEntidades={totalRegistros}
          totalEntidades={entidades.length}
          orden={orden}
          onOrdenar={(clave) => {
            const [antigua_clave, antiguo_sentido] = orden ?? [null, null];
            const sentido =
              antigua_clave === clave && antiguo_sentido === "ASC"
                ? "DESC"
                : "ASC";

            setOrden([clave, sentido]);
            setPaginacion({ ...paginacion, pagina: 1 });
            recargar(filtro, [clave, sentido], { ...paginacion, pagina: 1 });
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
          orden={orden}
          onOrdenar={(clave) => {
            const [antigua_clave, antiguo_sentido] = orden ?? [null, null];
            const sentido =
              antigua_clave === clave && antiguo_sentido === "ASC"
                ? "DESC"
                : "ASC";

            setOrden([clave, sentido]);
            setPaginacion({ ...paginacion, pagina: 1 });
            recargar(filtro, [clave, sentido], { ...paginacion, pagina: 1 });
          }}
          paginacion={paginacion}
          onPaginacion={(pagina, limite) => {
            setPaginacion({ pagina, limite });
            recargar(filtro, orden, { ...paginacion, pagina, limite });
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
        filtro={filtro}
        cambiarFiltro={(clave, valor, operador = "~") => {
          const nuevoFiltro: Filtro = [
            ...filtro.filter(([k]) => k !== clave),
            [clave, operador, valor],
          ];
          setFiltro(nuevoFiltro);
          recargar(nuevoFiltro, orden, paginacion);
        }}
        borrarFiltro={(clave) => {
          setFiltro(filtro.filter(([k]) => k !== clave));
          recargar(filtro.filter(([k]) => k !== clave), orden, paginacion);
        }}
        resetearFiltro={() => {
          setFiltro(criteria.filtros);
          setPaginacion({ ...paginacion, pagina: 1 });
          recargar(criteria.filtros, orden, { ...paginacion, pagina: 1 });
          // setEntidades([]);
        }}
      />
      {renderEntidades()}
    </div>
  );
};
