import { LineaOrdenAlmacen, OrdenAlmacen } from "#/almacen/orden/diseño.ts";
import {
    getSkuLote,
    getStockDesgloseCaja,
    registrarLecturasOrden,
} from "#/almacen/orden/infraestructura.ts";
import { buscarCajaCompletaPorTexto } from "#/almacen/comun/voz_resolvers.ts";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QEtiqueta } from "@olula/componentes/atomos/qetiqueta.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QModal } from "@olula/componentes/moleculas/qmodal.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useCallback, useContext, useRef, useState } from "react";

const esPendiente = (l: LineaOrdenAlmacen): boolean =>
    (l.cantidadPick ?? l.cantidadReal ?? 0) < l.cantidadPrevista;

const encontrarLineaPorSku = (
    orden: OrdenAlmacen,
    sku: string,
): LineaOrdenAlmacen | null =>
    orden.lineas.find((l) => esPendiente(l) && l.sku === sku) ?? null;

export const LeerPickLoteCaja = ({
    orden,
    publicar,
}: {
    orden: OrdenAlmacen;
    publicar: EmitirEvento;
}) => {
    const { intentar } = useContext(ContextoError);
    const [valor, setValor] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [cargando, setCargando] = useState(false);
    const [ultimaLectura, setUltimaLectura] = useState<{
        loteId: string;
        lpn: string | null;
        articulo: string;
    } | null>(null);
    const inputRef = useRef<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null>(null);

    const limpiarInput = useCallback(() => {
        setValor("");
        setError(null);
        (inputRef.current as HTMLInputElement | null)?.focus();
    }, []);

    const procesarTexto = useCallback(
        async (texto: string) => {
            if (!texto.trim()) return;
            setCargando(true);
            setError(null);

            await intentar(async () => {
                // 1. ¿Es una caja (por LPN)?
                const caja = await buscarCajaCompletaPorTexto(texto);

                if (caja !== null) {
                    if (caja.sku === null) {
                        setError("Esta caja no tiene artículo asignado.");
                        return;
                    }
                    if (caja.idLote === null) {
                        setError(
                            "Esta caja no tiene lote. Introduce el código de lote directamente.",
                        );
                        return;
                    }
                    const linea = encontrarLineaPorSku(orden, caja.sku);
                    if (!linea) {
                        setError(
                            `No hay línea pendiente para el artículo de la caja (${caja.sku}).`,
                        );
                        return;
                    }
                    const cantidadPendiente =
                        linea.cantidadPrevista - (linea.cantidadPick ?? 0);
                    await registrarLecturasOrden(orden.id, [
                        {
                            sku: linea.sku,
                            articulo: linea.articulo,
                            idLote: caja.idLote,
                            idLinea: linea.id,
                            cantidad: cantidadPendiente,
                            cajaCompleta: false,
                            idCajaOrigen: caja.id,
                            idCajaDestino: null,
                            idUbicacionOrigen: linea.idUbicacionOrigen,
                            idUbicacionDestino: null,
                            fase: "PICK",
                        },
                    ]);
                    setUltimaLectura({
                        loteId: caja.idLote,
                        lpn: caja.lpn,
                        articulo: linea.articulo,
                    });
                    await publicar("lectura_registrada");
                } else {
                    // 2. No es una caja → tratar como código de lote
                    const loteId = texto.trim();
                    const skuLote = await getSkuLote(loteId);
                    const articuloId = skuLote.sku;

                    const linea = encontrarLineaPorSku(orden, articuloId);
                    if (!linea) {
                        setError(
                            `No hay línea pendiente para el artículo del lote ${loteId}.`,
                        );
                        return;
                    }

                    // Verificar que existe stock suelto (sin caja) en la ubicación origen
                    if (linea.idUbicacionOrigen) {
                        const desglose = await getStockDesgloseCaja(
                            linea.idUbicacionOrigen,
                            articuloId,
                            loteId,
                        );
                        const haySuelto =
                            desglose?.some(
                                (item) => item.cajaId === null && item.cantidad > 0,
                            ) ?? false;

                        if (!haySuelto) {
                            setError(
                                `El lote ${loteId} solo tiene stock en cajas. Lee la etiqueta de la caja.`,
                            );
                            return;
                        }
                    }

                    const cantidadPendiente =
                        linea.cantidadPrevista - (linea.cantidadPick ?? 0);
                    await registrarLecturasOrden(orden.id, [
                        {
                            sku: linea.sku,
                            articulo: linea.articulo,
                            idLote: loteId,
                            idLinea: linea.id,
                            cantidad: cantidadPendiente,
                            cajaCompleta: false,
                            idCajaOrigen: null,
                            idCajaDestino: null,
                            idUbicacionOrigen: linea.idUbicacionOrigen,
                            idUbicacionDestino: null,
                            fase: "PICK",
                        },
                    ]);
                    setUltimaLectura({
                        loteId,
                        lpn: null,
                        articulo: linea.articulo,
                    });
                    await publicar("lectura_registrada");
                }
            });

            setCargando(false);
            limpiarInput();
        },
        [orden, intentar, publicar, limpiarInput],
    );

    return (
        <QModal
            abierto={true}
            nombre="leerPickLoteCaja"
            titulo="Leer pick (Lote/Caja)"
            onCerrar={() => publicar("lectura_pick_cancelada")}
        >
            <div className="LeerPickLoteCaja">
                <quimera-formulario>
                    <QInput
                        ref={inputRef}
                        nombre="textoLectura"
                        label="Lee caja o lote"
                        valor={valor}
                        onChange={(v) => {
                            setValor(v);
                            setError(null);
                        }}
                        onEnterKeyUp={(v) => procesarTexto(v)}
                        autoFocus
                        deshabilitado={cargando}
                    />
                </quimera-formulario>

                {cargando && <p>Procesando...</p>}
                {error && <p className="q-texto-error">{error}</p>}

                {ultimaLectura && (
                    <p>
                        <QEtiqueta variante="exito">
                            {`Lote ${ultimaLectura.loteId}`}
                            {ultimaLectura.lpn ? ` — Caja ${ultimaLectura.lpn}` : " (suelto)"}
                            {` — ${ultimaLectura.articulo}`}
                        </QEtiqueta>
                    </p>
                )}

                <div className="botones maestro-botones">
                    <QBoton
                        onClick={() => procesarTexto(valor)}
                        deshabilitado={!valor.trim() || cargando}
                    >
                        Confirmar
                    </QBoton>
                    <QBoton
                        variante="borde"
                        onClick={() => publicar("lectura_pick_cancelada")}
                    >
                        Cancelar
                    </QBoton>
                </div>
            </div>
        </QModal>
    );
};
