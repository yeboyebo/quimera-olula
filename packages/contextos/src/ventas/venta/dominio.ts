import { MetaModelo } from "@olula/lib/dominio.ts";
import { CambioClienteVenta, NuevaLineaVenta } from "./diseño.ts";



export const metaCambioClienteVenta: MetaModelo<CambioClienteVenta> = {
    campos: {
        cliente_id: { requerido: true },
        direccion_id: { requerido: true },
    }
};

export const metaNuevaLineaVenta: MetaModelo<NuevaLineaVenta> = {
    campos: {
        cantidad: { requerido: true, tipo: "entero", decimales: 2 },
        referencia: { requerido: true, tipo: "texto" },
    }
};

