import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { MetaTabla } from "@olula/componentes/atomos/qtabla.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.js";
import { Listado } from "@olula/componentes/maestro/Listado.tsx";
import { MaestroDetalle } from "@olula/componentes/maestro/MaestroDetalle.tsx";
import { listaActivaEntidadesInicial } from "@olula/lib/ListaActivaEntidades.js";
import { getUrlParams, useUrlParams } from "@olula/lib/url-params.js";
import { useEffect } from "react";
import { ItemOrdenAlmacen } from "../../diseño.ts";
import { DetalleOrden } from "../detalle/DetalleOrden.tsx";
import { CrearOrden } from "../CrearOrden.tsx";
import { Contexto, getMaquina } from "./maquina_maestro_orden.ts";

const metaTablaOrden: MetaTabla<ItemOrdenAlmacen> = [
    { id: "id", cabecera: "ID" },
    { id: "tipo", cabecera: "Tipo" },
    { id: "fecha", cabecera: "Fecha" },
    { id: "estado", cabecera: "Estado" },
    { id: "abierta", cabecera: "Abierta", tipo: "booleano" },
];

export const MaestroOrden = () => {
    const { id, criteria } = getUrlParams();

    const { ctx, emitir } = useMaquina(getMaquina, {
        estado: "INICIAL",
        ordenes: listaActivaEntidadesInicial<ItemOrdenAlmacen>(id, criteria),
    } as Contexto);

    useUrlParams(ctx.ordenes.activo, ctx.ordenes.criteria);

    useEffect(() => {
        emitir("recarga_solicitada", ctx.ordenes.criteria);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="OrdenAlmacen">
            <MaestroDetalle<ItemOrdenAlmacen>
                seleccionada={ctx.ordenes.activo}
                layout="TABLA"
                Maestro={
                    <>
                        <h2>Órdenes</h2>
                        <div className="maestro-botones">
                            <QBoton onClick={() => emitir("crear")}>Nueva orden</QBoton>
                        </div>
                        <Listado<ItemOrdenAlmacen>
                            metaTabla={metaTablaOrden}
                            criteria={ctx.ordenes.criteria}
                            modo="tabla"
                            entidades={ctx.ordenes.lista}
                            totalEntidades={ctx.ordenes.total}
                            seleccionada={ctx.ordenes.activo}
                            onSeleccion={(payload) =>
                                emitir("orden_seleccionada", payload)
                            }
                            onCriteriaChanged={(payload) =>
                                emitir("criteria_cambiado", payload)
                            }
                        />
                    </>
                }
                Detalle={
                    <DetalleOrden
                        id={ctx.ordenes.activo}
                        publicar={emitir}
                    />
                }
            />
            <CrearOrden
                publicar={emitir}
                activo={ctx.estado === "CREANDO"}
            />
        </div>
    );
};
