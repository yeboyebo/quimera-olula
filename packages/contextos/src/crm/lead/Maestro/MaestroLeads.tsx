import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { ListadoControlado } from "@olula/componentes/maestro/ListadoControlado.js";
import { MaestroDetalleControlado } from "@olula/componentes/maestro/MaestroDetalleControlado.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { Criteria } from "@olula/lib/diseño.js";
import { criteriaDefecto, procesarEvento } from "@olula/lib/dominio.js";
import { useCallback, useContext, useEffect, useState } from "react";
import { CrearLead } from "../Crear/CrearLead.tsx";
import { DetalleLead } from "../Detalle/DetalleLead.tsx";
import { Lead } from "../diseño.ts";
import { ContextoMaestroLeads } from "./diseño.ts";
import { metaTablaLead } from "./maestro.ts";
import "./MaestroLeads.css";
import { getMaquina } from "./maquina.ts";

const maquina = getMaquina();

export const MaestroLeads = () => {
  const { intentar } = useContext(ContextoError);

  const [cargando, setCargando] = useState(false);

  const [ctx, setCtx] = useState<ContextoMaestroLeads>({
    estado: "INICIAL",
    leads: [],
    totalLeads: 0,
    activo: null,
  });

  const emitir = useCallback(
    async (evento: string, payload?: unknown) => {
      const [nuevoContexto, _] = await intentar(() =>
        procesarEvento(maquina, ctx, evento, payload)
      );
      setCtx(nuevoContexto);
    },
    [ctx, setCtx, intentar]
  );

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
              entidades={ctx.leads}
              totalEntidades={ctx.totalLeads}
              seleccionada={ctx.activo}
              onSeleccion={setSeleccionado}
              onCriteriaChanged={recargar}
            />
          </>
        }
        Detalle={<DetalleLead inicial={ctx.activo} />}
        seleccionada={ctx.activo}
        modoDisposicion="maestro-50"
      />
      {ctx.estado === "CREANDO" && <CrearLead publicar={emitir} />}
    </div>
  );
};
