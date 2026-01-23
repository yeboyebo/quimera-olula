import { QBoton } from "@olula/componentes/index.ts";
import { BorrarLinea } from "../../borrar_linea/BorrarLinea.tsx";
import { CrearLinea } from "../../crear_linea/CrearLinea.tsx";
import { LineaPresupuesto, Presupuesto } from "../../diseño.ts";
import { EditarLinea } from "../../editar_linea/EditarLinea.tsx";
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
        onCambioCantidad={handleCambioCantidad}
        presupuestoEditable={
          estadoPresupuesto === "ABIERTO" && !presupuesto.aprobado
        }
      />

      {estadoPresupuesto === "CREANDO_LINEA" && (
        <CrearLinea presupuestoId={presupuesto.id} publicar={publicar} />
      )}

      {lineaActiva && estadoPresupuesto === "CAMBIANDO_LINEA" && (
        <EditarLinea
          presupuestoId={presupuesto.id}
          publicar={publicar}
          linea={lineaActiva}
        />
      )}

      {lineaActiva && estadoPresupuesto === "BORRANDO_LINEA" && (
        <BorrarLinea
          presupuestoId={presupuesto.id}
          publicar={publicar}
          idLinea={lineaActiva.id}
        />
      )}
    </>
  );
};
