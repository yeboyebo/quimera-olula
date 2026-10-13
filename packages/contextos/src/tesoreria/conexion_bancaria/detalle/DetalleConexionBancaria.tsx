import { Detalle } from "@olula/componentes/detalle/Detalle.tsx";
import { Tab, Tabs } from "@olula/componentes/detalle/tabs/Tabs.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.js";
import { QuimeraAcciones } from "@olula/componentes/index.js";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useModelo } from "@olula/lib/useModelo.js";
import { useEffect } from "react";
import { ConexionBancaria } from "../diseño.js";
import { nombreInstitucion, requiereReautenticacion } from "../dominio.js";
import { CuentasConexionBancaria } from "./cuentas/CuentasConexionBancaria.js";
import { contextoDetalleConexionBancariaInicial, metaConexionBancaria } from "./detalle.js";
import "./DetalleConexionBancaria.css";
import { DesconectarConexionBancaria } from "../desconectar/DesconectarConexionBancaria.js";
import { ReautenticarBancoConexionBancaria } from "../reautenticar/ReautenticarBancoConexionBancaria.js";
import { getMaquina } from "./maquina.js";
import { TabGeneral } from "./TabGeneral.js";

/**
 * Detalle de solo lectura salvo por la asociación de cuentas (ver
 * detalle/cuentas/CuentasConexionBancaria.tsx, que se auto-guarda por fila).
 * No hay edición de la cabecera: la gestiona el proveedor bancario.
 */
export const DetalleConexionBancaria = ({
    id,
    publicar = async () => {},
}: {
    id?: string;
    publicar?: EmitirEvento;
}) => {

    const { ctx, emitir } = useMaquina(
        getMaquina,
        contextoDetalleConexionBancariaInicial,
        publicar
    );

    const formModelo = useModelo(metaConexionBancaria, ctx.conexion);

    const { estado, conexion } = ctx;

    useEffect(() => {
        emitir("conexion_bancaria_id_cambiado", id, true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    if (!ctx.conexion.id) return null;

    const titulo = (c: ConexionBancaria) => nombreInstitucion(c);

    const acciones = [
        requiereReautenticacion(conexion) && {
            texto: "Reautenticar banco",
            onClick: () => emitir("reautenticacion_solicitada"),
            advertencia: true,
        },
        {
            texto: "Desconectar",
            onClick: () => emitir("desconexion_solicitada"),
            advertencia: true,
        },
    ];

    return (
        <Detalle
            id={id}
            obtenerTitulo={titulo}
            setEntidad={() => {}}
            entidad={ctx.conexion}
            cerrarDetalle={() => emitir("conexion_bancaria_deseleccionada", null, true)}
        >
            <div className="DetalleConexionBancaria">
                <div className="maestro-botones">
                    <QuimeraAcciones acciones={acciones} vertical />
                </div>
                <Tabs children={[
                    <Tab label="General"
                        key="tab-general"
                        children={<TabGeneral form={formModelo} />}
                    />,
                    <Tab label={`Cuentas (${conexion.cuentas.length})`}
                        key="tab-cuentas"
                        children={
                            <CuentasConexionBancaria
                                conexionId={conexion.id}
                                cuentas={conexion.cuentas}
                                publicar={emitir}
                            />
                        }
                    />,
                ]} />
            </div>

            {estado === "REAUTENTICANDO" && (
                <ReautenticarBancoConexionBancaria
                    conexion={ctx.conexion}
                    publicar={emitir}
                />
            )}

            {estado === "DESCONECTANDO" && (
                <DesconectarConexionBancaria
                    conexion={ctx.conexion}
                    publicar={emitir}
                />
            )}
        </Detalle>
    );
};
