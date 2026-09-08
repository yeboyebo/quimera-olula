import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useForm } from "@olula/lib/useForm.ts";
import { useCallback } from "react";
import { Albaran, LineaAlbaran } from "../diseño.ts";
import { etiquetaLinea, lineaDePedido } from "../dominio.ts";
import { borrarLineasAlbaran } from "../infraestructura.ts";

export const BorrarLineaAlbaran = ({
    albaran,
    linea,
    publicar,
}: {
    albaran: Albaran;
    linea: LineaAlbaran;
    publicar: EmitirEvento;
}) => {
    const borrar_ = useCallback(async () => {
        await borrarLineasAlbaran(albaran.id, [linea.id]);
        publicar("linea_borrada", linea.id);
    }, [albaran.id, linea.id, publicar]);

    const cancelar_ = useCallback(
        () => publicar("borrado_de_linea_cancelado"),
        [publicar]
    );

    const [borrar, cancelar] = useForm(borrar_, cancelar_);

    const aviso = lineaDePedido(linea)
        ? " Se reajustará lo recibido del pedido de origen."
        : "";

    return (
        <QModalConfirmacion
            nombre="borrarLineaAlbaranCompra"
            abierto={true}
            titulo="Borrar línea"
            mensaje={`¿Está seguro de que desea borrar la línea "${etiquetaLinea(linea)}"?${aviso}`}
            onCerrar={cancelar}
            onAceptar={borrar}
        />
    );
};
