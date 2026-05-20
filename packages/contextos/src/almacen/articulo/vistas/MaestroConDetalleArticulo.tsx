import { MaestroDetalle, QBoton } from "@olula/componentes/index.ts";
import { ListadoSemiControlado } from "@olula/componentes/maestro/ListadoSemiControlado.tsx";
import { Criteria, ListaSeleccionable } from "@olula/lib/diseño.ts";
import { criteriaDefecto } from "@olula/lib/dominio.ts";
import {
  cambiarItem,
  cargar,
  getSeleccionada,
  incluirItem,
  listaSeleccionableVacia,
  quitarItem,
  seleccionarItem,
} from "@olula/lib/entidad.ts";
import { pipe } from "@olula/lib/funcional.ts";
import {
  ConfigMaquina4,
  Maquina3,
  useMaquina4,
} from "@olula/lib/useMaquina.ts";
import { useCallback, useEffect, useState } from "react";
import { Articulo } from "../diseño.ts";
import { getArticulos } from "../infraestructura.ts";
import { CrearArticulo } from "./CrearArticulo.tsx";
import { DetalleArticulo } from "./DetalleArticulo/DetalleArticulo.tsx";

const metaTablaArticulo = [
  { id: "id", cabecera: "ID" },
  { id: "nombre", cabecera: "Nombre" },
  { id: "descripcion", cabecera: "Descripción" },
  { id: "estado", cabecera: "Estado" },
];

type Estado = "inactivo" | "creando" | "borrando";
type Contexto = { articulos: ListaSeleccionable<Articulo> };

const setArticulos =
  (
    aplicable: (
      articulos: ListaSeleccionable<Articulo>
    ) => ListaSeleccionable<Articulo>
  ) =>
  (maquina: Maquina3<Estado, Contexto>) => ({
    ...maquina,
    contexto: {
      ...maquina.contexto,
      articulos: aplicable(maquina.contexto.articulos),
    },
  });

const configMaquina: ConfigMaquina4<Estado, Contexto> = {
  inicial: {
    estado: "inactivo",
    contexto: {
      articulos: listaSeleccionableVacia<Articulo>(),
    },
  },
  estados: {
    inactivo: {
      crear: "creando",
      articulo_cambiado: ({ maquina, payload }) =>
        pipe(maquina, setArticulos(cambiarItem(payload as Articulo))),
      articulo_seleccionado: ({ maquina, payload }) =>
        pipe(maquina, setArticulos(seleccionarItem(payload as Articulo))),
      articulo_borrado: ({ maquina }) => {
        const { articulos } = maquina.contexto;
        if (!articulos.idActivo) return maquina;
        return pipe(maquina, setArticulos(quitarItem(articulos.idActivo)));
      },
      articulos_cargados: ({ maquina, payload }) =>
        pipe(maquina, setArticulos(cargar(payload as Articulo[]))),
      borrar: "borrando",
      seleccion_cancelada: ({ maquina }) =>
        pipe(
          maquina,
          setArticulos((articulos) => ({
            ...articulos,
            idActivo: null,
          }))
        ),
    },
    creando: {
      articulo_creado: ({ maquina, payload, setEstado }) =>
        pipe(
          maquina,
          setEstado("inactivo"),
          setArticulos(incluirItem(payload as Articulo, {}))
        ),
      creacion_cancelada: "inactivo",
    },
    borrando: {
      borrado_cancelado: "inactivo",
      borrado_confirmado: "inactivo",
    },
  },
};

export const MaestroConDetalleArticulo = () => {
  const [emitir, { estado, contexto }] = useMaquina4({ config: configMaquina });
  const { articulos } = contexto;
  const [criteria, setCriteria] = useState<Criteria>(criteriaDefecto);
  const [cargando, setCargando] = useState(false);
  const [totalArticulos, setTotalArticulos] = useState(0);

  useEffect(() => {
    const cargarArticulos = async () => {
      setCargando(true);
      const respuesta = await getArticulos(
        criteria.filtro,
        criteria.orden,
        criteria.paginacion
      );
      emitir("articulos_cargados", respuesta.datos);
      setTotalArticulos(respuesta.total);
      setCargando(false);
    };
    cargarArticulos();
  }, [criteria, emitir]);

  const setSeleccionada = useCallback(
    (payload: Articulo) => emitir("articulo_seleccionado", payload),
    [emitir]
  );

  const seleccionada = getSeleccionada(articulos);
  const publicar = async (evento: string, payload?: unknown) => {
    emitir(evento, payload);
  };

  return (
    <div className="Articulo">
      <MaestroDetalle<Articulo>
        seleccionada={seleccionada?.id}
        Maestro={
          <>
            <h2>Articulos</h2>
            <ListadoSemiControlado<Articulo>
              metaTabla={metaTablaArticulo}
              entidades={articulos.lista}
              totalEntidades={totalArticulos || articulos.lista.length}
              cargando={cargando}
              criteriaInicial={criteriaDefecto}
              seleccionada={seleccionada}
              renderAcciones={() => (
                <div className="maestro-botones">
                  <QBoton onClick={() => emitir("crear")}>Nueva</QBoton>
                </div>
              )}
              onSeleccion={setSeleccionada}
              onCriteriaChanged={setCriteria}
            />
          </>
        }
        modoDisposicion="maestro-50"
        Detalle={
          <DetalleArticulo
            key={seleccionada?.id}
            articuloInicial={seleccionada}
            publicar={publicar}
          />
        }
      />
      <CrearArticulo emitir={publicar} activo={estado === "creando"} />
    </div>
  );
};
