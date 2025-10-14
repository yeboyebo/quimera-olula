import { Usuario } from "#/comun/componentes/usuario.tsx";
import { EstadoLead } from "#/crm/comun/componentes/estado_lead.tsx";
import { FuenteLead } from "#/crm/comun/componentes/fuente_lead.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { Mostrar } from "@olula/componentes/moleculas/Mostrar.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useContext } from "react";
import { metaNuevoLead, nuevoLeadVacio } from "../dominio.ts";
import { getLead, postLead } from "../infraestructura.ts";
import "./AltaLead.css";

export const AltaLead = ({
  emitir = () => {},
  activo = false,
}: {
  emitir?: EmitirEvento;
  activo?: boolean;
}) => {
  const nuevoLead = useModelo(metaNuevoLead, nuevoLeadVacio);
  const { intentar } = useContext(ContextoError);

  const guardar = async () => {
    const modelo = {
      ...nuevoLead.modelo,
    };
    const id = await intentar(() => postLead(modelo));
    const leadCreado = await getLead(id);
    emitir("lead_creado", leadCreado);
  };

  const cancelar = () => {
    emitir("creacion_cancelada");
    nuevoLead.init();
  };

  return (
    <Mostrar modo="modal" activo={!!activo} onCerrar={cancelar}>
      <div className="AltaLead">
        <h2>Nuevo Lead</h2>
        <quimera-formulario>
          {/* <Cliente {...nuevoLead.uiProps("cliente_id", "nombre")} /> */}
          <QInput label="Nombre" {...nuevoLead.uiProps("nombre")} />
          <Usuario
            {...nuevoLead.uiProps("responsable_id")}
            label="Responsable"
          />
          {/* <QInput label="Tipo" {...nuevoLead.uiProps("tipo")} /> */}

          <EstadoLead {...nuevoLead.uiProps("estado_id")} />
          <FuenteLead {...nuevoLead.uiProps("fuente_id")} />
        </quimera-formulario>
        <div className="botones">
          <QBoton onClick={guardar} deshabilitado={!nuevoLead.valido}>
            Guardar
          </QBoton>
          <QBoton onClick={cancelar} variante="texto">
            Cancelar
          </QBoton>
        </div>
      </div>
    </Mostrar>
  );
};
