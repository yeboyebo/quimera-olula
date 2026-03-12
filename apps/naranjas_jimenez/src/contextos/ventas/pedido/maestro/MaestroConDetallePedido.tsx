import { DetallePedido } from "#/ventas/pedido/detalle/DetallePedido.tsx";
import { getMaquina } from "#/ventas/pedido/maestro/maquina.ts";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.js";
import { ListadoActivoControlado } from "@olula/componentes/maestro/ListadoActivoControlado.js";
import { MaestroDetalleActivoControlado } from "@olula/componentes/maestro/MaestroDetalleActivoControlado.js";
import { QModal } from "@olula/componentes/moleculas/qmodal.tsx";
import { Criteria } from "@olula/lib/diseño.js";
import { listaActivaEntidadesInicial } from "@olula/lib/ListaActivaEntidades.js";
import { getUrlParams } from "@olula/lib/url-params.js";
import { useCallback, useEffect } from "react";
import { CrearPedidoNrj } from "../crear/CrearPedido.tsx";
import { PedidoNrj } from "../diseño.ts";
import "./MaestroConDetallePedido.css";
import { getMetaTablaPedidoNrj } from "./metatabla_pedido.tsx";

export const MaestroConDetallePedidoNrj = () => {
  const { id, criteria } = getUrlParams();

  const { ctx, emitir } = useMaquina(getMaquina, {
    estado: "INICIAL",
    pedidos: listaActivaEntidadesInicial<PedidoNrj>(id, criteria),
  });

  // const setSeleccionada = useCallback(
  //   (payload: Pedido) => void emitir("pedido_seleccionado", payload),
  //   [emitir]
  // );

  const recargar = useCallback(
    (criteria: Criteria) => {
      void emitir("recarga_de_pedidos_solicitada", criteria);
    },
    [emitir]
  );

  useEffect(() => {
    emitir("recarga_de_pedidos_solicitada", ctx.pedidos.criteria);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const metaTablaPedido = getMetaTablaPedidoNrj();

  return (
    <div className="Pedido">
      <MaestroDetalleActivoControlado<PedidoNrj>
        Maestro={
          <>
            <h2>Pedidos</h2>
            <div className="maestro-botones">
              <QBoton onClick={() => emitir("crear_pedido_solicitado")}>
                Nuevo Pedido
              </QBoton>
            </div>
            <ListadoActivoControlado<PedidoNrj>
              metaTabla={metaTablaPedido}
              criteria={ctx.pedidos.criteria}
              modo={"tabla"}
              entidades={ctx.pedidos.lista}
              totalEntidades={ctx.pedidos.total}
              seleccionada={ctx.pedidos.activo}
              onSeleccion={(payload) => emitir("pedido_seleccionado", payload)}
              onCriteriaChanged={recargar}
            />
          </>
        }
        Detalle={<DetallePedido id={ctx.pedidos.activo} publicar={emitir} />}
        seleccionada={ctx.pedidos.activo}
      />

      <QModal
        nombre="modal"
        abierto={ctx.estado === "CREANDO_PEDIDO"}
        onCerrar={() => emitir("creacion_pedido_cancelada")}
      >
        <CrearPedidoNrj publicar={emitir} />
      </QModal>
    </div>
  );
};
