import { Maquina } from "@olula/lib/diseño.js";
import { publicar } from "@olula/lib/dominio.js";
import { cambiarCliente, cargarContexto, getContextoVacio, onClienteBorrado } from "./detalle.ts";
import { ContextoDetalleCliente, EstadoDetalleCliente } from "./diseño.ts";

export const getMaquina: () => Maquina<EstadoDetalleCliente, ContextoDetalleCliente> = () => {
    return {
        INICIAL: {
            cliente_id_cambiado: cargarContexto,

            cliente_cambiado: cambiarCliente,

            edicion_cliente_cancelada: [getContextoVacio, publicar("cliente_deseleccionado", null)],

            borrado_cliente_solicitado: "BORRANDO",
        },
        BORRANDO: {
            borrado_cliente_cancelado: "INICIAL",

            cliente_borrado: onClienteBorrado,
        },
    }
}
