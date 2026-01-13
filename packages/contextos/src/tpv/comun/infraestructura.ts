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
    actualizar: (AgenteId: string) => {
        localStorage.setItem(CLAVE_AGENTE_TPV, AgenteId);
    },
    obtener: () => localStorage.getItem(CLAVE_AGENTE_TPV),
    borrar: () => {
        localStorage.removeItem(CLAVE_PUNTO_VENTA);
    },
}