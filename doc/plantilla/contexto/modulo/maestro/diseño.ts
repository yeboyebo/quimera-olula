import { MetaTabla } from "@olula/componentes/index.js";
import { ListaEntidades } from "@olula/lib/ListaEntidades.js";
import { Modulo } from "../diseño.ts";
import { render } from "sass";

/**
 * Estados posibles del maestro
 */
export type EstadoMaestroModulo = 'INICIAL' | 'CREANDO_MODULO';

/**
 * Contexto del maestro (listado de módulos)
 */
export type ContextoMaestroModulo = {
    estado: EstadoMaestroModulo;
    modulos: ListaEntidades<Modulo>; // ← ListaEntidades tiene: lista[], total, activo
};

/**
 * Metadatos para renderizar la tabla
 * Define qué columnas mostrar y cómo
 */
export const metaTablaModulo: MetaTabla<Modulo> = [
    { id: 'id', cabecera: 'ID' },
    { id: 'nombre', cabecera: 'Nombre' },
    { id: 'descripcion', cabecera: 'Descripción' },
    {
        id: 'estado',
        cabecera: 'Estado',
        render: (m: Modulo) => (
            <span className= {`estado-${m.estado}`
    } >
    { m.estado }
    </span>
        ),
    },
{
    id: 'fecha_creacion',
        cabecera: 'Creado',
            render: (m: Modulo) => m.fecha_creacion.toLocaleDateString(),
    },
];
