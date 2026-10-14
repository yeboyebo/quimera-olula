import { Criteria, Entidad, Modelo, RespuestaLista } from "@olula/lib/diseño.ts";

/**
 * Tarifa de venta: una lista de precios con nombre y divisa.
 *
 * Los precios por artículo (ArticuloTarifa) son un sub-recurso de la tarifa
 * desde el punto de vista del usuario, pero en la API son un recurso
 * independiente (`/ventas/articulo_tarifa`), no líneas embebidas dentro de
 * `/ventas/tarifa/<id>`. Por eso los tipos de función de abajo llevan solo el
 * id del artículo-tarifa, sin el id de la tarifa, salvo en el alta (donde hay
 * que decir a qué tarifa pertenece) y en la lectura (donde hay que filtrar).
 */
export interface Tarifa extends Entidad {
    id: string;
    nombre: string;
    divisaId: string;
    divisa: string;
}

/**
 * Alta de tarifa. El id lo genera el servidor (contador de 6 caracteres).
 * La divisa es opcional: si se omite, el servidor toma la de la empresa.
 */
export interface NuevaTarifa extends Modelo {
    nombre: string;
    divisaId: string;
}

export type CambiosTarifa = Partial<Tarifa>;

/**
 * Precio de un artículo dentro de una tarifa.
 */
export interface ArticuloTarifa extends Entidad {
    id: string;
    articuloId: string;
    descripcionArticulo: string;
    tarifaId: string;
    nombreTarifa: string;
    precio: number;
}

/**
 * Alta de artículo-tarifa. `descripcionArticulo` no viaja a la API: solo
 * alimenta el autocompletar de artículo mientras se rellena el formulario.
 */
export interface NuevoArticuloTarifa extends Modelo {
    articuloId: string;
    descripcionArticulo: string;
    precio: number;
}

/**
 * Solo el precio es modificable: mover un artículo de tarifa es borrar y crear,
 * porque el par (artículo, tarifa) es la clave lógica del recurso.
 */
export type CambiosArticuloTarifa = Partial<ArticuloTarifa>;

export type GetTarifa = (id: string) => Promise<Tarifa>;

export type GetTarifas = (criteria: Criteria) => RespuestaLista<Tarifa>;

export type PostTarifa = (nuevaTarifa: NuevaTarifa) => Promise<string>;

export type PatchTarifa = (id: string, cambios: CambiosTarifa) => Promise<void>;

export type DeleteTarifa = (id: string) => Promise<void>;

export type GetArticulosTarifa = (tarifaId: string) => RespuestaLista<ArticuloTarifa>;

export type PostArticuloTarifa = (
    tarifaId: string,
    nuevoArticuloTarifa: NuevoArticuloTarifa
) => Promise<string>;

export type PatchArticuloTarifa = (
    id: string,
    cambios: CambiosArticuloTarifa
) => Promise<void>;

export type DeleteArticuloTarifa = (id: string) => Promise<void>;
