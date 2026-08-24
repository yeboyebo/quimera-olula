import { Articulo } from "#/ventas/comun/componentes/articulo.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QModal } from "@olula/componentes/index.js";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useFocus } from "@olula/lib/useFocus.ts";
import { useForm } from "@olula/lib/useForm.ts";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useCallback, useMemo, useState } from "react";
import { Pedido } from "../diseño.ts";
import {
    metaNuevaLineaLibrePedido,
    metaNuevaLineaPedido,
    nuevaLineaLibrePedidoVacia,
    nuevaLineaPedidoVacia,
} from "../dominio.ts";
import { postLineaPedido } from "../infraestructura.ts";

export const CrearLineaPedido = ({
    pedido,
    publicar,
}: {
    pedido: Pedido;
    publicar: EmitirEvento;
}) => {
    const [modoLibre, setModoLibre] = useState(false);

    const inicialArticulo = useMemo(nuevaLineaPedidoVacia, []);
    const inicialLibre = useMemo(nuevaLineaLibrePedidoVacia, []);

    const lineaArticulo = useModelo(metaNuevaLineaPedido, inicialArticulo);
    const lineaLibre = useModelo(metaNuevaLineaLibrePedido, inicialLibre);

    const focus = useFocus();

    const alternarModo = () => {
        setModoLibre((modo) => !modo);
        lineaArticulo.init(inicialArticulo);
        lineaLibre.init(inicialLibre);
    };

    const crear_ = useCallback(async () => {
        const modelo = modoLibre ? lineaLibre.modelo : lineaArticulo.modelo;
        const idLinea = await postLineaPedido(pedido.id, modelo);
        publicar("linea_creada", idLinea);
    }, [modoLibre, lineaLibre.modelo, lineaArticulo.modelo, pedido.id, publicar]);

    const cancelar_ = useCallback(
        () => publicar("alta_de_linea_cancelada"),
        [publicar]
    );

    const [crear, cancelar] = useForm(crear_, cancelar_);

    const form = modoLibre ? lineaLibre : lineaArticulo;

    return (
        <QModal
            abierto={true}
            nombre="crearLineaPedidoCompra"
            titulo="Crear línea"
            onCerrar={cancelar}
        >
            <div className="modo-linea">
                <QBoton onClick={alternarModo} variante="texto" tipo="button">
                    {modoLibre ? "Artículo del catálogo" : "Línea sin artículo"}
                </QBoton>
            </div>
            <div className="CrearLineaPedido">
                <quimera-formulario>
                    {modoLibre ? (
                        <QInput
                            label="Descripción"
                            {...lineaLibre.uiProps("descripcion")}
                            ref={focus}
                        />
                    ) : (
                        <Articulo
                            {...lineaArticulo.uiProps("referencia", "descripcion")}
                            nombre="referenciaNuevaLineaPedidoCompra"
                            ref={focus}
                        />
                    )}
                    <QInput label="Cantidad" {...form.uiProps("cantidad")} />
                    {/* En compras no hay tarifa de proveedor: el coste es obligatorio siempre. */}
                    <QInput label="Coste unitario" {...form.uiProps("pvpUnitario")} />
                </quimera-formulario>
                <div className="botones maestro-botones">
                    <QBoton onClick={crear} deshabilitado={!form.valido}>
                        Crear
                    </QBoton>
                </div>
            </div>
        </QModal>
    );
};
