import { useReducer } from "react";
import { QBoton } from "../../../../componentes/atomos/qboton.tsx";
import { QInput } from "../../../../componentes/atomos/qinput.tsx";
import {
    campoModeloAInput,
    initEstadoModelo,
    makeReductor,
    modeloEsValido,
} from "../../../comun/dominio.ts";
import { CrmContacto } from "../diseño.ts";
import { metaCrmContacto } from "../dominio.ts";
import { patchCrmContacto } from "../infraestructura.ts";
import "./TabCuentasBanco.css";

interface EdicionCrmContactosProps {
  clienteId: string;
  contacto: CrmContacto;
  onContactoActualizado?: (contacto: CrmContacto) => void;
  onCancelar: () => void;
}

export const EdicionCrmContactos = ({
  contacto,
  onContactoActualizado = () => {},
  onCancelar,
}: EdicionCrmContactosProps) => {
  const [estado, dispatch] = useReducer(
    makeReductor(metaCrmContacto),
    initEstadoModelo(contacto, metaCrmContacto)
  );

  const setCampo = (campo: string) => (valor: string) => {
    dispatch({
      type: "set_campo",
      payload: { campo, valor },
    });
  };

  const getProps = (campo: string) => {
    return campoModeloAInput(estado, campo);
  };

  const guardar = async () => {
    await patchCrmContacto(estado.valor);
    onContactoActualizado(estado.valor);
  };

  return (
    <div className="edicion-crm-contactos">
      <h2>Editar Contacto CRM</h2>
      <quimera-formulario>
        <QInput
          label="Nombre"
          onChange={setCampo("nombre")}
          {...getProps("nombre")}
        />
        <QInput
          label="Email"
          onChange={setCampo("email")}
          {...getProps("email")}
        />
      </quimera-formulario>
      <div className="botones">
        <QBoton
          onClick={guardar}
          deshabilitado={!modeloEsValido(estado)}
        >
          Guardar
        </QBoton>
        <QBoton tipo="reset" variante="texto" onClick={onCancelar}>
          Cancelar
        </QBoton>
      </div>
    </div>
  );
};
