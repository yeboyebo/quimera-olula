import { useMaquina } from "@olula/componentes/hook/useMaquina.js";
import {
  Detalle,
  QBoton,
  QCheckbox,
  QInput,
} from "@olula/componentes/index.js";
import { EmitirEvento, Entidad } from "@olula/lib/diseño.js";
import { useModelo } from "@olula/lib/useModelo.js";
import { useParams } from "react-router";
import { BorrarEstadoLead } from "../borrar/BorrarEstadoLead.tsx";
import { EstadoLead } from "../diseño.ts";
import { estadoLeadVacio, metaEstadoLead } from "./detalle.ts";
import "./DetalleEstadoLead.css";
import { getMaquina } from "./maquina.ts";

export const DetalleEstadoLead = ({
  inicial = null,
  publicar,
}: {
  inicial: EstadoLead | null;
  publicar: EmitirEvento;
}) => {
  const params = useParams();

  const estadoLeadId = inicial?.id ?? params.id;
  const titulo = (estado_lead: Entidad) => estado_lead.descripcion as string;

  const estado_lead = useModelo(metaEstadoLead, estadoLeadVacio);
  const { modelo, modeloInicial, modificado, uiProps, valido, init } =
    estado_lead;

  const { ctx, emitir } = useMaquina(
    getMaquina,
    {
      estado: "INICIAL",
      estado_lead: modelo,
    },
    publicar
  );

  if (ctx.estado_lead !== modeloInicial) {
    init(ctx.estado_lead);
  }

  if (estadoLeadId && estadoLeadId !== modelo.id) {
    emitir("estado_lead_id_cambiado", estadoLeadId);
  }

  return (
    <Detalle
      id={estadoLeadId}
      obtenerTitulo={titulo}
      setEntidad={() => {}}
      entidad={modelo}
      cerrarDetalle={() => emitir("edicion_estado_lead_cancelada", null)}
    >
      {!!estadoLeadId && (
        <div className="DetalleEstadoLead">
          <div className="maestro-botones ">
            <QBoton onClick={() => emitir("borrado_estado_lead_solicitado")}>
              Borrar
            </QBoton>
          </div>

          <quimera-formulario>
            <QInput label="Descripción" {...uiProps("descripcion")} />
            <QCheckbox
              label="Valor por defecto"
              {...uiProps("valor_defecto")}
            />
          </quimera-formulario>

          {modificado && (
            <div className="botones maestro-botones">
              <QBoton
                onClick={() => emitir("estado_lead_cambiado", modelo)}
                deshabilitado={!valido}
              >
                Guardar
              </QBoton>
              <QBoton
                tipo="reset"
                variante="texto"
                onClick={() => emitir("edicion_estado_lead_cancelada")}
              >
                Cancelar
              </QBoton>
            </div>
          )}

          {ctx.estado === "BORRANDO" && (
            <BorrarEstadoLead publicar={emitir} estado_lead={modelo} />
          )}
        </div>
      )}
    </Detalle>
  );
};
