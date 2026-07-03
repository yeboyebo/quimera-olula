import { ProcesarContexto } from "@olula/lib/diseño.ts";
import { ejecutarListaProcesos, MetaModelo } from "@olula/lib/dominio.ts";
import { Modulo } from "../diseño.js";
import { getModulo, patchModulo } from "../infraestructura.js";
import { ContextoDetalleModulo, EstadoDetalleModulo } from "./diseño.js";

/**
 * Tipo para handlers del detalle
 */
type ProcesarDetalle = ProcesarContexto<EstadoDetalleModulo, ContextoDetalleModulo>;

/**
 * Alias de pipe para este contexto.
 * Permite encadenar procesadores de forma legible:
 *
 *   return pipeModulo(contexto, [
 *       refrescarModulo,
 *       'ABIERTO',
 *   ]);
 */
const pipeModulo = ejecutarListaProcesos<EstadoDetalleModulo, ContextoDetalleModulo>;

/**
 * Metadatos del formulario: validaciones y configuración de campos.
 *
 * Opciones de campo:
 *   - requerido: true|false
 *   - minimo / maximo: longitud mínima/máxima
 *   - tipo: "fecha" | "moneda" | ...
 *
 * Opciones de modelo:
 *   - editable: (modulo) => boolean  → deshabilita todos los campos si devuelve false
 *   - onChange: (modulo, campo, valor, otros?) => modulo  → side-effects entre campos
 */
export const metaModulo: MetaModelo<Modulo> = {
    campos: {
        nombre: { requerido: true, minimo: 3 },
        descripcion: { requerido: false },
        estado: { requerido: true },
    },
    editable: (modulo: Modulo) => modulo.estado === 'activo',
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
 * Refresca la cabecera desde la API.
 *
 * Patrón: después de una operación que modifica la entidad en el servidor,
 * volver a cargarla para tener el estado actualizado.
 * También emite el evento "modulo_cambiado" hacia el maestro para sincronizar la lista.
 */
export const refrescarModulo: ProcesarDetalle = async (contexto) => {
    const modulo = await getModulo(contexto.modulo.id);
    return [
        { ...contexto, modulo },
        [["modulo_cambiado", modulo]],  // propaga al maestro
    ];
};

/**
 * Guarda cambios en la API.
 * Se llama desde el auto-guardado de useModelo (ver DetalleModulo.tsx).
 */
export const guardarModulo = async (
    contexto: ContextoDetalleModulo,
    modulo: Modulo
): Promise<void> => {
    if (modulo.nombre !== contexto.modulo.nombre ||
        modulo.descripcion !== contexto.modulo.descripcion ||
        modulo.estado !== contexto.modulo.estado) {
        await patchModulo(modulo.id, modulo);
    }
};

/**
 * Carga el módulo desde la API y lo activa.
 * Se invoca cuando cambia el ID recibido por prop.
 */
export const cargarModulo: (_: string) => ProcesarDetalle =
    (idModulo) => async (contexto) => {
        const modulo = await getModulo(idModulo);
        return pipeModulo(contexto, [
            async (ctx) => ({ ...ctx, modulo }),
            'ABIERTO',
        ]);
    };

export const cargarContexto: ProcesarDetalle = async (contexto, payload) => {
    const idModulo = payload as string;
    if (idModulo) {
        return cargarModulo(idModulo)(contexto);
    }
    return { ...contexto, estado: 'INICIAL', modulo: moduloVacio() };
};
