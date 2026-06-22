import { ProcesarContexto } from "@olula/lib/diseño.ts";
import { MetaModelo, stringNoVacio } from "@olula/lib/dominio.ts";
import { Ubicacion } from "../../diseño.ts";
import { getUbicacion } from "../../infraestructura.ts";
import { ContextoUbicacion, EstadoUbicacion } from "./diseño.ts";

type ProcesarUbicacion = ProcesarContexto<EstadoUbicacion, ContextoUbicacion>;

export const ubicacionVacia = (): Ubicacion => ({
    id: "",
    almacenId: "",
});

export const metaUbicacion: MetaModelo<Ubicacion> = {
    campos: {
        id: { requerido: true, validacion: (m: Ubicacion) => stringNoVacio(m.id) },
        almacenId: { requerido: true, validacion: (m: Ubicacion) => stringNoVacio(m.almacenId) },
    },
};

export const cargarContexto: ProcesarUbicacion = async (contexto, payload) => {
    const id = payload as string;
    if (!id) return { ...contexto, estado: "INICIAL", ubicacion: ubicacionVacia(), ubicacionInicial: ubicacionVacia() };

    const ubicacion = await getUbicacion(id);
    return {
        ...contexto,
        estado: "Editando",
        ubicacion,
        ubicacionInicial: ubicacion,
    };
};

export const refrescarUbicacion: ProcesarUbicacion = async (contexto) => {
    const ubicacion = await getUbicacion(contexto.ubicacion.id);
    return [
        {
            ...contexto,
            ubicacion: {
                ...contexto.ubicacion,
                ...ubicacion,
            },
        },
        [["ubicacion_cambiada", ubicacion]],
    ];
};

export const cancelarEdicion: ProcesarUbicacion = async (ctx) => ({
    ...ctx,
    ubicacion: ctx.ubicacionInicial,
});
