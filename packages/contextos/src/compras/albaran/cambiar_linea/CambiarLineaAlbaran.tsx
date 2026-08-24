import { Articulo } from "#/ventas/comun/componentes/articulo.tsx";
import { GrupoIvaProducto } from "#/ventas/comun/componentes/grupo_iva_producto.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QModal } from "@olula/componentes/index.js";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useForm } from "@olula/lib/useForm.ts";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useCallback } from "react";
import { Albaran, LineaAlbaran } from "../diseño.ts";
import { lineaDePedido, metaLineaAlbaran } from "../dominio.ts";
import { patchLineaAlbaran } from "../infraestructura.ts";
import "./CambiarLineaAlbaran.css";

export const CambiarLineaAlbaran = ({
    albaran,
    linea,
    publicar,
}: {
    albaran: Albaran;
    linea: LineaAlbaran;
    publicar: EmitirEvento;
}) => {
    const { modelo, uiProps, valido } = useModelo(metaLineaAlbaran, linea);

    const cambiar_ = useCallback(async () => {
        await patchLineaAlbaran(albaran.id, linea.id, modelo);
        publicar("linea_cambiada", linea.id);
    }, [modelo, albaran.id, linea.id, publicar]);

    const cancelar_ = useCallback(
        () => publicar("cambio_de_linea_cancelado"),
        [publicar]
    );

    const [cambiar, cancelar] = useForm(cambiar_, cancelar_);

    return (
        <QModal
            abierto={true}
            nombre="cambiarLineaAlbaranCompra"
            titulo="Cambiar línea"
            onCerrar={cancelar}
        >
            <div className="CambiarLineaAlbaran">
                {lineaDePedido(linea) && (
                    <p className="aviso-linea-pedido">
                        Esta línea viene de un pedido: cambiar la cantidad reajusta lo
                        recibido de ese pedido.
                    </p>
                )}
                <quimera-formulario>
                    {/* Con articulo se puede convertir una línea de catálogo en libre y al revés. */}
                    <Articulo
                        {...uiProps("referencia", "descripcion")}
                        nombre="referenciaLineaAlbaranCompra"
                    />
                    <QInput label="Descripción" {...uiProps("descripcion")} />
                    <QInput label="Cantidad" {...uiProps("cantidad")} />
                    <QInput label="Coste unitario" {...uiProps("pvpUnitario")} />
                    <QInput label="% Descuento" {...uiProps("dtoPorcentual")} />
                    <QInput label="Descuento lineal" {...uiProps("dtoLineal")} />
                    <GrupoIvaProducto
                        {...uiProps("grupoIvaProductoId")}
                        nombre="grupoIvaProductoId"
                    />
                    <QInput label="% I.R.P.F." {...uiProps("tipoIrpf")} />
                </quimera-formulario>
                <div className="botones maestro-botones">
                    <QBoton onClick={cambiar} deshabilitado={!valido}>
                        Cambiar
                    </QBoton>
                </div>
            </div>
        </QModal>
    );
};
