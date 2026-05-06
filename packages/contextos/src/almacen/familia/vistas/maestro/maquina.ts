import { Maquina } from "@olula/lib/diseño.ts";
import { ContextoMaestroFamilia, EstadoMaestroFamilia } from "./diseño.ts";
import { Familias, recargarFamilias } from "./dominio.ts";

export const getMaquina: () => Maquina<EstadoMaestroFamilia, ContextoMaestroFamilia> = () => ({
    INICIAL: {
        familia_cambiada: Familias.cambiar,
        familia_seleccionada: [Familias.activar],
        seleccion_cancelada: Familias.desactivar,
        familia_borrada: async (contexto) => {
            if (!contexto.familias.activo) {
                return contexto;
            }
            return Familias.quitar(contexto, contexto.familias.activo);
        },
        familia_creada: Familias.incluir,
        recarga_de_familias_solicitada: recargarFamilias,
        criteria_cambiado: [Familias.filtrar, recargarFamilias],
        crear: "CREANDO",
    },
    CREANDO: {
        familia_creada: [Familias.incluir, "INICIAL"],
        creacion_cancelada: "INICIAL",
    },
});
