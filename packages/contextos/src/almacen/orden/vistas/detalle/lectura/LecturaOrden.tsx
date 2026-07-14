import { Caja } from "#/almacen/comun/componentes/Caja.tsx";
import { Lote } from "#/almacen/comun/componentes/Lote.tsx";
import { OrdenAlmacen } from "#/almacen/orden/diseño.ts";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { ProcesarEvento } from "@olula/lib/useMaquina.js";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useCallback, useContext, useMemo } from "react";
import { Articulo } from "../../../../comun/componentes/Articulo.tsx";
import { Ubicacion } from "../../../../comun/componentes/Ubicacion.tsx";
import { registrarLecturaOrden } from "../../../infraestructura.ts";
import { metaNuevaLecturaOrden } from "./diseño.ts";
import { getNuevaLecturaOrdenVacia } from "./lectura_orden.ts";
import "./LecturaOrden.css";
import { LecturaSkuLote } from "./LecturaSkuLote.tsx";

export const LecturaOrden = ({
    publicar,
    orden,
    tipo,
}: {
    publicar: ProcesarEvento;
    orden: OrdenAlmacen;
    tipo: "ENTRADA" | "SALIDA" | "TRASPASO";
}) => {
    const { intentar } = useContext(ContextoError);

    const lecturaInicial = useMemo(
        () => getNuevaLecturaOrdenVacia(orden),
        [orden]
    );

    const { modelo, uiProps, valido, init, set } = useModelo(
        metaNuevaLecturaOrden,
        lecturaInicial
    );

    const mostrarOrigen = ["SALIDA", "TRASPASO"].includes(tipo);
    const mostrarDestino = ["ENTRADA", "TRASPASO"].includes(tipo);

    const registrar = useCallback(async () => {
        await intentar(() =>
            registrarLecturaOrden(orden.id, {
                sku: modelo.sku,
                idLote: modelo.idLote,
                cantidad: modelo.cantidad,
                articulo: modelo.articulo,
                idUbicacionDestino: mostrarDestino
                    ? modelo.idUbicacionDestino
                    : null,
                idCajaDestino: mostrarDestino ? modelo.idCajaDestino : null,
                idUbicacionOrigen: mostrarOrigen
                    ? modelo.idUbicacionOrigen
                    : null,
                idCajaOrigen: mostrarOrigen ? modelo.idCajaOrigen : null,

            })
        );
        publicar("lectura_registrada");
        init();
    }, [modelo, publicar, orden.id, intentar, init, mostrarDestino, mostrarOrigen]);

    const onSkuLoteLeido = useCallback(
        (resultado: { sku: string; descripcion: string; loteId: string | null }) => {
            set({ ...modelo, sku: resultado.sku, articulo: resultado.descripcion, idLote: resultado.loteId });
        },
        [modelo, set]
    );

    return (
        <div className="LecturaOrden">
            <h3>LECTURA</h3>
            <quimera-formulario>
                <LecturaSkuLote onLectura={onSkuLoteLeido} />
                <Articulo
                    {...uiProps("sku", "articulo")}
                />
                <Lote
                    sku={modelo.sku}
                    {...uiProps("idLote")}
                />
                <QInput label="Cantidad" {...uiProps("cantidad")} />
                {mostrarOrigen && (
                    <Ubicacion
                        {...uiProps("idUbicacionOrigen")}
                    />
                )}
                {mostrarDestino && (
                    <>
                        <Ubicacion
                            {...uiProps("idUbicacionDestino")}
                        />
                        <Caja
                            {...uiProps("idCajaDestino")}
                        />
                    </>
                )}
            </quimera-formulario>
            <div className="botones maestro-botones">
                <QBoton onClick={registrar} deshabilitado={!valido}>
                    Registrar
                </QBoton>
            </div>
        </div>
    );
};
