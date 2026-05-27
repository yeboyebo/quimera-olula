import { Maquina } from "@olula/lib/diseño.js";
import { ContextoMovimientos, EstadoMovimientos } from "./diseño.ts";
import {
    borrarMovimiento,
    crearLineaCaja,
    seleccionarMovimiento,
    sincronizarCaja,
} from "./dominio.ts";

export const getMaquina: () => Maquina<EstadoMovimientos, ContextoMovimientos> = () => {
    return {
        lista: {
            caja_id_cambiada: sincronizarCaja,

            movimiento_seleccionado: seleccionarMovimiento,

            formulario_cambiado: async (ctx, payload) => {
                const { campo, valor } = payload as { campo: "codBarras" | "cantidad"; valor: string };
                return {
                    ...ctx,
                    formulario: {
                        ...ctx.formulario,
                        [campo]: valor,
                    },
                };
            },

            guardar_linea_solicitado: crearLineaCaja,

            borrado_movimiento_solicitado: borrarMovimiento,
        },
    };
};
