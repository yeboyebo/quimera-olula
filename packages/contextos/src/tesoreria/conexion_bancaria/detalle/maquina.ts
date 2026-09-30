import { Maquina } from "@olula/lib/diseño.ts";
import { publicar } from "@olula/lib/dominio.ts";
import { cargarContexto, refrescarConexionBancaria } from "./detalle.js";
import { ContextoDetalleConexionBancaria, EstadoDetalleConexionBancaria } from "./diseño.js";

export const getMaquina: () => Maquina<EstadoDetalleConexionBancaria, ContextoDetalleConexionBancaria> = () => {
    return {
        INICIAL: {
            conexion_bancaria_id_cambiado: [cargarContexto],

            conexion_bancaria_deseleccionada: [
                publicar('conexion_bancaria_deseleccionada', null),
            ],
        },

        ABIERTO: {
            conexion_bancaria_id_cambiado: [cargarContexto],

            conexion_bancaria_deseleccionada: [
                publicar('conexion_bancaria_deseleccionada', null),
            ],

            // Una cuenta se asoció/activó (ver detalle/cuentas/CuentasConexionBancaria.tsx)
            cuenta_conexion_bancaria_guardada: [refrescarConexionBancaria],

            reautenticacion_solicitada: "REAUTENTICANDO",

            desconexion_solicitada: "DESCONECTANDO",
        },

        REAUTENTICANDO: {
            conexion_bancaria_reautenticada: [refrescarConexionBancaria, "ABIERTO"],

            reautenticacion_cancelada: "ABIERTO",
        },

        DESCONECTANDO: {
            conexion_bancaria_borrada: [
                publicar('conexion_bancaria_borrada', null),
                "INICIAL",
            ],

            desconexion_cancelada: "ABIERTO",
        },
    };
};
