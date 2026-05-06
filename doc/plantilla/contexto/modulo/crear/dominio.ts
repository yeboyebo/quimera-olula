import { MetaModelo } from "@olula/lib/dominio.js";
import { NuevoModulo } from "../diseño.ts";

/**
 * Metadatos para formulario de creación (puede ser diferente a edición)
 */
export const metaNuevoModulo: MetaModelo<NuevoModulo> = {
    campos: {
        nombre: { requerido: true, minimo: 3 },
        descripcion: { requerido: false },
        estado: { requerido: true },
        fecha_creacion: { bloqueado: true }, // Se establece automáticamente
    },
};

/**
 * Valor inicial vacío
 */
export const nuevoModuloVacio = (): NuevoModulo => ({
    nombre: '',
    descripcion: '',
    estado: 'activo',
    fecha_creacion: new Date(),
});
