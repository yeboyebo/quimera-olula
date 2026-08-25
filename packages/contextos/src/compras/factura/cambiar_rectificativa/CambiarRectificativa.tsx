import { FacturaCompra } from "#/compras/comun/componentes/factura.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QModal } from "@olula/componentes/index.js";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useForm } from "@olula/lib/useForm.ts";
import { useCallback, useState } from "react";
import { Factura } from "../diseño.ts";

/**
 * Marca la factura como rectificativa de otra. El servidor guarda además el
 * código de la factura rectificada, así que la lectura devuelve las dos cosas.
 * Dejando el campo vacío se quita la rectificación.
 */
export const CambiarRectificativa = ({
    factura,
    publicar,
}: {
    factura: Factura;
    publicar: EmitirEvento;
}) => {
    const [rectificativaId, setRectificativaId] = useState(factura.rectificativaId ?? "");
    const [codigo, setCodigo] = useState(factura.codigoRectificativa ?? "");

    const cambiar_ = useCallback(
        async () => publicar("rectificativa_cambiada", rectificativaId || null),
        [publicar, rectificativaId]
    );

    const cancelar_ = useCallback(
        () => publicar("cambio_rectificativa_cancelado"),
        [publicar]
    );

    const [cambiar, cancelar] = useForm(cambiar_, cancelar_);

    // Una factura no puede rectificarse a sí misma: el servidor responde 400.
    const esLaPropiaFactura = rectificativaId === factura.id;

    return (
        <QModal
            abierto={true}
            nombre="cambiarRectificativaCompra"
            titulo="Factura rectificativa"
            onCerrar={cancelar}
        >
            <div className="CambiarRectificativa">
                <quimera-formulario>
                    <FacturaCompra
                        label="Rectifica a la factura"
                        nombre="rectificativaId"
                        valor={rectificativaId}
                        descripcion={codigo}
                        onChange={(opcion) => {
                            setRectificativaId(opcion?.valor ?? "");
                            setCodigo(opcion?.descripcion ?? "");
                        }}
                    />
                </quimera-formulario>
                <div className="botones maestro-botones">
                    <QBoton onClick={cambiar} deshabilitado={esLaPropiaFactura}>
                        Guardar
                    </QBoton>
                </div>
            </div>
        </QModal>
    );
};
