import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { MetaTabla } from "@olula/componentes/index.ts";
import { Listado } from "@olula/componentes/maestro/Listado.tsx";
import { MaestroDetalleResponsive } from "@olula/componentes/maestro/MaestroDetalleResponsive.tsx";
import { QModal } from "@olula/componentes/moleculas/qmodal.tsx";
import { FactoryCtx } from "@olula/lib/factory_ctx.tsx";
import { useLista } from "@olula/lib/useLista.ts";
import { Maquina, useMaquina } from "@olula/lib/useMaquina.ts";
import { useContext, useState } from "react";
import { Pedido } from "../diseño.ts";
import { getPedidos } from "../infraestructura.ts";
import { AltaPedido } from "./AltaPedido.tsx";
import { DetallePedido } from "./DetallePedido/DetallePedido.tsx";
import "./MaestroConDetallePedido.css";

type Estado = "lista" | "alta";
export const MaestroConDetallePedido = () => {
  const appFactory = useContext(FactoryCtx);
  const [estado, setEstado] = useState<Estado>("lista");
  const pedidos = useLista<Pedido>([]);

  const maquina: Maquina<Estado> = {
    alta: {
      PEDIDO_CREADO: (payload: unknown) => {
        const pedido = payload as Pedido;
        pedidos.añadir(pedido);
        return "lista";
      },
      ALTA_CANCELADA: "lista",
    },
    lista: {
      ALTA_INICIADA: "alta",
      PEDIDO_CAMBIADO: (payload: unknown) => {
        const pedido = payload as Pedido;
        pedidos.modificar(pedido);
      },
      CANCELAR_SELECCION: () => {
        pedidos.limpiarSeleccion();
        return "lista";
      },
    },
  };

  const emitir = useMaquina(maquina, estado, setEstado);
  const emision = (evento: string, payload?: unknown) => () =>
    emitir(evento, payload);

  return (
    <div className="Pedido">
      <MaestroDetalleResponsive
        seleccionada={pedidos.seleccionada}
        Maestro={
          <>
            <h2>Pedidos</h2>
            <div className="maestro-botones">
              <QBoton onClick={emision("ALTA_INICIADA")}>Crear Pedido</QBoton>
            </div>
            <Listado
              metaTabla={
                appFactory.app.Ventas.metaTablaPedido as MetaTabla<Pedido>
              }
              entidades={pedidos.lista}
              setEntidades={pedidos.setLista}
              seleccionada={pedidos.seleccionada}
              setSeleccionada={pedidos.seleccionar}
              cargar={getPedidos}
            />
          </>
        }
        Detalle={
          <DetallePedido pedidoInicial={pedidos.seleccionada} emitir={emitir} />
        }
      />
      <QModal
        nombre="modal"
        abierto={estado === "alta"}
        onCerrar={emision("ALTA_CANCELADA")}
      >
        <AltaPedido publicar={emitir} />
      </QModal>
    </div>
  );
};
