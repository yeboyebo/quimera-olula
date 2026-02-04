import { ProcesarContexto } from "@olula/lib/diseño.ts";
import { MetaModelo } from "@olula/lib/dominio.js";
import { Modulo } from "../diseño.ts";
import { patchModulo } from "../infraestructura.ts";
import { ContextoDetalleModulo, EstadoDetalleModulo } from "./diseño.ts";

/**
 * Tipo para handlers del detalle
 */
type ProcesarDetalle = ProcesarContexto<EstadoDetalleModulo, ContextoDetalleModulo>;

/**
 * Metadatos del formulario: validaciones y configuración de campos
 */
export const metaModulo: MetaModelo<Modulo> = {
    campos: {
        nombre: { requerido: true, minimo: 3 },
        descripcion: { requerido: false },
        estado: { requerido: true },
    },
};

/**
 * Módulo vacío para inicialización
 */
export const moduloVacio = (): Modulo => ({
    id: '',
    nombre: '',
    descripcion: '',
    estado: 'activo',
    fecha_creacion: new Date(),
});

/**
 * Entrar en modo edición
 */
export const entrarEnEdicion: ProcesarDetalle = async (contexto) => {
    return { ...contexto, estado: 'EDITANDO' };
};

/**
 * Cancelar edición: volver al estado anterior
 */
export const cancelarEdicion: ProcesarDetalle = async (contexto) => {
    return {
        ...contexto,
        modulo: contexto.moduloInicial,
        estado: 'ABIERTO',
    };
};

/**
 * Guardar cambios en API y actualizar estado
 */
export const guardarModulo: ProcesarDetalle = async (contexto) => {
    await patchModulo(contexto.modulo.id, contexto.modulo);
    return {
        ...contexto,
        moduloInicial: contexto.modulo, // Actualizar referencia inicial
        estado: 'ABIERTO',
    };
};
