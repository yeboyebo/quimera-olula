import { Criteria, Entidad, Modelo, RespuestaLista } from "@olula/lib/diseño.ts";

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
export interface NuevaLineaPedido extends Modelo {
    referencia: string;
    descripcion: string;
    cantidad: number;
    pvpUnitario: number;
}

/** Línea libre, sin artículo. El grupo de IVA de producto cae en GEN. */
export interface NuevaLineaLibrePedido extends Modelo {
    descripcion: string;
    cantidad: number;
    pvpUnitario: number;
}

export type CambiosPedido = Partial<Pedido>;

export type CambiosLineaPedido = Partial<LineaPedido>;

export type GetPedido = (id: string) => Promise<Pedido>;
export type GetPedidos = (criteria: Criteria) => RespuestaLista<Pedido>;
export type PostPedido = (
    nuevoPedido: NuevoPedido | NuevoPedidoProveedorNoRegistrado
) => Promise<string>;
export type PatchPedido = (id: string, cambios: CambiosPedido) => Promise<void>;
export type DeletePedido = (id: string) => Promise<void>;

export type GetLineasPedido = (id: string) => Promise<LineaPedido[]>;
export type GetLineaPedido = (id: string, lineaId: string) => Promise<LineaPedido>;
export type PostLineasPedido = (
    id: string,
    lineas: (NuevaLineaPedido | NuevaLineaLibrePedido)[]
) => Promise<string[]>;
export type PatchLineaPedido = (
    id: string,
    lineaId: string,
    cambios: CambiosLineaPedido
) => Promise<void>;
export type CerrarLineaPedido = (id: string, lineaId: string, cerrada: boolean) => Promise<void>;
/** Borrar líneas es un PATCH con la lista de ids; no hay endpoint para una suelta. */
export type BorrarLineasPedido = (id: string, lineas: string[]) => Promise<void>;
