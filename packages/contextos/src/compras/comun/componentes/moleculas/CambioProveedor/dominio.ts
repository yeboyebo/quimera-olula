import { Modelo } from "@olula/lib/diseño.ts";
import { MetaModelo } from "@olula/lib/dominio.ts";
import { CambioProveedor } from "./diseño.ts";

export const proveedorRegistrado = (proveedorId: string | null | undefined): boolean =>
    !!proveedorId && proveedorId !== "None";

export const metaCambioProveedor: MetaModelo<CambioProveedor & Modelo> = {
    campos: {
        proveedorId: { requerido: true },
    },
};

export const metaCambioProveedorNoRegistrado: MetaModelo<CambioProveedor & Modelo> = {
    campos: {
        nombreProveedor: { requerido: true, tipo: "texto" },
        idFiscal: { requerido: true, tipo: "texto" },
    },
};
