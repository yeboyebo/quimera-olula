import { MetaModelo } from "@olula/lib/dominio.js";
import { AgenteTpv } from "../diseño.ts";
import { CambioAgenteActual } from "./diseño.ts";

// export const CambioAgenteActualVacio: {};
export const metaCambioAgenteActual: MetaModelo<CambioAgenteActual> = {
    campos: {
        idAgente: { requerido: true },
        // agente: { requerido: true },
    },
    onChange: (cambioAgente, campo, _, otros) => {
        if (campo === "idAgente" && otros) {
            const nuevoValor: CambioAgenteActual = {
                ...cambioAgente,
                agente: otros.agente as AgenteTpv
            }
            return nuevoValor
        }
        return cambioAgente
    }
};