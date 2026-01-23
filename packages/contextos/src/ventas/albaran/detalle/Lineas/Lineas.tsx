import { QBoton } from "@olula/componentes/index.ts";
import { BorrarLinea } from "../../borrar_linea/BorrarLinea.tsx";
import { CrearLinea } from "../../crear_linea/CrearLinea.tsx";
import { Albaran, LineaAlbaran } from "../../diseño.ts";
import { EditarLinea } from "../../editar_linea/EditarLinea.tsx";
import { LineasLista } from "./LineasLista.tsx";

export const Lineas = ({
  albaran,
  lineaActiva,
  estadoAlbaran,
  publicar,
}: {
  albaran: Albaran;
  lineaActiva: LineaAlbaran | null;
  estadoAlbaran: string;
  publicar: (evento: string, payload?: unknown) => void;
}) => {
  const handleCambioCantidad = (linea: LineaAlbaran, cantidad: number) => {
    publicar("cambio_cantidad_linea_solicitado", {
      lineaId: linea.id,
      cantidad: cantidad,
    });
  };

  const esEditable = estadoAlbaran === "ABIERTO" && !albaran.idfactura;

  return (
    <>
      {esEditable && (
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
        lineas={albaran.lineas || []}
        seleccionada={lineaActiva?.id}
        onCambioCantidad={handleCambioCantidad}
        albaranEditable={esEditable}
      />

      {estadoAlbaran === "CREANDO_LINEA" && (
        <CrearLinea albaranId={albaran.id} publicar={publicar} />
      )}

      {lineaActiva && estadoAlbaran === "CAMBIANDO_LINEA" && (
        <EditarLinea
          publicar={publicar}
          linea={lineaActiva}
          albaranId={albaran.id}
        />
      )}

      {lineaActiva && estadoAlbaran === "BORRANDO_LINEA" && (
        <BorrarLinea
          publicar={publicar}
          idLinea={lineaActiva.id}
          albaranId={albaran.id}
        />
      )}
    </>
  );
};
