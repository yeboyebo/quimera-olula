import { QBoton } from "@olula/componentes/index.ts";
import { LineaPresupuesto, Presupuesto } from "../diseño.ts";
import { AltaLinea } from "./AltaLinea.tsx";
import { BajaLinea } from "./BajaLinea.tsx";
import { EdicionLinea } from "./EdicionLinea.tsx";
import { LineasLista } from "./LineasLista.tsx";

export const Lineas = ({
  presupuesto,
  lineaActiva,
  estadoPresupuesto,
  publicar,
}: {
  presupuesto: Presupuesto;
  lineaActiva: LineaPresupuesto | null;
  estadoPresupuesto: string;
  publicar: (evento: string, payload?: unknown) => void;
}) => {
  const handleCambioCantidad = (linea: LineaPresupuesto, cantidad: number) => {
    publicar("cambio_cantidad_linea_solicitado", {
      lineaId: linea.id,
      cantidad: cantidad,
    });
  };

  return (
    <>
      {estadoPresupuesto === "ABIERTO" && !presupuesto.aprobado && (
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
        lineas={presupuesto.lineas || []}
        seleccionada={lineaActiva?.id}
        publicar={publicar}
        onCambioCantidad={handleCambioCantidad}
        presupuestoEditable={
          estadoPresupuesto === "ABIERTO" && !presupuesto.aprobado
        }
      />

      {estadoPresupuesto === "CREANDO_LINEA" && (
        <AltaLinea publicar={publicar} />
      )}

      {lineaActiva && estadoPresupuesto === "CAMBIANDO_LINEA" && (
        <EdicionLinea publicar={publicar} linea={lineaActiva} />
      )}

      {lineaActiva && estadoPresupuesto === "BORRANDO_LINEA" && (
        <BajaLinea publicar={publicar} idLinea={lineaActiva.id} />
      )}
    </>
  );
};
