import { QBoton } from "../../../../componentes/atomos/qboton.tsx";
import { QInput } from "../../../../componentes/atomos/qinput.tsx";
import { EmitirEvento } from "../../../comun/diseño.ts";
import { useModelo } from "../../../comun/useModelo.ts";
import { Cliente } from "../../comun/componentes/cliente.tsx";
import { DirCliente } from "../../comun/componentes/dirCliente.tsx";
import { metaNuevoPedido, nuevoPedidoVacio } from "../dominio.ts";
import { getPedido, postPedido } from "../infraestructura.ts";
import "./AltaPedido.css";

export const AltaPedido = ({
  publicar = () => {},
}: {
  publicar?: EmitirEvento;
}) => {
  const nuevoPedido = useModelo(metaNuevoPedido, nuevoPedidoVacio);

  const guardar = async () => {
    const id = await postPedido(nuevoPedido.modelo);
    const pedidoCreado = await getPedido(id);
    publicar("PEDIDO_CREADO", pedidoCreado);
  };

  return (
    <div className="AltaPedido">
      <h2>Nuevo Pedido</h2>
      <quimera-formulario>
        <Cliente {...nuevoPedido.uiProps("cliente_id, nombre")} />
        <DirCliente
          clienteId={nuevoPedido.modelo.cliente_id}
          {...nuevoPedido.uiProps("direccion_id")}
          nombre="alta_pedido_direccion_id"
        />
        <QInput label="Empresa" {...nuevoPedido.uiProps("empresa_id")} />
      </quimera-formulario>
      <div className="botones">
        <QBoton onClick={guardar} deshabilitado={!nuevoPedido.valido}>
          Guardar
        </QBoton>
        <QBoton onClick={() => publicar("ALTA_CANCELADA")} variante="texto">
          Cancelar
        </QBoton>
      </div>
    </div>
  );
};
