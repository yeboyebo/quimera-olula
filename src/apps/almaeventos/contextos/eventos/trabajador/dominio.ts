
import { EstadoModelo, initEstadoModelo, MetaModelo } from "../../../../../contextos/comun/dominio.ts";
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
        // referencia: { requerido: false },
        // descripcion: { requerido: false },
        // Agrega aquí más campos según validaciones necesarias
    },
};

export const metaNuevoTrabajador: MetaModelo<NuevoTrabajador> = {
    campos: {
        // referencia: { requerido: true, validacion: (trabajador: NuevoTrabajador) => stringNoVacio(trabajador.referencia) },
    },
};

export const initEstadoTrabajador = (trabajador: Trabajador): EstadoModelo<Trabajador> =>
    initEstadoModelo(trabajador);

export const initEstadoTrabajadorVacio = () => initEstadoTrabajador(trabajadorVacio);