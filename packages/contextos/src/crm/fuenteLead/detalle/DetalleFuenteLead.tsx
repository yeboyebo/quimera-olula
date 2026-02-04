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
import { BorrarFuenteLead } from "../borrar/BorrarFuenteLead.tsx";
import { FuenteLead } from "../diseño.ts";
import { fuenteLeadVacia, metaFuenteLead } from "./detalle.ts";
import "./DetalleFuenteLead.css";
import { getMaquina } from "./maquina.ts";

export const DetalleFuenteLead = ({
  inicial = null,
  publicar,
}: {
  inicial: FuenteLead | null;
  publicar: EmitirEvento;
}) => {
  const params = useParams();

  const fuenteLeadId = inicial?.id ?? params.id;
  const titulo = (fuente_lead: Entidad) => fuente_lead.descripcion as string;

  const fuente_lead = useModelo(metaFuenteLead, fuenteLeadVacia);
  const { modelo, modeloInicial, modificado, uiProps, valido, init } =
    fuente_lead;

  const { ctx, emitir } = useMaquina(
    getMaquina,
    {
      estado: "INICIAL",
      fuente_lead: modelo,
    },
    publicar
  );

  if (ctx.fuente_lead !== modeloInicial) {
    init(ctx.fuente_lead);
  }

  if (fuenteLeadId && fuenteLeadId !== modelo.id) {
    emitir("fuente_lead_id_cambiado", fuenteLeadId);
  }

  return (
    <Detalle
      id={fuenteLeadId}
      obtenerTitulo={titulo}
      setEntidad={() => {}}
      entidad={modelo}
      cerrarDetalle={() => emitir("edicion_fuente_lead_cancelada", null)}
    >
      {!!fuenteLeadId && (
        <div className="DetalleFuenteLead">
          <div className="maestro-botones ">
            <QBoton onClick={() => emitir("borrado_fuente_lead_solicitado")}>
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
                onClick={() => emitir("fuente_lead_cambiada", modelo)}
                deshabilitado={!valido}
              >
                Guardar
              </QBoton>
              <QBoton
                tipo="reset"
                variante="texto"
                onClick={() => emitir("edicion_fuente_lead_cancelada")}
              >
                Cancelar
              </QBoton>
            </div>
          )}

          {ctx.estado === "BORRANDO" && (
            <BorrarFuenteLead publicar={emitir} fuente_lead={modelo} />
          )}
        </div>
      )}
    </Detalle>
  );
};
