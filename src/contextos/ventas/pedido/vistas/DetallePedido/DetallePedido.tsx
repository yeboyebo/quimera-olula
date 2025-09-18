import { useParams } from "react-router";
import { QBoton } from "../../../../../componentes/atomos/qboton.tsx";
import { Detalle } from "../../../../../componentes/detalle/Detalle.tsx";
import { Tab, Tabs } from "../../../../../componentes/detalle/tabs/Tabs.tsx";
import { EmitirEvento, Entidad } from "../../../../comun/diseño.ts";
import { Maquina, useMaquina } from "../../../../comun/useMaquina.ts";
import { useModelo } from "../../../../comun/useModelo.ts";
import { Pedido } from "../../diseño.ts";
import { pedidoVacio } from "../../dominio.ts";
import { borrarPedido, getPedido, patchPedido } from "../../infraestructura.ts";
import "./DetallePedido.css";
import { Lineas } from "./Lineas/Lineas.tsx";
import { TabCliente } from "./TabCliente/TabCliente.tsx";
// import { TabDatos } from "./TabDatos.tsx";
import { TabObservaciones } from "./TabObservaciones.tsx";

import { useContext, useState } from "react";
import { appFactory } from "../../../../../app.ts";
import { QModalConfirmacion } from "../../../../../componentes/moleculas/qmodalconfirmacion.tsx";
import { ContextoError } from "../../../../comun/contexto.ts";
import { TotalesVenta } from "../../../venta/vistas/TotalesVenta.tsx";
type ParamOpcion = {
  valor: string;
  descripcion?: string;
};
export type ValorControl = null | string | ParamOpcion;
type Estado = "defecto" | "confirmarBorrado";

const TabDatos = appFactory().Ventas.PedidoTabDatos;

export const DetallePedido = ({
  pedidoInicial = null,
  emitir = () => {},
}: {
  pedidoInicial?: Pedido | null;
  emitir?: EmitirEvento;
}) => {
  const [estado, setEstado] = useState<Estado>("defecto");
  const params = useParams();

  const { intentar } = useContext(ContextoError);

  const pedidoId = pedidoInicial?.id ?? params.id;
  const titulo = (pedido: Entidad) => pedido.codigo as string;

  const pedido = useModelo(appFactory().Ventas.metaPedido, pedidoVacio);
  const { modelo, init } = pedido;

  const maquina: Maquina<Estado> = {
    defecto: {
      GUARDAR_INICIADO: async () => {
        await intentar(() => patchPedido(modelo.id, modelo));
        recargarCabecera();
      },
      CLIENTE_PEDIDO_CAMBIADO: async () => {
        await recargarCabecera();
      },
    },
    confirmarBorrado: {},
  };
  const emitirPedido = useMaquina(maquina, "defecto", () => {});

  const recargarCabecera = async () => {
    const nuevoPedido = await getPedido(modelo.id);
    init(nuevoPedido);
    emitir("PEDIDO_CAMBIADO", nuevoPedido);
  };

  const onBorrarConfirmado = async () => {
    await intentar(() => borrarPedido(modelo.id));
    emitir("PEDIDO_BORRADO", modelo);
    setEstado("defecto");
  };

  return (
    <Detalle
      id={pedidoId}
      obtenerTitulo={titulo}
      setEntidad={(p) => init(p)}
      entidad={modelo}
      cargar={getPedido}
      cerrarDetalle={() => emitir("CANCELAR_SELECCION")}
    >
      {!!pedidoId && (
        <>
          <div className="botones maestro-botones ">
            <QBoton onClick={() => setEstado("confirmarBorrado")}>
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
              <QBoton
                onClick={() => emitirPedido("GUARDAR_INICIADO")}
                deshabilitado={!pedido.valido}
              >
                Guardar
              </QBoton>
              <QBoton tipo="reset" variante="texto" onClick={() => init()}>
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
          <Lineas pedido={pedido} onCabeceraModificada={recargarCabecera} />
          <QModalConfirmacion
            nombre="borrarFactura"
            abierto={estado === "confirmarBorrado"}
            titulo="Confirmar borrar"
            mensaje="¿Está seguro de que desea borrar este pedido?"
            onCerrar={() => setEstado("defecto")}
            onAceptar={onBorrarConfirmado}
          />
        </>
      )}
    </Detalle>
  );
};
