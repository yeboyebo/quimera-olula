import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QTabla } from "@olula/componentes/atomos/qtabla.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { ListaSeleccionable } from "@olula/lib/diseño.ts";
import {
  cargar,
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
import { HookModelo } from "@olula/lib/useModelo.ts";
import { useContext, useEffect } from "react";
import { Accion } from "../../../accion/diseño.ts";
import { metaTablaAccion } from "../../../accion/dominio.ts";
import { AltaAccion } from "../../../accion/vistas/AltaAccion.tsx";
import { BajaAccion } from "../../../accion/vistas/BajaAccion.tsx";
import { Incidencia } from "../../diseño.ts";
import { getAccionesIncidencia } from "../../infraestructura.ts";

type Estado = "Inactivo" | "Creando" | "Borrando" | "Cargando";

type Contexto = {
  acciones: ListaSeleccionable<Accion>;
};

const setAcciones =
  (
    aplicable: (
      acciones: ListaSeleccionable<Accion>
    ) => ListaSeleccionable<Accion>
  ) =>
  (maquina: Maquina3<Estado, Contexto>) => {
    return {
      ...maquina,
      contexto: {
        ...maquina.contexto,
        acciones: aplicable(maquina.contexto.acciones),
      },
    };
  };

const configMaquina: ConfigMaquina4<Estado, Contexto> = {
  inicial: {
    estado: "Inactivo",
    contexto: {
      acciones: listaSeleccionableVacia<Accion>(),
    },
  },
  estados: {
    Cargando: {
      acciones_cargadas: ({ maquina, payload, setEstado }) =>
        pipe(
          maquina,
          setEstado("Inactivo"),
          setAcciones(cargar(payload as Accion[]))
        ),
    },
    Inactivo: {
      crear: "Creando",
      borrar: "Borrando",
      accion_seleccionada: ({ maquina, payload }) =>
        pipe(maquina, setAcciones(seleccionarItem(payload as Accion))),
      cargar: "Cargando",
    },
    Creando: {
      accion_creada: ({ maquina, payload, setEstado }) =>
        pipe(
          maquina,
          setEstado("Inactivo"),
          setAcciones(incluirItem(payload as Accion, {}))
        ),
      creacion_cancelada: "Inactivo",
    },
    Borrando: {
      accion_borrada: ({ maquina, setEstado }) => {
        const idActivo = maquina.contexto.acciones.idActivo;
        if (!idActivo) {
          return maquina;
        }
        return pipe(
          maquina,
          setEstado("Inactivo"),
          setAcciones(quitarItem(idActivo))
        );
      },
      borrado_cancelado: "Inactivo",
    },
  },
};

export const TabAcciones = ({
  incidencia,
}: {
  incidencia: HookModelo<Incidencia>;
}) => {
  const { intentar } = useContext(ContextoError);

  const idIncidencia = incidencia.modelo.id;

  const [emitir, { estado, contexto }] = useMaquina4<Estado, Contexto>({
    config: configMaquina,
  });
  const { acciones } = contexto;

  useEffect(() => {
    const cargarAcciones = async () => {
      const nuevasAcciones = await intentar(() =>
        getAccionesIncidencia(idIncidencia)
      );
      emitir("acciones_cargadas", nuevasAcciones);
    };

    emitir("cargar");
    cargarAcciones();
  }, [idIncidencia, emitir, intentar]);

  return (
    <div className="TabAcciones">
      <div className="TabAccionesAcciones maestro-botones">
        <QBoton onClick={() => emitir("crear")}>Nueva</QBoton>

        <QBoton
          onClick={() => emitir("borrar")}
          deshabilitado={!acciones.idActivo}
        >
          Borrar
        </QBoton>
      </div>

      <AltaAccion
        emitir={emitir}
        activo={estado === "Creando"}
        key={incidencia.modelo.id}
        idIncidencia={incidencia.modelo.id}
      />

      <BajaAccion
        publicar={emitir}
        activo={estado === "Borrando"}
        idAccion={acciones.idActivo || undefined}
      />

      <QTabla
        metaTabla={metaTablaAccion}
        datos={acciones.lista}
        cargando={estado === "Cargando"}
        seleccionadaId={acciones.idActivo || undefined}
        onSeleccion={(accion) => emitir("accion_seleccionada", accion)}
        orden={["id", "ASC"]}
        onOrdenar={() => null}
      />
    </div>
  );
};
