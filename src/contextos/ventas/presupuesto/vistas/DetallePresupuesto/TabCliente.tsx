import { useState } from "react";
import { QBoton } from "../../../../../componentes/atomos/qboton.tsx";
import { QInput } from "../../../../../componentes/atomos/qinput.tsx";
import { QModal } from "../../../../../componentes/moleculas/qmodal.tsx";
import { EmitirEvento } from "../../../../comun/diseño.ts";
import { Maquina, useMaquina } from "../../../../comun/useMaquina.ts";
import { HookModelo } from "../../../../comun/useModelo.ts";
import { Cliente } from "../../../comun/componentes/cliente.tsx";
import { DirCliente } from "../../../comun/componentes/dirCliente.tsx";
import {
  Presupuesto,
  CambioCliente as TipoCambioCliente,
} from "../../diseño.ts";
import { editable } from "../../dominio.ts";
import { patchCambiarCliente } from "../../infraestructura.ts";
import { CambioCliente } from "./CambioCliente.tsx";
import "./TabCliente.css";

interface TabClienteProps {
  presupuesto: HookModelo<Presupuesto>;
  publicar?: EmitirEvento;
}
type Estado = "edicion" | "cambiando_cliente";

export const TabCliente = ({
  presupuesto,
  publicar = () => {},
}: TabClienteProps) => {
  const [estado, setEstado] = useState<Estado>("edicion");
  const { modelo, uiProps } = presupuesto;

  const maquina: Maquina<Estado> = {
    edicion: {
      CAMBIO_CLIENTE_INICIADO: "cambiando_cliente",
    },
    cambiando_cliente: {
      CAMBIO_CLIENTE_CANCELADO: "edicion",
      CAMBIO_CLIENTE_LISTO: async (payload: unknown) => {
        const cambioCliente = payload as TipoCambioCliente;
        await patchCambiarCliente(
          modelo.id,
          cambioCliente.cliente_id,
          cambioCliente.direccion_id
        );
        publicar("CLIENTE_PRESUPUESTO_CAMBIADO", modelo);
        return "edicion" as Estado;
      },
    },
  };
  const emitir = useMaquina(maquina, estado, setEstado);

  return (
    <>
      <quimera-formulario>
        <Cliente {...uiProps("cliente_id", "nombre_cliente")} />
        <QInput {...uiProps("id_fiscal")} label="ID Fiscal" />
        <div id="cambiar_cliente" className="botones maestro-botones">
          <QBoton
            deshabilitado={!editable(modelo)}
            onClick={() => emitir("CAMBIO_CLIENTE_INICIADO")}
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
        onCerrar={() => emitir("CAMBIO_CLIENTE_CANCELADO")}
      >
        <CambioCliente publicar={emitir} />
      </QModal>
    </>
  );
};
