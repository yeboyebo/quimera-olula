import { useCallback } from "react";
import { QBoton } from "../../../../componentes/atomos/qboton.tsx";
import { Listado } from "../../../../componentes/maestro/Listado.tsx";
import { MaestroDetalleResponsive } from "../../../../componentes/maestro/MaestroDetalleResponsive.tsx";
import { QModal } from "../../../../componentes/moleculas/qmodal.tsx";
import { ListaSeleccionable } from "../../../comun/diseño.ts";
import {
  cambiarItem,
  cargar,
  getSeleccionada,
  incluirItem,
  listaSeleccionableVacia,
  quitarItem,
  quitarSeleccion,
  seleccionarItem,
} from "../../../comun/entidad.ts";
import { pipe } from "../../../comun/funcional.ts";
import {
  ConfigMaquina4,
  Maquina3,
  useMaquina4,
} from "../../../comun/useMaquina.ts";
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
      <MaestroDetalleResponsive<Albaran>
        seleccionada={seleccionada}
        Maestro={
          <>
            <h2>Albaranes</h2>
            <div className="maestro-botones">
              <QBoton onClick={() => emitir("crear")}>Crear Albarán</QBoton>
            </div>
            <Listado
              metaTabla={metaTablaAlbaran}
              entidades={albaranes.lista}
              setEntidades={setEntidades}
              seleccionada={seleccionada}
              setSeleccionada={setSeleccionada}
              cargar={getAlbaranes}
            />
          </>
        }
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
