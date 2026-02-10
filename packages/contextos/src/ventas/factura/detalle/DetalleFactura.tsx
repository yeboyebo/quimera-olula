import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { Detalle } from "@olula/componentes/detalle/Detalle.tsx";
import { Tab, Tabs } from "@olula/componentes/detalle/tabs/Tabs.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.js";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useModelo } from "@olula/lib/useModelo.js";
import { useCallback, useEffect, useRef } from "react";
import { useParams } from "react-router";
import { TotalesVenta } from "../../venta/vistas/TotalesVenta.tsx";
import { BorrarFactura } from "../borrar/BorrarFactura.tsx";
import { Factura } from "../diseño.ts";
import { facturaVacia } from "../dominio.ts";
import "./DetalleFactura.css";
import { editable, metaFactura } from "./diseño.ts";
import { Lineas } from "./Lineas/Lineas.tsx";
import { getMaquina } from "./maquina.ts";
import { TabCliente } from "./TabCliente/TabCliente.tsx";
import { TabDatos } from "./TabDatos.tsx";
import { TabObservaciones } from "./TabObservaciones.tsx";

export const DetalleFactura = ({
  facturaInicial = null,
  publicar = async () => {},
}: {
  facturaInicial?: Factura | null;
  publicar?: EmitirEvento;
}) => {
  const params = useParams();
  const facturaId = facturaInicial?.id ?? params.id;
  const facturaIdCargadaRef = useRef<string | null>(null);

  const { ctx, emitir } = useMaquina(
    getMaquina,
    {
      estado: "INICIAL",
      factura: facturaInicial || facturaVacia(),
      facturaInicial: facturaInicial || facturaVacia(),
      lineaActiva: null,
    },
    publicar
  );

  const factura = useModelo(metaFactura, ctx.factura);

  useEffect(() => {
    if (facturaId && facturaId !== facturaIdCargadaRef.current) {
      facturaIdCargadaRef.current = facturaId;
      emitir("factura_id_cambiado", facturaId, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facturaId]);

  const { estado, lineaActiva } = ctx;

  const titulo = (factura: Factura) => factura.codigo || "Nueva Factura";

  const handleBorrar = useCallback(() => {
    emitir("borrar_solicitado");
  }, [emitir]);

  const handleGuardar = useCallback(() => {
    emitir("edicion_de_factura_lista", factura.modelo);
  }, [emitir, factura]);

  const handleCancelar = useCallback(() => {
    emitir("edicion_de_factura_cancelada");
  }, [emitir]);

  return (
    <Detalle
      id={facturaId}
      obtenerTitulo={titulo}
      setEntidad={() => {}}
      entidad={ctx.factura}
      cerrarDetalle={() => emitir("factura_deseleccionada", null)}
    >
      {!!facturaId && (
        <>
          <div className="acciones-rapidas">
            <QBoton tipo="reset" variante="texto" onClick={handleBorrar}>
              Borrar
            </QBoton>
          </div>

          <Tabs>
            <Tab label="Cliente">
              <TabCliente factura={factura} publicar={emitir} />
            </Tab>

            <Tab label="Datos">
              <TabDatos factura={factura} />
            </Tab>

            <Tab label="Observaciones">
              <TabObservaciones factura={factura} />
            </Tab>
          </Tabs>

          {editable(ctx.factura) && (
            <div className="botones maestro-botones">
              <QBoton onClick={handleGuardar}>Guardar Cambios</QBoton>
              <QBoton tipo="reset" variante="texto" onClick={handleCancelar}>
                Cancelar
              </QBoton>
            </div>
          )}

          <TotalesVenta
            neto={Number(ctx.factura.neto ?? 0)}
            totalIva={Number(ctx.factura.total_iva ?? 0)}
            total={Number(ctx.factura.total ?? 0)}
            divisa={String(ctx.factura.divisa_id || "EUR")}
          />

          <Lineas
            factura={ctx.factura}
            lineaActiva={lineaActiva}
            estadoFactura={estado}
            publicar={emitir}
          />

          {estado === "BORRANDO_FACTURA" && (
            <BorrarFactura factura={ctx.factura} publicar={emitir} />
          )}
        </>
      )}
    </Detalle>
  );
};
