import "./qaviso.css";

type AvisoVariante = "advertencia" | "error" | "info";

interface QAvisoProps {
    variante?: AvisoVariante;
    className?: string;
}

/**
 * Banner de aviso a nivel de pantalla (no confundir con QEtiqueta, pensado
 * para una marca inline corta). Uso: pgvector no disponible en
 * MaestroConDetalleIaMemoria.tsx.
 */
export const QAviso = ({
    variante = "advertencia",
    className = "",
    children,
}: React.PropsWithChildren<QAvisoProps>) => {
    return (
        <div className={`q-aviso ${variante} ${className}`} role="alert">
            {children}
        </div>
    );
};
