import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { ListadoControlado } from "@olula/componentes/maestro/ListadoControlado.js";
import { MaestroDetalleControlado } from "@olula/componentes/maestro/MaestroDetalleControlado.js";
import { QModal } from "@olula/componentes/moleculas/qmodal.tsx";
import { Criteria } from "@olula/lib/diseño.js";
import { criteriaDefecto } from "@olula/lib/dominio.js";
import { useCallback, useEffect } from "react";
import { useMaestroVenta } from "../../venta/hooks/useMaestroVenta.ts";
import { Pedido } from "../diseño.ts";
import { metaTablaPedido } from "../dominio.ts";
import { getMaquina } from "../maquinaMaestro.ts";
import { AltaPedido } from "./AltaPedido.tsx";
import { DetallePedido } from "./DetallePedido/DetallePedido.tsx";
import "./MaestroConDetallePedido.css";

export const MaestroConDetallePedido = () => {
  const { ctx, emitir } = useMaestroVenta(getMaquina, {
    estado: "INICIAL",
    pedidos: [],
    totalPedidos: 0,
    pedidoActivo: null,
  });

  const setSeleccionada = useCallback(
    (payload: Pedido) => void emitir("pedido_seleccionado", payload),
    [emitir]
  );

  const recargar = useCallback(
    (criteria: Criteria) => {
      void emitir("recarga_de_pedidos_solicitada", criteria);
    },
    [emitir]
  );

  useEffect(() => {
    emitir("recarga_de_pedidos_solicitada", criteriaDefecto);
  }, []);

  return (
    <div className="Pedido">
      <MaestroDetalleControlado<Pedido>
        Maestro={
          <>
            <h2>Pedidos</h2>
            <div className="maestro-botones">
              <QBoton onClick={() => emitir("crear_pedido_solicitado")}>
                Nuevo Pedido
              </QBoton>
            </div>
            <ListadoControlado<Pedido>
              metaTabla={metaTablaPedido}
              criteriaInicial={criteriaDefecto}
              modo={"tabla"}
              entidades={ctx.pedidos}
              totalEntidades={ctx.totalPedidos}
              seleccionada={ctx.pedidoActivo}
              onSeleccion={setSeleccionada}
              onCriteriaChanged={recargar}
            />
          </>
        }
        Detalle={
          <DetallePedido pedidoInicial={ctx.pedidoActivo} publicar={emitir} />
        }
        seleccionada={ctx.pedidoActivo}
        modoDisposicion="maestro-50"
      />

      <QModal
        nombre="modal"
        abierto={ctx.estado === "CREANDO_PEDIDO"}
        onCerrar={() => emitir("creacion_cancelada")}
      >
        <AltaPedido publicar={emitir} />
      </QModal>
    </div>
  );
};
