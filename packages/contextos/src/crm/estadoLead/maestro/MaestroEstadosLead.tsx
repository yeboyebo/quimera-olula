import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.js";
import { ListadoControlado } from "@olula/componentes/maestro/ListadoControlado.js";
import { MaestroDetalleControlado } from "@olula/componentes/maestro/MaestroDetalleControlado.tsx";
import { Criteria } from "@olula/lib/diseño.js";
import { criteriaDefecto } from "@olula/lib/dominio.js";
import { listaEntidadesInicial } from "@olula/lib/ListaEntidades.js";
import { useCallback, useEffect, useState } from "react";
import { CrearEstadoLead } from "../crear/CrearEstadoLead.tsx";
import { DetalleEstadoLead } from "../detalle/DetalleEstadoLead.tsx";
import { EstadoLead } from "../diseño.ts";
import { metaTablaEstadoLead } from "./maestro.ts";
import "./MaestroEstadosLead.css";
import { getMaquina } from "./maquina.ts";

export const MaestroEstadosLead = () => {
  const [cargando, setCargando] = useState(false);

  const { ctx, emitir } = useMaquina(getMaquina, {
    estado: "INICIAL",
    estados_lead: listaEntidadesInicial<EstadoLead>(),
  });

  const recargar = useCallback(
    async (criteria: Criteria) => {
      setCargando(true);
      await emitir("recarga_de_estados_lead_solicitada", criteria);
      setCargando(false);
    },
    [emitir, setCargando]
  );

  useEffect(() => {
    recargar(criteriaDefecto);
  }, []);

  return (
    <div className="EstadoLead">
      <MaestroDetalleControlado<EstadoLead>
        Maestro={
          <>
            <h2>Estados de Lead</h2>

            <div className="maestro-botones">
              <QBoton
                onClick={() => emitir("creacion_de_estado_lead_solicitada")}
              >
                Nuevo
              </QBoton>
            </div>

            <ListadoControlado<EstadoLead>
              metaTabla={metaTablaEstadoLead}
              metaFiltro={true}
              cargando={cargando}
              criteriaInicial={criteriaDefecto}
              modo={"tabla"}
              // setModo={handleSetModoVisualizacion}
              // tarjeta={tarjeta}
              entidades={ctx.estados_lead.lista}
              totalEntidades={ctx.estados_lead.total}
              seleccionada={ctx.estados_lead.activo}
              onSeleccion={(payload) =>
                emitir("estado_lead_seleccionado", payload)
              }
              onCriteriaChanged={recargar}
            />
          </>
        }
        Detalle={
          <DetalleEstadoLead
            inicial={ctx.estados_lead.activo}
            publicar={emitir}
          />
        }
        seleccionada={ctx.estados_lead.activo}
        modoDisposicion="maestro-50"
      />

      {ctx.estado === "CREANDO" && <CrearEstadoLead publicar={emitir} />}
    </div>
  );
};
