import { Criteria, ProcesarContexto } from "@olula/lib/diseño.ts";
import {
    accionesListaActivaEntidades,
    ProcesarListaActivaEntidades,
} from "@olula/lib/ListaActivaEntidades.ts";
import { Articulo } from "../diseño.ts";
import { getArticulo, getArticulos } from "../infraestructura.ts";
import { ContextoMaestroArticulo, EstadoMaestroArticulo } from "./diseño.ts";

type ProcesarMaestro = ProcesarContexto<EstadoMaestroArticulo, ContextoMaestroArticulo>;

const conArticulos = (fn: ProcesarListaActivaEntidades<Articulo>) =>
    (ctx: ContextoMaestroArticulo) => ({ ...ctx, articulos: fn(ctx.articulos) });

export const Articulos = accionesListaActivaEntidades(conArticulos);

export const recargarArticulos: ProcesarMaestro = async (contexto, payload) => {
    const criteria = payload as Criteria;
    const resultado = await getArticulos(criteria);
    return Articulos.recargar(contexto, resultado);
};

export const ampliarArticulos: ProcesarMaestro = async (contexto, payload) => {
    const criteria = payload as Criteria;
    const resultado = await getArticulos(criteria);
    return Articulos.ampliar(contexto, resultado);
};

export const incluirArticuloCreadoPorId: ProcesarMaestro = async (contexto, payload) => {
    const id = payload as string;
    const articulo = await getArticulo(id);
    return {
        ...contexto,
        estado: "INICIAL",
        articulos: {
            ...contexto.articulos,
            lista: [articulo, ...contexto.articulos.lista],
            total: contexto.articulos.total + 1,
            activo: articulo.id,
        },
    };
};
