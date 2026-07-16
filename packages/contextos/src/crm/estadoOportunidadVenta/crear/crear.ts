import { MetaModelo, stringNoVacio } from "@olula/lib/dominio.js";
import { NuevoEstadoOportunidad } from "./diseño.ts";

export const metaNuevoEstadoOportunidad: MetaModelo<NuevoEstadoOportunidad> = {
    campos: {
        descripcion: { requerido: true, validacion: (estado: NuevoEstadoOportunidad) => stringNoVacio(estado.descripcion) },
        probabilidad: { requerido: true, tipo: "numero" },
    },
};

export const nuevoEstadoOportunidadVacio: NuevoEstadoOportunidad = {
    id: '',
    descripcion: '',
    probabilidad: 0,
    valorDefecto: false,
};