import { Detalle, QBoton, Tab, Tabs } from "@olula/componentes/index.js";
import { ContextoError } from "@olula/lib/contexto.js";
import { Entidad } from "@olula/lib/diseño.js";
import { procesarEvento } from "@olula/lib/dominio.js";
import { useModelo } from "@olula/lib/useModelo.js";
import { useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { BorrarLead } from "../Borrar/BorrarLead.tsx";
import { Lead } from "../diseño.ts";
import { TabAcciones } from "../vistas/DetalleLead/TabAcciones.tsx";
import { TabOportunidades } from "../vistas/DetalleLead/TabOportunidades.tsx";
import { leadVacio, metaLead } from "./detalle.ts";
import { ContextoDetalleLead } from "./diseño.ts";
import { getMaquina } from "./maquina.ts";
import { TabDatos } from "./Tabs/TabDatos.tsx";
import { TabObservaciones } from "./Tabs/TabObservaciones.tsx";

const maquina = getMaquina();

export const DetalleLead = ({ inicial = null }: { inicial: Lead | null }) => {
  const params = useParams();
  const { intentar } = useContext(ContextoError);

  const leadId = inicial?.id ?? params.id;
  const titulo = (lead: Entidad) => lead.nombre as string;

  const lead = useModelo(metaLead, leadVacio);
  const { modelo, modeloInicial, modificado, valido } = lead;

  const [ctx, setCtx] = useState<ContextoDetalleLead>({
    estado: "INICIAL",
    lead: modelo,
    inicial: modeloInicial,
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

  const guardar = async () => {
    emitir("lead_cambiado", modelo);
  };

  const cancelar = () => {
    emitir("edicion_lead_cancelada");
  };

  useEffect(() => {
    if (leadId && leadId !== modelo.id) {
      emitir("lead_id_cambiado", leadId);
    }
  }, [leadId, emitir, modelo.id]);

  return (
    <Detalle
      id={leadId}
      obtenerTitulo={titulo}
      setEntidad={() => {}}
      entidad={modelo}
      cerrarDetalle={() => emitir("edicion_lead_cancelada", null)}
    >
      {!!leadId && (
        <>
          <div className="maestro-botones ">
            <QBoton onClick={() => emitir("borrado_lead_solicitado")}>
              Borrar
            </QBoton>
          </div>
          <Tabs
            children={[
              <Tab
                key="tab-1"
                label="Datos"
                children={<TabDatos lead={lead} />}
              />,
              <Tab
                key="tab-3"
                label="Observaciones"
                children={<TabObservaciones lead={lead} />}
              />,
              <Tab
                key="tab-4"
                label="Oportunidades de Venta"
                children={<TabOportunidades lead={lead} />}
              />,
              <Tab
                key="tab-5"
                label="Acciones"
                children={<TabAcciones lead={lead} />}
              />,
            ]}
          ></Tabs>
          {modificado && (
            <div className="botones maestro-botones">
              <QBoton onClick={guardar} deshabilitado={!valido}>
                Guardar
              </QBoton>
              <QBoton tipo="reset" variante="texto" onClick={cancelar}>
                Cancelar
              </QBoton>
            </div>
          )}
          {ctx.estado === "BORRANDO" && (
            <BorrarLead publicar={emitir} lead={modelo} />
          )}
        </>
      )}
    </Detalle>
  );
};
