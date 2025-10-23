import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { MaestroDetalle } from "@olula/componentes/maestro/MaestroDetalle.tsx";
import { ListaSeleccionable } from "@olula/lib/diseño.ts";
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
import { useCallback } from "react";
import { Almacen } from "../diseño.ts";
import { metaTablaAlmacen } from "../dominio.ts";
import { getAlmacenes } from "../infraestructura.ts";
import { CrearAlmacen } from "./CrearAlmacen.tsx";
import { DetalleAlmacen } from "./DetalleAlmacen/DetalleAlmacen.tsx";
// import { TarjetaAlmacen } from "./TarjetaAlmacen.tsx";

type Estado = "Inactivo" | "Creando";

type Contexto = {
  obtenerAlmacenes: ListaSeleccionable<Almacen>;
};

const setAlmacenes =
  (
    aplicable: (
      obtenerAlmacenes: ListaSeleccionable<Almacen>
    ) => ListaSeleccionable<Almacen>
  ) =>
  (maquina: Maquina3<Estado, Contexto>) => {
    return {
      ...maquina,
      contexto: {
        ...maquina.contexto,
        obtenerAlmacenes: aplicable(maquina.contexto.obtenerAlmacenes),
      },
    };
  };

const configMaquina: ConfigMaquina4<Estado, Contexto> = {
  inicial: {
    estado: "Inactivo",
    contexto: {
      obtenerAlmacenes: listaSeleccionableVacia<Almacen>(),
    },
  },
  estados: {
    Inactivo: {
      crear: "Creando",
      almacen_cambiada: ({ maquina, payload }) =>
        pipe(maquina, setAlmacenes(cambiarItem(payload as Almacen))),
      almacen_seleccionada: ({ maquina, payload }) =>
        pipe(maquina, setAlmacenes(seleccionarItem(payload as Almacen))),
      almacen_borrada: ({ maquina }) => {
        const { obtenerAlmacenes } = maquina.contexto;
        if (!obtenerAlmacenes.idActivo) {
          return maquina;
        }
        return pipe(
          maquina,
          setAlmacenes(quitarItem(obtenerAlmacenes.idActivo))
        );
      },
      obtenerAlmacenes_cargadas: ({ maquina, payload, setEstado }) =>
        pipe(
          maquina,
          setEstado("Inactivo" as Estado),
          setAlmacenes(cargar(payload as Almacen[]))
        ),
      seleccion_cancelada: ({ maquina }) =>
        pipe(
          maquina,
          setAlmacenes((obtenerAlmacenes) => ({
            ...obtenerAlmacenes,
            idActivo: null,
          }))
        ),
    },
    Creando: {
      almacen_creada: ({ maquina, payload, setEstado }) =>
        pipe(
          maquina,
          setEstado("Inactivo" as Estado),
          setAlmacenes(incluirItem(payload as Almacen, {}))
        ),
      creacion_cancelada: "Inactivo",
    },
  },
};

export const MaestroConDetalleAlmacen = () => {
  const [emitir, { estado, contexto }] = useMaquina4<Estado, Contexto>({
    config: configMaquina,
  });
  const { obtenerAlmacenes } = contexto;

  const setEntidades = useCallback(
    (payload: Almacen[]) => emitir("obtenerAlmacenes_cargadas", payload),
    [emitir]
  );
  const setSeleccionada = useCallback(
    (payload: Almacen) => emitir("almacen_seleccionada", payload),
    [emitir]
  );

  const seleccionada = getSeleccionada(obtenerAlmacenes);

  return (
    <div className="Almacen">
      <MaestroDetalle<Almacen>
        seleccionada={seleccionada}
        preMaestro={
          <>
            <h2>Almacenes</h2>
            <div className="maestro-botones">
              <QBoton onClick={() => emitir("crear")}>Nuevo</QBoton>
            </div>
          </>
        }
        metaTabla={metaTablaAlmacen}
        // tarjeta={(almacen) => <TarjetaAlmacen almacen={almacen} />}
        entidades={obtenerAlmacenes.lista}
        setEntidades={setEntidades}
        setSeleccionada={setSeleccionada}
        cargar={getAlmacenes}
        Detalle={
          <DetalleAlmacen
            key={seleccionada?.id}
            almacenInicial={seleccionada}
            emitir={emitir}
          />
        }
      />
      <CrearAlmacen publicar={emitir} activo={estado === "Creando"} />
    </div>
  );
};
