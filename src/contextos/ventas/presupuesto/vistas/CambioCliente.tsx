import { QBoton } from "../../../../componentes/atomos/qboton.tsx";
import {
  modeloEsValido
} from "../../../comun/dominio.ts";
import { useModelo } from "../../../comun/useModelo.ts";
import { Cliente } from "../../comun/componentes/cliente.tsx";
import { DirCliente } from "../../comun/componentes/dirCliente.tsx";
import { CambioCliente as TipoCambioCliente } from "../diseño.ts";
import { cambioClienteVacio, metaCambioCliente } from "../dominio.ts";
import "./CambioCliente.css";

export const CambioCliente = ({
  onListo,
}: {
  onListo: (cliente: TipoCambioCliente) => void;
}) => {

  const [cliente, uiProps] = useModelo(
    metaCambioCliente,
    cambioClienteVacio()
  );

  const guardar = async () => {
    onListo(cliente.valor);
  };

  return (
    <>
      <h2>Cambiar cliente</h2>
      <quimera-formulario>
        <Cliente
          {...uiProps("cliente_id", "nombre_cliente")}
          nombre='cambiar_cliente_presupuesto'
        />
        <DirCliente
          clienteId={cliente.valor.cliente_id}
          {...uiProps("direccion_id")}
        />
      </quimera-formulario>
      <div className="botones maestro-botones ">
        <QBoton
          onClick={guardar}
          deshabilitado={!modeloEsValido(cliente)}
        >
          Guardar
        </QBoton>
      </div>
    </>
  );
};
