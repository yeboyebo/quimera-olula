import { Criteria, Entidad, Modelo, RespuestaLista } from "@olula/lib/diseño.ts";
import { TipoArticuloLinea } from "../comun/diseño.ts";

/**
 * Cabecera de la factura de compra. La emite el proveedor: aquí solo se
 * registra, así que no hay firma fiscal ni estado de expedición.
 *
 * Frente al albarán: aquí hay rectificativaId, codigoRectificativa, deAbono,
 * automatica, editable, servicios, noGenerarAsiento y asientoId, y no hay
 * facturaId ni pendienteFactura — eso es del albarán, que apunta hacia aquí.
 */
export interface Factura extends Entidad {
    id: string;
    codigo: string;
    ejercicioId: string;
    serieId: string;
    /** Correlativo interno que asigna el servidor. */
    numero: string;
    fecha: Date;
    hora: string;
    /** El número que el proveedor puso en su factura. */
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
    rectificativaId: string | null;
    codigoRectificativa: string | null;
    deAbono: boolean;
    /** true si nació de albaranes. */
    automatica: boolean;
    /** false la bloquea. */
    editable: boolean;
    servicios: boolean;
    noGenerarAsiento: boolean;
    asientoId: string | null;
    observaciones: string | null;
}

export interface LineaFactura extends Entidad {
    id: string;
    facturaId: string;
    /** null si la línea no viene de un albarán. */
    albaranId: string | null;
    /** Código de ese albarán, resuelto por JOIN. */
    codigoAlbaran: string | null;
    /** null en línea libre, sin artículo del catálogo. */
    referencia: string | null;
    descripcion: string;
    /** La del catálogo, para comparar con la de la línea. */
    descripcionArticulo: string | null;
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

export interface NuevaFactura extends Modelo {
    proveedorId: string;
    nombreProveedor: string;
    fecha: Date;
    numeroProveedor: string | null;
    almacenId: string | null;
    observaciones: string | null;
    deAbono: boolean;
}

/** Sin proveedor del maestro no hay nada que heredar: todo sale de la empresa. */
export interface NuevaFacturaProveedorNoRegistrado extends Modelo {
    nombre: string;
    idFiscal: string;
    fecha: Date;
    numeroProveedor: string | null;
    almacenId: string | null;
    observaciones: string | null;
    deAbono: boolean;
}

/**
 * Alta de línea. `tipoArticulo` decide qué viaja al servidor: la referencia, la
 * descripción, o las dos. Las líneas libres caen en el grupo de IVA GEN.
 */
export interface NuevaLineaFactura extends Modelo {
    tipoArticulo: TipoArticuloLinea;
    referencia: string | null;
    descripcion: string;
    descripcionArticulo: string | null;
    cantidad: number;
    /** Opcional con artículo del catálogo: el servidor lo saca de articulosprov. */
    pvpUnitario: number | null;
}

/** Línea en edición: la del servidor más el tipo de artículo inferido. */
export interface ModeloLineaFactura extends LineaFactura {
    tipoArticulo: TipoArticuloLinea;
}

export type CambiosFactura = Partial<Factura>;

export type CambiosLineaFactura = Partial<ModeloLineaFactura>;

export type GetFactura = (id: string) => Promise<Factura>;
export type GetFacturas = (criteria: Criteria) => RespuestaLista<Factura>;
export type PostFactura = (
    nuevaFactura: NuevaFactura | NuevaFacturaProveedorNoRegistrado
) => Promise<string>;
/** Genera una sola factura a partir de uno o varios albaranes homogéneos. */
export type FacturarAlbaranes = (albaranIds: string[]) => Promise<{ id: string; codigo: string }>;
export type PatchFactura = (id: string, cambios: CambiosFactura) => Promise<void>;
/** Con null quita la rectificación. */
export type PatchRectificativa = (id: string, rectificativaId: string | null) => Promise<void>;
export type DeleteFactura = (id: string) => Promise<void>;
export type GetReportFactura = (id: string) => Promise<Blob>;

export type GetLineasFactura = (id: string) => Promise<LineaFactura[]>;
export type GetLineaFactura = (id: string, lineaId: string) => Promise<LineaFactura>;
export type PostLineasFactura = (
    id: string,
    lineas: NuevaLineaFactura[]
) => Promise<string[]>;
export type PatchLineaFactura = (
    id: string,
    lineaId: string,
    cambios: CambiosLineaFactura
) => Promise<void>;
/** Borrar líneas es un PATCH con la lista de ids; no hay endpoint para una suelta. */
export type BorrarLineasFactura = (id: string, lineas: string[]) => Promise<void>;
