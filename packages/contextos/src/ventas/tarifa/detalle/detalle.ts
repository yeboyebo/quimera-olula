import { ProcesarContexto } from "@olula/lib/diseño.ts";
import { ejecutarListaProcesos, MetaModelo } from "@olula/lib/dominio.ts";
import {
    accionesListaEntidades,
    listaEntidadesInicial,
    ProcesarListaEntidades,
} from "@olula/lib/ListaEntidades.js";
import { ArticuloTarifa, Tarifa } from "../diseño.js";
import { getArticulosTarifa, getTarifa, patchTarifa } from "../infraestructura.js";
import { ContextoDetalleTarifa, EstadoDetalleTarifa } from "./diseño.js";

/**
 * Tipo para handlers del detalle
 */
type ProcesarDetalle = ProcesarContexto<EstadoDetalleTarifa, ContextoDetalleTarifa>;

const pipeTarifa = ejecutarListaProcesos<EstadoDetalleTarifa, ContextoDetalleTarifa>;

const conArticulos = (fn: ProcesarListaEntidades<ArticuloTarifa>) =>
    (ctx: ContextoDetalleTarifa) => ({ ...ctx, articulos: fn(ctx.articulos) });

export const Articulos = accionesListaEntidades(conArticulos);

/**
 * Metadatos del formulario de cabecera.
 */
export const metaTarifa: MetaModelo<Tarifa> = {
    campos: {
        nombre: { requerido: true, minimo: 1 },
        divisaId: { requerido: false },
    },
};

export const tarifaVacia = (): Tarifa => ({
    id: '',
    nombre: '',
    divisaId: '',
    divisa: '',
});

export const contextoDetalleTarifaInicial: ContextoDetalleTarifa = {
    estado: 'INICIAL',
    tarifa: tarifaVacia(),
    articulos: listaEntidadesInicial<ArticuloTarifa>(),
};

/**
 * Refresca la cabecera desde la API y propaga el cambio al maestro.
 */
export const refrescarTarifa: ProcesarDetalle = async (contexto) => {
    const tarifa = await getTarifa(contexto.tarifa.id);
    return [
        { ...contexto, tarifa },
        [["tarifa_cambiada", tarifa]],  // propaga al maestro
    ];
};

/**
 * Refresca solo los artículos de la tarifa.
 *
 * Desviación respecto a la plantilla de módulo con líneas: allí cada operación
 * sobre una línea recarga también la cabecera, porque la cabecera lleva totales
 * calculados a partir de las líneas. La cabecera de una tarifa (nombre y divisa)
 * no depende de sus artículos, así que refrescarla en cada alta o cambio de
 * precio sería una llamada de más y emitiría un "tarifa_cambiada" espurio hacia
 * el maestro. Además los artículos viven en un endpoint propio
 * (`/ventas/articulo_tarifa`), no embebidos en la tarifa, así que son dos
 * llamadas independientes de todas formas.
 */
export const refrescarArticulos: ProcesarDetalle = async (contexto) => {
    const { datos, total } = await getArticulosTarifa(contexto.tarifa.id);
    return {
        ...contexto,
        articulos: {
            ...contexto.articulos,   // preserva activo
            lista: datos,
            total,
        },
    };
};

/**
 * Guarda cambios de cabecera en la API.
 * Se llama desde el auto-guardado de useModelo (ver DetalleTarifa.tsx).
 */
export const guardarTarifa = async (
    contexto: ContextoDetalleTarifa,
    tarifa: Tarifa
): Promise<void> => {
    if (tarifa.nombre !== contexto.tarifa.nombre ||
        tarifa.divisaId !== contexto.tarifa.divisaId) {
        await patchTarifa(tarifa.id, tarifa);
    }
};

const activarArticuloPorId = (id: string) => async (contexto: ContextoDetalleTarifa) => {
    const articuloActivo = contexto.articulos.lista.find((a) => a.id === id) ?? null;
    return {
        ...contexto,
        articulos: { ...contexto.articulos, activo: articuloActivo },
    };
};

const activarArticuloPorIndice = (indice: number) => async (contexto: ContextoDetalleTarifa) => {
    const articulos = contexto.articulos.lista;
    const articuloActivo =
        articulos.length > 0
            ? indice >= 0 && indice < articulos.length
                ? articulos[indice]
                : articulos[articulos.length - 1]
            : null;
    return {
        ...contexto,
        articulos: { ...contexto.articulos, activo: articuloActivo },
    };
};

export const onArticuloCreado: ProcesarDetalle = async (contexto, payload) => {
    const idArticulo = payload as string;
    return pipeTarifa(contexto, [
        refrescarArticulos,
        activarArticuloPorId(idArticulo),
    ]);
};

export const onArticuloCambiado: ProcesarDetalle = async (contexto, payload) => {
    const articulo = payload as ArticuloTarifa;
    return pipeTarifa(contexto, [
        refrescarArticulos,
        activarArticuloPorId(articulo.id),
    ]);
};

export const onArticuloBorrado: ProcesarDetalle = async (contexto, payload) => {
    const idArticulo = payload as string;
    const indice = contexto.articulos.lista.findIndex((a) => a.id === idArticulo);
    return pipeTarifa(contexto, [
        refrescarArticulos,
        activarArticuloPorIndice(indice),
    ]);
};

/**
 * Carga la tarifa y sus artículos, y activa el detalle.
 * Se invoca cuando cambia el ID recibido por prop.
 */
const cargarTarifa: (_: string) => ProcesarDetalle =
    (idTarifa) => async (contexto) => {
        const tarifa = await getTarifa(idTarifa);
        const { datos, total } = await getArticulosTarifa(idTarifa);
        return pipeTarifa(contexto, [
            async (ctx) => ({
                ...ctx,
                tarifa,
                articulos: { lista: datos, total, activo: null },
            }),
            activarArticuloPorIndice(0),
            'ABIERTO',
        ]);
    };

export const cargarContexto: ProcesarDetalle = async (contexto, payload) => {
    const idTarifa = payload as string;
    if (idTarifa) {
        return cargarTarifa(idTarifa)(contexto);
    }
    return {
        ...contexto,
        estado: 'INICIAL',
        tarifa: tarifaVacia(),
        articulos: listaEntidadesInicial<ArticuloTarifa>(),
    };
};
