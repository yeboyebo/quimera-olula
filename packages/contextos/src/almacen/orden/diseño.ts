export type OrdenAlmacen = {
    id: string;
    fecha: string;
    tipoOrden: string;
    almacenId: string;
    abierta: boolean;
    ubicacionOrigenId: string | null;
    cajaOrigenId: string | null;
    ubicacionDestinoId: string | null;
    cajaDestinoId: string | null;
    lineas: LineaOrdenAlmacen[];
};

export type LineaOrdenAlmacen = {
    id?: string;
    sku: string;
    loteId: string | null;
    cantidadPrevista: number;
    cantidadReal?: number;
    ubicacionOrigenId: string | null;
    cajaOrigenId: string | null;
    ubicacionDestinoId: string | null;
    cajaDestinoId: string | null;
};

export type NuevaOrdenAlmacen = Omit<OrdenAlmacen, "id" | "lineas">;

export type NuevaLineaOrdenAlmacen = LineaOrdenAlmacen;

export type LineaOrdenAlmacenConId = LineaOrdenAlmacen & { id: string };

// Tipos API (snake_case)

export type OrdenAlmacenApi = {
    id: string;
    fecha: string;
    tipo_orden: string;
    almacen_id: string;
    abierta: boolean;
    ubicacion_origen_id: string | null;
    caja_origen_id: string | null;
    ubicacion_destino_id: string | null;
    caja_destino_id: string | null;
    lineas: LineaOrdenAlmacenApi[];
};

export type LineaOrdenAlmacenApi = {
    id?: string;
    sku: string;
    lote_id: string | null;
    cantidad_prevista: number;
    cantidad_real?: number;
    ubicacion_origen_id: string | null;
    caja_origen_id: string | null;
    ubicacion_destino_id: string | null;
    caja_destino_id: string | null;
};

export type CambiosOrdenAlmacenApi = {
    fecha: string;
    tipo_orden: string;
    abierta: boolean;
    estado: string;
};

export type CambiosLineaOrdenAlmacenApi = {
    sku: string;
    lote_id: string | null;
    cantidad_prevista: number;
    cantidad_real: number;
    ubicacion_origen_id: string | null;
    caja_origen_id: string | null;
    ubicacion_destino_id: string | null;
    caja_destino_id: string | null;
};

export type BorrarLineasOrdenAlmacenApi = {
    linea_ids: string[];
};

// Tipos para el listado de órdenes (GET /almacen/orden)

export type ItemOrdenApi = {
    id: string;
    fecha: string;
    tipo: string;
    abierta: boolean;
    estado: string;
    ubicacion_origen_id: string | null;
    caja_origen_id: string | null;
    ubicacion_destino_id: string | null;
    caja_destino_id: string | null;
};

export type ItemOrdenAlmacen = {
    id: string;
    fecha: string;
    tipo: string;
    abierta: boolean;
    estado: string;
    ubicacionOrigenId: string | null;
    cajaOrigenId: string | null;
    ubicacionDestinoId: string | null;
    cajaDestinoId: string | null;
};
