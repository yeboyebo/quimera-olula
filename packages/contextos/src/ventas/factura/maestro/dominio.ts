import { Criteria, ProcesarContexto } from "@olula/lib/diseño.js";
import { Factura } from "../diseño.ts";
import { getFacturas } from "../infraestructura.ts";
import { ContextoMaestroFactura, EstadoMaestroFactura } from "./diseño.ts";

type ProcesarFacturas = ProcesarContexto<EstadoMaestroFactura, ContextoMaestroFactura>;

export const cambiarFacturaEnLista: ProcesarFacturas = async (contexto, payload) => {
    const factura = payload as Factura;
    return {
        ...contexto,
        facturas: contexto.facturas.map((f) =>
            f.id === factura.id ? factura : f
        ),
    };
};

export const activarFactura: ProcesarFacturas = async (contexto, payload) => {
    const facturaActiva = payload as Factura;
    return {
        ...contexto,
        facturaActiva,
    };
};

export const desactivarFacturaActiva: ProcesarFacturas = async (contexto) => {
    return {
        ...contexto,
        facturaActiva: null,
    };
};

export const quitarFacturaDeLista: ProcesarFacturas = async (
    contexto,
    payload
) => {
    const facturaBorrada = payload as Factura;
    return {
        ...contexto,
        facturas: contexto.facturas.filter((f) => f.id !== facturaBorrada.id),
        facturaActiva: null,
    };
};

export const recargarFacturas: ProcesarFacturas = async (
    contexto,
    payload
) => {
    const criteria = payload as Criteria;
    const resultado = await getFacturas(
        criteria.filtro,
        criteria.orden,
        criteria.paginacion
    );
    const facturasCargadas = resultado.datos;

    return {
        ...contexto,
        facturas: facturasCargadas,
        totalFacturas:
            resultado.total == -1 ? contexto.totalFacturas : resultado.total,
        facturaActiva: contexto.facturaActiva
            ? facturasCargadas.find((f) => f.id === contexto.facturaActiva?.id) ??
            null
            : null,
    };
};

export const incluirFacturaEnLista: ProcesarFacturas = async (
    contexto,
    payload
) => {
    const factura = payload as Factura;
    return {
        ...contexto,
        facturas: [factura, ...contexto.facturas],
        estado: "INICIAL",
    };
};
