import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.ts";
import { Listado } from "@olula/componentes/maestro/Listado.js";
import { MaestroDetalle } from "@olula/componentes/maestro/MaestroDetalle.tsx";
import { criteriaDefecto } from "@olula/lib/dominio.js";
import { listaActivaEntidadesInicial } from "@olula/lib/ListaActivaEntidades.js";
import { getUrlParams, useUrlParams } from "@olula/lib/url-params.js";
import { useLayout } from "@olula/lib/useLayout.js";
import { useEffect, useMemo } from "react";
import { DetalleModulo } from "../detalle/DetalleModulo.js";
import { ModLin } from "../diseño.js";
import { metaTablaModLin } from "./diseño.js";
import { getMaquina } from "./maquina.js";

export const MaestroConDetalleModulo = () => {
    const criteriaBase = useMemo(() => criteriaDefecto, []);

    const { layout, cambiarLayout } = useLayout("TARJETA");

    const { id, criteria } = getUrlParams();
    const criteriaInicial = criteria.filtro.length > 0 ? criteria : criteriaBase;

    const { ctx, emitir } = useMaquina(getMaquina, {
        estado: "INICIAL",
        modLins: listaActivaEntidadesInicial<ModLin>(id, criteriaInicial),
    });

    useUrlParams(ctx.modLins.activo, ctx.modLins.criteria);

    useEffect(() => {
        emitir("recarga_de_modulos_solicitada", ctx.modLins.criteria);
    }, []);

    return (
        <div className="ModLin">
            <MaestroDetalle<ModLin>
                Maestro={
                    <>
                        <h2>Módulos</h2>
                        <div className="maestro-botones">
                            <QBoton
                                texto={layout === "TARJETA" ? "Cambiar a TABLA" : "Cambiar a TARJETA"}
                                onClick={cambiarLayout}
                            />
                        </div>
                        <Listado<ModLin>
                            metaTabla={metaTablaModLin}
                            criteria={ctx.modLins.criteria}
                            modo={layout === "TARJETA" ? "tarjetas" : "tabla"}
                            tarjeta={TarjetaModLin}
                            entidades={ctx.modLins.lista}
                            totalEntidades={ctx.modLins.total}
                            seleccionada={ctx.modLins.activo}
                            renderAcciones={() => (
                                <div className="maestro-botones">
                                    <QBoton onClick={() => emitir("crear_modulo_solicitado")}>
                                        Nuevo Módulo
                                    </QBoton>
                                </div>
                            )}
                            onSeleccion={(payload) => emitir("modulo_seleccionado", payload)}
                            onCriteriaChanged={(payload) => emitir("criteria_cambiado", payload)}
                            onSiguientePagina={(payload) => emitir("siguiente_pagina", payload)}
                        />
                    </>
                }
                Detalle={<DetalleModulo id={ctx.modLins.activo} publicar={emitir} />}
                layout={layout}
                seleccionada={ctx.modLins.activo}
                modoDisposicion="maestro-50"
            />
        </div>
    );
};

const TarjetaModLin = (modLin: ModLin) => {
    return (
        <div className="tarjeta-modulo" key={modLin.id}>
            <div className="tarjeta-modulo-nombre">{modLin.campoString}</div>
        </div>
    );
};
