import { TotalesVenta } from "#/ventas/venta/vistas/TotalesVenta.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { Detalle } from "@olula/componentes/detalle/Detalle.tsx";
import { Tab, Tabs } from "@olula/componentes/detalle/tabs/Tabs.tsx";
import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useCallback } from "react";
import { useParams } from "react-router";
import { Pedido } from "../../diseño.ts";
import { usePedido } from "../../hooks/usePedido.ts";
import "./DetallePedido.css";
import { Lineas } from "./Lineas/Lineas.tsx";
import { TabCliente } from "./TabCliente/TabCliente.tsx";
import { TabDatosBase as TabDatos } from "./TabDatos.tsx";
import { TabObservaciones } from "./TabObservaciones.tsx";

export const DetallePedido = ({
  pedidoInicial = null,
  publicar = () => {},
}: {
  pedidoInicial?: Pedido | null;
  publicar?: EmitirEvento;
}) => {
  const params = useParams();

  const pedido = usePedido({
    pedidoId: pedidoInicial?.id ?? params.id,
    pedidoInicial,
    publicar,
  });

  const { modelo, estado, lineaActiva, emitir } = pedido;

  const titulo = (pedido: Pedido) => pedido.codigo || "Nuevo Pedido";

  const handleBorrar = useCallback(() => {
    emitir("borrar_solicitado");
  }, [emitir]);

  const handleGuardar = useCallback(() => {
    emitir("edicion_de_pedido_lista", modelo);
  }, [emitir, modelo]);

  const handleCancelar = useCallback(() => {
    emitir("edicion_de_pedido_cancelada");
  }, [emitir]);

  return (
    <Detalle
      id={pedidoInicial?.id ?? params.id}
      obtenerTitulo={titulo}
      setEntidad={() => {}}
      entidad={modelo}
      cerrarDetalle={() => emitir("pedido_deseleccionado", null)}
    >
      {!!(pedidoInicial?.id ?? params.id) && (
        <>
          <div className="acciones-rapidas">
            <QBoton tipo="reset" variante="texto" onClick={handleBorrar}>
              Borrar
            </QBoton>
          </div>

          <Tabs>
            <Tab label="Cliente">
              <TabCliente pedido={pedido} publicar={emitir} />
            </Tab>

            <Tab label="Datos">
              <TabDatos pedido={pedido} />
            </Tab>

            <Tab label="Observaciones">
              <TabObservaciones pedido={pedido} />
            </Tab>
          </Tabs>

          {estado === "ABIERTO" && (
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
            divisa={String(modelo.coddivisa ?? "EUR")}
          />

          <Lineas
            pedido={modelo}
            lineaActiva={lineaActiva}
            publicar={emitir}
            estadoPedido={estado}
          />

          <QModalConfirmacion
            nombre="borrarPedido"
            abierto={estado === "BORRANDO_PEDIDO"}
            titulo="Confirmar borrar"
            mensaje="¿Está seguro de que desea borrar este pedido?"
            onCerrar={() => emitir("borrar_cancelado")}
            onAceptar={() => emitir("borrado_de_pedido_listo")}
          />
        </>
      )}
    </Detalle>
  );
};
