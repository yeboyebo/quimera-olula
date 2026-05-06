import { ProcesarContexto } from "@olula/lib/diseño.ts";
import { MetaModelo, stringNoVacio } from "@olula/lib/dominio.ts";
import { Almacen } from "../../diseño.ts";
import { getAlmacen } from "../../infraestructura.ts";
import { ContextoAlmacen, EstadoAlmacen } from "./diseño.ts";

type ProcesarAlmacen = ProcesarContexto<EstadoAlmacen, ContextoAlmacen>;

export const almacenVacio = (): Almacen => ({
    id: "",
    nombre: "",
});

export const metaAlmacen: MetaModelo<Almacen> = {
    campos: {
        id: { requerido: true, validacion: (m: Almacen) => stringNoVacio(m.id) },
        nombre: { requerido: true, validacion: (m: Almacen) => stringNoVacio(m.nombre) },
    },
};

export const cargarContexto: ProcesarAlmacen = async (contexto, payload) => {
    const id = payload as string;
    if (!id) return { ...contexto, estado: "INICIAL", almacen: almacenVacio(), almacenInicial: almacenVacio() };

    const almacen = await getAlmacen(id);
    return {
        ...contexto,
        estado: "Editando",
        almacen,
        almacenInicial: almacen,
    };
};

export const refrescarAlmacen: ProcesarAlmacen = async (contexto) => {
    const almacen = await getAlmacen(contexto.almacen.id);
    return [
        {
            ...contexto,
            almacen: {
                ...contexto.almacen,
                ...almacen,
            },
        },
        [["almacen_cambiado", almacen]],
    ];
};

export const cancelarEdicion: ProcesarAlmacen = async (ctx) => ({
    ...ctx,
    almacen: ctx.almacenInicial,
});
