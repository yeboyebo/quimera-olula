import { useReducer } from "react";
import { QBoton } from "../../../../componentes/atomos/qboton.tsx";
import { QInput } from "../../../../componentes/atomos/qinput.tsx";
import {
  campoObjetoValorAInput,
  initEstadoObjetoValor,
  makeReductor,
  puedoGuardarObjetoValor,
} from "../../../comun/dominio.ts";
import { CrmContacto } from "../diseño.ts";
import { metaNuevoCrmContacto, nuevoCrmContactoVacio } from "../dominio.ts";
import { postCrmContacto } from "../infraestructura.ts";
import "./TabCuentasBanco.css";

interface AltaCrmContactosProps {
  clienteId: string;
  onContactoCreado?: (contacto: CrmContacto) => void;
  onCancelar: () => void;
}

export const AltaCrmContactos = ({
  onContactoCreado = () => {},
  onCancelar,
}: AltaCrmContactosProps) => {
  const [estado, dispatch] = useReducer(
    makeReductor(metaNuevoCrmContacto),
    initEstadoObjetoValor(nuevoCrmContactoVacio, metaNuevoCrmContacto)
  );

  const setCampo = (campo: string) => (valor: string) => {
    dispatch({
      type: "set_campo",
      payload: { campo, valor },
    });
  };

  const getProps = (campo: string) => {
    return campoObjetoValorAInput(estado, campo);
  };

  const guardar = async () => {
    const id = await postCrmContacto(estado.valor);
    onContactoCreado({ ...estado.valor, id });
  };

  return (
    <div className="alta-crm-contactos">
      <h2>Nuevo Contacto CRM</h2>
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
          deshabilitado={!puedoGuardarObjetoValor(estado)}
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
