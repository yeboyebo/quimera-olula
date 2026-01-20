import { CuentaBanco } from "../../diseño.ts";

export type EstadoCuentasBanco = "lista" | "alta" | "edicion" | "confirmar_borrado";

export type ContextoCuentasBanco = {
    estado: EstadoCuentasBanco;
    cuentas: CuentaBanco[];
    cuentaActiva: CuentaBanco | null;
    cargando: boolean;
    clienteId: string;
};
