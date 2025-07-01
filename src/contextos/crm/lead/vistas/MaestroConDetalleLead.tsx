import { useState } from "react";
import { QBoton } from "../../../../componentes/atomos/qboton.tsx";
import { MetaTabla } from "../../../../componentes/atomos/qtabla.tsx";
import { Listado } from "../../../../componentes/maestro/Listado.tsx";
import { MaestroDetalleResponsive } from "../../../../componentes/maestro/MaestroDetalleResponsive.tsx";
import { QModal } from "../../../../componentes/moleculas/qmodal.tsx";
import { useLista } from "../../../comun/useLista.ts";
import { Maquina, useMaquina } from "../../../comun/useMaquina.ts";
import { Lead } from "../diseño.ts";
import { deleteLead, getLeads } from "../infraestructura.ts";
import { AltaLead } from "./AltaLead.tsx";
import { DetalleLead } from "./DetalleLead/DetalleLead.tsx";
// import "./MaestroConDetalleLead.css";

const metaTablaLead: MetaTabla<Lead> = [
  { id: "id", cabecera: "Código" },
  { id: "nombre", cabecera: "Nombre" },
  { id: "tipo", cabecera: "Tipo" },
  { id: "estado_id", cabecera: "Estado" },
  { id: "fuente_id", cabecera: "Fuente" },
];

type Estado = "lista" | "alta";

export const MaestroConDetalleLead = () => {
  const [estado, setEstado] = useState<Estado>("lista");
  const leads = useLista<Lead>([]);

  const maquina: Maquina<Estado> = {
    alta: {
      LEAD_CREADO: (payload: unknown) => {
        const lead = payload as Lead;
        leads.añadir(lead);
        return "lista";
      },
      ALTA_CANCELADA: "lista",
    },
    lista: {
      ALTA_INICIADA: "alta",
      LEAD_CAMBIADO: (payload: unknown) => {
        const lead = payload as Lead;
        leads.modificar(lead);
      },
      LEAD_BORRADO: (payload: unknown) => {
        const lead = payload as Lead;
        leads.eliminar(lead);
      },
      CANCELAR_SELECCION: () => {
        leads.limpiarSeleccion();
      },
    },
  };

  const emitir = useMaquina(maquina, estado, setEstado);

  const onBorrarLead = async () => {
    if (!leads.seleccionada) {
      return;
    }
    await deleteLead(leads.seleccionada.id);
    leads.eliminar(leads.seleccionada);
  };

  return (
    <div className="Lead">
      <MaestroDetalleResponsive<Lead>
        seleccionada={leads.seleccionada}
        Maestro={
          <>
            <h2>Leads</h2>
            <div className="maestro-botones">
              <QBoton onClick={() => emitir("ALTA_INICIADA")}>Nuevo</QBoton>
              <QBoton
                deshabilitado={!leads.seleccionada}
                onClick={onBorrarLead}
              >
                Borrar
              </QBoton>
            </div>
            <Listado
              metaTabla={metaTablaLead}
              entidades={leads.lista}
              setEntidades={leads.setLista}
              seleccionada={leads.seleccionada}
              setSeleccionada={leads.seleccionar}
              cargar={getLeads}
            />
          </>
        }
        Detalle={
          <DetalleLead leadInicial={leads.seleccionada} emitir={emitir} />
        }
      />
      <QModal
        nombre="modal"
        abierto={estado === "alta"}
        onCerrar={() => emitir("ALTA_CANCELADA")}
      >
        <AltaLead emitir={emitir} />
      </QModal>
    </div>
  );
};
