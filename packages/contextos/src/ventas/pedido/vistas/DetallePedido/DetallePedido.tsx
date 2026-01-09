import { TotalesVenta } from "#/ventas/venta/vistas/TotalesVenta.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { Detalle } from "@olula/componentes/detalle/Detalle.tsx";
import { Tab, Tabs } from "@olula/componentes/detalle/tabs/Tabs.tsx";
import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { EmitirEvento, Entidad } from "@olula/lib/diseño.ts";
import { ConfigMaquina4, useMaquina4 } from "@olula/lib/useMaquina.ts";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useContext } from "react";
import { useParams } from "react-router";
import { Pedido } from "../../diseño.ts";
import { metaPedido, pedidoVacio } from "../../dominio.ts";
import { borrarPedido, getPedido, patchPedido } from "../../infraestructura.ts";
import "./DetallePedido.css";
import { Lineas } from "./Lineas/Lineas.tsx";
import { TabCliente } from "./TabCliente/TabCliente.tsx";
import { TabDatosBase as TabDatos } from "./TabDatos.tsx";
import { TabObservaciones } from "./TabObservaciones.tsx";

type ParamOpcion = {
  valor: string;
  descripcion?: string;
};
export type ValorControl = null | string | ParamOpcion;
type Estado = "Defecto" | "ConfirmarBorrado";
type Contexto = Record<string, unknown>;

export const DetallePedido = ({
  pedidoInicial = null,
  emitir = () => {},
}: {
  pedidoInicial?: Pedido | null;
  emitir?: EmitirEvento;
}) => {
  // const appFactory = useContext(FactoryCtx);

  // const TabDatos = appFactory.app.Ventas.PedidoTabDatos as (props: {
  //   pedido: HookModelo<Pedido>;
  // }) => JSX.Element;

  const params = useParams();
  const { intentar } = useContext(ContextoError);

  const pedidoId = pedidoInicial?.id ?? params.id;
  const titulo = (pedido: Entidad) => pedido.codigo as string;

  const pedido = useModelo(metaPedido, pedidoVacio());
  const { modelo, init } = pedido;

  const configMaquina: ConfigMaquina4<Estado, Contexto> = {
    inicial: {
      estado: "Defecto",
      contexto: {},
    },
    estados: {
      Defecto: {
        guardar_iniciado: "Defecto",
        cliente_pedido_cambiado: "Defecto",
        borrar_solicitado: "ConfirmarBorrado",
      },
      ConfirmarBorrado: {
        borrar_confirmado: "Defecto",
        borrar_cancelado: "Defecto",
      },
    },
  };

  const [emitirPedido, { estado }] = useMaquina4<Estado, Contexto>({
    config: configMaquina,
  });

  const recargarCabecera = async () => {
    const nuevoPedido = await getPedido(modelo.id);
    init(nuevoPedido);
    emitir("pedido_cambiado", nuevoPedido);
  };

  const guardar = async () => {
    await intentar(() => patchPedido(modelo.id, modelo));
    await recargarCabecera();
    emitirPedido("guardar_iniciado");
  };

  const cancelar = () => {
    init();
    emitir("cancelar_seleccion");
  };

  const onBorrarConfirmado = async () => {
    await intentar(() => borrarPedido(modelo.id));
    emitir("pedido_borrado", modelo);
    emitirPedido("borrar_confirmado");
  };

  return (
    <Detalle
      id={pedidoId}
      obtenerTitulo={titulo}
      setEntidad={(p) => init(p)}
      entidad={modelo}
      cargar={getPedido}
      cerrarDetalle={cancelar}
    >
      {!!pedidoId && (
        <>
          <div className="botones maestro-botones ">
            <QBoton onClick={() => emitirPedido("borrar_solicitado")}>
              Borrar
            </QBoton>
          </div>
          <Tabs
            children={[
              <Tab
                key="tab-1"
                label="Cliente"
                children={
                  <TabCliente pedido={pedido} publicar={emitirPedido} />
                }
              />,
              <Tab
                key="tab-2"
                label="Datos"
                children={<TabDatos pedido={pedido} />}
              />,
              <Tab
                key="tab-3"
                label="Observaciones"
                children={<TabObservaciones pedido={pedido} />}
              />,
            ]}
          ></Tabs>
          {pedido.modificado && (
            <div className="botones maestro-botones ">
              <QBoton onClick={guardar} deshabilitado={!pedido.valido}>
                Guardar
              </QBoton>
              <QBoton tipo="reset" variante="texto" onClick={cancelar}>
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
          {pedidoId && (
            <Lineas
              pedidoId={pedidoId}
              pedidoEditable={pedido.editable}
              onCabeceraModificada={recargarCabecera}
            />
          )}

          <QModalConfirmacion
            nombre="borrarPedido"
            abierto={estado === "ConfirmarBorrado"}
            titulo="Confirmar borrar"
            mensaje="¿Está seguro de que desea borrar este pedido?"
            onCerrar={() => emitirPedido("borrar_cancelado")}
            onAceptar={onBorrarConfirmado}
          />
        </>
      )}
    </Detalle>
  );
};
