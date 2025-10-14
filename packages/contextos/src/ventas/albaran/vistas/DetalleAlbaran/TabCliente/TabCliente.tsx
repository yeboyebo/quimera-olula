import { Cliente } from "#/ventas/comun/componentes/cliente.tsx";
import { DirCliente } from "#/ventas/comun/componentes/dirCliente.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QModal } from "@olula/componentes/moleculas/qmodal.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { Maquina, useMaquina } from "@olula/lib/useMaquina.ts";
import { HookModelo } from "@olula/lib/useModelo.ts";
import { useContext, useState } from "react";
import {
  Albaran,
  CambioClienteAlbaran as TipoCambioCliente,
} from "../../../diseño.ts";
import { patchCambiarCliente } from "../../../infraestructura.ts";
import { CambioCliente } from "./CambioCliente.tsx";
import "./TabCliente.css";

interface TabClienteProps {
  albaran: HookModelo<Albaran>;
  publicar?: EmitirEvento;
}
type Estado = "edicion" | "cambiando_cliente";

export const TabCliente = ({
  albaran,
  publicar = () => {},
}: TabClienteProps) => {
  const [estado, setEstado] = useState<Estado>("edicion");
  const { modelo, uiProps, editable } = albaran;
  const { intentar } = useContext(ContextoError);

  const maquina: Maquina<Estado> = {
    edicion: {
      CAMBIO_CLIENTE_INICIADO: "cambiando_cliente",
    },
    cambiando_cliente: {
      CAMBIO_CLIENTE_CANCELADO: "edicion",
      CAMBIO_CLIENTE_LISTO: async (payload: unknown) => {
        const cambioCliente = payload as TipoCambioCliente;
        await intentar(() =>
          patchCambiarCliente(modelo.id, cambioCliente as Albaran)
        );
        publicar("CLIENTE_ALBARAN_CAMBIADO", modelo);
        return "edicion" as Estado;
      },
    },
  };
  const emitir = useMaquina(maquina, estado, setEstado);

  return (
    <div className="TabCliente">
      <quimera-formulario>
        <Cliente {...uiProps("cliente_id", "nombre_cliente")} />
        <QInput {...uiProps("id_fiscal")} label="ID Fiscal" />
        <div id="cambiar_cliente" className="botones maestro-botones">
          <QBoton
            deshabilitado={!editable}
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
    </div>
  );
};
