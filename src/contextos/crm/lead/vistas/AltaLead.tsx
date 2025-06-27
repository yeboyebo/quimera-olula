import { QBoton } from "../../../../componentes/atomos/qboton.tsx";
import { QInput } from "../../../../componentes/atomos/qinput.tsx";
import { EmitirEvento } from "../../../comun/diseño.ts";
import { useModelo } from "../../../comun/useModelo.ts";
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
        <QInput label="Fuente" {...nuevoLead.uiProps("fuente_id")} />
        <QInput label="Estado" {...nuevoLead.uiProps("estado_id")} />
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
