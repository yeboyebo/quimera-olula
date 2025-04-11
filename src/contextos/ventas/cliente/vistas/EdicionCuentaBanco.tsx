import { useReducer } from "react";
import { QBoton } from "../../../../componentes/atomos/qboton.tsx";
import { QInput } from "../../../../componentes/atomos/qinput.tsx";
import {
  campoObjetoValorAInput,
  initEstadoObjetoValor,
  makeReductor,
  puedoGuardarObjetoValor,
} from "../../../comun/dominio.ts";
import { CuentaBanco } from "../diseño.ts";
import { metaCuentaBanco } from "../dominio.ts";
import { patchCuentaBanco } from "../infraestructura.ts";
import "./TabCuentasBanco.css";

interface EdicionCuentaBancoProps {
  clienteId: string;
  cuenta: CuentaBanco;
  onCuentaActualizada?: (cuenta: CuentaBanco) => void;
  onCancelar: () => void;
}

export const EdicionCuentaBanco = ({
  clienteId,
  cuenta,
  onCuentaActualizada = () => {},
  onCancelar,
}: EdicionCuentaBancoProps) => {
  const [estado, dispatch] = useReducer(
    makeReductor(metaCuentaBanco),
    initEstadoObjetoValor(cuenta, metaCuentaBanco)
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
    await patchCuentaBanco(clienteId, estado.valor);
    onCuentaActualizada(estado.valor);
  };

  return (
    <>
      <quimera-formulario>
        <QInput
          label="IBAN"
          onChange={setCampo("iban")}
          {...getProps("iban")}
        />
        <QInput label="BIC" onChange={setCampo("bic")} {...getProps("bic")} />
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
    </>
  );
};
