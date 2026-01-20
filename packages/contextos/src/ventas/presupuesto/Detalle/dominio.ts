import { ProcesarContexto } from "@olula/lib/diseño.js";
import { ejecutarListaProcesos, publicar } from "@olula/lib/dominio.ts";
import { presupuestoVacio } from "../dominio.ts";
import {
    aprobarPresupuesto as aprobarPresupuestoFuncion,
    borrarPresupuesto as borrarPresupuestoFuncion,
    deleteLinea,
    getLineas,
    getPresupuesto,
    patchCambiarCliente,
    patchCambiarDivisa,
    patchCantidadLinea,
    patchLinea,
    patchPresupuesto,
    postLinea
} from "../infraestructura.ts";
import { CambioCliente, ContextoPresupuesto, EstadoPresupuesto, LineaPresupuesto, NuevaLinea, Presupuesto } from "./diseño.ts";

type ProcesarPresupuesto = ProcesarContexto<EstadoPresupuesto, ContextoPresupuesto>;

const pipePresupuesto = ejecutarListaProcesos<EstadoPresupuesto, ContextoPresupuesto>;

const presupuestoVacioObjeto: Presupuesto = presupuestoVacio();

export const presupuestoVacioContexto = (): Presupuesto => ({ ...presupuestoVacioObjeto });

const cargarPresupuesto: (_: string) => ProcesarPresupuesto = (idPresupuesto) =>
    async (contexto) => {
        const presupuesto = await getPresupuesto(idPresupuesto);
        return {
            ...contexto,
            presupuesto,
        }
    }

export const refrescarPresupuesto: ProcesarPresupuesto = async (contexto) => {
    const presupuesto = await getPresupuesto(contexto.presupuesto.id);
    return [
        {
            ...contexto,
            presupuesto: {
                ...contexto.presupuesto,
                ...presupuesto
            },
        },
        [["presupuesto_cambiado", presupuesto]]
    ]
}

export const cancelarCambioPresupuesto: ProcesarPresupuesto = async (contexto) => {
    return {
        ...contexto,
        presupuesto: contexto.presupuestoInicial
    }
}

export const abiertoOAprobadoContexto: ProcesarPresupuesto = async (contexto) => {
    return {
        ...contexto,
        estado: contexto.presupuesto.aprobado ? "APROBADO" : "ABIERTO"
    }
}

export const refrescarLineas: ProcesarPresupuesto = async (contexto) => {
    const lineas = await getLineas(contexto.presupuesto.id);
    return {
        ...contexto,
        presupuesto: {
            ...contexto.presupuesto,
            lineas: lineas as LineaPresupuesto[]
        }
    }
}

export const activarLinea: ProcesarPresupuesto = async (contexto, payload) => {
    const lineaActiva = payload as LineaPresupuesto;
    return {
        ...contexto,
        lineaActiva
    }
}

const activarLineaPorIndice = (indice: number) => async (contexto: ContextoPresupuesto) => {
    const lineas = contexto.presupuesto.lineas as LineaPresupuesto[];
    const lineaActiva = lineas.length > 0
        ? indice >= 0 && indice < lineas.length
            ? lineas[indice]
            : lineas[lineas.length - 1]
        : null

    return {
        ...contexto,
        lineaActiva
    }
}

const activarLineaPorId = (id: string) => async (contexto: ContextoPresupuesto) => {
    const lineas = contexto.presupuesto.lineas as LineaPresupuesto[];
    const lineaActiva = lineas.find((l: LineaPresupuesto) => l.id === id) ?? null;

    return {
        ...contexto,
        lineaActiva
    }
}

export const getContextoVacio: ProcesarPresupuesto = async (contexto) => {
    return {
        ...contexto,
        estado: 'INICIAL',
        presupuesto: presupuestoVacioContexto(),
        lineaActiva: null
    }
}

export const cargarContexto: ProcesarPresupuesto = async (contexto, payload) => {
    const idPresupuesto = payload as string;
    if (idPresupuesto) {
        return pipePresupuesto(
            contexto,
            [
                cargarPresupuesto(idPresupuesto),
                refrescarLineas,
                abiertoOAprobadoContexto,
                activarLineaPorIndice(0),
            ],
            payload
        );
    } else {
        return getContextoVacio(contexto);
    }
}

export const cambiarPresupuesto: ProcesarPresupuesto = async (contexto, payload) => {
    const presupuesto = payload as Presupuesto;
    await patchPresupuesto(contexto.presupuesto.id, presupuesto);

    return pipePresupuesto(contexto, [
        refrescarPresupuesto,
        refrescarLineas,
        'ABIERTO',
    ]);
}

export const borrarPresupuesto: ProcesarPresupuesto = async (contexto) => {
    await borrarPresupuestoFuncion(contexto.presupuesto.id);

    return pipePresupuesto(contexto, [
        getContextoVacio,
        publicar('presupuesto_borrado', contexto.presupuesto)
    ]);
}

export const aprobarPresupuesto: ProcesarPresupuesto = async (contexto) => {
    await aprobarPresupuestoFuncion(contexto.presupuesto.id);

    return pipePresupuesto(contexto, [
        refrescarPresupuesto,
        'APROBADO',
    ]);
}

export const cambiarDivisa: ProcesarPresupuesto = async (contexto, payload) => {
    const divisaId = payload as string;
    await patchCambiarDivisa(contexto.presupuesto.id, divisaId);

    return pipePresupuesto(contexto, [
        refrescarPresupuesto,
        'ABIERTO',
    ]);
}

export const cambiarCliente: ProcesarPresupuesto = async (contexto, payload) => {
    const cambio = payload as CambioCliente;
    await patchCambiarCliente(contexto.presupuesto.id, cambio);

    return pipePresupuesto(contexto, [
        refrescarPresupuesto,
        'ABIERTO',
    ]);
}

export const crearLinea: ProcesarPresupuesto = async (contexto, payload) => {
    const nuevaLinea = payload as NuevaLinea;
    const idLinea = await postLinea(contexto.presupuesto.id, nuevaLinea);

    return pipePresupuesto(contexto, [
        refrescarPresupuesto,
        refrescarLineas,
        activarLineaPorId(idLinea),
        'ABIERTO',
    ]);
}

export const cambiarLinea: ProcesarPresupuesto = async (contexto, payload) => {
    const linea = payload as LineaPresupuesto;
    await patchLinea(contexto.presupuesto.id, linea);

    return pipePresupuesto(contexto, [
        refrescarPresupuesto,
        refrescarLineas,
        'ABIERTO',
    ]);
}

export const cambiarCantidadLinea: ProcesarPresupuesto = async (contexto, payload) => {
    const { lineaId, cantidad } = payload as { lineaId: string, cantidad: number };

    const linea = contexto.presupuesto.lineas.find(l => l.id === lineaId);
    if (!linea) return contexto;

    await patchCantidadLinea(contexto.presupuesto.id, linea, cantidad);

    return pipePresupuesto(contexto, [
        refrescarPresupuesto,
        refrescarLineas,
        activarLineaPorId(lineaId),
        'ABIERTO',
    ]);
}

export const borrarLinea: ProcesarPresupuesto = async (contexto, payload) => {
    const idLinea = payload as string;
    await deleteLinea(contexto.presupuesto.id, idLinea);

    const indiceLineaActiva = (contexto.presupuesto.lineas as LineaPresupuesto[]).findIndex((l: LineaPresupuesto) => l.id === idLinea);

    return pipePresupuesto(contexto, [
        refrescarPresupuesto,
        refrescarLineas,
        activarLineaPorIndice(indiceLineaActiva),
        'ABIERTO',
    ]);
}
