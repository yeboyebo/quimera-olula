import { Entidad, ListaSeleccionable } from "./diseño.ts";

type OpcionesIncluirEnLista = {
    activar?: boolean;
}
export const listaSeleccionableVacia = <E extends Entidad>() => {
    const lista: ListaSeleccionable<E> = {
        lista: [],
        idActivo: null,
    };
    return lista;
};


export const incluirEnLista = <E extends Entidad>(entidad: E, { activar = true }: OpcionesIncluirEnLista) =>
    (listaS: ListaSeleccionable<E>): ListaSeleccionable<E> => {
        return {
            lista: [...listaS.lista, entidad],
            idActivo: activar ? entidad.id : listaS.idActivo,
        };
    }



export const quitarDeLista = <E extends Entidad>(id: string) =>
    (listaS: ListaSeleccionable<E>): ListaSeleccionable<E> => {
        return {
            lista: listaS.lista.filter(e => e.id !== id),
            idActivo: listaS.idActivo === id ? null : listaS.idActivo,
        };
    }

export const cargarLista = <E extends Entidad>(entidades: E[]) =>
    (_: ListaSeleccionable<E>): ListaSeleccionable<E> => {
        return {
            lista: entidades,
            idActivo: null,
        };
    }

export const seleccionarItemEnLista = <E extends Entidad>(entidad: E) =>
    (listaS: ListaSeleccionable<E>): ListaSeleccionable<E> => {
        return {
            ...listaS,
            idActivo: entidad.id,
        };
    }


export const cambiarItemEnLista = <E extends Entidad>(entidad: E) =>
    (listaS: ListaSeleccionable<E>): ListaSeleccionable<E> => {
        const lista = listaS.lista.map(e => e.id === entidad.id ? entidad : e);
        return {
            ...listaS,
            lista,
        };
    }



export const getSeleccionada = <E extends Entidad>(listaS: ListaSeleccionable<E>): E | null => {
    if (listaS.idActivo) {
        return listaS.lista.find(e => e.id === listaS.idActivo) || null;
    }
    return null;
}