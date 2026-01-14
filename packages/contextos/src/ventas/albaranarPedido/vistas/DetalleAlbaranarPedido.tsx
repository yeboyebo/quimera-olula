import { Detalle } from "@olula/componentes/detalle/Detalle.tsx";
import { Entidad } from "@olula/lib/diseño.ts";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useParams } from "react-router";
import { metaPedido, pedidoVacio } from "../../pedido/dominio.ts";
import { getPedido } from "../../pedido/infraestructura.ts";
import "./DetalleAlbaranarPedido.css";
import { Lineas } from "./Lineas/Lineas.tsx";

export const DetalleAlbaranarPedido = () => {
  const params = useParams();

  const pedidoId = params.id;
  const titulo = (pedido: Entidad) =>
    `${pedido.nombre_cliente} ${pedido.codigo as string}`;

  const pedido = useModelo(metaPedido, pedidoVacio());
  const { modelo, init } = pedido;

  return (
    <Detalle
      id={pedidoId}
      obtenerTitulo={titulo}
      setEntidad={(p) => init(p)}
      entidad={modelo}
      cargar={getPedido}
      className="AlbaranarPedido"
    >
      {!!pedidoId && (
        <>
          <Lineas pedidoId={pedidoId} pedido={modelo} />
        </>
      )}
    </Detalle>
  );
};
