import { EditarCantidadLinea } from "#/ventas/pedido/detalle/Lineas/EditarCantidadLinea.tsx";
import { QIcono, QTabla } from "@olula/componentes/index.js";
import { ProcesarEvento } from "@olula/lib/useMaquina.js";
import { useState } from "react";
import { LineaAlbaranarPedido, Tramo } from "../../diseño.ts";
import { obtenerClaseEstadoAlbaranado } from "../../dominio.ts";
import "./TarjetaLinea.css";

export const TarjetaLinea = ({
  linea,
  publicar,
}: {
  linea: LineaAlbaranarPedido;
  publicar: ProcesarEvento;
}) => {
  const { tramos } = linea;
  const servida = linea.servida || 0;
  const aEnviar =
    (tramos && tramos.length > 0
      ? tramos.reduce(
          (total, tramo) => total + (Number(tramo.cantidad) || 0),
          0
        )
      : linea.a_enviar) || 0;
  const disponible = linea.cantidad - servida - aEnviar;

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

  const addTramo = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (disponible <= 0) {
      alert("No hay cantidad disponible para añadir más tramos.");
      return;
    }

    const nuevo: Tramo = {
      id:
        crypto && typeof crypto.randomUUID === "function"
          ? crypto.randomUUID()
          : Date.now().toString(),
      cantidad: disponible,
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
  const claseTarjeta = `tarjeta-cabecera-info ${obtenerClaseEstadoAlbaranado(
    linea
  )}`.trim();

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
            disabled={linea.cerrada || disponible <= 0}
            title={
              disponible <= 0
                ? "No hay cantidad disponible"
                : `Añadir tramo con ${disponible} unidades`
            }
          >
            <QIcono nombre="añadir" tamaño="sm" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMostrarTramos(!mostrarTramos);
            }}
            disabled={aEnviar == 0}
          >
            <QIcono
              nombre={mostrarTramos ? "abajo" : "derecha"}
              tamaño="sm"
              color={
                aEnviar == 0 ? "--color-deshabilitado" : "--color-primario"
              }
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
