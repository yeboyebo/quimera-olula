import { Maquina } from "@olula/lib/diseño.ts";
import { publicar } from "@olula/lib/dominio.js";
import { ContextoAlmacen, EstadoAlmacen } from "./diseño.ts";
import { cancelarEdicion, cargarContexto, refrescarAlmacen } from "./dominio.ts";

export const getMaquina: () => Maquina<EstadoAlmacen, ContextoAlmacen> = () => ({
    INICIAL: {
        almacen_id_cambiado: [cargarContexto],
    },
    Editando: {
        almacen_guardado: [refrescarAlmacen],
        cancelar_edicion: cancelarEdicion,
        borrar: "Borrando",
        cancelar_seleccion: publicar("seleccion_cancelada"),
    },
    Borrando: {
        borrado_cancelado: "Editando",
        almacen_borrado: publicar("almacen_borrado"),
    },
});
