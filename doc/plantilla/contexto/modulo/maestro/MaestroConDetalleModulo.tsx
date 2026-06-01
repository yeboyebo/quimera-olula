import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.ts";
import { Listado } from "@olula/componentes/maestro/Listado.js";
import { MaestroDetalle } from "@olula/componentes/maestro/MaestroDetalle.tsx";
import { criteriaDefecto } from "@olula/lib/dominio.js";
import { listaActivaEntidadesInicial } from "@olula/lib/ListaActivaEntidades.js";
import { getUrlParams, useUrlParams } from "@olula/lib/url-params.js";
import { useLayout } from "@olula/lib/useLayout.js";
import { useEffect, useMemo } from "react";
import { DetalleModulo } from "../detalle/DetalleModulo.tsx";
import { Modulo } from "../diseño.ts";
import { metaTablaModulo } from "./diseño.ts";
import "./MaestroConDetalleModulo.css";
import { getMaquina } from "./maquina.ts";

/**
 * Componente principal: listado (maestro) + detalle.
 *
 * Patrones aplicados:
 *   - useLayout        → alterna entre vista TARJETA y TABLA
 *   - useUrlParams     → escribe activo y criteria en la URL al cambiar
 *   - getUrlParams     → lee el estado inicial desde la URL (deep link)
 *   - listaActivaEntidadesInicial → inicializa con ID y criteria de la URL
 *   - Listado          → gestiona criteria internamente; emite onCriteriaChanged y onSiguientePagina
 *   - MaestroDetalle   → recibe layout para adaptar la disposición en móvil
 */
export const MaestroConDetalleModulo = () => {
    // Criteria base del módulo (orden por defecto, etc.)
    const criteriaBase = useMemo(() => criteriaDefecto, []);

    // Alterna entre vista TARJETA y TABLA; en móvil siempre usa TARJETA
    const { layout, cambiarLayout } = useLayout("TARJETA");

    // Lee el activo y criteria iniciales desde la URL
    const { id, criteria } = getUrlParams();
    const criteriaInicial = criteria.filtro.length > 0 ? criteria : criteriaBase;

    const { ctx, emitir } = useMaquina(getMaquina, {
        estado: "INICIAL",
        modulos: listaActivaEntidadesInicial<Modulo>(id, criteriaInicial),
    });

    // Escribe activo y criteria en la URL al cambiar
    useUrlParams(ctx.modulos.activo, ctx.modulos.criteria);

    // Carga inicial
    useEffect(() => {
        emitir("recarga_de_modulos_solicitada", ctx.modulos.criteria);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="Modulo">
            <MaestroDetalle<Modulo>
                Maestro={
                    <>
                        <h2>Módulos</h2>
                        <div className="maestro-botones">
                            <QBoton
                                texto={layout === "TARJETA" ? "Cambiar a TABLA" : "Cambiar a TARJETA"}
                                onClick={cambiarLayout}
                            />
                        </div>
                        <Listado<Modulo>
                            metaTabla={metaTablaModulo}
                            criteria={ctx.modulos.criteria}
                            modo={layout === "TARJETA" ? "tarjetas" : "tabla"}
                            tarjeta={TarjetaModulo}
                            entidades={ctx.modulos.lista}
                            totalEntidades={ctx.modulos.total}
                            seleccionada={ctx.modulos.activo}
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
                Detalle={<DetalleModulo id={ctx.modulos.activo} publicar={emitir} />}
                layout={layout}
                seleccionada={ctx.modulos.activo}
                modoDisposicion="maestro-50"
            />
        </div>
    );
};

/**
 * Componente tarjeta para la vista de lista en modo tarjetas.
 * Se define fuera del componente principal para evitar re-renders.
 */
const TarjetaModulo = (modulo: Modulo) => {
    return (
        <div className="tarjeta-modulo" key={modulo.id}>
            <div className="tarjeta-modulo-nombre">{modulo.nombre}</div>
            <div className={`tarjeta-modulo-estado estado-${modulo.estado}`}>
                {modulo.estado}
            </div>
        </div>
    );
};
