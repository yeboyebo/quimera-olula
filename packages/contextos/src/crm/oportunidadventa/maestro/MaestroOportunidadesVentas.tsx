import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import type { QKanbanColumna } from "@olula/componentes/atomos/qkanban.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.js";
import { Listado } from "@olula/componentes/maestro/Listado.js";
import { MaestroDetalle } from "@olula/componentes/maestro/MaestroDetalle.tsx";
import type { Filtro, Orden } from "@olula/lib/diseño.ts";
import { criteriaDefecto } from "@olula/lib/dominio.ts";
import { listaActivaEntidadesInicial } from "@olula/lib/ListaActivaEntidades.js";
import { getUrlParams, useUrlParams } from "@olula/lib/url-params.js";
import { useEffect, useMemo, useState } from "react";
import { CrearOportunidadVenta } from "../crear/CrearOportunidadVenta.tsx";
import { DetalleOportunidadVenta } from "../detalle/DetalleOportunidadVenta.tsx";
import { EstadoOportunidad, OportunidadVenta } from "../diseño.ts";
import { getEstadosOportunidadVenta } from "../infraestructura.ts";
import { metaTablaOportunidadVenta } from "./maestro.ts";
import "./MaestroOportunidadesVenta.css";
import { getMaquina } from "./maquina.ts";
import { TarjetaOportunidadVenta } from "./TarjetaOportunidadVenta.tsx";
import { TarjetaOportunidadVentaKanban } from "./TarjetaOportunidadVentaKanban.tsx";

export const MaestroOportunidades = () => {
  const { id, criteria } = getUrlParams();
  const [columnasKanban, setColumnasKanban] = useState<QKanbanColumna[]>([]);
  const [estadosOportunidad, setEstadosOportunidad] = useState<
    EstadoOportunidad[]
  >([]);
  const [modoListado, setModoListado] = useState<
    "tabla" | "tarjetas" | "kanban"
  >("tarjetas");
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
              criteria={ctx.oportunidades.criteria}
              tarjeta={TarjetaOportunidadVenta}
              tarjetaKanban={TarjetaOportunidadVentaKanban}
              entidades={ctx.oportunidades.lista}
              totalEntidades={ctx.oportunidades.total}
              columnasKanban={columnasKanban}
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
                setModoListado(nuevoModo);

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
        modoDisposicion={
          modoListado === "kanban" ? "pantalla-completa" : "maestro-50"
        }
      />

      {ctx.estado === "CREANDO" && <CrearOportunidadVenta publicar={emitir} />}
    </div>
  );
};
