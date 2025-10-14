import { EstadoModelo, initEstadoModelo, MetaModelo } from "@olula/lib/dominio.ts";
import { fechaActual } from "@olula/lib/fecha.ts";
import { LineaTransferenciaStock, NuevaLineaTransferenciaStock, NuevaTransferenciaStock, TransferenciaStock } from "./diseño.ts";

export const transferenciaStockVacia: TransferenciaStock = {
    id: "",
    origen: "",
    destino: "",
    fecha: fechaActual(),
    nombre_origen: "",
    nombre_destino: "",
};

export const lineaTransferenciaStockVacia: LineaTransferenciaStock = {
    id: "",
    transferencia_id: "",
    sku: "",
    descripcion_producto: "",
    cantidad: 0,
};

export const metaTransferenciaStock: MetaModelo<TransferenciaStock> = {
    campos: {
        origen: { requerido: true, bloqueado: true },
        destino: { requerido: true, bloqueado: true },
        fecha: { requerido: true, tipo: "fecha_hora" },
    },
};

export const metaLineaTransferenciaStock: MetaModelo<LineaTransferenciaStock> = {
    campos: {
        sku: { requerido: true, bloqueado: true },
        cantidad: { requerido: true, tipo: "numero" },
    },
};

export const initEstadoTransferenciaStock = (transferencia: TransferenciaStock): EstadoModelo<TransferenciaStock> =>
    initEstadoModelo(transferencia);

export const initEstadoTransferenciaStockVacia = () => initEstadoTransferenciaStock(transferenciaStockVacia);

export const nuevaTransferenciaStockVacia: NuevaTransferenciaStock = {
    origen: "",
    destino: "",
    fecha: fechaActual()
};

export const nuevaLineaTransferenciaStockVacia: NuevaLineaTransferenciaStock = {
    sku: "",
    cantidad: 1,
};

export const metaNuevaTransferenciaStock: MetaModelo<NuevaTransferenciaStock> = {
    campos: {
        origen: { requerido: true },
        destino: { requerido: true },
        fecha: { requerido: true, tipo: "fecha_hora" },
    },
};

export const metaNuevaLineaTransferenciaStock: MetaModelo<NuevaLineaTransferenciaStock> = {
    campos: {
        sku: { requerido: true },
        cantidad: { requerido: true, tipo: "numero" },
    },
};
