import { Maquina } from "@olula/lib/diseño.ts";
import {
    albaranar,
    borrarLote,
    cambiarCerrada,
    cambiarRecibiendo,
    cambiarLote,
    cancelarModal,
    cargarDatos,
    crearLote,
    marcarTodo,
    solicitarBorrarLote,
    solicitarCambiarLote,
    solicitarCrearLote,
} from "./dominio.ts";
import { ContextoAlbaranar, EstadoAlbaranar } from "./diseño.ts";

export const getMaquina = (): Maquina<EstadoAlbaranar, ContextoAlbaranar> => ({
    INICIAL: {
        cargar: [cargarDatos, "LISTO"],
    },
    CARGANDO: {},
    LISTO: {
        marcar_todo: marcarTodo,
        recibiendo_cambiada: cambiarRecibiendo,
        cerrada_cambiada: cambiarCerrada,
        alta_lote_solicitada: [solicitarCrearLote, "CREANDO_LOTE"],
        cambio_lote_solicitado: [solicitarCambiarLote, "CAMBIANDO_LOTE"],
        baja_lote_solicitada: [solicitarBorrarLote, "BORRANDO_LOTE"],
        albaranar_solicitado: [albaranar, "ALBARAN_CREADO"],
    },
    CREANDO_LOTE: {
        lote_creado: [crearLote, "LISTO"],
        alta_de_lote_cancelada: [cancelarModal, "LISTO"],
    },
    CAMBIANDO_LOTE: {
        lote_cambiado: [cambiarLote, "LISTO"],
        cambio_de_lote_cancelado: [cancelarModal, "LISTO"],
    },
    BORRANDO_LOTE: {
        baja_de_lote_confirmada: [borrarLote, "LISTO"],
        baja_de_lote_cancelada: [cancelarModal, "LISTO"],
    },
    ALBARAN_CREADO: {
        albaranado_cerrado: "LISTO",
    },
});
