import { useMaquina } from "@olula/componentes/hook/useMaquina.ts";
import { MaestroDetalle } from "@olula/componentes/maestro/MaestroDetalle.tsx";
import { criteriaDefecto, puede } from "@olula/lib/dominio.js";
import { listaActivaEntidadesInicial } from "@olula/lib/ListaActivaEntidades.js";
import { getUrlParams, useUrlParams } from "@olula/lib/url-params.js";
import { useEffect, useMemo } from "react";
import { CrearCredencialExterna } from "../crear/CrearCredencialExterna.js";
import { DetalleCredencialExterna } from "../detalle/DetalleCredencialExterna.js";
import { CredencialExterna } from "../diseño.js";
import "./MaestroConDetalleCredencialExterna.css";
import { getMaquina } from "./maquina.js";
import { RejillaCredenciales } from "./RejillaCredenciales.js";

/**
 * Componente principal: rejillas de tiles (LLM / Conectores) + detalle de
 * credenciales de terceros. Sustituye la tabla clásica por un tile con el
 * icono del proveedor por credencial — más visual y directo para elegir
 * "qué IA/plugin configurar" que una tabla genérica.
 */
export const MaestroConDetalleCredencialExterna = () => {

    const criteriaBase = useMemo(() => criteriaDefecto, []);

    const { id, criteria } = getUrlParams();
    const criteriaInicial = criteria.filtro.length > 0 ? criteria : criteriaBase;

    const { ctx, emitir } = useMaquina(getMaquina, {
        estado: "INICIAL",
        credenciales: listaActivaEntidadesInicial<CredencialExterna>(id, criteriaInicial),
        categoriaCreando: "conector",
    });

    const { estado, credenciales, categoriaCreando } = ctx;

    useUrlParams(credenciales.activo, credenciales.criteria);

    useEffect(() => {
        emitir("recarga_solicitada", credenciales.criteria);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const puedeCrear = puede("comun.credencial_externa");
    const llm = credenciales.lista.filter((c) => c.categoria === "llm");
    const conectores = credenciales.lista.filter((c) => c.categoria === "conector");

    return (
        <div className="CredencialExterna">
            <MaestroDetalle<CredencialExterna>
                Maestro={
                    <>
                        <h2>Credenciales</h2>
                        <RejillaCredenciales
                            titulo="Modelo de IA"
                            credenciales={llm}
                            onSeleccion={(payload) => emitir("credencial_externa_seleccionada", payload)}
                            onCrear={() => emitir("creacion_solicitada", "llm")}
                            puedeCrear={puedeCrear}
                            textoCrear="Configurar LLM"
                        />
                        <RejillaCredenciales
                            titulo="Conectores"
                            credenciales={conectores}
                            onSeleccion={(payload) => emitir("credencial_externa_seleccionada", payload)}
                            onCrear={() => emitir("creacion_solicitada", "conector")}
                            puedeCrear={puedeCrear}
                            textoCrear="Nuevo conector"
                        />
                    </>
                }
                Detalle={<DetalleCredencialExterna id={credenciales.activo} publicar={emitir} />}
                seleccionada={credenciales.activo}
                modoDisposicion="maestro-50"
            />

            {estado === "CREANDO" && (
                <CrearCredencialExterna
                    categoriaFiltro={categoriaCreando}
                    publicar={emitir}
                />
            )}
        </div>
    );
};
