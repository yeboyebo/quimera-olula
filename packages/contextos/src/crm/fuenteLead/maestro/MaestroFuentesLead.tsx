import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.js";
import { ListadoControlado } from "@olula/componentes/maestro/ListadoControlado.js";
import { MaestroDetalleControlado } from "@olula/componentes/maestro/MaestroDetalleControlado.tsx";
import { Criteria } from "@olula/lib/diseño.js";
import { criteriaDefecto } from "@olula/lib/dominio.js";
import { listaEntidadesInicial } from "@olula/lib/ListaEntidades.js";
import { useCallback, useEffect, useState } from "react";
import { CrearFuenteLead } from "../crear/CrearFuenteLead.tsx";
import { DetalleFuenteLead } from "../detalle/DetalleFuenteLead.tsx";
import { FuenteLead } from "../diseño.ts";
import { metaTablaFuenteLead } from "./maestro.ts";
import "./MaestroFuentesLead.css";
import { getMaquina } from "./maquina.ts";

export const MaestroFuentesLead = () => {
  const [cargando, setCargando] = useState(false);

  const { ctx, emitir } = useMaquina(getMaquina, {
    estado: "INICIAL",
    fuentes_lead: listaEntidadesInicial<FuenteLead>(),
  });

  const recargar = useCallback(
    async (criteria: Criteria) => {
      setCargando(true);
      await emitir("recarga_de_fuentes_lead_solicitada", criteria);
      setCargando(false);
    },
    [emitir, setCargando]
  );

  useEffect(() => {
    recargar(criteriaDefecto);
  }, []);

  return (
    <div className="FuenteLead">
      <MaestroDetalleControlado<FuenteLead>
        Maestro={
          <>
            <h2>Fuentes de Lead</h2>

            <div className="maestro-botones">
              <QBoton
                onClick={() => emitir("creacion_de_fuente_lead_solicitada")}
              >
                Nuevo
              </QBoton>
            </div>

            <ListadoControlado<FuenteLead>
              metaTabla={metaTablaFuenteLead}
              metaFiltro={true}
              cargando={cargando}
              criteriaInicial={criteriaDefecto}
              modo={"tabla"}
              // setModo={handleSetModoVisualizacion}
              // tarjeta={tarjeta}
              entidades={ctx.fuentes_lead.lista}
              totalEntidades={ctx.fuentes_lead.total}
              seleccionada={ctx.fuentes_lead.activo}
              onSeleccion={(payload) =>
                emitir("fuente_lead_seleccionada", payload)
              }
              onCriteriaChanged={recargar}
            />
          </>
        }
        Detalle={
          <DetalleFuenteLead
            inicial={ctx.fuentes_lead.activo}
            publicar={emitir}
          />
        }
        seleccionada={ctx.fuentes_lead.activo}
        modoDisposicion="maestro-50"
      />

      {ctx.estado === "CREANDO" && <CrearFuenteLead publicar={emitir} />}
    </div>
  );
};
