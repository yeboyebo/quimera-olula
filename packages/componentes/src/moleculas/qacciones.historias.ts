import { Historia, MetaHistorias } from "../historias/diseño.ts";
import { QuimeraAcciones } from "./qacciones.tsx";

const acciones = [
    {
        texto: "Nuevo",
        onClick: () => { },
        variante: "borde" as const,
    }, {
        texto: "Editar",
        onClick: () => { },
        variante: "borde" as const,
    },
    {
        texto: "Borrar",
        onClick: () => { },
        variante: "borde" as const,
        deshabilitado: true,
    }

];

export default {
    grupo: "atomos",
    titulo: "qacciones",
    attrs: {
        nombre: "acciones",
        vertical: "false",
        acciones
    },
    Componente: QuimeraAcciones
} as unknown as MetaHistorias;

export const Base: Historia = {
};
export const Vertical: Historia = {
    vertical: true,
};

