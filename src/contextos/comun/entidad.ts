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

export const incluirEnLista = <E extends Entidad>(listaS: ListaSeleccionable<E>, entidad: E, { activar = true }: OpcionesIncluirEnLista): ListaSeleccionable<E> => {
    return {
        lista: [...listaS.lista, entidad],
        idActivo: activar ? entidad.id : listaS.idActivo,
    };
}

export const quitarDeLista = <E extends Entidad>(listaS: ListaSeleccionable<E>, id: string): ListaSeleccionable<E> => {
    return {
        lista: listaS.lista.filter(e => e.id !== id),
        idActivo: listaS.idActivo === id ? null : listaS.idActivo,
    };
}

export const cargarLista = <E extends Entidad>(entidades: E[]): ListaSeleccionable<E> => {
    return {
        lista: entidades,
        idActivo: null,
    };
}

export const seleccionarItemEnLista = <E extends Entidad>(listaS: ListaSeleccionable<E>, entidad: E): ListaSeleccionable<E> => {
    return {
        ...listaS,
        idActivo: entidad.id,
    };
}