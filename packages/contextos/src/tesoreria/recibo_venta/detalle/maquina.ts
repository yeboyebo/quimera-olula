import { Maquina } from "@olula/lib/diseño.ts";
import { publicar } from "@olula/lib/dominio.ts";
import { cargarContexto, desagruparRecibo, pagarRecibo } from "./detalle.js";
import { ContextoDetalleReciboVenta, EstadoDetalleReciboVenta } from "./diseño.js";

export const getMaquina: () => Maquina<EstadoDetalleReciboVenta, ContextoDetalleReciboVenta> = () => {
    return {
        INICIAL: {
            recibo_id_cambiado: [cargarContexto],

            recibo_deseleccionado: [
                publicar('recibo_deseleccionado', null),
            ],
        },

        ABIERTO: {
            recibo_id_cambiado: [cargarContexto],

            recibo_deseleccionado: [
                publicar('recibo_deseleccionado', null),
            ],

            pagar_solicitado: 'PAGANDO',

            enlace_cobro_solicitado: 'ENLACE_COBRO',

            desagrupado_solicitado: 'DESAGRUPANDO',
        },

        PAGANDO: {
            pago_confirmado: [pagarRecibo],

            pago_cancelado: 'ABIERTO',
        },

        ENLACE_COBRO: {
            enlace_cobro_cerrado: 'ABIERTO',
        },

        DESAGRUPANDO: {
            desagrupado_confirmado: [desagruparRecibo],

            desagrupado_cancelado: 'ABIERTO',
        },
    };
};
