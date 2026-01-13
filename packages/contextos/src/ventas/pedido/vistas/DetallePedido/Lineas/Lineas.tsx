import { QBoton } from "@olula/componentes/index.ts";
import { LineaPedido, Pedido } from "../../../diseño.ts";
import { AltaLinea } from "./AltaLinea.tsx";
import { BajaLinea } from "./BajaLinea.tsx";
import { EdicionLinea } from "./EdicionLinea.tsx";
import { LineasLista } from "./LineasLista.tsx";

export const Lineas = ({
  pedido,
  lineaActiva,
  estadoPedido,
  publicar,
}: {
  pedido: Pedido;
  lineaActiva: LineaPedido | null;
  estadoPedido: string;
  publicar: (evento: string, payload?: unknown) => void;
}) => {
  const handleCambioCantidad = (linea: LineaPedido, cantidad: number) => {
    publicar("cambio_cantidad_linea_solicitado", {
      lineaId: linea.id,
      cantidad: cantidad,
    });
  };

  return (
    <>
      {estadoPedido === "ABIERTO" && (
        <div className="botones maestro-botones ">
          <QBoton onClick={() => publicar("alta_linea_solicitada")}>
            Nueva
          </QBoton>

          <QBoton
            deshabilitado={!lineaActiva}
            onClick={() => publicar("cambio_linea_solicitado")}
          >
            Editar
          </QBoton>

          <QBoton
            deshabilitado={!lineaActiva}
            onClick={() => publicar("baja_linea_solicitada")}
          >
            Borrar
          </QBoton>
        </div>
      )}

      <LineasLista
        lineas={pedido.lineas || []}
        seleccionada={lineaActiva?.id}
        publicar={publicar}
        onCambioCantidad={handleCambioCantidad}
        pedidoEditable={estadoPedido === "ABIERTO"}
      />

      {estadoPedido === "CREANDO_LINEA" && <AltaLinea publicar={publicar} />}

      {lineaActiva && estadoPedido === "CAMBIANDO_LINEA" && (
        <EdicionLinea publicar={publicar} linea={lineaActiva} />
      )}

      {lineaActiva && estadoPedido === "BORRANDO_LINEA" && (
        <BajaLinea publicar={publicar} idLinea={lineaActiva.id} />
      )}
    </>
  );
};
