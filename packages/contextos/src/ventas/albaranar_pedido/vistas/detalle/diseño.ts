import { AlbaranCreado, AlbaranarPedido, LineaAlbaranar, LoteAlbaranar } from "../../diseño.ts";

export type EstadoAlbaranar =
    | "INICIAL"
    | "CARGANDO"
    | "LISTO"
    | "CREANDO_LOTE"
    | "CAMBIANDO_LOTE"
    | "BORRANDO_LOTE"
    | "ALBARAN_CREADO";

export type ContextoAlbaranar = {
    estado: EstadoAlbaranar;
    albaranado: AlbaranarPedido;
    lineaActivaId: string | null;
    loteActivo: LoteAlbaranar | null;
    albaranCreado: AlbaranCreado | null;
};

export type { AlbaranarPedido, LineaAlbaranar, LoteAlbaranar };
