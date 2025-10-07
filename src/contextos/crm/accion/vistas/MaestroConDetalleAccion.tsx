import { useCallback } from "react";
import { QBoton } from "../../../../componentes/atomos/qboton.tsx";
import { Listado } from "../../../../componentes/maestro/Listado.tsx";
import { MaestroDetalleResponsive } from "../../../../componentes/maestro/MaestroDetalleResponsive.tsx";
import { ListaSeleccionable } from "../../../comun/diseño.ts";
import {
  cambiarItem,
  cargar,
  getSeleccionada,
  incluirItem,
  listaSeleccionableVacia,
  quitarItem,
  seleccionarItem,
} from "../../../comun/entidad.ts";
import { pipe } from "../../../comun/funcional.ts";
import {
  ConfigMaquina4,
  Maquina3,
  useMaquina4,
} from "../../../comun/useMaquina.ts";
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
      <MaestroDetalleResponsive
        seleccionada={seleccionada}
        Maestro={
          <>
            <h2>Acciones</h2>
            <div className="maestro-botones">
              <QBoton onClick={() => emitir("crear")}>Nueva</QBoton>
            </div>
            <Listado
              metaTabla={metaTablaAccion}
              entidades={acciones.lista}
              setEntidades={setEntidades}
              seleccionada={seleccionada}
              setSeleccionada={setSeleccionada}
              cargar={getAcciones}
            />
          </>
        }
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
