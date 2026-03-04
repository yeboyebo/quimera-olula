import { Maquina } from "@olula/lib/useMaquina.ts";
import { EstadoTarjetaTramo } from "./diseño.ts";

export const getMaquinaTramo = (): Maquina<EstadoTarjetaTramo> => ({
    EDITANDO: {
        guardar_solicitado: "GUARDANDO",
    },
    GUARDANDO: {
        guardado_ok: "EDITANDO",
        guardado_error: "EDITANDO",
    },
});
