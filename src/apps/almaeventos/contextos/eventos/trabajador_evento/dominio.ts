
import { EstadoModelo, initEstadoModelo, MetaModelo } from "../../../../../contextos/comun/dominio.ts";
import { NuevoTrabajadorEvento, TrabajadorEvento } from "./diseño.ts";

export const trabajadorEventoVacio: TrabajadorEvento = {
    id: '',
    nombre: '',
    coste: 0,
    evento_id: '',
    liquidado: false,
    trabajador_id: '',
};

export const nuevoTrabajadorEventoVacio: NuevoTrabajadorEvento = {
    id: '',
    nombre: '',
    coste: 0,
    evento_id: '',
    liquidado: false,
    trabajador_id: '',
};

export const metaTrabajadorEvento: MetaModelo<TrabajadorEvento> = {
    campos: {
        coste: { requerido: true, tipo: "numero" },
        nombre: { requerido: true, tipo: "texto" },
        evento_id: { requerido: true },
        trabajador_id: { requerido: true }
        // Agrega aquí más campos según validaciones necesarias
    },
};

export const metaNuevoTrabajadorEvento: MetaModelo<NuevoTrabajadorEvento> = {
    campos: {
        id: { requerido: true, tipo: "texto" },
        coste: { requerido: true, tipo: "numero" },
        nombre: { requerido: true, tipo: "texto" },
        evento_id: { requerido: true },
        trabajador_id: { requerido: true }
        // referencia: { requerido: true, validacion: (trabajadorEvento: NuevoTrabajadorEvento) => stringNoVacio(trabajadorEvento.referencia) },
    },
};

export const initEstadoTrabajadorEvento = (trabajadorEvento: TrabajadorEvento): EstadoModelo<TrabajadorEvento> =>
    initEstadoModelo(trabajadorEvento);

export const initEstadoTrabajadorEventoVacio = () => initEstadoTrabajadorEvento(trabajadorEventoVacio);