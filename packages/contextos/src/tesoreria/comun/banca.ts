import { plugin } from "@olula/lib/dominio.ts";

/**
 * Valores de `plugins.banca` (whoami) que equivalen a "sin integración
 * bancaria activa". El backend puede devolver el nombre del proveedor en
 * minúsculas (p.ej. "plaid") o uno de estos estados.
 */
const SIN_PROVEEDOR = ["", "inactivo", "noconfigurado"];

/**
 * Nombre del proveedor bancario activo en esta instalación (p.ej. "plaid"),
 * o `null` si el plugin `banca` está inactivo o sin configurar. Solo puede
 * haber un proveedor activo a la vez.
 */
export const proveedorBancario = (): string | null => {
    const nombre = plugin("banca");
    return SIN_PROVEEDOR.includes(nombre) ? null : nombre;
};

/** Atajo para saber si hay que mostrar las funciones ligadas a un banco conectado. */
export const bancaActiva = (): boolean => proveedorBancario() !== null;

/** IBAN en grupos de 4 para leerlo sin equivocarse: "ES91 2100 0418 …". */
export const ibanLegible = (iban: string): string =>
    iban.replace(/\s+/g, "").toUpperCase().replace(/(.{4})(?=.)/g, "$1 ");
