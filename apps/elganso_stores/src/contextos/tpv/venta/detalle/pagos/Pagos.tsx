import { PagoVentaTpv } from "../../diseño.ts";
import { EmitirEvento } from "@olula/lib/diseño.js";
import { PagosLista } from "./PagosLista.tsx";

export const Pagos = ({
  pagos,
  pagoActivo,
  ventaAbierta,
  publicar = async () => {},
}: {
  pagos: PagoVentaTpv[];
  pagoActivo: PagoVentaTpv | null;
  ventaAbierta: boolean;
  publicar?: EmitirEvento;
}) => {
  // Una vez pagada la venta no se puede borrar ningún pago (el pedido se
  // queda tal cual) — sin esto el botón dispara borrar_pago_solicitado,
  // que la máquina de estados no maneja en SERVIDO.
  const acciones = ventaAbierta && pagoActivo?.arqueoAbierto
    ? [
        {
          icono: "eliminar",
          texto: "Borrar",
          advertencia: true,
          onClick: () => publicar("borrar_pago_solicitado"),
        },
      ]
    : [];

  return (
    <PagosLista
      pagos={pagos}
      pagoActivo={pagoActivo}
      acciones={acciones}
      publicar={publicar}
    />
  );
};
