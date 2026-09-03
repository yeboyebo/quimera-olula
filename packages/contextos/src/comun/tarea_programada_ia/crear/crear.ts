import { MetaModelo } from "@olula/lib/dominio.js";
import { expresionCronDesdeProgramacion, expresionCronValida, programacionVacia } from "../dominio.js";
import { NuevoIaTareaProgramada } from "../diseño.js";
import { stringNoVacio } from "@olula/lib/dominio.js";

/**
 * Constante (no función) para evitar que useModelo resetee el formulario
 * en cada render: ver patrón "formularios de alta" en la guía del proyecto.
 *
 * `expresionCron` arranca ya con la traducción de `programacionVacia` (no con
 * "") para que coincida desde el primer render con lo que SelectorProgramacion
 * muestra seleccionado por defecto — si no, el formulario parecería inválido
 * sin motivo visible hasta que el usuario tocase el selector.
 */
export const nuevaIaTareaProgramadaVacia: NuevoIaTareaProgramada = {
    nombre: "",
    iaFlujoId: "",
    expresionCron: expresionCronDesdeProgramacion(programacionVacia),
    activo: true,
    credencialIds: [],
};

export const metaNuevaIaTareaProgramada: MetaModelo<NuevoIaTareaProgramada> = {
    campos: {
        nombre: {
            requerido: true,
            validacion: (m: NuevoIaTareaProgramada) => stringNoVacio(m.nombre),
        },
        iaFlujoId: {
            requerido: true,
            validacion: (m: NuevoIaTareaProgramada) => stringNoVacio(m.iaFlujoId),
        },
        expresionCron: {
            requerido: true,
            validacion: (m: NuevoIaTareaProgramada) => expresionCronValida(m.expresionCron),
        },
    },
};
