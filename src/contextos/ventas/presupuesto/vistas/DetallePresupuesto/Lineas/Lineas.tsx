import { useCallback, useContext, useEffect } from "react";
import { QBoton } from "../../../../../../componentes/atomos/qboton.tsx";
import { QModal } from "../../../../../../componentes/moleculas/qmodal.tsx";
import { QModalConfirmacion } from "../../../../../../componentes/moleculas/qmodalconfirmacion.tsx";
import { ContextoError } from "../../../../../comun/contexto.ts";
import { useLista } from "../../../../../comun/useLista.ts";
import {
  ConfigMaquina4,
  useMaquina4,
} from "../../../../../comun/useMaquina.ts";
import { HookModelo } from "../../../../../comun/useModelo.ts";
import {
  LineaPresupuesto as Linea,
  LineaPresupuesto,
  NuevaLinea,
  Presupuesto,
} from "../../../diseño.ts";
import {
  deleteLinea,
  getLineas,
  patchCantidadLinea,
  patchLinea,
  postLinea,
} from "../../../infraestructura.ts";
import { AltaLinea } from "./AltaLinea.tsx";
import { EdicionLinea } from "./EdicionLinea.tsx";
import { LineasLista } from "./LineasLista.tsx";

type Estado = "Lista" | "Alta" | "Edicion" | "ConfirmarBorrado";
type Contexto = Record<string, unknown>;

const configMaquina: ConfigMaquina4<Estado, Contexto> = {
  inicial: {
    estado: "Lista",
    contexto: {},
  },
  estados: {
    Alta: {
      alta_lista: "Lista",
    },
    Edicion: {
      edicion_lista: "Lista",
      edicion_cancelada: "Lista",
    },
    Lista: {
      alta_solicitada: "Alta",
      edicion_solicitada: "Edicion",
      linea_seleccionada: "Lista",
      cambio_cantidad_solicitado: "Lista",
      borrado_solicitado: "ConfirmarBorrado",
    },
    ConfirmarBorrado: {
      borrado_confirmado: "Lista",
      borrado_cancelado: "Lista",
    },
  },
};

export const Lineas = ({
  onCabeceraModificada,
  presupuesto,
}: {
  onCabeceraModificada: () => void;
  presupuesto: HookModelo<Presupuesto>;
}) => {
  const lineas = useLista<Linea>([]);
  const presupuestoId = presupuesto?.modelo?.id;
  const { intentar } = useContext(ContextoError);

  const { setLista } = lineas;

  const refrescarLineas = async (idLinea?: string) => {
    const nuevasLineas = await getLineas(presupuestoId);
    lineas.refrescar(nuevasLineas, idLinea);
    onCabeceraModificada();
  };

  const cargar = useCallback(async () => {
    const nuevasLineas = await getLineas(presupuestoId);
    setLista(nuevasLineas);
  }, [presupuestoId, setLista]);

  useEffect(() => {
    if (presupuestoId) cargar();
  }, [presupuestoId, cargar]);

  const altaLinea = async (nuevaLinea: NuevaLinea) => {
    const idLinea = await intentar(() => postLinea(presupuestoId, nuevaLinea));
    await refrescarLineas(idLinea);
    emitir("alta_lista");
  };

  const edicionLinea = async (linea: LineaPresupuesto) => {
    await intentar(() => patchLinea(presupuestoId, linea));
    await refrescarLineas();
    emitir("edicion_lista");
  };

  const cambioCantidad = async (payload: {
    linea: LineaPresupuesto;
    cantidad: number;
  }) => {
    await intentar(() =>
      patchCantidadLinea(presupuestoId, payload.linea, payload.cantidad)
    );
    await refrescarLineas();
    emitir("cambio_cantidad_solicitado");
  };

  const seleccionarLinea = (linea: Linea) => {
    lineas.seleccionar(linea);
    emitir("linea_seleccionada");
  };

  const onBorrarConfirmado = async () => {
    if (!lineas.seleccionada) return;
    const lineaId = lineas.seleccionada.id;
    if (!lineaId) return;
    await intentar(() => deleteLinea(presupuestoId, lineaId));
    await refrescarLineas();
    emitir("borrado_confirmado");
  };

  const [emitir, { estado }] = useMaquina4<Estado, Contexto>({
    config: configMaquina,
  });

  return (
    <>
      {presupuesto.editable && (
        <div className="botones maestro-botones ">
          <QBoton onClick={() => emitir("alta_solicitada")}>Nueva</QBoton>
          <QBoton
            onClick={() => lineas.seleccionada && emitir("edicion_solicitada")}
            deshabilitado={!lineas.seleccionada}
          >
            Editar
          </QBoton>
          <QBoton
            deshabilitado={!lineas.seleccionada}
            onClick={() => lineas.seleccionada && emitir("borrado_solicitado")}
          >
            Borrar
          </QBoton>
        </div>
      )}
      <LineasLista
        lineas={lineas.lista}
        seleccionada={lineas.seleccionada ? lineas.seleccionada.id : undefined}
        emitir={(evento, payload) => {
          if (evento === "alta_lista") altaLinea(payload as NuevaLinea);
          else if (evento === "edicion_lista")
            edicionLinea(payload as LineaPresupuesto);
          else if (evento === "cambio_cantidad_solicitado")
            cambioCantidad(
              payload as { linea: LineaPresupuesto; cantidad: number }
            );
          else if (evento === "linea_seleccionada")
            seleccionarLinea(payload as Linea);
        }}
      />
      {lineas.seleccionada && (
        <QModal
          nombre="modal"
          abierto={estado === "Edicion"}
          onCerrar={() => emitir("edicion_cancelada")}
        >
          <EdicionLinea
            emitir={(evento, payload) => {
              if (evento === "edicion_lista")
                edicionLinea(payload as LineaPresupuesto);
            }}
            lineaInicial={lineas.seleccionada}
          />
        </QModal>
      )}
      <QModal
        nombre="modal"
        abierto={estado === "Alta"}
        onCerrar={() => emitir("edicion_cancelada")}
      >
        <AltaLinea
          emitir={(evento, payload) => {
            if (evento === "alta_lista") altaLinea(payload as NuevaLinea);
          }}
        />
      </QModal>
      <QModalConfirmacion
        nombre="confirmarBorrarLinea"
        abierto={estado === "ConfirmarBorrado"}
        titulo="Confirmar borrado"
        mensaje="¿Está seguro de que desea borrar esta línea?"
        onCerrar={() => emitir("borrado_cancelado")}
        onAceptar={onBorrarConfirmado}
      />
    </>
  );
};
