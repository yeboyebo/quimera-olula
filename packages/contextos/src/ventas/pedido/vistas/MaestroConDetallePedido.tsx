import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { MaestroDetalle } from "@olula/componentes/maestro/MaestroDetalle.js";
import { QModal } from "@olula/componentes/moleculas/qmodal.tsx";
import { ListaSeleccionable } from "@olula/lib/diseño.js";
import {
  cambiarItem,
  cargar,
  getSeleccionada,
  incluirItem,
  listaSeleccionableVacia,
  quitarItem,
  quitarSeleccion,
  seleccionarItem,
} from "@olula/lib/entidad.js";
// import { FactoryCtx } from "@olula/lib/factory_ctx.js";
import { pipe } from "@olula/lib/funcional.js";
import {
  ConfigMaquina4,
  Maquina3,
  useMaquina4,
} from "@olula/lib/useMaquina.ts";
import { useCallback } from "react";
import { Pedido } from "../diseño.ts";
import { metaTablaPedido } from "../dominio.ts";
import { getPedidos } from "../infraestructura.ts";
import { AltaPedido } from "./AltaPedido.tsx";
import { DetallePedido } from "./DetallePedido/DetallePedido.tsx";
import "./MaestroConDetallePedido.css";

type Estado = "Inactivo" | "Creando";
type Contexto = {
  pedidos: ListaSeleccionable<Pedido>;
};

const setPedidos =
  (
    aplicable: (
      pedidos: ListaSeleccionable<Pedido>
    ) => ListaSeleccionable<Pedido>
  ) =>
  (maquina: Maquina3<Estado, Contexto>) => {
    return {
      ...maquina,
      contexto: {
        ...maquina.contexto,
        pedidos: aplicable(maquina.contexto.pedidos),
      },
    };
  };

const configMaquina: ConfigMaquina4<Estado, Contexto> = {
  inicial: {
    estado: "Inactivo",
    contexto: {
      pedidos: listaSeleccionableVacia<Pedido>(),
    },
  },
  estados: {
    Inactivo: {
      crear: "Creando",
      pedido_cambiado: ({ maquina, payload }) =>
        pipe(maquina, setPedidos(cambiarItem(payload as Pedido))),
      pedido_seleccionado: ({ maquina, payload }) =>
        pipe(maquina, setPedidos(seleccionarItem(payload as Pedido))),
      cancelar_seleccion: ({ maquina }) =>
        pipe(maquina, setPedidos(quitarSeleccion())),
      pedido_borrado: ({ maquina }) => {
        const { pedidos } = maquina.contexto;
        if (!pedidos.idActivo) {
          return maquina;
        }
        return pipe(maquina, setPedidos(quitarItem(pedidos.idActivo)));
      },
      pedidos_cargados: ({ maquina, payload, setEstado }) =>
        pipe(
          maquina,
          setEstado("Inactivo" as Estado),
          setPedidos(cargar(payload as Pedido[]))
        ),
    },
    Creando: {
      pedido_creado: ({ maquina, payload, setEstado }) =>
        pipe(
          maquina,
          setEstado("Inactivo" as Estado),
          setPedidos(incluirItem(payload as Pedido, {}))
        ),
      alta_cancelada: "Inactivo",
    },
  },
};

export const MaestroConDetallePedido = () => {
  // const appFactory = useContext(FactoryCtx);

  const [emitir, { estado, contexto }] = useMaquina4<Estado, Contexto>({
    config: configMaquina,
  });
  const { pedidos } = contexto;

  const setEntidades = useCallback(
    (payload: Pedido[]) => emitir("pedidos_cargados", payload),
    [emitir]
  );
  const setSeleccionada = useCallback(
    (payload: Pedido) => emitir("pedido_seleccionado", payload),
    [emitir]
  );

  const seleccionada = getSeleccionada(pedidos);

  return (
    <div className="Pedido">
      <MaestroDetalle<Pedido>
        seleccionada={seleccionada}
        preMaestro={
          <>
            <h2>Pedido</h2>
            <div className="maestro-botones">
              <QBoton onClick={() => emitir("crear")}>Nueva</QBoton>
            </div>
          </>
        }
        modoVisualizacion="tabla"
        modoDisposicion="maestro-50"
        // metaTabla={appFactory.app.Ventas.metaTablaPedido as MetaTabla<Pedido>}
        metaTabla={metaTablaPedido}
        entidades={pedidos.lista}
        setEntidades={setEntidades}
        setSeleccionada={setSeleccionada}
        cargar={getPedidos}
        Detalle={<DetallePedido pedidoInicial={seleccionada} emitir={emitir} />}
      />
      <QModal
        nombre="modal"
        abierto={estado === "Creando"}
        onCerrar={() => emitir("alta_cancelada")}
      >
        <AltaPedido publicar={emitir} />
      </QModal>
    </div>
  );
};
