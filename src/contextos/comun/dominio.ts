import { Direccion, Entidad } from "./diseño.ts";

export const actualizarEntidadEnLista = <T extends Entidad>(entidades: T[], entidad: T): T[] => {
    return entidades.map(e => {
        return e.id === entidad.id ? entidad : e
    });
}

export const quitarEntidadDeLista = <T extends Entidad>(lista: T[], elemento: T): T[] => {
    return lista.filter((e) => e.id !== elemento.id);
}


export const refrescarSeleccionada = <T extends Entidad>(entidades: T[], id: string | undefined, setSeleccionada: (e: T | null) => void) => {
    const nuevaSeleccionada = id
        ? entidades.find((e) => e.id === id)
        : null
    setSeleccionada(nuevaSeleccionada ? nuevaSeleccionada : null);
}

export const direccionCompleta = (valor: Direccion) => `${valor.tipo_via ? (valor.tipo_via + ' ') : ''} ${valor.nombre_via}, ${valor.ciudad}`;

export const boolAString = (valor: boolean) => valor ? "Sí" : "No";

export const stringNoVacio = (valor: string) => valor.length > 0;