import { QBoton } from "@olula/componentes/index.ts";
import { BorrarLinea } from "../../borrar_linea/BorrarLinea.tsx";
import { CrearLinea } from "../../crear_linea/CrearLinea.tsx";
import { Factura, LineaFactura } from "../../diseño.ts";
import { EditarLinea } from "../../editar_linea/EditarLinea.tsx";
import { LineasLista } from "./LineasLista.tsx";

export const Lineas = ({
  factura,
  lineaActiva,
  estadoFactura,
  publicar,
}: {
  factura: Factura;
  lineaActiva: LineaFactura | null;
  estadoFactura: string;
  publicar: (evento: string, payload?: unknown) => void;
}) => {
  const handleCambioCantidad = (linea: LineaFactura, cantidad: number) => {
    publicar("cambio_cantidad_linea_solicitado", {
      lineaId: linea.id,
      cantidad: cantidad,
    });
  };

  return (
    <>
      {estadoFactura === "CONSULTANDO" && (
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
        lineas={factura.lineas || []}
        seleccionada={lineaActiva?.id}
        onCambioCantidad={handleCambioCantidad}
        facturaEditable={estadoFactura === "CONSULTANDO"}
      />

      {estadoFactura === "CREANDO_LINEA" && <CrearLinea publicar={publicar} />}

      {lineaActiva && estadoFactura === "CAMBIANDO_LINEA" && (
        <EditarLinea publicar={publicar} linea={lineaActiva} />
      )}

      {lineaActiva && estadoFactura === "BORRANDO_LINEA" && (
        <BorrarLinea publicar={publicar} idLinea={lineaActiva.id} />
      )}
    </>
  );
};
