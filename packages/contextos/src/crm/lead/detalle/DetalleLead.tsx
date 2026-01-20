import { useMaquina } from "@olula/componentes/hook/useMaquina.js";
import { Detalle, QBoton, Tab, Tabs } from "@olula/componentes/index.js";
import { EmitirEvento, Entidad } from "@olula/lib/diseño.js";
import { useModelo } from "@olula/lib/useModelo.js";
import { useParams } from "react-router";
import { BorrarLead } from "../borrar/BorrarLead.tsx";
import { Lead } from "../diseño.ts";
import { TabAcciones } from "../vistas/DetalleLead/TabAcciones.tsx";
import { TabOportunidades } from "../vistas/DetalleLead/TabOportunidades.tsx";
import { leadVacio, metaLead } from "./detalle.ts";
import "./DetalleLead.css";
import { getMaquina } from "./maquina.ts";
import { TabDatos } from "./tabs/TabDatos.tsx";
import { TabObservaciones } from "./tabs/TabObservaciones.tsx";

export const DetalleLead = ({
  inicial = null,
  publicar,
}: {
  inicial: Lead | null;
  publicar: EmitirEvento;
}) => {
  const params = useParams();

  const leadId = inicial?.id ?? params.id;
  const titulo = (lead: Entidad) => lead.nombre as string;

  const lead = useModelo(metaLead, leadVacio);
  const { modelo, modeloInicial, modificado, valido, init } = lead;

  const { ctx, emitir } = useMaquina(
    getMaquina,
    {
      estado: "INICIAL",
      lead: modelo,
      inicial: modeloInicial,
    },
    publicar
  );

  if (ctx.lead !== modelo) {
    init(ctx.lead);
  }

  const guardar = async () => {
    emitir("lead_cambiado", modelo);
  };

  const cancelar = () => {
    emitir("edicion_lead_cancelada");
  };

  if (leadId && leadId !== modelo.id) {
    emitir("lead_id_cambiado", leadId);
  }

  return (
    <Detalle
      id={leadId}
      obtenerTitulo={titulo}
      setEntidad={() => {}}
      entidad={modelo}
      cerrarDetalle={() => emitir("edicion_lead_cancelada", null)}
    >
      {!!leadId && (
        <div className="DetalleLead">
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
        </div>
      )}
    </Detalle>
  );
};
