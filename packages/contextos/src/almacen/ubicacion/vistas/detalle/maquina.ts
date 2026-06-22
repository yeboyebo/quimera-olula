import { Maquina } from "@olula/lib/diseño.ts";
import { publicar } from "@olula/lib/dominio.js";
import { ContextoUbicacion, EstadoUbicacion } from "./diseño.ts";
import { cancelarEdicion, cargarContexto, refrescarUbicacion } from "./dominio.ts";

export const getMaquina: () => Maquina<EstadoUbicacion, ContextoUbicacion> = () => ({
    INICIAL: {
        ubicacion_id_cambiada: [cargarContexto],
    },
    Editando: {
        ubicacion_guardada: [refrescarUbicacion],
        cancelar_edicion: cancelarEdicion,
        borrar: "Borrando",
        cancelar_seleccion: publicar("seleccion_cancelada"),
    },
    Borrando: {
        borrado_cancelado: "Editando",
        ubicacion_borrada: publicar("ubicacion_borrada"),
    },
});
