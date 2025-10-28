import { MaestroDetalle, QBoton } from "@olula/componentes/index.ts";
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
import { Incidencia } from "../diseño.ts";
import { metaTablaIncidencia } from "../dominio.ts";
import { getIncidencias } from "../infraestructura.ts";
import { CrearIncidencia } from "./CrearIncidencia.tsx";
import { DetalleIncidencia } from "./DetalleIncidencia/DetalleIncidencia.tsx";
import { TarjetaIncidencia } from "./TarjetaIncidencia.tsx";

type Estado = "Inactivo" | "Creando";

type Contexto = {
  incidencias: ListaSeleccionable<Incidencia>;
};

const setIncidencias =
  (
    aplicable: (
      incidencias: ListaSeleccionable<Incidencia>
    ) => ListaSeleccionable<Incidencia>
  ) =>
  (maquina: Maquina3<Estado, Contexto>) => {
    return {
      ...maquina,
      contexto: {
        ...maquina.contexto,
        incidencias: aplicable(maquina.contexto.incidencias),
      },
    };
  };

const configMaquina: ConfigMaquina4<Estado, Contexto> = {
  inicial: {
    estado: "Inactivo",
    contexto: {
      incidencias: listaSeleccionableVacia<Incidencia>(),
    },
  },
  estados: {
    Inactivo: {
      crear: "Creando",
      incidencia_cambiada: ({ maquina, payload }) =>
        pipe(maquina, setIncidencias(cambiarItem(payload as Incidencia))),
      incidencia_seleccionada: ({ maquina, payload }) =>
        pipe(maquina, setIncidencias(seleccionarItem(payload as Incidencia))),
      incidencia_borrada: ({ maquina }) => {
        const { incidencias } = maquina.contexto;
        if (!incidencias.idActivo) {
          return maquina;
        }
        return pipe(maquina, setIncidencias(quitarItem(incidencias.idActivo)));
      },
      incidencias_cargadas: ({ maquina, payload, setEstado }) =>
        pipe(
          maquina,
          setEstado("Inactivo" as Estado),
          setIncidencias(cargar(payload as Incidencia[]))
        ),
      seleccion_cancelada: ({ maquina }) =>
        pipe(
          maquina,
          setIncidencias((incidencias) => ({
            ...incidencias,
            idActivo: null,
          }))
        ),
    },
    Creando: {
      incidencia_creada: ({ maquina, payload, setEstado }) =>
        pipe(
          maquina,
          setEstado("Inactivo" as Estado),
          setIncidencias(incluirItem(payload as Incidencia, {}))
        ),
      creacion_cancelada: "Inactivo",
    },
  },
};

export const MaestroConDetalleIncidencia = () => {
  const [emitir, { estado, contexto }] = useMaquina4<Estado, Contexto>({
    config: configMaquina,
  });
  const { incidencias } = contexto;

  const setEntidades = useCallback(
    (payload: Incidencia[]) => emitir("incidencias_cargadas", payload),
    [emitir]
  );
  const setSeleccionada = useCallback(
    (payload: Incidencia) => emitir("incidencia_seleccionada", payload),
    [emitir]
  );

  const seleccionada = getSeleccionada(incidencias);

  return (
    <div className="Incidencia">
      <MaestroDetalle<Incidencia>
        seleccionada={seleccionada}
        preMaestro={
          <>
            <h2>Incidencias</h2>
            <div className="maestro-botones">
              <QBoton onClick={() => emitir("crear")}>Nueva</QBoton>
            </div>
          </>
        }
        metaTabla={metaTablaIncidencia}
        tarjeta={(incidencia) => <TarjetaIncidencia incidencia={incidencia} />}
        entidades={incidencias.lista}
        setEntidades={setEntidades}
        setSeleccionada={setSeleccionada}
        cargar={getIncidencias}
        Detalle={
          <DetalleIncidencia
            key={seleccionada?.id}
            incidenciaInicial={seleccionada}
            publicar={emitir}
          />
        }
      />
      <CrearIncidencia publicar={emitir} activo={estado === "Creando"} />
    </div>
  );
};
