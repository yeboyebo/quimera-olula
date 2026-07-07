import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import type { QKanbanColumna } from "@olula/componentes/atomos/qkanban.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.js";
import { Listado } from "@olula/componentes/maestro/Listado.js";
import { MaestroDetalle } from "@olula/componentes/maestro/MaestroDetalle.tsx";
import { getMetaFiltroDefecto } from "@olula/componentes/maestro/maestroFiltros/MaestroFiltrosActivoControlado.js";
import type { ClausulaFiltro, Filtro, Orden } from "@olula/lib/diseño.ts";
import { criteriaDefecto } from "@olula/lib/dominio.ts";
import { listaActivaEntidadesInicial } from "@olula/lib/ListaActivaEntidades.js";
import { getUrlParams, useUrlParams } from "@olula/lib/url-params.js";
import { useEffect, useMemo, useState } from "react";
import { CrearOportunidadVenta } from "../crear/CrearOportunidadVenta.tsx";
import { DetalleOportunidadVenta } from "../detalle/DetalleOportunidadVenta.tsx";
import { EstadoOportunidad, OportunidadVenta } from "../diseño.ts";
import { getEstadosOportunidadVenta } from "../infraestructura.ts";
import { FiltroEstadosCheckboxes } from "./FiltroEstadosCheckboxes.tsx";
import { metaTablaOportunidadVenta } from "./maestro.ts";
import "./MaestroOportunidadesVenta.css";
import { getMaquina } from "./maquina.ts";
import { TarjetaOportunidadVenta } from "./TarjetaOportunidadVenta.tsx";
import { TarjetaOportunidadVentaKanban } from "./TarjetaOportunidadVentaKanban.tsx";

