import { EditarCantidadLinea } from "#/ventas/pedido/vistas/DetallePedido/Lineas/EditarCantidadLinea.tsx";
import { QIcono, QTabla } from "@olula/componentes/index.js";
import { EmitirEvento } from "@olula/lib/diseño.js";
import { useState } from "react";
import { LineaAlbaranarPedido, Tramo } from "../../diseño.ts";
import "./TarjetaLinea.css";

export const TarjetaLinea = ({
  linea,
  publicar,
}: {
  linea: LineaAlbaranarPedido;
  publicar: EmitirEvento;
}) => {
  const { tramos } = linea;
  const servida = linea.servida || 0;
  const aEnviar = linea.cantidad - servida;
  const [mostrarTramos, setMostrarTramos] = useState(false);

  const validarCantidadTramo =
    (tramoEditado: Tramo) => (cantidadRaw: string) => {
      const nuevaCantidad = parseInt(cantidadRaw);

      if (isNaN(nuevaCantidad) || nuevaCantidad <= 0) {
        return "Debe tener una cantidad mayor que cero.";
      }
      const sumaSinTramoActual =
        tramos?.reduce((total, tramo) => {
          if (tramo.id === tramoEditado.id) {
            return total;
          }
          return total + (tramo.cantidad || 0);
        }, 0) || 0;

      const nuevaSumaTotal = sumaSinTramoActual + nuevaCantidad;

      if (nuevaSumaTotal > linea.cantidad) {
        return `La suma de todos los tramos no puede superar: ${linea.cantidad}`;
      }

      return "";
    };

  const cambiarCantidad = async (tramo: Tramo, cantidad: number) => {
    const actuales = linea.tramos ?? [];
    const nuevos = actuales.map((t) =>
      t.id === tramo.id ? { ...t, cantidad } : t
    );
    publicar("tramos_actualizados", { id: linea.id, tramos: nuevos });
  };

  const addTramo = () => {
    if (aEnviar == 0) {
      alert("No hay cantidad disponible para añadir más tramos.");
      return;
    }

    const nuevo: Tramo = {
      id:
        crypto && typeof crypto.randomUUID === "function"
          ? crypto.randomUUID()
          : Date.now().toString(),
      cantidad: aEnviar,
    };
    const actuales = linea.tramos ?? [];
    publicar("tramos_actualizados", {
      id: linea.id,
      tramos: [...actuales, nuevo],
    });
  };

  const getMetaTablaTramos = (
    cambiarCantidad: (tramo: Tramo, cantidad: number) => void
  ) => {
    return [
      {
        id: "lote_id",
        cabecera: "Lote ID",
      },
      {
        id: "ubicacion_id",
        cabecera: "Ubicación ID",
      },
      {
        id: "cantidad",
        cabecera: "Cantidad",
        render: (tramo: Tramo) => {
          const validacionParaTramo = validarCantidadTramo(tramo);
          return (
            <EditarCantidadLinea
              linea={tramo as LineaAlbaranarPedido}
              onCantidadEditada={cambiarCantidad}
              validacion={validacionParaTramo}
            />
          );
        },
      },
      {
        id: "cantidad_ko",
        cabecera: "Cantidad KO",
      },
    ];
  };

  const claseTarjeta = `tarjeta-cabecera-info ${
    servida === linea.cantidad
      ? "completa"
      : servida > 0 && servida < linea.cantidad
      ? "modificada"
      : ""
  }`.trim();

  return (
    <div className="TarjetaLinea">
      <div className="tarjeta-cabecera">
        <div className={claseTarjeta}>
          {`${linea.referencia || "-"} ${linea.descripcion || ""}`}
          <div>Cantidad: {linea.cantidad}</div>
          <div>Servida: {servida}</div>
          <div>A enviar: {aEnviar}</div>
        </div>
        <div className="tarjeta-cabecera-acciones">
          <button
            onClick={addTramo}
            disabled={aEnviar == 0}
            title={
              aEnviar == 0
                ? "No hay cantidad disponible"
                : `Añadir tramo con ${aEnviar} unidades`
            }
          >
            <QIcono nombre="añadir" tamaño="sm" />
          </button>
          <button
            onClick={() => setMostrarTramos(!mostrarTramos)}
            disabled={servida == 0}
          >
            <QIcono
              nombre={mostrarTramos ? "abajo" : "derecha"}
              tamaño="sm"
              color={servida == 0 ? "#ccc" : "#333"}
            />
          </button>
        </div>
      </div>

      <div className="tarjeta-tramos">
        <div className="tramos-lista">
          {mostrarTramos && tramos && tramos.length > 0 && (
            <QTabla
              metaTabla={getMetaTablaTramos(cambiarCantidad)}
              datos={tramos}
              cargando={false}
              orden={["id", "ASC"]}
              onOrdenar={(_: string) => null}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TarjetaLinea;
