import { useContext, useState } from "react";
import { QBoton } from "../../../../../../componentes/atomos/qboton.tsx";
import { QModal } from "../../../../../../componentes/moleculas/qmodal.tsx";
import { QModalConfirmacion } from "../../../../../../componentes/moleculas/qmodalconfirmacion.tsx";
import { ContextoError } from "../../../../../comun/contexto.ts";
import { HookModelo } from "../../../../../comun/useModelo.ts";
import { Cliente as ClienteSelector } from "../../../../../ventas/comun/componentes/cliente.tsx";
import { Cliente } from "../../../../cliente/diseño.ts";
import {
  desvincularContactoCliente,
  vincularContactoCliente,
} from "../../../../cliente/infraestructura.ts";
import { Contacto } from "../../../diseño.ts";

interface Props {
  seleccionada?: Cliente | null;
  emitir: (evento: string, payload?: unknown) => void;
  estado: string;
  contacto: HookModelo<Contacto>;
}

export const TabClientesAcciones = ({
  seleccionada,
  emitir,
  contacto,
  estado,
}: Props) => {
  const contactoId = contacto.modelo.id;
  const [clienteSeleccionado, setClienteSeleccionado] = useState<{
    valor: string;
    descripcion: string;
  } | null>(null);
  const { intentar } = useContext(ContextoError);

  const onAsociar = async () => {
    if (clienteSeleccionado) {
      await intentar(() =>
        vincularContactoCliente(contactoId, clienteSeleccionado.valor)
      );
      emitir("CLIENTE_VINCULADO", clienteSeleccionado);
      //   setClienteSeleccionado(null);
    }
  };

  const onDesvincular = async () => {
    if (clienteSeleccionado) {
      await intentar(() =>
        desvincularContactoCliente(contactoId, clienteSeleccionado.valor)
      );
      emitir("CLIENTE_DESVINCULADO", clienteSeleccionado);
      //   setClienteSeleccionado(null);
    }
  };

  return (
    <div className="TabClientesAcciones maestro-botones">
      <QBoton onClick={() => emitir("VINCULAR_SOLICITADO")}>
        Asociar cliente
      </QBoton>
      <QBoton
        onClick={() => emitir("DESVINCULAR_SOLICITADO")}
        deshabilitado={!seleccionada}
      >
        Desvincular cliente
      </QBoton>

      <QModal
        nombre="asociarCliente"
        abierto={estado === "vincular_cliente"}
        onCerrar={() => emitir("CANCELAR_VINCULACION")}
      >
        <h2>Asociar cliente</h2>
        <ClienteSelector
          valor={clienteSeleccionado?.valor || ""}
          descripcion={clienteSeleccionado?.descripcion || ""}
          nombre="cliente_id"
          label="Seleccionar cliente"
          onChange={(cliente) => setClienteSeleccionado(cliente)}
        />
        <div className="botones">
          <QBoton onClick={onAsociar} deshabilitado={!seleccionada}>
            Guardar
          </QBoton>
          <QBoton
            tipo="reset"
            variante="texto"
            onClick={() => emitir("CANCELAR_VINCULACION")}
          >
            Cancelar
          </QBoton>
        </div>
      </QModal>

      <QModalConfirmacion
        nombre="confirmarDesvincularCliente"
        abierto={estado === "desvincular_cliente"}
        titulo="Confirmar desvincular"
        mensaje="¿Está seguro de que desea desvincular este cliente?"
        onCerrar={() => emitir("CANCELAR_VINCULACION")}
        onAceptar={onDesvincular}
      />
    </div>
  );
};
