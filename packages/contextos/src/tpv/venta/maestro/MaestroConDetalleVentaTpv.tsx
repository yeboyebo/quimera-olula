import { ColumnaEstadoTabla } from "#/comun/componentes/ColumnaEstadoTabla.tsx";
import { AgenteTpvActual } from "#/tpv/agente/agente_actual/AgenteTpvActual.tsx";
import { puntoVentaLocal } from "#/tpv/comun/infraestructura.ts";
import { PuntoVentaTpvActual } from "#/tpv/punto_de_venta/punto_actual/PuntoVentaTpvActual.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.js";
import { QIcono } from "@olula/componentes/index.js";
import { ListadoActivoControlado } from "@olula/componentes/maestro/ListadoActivoControlado.js";
import { MaestroDetalleActivoControlado } from "@olula/componentes/maestro/MaestroDetalleActivoControlado.tsx";
import { ClausulaFiltro } from "@olula/lib/diseño.js";
import {
  criteriaDefecto,
  formatearFechaDate,
  formatearMoneda,
} from "@olula/lib/dominio.js";
import { listaActivaEntidadesInicial } from "@olula/lib/ListaActivaEntidades.js";
import { getUrlParams, useUrlParams } from "@olula/lib/url-params.js";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DetalleVentaTpv } from "../detalle/DetalleVentaTpv.tsx";
import { VentaTpv } from "../diseño.ts";
import { metaTablaFactura } from "./maestro.ts";
import "./MaestroConDetalleVentaTpv.css";
import { getMaquina } from "./maquina.ts";

type Layout = "TABLA" | "TARJETA";

export const MaestroConDetalleVentaTpv = () => {
  const miPuntoVentaLocal = puntoVentaLocal.obtenerSeguro();
  const criteriaBaseVentas = useMemo(() => {
    const filtroPuntoVenta: ClausulaFiltro = [
      "punto_venta_id",
      miPuntoVentaLocal?.id ?? "",
    ];
    return {
      ...criteriaDefecto,
      filtro: [...criteriaDefecto.filtro, filtroPuntoVenta],
      orden: ["fecha", "DESC", 'codigo', 'DESC']
    };
  }, [miPuntoVentaLocal?.id]);

  const [layout, setLayout] = useState<Layout>("TARJETA");

  const { id, criteria } = getUrlParams();
  const criteriaInicial = criteria.filtro.length > 0 ? criteria : criteriaBaseVentas;

  const { ctx, emitir } = useMaquina(getMaquina, {
    estado: "INICIAL",
    ventas: listaActivaEntidadesInicial<VentaTpv>(id, criteriaInicial),
  });

  useUrlParams(ctx.ventas.activo, ctx.ventas.criteria);

  const cambiarLayout = useCallback(
    () => setLayout(layout === "TARJETA" ? "TABLA" : "TARJETA"),
    [layout, setLayout]
  );

  useEffect(() => {
    emitir("recarga_de_ventas_solicitada", ctx.ventas.criteria);
  }, []);

  return (
    <div className="Factura">
      <MaestroDetalleActivoControlado<VentaTpv>
        Maestro={
          <>
            <h2>Ventas TPV</h2>
            <div className="maestro-botones">
              <QBoton
                texto={
                  layout === "TARJETA" ? "Cambiar a TABLA" : "Cambiar a TARJETA"
                }
                onClick={cambiarLayout}
              />
            </div>
            <PuntoVentaTpvActual />
            <AgenteTpvActual />
            <div className="maestro-botones">
              <QBoton onClick={() => emitir("creacion_de_venta_solicitada")}>Nueva Venta</QBoton>
            </div>
            <ListadoActivoControlado<VentaTpv>
              metaTabla={metaTablaFactura}
              metaFiltro={true}
              criteria={ctx.ventas.criteria}
              modo={layout === "TARJETA" ? "tarjetas" : "tabla"}
              tarjeta={TarjetaVentaTpv}
              entidades={ctx.ventas.lista}
              totalEntidades={ctx.ventas.total}
              seleccionada={ctx.ventas.activo}
              onSeleccion={(payload) => emitir("venta_seleccionada", payload)}
              onCriteriaChanged={(payload) => emitir("criteria_cambiado", payload)}
              onSiguientePagina={(payload) => emitir("siguiente_pagina", payload)}
            />
          </>
        }
        Detalle={
          <DetalleVentaTpv id={ctx.ventas.activo} publicar={emitir} />
        }
        layout={layout}
        seleccionada={ctx.ventas.activo}
        modoDisposicion="maestro-50"
      />
    </div>
  );
};

const TarjetaVentaTpv = (venta: VentaTpv) => {
  return (
    <div className="tarjeta-venta">
      <div className="tarjeta-venta-izquierda">
        <ColumnaEstadoTabla
          estados={{
            abierta,
            cerrada,
          }}
          estadoActual={venta.abierta ? "abierta" : "cerrada"}
        />
        <div className="tarjeta-venta-izquierda-textos">
          <div>{`${venta.codigo} - ${formatearFechaDate(venta.fecha)}`}</div>
          {venta.nombre_cliente !== "VENTA AL CONTADO" && (
            <div>{venta.nombre_cliente}</div>
          )}
        </div>
      </div>
      <div className="tarjeta-venta-derecha">
        {`${formatearMoneda(venta.total, venta.divisa_id)}`}
      </div>
    </div>
  );
};

const abierta = (
  <QIcono
    nombre={"circulo_relleno"}
    tamaño="sm"
    color="var(--color-exito-oscuro)"
  />
);

const cerrada = (
  <QIcono
    nombre={"circulo_relleno"}
    tamaño="sm"
    color="var(--color-deshabilitado-oscuro)"
  />
);
