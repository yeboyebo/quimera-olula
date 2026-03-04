import { BorrarPedido } from "#/ventas/pedido/borrar/BorrarPedido.tsx";
import {
  editable,
  metaPedido,
  pedidoVacio,
} from "#/ventas/pedido/detalle/dominio.ts";

import { Agente } from "#/ventas/comun/componentes/agente.tsx";
import { Lineas } from "#/ventas/pedido/detalle/Lineas/Lineas.tsx";
import { getMaquina } from "#/ventas/pedido/detalle/maquina.ts";
import { TabCliente } from "#/ventas/pedido/detalle/TabCliente/TabCliente.tsx";
import { TabObservaciones } from "#/ventas/pedido/detalle/TabObservaciones.tsx";
import { Pedido } from "#/ventas/pedido/diseño.ts";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QDate } from "@olula/componentes/atomos/qdate.tsx";
import { Detalle } from "@olula/componentes/detalle/Detalle.tsx";
import { Tab, Tabs } from "@olula/componentes/detalle/tabs/Tabs.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.js";
import { QuimeraAcciones } from "@olula/componentes/index.js";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useModelo } from "@olula/lib/useModelo.js";
import { useCallback } from "react";
import { useNavigate, useParams } from "react-router";
import "./DetallePedido.css";

import { HookModelo } from "@olula/lib/useModelo.ts";

export const DetallePedidoNrj = ({
  pedidoInicial = null,
  publicar = async () => {},
}: {
  pedidoInicial?: Pedido | null;
  publicar?: EmitirEvento;
}) => {
  const params = useParams();
  const navigate = useNavigate();
  const pedidoId = pedidoInicial?.id ?? params.id;

  const { ctx, emitir } = useMaquina(
    getMaquina,
    {
      estado: "INICIAL",
      pedido: pedidoInicial || pedidoVacio(),
      pedidoInicial: pedidoInicial || pedidoVacio(),
      lineaActiva: null,
    },
    publicar
  );

  const pedido = useModelo(metaPedido, ctx.pedido);

  if (pedidoId && pedidoId !== ctx.pedido.id) {
    emitir("pedido_id_cambiado", pedidoId, true);
  }

  const { estado, lineaActiva } = ctx;

  const titulo = (pedido: Pedido) => pedido.codigo || "Nuevo Pedido";

  const handleGuardar = useCallback(() => {
    emitir("edicion_de_pedido_lista", pedido.modelo);
  }, [emitir, pedido]);

  const handleCancelar = useCallback(() => {
    emitir("edicion_de_pedido_cancelada");
  }, [emitir]);

  const handleAlbaranar = useCallback(() => {
    const id = ctx.pedido.id ?? params.id;
    if (id) navigate(`/ventas/albaranar-pedido/${id}`);
  }, [navigate, ctx.pedido, params.id]);

  const acciones = [
    /*     {
      texto: "Albaranar",
      onClick: handleAlbaranar,
      deshabilitado: false,
    }, */
    {
      icono: "eliminar",
      texto: "Borrar",
      onClick: () => emitir("borrar_solicitado"),
      deshabilitado: false,
    },
  ];

  return (
    <Detalle
      id={pedidoId}
      obtenerTitulo={titulo}
      setEntidad={() => {}}
      entidad={ctx.pedido}
      cerrarDetalle={() => publicar("pedido_deseleccionado", null)}
    >
      {!!pedidoId && (
        <>
          {/* <div className="acciones-rapidas">
            <QBoton tipo="reset" variante="texto" onClick={handleBorrar}>
              Borrar
            </QBoton>
          </div> */}
          {editable(ctx.pedido) && (
            <QuimeraAcciones acciones={acciones} vertical />
          )}

          <Tabs>
            <Tab label="Cliente">
              <TabCliente pedido={pedido} estado={estado} publicar={emitir} />
            </Tab>

            <Tab label="Datos">
              <TabDatosNrj pedido={pedido} />
            </Tab>

            <Tab label="Observaciones">
              <TabObservaciones pedido={pedido} />
            </Tab>
          </Tabs>

          {editable(ctx.pedido) && (
            <div className="botones maestro-botones">
              <QBoton onClick={handleGuardar}>Guardar Cambios</QBoton>
              <QBoton tipo="reset" variante="texto" onClick={handleCancelar}>
                Cancelar
              </QBoton>
            </div>
          )}

          {/*           <TotalesVenta
            neto={Number(ctx.pedido.neto ?? 0)}
            totalIva={Number(ctx.pedido.total_iva ?? 0)}
            total={Number(ctx.pedido.total ?? 0)}
            divisa={String(ctx.pedido.coddivisa ?? "EUR")}
          /> */}

          <Lineas
            pedido={ctx.pedido}
            lineaActiva={lineaActiva}
            publicar={emitir}
            estadoPedido={estado}
          />

          {estado === "BORRANDO_PEDIDO" && (
            <BorrarPedido pedido={ctx.pedido} publicar={emitir} />
          )}
        </>
      )}
    </Detalle>
  );
};

export interface TabDatosProps {
  pedido: HookModelo<Pedido>;
}

export const TabDatosNrj = ({ pedido }: TabDatosProps) => {
  const { uiProps } = pedido;

  return (
    <div className="TabDatos">
      <quimera-formulario>
        <QDate label="Fecha" {...uiProps("fecha")} />
        <div id="espacio_fecha" />
        {/*         <Divisa {...uiProps("divisa_id")} />
        <QInput label="T. Conversión" {...uiProps("tasa_conversion")} />
        <QInput {...uiProps("total_divisa_empresa")} label="Total €" /> */}
        <Agente {...uiProps("agente_id", "nombre_agente")} />
        <div id="espacio_agente" />
        {/*         <FormaPago {...uiProps("forma_pago_id", "nombre_forma_pago")} />
        <GrupoIvaNegocio {...uiProps("grupo_iva_negocio_id")} /> */}
      </quimera-formulario>
    </div>
  );
};
