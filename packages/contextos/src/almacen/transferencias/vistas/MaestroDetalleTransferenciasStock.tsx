import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { MetaTabla } from "@olula/componentes/atomos/qtabla.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.js";
import { ListadoActivoControlado } from "@olula/componentes/maestro/ListadoActivoControlado.tsx";
import { MaestroDetalleActivoControlado } from "@olula/componentes/maestro/MaestroDetalleActivoControlado.tsx";
import { listaActivaEntidadesInicial } from "@olula/lib/ListaActivaEntidades.js";
import { getUrlParams, useUrlParams } from "@olula/lib/url-params.js";
import { useEffect } from "react";
import { TransferenciaStock } from "../diseño.ts";
import {
  Contexto,
  getMaquina,
} from "../maquina_listado_transferencias_stock.ts";
import { CrearTransferenciaStock } from "./CrearTransferenciaStock.tsx";
import { DetalleTransferenciaStock } from "./DetalleTransferenciaStock.tsx";

const metaTablaTransferenciaStock: MetaTabla<TransferenciaStock> = [
  { id: "id", cabecera: "ID" },
  { id: "nombre_origen", cabecera: "Origen" },
  { id: "nombre_destino", cabecera: "Destino" },
  {
    id: "fecha",
    cabecera: "Fecha",
    render: (v) =>
      new Date(v.fecha).toLocaleString(undefined, {
        month: "2-digit",
        day: "2-digit",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
  },
];

export const MaestroDetalleTransferenciasStock = () => {
  const { id, criteria } = getUrlParams();

  const { ctx, emitir } = useMaquina(getMaquina, {
    estado: "INICIAL",
    transferencias: listaActivaEntidadesInicial<TransferenciaStock>(
      id,
      criteria
    ),
  } as Contexto);

  useUrlParams(ctx.transferencias.activo, ctx.transferencias.criteria);

  useEffect(() => {
    emitir("recarga_de_transferencias_solicitada", ctx.transferencias.criteria);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="TransferenciaStock">
      <MaestroDetalleActivoControlado<TransferenciaStock>
        seleccionada={ctx.transferencias.activo}
        layout="TABLA"
        Maestro={
          <>
            <h2>Transferencias</h2>
            <div className="maestro-botones">
              <QBoton onClick={() => emitir("crear")}>Nueva</QBoton>
            </div>
            <ListadoActivoControlado<TransferenciaStock>
              metaTabla={metaTablaTransferenciaStock}
              criteria={ctx.transferencias.criteria}
              modo="tabla"
              entidades={ctx.transferencias.lista}
              totalEntidades={ctx.transferencias.total}
              seleccionada={ctx.transferencias.activo}
              onSeleccion={(payload) =>
                emitir("transferencia_seleccionada", payload)
              }
              onCriteriaChanged={(payload) =>
                emitir("criteria_cambiado", payload)
              }
            />
          </>
        }
        Detalle={
          <DetalleTransferenciaStock
            id={ctx.transferencias.activo}
            publicar={emitir}
          />
        }
      />
      <CrearTransferenciaStock
        publicar={emitir}
        activo={ctx.estado === "CREANDO"}
      />
    </div>
  );
};
