import { Maquina } from "@olula/lib/diseño.ts";
import { publicar } from "@olula/lib/dominio.js";
import { ContextoFamilia, EstadoFamilia } from "./diseño.ts";
import { cancelarEdicion, cargarContexto, refrescarFamilia } from "./dominio.ts";

export const getMaquina: () => Maquina<EstadoFamilia, ContextoFamilia> = () => ({
    INICIAL: {
        familia_id_cambiado: [cargarContexto],
    },
    Editando: {
        familia_guardada: [refrescarFamilia],
        cancelar_edicion: cancelarEdicion,
        borrar: "Borrando",
        cancelar_seleccion: publicar("seleccion_cancelada"),
    },
    Borrando: {
        borrado_cancelado: "Editando",
        familia_borrada: publicar("familia_borrada"),
    },
});
