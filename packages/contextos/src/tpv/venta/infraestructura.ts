import ApiUrls from "#/tpv/comun/urls.ts";
import Ventas_Urls from "#/ventas/comun/urls.ts";
import { Factura } from "#/ventas/factura/diseño.ts";
import { RestAPI } from "@olula/lib/api/rest_api.ts";
import { Filtro, Orden, Paginacion } from "@olula/lib/diseño.ts";
import { criteriaQuery } from "@olula/lib/infraestructura.ts";
import { agenteActivo, puntoVentaLocal } from "../comun/infraestructura.ts";
import { DeleteLinea, DeletePago, GetLineasFactura, GetPagosVentaTpv, GetVentasTpv, GetVentaTpv, GetVentaTpvADevolver, LineaFactura, PagoVentaTpv, PatchArticuloLinea, PatchCantidadLinea, PatchClienteFactura, PatchDevolverVenta, PatchLinea, PostEmitirVale, PostLinea, PostLineaPorBarcode, PostPago, PostVentaTpv, VentaTpv, VentaTpvADevolver } from "./diseño.ts";

const baseUrlFactura = new Ventas_Urls().FACTURA;
const baseUrl = new ApiUrls().VENTA;


type LineaFacturaAPI = LineaFactura;
type PagoVentaTpvAPI = PagoVentaTpv
type VentaTpvAPI = VentaTpv & { fecha: string }

interface VentaTpvADevolverAPI extends VentaTpvAPI {
    lineas: LineaFacturaAPI[];
}

export const ventaDesdeAPI = (v: VentaTpvAPI): VentaTpv => (
    {
        ...v,
        fecha: new Date(Date.parse(v.fecha))
    }
);

export const ventaADevolverDesdeAPI = (venta: VentaTpvADevolverAPI): VentaTpvADevolver => (
    {
        ...venta,
        lineas: venta.lineas.map(l => ({
            ...l,
            aDevolver: 0
        }))
    }
)

export const lineaFacturaFromAPI = (l: LineaFacturaAPI): LineaFactura => l;
export const pagoVentaTpvDesdeAPI = (p: PagoVentaTpvAPI): PagoVentaTpv => p;

export const getVenta: GetVentaTpv = async (id) => {
    return RestAPI.get<{ datos: VentaTpvAPI }>(
        `${baseUrl}/${id}`).then((respuesta) => {
            console.log('ventaDesdeAPI', ventaDesdeAPI(respuesta.datos));
            return ventaDesdeAPI(respuesta.datos);
        });
};

export const getVentaADevolver: GetVentaTpvADevolver = async (codigo) => {
    return RestAPI.get<{ datos: VentaTpvADevolverAPI }>(
        `${baseUrl}/${codigo}/a_devolver`).then((respuesta) => {
            return ventaADevolverDesdeAPI(respuesta.datos);
        });
};

export const getVentas: GetVentasTpv = async (
    filtro: Filtro,
    orden: Orden,
    paginacion: Paginacion
) => {
    const q = criteriaQuery(filtro, orden, paginacion);

    const respuesta = await RestAPI.get<{ datos: VentaTpvAPI[]; total: number }>(baseUrl + q);
    return { datos: respuesta.datos.map(ventaDesdeAPI), total: respuesta.total };
};


export const postVenta: PostVentaTpv = async () => {
    const payload = {
        agente_id: agenteActivo.obtener(),
        punto_venta_id: puntoVentaLocal.obtener(),
    };
    return await RestAPI.post(baseUrl, payload, "Error al crear la venta").then((respuesta) => respuesta.id);
};

export const patchCambiarCliente: PatchClienteFactura = async (id, cambio) => {
    await RestAPI.patch(`${baseUrlFactura}/${id}`, {
        cambios: {
            cliente: {
                cliente_id: cambio.cliente_id,
                direccion_id: cambio.direccion_id
            }
        }
    }, "Error al cambiar cliente de la factura");
};

export const patchDevolverVenta: PatchDevolverVenta = async (id, ventaADevolver) => {
    await RestAPI.patch(`${baseUrlFactura}/${id}/rectificar`, {
        rectificada_id: ventaADevolver.id,
        lineas_rectificadas: ventaADevolver.lineas.filter(
            (l) => l.aDevolver > 0
        ).
            map((l) => ({
                id: l.id,
                cantidad: l.aDevolver * -1
            }))
    }, "Error al devolver la venta");
}

export const postEmitirVale: PostEmitirVale = async (venta) => {
    await RestAPI.post(
        `${baseUrl}/${venta.id}/emitir_vale`,
        {
            punto_venta_id: puntoVentaLocal.obtener(),
        },
        "Error al emitir el vale"
    );
}

