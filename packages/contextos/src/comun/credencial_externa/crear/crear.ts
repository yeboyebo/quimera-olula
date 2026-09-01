import { MetaModelo, stringNoVacio } from "@olula/lib/dominio.js";
import { NuevaCredencialExterna } from "../diseño.js";

/**
 * Constantes (no funciones) para evitar que useModelo resetee el formulario
 * en cada render — ver el patrón de "modeloInicial estable" en useModelo.ts.
 * `empresaId` se rellena con el selector con búsqueda `Empresa` (ver
 * ../../componentes/empresa.tsx), no como texto libre.
 *
 * Hay dos variantes según desde qué sección se abre el alta (ver
 * CrearCredencialExterna.tsx, prop `categoriaFiltro`): la de LLM arranca con
 * "Gemini" preseleccionado (hoy es la única opción); la de conectores arranca
 * vacía para forzar a elegir uno.
 */
export const nuevaCredencialExternaVaciaLlm: NuevaCredencialExterna = {
    empresaId: "",
    nombre: "",
    proveedor: "Gemini",
    tipoAuth: "api_key",
    personal: false,
    categoria: "llm",
};

export const nuevaCredencialExternaVaciaConector: NuevaCredencialExterna = {
    empresaId: "",
    nombre: "",
    proveedor: "",
    tipoAuth: "api_key",
    personal: false,
    categoria: "conector",
};

export const metaNuevaCredencialExterna: MetaModelo<NuevaCredencialExterna> = {
    campos: {
        empresaId: {
            requerido: true,
            validacion: (m: NuevaCredencialExterna) => stringNoVacio(m.empresaId),
        },
        nombre: {
            requerido: true,
            validacion: (m: NuevaCredencialExterna) => stringNoVacio(m.nombre),
        },
        proveedor: {
            requerido: true,
            validacion: (m: NuevaCredencialExterna) => stringNoVacio(m.proveedor),
        },
    },
};
