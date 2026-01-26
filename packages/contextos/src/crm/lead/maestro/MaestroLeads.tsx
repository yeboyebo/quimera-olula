import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.js";
import { ListadoControlado } from "@olula/componentes/maestro/ListadoControlado.js";
import { MaestroDetalleControlado } from "@olula/componentes/maestro/MaestroDetalleControlado.tsx";
import { Criteria } from "@olula/lib/diseño.js";
import { criteriaDefecto } from "@olula/lib/dominio.js";
import { listaEntidadesInicial } from "@olula/lib/ListaEntidades.js";
import { useCallback, useEffect, useState } from "react";
import { CrearLead } from "../crear/CrearLead.tsx";
import { DetalleLead } from "../detalle/DetalleLead.tsx";
import { Lead } from "../diseño.ts";
import { metaTablaLead } from "./maestro.ts";
import "./MaestroLeads.css";
import { getMaquina } from "./maquina.ts";

export const MaestroLeads = () => {
  const [cargando, setCargando] = useState(false);

  const { ctx, emitir } = useMaquina(getMaquina, {
    estado: "INICIAL",
    leads: listaEntidadesInicial<Lead>(),
  });

  const crear = useCallback(
    () => emitir("creacion_de_lead_solicitada"),
    [emitir]
  );

  const setSeleccionado = useCallback(
    (payload: Lead) => emitir("lead_seleccionado", payload),
    [emitir]
  );

  const recargar = useCallback(
    async (criteria: Criteria) => {
      setCargando(true);
      await emitir("recarga_de_leads_solicitada", criteria);
      setCargando(false);
    },
    [emitir, setCargando]
  );

  useEffect(() => {
    recargar(criteriaDefecto);
  }, []);

  return (
    <div className="Lead">
      <MaestroDetalleControlado<Lead>
        Maestro={
          <>
            <h2>Leads</h2>
            <div className="maestro-botones">
              <QBoton onClick={crear}>Nuevo</QBoton>
            </div>
            <ListadoControlado<Lead>
              metaTabla={metaTablaLead}
              metaFiltro={true}
              cargando={cargando}
              criteriaInicial={criteriaDefecto}
              modo={"tabla"}
              // setModo={handleSetModoVisualizacion}
              // tarjeta={tarjeta}
              entidades={ctx.leads.lista}
              totalEntidades={ctx.leads.total}
              seleccionada={ctx.leads.activo}
              onSeleccion={setSeleccionado}
              onCriteriaChanged={recargar}
            />
          </>
        }
        Detalle={<DetalleLead inicial={ctx.leads.activo} publicar={emitir} />}
        seleccionada={ctx.leads.activo}
        modoDisposicion="maestro-50"
      />
      {ctx.estado === "CREANDO" && <CrearLead publicar={emitir} />}
    </div>
  );
};
