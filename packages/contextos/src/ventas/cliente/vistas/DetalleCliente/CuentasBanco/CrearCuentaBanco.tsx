import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { useModelo } from "@olula/lib/useModelo.ts";
import {
  metaNuevaCuentaBanco,
  nuevaCuentaBancoVacia,
} from "../../../dominio.ts";
import "./TabCuentasBanco.css";

interface AltaCuentaBancoProps {
  emitir: (evento: string, payload?: unknown) => void;
}

export const AltaCuentaBanco = ({ emitir }: AltaCuentaBancoProps) => {
  const { modelo, uiProps, valido } = useModelo(
    metaNuevaCuentaBanco,
    nuevaCuentaBancoVacia
  );

  const guardar = async () => {
    emitir("crear_cuenta", modelo);
  };

  return (
    <div className="alta-cuenta-banco">
      <h2>Nueva Cuenta Bancaria</h2>
      <quimera-formulario>
        <QInput label="Descripción" {...uiProps("descripcion")} />
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
          onClick={() => emitir("alta_cancelada")}
        >
          Cancelar
        </QBoton>
      </div>
    </div>
  );
};
