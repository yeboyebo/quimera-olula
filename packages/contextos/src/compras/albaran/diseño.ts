import { Criteria, Entidad, Modelo, RespuestaLista } from "@olula/lib/diseño.ts";

/**
 * Cabecera del albarán de compra. ItemAlbaran (el elemento del listado) tiene
 * exactamente los mismos campos.
 *
 * Frente al pedido: aquí hay hora, facturaId y pendienteFactura, y no hay
 * fechaEntrada ni recibido.
 */
export interface Albaran extends Entidad {
    id: string;
    codigo: string;
    ejercicioId: string;
    serieId: string;
    numero: string;
    fecha: Date;
    hora: string;
    numeroProveedor: string | null;
    proveedorId: string | null;
    nombreProveedor: string;
    idFiscal: string;
    almacenId: string | null;
    nombreAlmacen: string | null;
    formaPagoId: string | null;
    nombreFormaPago: string | null;
    grupoIvaNegocioId: string;
    divisaId: string;
    tasaConversion: number;
    neto: number;
    totalIva: number;
    totalRecargo: number;
    totalIrpf: number;
    total: number;
    totalDivisaEmpresa: number;
    recargoFinanciero: number;
    facturaId: string | null;
    pendienteFactura: boolean;
    observaciones: string | null;
}

/**
 * La línea de albarán no tiene cantidadRecibida ni cerrada: eso es del pedido.
 * Aquí cantidad ya es lo recibido en este albarán.
 */
export interface LineaAlbaran extends Entidad {
    id: string;
    albaranId: string;
    /** null si la línea no viene de un pedido. */
    pedidoId: string | null;
    lineaPedidoId: string | null;
    /** null en línea libre, sin artículo del catálogo. */
    referencia: string | null;
    descripcion: string;
    cantidad: number;
    /** Coste unitario. */
    pvpUnitario: number;
    dtoPorcentual: number;
    dtoLineal: number;
    pvpSinDto: number;
    pvpTotal: number;
    grupoIvaProductoId: string;
    tipoIva: number;
    tipoRecargo: number;
    tipoIrpf: number;
}

export interface NuevoAlbaran extends Modelo {
    proveedorId: string;
    nombreProveedor: string;
    fecha: Date;
    numeroProveedor: string | null;
    almacenId: string | null;
    observaciones: string | null;
}

/** Sin proveedor del maestro no hay nada que heredar: todo sale de la empresa. */
export interface NuevoAlbaranProveedorNoRegistrado extends Modelo {
    nombre: string;
    idFiscal: string;
    fecha: Date;
    numeroProveedor: string | null;
    almacenId: string | null;
    observaciones: string | null;
}

export interface NuevaLineaAlbaran extends Modelo {
    referencia: string;
    descripcion: string;
    cantidad: number;
    pvpUnitario: number;
}

export interface NuevaLineaLibreAlbaran extends Modelo {
    descripcion: string;
    cantidad: number;
    pvpUnitario: number;
}

/** Cantidad concreta a recibir de una línea de pedido. */
export type LineaAAlbaranar = {
    lineaPedidoId: string;
    cantidad: number;
};

export type CambiosAlbaran = Partial<Albaran>;

export type CambiosLineaAlbaran = Partial<LineaAlbaran>;

export type GetAlbaran = (id: string) => Promise<Albaran>;
export type GetAlbaranes = (criteria: Criteria) => RespuestaLista<Albaran>;
export type PostAlbaran = (
    nuevoAlbaran: NuevoAlbaran | NuevoAlbaranProveedorNoRegistrado
) => Promise<string>;
/** Genera un solo albarán a partir de uno o varios pedidos homogéneos. */
export type AlbaranarPedidos = (
    pedidoIds: string[],
    lineas?: LineaAAlbaranar[]
) => Promise<string>;
export type PatchAlbaran = (id: string, cambios: CambiosAlbaran) => Promise<void>;
export type DeleteAlbaran = (id: string) => Promise<void>;

export type GetLineasAlbaran = (id: string) => Promise<LineaAlbaran[]>;
export type GetLineaAlbaran = (id: string, lineaId: string) => Promise<LineaAlbaran>;
export type PostLineasAlbaran = (
    id: string,
    lineas: (NuevaLineaAlbaran | NuevaLineaLibreAlbaran)[]
) => Promise<string[]>;
export type PatchLineaAlbaran = (
    id: string,
    lineaId: string,
    cambios: CambiosLineaAlbaran
) => Promise<void>;
/** Borrar líneas es un PATCH con la lista de ids; no hay endpoint para una suelta. */
export type BorrarLineasAlbaran = (id: string, lineas: string[]) => Promise<void>;
