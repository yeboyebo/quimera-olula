import { ProcesarContexto } from "@olula/lib/diseño.js";
import { cargar, listaSeleccionableVacia } from "@olula/lib/entidad.ts";
import { presupuestoVacio } from "../../presupuesto/detalle/detalle.ts";
import { getLineas, getPresupuesto } from "../../presupuesto/infraestructura.ts";
import { LineaAprobarPresupuesto } from "../diseño.ts";
import { pendienteDeLinea } from "../dominio.ts";
import { patchAprobarPresupuestoParcial } from "../infraestructura.ts";
import { ContextoAprobarPresupuesto, EstadoAprobarPresupuesto } from "./diseño.ts";

export const contextoVacio: ContextoAprobarPresupuesto = {
    estado: "INICIAL",
    presupuesto: presupuestoVacio(),
    lineas: listaSeleccionableVacia<LineaAprobarPresupuesto>(),
};

type ProcesarAprobarPresupuesto = ProcesarContexto<EstadoAprobarPresupuesto, ContextoAprobarPresupuesto>;

export const cargarDatos: ProcesarAprobarPresupuesto = async (contexto, presupuestoId) => {
    const presupuestoIdStr = presupuestoId as string;
    const presupuesto = await getPresupuesto(presupuestoIdStr);
    const lineasData = await getLineas(presupuestoIdStr);

    return {
        ...contexto,
        presupuesto,
        lineas: cargar(lineasData)(contexto.lineas),
        estado: "LISTO",
    };
};

export const seleccionarLinea: ProcesarAprobarPresupuesto = async (contexto, payload) => {
    const lineaId = payload as string;
    return {
        ...contexto,
        lineas: {
            ...contexto.lineas,
            idActivo: lineaId,
        },
    };
};

export const cambiarCantidadLinea: ProcesarAprobarPresupuesto = async (contexto, payload) => {
    const { id, cantidad } = payload as { id: string; cantidad: number };
    const lineasActualizadas = contexto.lineas.lista.map((l) => {
        if (String(l.id) !== String(id)) return l;
        const maximo = pendienteDeLinea(l);
        const a_pedir = Math.min(maximo, Math.max(0, Number(cantidad) || 0));
        return {
            ...l,
            a_pedir,
        } as LineaAprobarPresupuesto;
    });

    return {
        ...contexto,
        lineas: {
            ...contexto.lineas,
            lista: lineasActualizadas,
        },
    };
};

export const actualizarEstadoCerradoLinea: ProcesarAprobarPresupuesto = async (contexto, payload) => {
    const { id, cerrada } = payload as { id: string; cerrada: boolean };
    const lineasActualizadas = contexto.lineas.lista.map((l) => {
        if (String(l.id) !== String(id)) return l;
        return {
            ...l,
            cerrada,
        } as LineaAprobarPresupuesto;
    });

    return {
        ...contexto,
        lineas: {
            ...contexto.lineas,
            lista: lineasActualizadas,
        },
    };
};

export const aprobarLinea: ProcesarAprobarPresupuesto = async (contexto, payload) => {
    const lineaId = payload as string;
    const lineasActualizadas = contexto.lineas.lista.map((l) => {
        if (String(l.id) !== String(lineaId)) return l;
        return {
            ...l,
            a_pedir: pendienteDeLinea(l),
        } as LineaAprobarPresupuesto;
    });

    return {
        ...contexto,
        lineas: {
            ...contexto.lineas,
            lista: lineasActualizadas,
        },
    };
};

export const aprobarTodas: ProcesarAprobarPresupuesto = async (contexto) => {
    const lineasActualizadas = contexto.lineas.lista.map((l) => {
        if (l.cerrada) return l;
        return {
            ...l,
            a_pedir: pendienteDeLinea(l),
        } as LineaAprobarPresupuesto;
    });

    return {
        ...contexto,
        lineas: {
            ...contexto.lineas,
            lista: lineasActualizadas,
        },
    };
};

export const cancelarSeleccion: ProcesarAprobarPresupuesto = async (contexto) => {
    return {
        ...contexto,
        lineas: {
            ...contexto.lineas,
            idActivo: null,
        },
    };
};

export const aprobarPresupuesto: ProcesarAprobarPresupuesto = async (contexto) => {
    const pedidoCreado = await patchAprobarPresupuestoParcial(contexto.presupuesto.id, contexto.lineas.lista);

    const presupuestoActualizado = await getPresupuesto(contexto.presupuesto.id);
    const lineasActualizadas = await getLineas(contexto.presupuesto.id);

    return {
        ...contexto,
        presupuesto: presupuestoActualizado,
        lineas: cargar(lineasActualizadas)(contexto.lineas),
        pedidoCreado,
    };
};

export const puedeAprobar = (datos: {
    presupuesto: ContextoAprobarPresupuesto['presupuesto'];
    lineas: ContextoAprobarPresupuesto['lineas'];
}): boolean => {
    const { presupuesto, lineas } = datos;
    const hayLineasParaPedir = lineas.lista.some((linea) => {
        return (
            linea.a_pedir !== undefined &&
            linea.a_pedir !== null &&
            linea.a_pedir > 0
        );
    });

    return hayLineasParaPedir && presupuesto.servido !== "TOTAL";
};

export const hayPendiente = (lineas: ContextoAprobarPresupuesto['lineas']): boolean => {
    return lineas.lista.some((linea) => pendienteDeLinea(linea) > 0);
};
