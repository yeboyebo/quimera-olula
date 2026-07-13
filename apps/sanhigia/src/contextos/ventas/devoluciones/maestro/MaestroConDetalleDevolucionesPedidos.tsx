import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.ts";
import { Listado } from "@olula/componentes/maestro/Listado.js";
import { MaestroDetalle } from "@olula/componentes/maestro/MaestroDetalle.tsx";
import { listaActivaEntidadesInicial } from "@olula/lib/ListaActivaEntidades.js";
import { getUrlParams, useUrlParams } from "@olula/lib/url-params.js";
import { useEffect } from "react";
import { CrearDevolucion } from "../crear/CrearDevolucion.tsx";
import { DetalleDevolucionPedido } from "../detalle/DetalleDevolucionPedido.tsx";
import { DevolucionPedido, metaTablaDevolucionesPedidos } from "../diseño.ts";
import { getMaquina } from "../maquina.ts";
import "./MaestroConDetalleDevolucionesPedidos.css";

export const MaestroConDetalleDevolucionesPedidos = () => {
  const { id, criteria } = getUrlParams();

  const { ctx, emitir } = useMaquina(getMaquina, {
    estado: "INICIAL",
    devoluciones: listaActivaEntidadesInicial<DevolucionPedido>(id, criteria),
  });

  useUrlParams(ctx.devoluciones.activo, ctx.devoluciones.criteria);

  useEffect(() => {
    emitir("recarga_de_devoluciones_solicitada", ctx.devoluciones.criteria);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="DevolucionesPedidos">
      <MaestroDetalle<DevolucionPedido>
        Maestro={
          <>
            <h2>Devoluciones de pedidos</h2>
            <Listado<DevolucionPedido>
              metaTabla={metaTablaDevolucionesPedidos}
              modo="tabla"
              criteria={ctx.devoluciones.criteria}
              entidades={ctx.devoluciones.lista}
              totalEntidades={ctx.devoluciones.total}
              seleccionada={ctx.devoluciones.activo}
              renderAcciones={() => (
                <div className="maestro-botones">
                  <QBoton onClick={() => emitir("creacion_solicitada")}>
                    Nueva devolución
                  </QBoton>
                </div>
              )}
              onSeleccion={(payload) =>
                emitir("devolucion_seleccionada", payload)
              }
              onCriteriaChanged={(payload) =>
                emitir("criteria_cambiado", payload)
              }
              onSiguientePagina={(payload) =>
                emitir("siguiente_pagina", payload)
              }
            />
          </>
        }
        Detalle={
          <DetalleDevolucionPedido
            id={ctx.devoluciones.activo}
            publicar={emitir}
          />
        }
        seleccionada={ctx.devoluciones.activo}
        modoDisposicion="modal"
      />

      <CrearDevolucion
        publicar={emitir}
        onCancelar={() => emitir("creacion_cancelada")}
        activo={ctx.estado === "BUSCANDO_FACTURA"}
      />
    </div>
  );
};
