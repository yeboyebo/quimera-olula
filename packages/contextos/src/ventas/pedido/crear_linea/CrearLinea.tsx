import { ArticuloLinea, CamposArticuloLinea } from "#/ventas/comun/componentes/articulo_linea/ArticuloLinea.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QModal } from "@olula/componentes/index.js";
import { FactoryCtx } from "@olula/lib/factory_ctx.js";
import { useForm } from "@olula/lib/useForm.js";
import { ProcesarEvento } from "@olula/lib/useMaquina.js";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useCallback, useContext } from "react";
import type { ModeloNuevaLinea } from "../../venta/diseño.ts";
import { postLinea } from "../infraestructura.ts";
import "./CrearLinea.css";
import {
    camposConCambiosServidor,
    metaNuevaLinea,
    nuevaLineaInicial
} from "./dominio.ts";

export type CrearLineaProps = {
    idPedido: string;
    publicar: ProcesarEvento;
};

export const CrearLinea = (props: CrearLineaProps) => {
    const { app } = useContext(FactoryCtx);
    const CrearLinea_ = app.Ventas.pedido_CrearLinea as typeof CrearLineaBase;

    return CrearLinea_(props);
};

export const CrearLineaBase = ({ idPedido, publicar }: CrearLineaProps) => {

    // Callback para campos QInput (cantidad…): se dispara en blur via evaluarCambio.
    // Solo llama al servidor si el campo está en camposConCambiosServidor.
    const onModeloListo = useCallback(
        async (nuevaLinea: ModeloNuevaLinea, campo?: string) => {
            if (campo && !(camposConCambiosServidor as readonly string[]).includes(campo)) {
                return;
            }
            return await postLinea(idPedido, nuevaLinea, { dryRun: true });
        },
        [idPedido]
    );

    const lineaArticulo = useModelo(metaNuevaLinea, nuevaLineaInicial, onModeloListo);

    const linea = lineaArticulo.modelo;

    // Handler para ArticuloLinea (onChange inmediato, no pasa por evaluarCambio).
    const onArticuloCambiado = useCallback(
        async (cambios: Partial<CamposArticuloLinea>) => {
            const { idArticulo, ...restCambios } = cambios;
            const cambiosModelo = {
                ...restCambios,
                ...(idArticulo !== undefined ? { idArticulo, pvpUnitario: null } : {}),
            };
            const nuevaLinea: ModeloNuevaLinea = { ...linea, ...cambiosModelo };
            lineaArticulo.set(nuevaLinea);
        },
        [linea, lineaArticulo, idPedido]
    );

    const crear_ = useCallback(async () => {
        const lineaConId = await postLinea(idPedido, lineaArticulo.modelo);
        publicar("linea_creada", lineaConId);
    }, [lineaArticulo, publicar, idPedido]);

    const cancelar_ = useCallback(
        () => publicar("crear_linea_cancelado"),
        [publicar]
    ); 

    const [crear, cancelar] = useForm(crear_, cancelar_);

    const valido = lineaArticulo.valido;

    return (
        <QModal
            abierto={true}
            nombre="crear_linea_pedido"
            titulo="Crear línea"
            onCerrar={cancelar}
        >
            <div className="CrearLinea">
                <quimera-formulario>
                    <ArticuloLinea
                        tipo={linea.tipoArticulo}
                        idArticulo={linea.idArticulo}
                        articulo={linea.descripcionArticulo}
                        descripcion={linea.descripcion ?? ""}
                        nombre="idArticulo_nueva_linea_pedido"
                        onChange={onArticuloCambiado}
                    />
                    {/* cantidad: usa evaluarCambio vía onBlur automático de QInput */}
                    <QInput label="Cantidad" {...lineaArticulo.uiProps("cantidad")} />
                    {(linea.tipoArticulo === "libre" || true) && (
                        <>
                        <QInput
                            label="PVP unitario"
                            {...lineaArticulo.uiProps("pvpUnitario")}
                        />
                        <QInput
                            label="Total"
                            {...lineaArticulo.uiProps("pvpTotal")}
                        />
                        </>
                    )}
                </quimera-formulario>
                <div className="botones">
                    <QBoton onClick={crear} deshabilitado={!valido}>
                        Crear
                    </QBoton>
                </div>
            </div>
        </QModal>
    );
};
