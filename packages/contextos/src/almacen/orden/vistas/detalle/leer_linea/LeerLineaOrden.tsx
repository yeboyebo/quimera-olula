import { Caja } from "#/almacen/comun/componentes/Caja.tsx";
import { Lote } from "#/almacen/comun/componentes/Lote.tsx";
import { Ubicacion } from "#/almacen/comun/componentes/Ubicacion.tsx";

import { LineaOrdenAlmacen, OrdenAlmacen } from "#/almacen/orden/diseño.ts";
import { registrarLecturaOrden } from "#/almacen/orden/infraestructura.ts";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QPasos } from "@olula/componentes/atomos/qpasos.tsx";
import { QModal } from "@olula/componentes/moleculas/qmodal.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { ReactNode, useCallback, useContext, useEffect, useRef, useState } from "react";
import { LecturaSkuLote } from "../lectura/LecturaSkuLote.tsx";
import "./LeerLineaOrden.css";

type PasoGuion = "sku-lote" | "cantidad" | "caja-destino" | "caja-destino-capacidad" | "ubi-destino" | "ubi-origen" | "caja-origen" | "caja-origen-completa";

const instrucciones: Record<PasoGuion, string> = {
    "sku-lote": "Lee el código de barras",
    "cantidad": "Introduce la cantidad",
    "caja-destino": "Lee la caja de destino",
    "caja-destino-capacidad": "Lee la caja de destino",
    "ubi-destino": "Lee la ubicación de destino",
    "ubi-origen": "Lee la ubicación de origen",
    "caja-origen": "Lee la caja de origen",
    "caja-origen-completa": "Lee la caja de origen (completa)",
};

const guion: Record<string, PasoGuion[]> = {
    // Entrada
    // "68": ["cantidad", "caja-destino"], // R1 en cajas
    "68": ["caja-destino-capacidad"], // R1 en cajas

    // "69": ["sku-lote", "cantidad"], // L1 lotes
    "69": ["cantidad"], // L1 lotes
    // Cuarentena
    "70": ["ubi-destino"], // L1 lotes
    // Colocar en masivo / Put away
    "71": ["caja-origen-completa", "ubi-destino"], // R1 en cajas > MS-1
    // Reposición de picking
    "77": ["caja-origen-completa"], // R1 en cajas desde MS-1 > TR
    "78": ["ubi-destino"], // R1 en cajas desde TR > MS-1
    // Picking
    "73": ["caja-origen", "cantidad", "ubi-destino"], // 1 ud de R1 a BD1
    "74": ["caja-origen", "cantidad", "ubi-destino"], // 2 ud de R1 a BD2
};

const PasoWrapper = ({ instruccion, children }: { instruccion: string; children: ReactNode }) => (
    <div className="paso-guion">
        <p className="paso-guion__instruccion">{instruccion}</p>
        {children}
    </div>
);

type ValoresAcumulados = {
    sku?: string;
    articulo?: string;
    loteId?: string | null;
    cantidad?: number;
    idCajaOrigen?: string;
    idCajaDestino?: string;
    idUbicacionDestino?: string;
    idUbicacionOrigen?: string;
};

