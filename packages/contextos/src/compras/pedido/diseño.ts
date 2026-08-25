import { Criteria, Entidad, Modelo, RespuestaLista } from "@olula/lib/diseño.ts";
import { TipoArticuloLinea } from "../comun/diseño.ts";

/** Estado agregado de recepción, derivado de las líneas en el servidor. */
export type Recibido = 'No' | 'Parcial' | 'Sí';

/**
 * Cabecera del pedido de compra. ItemPedido (el elemento del listado) tiene
 * exactamente los mismos campos, así que no hace falta entidad ligera.
 */
export interface Pedido extends Entidad {
    id: string;
    codigo: string;
    ejercicioId: string;
    serieId: string;
    numero: string;
    fecha: Date;
    fechaEntrada: Date;
    numeroProveedor: string | null;
    proveedorId: string | null;
    nombreProveedor: string;
    idFiscal: string;
    almacenId: string | null;
    nombreAlmacen: string | null;
    formaPagoId: string;
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
    recibido: Recibido | null;
    observaciones: string | null;
}

export interface LineaPedido extends Entidad {
    id: string;
    pedidoId: string;
    /** null cuando la línea no tiene artículo del catálogo. */
    referencia: string | null;
    descripcion: string;
    /** Descripción del catálogo; distinta de `descripcion` en las líneas genéricas. */
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
    cantidadRecibida: number;
    cerrada: boolean;
}

/** Alta con proveedor del maestro: hereda serie, divisa, forma de pago y grupo de IVA. */
export interface NuevoPedido extends Modelo {
    proveedorId: string;
    nombreProveedor: string;
    fecha: Date;
    fechaEntrada: Date | null;
    numeroProveedor: string | null;
    almacenId: string | null;
    observaciones: string | null;
}

/** Alta sin proveedor registrado: no hay maestro del que heredar, todo sale de la empresa. */
export interface NuevoPedidoProveedorNoRegistrado extends Modelo {
    nombre: string;
    idFiscal: string;
    fecha: Date;
    fechaEntrada: Date | null;
    numeroProveedor: string | null;
    almacenId: string | null;
    observaciones: string | null;
}

/** Línea con artículo del catálogo. */
/**
 * Alta de línea. `tipoArticulo` decide qué viaja al servidor: la referencia, la
 * descripción, o las dos. Las líneas libres caen en el grupo de IVA GEN.
 */
export interface NuevaLineaPedido extends Modelo {
    tipoArticulo: TipoArticuloLinea;
    referencia: string | null;
    descripcion: string;
    descripcionArticulo: string | null;
    cantidad: number;
    /** Opcional con artículo del catálogo: el servidor lo saca de articulosprov. */
    pvpUnitario: number | null;
}

/** Línea en edición: la del servidor más el tipo de artículo inferido. */
export interface ModeloLineaPedido extends LineaPedido {
    tipoArticulo: TipoArticuloLinea;
}

export type CambiosPedido = Partial<Pedido>;

export type CambiosLineaPedido = Partial<ModeloLineaPedido>;

export type GetPedido = (id: string) => Promise<Pedido>;
export type GetPedidos = (criteria: Criteria) => RespuestaLista<Pedido>;
export type PostPedido = (
    nuevoPedido: NuevoPedido | NuevoPedidoProveedorNoRegistrado
) => Promise<string>;
export type PatchPedido = (id: string, cambios: CambiosPedido) => Promise<void>;
export type DeletePedido = (id: string) => Promise<void>;
export type GetReportPedido = (id: string) => Promise<Blob>;

export type GetLineasPedido = (id: string) => Promise<LineaPedido[]>;
export type GetLineaPedido = (id: string, lineaId: string) => Promise<LineaPedido>;
export type PostLineasPedido = (
    id: string,
    lineas: NuevaLineaPedido[]
) => Promise<string[]>;
export type PatchLineaPedido = (
    id: string,
    lineaId: string,
    cambios: CambiosLineaPedido
) => Promise<void>;
export type CerrarLineaPedido = (id: string, lineaId: string, cerrada: boolean) => Promise<void>;
/** Borrar líneas es un PATCH con la lista de ids; no hay endpoint para una suelta. */
export type BorrarLineasPedido = (id: string, lineas: string[]) => Promise<void>;
