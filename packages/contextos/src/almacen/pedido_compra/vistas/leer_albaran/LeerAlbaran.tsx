import { Ubicacion } from "#/almacen/comun/componentes/Ubicacion.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QModal } from "@olula/componentes/index.js";
import { EmitirEvento } from "@olula/lib/diseño.js";
import { useForm } from "@olula/lib/useForm.js";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useCallback, useRef, useState } from "react";
import { getInfoLineasPedidoCompra, postEntradaDesdePedido } from "../../infraestructura.ts";
import {
    formEntradaVacia,
    metaFormEntrada,
} from "../crear_entrada_desde_pedido/crear_entrada_desde_pedido.ts";

export const LeerAlbaran = ({
    publicar,
    pedidoCompraId,
}: {
    publicar: EmitirEvento;
    pedidoCompraId: string;
}) => {
    const { modelo, uiProps, valido } = useModelo(
        metaFormEntrada,
        formEntradaVacia
    );

    const inputRef = useRef<HTMLInputElement>(null);
    const [fichero, setFichero] = useState<File | null>(null);

    const onFicheroSeleccionado = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setFichero(e.target.files?.[0] ?? null);
        },
        []
    );

    const crear_ = useCallback(
        async () => {
            const lineas = await getInfoLineasPedidoCompra(pedidoCompraId, fichero!);

            const id = await postEntradaDesdePedido({
                pedidoCompraId,
                ubicacionId: modelo.ubicacionId,
                lineas,
            });
            publicar("entrada_creada", id);
        },
        [fichero, modelo.ubicacionId, pedidoCompraId, publicar]
    );

    const cancelar_ = useCallback(
        () => publicar("leer_albaran_cancelado"),
        [publicar]
    );

    const [crear, cancelar] = useForm(crear_, cancelar_);

    return (
        <QModal
            abierto={true}
            nombre="leerAlbaran"
            titulo="Leer albarán"
            onCerrar={cancelar}
        >
            <quimera-formulario>
                <div style={{ marginBottom: "1rem" }}>
                    <label>Fichero del albarán</label>
                    <input
                        ref={inputRef}
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={onFicheroSeleccionado}
                    />
                </div>
                <Ubicacion label="Ubicación de entrada" {...uiProps("ubicacionId")} />
            </quimera-formulario>

            <div className="botones maestro-botones">
                <QBoton onClick={crear} deshabilitado={!valido || !fichero}>
                    Crear entrada
                </QBoton>
            </div>
        </QModal>
    );
};
