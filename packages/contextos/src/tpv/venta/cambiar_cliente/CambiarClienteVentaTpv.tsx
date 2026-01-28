import { VentaTpv } from "#/tpv/venta/diseño.ts";
import { ModeloClienteVentaNoRegistrado } from "#/ventas/comun/componentes/moleculas/ClienteVenta/cliente_venta.ts";
import { ClienteFactura } from "#/ventas/factura/cliente_factura/ClienteFactura.tsx";
import { ModeloClienteFacturaRegistrado } from "#/ventas/factura/cliente_factura/cliente_factura.ts";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import "./CambiarClienteVentaTpv.css";
import { guardarClienteNoRegistrado, guardarClienteRegistrado } from "./cambiar_cliente.ts";

export const CambiarCliente = ({
    publicar = async() => {},
    venta,
}: {
    venta: VentaTpv;
    publicar?: EmitirEvento;
}) => {

    const cancelar = () => {
        publicar("cambio_cliente_cancelado");
    };

    const guardar = async(cliente: ModeloClienteVentaNoRegistrado | ModeloClienteFacturaRegistrado) => {

        if ('idCliente' in cliente) {
            const registrado = cliente as ModeloClienteFacturaRegistrado
            await guardarClienteRegistrado(venta.id, registrado);
            publicar("cliente_cambiado", registrado);

        } else {
            const noRegistrado = cliente as ModeloClienteVentaNoRegistrado
            await guardarClienteNoRegistrado(venta.id, noRegistrado);
            publicar("cliente_cambiado", noRegistrado);
        }
    }

    return (
        <ClienteFactura
            venta={venta}
            guardar={guardar}
            cancelar={cancelar}
        />
    );
}

