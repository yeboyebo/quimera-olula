import { useCallback, useEffect, useState } from "react";
import { QBoton } from "../../../../../../componentes/atomos/qboton.tsx";
import { QModal } from "../../../../../../componentes/moleculas/qmodal.tsx";
import { useLista } from "../../../../../comun/useLista.ts";
import { Maquina, useMaquina } from "../../../../../comun/useMaquina.ts";
import { HookModelo } from "../../../../../comun/useModelo.ts";
import { LineaPedido as Linea, LineaPedido, NuevaLineaPedido, Pedido } from "../../../diseño.ts";
import { deleteLinea, getLineas, patchCantidadLinea, patchLinea, postLinea } from "../../../infraestructura.ts";
import { AltaLinea } from "./AltaLinea.tsx";
import { EdicionLinea } from "./EdicionLinea.tsx";
import { LineasLista } from "./LineasLista.tsx";

type Estado = "lista" | "alta" | "edicion";
export const Lineas = ({
  onCabeceraModificada,
  pedido,
}: {
  onCabeceraModificada: () => void;
  pedido: HookModelo<Pedido>;
}) => {
  const [estado, setEstado] = useState<Estado>("lista");
  const lineas = useLista<Linea>([]);
  const pedidoId = pedido?.modelo?.id ;

  const { setLista } = lineas;
  
  const refrescarLineas = async (idLinea?: string) => {
    const nuevasLineas = await getLineas(pedidoId);
    lineas.refrescar(nuevasLineas, idLinea);
    onCabeceraModificada();
  };

  const cargar = useCallback(async () => {
    const nuevasLineas = await getLineas(pedidoId);
    setLista(nuevasLineas);
  }, [pedidoId, setLista]);

  useEffect(() => {
    if (pedidoId) cargar();
  }, [pedidoId, cargar]);

  const maquina: Maquina<Estado> = {
    alta: {

      ALTA_LISTA: async (payload: unknown) => {
        const idLinea = await postLinea(pedidoId, payload as NuevaLineaPedido);
        await refrescarLineas(idLinea);
        return 'lista' as Estado;
      },
    },
    edicion: {

      EDICION_LISTA: async (payload: unknown) => {
        const linea = payload as LineaPedido;
        await patchLinea(pedidoId, linea);
        await refrescarLineas();
        return 'lista' as Estado;
      },

      EDICION_CANCELADA: 'lista',
    },
    lista: {

      ALTA_SOLICITADA: 'alta',

      EDICION_SOLICITADA: 'edicion',

      LINEA_SELECCIONADA: (payload: unknown) => {
        const linea = payload as Linea;
        lineas.seleccionar(linea);
      },

      CAMBIO_CANTIDAD_SOLICITADO: async (payload: unknown) => {
        const { linea, cantidad } = payload as { linea: LineaPedido; cantidad: number };
        await patchCantidadLinea(pedidoId, linea, cantidad);
        await refrescarLineas();
      },

      BORRADO_SOLICITADO: async () => {
        if (!lineas.seleccionada) {
          return;
        }
        await deleteLinea(pedidoId, lineas.seleccionada.id);
        await refrescarLineas();
      }
    }
  }
  const emitir = useMaquina(maquina, estado, setEstado);
  
  
  return (
    <>
      {pedido.editable && 
        (
          <div className="botones maestro-botones ">
            <QBoton
              onClick={() => emitir('ALTA_SOLICITADA')}
            >
              Nueva
            </QBoton>
            <QBoton
              deshabilitado={!lineas.seleccionada}
              onClick={() => emitir('EDICION_SOLICITADA')}
            >
              Editar
            </QBoton>
            <QBoton
              deshabilitado={!lineas.seleccionada}
              onClick={() => emitir('BORRADO_SOLICITADO')}
            >
              Borrar
            </QBoton>
          </div>
        )
      }
      <LineasLista
        lineas={lineas.lista}
        seleccionada={lineas.seleccionada ? lineas.seleccionada.id : undefined}
        emitir={emitir}
      />
      {
        lineas.seleccionada && (
          <QModal nombre="modal" abierto={estado==='edicion'} onCerrar={() => emitir("EDICION_CANCELADA")}>
            <EdicionLinea emitir={emitir} lineaInicial={lineas.seleccionada}/>
          </QModal>
        )
      }
      <QModal nombre="modal" abierto={estado==='alta'} onCerrar={() => setEstado("lista")}>
        <AltaLinea emitir={emitir} />
      </QModal>
    </>
  );
};
