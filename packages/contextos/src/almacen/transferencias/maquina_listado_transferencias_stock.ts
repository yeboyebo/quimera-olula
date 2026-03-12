import { Criteria, Maquina, ProcesarContexto } from "@olula/lib/diseño.ts";
import {
    accionesListaActivaEntidades,
    ListaActivaEntidades,
    ProcesarListaActivaEntidades,
} from "@olula/lib/ListaActivaEntidades.js";
import { TransferenciaStock } from "./diseño.ts";
import { obtenerTransferenciasStock } from "./infraestructura.ts";

export type Estado = "INICIAL" | "CREANDO";

export type Contexto = {
    estado: Estado;
    transferencias: ListaActivaEntidades<TransferenciaStock>;
};

const conTransferencias =
    (fn: ProcesarListaActivaEntidades<TransferenciaStock>) => (ctx: Contexto) => ({
        ...ctx,
        transferencias: fn(ctx.transferencias),
    });

type ProcesarTransferencias = ProcesarContexto<Estado, Contexto>;

export const Transferencias = accionesListaActivaEntidades(conTransferencias);

export const recargarTransferencias: ProcesarTransferencias = async (
    contexto,
    payload
) => {
    const criteria = payload as Criteria;
    const resultado = await obtenerTransferenciasStock(
        criteria.filtro,
        criteria.orden,
        criteria.paginacion
    );

    return Transferencias.recargar(contexto, resultado);
};

export const getMaquina: () => Maquina<Estado, Contexto> = () => ({
    INICIAL: {
        transferencia_cambiada: Transferencias.cambiar,
        transferencia_seleccionada: [Transferencias.activar],
        cancelar_seleccion: Transferencias.desactivar,
        transferencia_borrada: async (contexto) => {
            if (!contexto.transferencias.activo) {
                return contexto;
            }

            return Transferencias.quitar(contexto, contexto.transferencias.activo);
        },
        transferencia_creada: Transferencias.incluir,
        recarga_de_transferencias_solicitada: recargarTransferencias,
        criteria_cambiado: [Transferencias.filtrar, recargarTransferencias],
        crear: "CREANDO",
    },
    CREANDO: {
        transferencia_creada: [Transferencias.incluir, "INICIAL"],
        creacion_cancelada: "INICIAL",
    },
});