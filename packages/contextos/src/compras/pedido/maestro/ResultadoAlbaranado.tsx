import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QModal } from "@olula/componentes/moleculas/qmodal.tsx";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useNavigate } from "react-router";
import { AlbaranCreado } from "../../albaran/diseño.ts";

export const ResultadoAlbaranado = ({
    albaran,
    publicar,
}: {
    albaran: AlbaranCreado;
    publicar: EmitirEvento;
}) => {
    const navigate = useNavigate();

    const cerrar = () => publicar("resultado_albaranado_cerrado");

    return (
        <QModal
            nombre="resultadoAlbaranadoCompra"
            abierto={true}
            titulo="Albarán generado"
            onCerrar={cerrar}
        >
            <div className="mensaje">
                {`Se ha generado el albarán ${albaran.codigo} con lo pendiente de los pedidos seleccionados.`}
            </div>
            <div className="botones">
                <QBoton
                    onClick={() => navigate(`/compras/albaran?id=${albaran.id}`)}
                >
                    {`Ir al albarán ${albaran.codigo}`}
                </QBoton>
                <QBoton variante="texto" onClick={cerrar}>
                    Cerrar
                </QBoton>
            </div>
        </QModal>
    );
};
