import { MetaTabla } from "@olula/componentes/index.js";
import { ListaActivaEntidades } from "@olula/lib/ListaActivaEntidades.js";
import { Modulo } from "../diseño.ts";

/**
 * Estados posibles del maestro
 */
export type EstadoMaestroModulo = 'INICIAL';

/**
 * Contexto del maestro (listado de módulos)
 *
 * Usa ListaActivaEntidades (no ListaEntidades) para soportar:
 *   - paginación incremental (ampliar)
 *   - cambio de criteria (filtrar)
 *   - activo: string | undefined  → solo guarda el ID, no la entidad
 *   - criteria: Criteria           → guarda filtros/orden/paginación actuales
 */
export type ContextoMaestroModulo = {
    estado: EstadoMaestroModulo;
    modulos: ListaActivaEntidades<Modulo>;
};

/**
 * Metadatos para renderizar la tabla.
 *
 * Opciones de columna:
 *   - Sin nada extra     → renderiza el valor tal cual
 *   - tipo: "fecha"      → formatea como fecha
 *   - tipo: "moneda"     → formatea como moneda con divisa
 *   - render: (m) => ... → render personalizado; si usa JSX mover metaTabla a un .tsx
 */
export const metaTablaModulo: MetaTabla<Modulo> = [
    { id: 'id', cabecera: 'ID' },
    { id: 'nombre', cabecera: 'Nombre' },
    { id: 'descripcion', cabecera: 'Descripción' },
    {
        id: 'estado',
        cabecera: 'Estado',
        render: (m: Modulo) => m.estado.toUpperCase(),
    },
    {
        id: 'fecha_creacion',
        cabecera: 'Creado',
        tipo: 'fecha',
    },
];
