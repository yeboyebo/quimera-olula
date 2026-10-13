import "./qcargando.css";

type QCargandoProps = {
    visible: boolean;
    mensaje?: string;
};

export const QCargando = ({ visible, mensaje = "Cargando..." }: QCargandoProps) => {
    if (!visible) return null;

    return (
        <quimera-cargando>
            <div role="status">
                <div />
                <p>{mensaje}</p>
            </div>
        </quimera-cargando>
    );
};
