import { Almacen } from "#/almacen/comun/componentes/Almacen.tsx";
import { Caja } from "#/almacen/comun/componentes/Caja.tsx";
import { Ubicacion } from "#/almacen/comun/componentes/Ubicacion.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { Detalle } from "@olula/componentes/detalle/Detalle.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.js";
import { QInput } from "@olula/componentes/index.js";
import { ContextoError } from "@olula/lib/contexto.ts";
import { EmitirEvento } from "@olula/lib/diseño.js";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useContext, useEffect } from "react";
import { useParams } from "react-router";
import { TipoOrden } from "../../../comun/componentes/TipoOrden.tsx";
import { metaOrden, ordenVaciaInicial } from "../../dominio.ts";
import { cambiarOrden } from "../../infraestructura.ts";
import { BorrarLineaOrden } from "../borrar_linea/BorrarLineaOrden.tsx";
import { BorrarOrden } from "./BorrarOrden.tsx";
import { ContextoOrdenAlmacen } from "./detalle.ts";
import "./DetalleOrden.css";
import { LecturaOrden } from "./lectura/LecturaOrden.tsx";
import { LineasOrden } from "./lineas/LineasOrden.tsx";
import { getMaquina } from "./maquina_detalle_orden.ts";

const titulo = (orden: ContextoOrdenAlmacen["orden"]) => orden.tipoOrden || orden.id;

export const DetalleOrden = ({
    id,
    publicar = async () => {},
}: {
    id?: string;
    publicar?: EmitirEvento;
}) => {
    const params = useParams();
    const { intentar } = useContext(ContextoError);

    const ordenId = id ?? params.id;

    const contextoInicial: ContextoOrdenAlmacen = {
        estado: "INICIAL",
        orden: ordenVaciaInicial,
        lineaActiva: null,
    };

    const { ctx, emitir } = useMaquina(getMaquina, contextoInicial, publicar);

    const orden = useModelo(metaOrden, ctx.orden);
    const { modelo, init } = orden;

    const mostrarOrigen = ["SALIDA", "TRASPASO"].includes(modelo.tipoOrden);
    const mostrarDestino = ["ENTRADA", "TRASPASO"].includes(modelo.tipoOrden);

    useEffect(() => {
        if (ordenId) {
            emitir("orden_id_cambiada", ordenId, true);
        }
    }, [ordenId]);

    const guardar = async () => {
        await intentar(() => cambiarOrden(modelo.id, modelo));
        emitir("orden_guardada");
    };

    const cancelar = () => {
        init();
    };
    console.log("Estado", ctx.estado)

    return (
        <Detalle
            id={ordenId}
            obtenerTitulo={titulo}
            setEntidad={() => {}}
            entidad={ctx.orden.id ? ctx.orden : null}
            cerrarDetalle={() => publicar("cancelar_seleccion")}
        >
            {!!ordenId && (
                <>
                    <div className="maestro-botones">
                        <QBoton onClick={() => emitir("borrar")}>Borrar</QBoton>
                    </div>
                    <div className="DetalleOrden">
                        <quimera-formulario>
                            <TipoOrden {...orden.uiProps("tipoOrden")} soloTexto />
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
                                    {...orden.uiProps("ubicacionDestinoId")}
                                    label="Ubicación destino"
                                    nombre="ubicacionDestinoId"
                                />
                            )}
                        </quimera-formulario>
                    </div>
                    {orden.modificado && (
                        <div className="botones maestro-botones">
                            <QBoton onClick={guardar} deshabilitado={!orden.valido}>
                                Guardar
                            </QBoton>
                            <QBoton
                                tipo="reset"
                                variante="texto"
                                onClick={cancelar}
                                deshabilitado={!orden.modificado}
                            >
                                Cancelar
                            </QBoton>
                        </div>
                    )}
                    <LecturaOrden publicar={emitir} orden={modelo} tipoOrden={modelo.tipoOrden} />
                    <LineasOrden ordenId={ordenId} lineas={ctx.orden.lineas} publicar={emitir} />
                    <BorrarOrden
                        publicar={emitir}
                        activo={ctx.estado === "BORRANDO"}
                        orden={ctx.orden}
                    />
                    {ctx.estado === "BORRANDO_LINEA" && ctx.lineaActiva && (
                        <BorrarLineaOrden
                            publicar={emitir}
                            linea={ctx.lineaActiva}
                            ordenId={ctx.orden.id}
                        />
                    )}
                </>
            )}
        </Detalle>
    );
};
