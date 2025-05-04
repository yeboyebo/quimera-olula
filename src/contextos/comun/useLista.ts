import { useCallback, useState } from "react";
import { Entidad } from "./diseño.ts";

type HookLista<E extends Entidad> = {
    lista: E[],
    setLista: (lista: E[]) => void,
    añadir: (entidad: E) => void,
    eliminar: (entidad: E) => void,
    modificar: (entidad: E) => void,
    seleccionar: (entidad: E) => void,
    limpiarSeleccion: () => void,
    seleccionada: E | null,
}

export function useLista<E extends Entidad>(
    listaInicial: E[],
): HookLista<E> {
    console.log('useLista', listaInicial);
    const entidadSeleccionada = listaInicial.length > 0 ? listaInicial[0] : null;
    const [entidades, setEntidades] = useState<E[]>(listaInicial);
    const [seleccionada, setSeleccionada] = useState<E | null>(entidadSeleccionada);

    const añadir = useCallback((entidad: E) => {
        setEntidades([...entidades, entidad]);
        setSeleccionada(entidad);
    }, [entidades, setEntidades]);

    const seleccionar = useCallback((entidad: E) => {
        setSeleccionada(entidad);
    }, [setSeleccionada]);

    const limpiarSeleccion = useCallback(() => {
        setSeleccionada(null);
    }, [setSeleccionada]);

    const modificar = useCallback((entidad: E) => {
        const listaModificada = entidades.map((e) => (e.id === entidad.id ? entidad : e));
        setEntidades(listaModificada);
        setSeleccionada(entidad);
    }, [entidades, setEntidades]);

    const eliminar = useCallback((entidad: E) => {
        const listaModificada = entidades.filter((e) => e.id !== entidad.id);
        const nuevaSeleccionada = entidadSeleccionadaTrasEliminacion(entidad);
        setEntidades(listaModificada);
        setSeleccionada(nuevaSeleccionada);
    }, [entidades, setEntidades]);

    const entidadSeleccionadaTrasEliminacion = (entidadAEliminar: E) => {
        const indice = indiceEntidad(entidadAEliminar);
        if (indice == -1) {
            return null;
        }
        const longitud = entidades.length;
        return longitud > indice + 1 ? entidades[indice + 1] : (indice > 0 ? entidades[indice - 1] : null);
    }
    const indiceEntidad = (entidad: E) => {
        return entidades.findIndex((e) => e.id === entidad.id);
    }
    const setLista = useCallback((lista: E[]) => {
        setEntidades(lista);
        const indiceSeleccionada = seleccionada
            ? lista.findIndex((e) => e.id === seleccionada.id)
            : -1;
        setSeleccionada(indiceSeleccionada === -1 ? (lista[0] || null) : lista[indiceSeleccionada]);
    }, [setEntidades]);

    return {
        lista: entidades,
        setLista,
        añadir,
        modificar,
        eliminar,
        seleccionar,
        limpiarSeleccion,
        seleccionada
    }
}