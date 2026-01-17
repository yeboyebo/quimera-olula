import { AgenteTpv } from "../agente/diseño.ts";

const CLAVE_PUNTO_VENTA = "punto-venta-tpv-local";

export const puntoVentaLocal = {
    actualizar: (puntoVentaId: string) => {
        localStorage.setItem(CLAVE_PUNTO_VENTA, puntoVentaId);
    },
    obtener: () => localStorage.getItem(CLAVE_PUNTO_VENTA),
    borrar: () => {
        localStorage.removeItem(CLAVE_PUNTO_VENTA);
    },
}

const CLAVE_AGENTE_TPV = "agente-tpv-local";

export const agenteActivo = {

    actualizar: (agente: AgenteTpv) => {
        localStorage.setItem(CLAVE_AGENTE_TPV, JSON.stringify(agente));
    },

    obtener: (): AgenteTpv | null => {
        const agenteStorage = localStorage.getItem(CLAVE_AGENTE_TPV);
        if (agenteStorage) {
            const agente = JSON.parse(agenteStorage);
            return agente
        }
        return null;
    },

    borrar: () => {
        localStorage.removeItem(CLAVE_PUNTO_VENTA);
    },
}