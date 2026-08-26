import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useForm } from "@olula/lib/useForm.ts";
import { useCallback } from "react";
import { Factura, LineaFactura } from "../diseño.ts";
import { etiquetaLinea } from "../dominio.ts";
import { borrarLineasFactura } from "../infraestructura.ts";

export const BorrarLineaFactura = ({
    factura,
    linea,
    publicar,
}: {
    factura: Factura;
    linea: LineaFactura;
    publicar: EmitirEvento;
}) => {
    const borrar_ = useCallback(async () => {
        await borrarLineasFactura(factura.id, [linea.id]);
        publicar("linea_borrada", linea.id);
    }, [factura.id, linea.id, publicar]);

    const cancelar_ = useCallback(
        () => publicar("borrado_de_linea_cancelado"),
        [publicar]
    );

    const [borrar, cancelar] = useForm(borrar_, cancelar_);

    return (
        <QModalConfirmacion
            nombre="borrarLineaFacturaCompra"
            abierto={true}
            titulo="Borrar línea"
            mensaje={`¿Está seguro de que desea borrar la línea "${etiquetaLinea(linea)}"?`}
            onCerrar={cancelar}
            onAceptar={borrar}
        />
    );
};
