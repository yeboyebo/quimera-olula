import { ProcesarContexto } from "@olula/lib/diseño.js";
import { ejecutarListaProcesos } from "@olula/lib/dominio.js";
import { getArqueo } from "../../infraestructura.ts";
import { arqueoTpvVacio, ContextoArqueoTpv, EstadoArqueoTpv } from "./diseño.ts";

type ProcesarArqueoTpv = ProcesarContexto<EstadoArqueoTpv, ContextoArqueoTpv>;

const pipeArqueoTpv = ejecutarListaProcesos<EstadoArqueoTpv, ContextoArqueoTpv>;

export const cargarContexto: ProcesarArqueoTpv = async (contexto, payload) => {

    const idArqueo = payload as string;
    if (idArqueo) {
        return pipeArqueoTpv(
            contexto,
            [
                cargarArqueo(idArqueo),
                // refrescarPagos,
                // activarPagoPorIndice(0),
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