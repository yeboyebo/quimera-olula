export const formateaCategoria = (categoria: string) => categoria + "ª"

import { QIcono } from "@olula/componentes/index.js";





export const formateaEstado = (estado: string) => {
    switch (estado) {
        case "1": return QIcono(
            {
                nombre: "certification", // Son de https://www.iconbolt.com
                tamaño: "sm",
                color: "var(--color-error-oscuro)",
            });
        case "2": return QIcono(
            {
                nombre: "layer-plus",
                tamaño: "sm",
                color: "var(--color-advertencia-claro)",
            });
        case "3": return QIcono(
            {
                nombre: "layer",
                tamaño: "sm",
                color: "var(--color-exito-oscuro)",
            });
        //case "4": return "Para enviar";
        case "4": return QIcono(
            {
                nombre: "package",
                tamaño: "sm",
                color: "var(--color-error-oscuro)",
            });
        case "5": return QIcono(
            {
                nombre: "package",
                tamaño: "sm",
                color: "var(--color-exito-oscuro)",
            });
        /* case "5": return QIcono(
            {
                nombre: "truck",
                tamaño: "sm",
                color: "var(--color-exito-oscuro)",
            }); */

    }
}