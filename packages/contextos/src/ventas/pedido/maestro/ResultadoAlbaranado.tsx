import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QModal } from "@olula/componentes/moleculas/qmodal.tsx";
import { EmitirEvento } from "@olula/lib/diseño.js";
import { FactoryCtx } from "@olula/lib/factory_ctx.tsx";
import { useContext } from "react";
import { useNavigate } from "react-router";

type UrlPorId = (id: string) => string;

export const ResultadoAlbaranado = ({
    publicar,
    creados,
    fallidos,
}: {
    publicar: EmitirEvento;
    creados: string[];
    fallidos: string[];
}) => {
    const navigate = useNavigate();
    const { app } = useContext(FactoryCtx);
    const urlAlbaran =
        (app.Ventas?.albaranar_url_albaran as UrlPorId | undefined) ??
        ((id: string) => `/ventas/albaran/${id}`);

    const cerrar = () => publicar("resultado_albaranado_cerrado");

    return (
        <QModal
            nombre="resultadoAlbaranado"
            abierto={true}
            titulo="Resultado del albaranado"
            onCerrar={cerrar}
        >
            <div className="mensaje" style={{ whiteSpace: "pre-line" }}>
                {creados.length === 0
                    ? "No se ha generado ningún albarán."
                    : creados.length === 1
                        ? "Se ha generado 1 albarán."
                        : `Se han generado ${creados.length} albaranes.`}
            </div>
            {creados.length > 0 && (
                <ul>
                    {creados.map((id) => (
                        <li key={id}>
                            <QBoton variante="texto" onClick={() => navigate(urlAlbaran(id))}>
                                Ir al albarán {id}
                            </QBoton>
                        </li>
                    ))}
                </ul>
            )}
            {fallidos.length > 0 && (
                <>
                    <div className="mensaje">No se han podido albaranar:</div>
                    <ul>
                        {fallidos.map((fallo, indice) => (
                            <li key={indice}>{fallo}</li>
                        ))}
                    </ul>
                </>
            )}
            <div className="botones">
                <QBoton onClick={cerrar}>Cerrar</QBoton>
            </div>
        </QModal>
    );
};
