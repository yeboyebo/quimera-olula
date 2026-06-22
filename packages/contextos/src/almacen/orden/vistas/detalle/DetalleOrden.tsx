import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { Detalle } from "@olula/componentes/detalle/Detalle.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { ProcesarEvento } from "@olula/lib/useMaquina.js";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useContext } from "react";
import { useParams } from "react-router";
import { TipoOrden } from "../../../comun/componentes/TipoOrden.tsx";
import { OrdenAlmacen } from "../../diseño.ts";
import { metaOrden, ordenVacia } from "../../dominio.ts";
import { cambiarOrden, getOrden } from "../../infraestructura.ts";
import { LineasOrden } from "../lineas/LineasOrden.tsx";
import { BorrarOrden } from "./BorrarOrden.tsx";
import { useMaquinaDetalleOrden } from "./maquina_detalle_orden.ts";

const titulo = (orden: OrdenAlmacen) => orden.tipoOrden || orden.id;

export const DetalleOrden = ({
    id,
    publicar = async () => {},
}: {
    id?: string;
    publicar?: ProcesarEvento;
}) => {
    const params = useParams();
    const { intentar } = useContext(ContextoError);

    const orden = useModelo(metaOrden, ordenVacia());
    const { modelo, init } = orden;

    const guardar = async () => {
        await intentar(() => cambiarOrden(modelo.id, modelo));
        recargarCabecera();
        emitir("orden_guardada");
    };

    const cancelar = () => {
        init();
    };

    const [emitir, { estado }] = useMaquinaDetalleOrden(publicar);

    const recargarCabecera = async () => {
        const nuevaOrden = await intentar(() => getOrden(modelo.id));
        init(nuevaOrden);
        publicar("orden_cambiada", nuevaOrden);
    };

    const ordenId = id ?? params.id;

    return (
        <Detalle
            id={ordenId}
            obtenerTitulo={titulo}
            setEntidad={(accionInicial) => init(accionInicial)}
            entidad={modelo}
            cargar={getOrden}
            cerrarDetalle={() => publicar("cancelar_seleccion")}
        >
            {!!ordenId && (
                <>
                    <div className="maestro-botones">
                        <QBoton onClick={() => emitir("borrar")}>Borrar</QBoton>
                    </div>
                    <div className="DetalleOrden">
                        <quimera-formulario>
                            <TipoOrden {...orden.uiProps("tipoOrden")} />
                            <div>
                                <label>Almacén</label>
                                <span>{modelo.almacenId}</span>
                            </div>
                            <div>
                                <label>Fecha</label>
                                <span>{modelo.fecha}</span>
                            </div>
                            <div>
                                <label>Abierta</label>
                                <span>{modelo.abierta ? "Sí" : "No"}</span>
                            </div>
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
                    <LineasOrden ordenId={ordenId} />
                    <BorrarOrden
                        publicar={emitir}
                        activo={estado === "Borrando"}
                        orden={modelo}
                    />
                </>
            )}
        </Detalle>
    );
};
