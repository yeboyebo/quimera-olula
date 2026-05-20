import { Maquina } from "@olula/lib/diseño.ts";
import { ContextoMaestroCaja, EstadoMaestroCaja } from "./diseño.ts";
import { Cajas, recargarCajas } from "./dominio.ts";

export const getMaquina: () => Maquina<EstadoMaestroCaja, ContextoMaestroCaja> = () => ({
    INICIAL: {
        caja_cambiada: Cajas.cambiar,
        caja_seleccionada: Cajas.activar,
        caja_deseleccionada: Cajas.desactivar,
        caja_borrada: Cajas.quitar,
        caja_creada: Cajas.incluir,
        recarga_de_cajas_solicitada: recargarCajas,
        criteria_cambiado: [Cajas.filtrar, recargarCajas],
        creacion_solicitada: "CREANDO_CAJA",
    },
    CREANDO_CAJA: {
        caja_creada: [Cajas.incluir, "INICIAL"],
        creacion_cancelada: "INICIAL",
    },
});
