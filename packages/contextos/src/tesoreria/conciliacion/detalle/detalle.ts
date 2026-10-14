import { ProcesarContexto } from "@olula/lib/diseño.ts";
import { ejecutarListaProcesos, MetaModelo } from "@olula/lib/dominio.ts";
import { CandidatoConciliacion, MovimientoBancario } from "../diseño.js";
import { movimientoBancarioVacio } from "../dominio.js";
import {
    getCandidatosConciliacion,
    getMovimientoBancario,
    patchConciliarMovimientoBancario,
    patchDesconciliarMovimientoBancario,
    patchIgnorarMovimientoBancario,
    patchReactivarMovimientoBancario,
} from "../infraestructura.js";
import { ContextoDetalleConciliacion, EstadoDetalleConciliacion } from "./diseño.js";

type ProcesarDetalle = ProcesarContexto<EstadoDetalleConciliacion, ContextoDetalleConciliacion>;

const pipeMovimiento = ejecutarListaProcesos<EstadoDetalleConciliacion, ContextoDetalleConciliacion>;

/**
 * Cabecera de solo lectura: la sincronización con el proveedor bancario es
 * quien crea y actualiza los movimientos (ver maestro/SincronizarMovimientoBancario.tsx).
 * La conciliación (candidatos, Conciliar/Desconciliar/Ignorar/Reactivar) se
 * gestiona con las acciones de más abajo, no editando este modelo.
 */
export const metaMovimientoBancario: MetaModelo<MovimientoBancario> = {
    campos: {
        fecha: { tipo: "fecha" },
        fechaValor: { tipo: "fecha" },
        institucionNombre: { tipo: "texto" },
        concepto: { tipo: "texto" },
        contraparte: { tipo: "texto" },
        referencia: { tipo: "texto" },
        importe: { tipo: "moneda" },
        divisa: { tipo: "texto" },
        idExterno: { tipo: "texto" },
        estado: { tipo: "texto" },
        tipoRecibo: { tipo: "texto" },
        codigoRecibo: { tipo: "texto" },
        nombreTercero: { tipo: "texto" },
        puntuacion: { tipo: "numero" },
        origenConciliacion: { tipo: "texto" },
        justificacion: { tipo: "texto" },
        conciliadoPor: { tipo: "texto" },
        conciliadoEn: { tipo: "fecha" },
    },
    editable: () => false,
};

export const contextoDetalleConciliacionInicial: ContextoDetalleConciliacion = {
    estado: 'INICIAL',
    movimiento: movimientoBancarioVacio,
    candidatos: [],
    candidatosTexto: "",
    candidatoSeleccionado: null,
};

/** Solo tiene sentido buscar candidatos si el movimiento aún puede conciliarse. */
const requiereCandidatos = (movimiento: MovimientoBancario): boolean =>
    movimiento.estado === "pendiente" || movimiento.estado === "sugerido";

/**
 * Carga (o recarga con un nuevo texto de búsqueda) los candidatos del
 * movimiento actual. Se deja al backend cualquier filtro por importe/estado;
 * aquí solo se evita la llamada cuando el movimiento ya no es conciliable.
 */
export const cargarCandidatos: ProcesarDetalle = async (contexto, payload) => {
    const texto = typeof payload === "string" ? payload : "";
    const candidatos = requiereCandidatos(contexto.movimiento)
        ? await getCandidatosConciliacion(contexto.movimiento.id, texto || undefined)
        : [];
    return { ...contexto, candidatos, candidatosTexto: texto };
};

export const seleccionarCandidato: ProcesarDetalle = async (contexto, payload) => ({
    ...contexto,
    candidatoSeleccionado: payload as CandidatoConciliacion,
});

export const cargarMovimiento: (_: string) => ProcesarDetalle =
    (idMovimiento) => async (contexto) => {
        const movimiento = await getMovimientoBancario(idMovimiento);
        return pipeMovimiento(contexto, [
            async (ctx) => ({
                ...ctx,
                movimiento,
                candidatos: [],
                candidatosTexto: "",
                candidatoSeleccionado: null,
            }),
            cargarCandidatos,
            'ABIERTO',
        ]);
    };

export const cargarContexto: ProcesarDetalle = async (contexto, payload) => {
    const idMovimiento = payload as string;
    if (idMovimiento) {
        return cargarMovimiento(idMovimiento)(contexto);
    }
    return {
        ...contexto,
        estado: 'INICIAL',
        movimiento: movimientoBancarioVacio,
        candidatos: [],
        candidatosTexto: "",
        candidatoSeleccionado: null,
    };
};

/**
 * Recarga cabecera + candidatos tras Conciliar/Ignorar/Reactivar y propaga el
 * cambio al maestro (`movimiento_cambiado`) para refrescar la fila de la
 * lista. Fija `estado: 'ABIERTO'`: quien la usa (onConciliado, onIgnorado,
 * onReactivado) parte de un estado de modal (CONCILIANDO...) que debe cerrarse.
 */
export const refrescarMovimiento: ProcesarDetalle = async (contexto) => {
    const movimiento = await getMovimientoBancario(contexto.movimiento.id);
    const candidatos = requiereCandidatos(movimiento)
        ? await getCandidatosConciliacion(movimiento.id, contexto.candidatosTexto || undefined)
        : [];
    return [
        { ...contexto, estado: 'ABIERTO', movimiento, candidatos, candidatoSeleccionado: null },
        [["movimiento_cambiado", movimiento]],
    ];
};

export const onConciliado: ProcesarDetalle = async (contexto) => {
    if (!contexto.candidatoSeleccionado) return contexto;
    await patchConciliarMovimientoBancario(contexto.movimiento.id, contexto.candidatoSeleccionado.reciboId);
    return refrescarMovimiento(contexto);
};

export const onIgnorado: ProcesarDetalle = async (contexto, payload) => {
    const motivo = (payload as string | undefined) || undefined;
    await patchIgnorarMovimientoBancario(contexto.movimiento.id, motivo);
    return refrescarMovimiento(contexto);
};

export const onReactivado: ProcesarDetalle = async (contexto) => {
    await patchReactivarMovimientoBancario(contexto.movimiento.id);
    return refrescarMovimiento(contexto);
};

/**
 * Desconciliar puede borrar el movimiento si el banco ya lo había retirado
 * (ver contrato de `PATCH .../desconciliar`): el GET posterior de refresco
 * devuelve 404. RestAPI no distingue el código de estado en el error que
 * propaga, así que si el refresco tras un desconciliado con éxito falla se
 * interpreta como que el movimiento ha desaparecido: se avisa al maestro
 * (`movimiento_borrado`) para que lo quite de la lista y se vacía el detalle
 * (al cambiar `movimientos.activo` el maestro recargará o cerrará el panel).
 */
export const onDesconciliado: ProcesarDetalle = async (contexto) => {
    await patchDesconciliarMovimientoBancario(contexto.movimiento.id);
    // Si el banco ya había retirado el movimiento, el backend lo borra al desconciliar.
    if (!contexto.movimiento.eliminadoEnBanco) {
        return await refrescarMovimiento(contexto);
    }
    return [
        {
            ...contexto,
            estado: 'INICIAL',
            movimiento: movimientoBancarioVacio,
            candidatos: [],
            candidatosTexto: "",
            candidatoSeleccionado: null,
        },
        [["movimiento_borrado", contexto.movimiento.id]],
    ];
};
