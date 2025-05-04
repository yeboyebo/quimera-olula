import { QBoton } from "../../../../componentes/atomos/qboton.tsx";
import { QInput } from "../../../../componentes/atomos/qinput.tsx";
import { useModelo } from "../../../comun/useModelo.ts";
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
  // const [estado, dispatch] = useReducer(
  //   makeReductor(metaCuentaBanco),
  //   initEstadoModelo(cuenta, metaCuentaBanco)
  // );

  const {modelo, uiProps, valido, } = useModelo(metaCuentaBanco, cuenta);

  // const setCampo = (campo: string) => (valor: string) => {
  //   dispatch({
  //     type: "set_campo",
  //     payload: { campo, valor },
  //   });
  // };

  // const getProps = (campo: string) => {
  //   return campoModeloAInput(estado, campo);
  // };

  const guardar = async () => {
    await patchCuentaBanco(clienteId, modelo);
    onCuentaActualizada(modelo);
  };

  return (
    <>
      <quimera-formulario>
        <QInput
          label="IBAN"
          {...uiProps("iban")}
        />
        <QInput
          label="BIC"
          {...uiProps("bic")}
        />
      </quimera-formulario>
      <div className="botones">
        <QBoton
          onClick={guardar}
          deshabilitado={!valido}
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
