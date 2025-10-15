import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useContext } from "react";
import { CuentaBanco } from "../../../diseño.ts";
import { metaCuentaBanco } from "../../../dominio.ts";
import { patchCuentaBanco } from "../../../infraestructura.ts";
import "./TabCuentasBanco.css";

interface EdicionCuentaBancoProps {
  clienteId: string;
  cuenta: CuentaBanco;
  emitir: (evento: string, payload?: unknown) => void;
}

export const EdicionCuentaBanco = ({
  clienteId,
  cuenta,
  emitir,
}: EdicionCuentaBancoProps) => {
  const { modelo, uiProps, valido } = useModelo(metaCuentaBanco, cuenta);
  const { intentar } = useContext(ContextoError);

  const guardar = async () => {
    await intentar(() => patchCuentaBanco(clienteId, modelo));
    emitir("cuenta_actualizada", modelo);
  };

  return (
    <div className="EdicionCuentaBanco">
      <quimera-formulario>
        <QInput label="IBAN" {...uiProps("iban")} />
        <QInput label="BIC" {...uiProps("bic")} />
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
