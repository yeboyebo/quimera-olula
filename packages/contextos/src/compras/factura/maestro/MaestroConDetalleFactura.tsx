import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.ts";
import { Listado } from "@olula/componentes/maestro/Listado.js";
import { MaestroDetalle } from "@olula/componentes/maestro/MaestroDetalle.tsx";
import { criteriaDefecto } from "@olula/lib/dominio.ts";
import { listaActivaEntidadesInicial } from "@olula/lib/ListaActivaEntidades.ts";
import { getUrlParams, useUrlParams } from "@olula/lib/url-params.ts";
import { useEffect, useMemo } from "react";
import { CrearFactura } from "../crear/CrearFactura.tsx";
import { DetalleFactura } from "../detalle/DetalleFactura.tsx";
import { Factura } from "../diseño.ts";
import "./MaestroConDetalleFactura.css";
import { getMaquina } from "./maquina.ts";
import { metaTablaFactura } from "./metatabla_factura.tsx";
import { TarjetaFactura } from "./TarjetaFactura.tsx";

const criteriaFacturas = {
    ...criteriaDefecto,
    orden: ["fecha", "DESC"],
};

export const MaestroConDetalleFactura = () => {
    const criteriaBase = useMemo(() => criteriaFacturas, []);

    const { id, criteria } = getUrlParams();
    const criteriaInicial = criteria.filtro.length > 0 ? criteria : criteriaBase;

    const { ctx, emitir } = useMaquina(getMaquina, {
        estado: "INICIAL",
        facturas: listaActivaEntidadesInicial<Factura>(id, criteriaInicial),
    });

    const { estado, facturas } = ctx;

    useUrlParams(facturas.activo, facturas.criteria);

    useEffect(() => {
        emitir("recarga_de_facturas_solicitada", facturas.criteria);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="Factura">
            <MaestroDetalle<Factura>
                Maestro={
                    <>
                        <h2>Facturas de compra</h2>
                        <Listado<Factura>
                            metaTabla={metaTablaFactura}
                            criteria={facturas.criteria}
                            tarjeta={TarjetaFactura}
                            entidades={facturas.lista}
                            totalEntidades={facturas.total}
                            seleccionada={facturas.activo}
                            renderAcciones={() => (
                                <div className="maestro-botones">
                                    <QBoton onClick={() => emitir("crear_factura_solicitada")}>
                                        Nueva Factura
                                    </QBoton>
                                </div>
                            )}
                            onSeleccion={(payload) => emitir("factura_seleccionada", payload)}
                            onCriteriaChanged={(payload) => emitir("criteria_cambiado", payload)}
                            onSiguientePagina={(payload) => emitir("siguiente_pagina", payload)}
                        />
                    </>
                }
                Detalle={<DetalleFactura id={facturas.activo} publicar={emitir} />}
                seleccionada={facturas.activo}
            />

            {estado === "CREANDO" && <CrearFactura publicar={emitir} />}
        </div>
    );
};
