import { Maquina } from "@olula/lib/diseño.ts";
import { ContextoMaestroModulo, EstadoMaestroModulo } from "./diseño.ts";
import * as dominio from "./dominio.ts";

export const getMaquina: () => Maquina<EstadoMaestroModulo, ContextoMaestroModulo> = () => {
    return {
        INICIAL: {
            modulo_seleccionado: [dominio.Modulos.activar],

            modulo_deseleccionado: [dominio.Modulos.desactivar],

            modulo_cambio_realizado: [dominio.Modulos.cambiar],

            modulo_borrado: [dominio.Modulos.quitar],

            modulo_creado: [dominio.Modulos.incluir],

            recarga_de_modulos_solicitada: [dominio.recargarModulos],

            crear_modulo_solicitado: "CREANDO_MODULO",
        },
        CREANDO_MODULO: {
            creacion_cancelada: "INICIAL",

            modulo_creacion_completada: [dominio.crearModuloProceso, "INICIAL"],
        },
    };
};
