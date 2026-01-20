import { Factura } from "#/ventas/factura/diseño.ts";
import { MetaTabla } from "@olula/componentes/index.js";

import { Criteria, ProcesarContexto } from "@olula/lib/diseño.js";
import { ContextoMaestroVentasTpv, EstadoMaestroVentasTpv, VentaTpv } from "../diseño.ts";
import { getVenta, getVentas, postVenta } from "../infraestructura.ts";


export const metaTablaFactura: MetaTabla<Factura> = [
    {
        id: "codigo",
        cabecera: "Código",
    },
    {
        id: "fecha",
        cabecera: "Fecha",
        tipo: "fecha",
    },
    {
        id: "nombre_cliente",
        cabecera: "Cliente",
    },
    {
        id: "total",
        cabecera: "Total",
        tipo: "moneda",
    },
];

type ProcesarVentasTpv = ProcesarContexto<EstadoMaestroVentasTpv, ContextoMaestroVentasTpv>;

export const cambiarVentaEnLista: ProcesarVentasTpv = async (contexto, payload) => {

    const venta = payload as VentaTpv;
    return {
        ...contexto,
        ventas: contexto.ventas.map(v => v.id === venta.id ? venta : v)
    }
}

export const activarVenta: ProcesarVentasTpv = async (contexto, payload) => {

    const ventaActiva = payload as VentaTpv;
    return {
        ...contexto,
        ventaActiva
    }
}

export const desactivarVentaActiva: ProcesarVentasTpv = async (contexto) => {

    return {
        ...contexto,
        ventaActiva: null
    }
}

export const quitarVentaDeLista: ProcesarVentasTpv = async (contexto, payload) => {

    const ventaBorrada = payload as VentaTpv;
    return {
        ...contexto,
        ventas: contexto.ventas.filter(v => v.id !== ventaBorrada.id),
        ventaActiva: null
    }
}

export const recargarVentas: ProcesarVentasTpv = async (contexto, payload) => {

    const criteria = payload as Criteria;
    const resultado = await getVentas(criteria.filtro, criteria.orden, criteria.paginacion);
    const ventasCargadas = resultado.datos

    return {
        ...contexto,
        ventas: ventasCargadas,
        totalVentas: resultado.total == -1 ? contexto.totalVentas : resultado.total,
        ventaActiva: contexto.ventaActiva
            ? ventasCargadas.find(v => v.id === contexto.ventaActiva?.id) ?? null
            : null
    }
}

export const incluirVentaEnLista: ProcesarVentasTpv = async (contexto, payload) => {

    const venta = payload as VentaTpv;
    return {
        ...contexto,
        ventas: [venta, ...contexto.ventas]
    }
}

export const crearVenta: ProcesarVentasTpv = async (contexto) => {

    const idVenta = await postVenta();
    const venta = await getVenta(idVenta);
    return {
        ...contexto,
        ventas: [venta, ...contexto.ventas],
        ventaActiva: venta
    }
}

