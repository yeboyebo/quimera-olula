import { Articulo } from "#/ventas/comun/componentes/articulo.tsx";
import { GrupoIvaProducto } from "#/ventas/comun/componentes/grupo_iva_producto.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QModal } from "@olula/componentes/index.js";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useForm } from "@olula/lib/useForm.ts";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useCallback } from "react";
import { LineaPedido, Pedido } from "../diseño.ts";
import { metaLineaPedido } from "../dominio.ts";
import { patchLineaPedido } from "../infraestructura.ts";

export const CambiarLineaPedido = ({
    pedido,
    linea,
    publicar,
}: {
    pedido: Pedido;
    linea: LineaPedido;
    publicar: EmitirEvento;
}) => {
    const { modelo, uiProps, valido } = useModelo(metaLineaPedido, linea);

    const cambiar_ = useCallback(async () => {
        await patchLineaPedido(pedido.id, linea.id, modelo);
        publicar("linea_cambiada", linea.id);
    }, [modelo, pedido.id, linea.id, publicar]);

    const cancelar_ = useCallback(
        () => publicar("cambio_de_linea_cancelado"),
        [publicar]
    );

    const [cambiar, cancelar] = useForm(cambiar_, cancelar_);

    return (
        <QModal
            abierto={true}
            nombre="cambiarLineaPedidoCompra"
            titulo="Cambiar línea"
            onCerrar={cancelar}
        >
            <div className="CambiarLineaPedido">
                <quimera-formulario>
                    {/* Con articulo se puede convertir una línea de catálogo en libre y al revés. */}
                    <Articulo
                        {...uiProps("referencia", "descripcion")}
                        nombre="referenciaLineaPedidoCompra"
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
