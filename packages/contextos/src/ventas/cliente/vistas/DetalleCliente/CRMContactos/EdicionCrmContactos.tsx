import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useContext } from "react";
import { CrmContacto } from "../../../diseño.ts";
import { metaCrmContacto } from "../../../dominio.ts";
import { patchCrmContacto } from "../../../infraestructura.ts";

interface EdicionCrmContactosProps {
  contacto: CrmContacto;
  emitir: (evento: string, payload?: unknown) => void;
}

export const EdicionCrmContactos = ({
  contacto,
  emitir,
}: EdicionCrmContactosProps) => {
  const { modelo, uiProps, valido } = useModelo(metaCrmContacto, contacto);
  const { intentar } = useContext(ContextoError);

  const guardar = async () => {
    await intentar(() => patchCrmContacto(modelo));
    emitir("contacto_actualizado", modelo);
  };

  return (
    <div className="edicion-crm-contactos">
      <h2>Editar Contacto CRM</h2>
      <quimera-formulario>
        <QInput label="Nombre" {...uiProps("nombre")} />
        <QInput label="Email" {...uiProps("email")} />
      </quimera-formulario>
      <div className="botones">
        <QBoton onClick={guardar} deshabilitado={!valido}>
          Guardar
        </QBoton>
        <QBoton
          tipo="reset"
          variante="texto"
          onClick={() => emitir("edicion_cancelada")}
        >
          Cancelar
        </QBoton>
      </div>
    </div>
  );
};
