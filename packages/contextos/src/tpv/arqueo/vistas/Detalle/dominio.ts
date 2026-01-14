import { ProcesarContexto } from "@olula/lib/diseño.js";
import { ejecutarListaProcesos } from "@olula/lib/dominio.js";
import { getArqueo, patchCerrarArqueo, patchReabrirArqueo } from "../../infraestructura.ts";
import { arqueoTpvVacio, CierreArqueoTpv, ContextoArqueoTpv, EstadoArqueoTpv } from "./diseño.ts";

type ProcesarArqueoTpv = ProcesarContexto<EstadoArqueoTpv, ContextoArqueoTpv>;

const pipeArqueoTpv = ejecutarListaProcesos<EstadoArqueoTpv, ContextoArqueoTpv>;

export const cargarContexto: ProcesarArqueoTpv = async (contexto, payload) => {

    const idArqueo = payload as string;
    if (idArqueo) {
        return pipeArqueoTpv(
            contexto,
            [
                cargarArqueo(idArqueo),
                abiertoOCerrado,
            ],
            payload
        );
    } else {
        return getContextoVacio(contexto);
    }
}

const cargarArqueo: (_: string) => ProcesarArqueoTpv = (idArqueo) =>
    async (contexto) => {

        const arqueo = await getArqueo(idArqueo);
        return {
            ...contexto,
            arqueo,
        }
    }

export const refrescarArqueo: ProcesarArqueoTpv = async (contexto) => {

    const arqueo = await getArqueo(contexto.arqueo.id);
    return [
        {
            ...contexto,
            arqueo: {
                ...contexto.arqueo,
                ...arqueo
            },
        },
        [["arqueo_cambiado", arqueo]]
    ]
}

export const abiertoOCerrado: ProcesarArqueoTpv = async (contexto) => {
    return {
        ...contexto,
        estado: contexto.arqueo.abierto ? "ABIERTO" : "CERRADO"
    }
}

export const getContextoVacio: ProcesarArqueoTpv = async (contexto) => {

    return {
        ...contexto,
        estado: 'INICIAL',
        arqueo: arqueoTpvVacio,
        arqueoInicial: arqueoTpvVacio,
        pagoActivo: null,
    }
}

export const cerrarArqueo: ProcesarArqueoTpv = async (contexto, payload) => {

    const cierre = payload as CierreArqueoTpv;

    await patchCerrarArqueo(contexto.arqueo.id, cierre);

    return pipeArqueoTpv(contexto, [
        refrescarArqueo,
        'CERRADO',
    ]);
}

export const reabrirArqueo: ProcesarArqueoTpv = async (contexto) => {

    await patchReabrirArqueo(contexto.arqueo.id);

    return pipeArqueoTpv(contexto, [
        refrescarArqueo,
    ]);
}