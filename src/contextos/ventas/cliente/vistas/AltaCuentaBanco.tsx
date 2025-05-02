import { useReducer } from "react";
import { QBoton } from "../../../../componentes/atomos/qboton.tsx";
import { QInput } from "../../../../componentes/atomos/qinput.tsx";
import {
    campoModeloAInput,
    initEstadoModelo,
    makeReductor,
    modeloEsValido,
} from "../../../comun/dominio.ts";
import { CuentaBanco } from "../diseño.ts";
import { metaNuevaCuentaBanco, nuevaCuentaBancoVacia } from "../dominio.ts";
import { getCuentaBanco, postCuentaBanco } from "../infraestructura.ts";
import "./TabCuentasBanco.css";

interface AltaCuentaBancoProps {
  clienteId: string;
  onCuentaCreada?: (cuenta: CuentaBanco) => void;
  onCancelar: () => void;
}

export const AltaCuentaBanco = ({
  clienteId,
  onCuentaCreada = () => {},
  onCancelar,
}: AltaCuentaBancoProps) => {
  const [estado, dispatch] = useReducer(
    makeReductor(metaNuevaCuentaBanco),
    initEstadoModelo(nuevaCuentaBancoVacia, metaNuevaCuentaBanco)
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
    const id = await postCuentaBanco(clienteId, estado.valor);
    const cuentaCreada = await getCuentaBanco(clienteId, id);
    onCuentaCreada(cuentaCreada);
  };

  return (
    <div className="alta-cuenta-banco">
      <h2>Nueva Cuenta Bancaria</h2>
      <quimera-formulario>
        <QInput
          label="Descripción"
          onChange={setCampo("descripcion")}
          {...getProps("descripcion")}
        />
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
