/**
 * Contrato que debe implementar la UI de cada agregador bancario soportado
 * (Plaid, GoCardless...). Solo hay un proveedor activo por instalación (ver
 * `comun/banca.ts`); este registro permite que el resto de la aplicación
 * (conectar/reautenticar una conexión bancaria) sea agnóstico al proveedor.
 */
export type ConectarProveedorBancarioProps = {
    /** Lo que devolvió `POST tesoreria/conexion_bancaria/iniciar` para este proveedor. */
    datos: Record<string, unknown>;
    /** El widget del proveedor completó el flujo: lo que haya que mandar al backend. */
    onCompletado: (datos: Record<string, unknown>) => void;
    /** El usuario cerró o abandonó el widget del proveedor. */
    onCancelado: () => void;
};

export interface ProveedorBancarioUI {
    /**
     * No renderiza UI propia: abre el widget del proveedor (overlay, iframe...)
     * y traduce su resultado a `onCompletado`/`onCancelado`.
     */
    Conectar: (props: ConectarProveedorBancarioProps) => null;
}

export type RegistroProveedoresBancarios = Record<string, ProveedorBancarioUI>;
