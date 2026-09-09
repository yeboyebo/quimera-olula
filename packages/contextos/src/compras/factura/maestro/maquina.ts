import { Maquina } from "@olula/lib/diseño.ts";
import { ContextoMaestroFactura, EstadoMaestroFactura } from "./diseño.ts";
import * as maestro from "./maestro.ts";

export const getMaquina: () => Maquina<EstadoMaestroFactura, ContextoMaestroFactura> = () => {
    return {
        INICIAL: {
            factura_seleccionada: [maestro.Facturas.activar],
            factura_deseleccionada: [maestro.Facturas.desactivar],

            factura_cambiada: [maestro.Facturas.cambiar],
            factura_borrada: [maestro.Facturas.quitar],

            recarga_de_facturas_solicitada: maestro.recargarFacturas,

            criteria_cambiado: [maestro.Facturas.filtrar, maestro.recargarFacturas],

            siguiente_pagina: [maestro.Facturas.filtrar, maestro.ampliarFacturas],

            crear_factura_solicitada: "CREANDO",
        },

        CREANDO: {
            alta_de_factura_cancelada: "INICIAL",

            factura_creada: maestro.incluirFacturaCreadaPorId,
        },
    };
};
