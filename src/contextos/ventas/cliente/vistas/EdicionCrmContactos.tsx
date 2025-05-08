import { QBoton } from "../../../../componentes/atomos/qboton.tsx";
import { QInput } from "../../../../componentes/atomos/qinput.tsx";
import { useModelo } from "../../../comun/useModelo.ts";
import { CrmContacto } from "../diseño.ts";
import { metaCrmContacto } from "../dominio.ts";
import "./TabCuentasBanco.css";

interface EdicionCrmContactosProps {
  contacto: CrmContacto;
  emitir: (evento: string, payload?: unknown) => void;
}

export const EdicionCrmContactos = ({
  contacto,
  emitir,
}: EdicionCrmContactosProps) => {
  const { modelo, uiProps, valido } = useModelo(metaCrmContacto, contacto);

  const guardar = async () => {
    emitir("CONTACTO_ACTUALIZADO", modelo);
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
          onClick={() => emitir("EDICION_CANCELADA")}
        >
          Cancelar
        </QBoton>
      </div>
    </div>
  );
};
