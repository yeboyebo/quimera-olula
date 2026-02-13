import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.js";
import { MetaTabla } from "@olula/componentes/index.js";
import { ListadoControlado } from "@olula/componentes/maestro/ListadoControlado.js";
import { MaestroDetalleControlado } from "@olula/componentes/maestro/MaestroDetalleControlado.js";
import { Criteria } from "@olula/lib/diseño.js";
import { criteriaDefecto } from "@olula/lib/dominio.js";
import { useCallback, useEffect } from "react";
import { CrearFactura } from "../crear/CrearFactura.tsx";
import { DetalleFactura } from "../detalle/DetalleFactura.tsx";
import { Factura } from "../diseño.ts";
import { metaTablaFactura as metaTablaBase } from "../dominio.ts";
import "./MaestroConDetalleFactura.css";
import { getMaquina } from "./maquina.ts";

export const MaestroConDetalleFactura = () => {
  const { ctx, emitir } = useMaquina(getMaquina, {
    estado: "INICIAL",
    facturas: [],
    totalFacturas: 0,
    facturaActiva: null,
  });

  const setSeleccionada = useCallback(
    (payload: Factura) => {
      emitir("factura_seleccionada", payload);
    },
    [emitir]
  );

  const recargar = useCallback(
    (criteria: Criteria) => {
      void emitir("recarga_de_facturas_solicitada", criteria);
    },
    [emitir]
  );

  useEffect(() => {
    emitir("recarga_de_facturas_solicitada", criteriaDefecto);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const metaTablaFactura = metaTablaBase as MetaTabla<Factura>;

  return (
    <div className="Factura">
      <MaestroDetalleControlado<Factura>
        Maestro={
          <>
            <h2>Facturas</h2>
            <div className="maestro-botones">
              <QBoton onClick={() => emitir("crear_factura_solicitado")}>
                Nueva Factura
              </QBoton>
            </div>
            <ListadoControlado<Factura>
              metaTabla={metaTablaFactura}
              criteriaInicial={criteriaDefecto}
              modo={"tabla"}
              entidades={ctx.facturas}
              totalEntidades={ctx.totalFacturas}
              seleccionada={ctx.facturaActiva}
              onSeleccion={setSeleccionada}
              onCriteriaChanged={recargar}
            />
          </>
        }
        Detalle={
          <DetalleFactura
            facturaInicial={ctx.facturaActiva}
            publicar={emitir}
          />
        }
        seleccionada={ctx.facturaActiva}
        modoDisposicion="maestro-50"
      />

      {ctx.estado === "CREANDO_FACTURA" && (
        <CrearFactura
          publicar={emitir}
          activo={true}
          onCancelar={() => emitir("creacion_factura_cancelada")}
        />
      )}
    </div>
  );
};
