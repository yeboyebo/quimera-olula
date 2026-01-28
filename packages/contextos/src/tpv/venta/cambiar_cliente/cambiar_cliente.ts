import { patchVentaClienteNoRegistrado, patchVentaClienteRegistrado } from "#/tpv/venta/infraestructura.ts";
import { ModeloClienteVentaNoRegistrado } from "#/ventas/comun/componentes/moleculas/ClienteVenta/cliente_venta";
import { ModeloClienteFacturaRegistrado } from "#/ventas/factura/cliente_factura/cliente_factura.ts";

export const guardarClienteNoRegistrado = async (id: string, cliente: ModeloClienteVentaNoRegistrado) => {

    await patchVentaClienteNoRegistrado(id, {
        nombre: cliente.nombre,
        idFiscal: cliente.idFiscal,
        direccion: {
            nombreVia: cliente.nombreVia,
            codPostal: cliente.codPostal,
            ciudad: cliente.ciudad ?? '',
            provincia: cliente.provincia ?? '',
            idProvincia: cliente.idProvincia ?? '',
            idPais: cliente.idPais ?? '',

        }
    })
}

export const guardarClienteRegistrado = async (id: string, cliente: ModeloClienteFacturaRegistrado) => {

    await patchVentaClienteRegistrado(id, {
        id: cliente.idCliente,
        // idDireccion: cliente.idDireccion
    })
}