export const MaestroOportunidades = () => {
  const { id, criteria } = getUrlParams();
  const modoUrl = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("modo");
  }, []);
  const [columnasKanban, setColumnasKanban] = useState<QKanbanColumna[]>([]);
  const [estadosOportunidad, setEstadosOportunidad] = useState<
    EstadoOportunidad[]
  >([]);
  const [modoActual, setModoActual] = useState<"tabla" | "tarjetas" | "kanban">(
    modoUrl === "kanban" ? "kanban" : "tarjetas"
  );
  const criteriaBaseOportunidades = useMemo(
    () => ({
      ...criteriaDefecto,
      orden: ["probabilidad", "DESC"] as unknown as Orden,
    }),
    []
  );

  const criteriaInicial =
    criteria.filtro.length > 0 ||
    criteria.orden.toString() !== criteriaDefecto.orden.toString()
      ? criteria
      : criteriaBaseOportunidades;

  const { ctx, emitir } = useMaquina(getMaquina, {
    estado: "INICIAL",
    oportunidades: listaActivaEntidadesInicial<OportunidadVenta>(
      id,
      criteriaInicial
    ),
  });

  const columnasKanbanFiltradas = useMemo(() => {
    const filtroArray = Array.isArray(ctx.oportunidades.criteria.filtro)
      ? (ctx.oportunidades.criteria.filtro as ClausulaFiltro[])
      : [];

    const filtrosEstado = filtroArray.filter(
      ([campo, operador]) =>
        campo === "estado_id" && (operador === "in" || operador === "!in")
    );

    if (!filtrosEstado.length) return columnasKanban;

    return columnasKanban.filter((columna) => {
      const idColumna = String(columna.id);

      return filtrosEstado.every(([, operador, valor]) => {
        const valores = Array.isArray(valor)
          ? valor.map(String)
          : String(valor)
              .split(",")
              .map((v) => v.trim())
              .filter(Boolean);

        if (operador === "in") return valores.includes(idColumna);
        if (operador === "!in") return !valores.includes(idColumna);
        return true;
      });
    });
  }, [ctx.oportunidades.criteria.filtro, columnasKanban]);

  useUrlParams(ctx.oportunidades.activo, ctx.oportunidades.criteria);

  useEffect(() => {
    emitir("recarga_de_oportunidades_solicitada", ctx.oportunidades.criteria);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let activo = true;

    const cargarColumnasKanban = async () => {
      const criteriosEstados = {
        filtro: [] as unknown as Filtro,
        orden: ["id"] as unknown as Orden,
      };

      const estados = await getEstadosOportunidadVenta(
        criteriosEstados.filtro,
        criteriosEstados.orden
      );

      if (!activo) return;

      setEstadosOportunidad(estados);

      setColumnasKanban(
        estados.map((estado) => ({
          id: String(estado.id),
          etiqueta: estado.descripcion ?? String(estado.id),
        }))
      );
    };

    cargarColumnasKanban();

    return () => {
      activo = false;
    };
  }, []);

  return (
    <div className="OportunidadesVenta">
      <MaestroDetalle<OportunidadVenta>
        Maestro={
          <>
            <h2>Oportunidades de Venta</h2>

            <Listado<OportunidadVenta>
              metaTabla={metaTablaOportunidadVenta}
              metaFiltro={{
                ...getMetaFiltroDefecto(metaTablaOportunidadVenta),
                estado_id: {
                  id: "estado_id",
                  label: "Estado",
                  filtro: () => null, // El filtro se maneja en el componente de checkboxes
                  render: () => {
                    const filtroArray = Array.isArray(
                      ctx.oportunidades.criteria.filtro
                    )
                      ? ctx.oportunidades.criteria.filtro
                      : [];
                    return (
                      <FiltroEstadosCheckboxes
                        estados={estadosOportunidad}
                        filtroActual={filtroArray}
                        onChange={(nuevoFiltro) => {
                          const filtroFiltrado = filtroArray.filter(
                            (f) => f[0] !== "estado_id"
                          );
                          emitir("criteria_cambiado", {
                            ...ctx.oportunidades.criteria,
                            filtro: nuevoFiltro
                              ? [...filtroFiltrado, nuevoFiltro]
                              : filtroFiltrado,
                          });
                        }}
                      />
                    );
                  },
                },
              }}
              criteria={ctx.oportunidades.criteria}
              modo={modoActual}
              mostrarCambioModo
              tarjeta={TarjetaOportunidadVenta}
              tarjetaKanban={TarjetaOportunidadVentaKanban}
              entidades={ctx.oportunidades.lista}
              totalEntidades={ctx.oportunidades.total}
              columnasKanban={columnasKanbanFiltradas}
              campoEstadoKanban="estado_id"
              onCambioEstadoKanban={(idOportunidad, nuevoEstado) => {
                const estadoDestino = estadosOportunidad.find(
                  (estado) => String(estado.id) === nuevoEstado
                );

                emitir("estado_oportunidad_cambiado", {
                  idOportunidad,
                  nuevoEstado,
                  descripcionEstado: estadoDestino?.descripcion,
                  probabilidadEstado: estadoDestino?.probabilidad,
                });
              }}
              onModoChanged={(nuevoModo) => {
                setModoActual(nuevoModo);

                if (nuevoModo === "kanban") {
                  emitir("oportunidad_deseleccionada");
                }
              }}
              seleccionada={ctx.oportunidades.activo}
              renderAcciones={() => (
                <div className="maestro-botones">
                  <QBoton
                    onClick={() => emitir("creacion_de_oportunidad_solicitada")}
                  >
                    Nueva
                  </QBoton>
                </div>
              )}
              onSeleccion={(payload) =>
                emitir("oportunidad_seleccionada", payload)
              }
              onCriteriaChanged={(payload) =>
                emitir("criteria_cambiado", payload)
              }
            />
          </>
        }
        Detalle={
          <DetalleOportunidadVenta
            id={ctx.oportunidades.activo}
            publicar={emitir}
          />
        }
        seleccionada={ctx.oportunidades.activo}
        nombreModal="detalleOportunidadKanban"
        onCerrarDetalle={() => emitir("oportunidad_deseleccionada")}
        modoDisposicion={modoActual === "kanban" ? "modal" : "maestro-50"}
      />

      {ctx.estado === "CREANDO" && <CrearOportunidadVenta publicar={emitir} />}
    </div>
  );
};
