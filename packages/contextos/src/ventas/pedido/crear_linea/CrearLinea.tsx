import { ArticuloLinea, CamposArticuloLinea } from "#/ventas/comun/componentes/articulo_linea/ArticuloLinea.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QModal } from "@olula/componentes/index.js";
import { FactoryCtx } from "@olula/lib/factory_ctx.js";
import { useCambiosDesdeCampo } from "@olula/lib/useCambiosDesdeCampo.ts";
import { useForm } from "@olula/lib/useForm.js";
import { ProcesarEvento } from "@olula/lib/useMaquina.js";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useCallback, useContext, useMemo, useRef } from "react";
import "./CrearLinea.css";
import {
    camposConCambiosServidor,
    getCambiosNuevaLinea,
    metaNuevaLinea,
    ModeloNuevaLinea,
    nuevaLineaVacia,
    postModelo,
} from "./dominio.ts";

export type CrearLineaProps = {
    pedidoId: string;
    publicar: ProcesarEvento;
};

export const CrearLinea = (props: CrearLineaProps) => {
    const { app } = useContext(FactoryCtx);
    const CrearLinea_ = app.Ventas.pedido_CrearLinea as typeof CrearLineaBase;

    return CrearLinea_(props);
};

export const CrearLineaBase = ({ pedidoId, publicar }: CrearLineaProps) => {

    // 1. Contexto memoizado: incluye pedidoId para que el servidor resuelva
    //    tarifas del cliente, almacén, etc. Ampliar si el servidor necesita más datos.
    const contexto = useMemo(() => ({ pedidoId }), [pedidoId]);

    // 2. Hook genérico de cambios servidor (debe ir antes de useModelo para que
    //    aplicarCambiosServidor esté disponible en onModeloListo).
    const { aplicarCambiosServidor } = useCambiosDesdeCampo(
        camposConCambiosServidor,
        getCambiosNuevaLinea,
        contexto
    );

    // 3. Refs para romper la dependencia circular onModeloListo ↔ lineaArticulo.set.
    //    modeloAnteriorRef: detectar qué campo cambió comparando viejo vs nuevo.
    //    setLineaRef: acceder a lineaArticulo.set sin incluirlo en los deps de onModeloListo.
    const modeloAnteriorRef = useRef<ModeloNuevaLinea>(nuevaLineaVacia);
    const setLineaRef = useRef<(m: ModeloNuevaLinea) => void>(() => {});

    // 4. Callback para campos QInput (p.ej. cantidad): se dispara en blur via
    //    evaluarCambio, que QInput llama automáticamente en onBlur.
    //    Detecta el campo que cambió y delega en aplicarCambiosServidor.
    const onModeloListo = useCallback(
        async (nuevoModelo: ModeloNuevaLinea) => {
            const delta = (Object.keys(nuevoModelo) as (keyof ModeloNuevaLinea)[])
                .filter(k => nuevoModelo[k] !== modeloAnteriorRef.current[k])
                .reduce((acc, k) => ({ ...acc, [k]: nuevoModelo[k] }), {} as Partial<ModeloNuevaLinea>);

            modeloAnteriorRef.current = nuevoModelo;

            await aplicarCambiosServidor(nuevoModelo, delta, setLineaRef.current);
        },
        [aplicarCambiosServidor]
    );

    // 5. useModelo con onModeloListo para habilitar el flujo de blur en campos QInput.
    const lineaArticulo = useModelo(metaNuevaLinea, nuevaLineaVacia, onModeloListo);

    // 6. Actualizar la ref síncrona tras cada render para que onModeloListo
    //    siempre use el set más reciente.
    setLineaRef.current = lineaArticulo.set;

    const linea = lineaArticulo.modelo;

    // 7. Handler para ArticuloLinea (onChange inmediato, no pasa por evaluarCambio).
    //    Campos disparadores: 'referencia' (declarados en camposConCambiosServidor).
    const onArticuloCambiado = useCallback(
        async (cambios: Partial<CamposArticuloLinea>) => {
            const nuevaLinea = { ...linea, ...cambios };
            lineaArticulo.set(nuevaLinea);                            // optimista
            await aplicarCambiosServidor(                             // recálculo servidor
                nuevaLinea,
                cambios as Partial<ModeloNuevaLinea>,
                lineaArticulo.set
            );
        },
        [linea, lineaArticulo, aplicarCambiosServidor]
    );

    const crear_ = useCallback(async () => {
        await postModelo(pedidoId, lineaArticulo.modelo);
        publicar("alta_linea_lista");
    }, [lineaArticulo, publicar, pedidoId]);

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
                        tipoArticulo={linea.tipoArticulo}
                        referencia={linea.referencia}
                        descripcionArticulo={linea.descripcionArticulo}
                        descripcion={linea.descripcion ?? ""}
                        nombre="referencia_nueva_linea_pedido"
                        onChange={onArticuloCambiado}
                    />
                    {/* cantidad: usa evaluarCambio vía onBlur automático de QInput */}
                    <QInput label="Cantidad" {...lineaArticulo.uiProps("cantidad")} />
                    {(linea.tipoArticulo === "libre" || true) && (
                        <>
                        <QInput
                            label="PVP unitario"
                            {...lineaArticulo.uiProps("pvp_unitario")}
                        />
                        <QInput
                            label="Total"
                            {...lineaArticulo.uiProps("pvp_total")}
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
