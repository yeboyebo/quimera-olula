import { QModal } from "@quimera/comp/moleculas/qmodal.tsx";
import { useCallback } from "react";
import { appFactory } from "../../../../app.ts";
import { QBoton } from "../../../../componentes/atomos/qboton.tsx";
import { Listado } from "../../../../componentes/maestro/Listado.tsx";
import { MaestroDetalleResponsive } from "../../../../componentes/maestro/MaestroDetalleResponsive.tsx";
import { ListaSeleccionable } from "../../../comun/diseño.ts";
import {
  cambiarItem,
  cargar,
  getSeleccionada,
  incluirItem,
  listaSeleccionableVacia,
  quitarItem,
  quitarSeleccion,
  seleccionarItem,
} from "../../../comun/entidad.ts";
import { pipe } from "../../../comun/funcional.ts";
import {
  ConfigMaquina4,
  Maquina3,
  useMaquina4,
} from "../../../comun/useMaquina.ts";
import { Pedido } from "../diseño.ts";
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
      <MaestroDetalleResponsive<Pedido>
        seleccionada={seleccionada}
        Maestro={
          <>
            <h2>Pedidos</h2>
            <div className="maestro-botones">
              <QBoton onClick={() => emitir("crear")}>Crear Pedido</QBoton>
            </div>
            <Listado
              metaTabla={appFactory().Ventas.metaTablaPedido}
              entidades={pedidos.lista}
              setEntidades={setEntidades}
              seleccionada={seleccionada}
              setSeleccionada={setSeleccionada}
              cargar={getPedidos}
            />
          </>
        }
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
