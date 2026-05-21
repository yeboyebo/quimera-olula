import { Criteria, Maquina, ProcesarContexto } from "@olula/lib/diseño.js";
import {
    accionesListaActivaEntidades,
    ListaActivaEntidades,
    ProcesarListaActivaEntidades,
} from "@olula/lib/ListaActivaEntidades.js";
import { Articulo } from "../diseño.ts";
import { getArticulos } from "../infraestructura.ts";

export type EstadoMaestroArticulo = "INICIAL" | "CREANDO_ARTICULO";

export type ContextoMaestroArticulo = {
    estado: EstadoMaestroArticulo;
    articulos: ListaActivaEntidades<Articulo>;
};

type ProcesarMaestroArticulo = ProcesarContexto<EstadoMaestroArticulo, ContextoMaestroArticulo>;

const conArticulos =
    (fn: ProcesarListaActivaEntidades<Articulo>) =>
        (ctx: ContextoMaestroArticulo) => ({ ...ctx, articulos: fn(ctx.articulos) });

const Articulos = accionesListaActivaEntidades(conArticulos);

const recargarArticulos: ProcesarMaestroArticulo = async (contexto, payload) => {
    const criteria = payload as Criteria;
    const resultado = await getArticulos(criteria.filtro, criteria.orden, criteria.paginacion);
    return Articulos.recargar(contexto, resultado);
};

const ampliarArticulos: ProcesarMaestroArticulo = async (contexto, payload) => {
    const criteria = payload as Criteria;
    const resultado = await getArticulos(criteria.filtro, criteria.orden, criteria.paginacion);
    return Articulos.ampliar(contexto, resultado);
};

const retirarArticuloActivo: ProcesarMaestroArticulo = async (contexto) => {
    return Articulos.quitar(contexto, contexto.articulos.activo);
};

export const getMaquina: () => Maquina<EstadoMaestroArticulo, ContextoMaestroArticulo> = () => ({
    INICIAL: {
        articulo_cambiado: Articulos.cambiar,
        articulo_seleccionado: [Articulos.activar],
        articulo_deseleccionado: Articulos.desactivar,
        articulo_borrado: retirarArticuloActivo,
        articulo_creado: Articulos.incluir,
        recarga_de_articulos_solicitada: recargarArticulos,
        criteria_cambiado: [Articulos.filtrar, recargarArticulos],
        siguiente_pagina: [Articulos.filtrar, ampliarArticulos],
        seleccion_cancelada: Articulos.desactivar,
        cancelar_seleccion: Articulos.desactivar,
        creacion_solicitada: "CREANDO_ARTICULO",
    },
    CREANDO_ARTICULO: {
        articulo_creado: [Articulos.incluir, "INICIAL"],
        creacion_cancelada: "INICIAL",
    },
});
