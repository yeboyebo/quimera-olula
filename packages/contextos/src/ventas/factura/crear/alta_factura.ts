import { clienteVentaNoRegistradoVacio, metaModeloClienteVentaNoRegistrado, metaModeloClienteVentaRegistrado, ModeloClienteVentaNoRegistrado } from "#/ventas/comun/componentes/moleculas/ClienteVenta/cliente_venta.ts";
import { MetaModelo } from "@olula/lib/dominio.ts";
import { clienteFacturaRegistradoVacio, ModeloClienteFacturaRegistrado } from "../cliente_factura/cliente_factura.ts";
import { postFactura } from "../infraestructura.ts";

export interface ModeloAltaFacturaRegistrada extends ModeloClienteFacturaRegistrado {
    idEmpresa: string;
};

export interface ModeloAltaFacturaNoRegistrada extends ModeloClienteVentaNoRegistrado {
    idEmpresa: string;
}

export const metaModeloAltaFacturaRegistrada: MetaModelo<ModeloAltaFacturaRegistrada> = {
    campos: {
        ...metaModeloClienteVentaRegistrado.campos,
        idEmpresa: { requerido: true },
    }
};

export const metaModeloAltaFacturaNoRegistrada: MetaModelo<ModeloAltaFacturaNoRegistrada> = {
    campos: {
        ...metaModeloClienteVentaNoRegistrado.campos,
        idEmpresa: { requerido: true },
    }
};

export const altaFacturaRegistradaVacia: ModeloAltaFacturaRegistrada = {
    ...clienteFacturaRegistradoVacio,
    idEmpresa: "1",
}

export const altaFacturaNoRegistradaVacia: ModeloAltaFacturaNoRegistrada = {
    ...clienteVentaNoRegistradoVacio,
    idEmpresa: "1",
}


export const crearFacturaRegistrada = async (alta: ModeloAltaFacturaRegistrada) => {
    await postFactura({
        cliente_id: alta.idCliente,
        empresa_id: alta.idEmpresa
    });

}

