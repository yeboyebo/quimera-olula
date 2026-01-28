import { Factura } from "#/ventas/factura/diseño.ts";
import { MetaTabla } from "@olula/componentes/index.js";

import { Criteria, ProcesarContexto } from "@olula/lib/diseño.js";
import { ProcesarListaEntidades, accionesListaEntidades } from "@olula/lib/ListaEntidades.js";
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

const conVentas = (fn: ProcesarListaEntidades<VentaTpv>) => (ctx: ContextoMaestroVentasTpv) => ({ ...ctx, ventas: fn(ctx.ventas) });

export const Ventas = accionesListaEntidades(conVentas);

export const recargarVentas: ProcesarVentasTpv = async (contexto, payload) => {

    const criteria = payload as Criteria;
    const resultado = await getVentas(criteria.filtro, criteria.orden, criteria.paginacion);
    const ventasCargadas = resultado.datos

    return {
        ...contexto,
        ventas: {
            lista: ventasCargadas,
            total: resultado.total == -1 ? contexto.ventas.total : resultado.total,
            activo: contexto.ventas.activo
                ? ventasCargadas.find(v => v.id === contexto.ventas.activo?.id) ?? null
                : null
        }
    }
}

export const crearVenta: ProcesarVentasTpv = async (contexto) => {

    const idVenta = await postVenta();
    const venta = await getVenta(idVenta);
    return {
        ...contexto,
        ventas: {
            lista: [venta, ...contexto.ventas.lista],
            activo: venta,
            total: contexto.ventas.total + 1,
        }
    }
}

