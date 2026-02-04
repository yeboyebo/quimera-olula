import { Maquina } from "@olula/lib/diseño.js";
import { ContextoMaestroFactura, EstadoMaestroFactura } from "./diseño.ts";
import {
    activarFactura,
    cambiarFacturaEnLista,
    desactivarFacturaActiva,
    incluirFacturaEnLista,
    quitarFacturaDeLista,
    recargarFacturas
} from "./dominio.ts";


export const getMaquina: () => Maquina<EstadoMaestroFactura, ContextoMaestroFactura> = () => {

    return {

        INICIAL: {

            factura_cambiada: cambiarFacturaEnLista,

            factura_seleccionada: [activarFactura],

            factura_deseleccionada: desactivarFacturaActiva,

            factura_borrada: quitarFacturaDeLista,

            factura_creada: incluirFacturaEnLista,

            recarga_de_facturas_solicitada: recargarFacturas,

            crear_factura_solicitado: "CREANDO_FACTURA",
        },

        CREANDO_FACTURA: {

            factura_creada: [incluirFacturaEnLista, 'INICIAL'],

            creacion_factura_cancelada: "INICIAL",
        },

    }
}
