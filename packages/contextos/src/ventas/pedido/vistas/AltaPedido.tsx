import { Cliente } from "#/ventas/comun/componentes/cliente.tsx";
import { DirCliente } from "#/ventas/comun/componentes/dirCliente.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { ContextoError } from "@olula/lib/contexto.js";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useContext } from "react";
import { metaNuevoPedido, nuevoPedidoVacio } from "../dominio.ts";
import { getPedido, postPedido } from "../infraestructura.ts";
import "./AltaPedido.css";

export const AltaPedido = ({
  publicar = () => {},
}: {
  publicar?: EmitirEvento;
}) => {
  const nuevoPedido = useModelo(metaNuevoPedido, nuevoPedidoVacio);
  const { intentar } = useContext(ContextoError);

  const guardar = async () => {
    const id = await intentar(() => postPedido(nuevoPedido.modelo));
    const pedidoCreado = await getPedido(id);
    publicar("pedido_creado", pedidoCreado);
  };

  const cancelar = () => {
    publicar("alta_cancelada");
    nuevoPedido.init();
  };

  return (
    <div className="AltaPedido">
      <h2>Nuevo Pedido</h2>
      <quimera-formulario>
        <Cliente
          {...nuevoPedido.uiProps("cliente_id", "nombre")}
          nombre="ClientePedido"
        />
        <DirCliente
          clienteId={nuevoPedido.modelo.cliente_id}
          {...nuevoPedido.uiProps("direccion_id")}
          // nombre="alta_pedido_direccion_id"
        />
        <QInput label="Empresa" {...nuevoPedido.uiProps("empresa_id")} />
      </quimera-formulario>
      <div className="botones">
        <QBoton onClick={guardar} deshabilitado={!nuevoPedido.valido}>
          Guardar
        </QBoton>
        <QBoton onClick={cancelar} variante="texto">
          Cancelar
        </QBoton>
      </div>
    </div>
  );
};