export const LeerLineaOrden = ({
    orden,
    linea,
    publicar,
}: {
    orden: OrdenAlmacen;
    linea: LineaOrdenAlmacen;
    publicar: EmitirEvento;
}) => {
    const { intentar } = useContext(ContextoError);
    const [pasoActual, setPasoActual] = useState<number>(0);
    const [valores, setValores] = useState<ValoresAcumulados>({});
    const contenedorRef = useRef<HTMLDivElement>(null);

    const pasoGuion = guion[linea.id] ?? [];

    // Auto-salta el paso sku-lote si la línea ya tiene los datos necesarios.
    // Para el resto de pasos, enfoca el primer input visible tras el render.
    useEffect(() => {
        const paso = pasoGuion[pasoActual];
        if (paso === "sku-lote") {
            const skuEfectivo = valores.sku ?? linea.sku;
            const loteEfectivo = valores.loteId !== undefined ? valores.loteId : linea.loteId;
            const completo = !!skuEfectivo && (linea.porLotes ? !!loteEfectivo : true);
            if (completo) {
                setPasoActual((p) => p + 1);
                return;
            }
        }
        const raf = requestAnimationFrame(() => {
            contenedorRef.current?.querySelector<HTMLElement>("input:not([type='hidden'])")?.focus();
        });
        return () => cancelAnimationFrame(raf);
    }, [pasoActual]); // eslint-disable-line react-hooks/exhaustive-deps

    const paso = pasoGuion[pasoActual];
    const esUltimoPaso = pasoActual === pasoGuion.length - 1;

    const skuEfectivo = valores.sku ?? linea.sku;
    const articuloEfectivo = valores.articulo ?? linea.articulo;
    const loteEfectivo = valores.loteId !== undefined ? valores.loteId : linea.loteId;

    const preguntaCantidad = pasoGuion.includes("cantidad");
    const cantidadARegistrar = preguntaCantidad || pasoGuion.includes("caja-destino-capacidad") || pasoGuion.includes("caja-origen-completa")
        ? (valores.cantidad ?? linea.cantidadPrevista)
        : linea.cantidadPrevista - (linea.cantidadReal ?? 0);
    const cantidadBloqueada = !preguntaCantidad && cantidadARegistrar <= 0;

    const cancelar = useCallback(() => {
        publicar("lectura_guion_cancelada");
    }, [publicar]);

    // Llamado cuando LecturaSkuLote escanea un código. Avanza automáticamente
    // si tras el escaneo ya tenemos sku + lote (o no se necesita lote).
    const onSkuLoteLeido = useCallback(
        (resultado: { sku: string; descripcion: string; loteId: string | null }) => {
            const loteResultado = resultado.loteId;
            const loteResuelto = loteResultado !== null ? loteResultado : (linea.loteId ?? null);
            setValores((v) => ({
                ...v,
                sku: resultado.sku,
                articulo: resultado.descripcion,
                loteId: loteResultado,
            }));
            const completo = !linea.porLotes || !!loteResuelto;
            if (completo) {
                setPasoActual((p) => p + 1);
            }
        },
        [linea]
    );

    // Llamado cuando el usuario selecciona un lote en el picker. Avanza automáticamente.
    const onLoteSeleccionado = useCallback(
        (opcion: { valor: string; descripcion: string } | null) => {
            setValores((v) => ({ ...v, loteId: opcion?.valor ?? null }));
            if (opcion?.valor) {
                setPasoActual((p) => p + 1);
            }
        },
        []
    );

    const avanzar = useCallback(async () => {
        if (!esUltimoPaso) {
            setPasoActual((p) => p + 1);
            return;
        }

        const sku = valores.sku ?? linea.sku;
        const articulo = valores.articulo ?? linea.articulo;
        const idLote = valores.loteId !== undefined ? valores.loteId : linea.loteId;
        const cantidad = cantidadARegistrar;
        const idCajaDestino = valores.idCajaDestino !== undefined
            ? valores.idCajaDestino
            : linea.idCajaDestino;
        const cajaCompleta = pasoGuion.includes("caja-origen-completa");
        const idCajaOrigen = (pasoGuion.includes("caja-origen") || pasoGuion.includes("caja-origen-completa"))
            ? (valores.idCajaOrigen ?? linea.idCajaOrigen)
            : linea.idCajaOrigen;

        await intentar(() =>
            registrarLecturaOrden(orden.id, {
                sku,
                articulo,
                idLote,
                idLinea: linea.id,
                cajaCompleta,
                cantidad,
                idCajaDestino,
                idUbicacionDestino: valores.idUbicacionDestino !== undefined
                    ? valores.idUbicacionDestino
                    : linea.idUbicacionDestino,
                idCajaOrigen,
                idUbicacionOrigen: valores.idUbicacionOrigen !== undefined
                    ? valores.idUbicacionOrigen
                    : linea.idUbicacionOrigen,
            })
        );
        publicar("lectura_registrada");
    }, [esUltimoPaso, valores, linea, orden.id, intentar, publicar]);

    return (
        <QModal
            abierto={true}
            nombre="leerLineaOrden"
            titulo="Lectura guiada"
            onCerrar={cancelar}
        >
            <div className="LeerLineaOrden" ref={contenedorRef}>
                <dl>
                    <dt>SKU</dt>
                    <dd>{`${skuEfectivo} - ${articuloEfectivo}`}</dd>
                    {!!loteEfectivo && !pasoGuion.includes("sku-lote") && (
                        <>
                            <dt>Lote</dt>
                            <dd>{loteEfectivo}</dd>
                        </>
                    )}
                    <dt>Cantidad a registrar</dt>
                    <dd>{cantidadARegistrar}</dd>
                </dl>
                {cantidadBloqueada && (
                    <p className="q-texto-error">La cantidad ya está completa (prevista: {linea.cantidadPrevista}, real: {linea.cantidadReal}). No hay nada que registrar.</p>
                )}

                <QPasos total={pasoGuion.length} actual={pasoActual} />

                {paso === "sku-lote" && !skuEfectivo && (
                    <PasoWrapper instruccion={instrucciones["sku-lote"]}>
                        <LecturaSkuLote nombre="sku-lote" onLectura={onSkuLoteLeido} />
                    </PasoWrapper>
                )}

                {paso === "sku-lote" && !!skuEfectivo && linea.porLotes && !loteEfectivo && (
                    <PasoWrapper instruccion="Selecciona el lote">
                        <Lote
                            label="Lote"
                            nombre="lote_id"
                            valor={typeof loteEfectivo === "string" ? loteEfectivo : ""}
                            sku={skuEfectivo}
                            onChange={onLoteSeleccionado}
                        />
                    </PasoWrapper>
                )}

                {paso === "cantidad" && (
                    <PasoWrapper instruccion={instrucciones[paso]}>
                        <QInput
                            label="Cantidad"
                            nombre="cantidad"
                            tipo="numero"
                            valor={valores.cantidad !== undefined ? String(valores.cantidad) : ""}
                            onChange={(valor) => {
                                const num = parseFloat(valor);
                                setValores((v) => ({ ...v, cantidad: isNaN(num) ? undefined : num }));
                            }}
                        />
                    </PasoWrapper>
                )}

                {paso === "ubi-destino" && (
                    <PasoWrapper instruccion={instrucciones[paso]}>
                        <Ubicacion
                            label="Ubicación destino"
                            nombre="idUbicacionDestino"
                            valor={valores.idUbicacionDestino ?? ""}
                            onChange={(opcion) =>
                                setValores((v) => ({ ...v, idUbicacionDestino: opcion?.valor ?? "" }))
                            }
                        />
                    </PasoWrapper>
                )}

                {paso === "ubi-origen" && (
                    <PasoWrapper instruccion={instrucciones[paso]}>
                        <Ubicacion
                            label="Ubicación origen"
                            nombre="idUbicacionOrigen"
                            valor={valores.idUbicacionOrigen ?? ""}
                            onChange={(opcion) =>
                                setValores((v) => ({ ...v, idUbicacionOrigen: opcion?.valor ?? "" }))
                            }
                        />
                    </PasoWrapper>
                )}

                {paso === "caja-destino" && (
                    <PasoWrapper instruccion={instrucciones[paso]}>
                        <Caja
                            label="Caja destino"
                            nombre="idCajaDestino"
                            valor={valores.idCajaDestino ?? ""}
                            onChange={(opcion) =>
                                setValores((v) => ({ ...v, idCajaDestino: opcion?.valor ?? "" }))
                            }
                        />
                    </PasoWrapper>
                )}

                {paso === "caja-destino-capacidad" && (
                    <PasoWrapper instruccion={instrucciones[paso]}>
                        <Caja
                            label="Caja destino"
                            nombre="idCajaDestino"
                            valor={valores.idCajaDestino ?? ""}
                            onChange={(opcion) =>
                                setValores((v) => ({
                                    ...v,
                                    idCajaDestino: opcion?.valor ?? "",
                                    cantidad: opcion?.capacidad ?? undefined,
                                }))
                            }
                        />
                    </PasoWrapper>
                )}

                {paso === "caja-origen" && (
                    <PasoWrapper instruccion={instrucciones[paso]}>
                        <Caja
                            label="Caja origen"
                            nombre="idCajaOrigen"
                            valor={valores.idCajaOrigen ?? ""}
                            onChange={(opcion) =>
                                setValores((v) => ({ ...v, idCajaOrigen: opcion?.valor ?? "" }))
                            }
                        />
                    </PasoWrapper>
                )}

                {paso === "caja-origen-completa" && (
                    <PasoWrapper instruccion={instrucciones[paso]}>
                        <Caja
                            label="Caja origen"
                            nombre="idCajaOrigen"
                            valor={valores.idCajaOrigen ?? ""}
                            onChange={(opcion) =>
                                setValores((v) => ({
                                    ...v,
                                    idCajaOrigen: opcion?.valor ?? "",
                                    cantidad: opcion?.cantidad ?? undefined,
                                }))
                            }
                        />
                    </PasoWrapper>
                )}

                <div className="botones maestro-botones">
                    <QBoton onClick={avanzar} deshabilitado={esUltimoPaso && cantidadBloqueada}>
                        {esUltimoPaso ? "Registrar" : "Siguiente"}
                    </QBoton>
                </div>
            </div>
        </QModal>
    );
};
