import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { MaestroDetalle } from "@olula/componentes/maestro/MaestroDetalle.js";
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
import { Accion } from "../diseño.ts";
import { metaTablaAccion } from "../dominio.ts";
import { getAcciones } from "../infraestructura.ts";
import { AltaAccion } from "./AltaAccion.tsx";
import { DetalleAccion } from "./DetalleAccion/DetalleAccion.tsx";

type Estado = "inactivo" | "creando";
type Contexto = { acciones: ListaSeleccionable<Accion> };

const setAcciones =
  (
    aplicable: (
      acciones: ListaSeleccionable<Accion>
    ) => ListaSeleccionable<Accion>
  ) =>
  (maquina: Maquina3<Estado, Contexto>) => ({
    ...maquina,
    contexto: {
      ...maquina.contexto,
      acciones: aplicable(maquina.contexto.acciones),
    },
  });

const configMaquina: ConfigMaquina4<Estado, Contexto> = {
  inicial: {
    estado: "inactivo",
    contexto: {
      acciones: listaSeleccionableVacia<Accion>(),
    },
  },
  estados: {
    inactivo: {
      crear: "creando",
      accion_cambiada: ({ maquina, payload }) =>
        pipe(maquina, setAcciones(cambiarItem(payload as Accion))),
      accion_seleccionada: ({ maquina, payload }) =>
        pipe(maquina, setAcciones(seleccionarItem(payload as Accion))),
      accion_borrada: ({ maquina }) => {
        const { acciones } = maquina.contexto;
        if (!acciones.idActivo) return maquina;
        return pipe(maquina, setAcciones(quitarItem(acciones.idActivo)));
      },
      acciones_cargadas: ({ maquina, payload }) =>
        pipe(maquina, setAcciones(cargar(payload as Accion[]))),
      seleccion_cancelada: ({ maquina }) =>
        pipe(
          maquina,
          setAcciones((a) => ({ ...a, idActivo: null }))
        ),
    },
    creando: {
      accion_creada: ({ maquina, payload, setEstado }) =>
        pipe(
          maquina,
          setEstado("inactivo"),
          setAcciones(incluirItem(payload as Accion, {}))
        ),
      creacion_cancelada: "inactivo",
    },
  },
};

export const MaestroConDetalleAccion = () => {
  const [emitir, { estado, contexto }] = useMaquina4({ config: configMaquina });
  const { acciones } = contexto;

  const setEntidades = useCallback(
    (payload: Accion[]) => emitir("acciones_cargadas", payload),
    [emitir]
  );
  const setSeleccionada = useCallback(
    (payload: Accion) => emitir("accion_seleccionada", payload),
    [emitir]
  );

  const seleccionada = getSeleccionada(acciones);

  return (
    <div className="Accion">
      <MaestroDetalle<Accion>
        seleccionada={seleccionada}
        preMaestro={
          <>
            <h2>Acciones</h2>
            <div className="maestro-botones">
              <QBoton onClick={() => emitir("crear")}>Nueva</QBoton>
            </div>
          </>
        }
        modoVisualizacion="tabla"
        metaTabla={metaTablaAccion}
        entidades={acciones.lista}
        setEntidades={setEntidades}
        setSeleccionada={setSeleccionada}
        cargar={getAcciones}
        Detalle={
          <DetalleAccion
            key={seleccionada?.id}
            accionInicial={seleccionada}
            publicar={emitir}
          />
        }
      />
      <AltaAccion emitir={emitir} activo={estado === "creando"} />
    </div>
  );
};
