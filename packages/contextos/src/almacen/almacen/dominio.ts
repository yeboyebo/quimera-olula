import { MetaTabla } from "@olula/componentes/atomos/qtabla.tsx";
import { MetaModelo, stringNoVacio } from "@olula/lib/dominio.ts";
import { Almacen, NuevoAlmacen } from "./diseño";

export const almacenVacio: Almacen = {
    id: "",
    nombre: "",
};

export const metaAlmacen: MetaModelo<Almacen> = {
    campos: {
        id: { requerido: true, validacion: (m: Almacen) => stringNoVacio(m.id) },
        nombre: { requerido: true, validacion: (m: Almacen) => stringNoVacio(m.nombre) }
    },
};

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

export const metaTablaAlmacen: MetaTabla<Almacen> = [
    { id: "id", cabecera: "Código Almacén" },
    { id: "nombre", cabecera: "Nombre" },
];
