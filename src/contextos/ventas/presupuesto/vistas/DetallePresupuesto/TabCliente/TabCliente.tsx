import { QBoton } from "../../../../../../componentes/atomos/qboton.tsx";
import { QInput } from "../../../../../../componentes/atomos/qinput.tsx";
import { QModal } from "../../../../../../componentes/moleculas/qmodal.tsx";
import { EmitirEvento } from "../../../../../comun/diseño.ts";
import {
  ConfigMaquina4,
  useMaquina4,
} from "../../../../../comun/useMaquina.ts";
import { HookModelo } from "../../../../../comun/useModelo.ts";
import { Cliente } from "../../../../comun/componentes/cliente.tsx";
import { DirCliente } from "../../../../comun/componentes/dirCliente.tsx";
import { Presupuesto } from "../../../diseño.ts";
import { editable } from "../../../dominio.ts";
import { CambioCliente } from "./CambioCliente.tsx";
import "./TabCliente.css";

interface TabClienteProps {
  presupuesto: HookModelo<Presupuesto>;
  publicar?: EmitirEvento;
}
type Estado = "edicion" | "cambiando_cliente";
type Contexto = Record<string, unknown>;

const configMaquina: ConfigMaquina4<Estado, Contexto> = {
  inicial: {
    estado: "edicion",
    contexto: {},
  },
  estados: {
    edicion: {
      cambio_cliente_iniciado: "cambiando_cliente",
    },
    cambiando_cliente: {
      cambio_cliente_cancelado: "edicion",
      cambio_cliente_listo: "edicion",
    },
  },
};

export const TabCliente = ({
  presupuesto,
  publicar = () => {},
}: TabClienteProps) => {
  const { modelo, uiProps } = presupuesto;
  // const { intentar } = useContext(ContextoError);

  const [emitir, { estado }] = useMaquina4<Estado, Contexto>({
    config: configMaquina,
    publicar,
  });

  return (
    <div className="TabCliente">
      <quimera-formulario>
        <Cliente {...uiProps("cliente_id", "nombre_cliente")} />
        <QInput {...uiProps("id_fiscal")} label="ID Fiscal" />
        <div id="cambiar_cliente" className="botones maestro-botones">
          <QBoton
            deshabilitado={!editable(modelo)}
            onClick={() => emitir("cambio_cliente_iniciado")}
          >
            C
          </QBoton>
        </div>
        <DirCliente
          clienteId={modelo.cliente_id}
          {...uiProps("direccion_id")}
        />
      </quimera-formulario>
      <QModal
        nombre="modal"
        abierto={estado === "cambiando_cliente"}
        onCerrar={() => emitir("cambio_cliente_cancelado")}
      >
        <CambioCliente presupuestoId={modelo.id} publicar={emitir} />
      </QModal>
    </div>
  );
};
