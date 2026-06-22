import { ProcesarContexto } from "@olula/lib/diseño.ts";
import { LineaFacturaDevolucion } from "../../diseño.ts";
import {
    ContextoLineasDevolucion,
    EstadoLineasDevolucion,
} from "./diseño.ts";

type ProcesarLineasDevolucion = ProcesarContexto<
    EstadoLineasDevolucion,
    ContextoLineasDevolucion
>;

type PayloadBorrador = {
    idLinea: string;
    valor: string;
};

const normalizarLineas = (lineas: LineaFacturaDevolucion[]) =>
    lineas.map((linea) => ({
        ...linea,
        cantidadDevolver: Number(linea.cantidadDevolver ?? 0),
    }));

const crearBorradores = (lineas: LineaFacturaDevolucion[]) =>
    lineas.reduce<Record<string, string>>(
        (acc, linea) => ({
            ...acc,
            [linea.id]: String(linea.cantidadDevolver ?? 0),
        }),
        {}
    );

export const cargarLineasProceso: ProcesarLineasDevolucion = async (
    contexto,
    payload
) => {
    const lineasEntrada = Array.isArray(payload)
        ? (payload as LineaFacturaDevolucion[])
        : [];
    const lineas = normalizarLineas(lineasEntrada);

    return {
        ...contexto,
        lineas,
        borradoresCantidad: crearBorradores(lineas),
    };
};

export const cambiarBorradorProceso: ProcesarLineasDevolucion = async (
    contexto,
    payload
) => {
    const { idLinea, valor } = payload as PayloadBorrador;

    return {
        ...contexto,
        borradoresCantidad: {
            ...contexto.borradoresCantidad,
            [idLinea]: valor,
        },
    };
};

export const aplicarCantidadProceso: ProcesarLineasDevolucion = async (
    contexto,
    payload
) => {
    const idLinea = String(payload ?? "");
    const lineas = contexto.lineas.map((linea) => {
        if (linea.id !== idLinea) return linea;

        const bruto = contexto.borradoresCantidad[idLinea]?.replace(",", ".") ?? "0";
        const valor = Number(bruto);
        const cantidad = Number.isNaN(valor)
            ? 0
            : Math.max(0, Math.min(valor, linea.cantidad));

        return {
            ...linea,
            cantidadDevolver: cantidad,
        };
    });

    return {
        ...contexto,
        lineas,
        borradoresCantidad: crearBorradores(lineas),
    };
};

export const aplicarCantidadMaximaProceso: ProcesarLineasDevolucion = async (
    contexto,
    payload
) => {
    const idLinea = String(payload ?? "");
    const lineas = contexto.lineas.map((linea) => {
        if (linea.id !== idLinea) return linea;
        const cantidad = linea.esKit ? 0 : linea.cantidad;
        return { ...linea, cantidadDevolver: cantidad };
    });

    return {
        ...contexto,
        lineas,
        borradoresCantidad: crearBorradores(lineas),
    };
};

export const aplicarDevolucionTotalProceso: ProcesarLineasDevolucion = async (
    contexto
) => {
    const lineas = contexto.lineas.map((linea) => ({
        ...linea,
        cantidadDevolver: linea.esKit ? 0 : linea.cantidad,
    }));

    return {
        ...contexto,
        lineas,
        borradoresCantidad: crearBorradores(lineas),
    };
};
