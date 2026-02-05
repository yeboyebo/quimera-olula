import { Pedido } from "#/ventas/pedido/diseño.ts";
import {
  QBoton,
  QModalConfirmacion,
  QTarjetas,
} from "@olula/componentes/index.ts";
import { ListaSeleccionable, Orden } from "@olula/lib/diseño.js";
import { getSeleccionada } from "@olula/lib/entidad.ts";
import { ProcesarEvento } from "@olula/lib/useMaquina.js";
import { EstadoAlbaranarPedido } from "../../detalle/diseño.ts";
import { puedeAlbaranar } from "../../detalle/dominio.ts";
import { LineaAlbaranarPedido as Linea } from "../../diseño.ts";
import TarjetaLinea from "./TarjetaLinea.tsx";

export const Lineas = ({
  pedido,
  lineas,
  estado,
  publicar,
}: {
  pedido: Pedido;
  lineas: ListaSeleccionable<Linea>;
  estado: EstadoAlbaranarPedido;
  publicar: ProcesarEvento;
}) => {
  const seleccionada = getSeleccionada(lineas);

  const albaranarPedido = () => {
    publicar("albaranado_confirmado");
  };

  const habilitarBoton = puedeAlbaranar({ pedido, lineas });

  return (
    <div className="DetalleAlbaranarPedido">
      <div className="CabeceraPedido">
        <div className="botones maestro-botones ">
          <QBoton
            deshabilitado={!habilitarBoton}
            onClick={() => publicar("albaranado_solicitado")}
          >
            Generar Albaran
          </QBoton>
        </div>
      </div>
      <QTarjetas
        tarjeta={(l: Linea) => <TarjetaLinea linea={l} publicar={publicar} />}
        datos={lineas.lista}
        cargando={estado === "ALBARANANDO"}
        seleccionadaId={seleccionada?.id}
        onSeleccion={(l: Linea) => publicar("linea_seleccionada", l)}
        orden={["id", "ASC"] as Orden}
        onOrdenar={(_: string) => null}
      />
      <QModalConfirmacion
        nombre="albaranarPedido"
        abierto={estado === "CONFIRMANDO_ALBARANADO"}
        titulo="Confirmar"
        mensaje="¿Está seguro de que desea albaranar este pedido?"
        onCerrar={() => publicar("albaranado_cancelado")}
        onAceptar={albaranarPedido}
      />
    </div>
  );
};
