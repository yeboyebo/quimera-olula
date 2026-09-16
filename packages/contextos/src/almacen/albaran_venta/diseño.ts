export type PostCrearMovimientoLote = (
    albaranId: string,
    lineaId: string,
    payload: { lote_id: string; cantidad: number; fechahora?: string }
) => Promise<void>;

export type PostBorrarMovimientoLote = (
    albaranId: string,
    lineaId: string,
    payload: { movimiento_id: string }
) => Promise<void>;