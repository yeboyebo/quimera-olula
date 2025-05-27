import { useState } from "react";
import { QBoton } from "../../../../componentes/atomos/qboton.tsx";
import { Listado } from "../../../../componentes/maestro/Listado.tsx";
import { MaestroDetalleResponsive } from "../../../../componentes/maestro/MaestroDetalleResponsive.tsx";
import { QModal } from "../../../../componentes/moleculas/qmodal.tsx";
import { appFactory } from "../../../app.ts";
import { useLista } from "../../../comun/useLista.ts";
import { Maquina, useMaquina } from "../../../comun/useMaquina.ts";
import { Pedido } from "../diseño.ts";
import { getPedidos } from "../infraestructura.ts";
import { AltaPedido } from "./AltaPedido.tsx";
import { DetallePedido } from "./DetallePedido/DetallePedido.tsx";
import "./MaestroConDetallePedido.css";

type Estado = "lista" | "alta";
export const MaestroConDetallePedido = () => {
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
            <Listado
              metaTabla={appFactory().Ventas.metaTablaPedido}
              entidades={pedidos.lista}
              setEntidades={pedidos.setLista}
              seleccionada={pedidos.seleccionada}
              setSeleccionada={pedidos.seleccionar}
              cargar={getPedidos}
            />
            <div className="maestro-botones">
              <QBoton onClick={emision("ALTA_INICIADA")}>Crear Pedido</QBoton>
            </div>
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
