import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useContext } from "react";
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
    emitir("contacto_creado", await getCrmContacto(id));
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
          onClick={() => emitir("alta_cancelada")}
        >
          Cancelar
        </QBoton>
      </div>
    </div>
  );
};
