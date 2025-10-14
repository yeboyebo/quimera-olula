import { EstadoModelo, initEstadoModelo, MetaModelo } from "@olula/lib/dominio.ts";
import { NuevoTrabajador, Trabajador } from "./diseño.ts";

export const trabajadorVacio: Trabajador = {
    id: '',
    nombre: '',
    coste: 0,
};

export const nuevoTrabajadorVacio: NuevoTrabajador = {
    id: '',
    nombre: '',
    coste: 0,
};

export const metaTrabajador: MetaModelo<Trabajador> = {
    campos: {
        coste: { requerido: true, tipo: "numero" },
        nombre: { requerido: true, tipo: "texto" },
        // Agrega aquí más campos según validaciones necesarias
    },
};

export const metaNuevoTrabajador: MetaModelo<NuevoTrabajador> = {
    campos: {
        id: { requerido: true, tipo: "texto" },
        coste: { requerido: true, tipo: "numero" },
        nombre: { requerido: true, tipo: "texto" },
        // referencia: { requerido: true, validacion: (trabajador: NuevoTrabajador) => stringNoVacio(trabajador.referencia) },
    },
};

export const initEstadoTrabajador = (trabajador: Trabajador): EstadoModelo<Trabajador> =>
    initEstadoModelo(trabajador);

export const initEstadoTrabajadorVacio = () => initEstadoTrabajador(trabajadorVacio);