import { Maquina } from "@olula/lib/diseño.js";
import { ContextoMaestroVentasTpv, EstadoMaestroVentasTpv } from "../diseño.ts";
import { activarVenta, cambiarVentaEnLista, crearVenta, desactivarVentaActiva, incluirVentaEnLista, quitarVentaDeLista, recargarVentas } from "./maestro.ts";


export const getMaquina: () => Maquina<EstadoMaestroVentasTpv, ContextoMaestroVentasTpv> = () => {

    return {

        INICIAL: {

            venta_cambiada: cambiarVentaEnLista,

            venta_seleccionada: [activarVenta],

            venta_deselaccionada: desactivarVentaActiva,

            venta_borrada: quitarVentaDeLista,

            venta_creada: incluirVentaEnLista,

            recarga_de_ventas_solicitada: recargarVentas,

            creacion_de_venta_solicitada: crearVenta,
        },
    }
}

