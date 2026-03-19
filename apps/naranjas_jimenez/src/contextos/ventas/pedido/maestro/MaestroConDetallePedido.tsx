import { ColumnaEstadoTabla } from "#/comun/componentes/ColumnaEstadoTabla.tsx";
import { CrearPedido } from "#/ventas/pedido/crear/CrearPedido.tsx";
import { DetallePedido } from "#/ventas/pedido/detalle/DetallePedido.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.js";
import { QIcono } from "@olula/componentes/index.js";
import { Listado } from "@olula/componentes/maestro/Listado.js";
import { MaestroDetalle } from "@olula/componentes/maestro/MaestroDetalle.tsx";
import { useEsMovil } from "@olula/componentes/maestro/useEsMovil.js";
import { QModal } from "@olula/componentes/moleculas/qmodal.tsx";
import { ClausulaFiltro } from "@olula/lib/diseño.ts";
import {
  criteriaDefecto,
  formatearFechaDate,
} from "@olula/lib/dominio.js";
import { listaActivaEntidadesInicial } from "@olula/lib/ListaActivaEntidades.js";
import { getUrlParams, useUrlParams } from "@olula/lib/url-params.js";
import { useEffect } from "react";
import { PedidoNrj } from "../diseño.ts";
import { FiltrosPedidoNrj } from "./FiltrosPedidoNrj.tsx";
import "./MaestroConDetallePedido.css";
import { getMaquina } from "./maquina.ts";
import { getMetaTablaPedidoNrj } from "./metatabla_pedido.tsx";

const FILTRO_TERMINADOS: ClausulaFiltro = [
  "estado_envio_palets",
  "!",
  "completo",
];

const metaTablaPedidoNrj = getMetaTablaPedidoNrj();

const criteriaInicialNrj = {
  ...criteriaDefecto,
  filtro: [FILTRO_TERMINADOS],
};

export const MaestroConDetallePedidoNrj = () => {
  const { id, criteria } = getUrlParams();
  const criteriaBase =
    criteria.filtro.length > 0 ? criteria : criteriaInicialNrj;

  const esMovil = useEsMovil();

  const { ctx, emitir } = useMaquina(getMaquina, {
    estado: "INICIAL",
    pedidos: listaActivaEntidadesInicial<PedidoNrj>(id, criteriaBase),
  });

  useUrlParams(ctx.pedidos.activo, ctx.pedidos.criteria);

  // Oculta FILTRO_TERMINADOS del criteria visual (para el contador del panel de filtros)
  // El marcador ["estado_envio_palets","!","true"] sí se muestra (indica checkbox activo)
  const criteriaParaListado = {
    ...ctx.pedidos.criteria,
    filtro: ctx.pedidos.criteria.filtro.filter(
      (f) => !(f[0] === "estado_envio_palets" && f[2] === "completo")
    ),
  };

  // Re-inyecta FILTRO_TERMINADOS o el marcador "show all" en el criteria real
  const conFiltroTerminados = (payload: typeof ctx.pedidos.criteria) => {
    const hasMostrar = payload.filtro.some(
      (f) => f[0] === "estado_envio_palets" && f[2] === "fake"
    );
    const sinEstado = payload.filtro.filter(
      (f) => f[0] !== "estado_envio_palets"
    );
    return {
      ...payload,
      filtro: hasMostrar
        ? [...sinEstado, ["estado_envio_palets", "!", "fake"] as ClausulaFiltro]
        : [...sinEstado, FILTRO_TERMINADOS],
    };
  };

  useEffect(() => {
    emitir("recarga_de_pedidos_solicitada", criteriaInicialNrj);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="Pedido">
      <MaestroDetalle<PedidoNrj>
        Maestro={
          <>
            <h2>Pedidos</h2>
            <div className="maestro-botones">
              <QBoton onClick={() => emitir("crear_pedido_solicitado")}>
                Nuevo Pedido
              </QBoton>
            </div>
            <FiltrosPedidoNrj
              filtro={criteriaParaListado.filtro}
              onFiltroChanged={(filtro) =>
                emitir(
                  "criteria_cambiado",
                  conFiltroTerminados({
                    ...ctx.pedidos.criteria,
                    filtro,
                    paginacion: {
                      ...ctx.pedidos.criteria.paginacion,
                      pagina: 1,
                    },
                  })
                )
              }
            />
            <Listado<PedidoNrj>
              metaTabla={metaTablaPedidoNrj}
              metaFiltro={{ campos: {} }}
              criteriaInicial={criteriaDefecto}
              criteria={criteriaParaListado}
              modo={esMovil ? "tarjetas" : "tabla"}
              tarjeta={TarjetaPedidoNrj}
              entidades={ctx.pedidos.lista as PedidoNrj[]}
              totalEntidades={ctx.pedidos.total}
              seleccionada={ctx.pedidos.activo}
              onSeleccion={(payload) => emitir("pedido_seleccionado", payload)}
              onCriteriaChanged={(payload) =>
                emitir("criteria_cambiado", conFiltroTerminados(payload))
              }
              onSiguientePagina={(payload) =>
                emitir("siguiente_pagina", conFiltroTerminados(payload))
              }
            />
          </>
        }
        Detalle={<DetallePedido id={ctx.pedidos.activo} publicar={emitir} />}
        layout={esMovil ? "TARJETA" : "TABLA"}
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
      <div className="tarjeta-pedido-contenido">
        <div className="tarjeta-pedido-fila">
          <span>{pedido.codigo}</span>
          <div className="tarjeta-pedido-derecha">
            <span>{formatearFechaDate(pedido.fecha)}</span>
            <ColumnaEstadoTabla
              estados={{
                completo: estadoCompleto,
                pendiente: estadoPendiente,
                parcial: estadoParcial,
              }}
              estadoActual={pedido.estado_envio_palets}
            />
          </div>
        </div>
        <div>{`${pedido.cliente_id} - ${pedido.nombre_cliente}`}</div>
        <div>{pedido.agente_id ? `${pedido.agente_id} - ${pedido.nombre_agente}` : "Sin agente"}</div>
      </div>
    </div>
  );
};
