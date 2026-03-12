import { MetaModelo, stringNoVacio } from "@olula/lib/dominio.ts";
import { NuevoAlmacen } from "./diseño";

// export const nuevoAlmacenVacio: Partial<Almacen> = {
export const nuevoAlmacenVacio: NuevoAlmacen = {
    id: "",
    nombre: "",
};

export const metaNuevoAlmacen: MetaModelo<NuevoAlmacen> = {
    campos: {
        id: { requerido: true, validacion: (m) => stringNoVacio(m.id || "") },
        nombre: { requerido: true, validacion: (m) => stringNoVacio(m.nombre || "") },
    },
};
