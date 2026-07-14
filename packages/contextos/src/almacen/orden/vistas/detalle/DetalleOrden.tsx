import { Almacen } from "#/almacen/comun/componentes/Almacen.tsx";
import { Caja } from "#/almacen/comun/componentes/Caja.tsx";
import { Ubicacion } from "#/almacen/comun/componentes/Ubicacion.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { Detalle } from "@olula/componentes/detalle/Detalle.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.js";
import { QInput } from "@olula/componentes/index.js";
import { EmitirEvento } from "@olula/lib/diseño.js";
import { listaEntidadesInicial } from "@olula/lib/ListaEntidades.js";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useCallback, useEffect } from "react";
import { useParams } from "react-router";
import { TipoOrden } from "../../../comun/componentes/TipoOrden.tsx";
import { LineaOrdenAlmacen, OrdenAlmacen } from "../../diseño.ts";
import { metaOrden, ordenVacia } from "../../dominio.ts";
import { BorrarOrden } from "../borrar/BorrarOrden.tsx";
import { guardarOrden } from "./detalle.ts";
import "./DetalleOrden.css";
import { LecturaOrden } from "./lectura/LecturaOrden.tsx";
import { LineasOrden } from "./lineas/LineasOrden.tsx";
import { ContextoOrdenAlmacen, getMaquina } from "./maquina.ts";

const titulo = (orden: OrdenAlmacen) => orden.tipo || orden.id;

export const DetalleOrden = ({
    id,
    publicar = async () => {},
}: {
    id?: string;
    publicar?: EmitirEvento;
}) => {
    const params = useParams();
    const ordenId = id ?? params.id;

    const contextoInicial: ContextoOrdenAlmacen = {
        estado: "INICIAL",
        orden: ordenVacia(),
        lineas: listaEntidadesInicial<LineaOrdenAlmacen>(),
    };

    const { ctx, emitir } = useMaquina(getMaquina, contextoInicial, publicar);

    const autoGuardar = useCallback(
        async (orden: OrdenAlmacen) => {
            await guardarOrden(ctx, orden);
            await emitir("orden_guardada");
        },
        [ctx, emitir]
    );

    const orden = useModelo(metaOrden, ctx.orden, autoGuardar);
    const { modelo } = orden;

    console.log("modelo", modelo);
    const mostrarOrigen = ["SALIDA", "TRASPASO"].includes(modelo.tipo);
    const mostrarDestino = ["ENTRADA", "TRASPASO"].includes(modelo.tipo);

    useEffect(() => {
        if (ordenId) {
            emitir("orden_id_cambiada", ordenId, true);
        }
    }, [ordenId]);

    if (!ctx.orden.id) return null;

    return (
        <Detalle
            id={ordenId}
            obtenerTitulo={titulo}
            setEntidad={() => {}}
            entidad={ctx.orden}
            cerrarDetalle={() => publicar("cancelar_seleccion")}
        >
            <div className="maestro-botones">
                <QBoton onClick={() => emitir("borrado_solicitado")}>Borrar</QBoton>
            </div>
            <div className="DetalleOrden">
                <quimera-formulario>
                    <TipoOrden {...orden.uiProps("tipo")} soloTexto />
                    <Almacen {...orden.uiProps("almacenId")} soloTexto />
                    <QInput label="Fecha" {...orden.uiProps("fecha")} soloTexto />
                    <QInput label="Abierta" {...orden.uiProps("abierta")} soloTexto />
                    {mostrarOrigen && (
                        <Caja
                            {...orden.uiProps("cajaOrigenId")}
                            label="Caja origen"
                            nombre="cajaOrigenId"
                        />
                    )}
                    {mostrarOrigen && (
                        <Ubicacion
                            {...orden.uiProps("ubicacionOrigenId")}
                            label="Ubicación origen"
                            nombre="ubicacionOrigenId"
                        />
                    )}
                    {mostrarDestino && (
                        <Caja
                            {...orden.uiProps("cajaDestinoId")}
                            label="Caja destino"
                            nombre="cajaDestinoId"
                        />
                    )}
                    {mostrarDestino && (
                        <Ubicacion
                            {...orden.uiProps("ubicacionDestinoId", "ubicacionDestino")}
                            label="Ubicación destino"
                            nombre="ubicacionDestinoId"
                        />
                    )}
                </quimera-formulario>
            </div>
            <LecturaOrden publicar={emitir} orden={modelo} tipo={modelo.tipo} />
            <LineasOrden
                orden={ctx.orden}
                lineas={ctx.lineas}
                estado={ctx.estado}
                publicar={emitir}
            />

            {ctx.estado === "BORRANDO" && (
                <BorrarOrden
                    publicar={emitir}
                    orden={ctx.orden}
                />
            )}
        </Detalle>
    );
};
