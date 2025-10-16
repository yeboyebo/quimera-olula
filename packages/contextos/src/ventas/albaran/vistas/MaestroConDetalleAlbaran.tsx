import { QBoton, QModal } from "@olula/componentes/index.js";
import { MaestroDetalle } from "@olula/componentes/maestro/MaestroDetalle.js";
import { ListaSeleccionable } from "@olula/lib/diseño.js";
import {
  cambiarItem,
  cargar,
  getSeleccionada,
  incluirItem,
  listaSeleccionableVacia,
  quitarItem,
  quitarSeleccion,
  seleccionarItem,
} from "@olula/lib/entidad.js";
import { pipe } from "@olula/lib/funcional.js";
import {
  ConfigMaquina4,
  Maquina3,
  useMaquina4,
} from "@olula/lib/useMaquina.js";
import { useCallback } from "react";
import { Albaran } from "../diseño.ts";
import { metaTablaAlbaran } from "../dominio.ts";
import { getAlbaranes } from "../infraestructura.ts";
import { AltaAlbaran } from "./AltaAlbaran.tsx";
import { DetalleAlbaran } from "./DetalleAlbaran/DetalleAlbaran.tsx";
import "./MaestroConDetalleAlbaran.css";

type Estado = "Inactivo" | "Creando";
type Contexto = {
  albaranes: ListaSeleccionable<Albaran>;
};

const setAlbaranes =
  (
    aplicable: (
      albaranes: ListaSeleccionable<Albaran>
    ) => ListaSeleccionable<Albaran>
  ) =>
  (maquina: Maquina3<Estado, Contexto>) => {
    return {
      ...maquina,
      contexto: {
        ...maquina.contexto,
        albaranes: aplicable(maquina.contexto.albaranes),
      },
    };
  };

const configMaquina: ConfigMaquina4<Estado, Contexto> = {
  inicial: {
    estado: "Inactivo",
    contexto: {
      albaranes: listaSeleccionableVacia<Albaran>(),
    },
  },
  estados: {
    Inactivo: {
      crear: "Creando",
      albaran_cambiado: ({ maquina, payload }) =>
        pipe(maquina, setAlbaranes(cambiarItem(payload as Albaran))),
      albaran_seleccionado: ({ maquina, payload }) =>
        pipe(maquina, setAlbaranes(seleccionarItem(payload as Albaran))),
      cancelar_seleccion: ({ maquina }) =>
        pipe(maquina, setAlbaranes(quitarSeleccion())),
      albaran_borrado: ({ maquina }) => {
        const { albaranes } = maquina.contexto;
        if (!albaranes.idActivo) {
          return maquina;
        }
        return pipe(maquina, setAlbaranes(quitarItem(albaranes.idActivo)));
      },
      albaranes_cargados: ({ maquina, payload, setEstado }) =>
        pipe(
          maquina,
          setEstado("Inactivo" as Estado),
          setAlbaranes(cargar(payload as Albaran[]))
        ),
    },
    Creando: {
      albaran_creado: ({ maquina, payload, setEstado }) =>
        pipe(
          maquina,
          setEstado("Inactivo" as Estado),
          setAlbaranes(incluirItem(payload as Albaran, {}))
        ),
      alta_cancelada: "Inactivo",
    },
  },
};

export const MaestroConDetalleAlbaran = () => {
  const [emitir, { estado, contexto }] = useMaquina4<Estado, Contexto>({
    config: configMaquina,
  });
  const { albaranes } = contexto;

  const setEntidades = useCallback(
    (payload: Albaran[]) => emitir("albaranes_cargados", payload),
    [emitir]
  );
  const setSeleccionada = useCallback(
    (payload: Albaran) => emitir("albaran_seleccionado", payload),
    [emitir]
  );

  const seleccionada = getSeleccionada(albaranes);

  return (
    <div className="Albaran">
      <MaestroDetalle<Albaran>
        seleccionada={seleccionada}
        preMaestro={
          <>
            <h2>Albaranes</h2>
            <div className="maestro-botones">
              <QBoton onClick={() => emitir("crear")}>Crear Albarán</QBoton>
            </div>
          </>
        }
        modoVisualizacion="tabla"
        metaTabla={metaTablaAlbaran}
        entidades={albaranes.lista}
        setEntidades={setEntidades}
        setSeleccionada={setSeleccionada}
        cargar={getAlbaranes}
        Detalle={
          <DetalleAlbaran albaranInicial={seleccionada} emitir={emitir} />
        }
      />
      <QModal
        nombre="modal"
        abierto={estado === "Creando"}
        onCerrar={() => emitir("alta_cancelada")}
      >
        <AltaAlbaran publicar={emitir} />
      </QModal>
    </div>
  );
};
