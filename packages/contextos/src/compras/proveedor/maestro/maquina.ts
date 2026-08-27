import { Maquina } from "@olula/lib/diseño.ts";
import { ContextoMaestroProveedor, EstadoMaestroProveedor } from "./diseño.ts";
import * as maestro from "./maestro.ts";

export const getMaquina: () => Maquina<EstadoMaestroProveedor, ContextoMaestroProveedor> = () => {
    return {
        INICIAL: {
            proveedor_seleccionado: [maestro.Proveedores.activar],
            proveedor_deseleccionado: [maestro.Proveedores.desactivar],

            proveedor_cambiado: [maestro.Proveedores.cambiar],
            proveedor_borrado: [maestro.Proveedores.quitar],

            recarga_de_proveedores_solicitada: maestro.recargarProveedores,

            criteria_cambiado: [maestro.Proveedores.filtrar, maestro.recargarProveedores],

            siguiente_pagina: [maestro.Proveedores.filtrar, maestro.ampliarProveedores],

            crear_proveedor_solicitado: "CREANDO",
        },

        CREANDO: {
            alta_de_proveedor_cancelada: "INICIAL",

            proveedor_creado: maestro.incluirProveedorCreadoPorId,
        },
    };
};
