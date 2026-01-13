import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { Detalle } from "@olula/componentes/detalle/Detalle.tsx";
import { Tab, Tabs } from "@olula/componentes/detalle/tabs/Tabs.tsx";
import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useCallback } from "react";
import { useParams } from "react-router";
import { TotalesVenta } from "../../../venta/vistas/TotalesVenta.tsx";
import { Factura } from "../../diseño.ts";
import { editable } from "../../dominio.ts";
import { useFactura } from "../../hooks/useFactura.ts";
import "./DetalleFactura.css";
import { Lineas } from "./Lineas/Lineas.tsx";
import { TabCliente } from "./TabCliente/TabCliente.tsx";
import { TabDatos } from "./TabDatos.tsx";
import { TabObservaciones } from "./TabObservaciones.tsx";

export const DetalleFactura = ({
  facturaInicial = null,
  publicar = () => {},
}: {
  facturaInicial?: Factura | null;
  publicar?: EmitirEvento;
}) => {
  const params = useParams();

  const factura = useFactura({
    facturaId: facturaInicial?.id ?? params.id,
    facturaInicial,
    publicar,
  });

  const { modelo, estado, emitir } = factura;

  const titulo = (factura: Factura) => factura.codigo || "Nueva Factura";

  const handleBorrar = useCallback(() => {
    emitir("borrar_solicitado");
  }, [emitir]);

  const handleGuardar = useCallback(() => {
    emitir("edicion_de_factura_lista", modelo);
  }, [emitir, modelo]);

  const handleCancelar = useCallback(() => {
    emitir("edicion_de_factura_cancelada");
  }, [emitir]);

  return (
    <Detalle
      id={facturaInicial?.id ?? params.id}
      obtenerTitulo={titulo}
      setEntidad={() => {}}
      entidad={modelo}
      cerrarDetalle={() => emitir("factura_deseleccionada", null)}
    >
      {!!(facturaInicial?.id ?? params.id) && (
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

          {editable(modelo) && (
            <div className="botones maestro-botones">
              <QBoton onClick={handleGuardar}>Guardar Cambios</QBoton>
              <QBoton tipo="reset" variante="texto" onClick={handleCancelar}>
                Cancelar
              </QBoton>
            </div>
          )}

          <TotalesVenta
            neto={Number(modelo.neto ?? 0)}
            totalIva={Number(modelo.total_iva ?? 0)}
            total={Number(modelo.total ?? 0)}
            divisa={String(modelo.divisa_id || "EUR")}
          />

          <Lineas
            factura={modelo}
            lineaActiva={null}
            estadoFactura={estado}
            publicar={emitir}
          />

          <QModalConfirmacion
            nombre="borrarFactura"
            abierto={estado === "BORRANDO_FACTURA"}
            titulo="Confirmar borrar"
            mensaje="¿Está seguro de que desea borrar esta factura?"
            onCerrar={() => emitir("borrar_cancelado")}
            onAceptar={() => emitir("borrado_de_factura_listo")}
          />
        </>
      )}
    </Detalle>
  );
};
