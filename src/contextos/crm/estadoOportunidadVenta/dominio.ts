import { EstadoModelo, initEstadoModelo, MetaModelo, stringNoVacio } from "../../comun/dominio.ts";
import { EstadoOportunidad } from "./diseño.ts";

export const estadoOportunidadVacio: EstadoOportunidad = {
    id: '',
    descripcion: '',
    probabilidad: 0,
    valor_defecto: false,
};

export const metaEstadoOportunidad: MetaModelo<EstadoOportunidad> = {
    campos: {
        id: { requerido: true },
        descripcion: { requerido: true, validacion: (estado: EstadoOportunidad) => stringNoVacio(estado.descripcion), },
        probabilidad: { requerido: true, tipo: "numero" },
        valor_defecto: { requerido: true, tipo: "checkbox" },
    },
};

export const metaNuevoEstadoOportunidad: MetaModelo<EstadoOportunidad> = {
    campos: {
        descripcion: { requerido: true, validacion: (estado: EstadoOportunidad) => stringNoVacio(estado.descripcion) },
        probabilidad: { requerido: true, tipo: "numero" },
        valor_defecto: { requerido: true, tipo: "checkbox" },
    },
};

export const nuevoEstadoOportunidadVacio: EstadoOportunidad = {
    id: '',
    descripcion: '',
    probabilidad: 0,
    valor_defecto: false,
};

export const initEstadoEstadoOportunidad = (estado: EstadoOportunidad): EstadoModelo<EstadoOportunidad> =>
    initEstadoModelo(estado);

export const initEstadoEstadoOportunidadVacio = () => initEstadoEstadoOportunidad(estadoOportunidadVacio);
