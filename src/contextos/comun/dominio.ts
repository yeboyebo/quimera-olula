import { Entidad } from "./diseño.ts";

export const actualizarEntidadEnLista = <T extends Entidad>(entidades: T[], entidad: T): T[] => {
    return entidades.map(e => {
        return e.id === entidad.id ? entidad : e
    });
}

export const refrescarSeleccionada = <T extends Entidad>(entidades: T[], id: string, setSeleccionada: (e: T | null) => void) => {
    const nuevaSeleccionada = entidades.find((e) => e.id === id);
    setSeleccionada(nuevaSeleccionada ? nuevaSeleccionada : null);
}