import { useContext } from "react";
import { QBoton } from "../../../../../../componentes/atomos/qboton.tsx";
import { QInput } from "../../../../../../componentes/atomos/qinput.tsx";
import { ContextoError } from "../../../../../comun/contexto.ts";
import { useModelo } from "../../../../../comun/useModelo.ts";
import {
  metaNuevoCrmContacto,
  nuevoCrmContactoVacio,
} from "../../../dominio.ts";
import { getCrmContacto, postCrmContacto } from "../../../infraestructura.ts";

interface AltaCrmContactosProps {
  clienteId: string;
  emitir: (evento: string, payload?: unknown) => void;
}

export const AltaCrmContactos = ({ emitir }: AltaCrmContactosProps) => {
  const { modelo, uiProps, valido } = useModelo(
    metaNuevoCrmContacto,
    nuevoCrmContactoVacio
  );
  const { intentar } = useContext(ContextoError);

  const guardar = async () => {
    const id = await intentar(() => postCrmContacto(modelo));
    emitir("CONTACTO_CREADO", await getCrmContacto(id));
  };

  return (
    <div className="alta-crm-contactos">
      <h2>Nuevo Contacto CRM</h2>
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
          onClick={() => emitir("ALTA_CANCELADA")}
        >
          Cancelar
        </QBoton>
      </div>
    </div>
  );
};
