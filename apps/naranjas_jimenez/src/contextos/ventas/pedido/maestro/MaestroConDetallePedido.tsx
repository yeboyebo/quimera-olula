import { CrearPedido } from "#/ventas/pedido/crear/CrearPedido.tsx";
import { DetallePedido } from "#/ventas/pedido/detalle/DetallePedido.tsx";
import { Pedido } from "#/ventas/pedido/diseño.ts";
import { getMaquina } from "#/ventas/pedido/maestro/maquina.ts";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.js";
import { Listado } from "@olula/componentes/maestro/Listado.js";
import { MaestroDetalle } from "@olula/componentes/maestro/MaestroDetalle.tsx";
import { QModal } from "@olula/componentes/moleculas/qmodal.tsx";
import { listaActivaEntidadesInicial } from "@olula/lib/ListaActivaEntidades.js";
import { getUrlParams, useUrlParams } from "@olula/lib/url-params.js";
import { useEffect } from "react";
import "./MaestroConDetallePedido.css";
import { getMetaTablaPedidoNrj } from "./metatabla_pedido.tsx";

export const MaestroConDetallePedidoNrj = () => {
  const { id, criteria } = getUrlParams();

  const { ctx, emitir } = useMaquina(getMaquina, {
    estado: "INICIAL",
    pedidos: listaActivaEntidadesInicial<Pedido>(id, criteria),
  });

  useUrlParams(ctx.pedidos.activo, ctx.pedidos.criteria);

  useEffect(() => {
    emitir("recarga_de_pedidos_solicitada", ctx.pedidos.criteria);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const metaTablaPedido = getMetaTablaPedidoNrj();

  // const metaTablaPedido = [
  //   {
  //     id: "estado",
  //     cabecera: "",
  //     render: (pedido: Pedido) => (
  //       <ColumnaEstadoTabla
  //         estados={{
  //           aprobado: (
  //             <QIcono
  //               nombre={"circulo_relleno"}
  //               tamaño="sm"
  //               color="var(--color-deshabilitado-oscuro)"
  //             />
  //           ),
  //           pendiente: (
  //             <QIcono
  //               nombre={"circulo_relleno"}
  //               tamaño="sm"
  //               color="var(--color-exito-oscuro)"
  //             />
  //           ),
  //         }}
  //         estadoActual={pedido.servido == "TOTAL" ? "aprobado" : "pendiente"}
  //       />
  //     ),
  //   },
  //   ...metaTablaBase,
  // ] as MetaTabla<Pedido>;

  return (
    <div className="Pedido">
      <MaestroDetalle<Pedido>
        Maestro={
          <>
            <h2>Pedidos</h2>
            <div className="maestro-botones">
              <QBoton onClick={() => emitir("crear_pedido_solicitado")}>
                Nuevo Pedido
              </QBoton>
            </div>
            <Listado<Pedido>
              metaTabla={metaTablaPedido}
              criteria={ctx.pedidos.criteria}
              modo={"tabla"}
              entidades={ctx.pedidos.lista}
              totalEntidades={ctx.pedidos.total}
              seleccionada={ctx.pedidos.activo}
              onSeleccion={(payload) => emitir("pedido_seleccionado", payload)}
              onCriteriaChanged={(payload) =>
                emitir("criteria_cambiado", payload)
              }
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
        <CrearPedido publicar={emitir} />
      </QModal>
    </div>
  );
};
