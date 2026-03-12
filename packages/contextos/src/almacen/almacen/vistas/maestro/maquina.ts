import { Maquina } from "@olula/lib/diseño.ts";
import { ContextoMaestroAlmacen, EstadoMaestroAlmacen } from "./diseño.ts";
import { Almacenes, recargarAlmacenes } from "./dominio.ts";

export const getMaquina: () => Maquina<EstadoMaestroAlmacen, ContextoMaestroAlmacen> = () => ({
    INICIAL: {
        almacen_cambiado: Almacenes.cambiar,
        almacen_seleccionado: [Almacenes.activar],
        seleccion_cancelada: Almacenes.desactivar,
        almacen_borrado: async (contexto) => {
            if (!contexto.almacenes.activo) {
                return contexto;
            }
            return Almacenes.quitar(contexto, contexto.almacenes.activo);
        },
        almacen_creado: Almacenes.incluir,
        recarga_de_almacenes_solicitada: recargarAlmacenes,
        criteria_cambiado: [Almacenes.filtrar, recargarAlmacenes],
        crear: "CREANDO",
    },
    CREANDO: {
        almacen_creado: [Almacenes.incluir, "INICIAL"],
        creacion_cancelada: "INICIAL",
    },
});
