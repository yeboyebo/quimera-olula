import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.js";
import { Listado } from "@olula/componentes/maestro/Listado.js";
import { MaestroDetalle } from "@olula/componentes/maestro/MaestroDetalle.tsx";
import { QModal } from "@olula/componentes/moleculas/qmodal.tsx";
import { listaActivaEntidadesInicial } from "@olula/lib/ListaActivaEntidades.js";
import { getUrlParams, useUrlParams } from "@olula/lib/url-params.js";
import { useEffect } from "react";
import { CrearPedido } from "../crear/CrearPedido.tsx";
import { DetallePedido } from "../detalle/DetallePedido.tsx";
import { Pedido } from "../diseño.ts";
import { AlbaranarPedidos } from "./AlbaranarPedidos.tsx";
import "./MaestroConDetallePedido.css";
import { TarjetaDocumentoVenta } from "#/ventas/comun/componentes/TarjetaDocumentoVenta.tsx";
import { agruparPorCliente, todosPuedenAlbaranarse } from "./maestro.ts";
import { getMaquina } from "./maquina.ts";
import { getMetaTablaPedido } from "./metatabla_pedido.tsx";
import { ResultadoAlbaranado } from "./ResultadoAlbaranado.tsx";

export const MaestroConDetallePedido = () => {
  const { id, criteria } = getUrlParams();

  const { ctx, emitir } = useMaquina(getMaquina, {
    estado: "INICIAL",
    pedidos: listaActivaEntidadesInicial<Pedido>(id, criteria),
    seleccionados: [],
    albaranesCreados: [],
    fallidos: [],
  });

  useUrlParams(ctx.pedidos.activo, ctx.pedidos.criteria);

  useEffect(() => {
    emitir("recarga_de_pedidos_solicitada", ctx.pedidos.criteria);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const metaTablaPedido = getMetaTablaPedido();

  return (
    <div className="Pedido">
      <MaestroDetalle<Pedido>
        Maestro={
          <>
            <h2>Pedidos</h2>
            <Listado<Pedido>
              metaTabla={metaTablaPedido}
              tarjeta={(pedido) => (
                <TarjetaDocumentoVenta
                  codigo={pedido.codigo}
                  nombreCliente={pedido.cliente.nombre_cliente}
                  fecha={pedido.fecha}
                  total={pedido.total}
                  divisa={pedido.divisa_id}
                  estado={pedido.servido === "TOTAL" ? "cerrado" : "pendiente"}
                />
              )}
              criteria={ctx.pedidos.criteria}
              entidades={ctx.pedidos.lista}
              totalEntidades={ctx.pedidos.total}
              seleccionada={ctx.pedidos.activo}
              seleccionadas={ctx.seleccionados}
              onMultiSeleccion={(ids) => emitir("seleccionados_cambiados", ids)}
              renderAcciones={() => (
                <div className="maestro-botones">
                  <QBoton onClick={() => emitir("crear_pedido_solicitado")}>
                    Nuevo Pedido
                  </QBoton>
                  {todosPuedenAlbaranarse(ctx.seleccionados, ctx.pedidos.lista) && (
                    <QBoton onClick={() => emitir("albaranado_multiple_solicitado")}>
                      Albaranar ({ctx.seleccionados.length})
                    </QBoton>
                  )}
                </div>
              )}
              onSeleccion={(payload) => emitir("pedido_seleccionado", payload)}
              onCriteriaChanged={(payload) =>
                emitir("criteria_cambiado", payload)
              }
              onSiguientePagina={(payload) =>
                emitir("siguiente_pagina", payload)
              }
            />
          </>
        }
        Detalle={<DetallePedido id={ctx.pedidos.activo} publicar={emitir} />}
        seleccionada={ctx.pedidos.activo}
      />

      <QModal
        nombre="altaPedido"
        abierto={ctx.estado === "CREANDO_PEDIDO"}
        titulo="Nuevo Pedido"
        onCerrar={() => emitir("creacion_pedido_cancelada")}
      >
        <CrearPedido publicar={emitir} />
      </QModal>

      {ctx.estado === "ALBARANANDO_PEDIDOS" && (
        <AlbaranarPedidos
          publicar={emitir}
          pedidos={ctx.seleccionados.length}
          grupos={agruparPorCliente(ctx.seleccionados, ctx.pedidos.lista).length}
        />
      )}

      {ctx.estado === "ALBARANES_CREADOS" && (
        <ResultadoAlbaranado
          publicar={emitir}
          creados={ctx.albaranesCreados}
          fallidos={ctx.fallidos}
        />
      )}
    </div>
  );
};
