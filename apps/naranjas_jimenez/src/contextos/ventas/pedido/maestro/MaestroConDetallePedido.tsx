import { CrearPedido } from "#/ventas/pedido/crear/CrearPedido.tsx";
import { DetallePedido } from "#/ventas/pedido/detalle/DetallePedido.tsx";
import { getMaquina } from "#/ventas/pedido/maestro/maquina.ts";
import { ColumnaEstadoTabla } from "#/comun/componentes/ColumnaEstadoTabla.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.js";
import { QIcono } from "@olula/componentes/index.js";
import { Listado } from "@olula/componentes/maestro/Listado.js";
import { MetaFiltro } from "@olula/componentes/maestro/maestroFiltros/MaestroFiltrosActivoControlado.tsx";
import { MaestroDetalle } from "@olula/componentes/maestro/MaestroDetalle.tsx";
import { QModal } from "@olula/componentes/moleculas/qmodal.tsx";
import { criteriaDefecto, formatearFechaDate, formatearMoneda } from "@olula/lib/dominio.js";
import { ClausulaFiltro } from "@olula/lib/diseño.ts";
import { listaActivaEntidadesInicial } from "@olula/lib/ListaActivaEntidades.js";
import { getUrlParams, useUrlParams } from "@olula/lib/url-params.js";
import { useCallback, useEffect, useState } from "react";
import { PedidoNrj } from "../diseño.ts";
import "./MaestroConDetallePedido.css";
import { getMetaTablaPedidoNrj } from "./metatabla_pedido.tsx";

type Layout = "TABLA" | "TARJETA";

const FILTRO_TERMINADOS: ClausulaFiltro = ["estado_envio_palets", "<>", "completo"];

const metaFiltroNrj: MetaFiltro = {
  campos: {
    estado_envio_palets: {
      id: "estado_envio_palets",
      label: "Mostrar terminados",
      tipo: "checkbox",
      filtro: (v) =>
        v === "true"
          ? (null as unknown as ClausulaFiltro)
          : FILTRO_TERMINADOS,
    },
  },
};

const criteriaInicialNrj = {
  ...criteriaDefecto,
  filtro: [FILTRO_TERMINADOS],
};

export const MaestroConDetallePedidoNrj = () => {
  const { id, criteria } = getUrlParams();
  const criteriaBase = criteria.filtro.length > 0 ? criteria : criteriaInicialNrj;

  const [layout, setLayout] = useState<Layout>("TARJETA");

  const { ctx, emitir } = useMaquina(getMaquina, {
    estado: "INICIAL",
    pedidos: listaActivaEntidadesInicial<PedidoNrj>(id, criteriaBase),
  });

  useUrlParams(ctx.pedidos.activo, ctx.pedidos.criteria);

  const cambiarLayout = useCallback(
    () => setLayout(layout === "TARJETA" ? "TABLA" : "TARJETA"),
    [layout, setLayout]
  );

  useEffect(() => {
    emitir("recarga_de_pedidos_solicitada", criteriaInicialNrj);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const metaTablaPedido = getMetaTablaPedidoNrj();

  return (
    <div className="Pedido">
      <MaestroDetalle<PedidoNrj>
        Maestro={
          <>
            <h2>Pedidos</h2>
            <div className="maestro-botones">
              <QBoton
                texto={
                  layout === "TARJETA" ? "Cambiar a TABLA" : "Cambiar a TARJETA"
                }
                onClick={cambiarLayout}
              />
              <QBoton onClick={() => emitir("crear_pedido_solicitado")}>
                Nuevo Pedido
              </QBoton>
            </div>
            <Listado<PedidoNrj>
              metaTabla={metaTablaPedido}
              metaFiltro={metaFiltroNrj}
              criteriaInicial={criteriaInicialNrj}
              criteria={ctx.pedidos.criteria}
              modo={layout === "TARJETA" ? "tarjetas" : "tabla"}
              tarjeta={TarjetaPedidoNrj}
              entidades={ctx.pedidos.lista as PedidoNrj[]}
              totalEntidades={ctx.pedidos.total}
              seleccionada={ctx.pedidos.activo}
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
        nombre="modal"
        abierto={ctx.estado === "CREANDO_PEDIDO"}
        onCerrar={() => emitir("creacion_pedido_cancelada")}
      >
        <CrearPedido publicar={emitir} />
      </QModal>
    </div>
  );
};

const estadoCompleto = (
  <QIcono
    nombre={"circulo_relleno"}
    tamaño="sm"
    color="var(--color-exito-oscuro)"
  />
);

const estadoPendiente = (
  <QIcono
    nombre={"circulo_relleno"}
    tamaño="sm"
    color="var(--color-error-oscuro)"
  />
);

const estadoParcial = (
  <QIcono
    nombre={"circulo_relleno"}
    tamaño="sm"
    color="var(--color-advertencia-claro)"
  />
);

const TarjetaPedidoNrj = (pedido: PedidoNrj) => {
  return (
    <div className="tarjeta-pedido" key={pedido.id}>
      <div className="tarjeta-pedido-izquierda">
        <ColumnaEstadoTabla
          estados={{
            completo: estadoCompleto,
            pendiente: estadoPendiente,
            parcial: estadoParcial,
          }}
          estadoActual={pedido.estado_envio_palets}
        />
        <div className="tarjeta-pedido-izquierda-textos">
          <div>{`${pedido.codigo} - ${formatearFechaDate(pedido.fecha)}`}</div>
          <div>{pedido.nombre_cliente}</div>
        </div>
      </div>
      <div className="tarjeta-pedido-derecha">
        {`${formatearMoneda(pedido.total, pedido.divisa_id)}`}
      </div>
    </div>
  );
};
