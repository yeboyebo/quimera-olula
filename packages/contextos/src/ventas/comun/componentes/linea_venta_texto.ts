import { formatearMoneda } from "@olula/lib/dominio.ts";

export type LineaVentaTarjeta = {
    referencia?: string | null;
    descripcion?: string | null;
    cantidad: number;
    pvp_unitario: number;
    pvp_total: number;
    dto_porcentual?: number | null;
    dto_lineal?: number | null;
    grupo_iva_producto_id?: string | null;
    tipo_irpf?: number | null;
    tipo_recargo?: number | null;
    por_comision?: number | null;
    importe_comision?: number | null;
};

export const tituloLineaVenta = (linea: LineaVentaTarjeta): string =>
    `${linea.referencia ? `${linea.referencia} - ` : ""}${linea.descripcion || "Sin descripción"}`;

export const desgloseLineaVenta = (linea: LineaVentaTarjeta, divisa = "EUR"): string => {
    const cantidad = Number(linea.cantidad) || 0;

    const partesDto: string[] = [];
    if (linea.dto_porcentual) partesDto.push(`${linea.dto_porcentual}% Dto`);
    if (linea.dto_lineal) partesDto.push(`${formatearMoneda(linea.dto_lineal, divisa)} Dto`);

    const dtoTexto = partesDto.length ? ` (${partesDto.join(", ")})` : "";

    return `${cantidad} x ${formatearMoneda(linea.pvp_unitario, divisa)}${dtoTexto}`;
};

/**
 * Línea vista como artículo seleccionable:
 * "REF - Descripción · 3 x 1,50 € (5% Dto) = 4,28 €".
 * El total sale de pvp_total, que ya lleva los descuentos aplicados.
 */
export const articuloDeLineaVenta = (linea: LineaVentaTarjeta, divisa = "EUR"): string =>
    `${tituloLineaVenta(linea)} · ${desgloseLineaVenta(linea, divisa)} = ${formatearMoneda(linea.pvp_total, divisa)}`;

export const fiscalidadLineaVenta = (linea: LineaVentaTarjeta, divisa = "EUR"): string => {
    const partes: string[] = [];

    if (linea.grupo_iva_producto_id) partes.push(`IVA ${linea.grupo_iva_producto_id}`);
    if (linea.tipo_recargo) partes.push(`R.E. ${linea.tipo_recargo}%`);
    if (linea.tipo_irpf) partes.push(`IRPF ${linea.tipo_irpf}%`);
    if (linea.por_comision)
        partes.push(
            `Com. ${linea.por_comision}%${linea.importe_comision
                ? ` (${formatearMoneda(linea.importe_comision, divisa)})`
                : ""
            }`
        );

    return partes.join(" · ");
};
