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

export const LecturaOrden = ({
    publicar,
    orden,
    tipoOrden,
}: {
    publicar: ProcesarEvento;
    orden: OrdenAlmacen;
    tipoOrden: "ENTRADA" | "SALIDA" | "TRASPASO";
}) => {
    const { intentar } = useContext(ContextoError);

    const lecturaInicial = useMemo(
        () => getNuevaLecturaOrdenVacia(orden),
        [orden]
    );

    const { modelo, uiProps, valido, init } = useModelo(
        metaNuevaLecturaOrden,
        lecturaInicial
    );

    const mostrarOrigen = ["SALIDA", "TRASPASO"].includes(tipoOrden);
    const mostrarDestino = ["ENTRADA", "TRASPASO"].includes(tipoOrden);

    const registrar = useCallback(async () => {
        await intentar(() =>
            registrarLecturaOrden(orden.id, {
                sku: modelo.sku,
                cantidad: modelo.cantidad,
                idUbicacionDestino: mostrarDestino
                    ? modelo.idUbicacionDestino
                    : null,
                idUbicacionOrigen: mostrarOrigen
                    ? modelo.idUbicacionOrigen
                    : null,
            })
        );
        publicar("lectura_registrada");
        init();
    }, [modelo, publicar, orden.id, intentar, init, mostrarDestino, mostrarOrigen]);

    const skuProps = uiProps("sku");
    const ubicacionDestinoProps = uiProps("idUbicacionDestino");
    const ubicacionOrigenProps = uiProps("idUbicacionOrigen");

    return (
        <div className="LecturaOrden">
            <h3>LECTURA</h3>
            <quimera-formulario>
                <Articulo
                    {...skuProps}
                />
                <QInput label="Cantidad" {...uiProps("cantidad")} />
                {mostrarOrigen && (
                    <Ubicacion
                        {...ubicacionOrigenProps}
                        // valor={modelo.idUbicacionOrigen ?? ""}
                        // label="Ubicación origen"
                        // nombre="idUbicacionOrigen"
                        // onChange={ubicacionOrigenProps.onChange}
                    />
                )}
                {mostrarDestino && (
                    <Ubicacion
                        {...ubicacionDestinoProps}
                        // valor={modelo.idUbicacionDestino ?? ""}
                        // label="Ubicación destino"
                        // nombre="idUbicacionDestino"
                        // onChange={ubicacionDestinoProps.onChange}
                    />
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
