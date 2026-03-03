import { useMaquina } from "@olula/componentes/hook/useMaquina.js";
import { Detalle, QBoton, Tab, Tabs } from "@olula/componentes/index.js";
import { EmitirEvento, Entidad } from "@olula/lib/diseño.js";
import { useModelo } from "@olula/lib/useModelo.js";
import { useEffect } from "react";
import { BorrarLead } from "../borrar/BorrarLead.tsx";
import { Acciones } from "./acciones/Acciones.tsx";
import { leadVacio, metaLead } from "./detalle.ts";
import "./DetalleLead.css";
import { getMaquina } from "./maquina.ts";
import { Oportunidades } from "./oportunidades/Oportunidades.tsx";
import { TabDatos } from "./tabs/TabDatos.tsx";
import { TabObservaciones } from "./tabs/TabObservaciones.tsx";

export const DetalleLead = ({
  id,
  publicar,
}: {
  id?: string;
  publicar: EmitirEvento;
}) => {
  const titulo = (lead: Entidad) => lead.nombre as string;

  const lead = useModelo(metaLead, leadVacio);
  const { modelo, modeloInicial, modificado, valido, init } = lead;

  const { ctx, emitir } = useMaquina(
    getMaquina,
    {
      estado: "INICIAL",
      lead: modelo,
    },
    publicar
  );

  if (ctx.lead !== modeloInicial) {
    init(ctx.lead);
  }

  useEffect(() => {
    emitir("lead_id_cambiado", id);
  }, [id]);

  if (!ctx.lead.id) return;

  return (
    <Detalle
      id={id}
      obtenerTitulo={titulo}
      setEntidad={() => {}}
      entidad={modelo}
      cerrarDetalle={() => emitir("edicion_lead_cancelada", null)}
    >
      <div className="DetalleLead">
        <div className="maestro-botones ">
          <QBoton onClick={() => emitir("borrado_lead_solicitado")}>
            Borrar
          </QBoton>
        </div>

        <Tabs>
          <Tab label="Datos">
            <TabDatos lead={lead} />
          </Tab>

          <Tab label="Observaciones">
            <TabObservaciones lead={lead} />
          </Tab>

          <Tab label="Oportunidades de Venta">
            <Oportunidades lead={lead} />
          </Tab>

          <Tab label="Acciones">
            <Acciones lead={lead} />
          </Tab>
        </Tabs>

        {modificado && (
          <div className="botones maestro-botones">
            <QBoton
              onClick={() => emitir("lead_cambiado", modelo)}
              deshabilitado={!valido}
            >
              Guardar
            </QBoton>
            <QBoton
              tipo="reset"
              variante="texto"
              onClick={() => emitir("edicion_lead_cancelada")}
            >
              Cancelar
            </QBoton>
          </div>
        )}

        {ctx.estado === "BORRANDO" && (
          <BorrarLead publicar={emitir} lead={modelo} />
        )}
      </div>
    </Detalle>
  );
};
