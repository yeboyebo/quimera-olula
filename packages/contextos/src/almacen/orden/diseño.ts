import { Entidad, Filtro, Modelo, Orden, Paginacion, RespuestaLista } from "@olula/lib/diseño.ts";

export type TipoOrden = "ENTRADA" | "SALIDA" | "TRASPASO";

export interface OrdenAlmacen extends Entidad {
    id: string;
    fecha: string;
    tipo: TipoOrden;
    almacenId: string;
    almacen: string;
    abierta: boolean;
    ubicacionOrigenId: string | null;
    ubicacionOrigen: string | null;
    cajaOrigenId: string | null;
    ubicacionDestinoId: string | null;
    ubicacionDestino: string | null;
    cajaDestinoId: string | null;
    lineas: LineaOrdenAlmacen[];
}

export interface LineaOrdenAlmacen extends Entidad {
    id: string;
    sku: string;
    articulo: string;
    loteId: string | null;
    cantidadPrevista: number;
    cantidadReal?: number;
    ubicacionOrigenId: string | null;
    cajaOrigenId: string | null;
    ubicacionDestinoId: string | null;
    cajaDestinoId: string | null;
    lecturas: LecturaLineaOrden[];
}

export interface LecturaLineaOrden {
    id: string;
    sku: string;
    loteId: string | null;
    cantidad: number;
    ubicacionOrigenId: string | null;
    cajaOrigenId: string | null;
    ubicacionDestinoId: string | null;
    cajaDestinoId: string | null;
    fechaHora: Date;
}

export interface NuevaOrdenAlmacen extends Modelo {
    fecha?: Date;
    tipoOrden: string;
    almacenId: string;
    abierta: boolean;
}

export interface NuevaLineaOrdenAlmacen extends Modelo {
    sku: string;
    loteId: string | null;
    cantidadPrevista: number;
    cantidadReal?: number;
    ubicacionOrigenId: string | null;
    cajaOrigenId: string | null;
    ubicacionDestinoId: string | null;
    cajaDestinoId: string | null;
}

export interface NuevaLecturaOrden extends Modelo {
    cantidad: number;
    sku: string;
    articulo: string;
    idLote: string | null;
    idCajaDestino: string | null;
    idUbicacionDestino: string | null;
    idCajaOrigen: string | null;
    idUbicacionOrigen: string | null;
}

export interface ItemOrdenAlmacen extends Entidad {
    id: string;
    fecha: string;
    tipo: string;
    abierta: boolean;
    estado: string;
    ubicacionOrigenId: string | null;
    cajaOrigenId: string | null;
    ubicacionDestinoId: string | null;
    cajaDestinoId: string | null;
}

export type CambiosOrdenAlmacen = Partial<OrdenAlmacen>;
export type CambiosLineaOrdenAlmacen = Partial<LineaOrdenAlmacen>;

export type GetOrden = (id: string) => Promise<OrdenAlmacen>;
export type GetOrdenes = (filtro: Filtro, orden: Orden, paginacion?: Paginacion) => RespuestaLista<ItemOrdenAlmacen>;
export type PostOrden = (nuevaOrden: NuevaOrdenAlmacen) => Promise<string>;
export type PatchOrden = (id: string, cambios: CambiosOrdenAlmacen) => Promise<void>;
export type DeleteOrden = (id: string) => Promise<void>;
export type PostLineasOrden = (id: string, lineas: NuevaLineaOrdenAlmacen[]) => Promise<void>;
export type PatchLineaOrden = (id: string, lineaId: string, cambios: CambiosLineaOrdenAlmacen) => Promise<void>;
export type DeleteLineasOrden = (id: string, lineaIds: string[]) => Promise<void>;
