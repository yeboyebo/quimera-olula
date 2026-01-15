import { QBoton } from "@olula/componentes/index.ts";
import { Albaran, LineaAlbaran } from "../../../diseño.ts";
import { AltaLinea } from "./AltaLinea.tsx";
import { BajaLinea } from "./BajaLinea.tsx";
import { EdicionLinea } from "./EdicionLinea.tsx";
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
        publicar={publicar}
        onCambioCantidad={handleCambioCantidad}
        albaranEditable={esEditable}
      />

      {estadoAlbaran === "CREANDO_LINEA" && <AltaLinea publicar={publicar} />}

      {lineaActiva && estadoAlbaran === "CAMBIANDO_LINEA" && (
        <EdicionLinea publicar={publicar} linea={lineaActiva} />
      )}

      {lineaActiva && estadoAlbaran === "BORRANDO_LINEA" && (
        <BajaLinea publicar={publicar} idLinea={lineaActiva.id} />
      )}
    </>
  );
};
