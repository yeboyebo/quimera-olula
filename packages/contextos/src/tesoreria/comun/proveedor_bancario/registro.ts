import { ProveedorBancarioUI, RegistroProveedoresBancarios } from "./diseño.js";
import { ConectarPlaid } from "./plaid/ConectarPlaid.js";

/**
 * Registro de proveedores bancarios soportados. Añadir uno nuevo (GoCardless,
 * etc.) es crear su propia carpeta `proveedor_bancario/<nombre>/` con un
 * `Conectar` que cumpla `ProveedorBancarioUI` y darlo de alta aquí.
 */
export const proveedoresBancarios: RegistroProveedoresBancarios = {
    plaid: { Conectar: ConectarPlaid },
};

export const proveedorBancarioUI = (proveedor: string): ProveedorBancarioUI | null =>
    proveedoresBancarios[proveedor] ?? null;