export const getLineas: GetLineasFactura = async (id) =>
    await RestAPI.get<{ datos: LineaFacturaAPI[] }>(
        `${baseUrl}/${id}/lineas`).then((respuesta) => {
            const lineas = respuesta.datos.map((d) => lineaFacturaFromAPI(d));
            return lineas;
        });

export const getPagos: GetPagosVentaTpv = async (id) =>
    await RestAPI.get<{ datos: PagoVentaTpvAPI[] }>(
        `${baseUrl}/${id}/pagos`).then((respuesta) => {
            const lineas = respuesta.datos.map((d) => pagoVentaTpvDesdeAPI(d));
            return lineas;
        });

export const postPago: PostPago = async (id, pago) => {
    const body = {
        importe: pago.importe,
        fecha: (new Date().toISOString()).slice(0, 10),
        forma_pago: pago.formaPago,
        vale_id: pago.idVale
    }
    return await RestAPI.post(`${baseUrl}/${id}/pago`,
        body,
        "Error al crear pago de venta").then((respuesta) => {
            const miRespuesta = respuesta as unknown as { id: string };
            return miRespuesta.id;
        });
};

export const postLinea: PostLinea = async (id, linea) => {
    const body = {
        articulo_id: linea.referencia,
        cantidad: linea.cantidad
    }
    return await RestAPI.post(`${baseUrl}/${id}/linea`,
        body,
        "Error al crear linea de venta").then((respuesta) => {
            const miRespuesta = respuesta as unknown as { id: string };
            return miRespuesta.id;
        });
};

export const postLineaPorBarcode: PostLineaPorBarcode = async (id, linea) => {
    const body = {
        barcode: linea.barcode,
        cantidad: linea.cantidad
    }
    return await RestAPI.post(`${baseUrl}/${id}/linea_por_barcode`,
        body,
        "Error al crear linea de venta").then((respuesta) => {
            const miRespuesta = respuesta as unknown as { id: string };
            return miRespuesta.id;
        });
};

export const patchArticuloLinea: PatchArticuloLinea = async (id, lineaId, referencia) => {
    const payload = {
        cambios: {
            articulo: {
                articulo_id: referencia
            },
        },
    };
    await RestAPI.patch(`${baseUrlFactura}/${id}/linea/${lineaId}`, payload, "Error al actualizar artículo de la línea de factura");
};

export const patchLinea: PatchLinea = async (id, linea) => {
    const payload = {
        cambios: {
            articulo: {
                articulo_id: linea.referencia
            },
            cantidad: linea.cantidad,
            pvp_unitario: linea.pvp_unitario,
            dto_porcentual: linea.dto_porcentual,
            grupo_iva_producto_id: linea.grupo_iva_producto_id,
        },
    };
    await RestAPI.patch(`${baseUrlFactura}/${id}/linea/${linea.id}`, payload, "Error al actualizar línea de factura");
};

export const patchCantidadLinea: PatchCantidadLinea = async (id, linea, cantidad) => {
    const payload = {
        cambios: {
            articulo: {
                articulo_id: linea.referencia
            },
            cantidad: cantidad,
        },
    };
    await RestAPI.patch(`${baseUrlFactura}/${id}/linea/${linea.id}`, payload, "Error al actualizar cantidad de la línea de factura");
};

export const deleteLinea: DeleteLinea = async (id, lineaId): Promise<void> => {
    await RestAPI.patch(`${baseUrlFactura}/${id}/linea/borrar`, {
        lineas: [lineaId]
    }, "Error al borrar línea de venta");
};

export const deletePago: DeletePago = async (id, idPago): Promise<void> => {
    await RestAPI.delete(`${baseUrl}/${id}/pago/${idPago}`, "Error al borrar pago de factura");
};

export const patchFactura = async (id: string, factura: Factura) => {
    const payload = {
        cambios: {
            agente_id: factura.agente_id,
            divisa: {
                divisa_id: factura.divisa_id,
                tasa_conversion: factura.tasa_conversion,
            },
            fecha: factura.fecha,
            cliente_id: factura.cliente_id,
            nombre_cliente: factura.nombre_cliente,
            id_fiscal: factura.id_fiscal,
            direccion_id: factura.direccion_id,
            forma_pago_id: factura.forma_pago_id,
            grupo_iva_negocio_id: factura.grupo_iva_negocio_id,
            observaciones: factura.observaciones,
        },
    };

    await RestAPI.patch(`${baseUrlFactura}/${id}`, payload,
        'Error al guardar el factura'
    );
};

export const borrarFactura = async (id: string) => {
    await RestAPI.delete(`${baseUrlFactura}/${id}`, "Error al borrar factura");
}
