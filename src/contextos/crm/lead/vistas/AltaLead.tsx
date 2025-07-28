import { QBoton } from "../../../../componentes/atomos/qboton.tsx";
import { QInput } from "../../../../componentes/atomos/qinput.tsx";
import { EmitirEvento } from "../../../comun/diseño.ts";
import { useModelo } from "../../../comun/useModelo.ts";
import { Cliente } from "../../../ventas/comun/componentes/cliente.tsx";
import { EstadoLead } from "../../comun/componentes/estado_lead.tsx";
import { FuenteLead } from "../../comun/componentes/fuente_lead.tsx";
import { metaNuevoLead, nuevoLeadVacio } from "../dominio.ts";
import { getLead, postLead } from "../infraestructura.ts";
import "./AltaLead.css";

export const AltaLead = ({ emitir = () => {} }: { emitir?: EmitirEvento }) => {
  const nuevoLead = useModelo(metaNuevoLead, nuevoLeadVacio);

  const guardar = async () => {
    const id = await postLead(nuevoLead.modelo);
    const leadCreado = await getLead(id);
    emitir("LEAD_CREADO", leadCreado);
  };

  return (
    <div className="AltaLead">
      <h2>Nuevo Lead</h2>
      <quimera-formulario>
        <QInput label="Tipo" {...nuevoLead.uiProps("tipo")} />
        <Cliente {...nuevoLead.uiProps("cliente_id")} />
        <EstadoLead {...nuevoLead.uiProps("estado_id")} />
        <FuenteLead {...nuevoLead.uiProps("fuente_id")} />
      </quimera-formulario>
      <div className="botones">
        <QBoton onClick={guardar} deshabilitado={!nuevoLead.valido}>
          Guardar
        </QBoton>
        <QBoton onClick={() => emitir("ALTA_CANCELADA")} variante="texto">
          Cancelar
        </QBoton>
      </div>
    </div>
  );
};
