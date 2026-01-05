import { Pedido } from "#/ventas/pedido/diseño.ts";
import {
  QBoton,
  QModalConfirmacion,
  QTarjetas,
} from "@olula/componentes/index.ts";
import { ContextoError } from "@olula/lib/contexto.ts";
import { ListaSeleccionable, Orden } from "@olula/lib/diseño.js";
import {
  cambiarItem,
  cargar,
  getSeleccionada,
  listaSeleccionableVacia,
  seleccionarItem,
} from "@olula/lib/entidad.ts";
import { pipe } from "@olula/lib/funcional.js";
import {
  ConfigMaquina4,
  Maquina3,
  useMaquina4,
} from "@olula/lib/useMaquina.ts";
import { useContext, useEffect } from "react";
import { getLineas } from "../../../pedido/infraestructura.ts";
import { LineaAlbaranarPedido as Linea, Tramo } from "../..//diseño.ts";
import { patchAlbaranarPedido } from "../../infraestructura.ts";
import TarjetaLinea from "./TarjetaLinea.tsx";

type Estado = "Inactivo" | "ConfirmarAlbaranado";
type Contexto = {
  lineas: ListaSeleccionable<Linea>;
};

const setLineas =
  (
    aplicable: (lineas: ListaSeleccionable<Linea>) => ListaSeleccionable<Linea>
  ) =>
  (maquina: Maquina3<Estado, Contexto>) => ({
    ...maquina,
    contexto: {
      ...maquina.contexto,
      lineas: aplicable(maquina.contexto.lineas),
    },
  });

const configMaquina: ConfigMaquina4<Estado, Contexto> = {
  inicial: {
    estado: "Inactivo",
    contexto: {
      lineas: listaSeleccionableVacia<Linea>(),
    },
  },
  estados: {
    Inactivo: {
      albaranado_solicitado: "ConfirmarAlbaranado",
      linea_seleccionada: ({ maquina, payload }) =>
        pipe(maquina, setLineas(seleccionarItem(payload as Linea))),
      linea_cambiada: ({ maquina, payload }) =>
        pipe(maquina, setLineas(cambiarItem(payload as Linea))),
      tramos_actualizados: ({ maquina, payload }) => {
        const { id, tramos } = payload as { id: string; tramos: Tramo[] };
        return pipe(
          maquina,
          setLineas((lineas) => ({
            ...lineas,
            lista: lineas.lista.map((l) => {
              if (l.id !== id) return l;
              const a_enviar = (tramos || []).reduce(
                (acc, t) => acc + (Number(t.cantidad) || 0),
                0
              );
              // const a_enviar = Math.max(0, (l.cantidad || 0) - servida);
              return {
                ...l,
                tramos,
                a_enviar,
              } as Linea;
            }),
          }))
        );
      },
      lineas_cargadas: ({ maquina, payload, setEstado }) =>
        pipe(
          maquina,
          setEstado("Inactivo" as Estado),
          setLineas(cargar(payload as Linea[]))
        ),
      seleccion_cancelada: ({ maquina }) =>
        pipe(
          maquina,
          setLineas((lineas) => ({
            ...lineas,
            idActivo: null,
          }))
        ),
    },
    ConfirmarAlbaranado: {
      albaranado_cancelado: "Inactivo",
    },
  },
};

export const Lineas = ({ pedidoId }: { pedido: Pedido; pedidoId: string }) => {
  const { intentar } = useContext(ContextoError);

  const [emitir, { contexto, estado }] = useMaquina4<Estado, Contexto>({
    config: configMaquina,
  });

  const { lineas } = contexto;

  useEffect(() => {
    const cargarLineas = async () => {
      const nuevasLineas = await intentar(() => getLineas(pedidoId));
      emitir("lineas_cargadas", nuevasLineas);
    };

    emitir("cargar");
    cargarLineas();
  }, [pedidoId, emitir, intentar]);

  const seleccionada = getSeleccionada(lineas);

  const albaranarPedido = () => {
    console.log("Albaranar pedido", lineas.lista);
    intentar(() => patchAlbaranarPedido(pedidoId, lineas.lista));
    emitir("albaranado_cancelado");
  };

  return (
    <div className="DetalleAlbaranarPedido">
      <div className="CabeceraPedido">
        {/* <div>{pedido.nombre_cliente}</div> */}
        <div className="botones maestro-botones ">
          <QBoton onClick={() => emitir("albaranado_solicitado")}>
            Generar Albaran
          </QBoton>
        </div>
      </div>
      <QTarjetas
        tarjeta={(l: Linea) => <TarjetaLinea linea={l} publicar={emitir} />}
        datos={lineas.lista}
        cargando={false}
        seleccionadaId={seleccionada?.id}
        onSeleccion={(l: Linea) => emitir("linea_seleccionada", l)}
        orden={["id", "ASC"] as Orden}
        onOrdenar={(_: string) => null}
      />
      <QModalConfirmacion
        nombre="albaranarPedido"
        abierto={estado === "ConfirmarAlbaranado"}
        titulo="Confirmar"
        mensaje="¿Está seguro de que desea albaranar este pedido?"
        onCerrar={() => emitir("albaranado_cancelado")}
        onAceptar={albaranarPedido}
      />
    </div>
  );
};
