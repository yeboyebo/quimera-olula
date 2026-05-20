import { almacenLocal } from "#/almacen/almacen/infraestructura.ts";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.ts";
import { Listado } from "@olula/componentes/maestro/Listado.js";
import { MaestroDetalle } from "@olula/componentes/maestro/MaestroDetalle.tsx";
import { listaActivaEntidadesInicial } from "@olula/lib/ListaActivaEntidades.js";
import { getUrlParams, useUrlParams } from "@olula/lib/url-params.js";
import { useEffect } from "react";
import { CrearCaja } from "../crear/CrearCaja";
import { DetalleCaja } from "../detalle/DetalleCaja";
import { Caja } from "../diseño.ts";
import { metaTablaCaja } from "./diseño.ts";
import { getMaquina } from "./maquina.ts";

export const MaestroConDetalleCaja = () => {
  const { id, criteria } = getUrlParams();
  const almacenActual = almacenLocal.obtener();

  const { ctx, emitir } = useMaquina(getMaquina, {
    estado: "INICIAL",
    cajas: listaActivaEntidadesInicial<Caja>(id, criteria),
  });

  useUrlParams(ctx.cajas.activo, ctx.cajas.criteria);

  useEffect(() => {
    emitir("recarga_de_cajas_solicitada", ctx.cajas.criteria);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!almacenActual?.id) {
    return (
      <div>
        Seleccione un almacén para ver las cajas.
        <a href="./almacenes">Ir a Almacenes</a>
      </div>
    );
  }

  return (
    <div className="Caja">
      <MaestroDetalle<Caja>
        Maestro={
          <>
            <h2>Cajas: {almacenActual?.nombre_almacen}</h2>
            <Listado<Caja>
              metaTabla={metaTablaCaja}
              criteria={ctx.cajas.criteria}
              entidades={ctx.cajas.lista}
              totalEntidades={ctx.cajas.total}
              seleccionada={ctx.cajas.activo}
              renderAcciones={() => (
                <div className="maestro-botones">
                  <QBoton onClick={() => emitir("creacion_solicitada")}>
                    Nueva Caja
                  </QBoton>
                </div>
              )}
              onSeleccion={(payload) => emitir("caja_seleccionada", payload)}
              onCriteriaChanged={(payload) =>
                emitir("criteria_cambiado", payload)
              }
            />
          </>
        }
        Detalle={<DetalleCaja id={ctx.cajas.activo} publicar={emitir} />}
        seleccionada={ctx.cajas.activo}
        modoDisposicion="maestro-50"
      />

      <CrearCaja
        publicar={emitir}
        onCancelar={() => emitir("creacion_cancelada")}
        activo={ctx.estado === "CREANDO_CAJA"}
      />
    </div>
  );
};
