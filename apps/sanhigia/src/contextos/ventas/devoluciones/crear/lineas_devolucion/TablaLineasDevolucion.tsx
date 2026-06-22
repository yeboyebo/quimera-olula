import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.ts";
import { QIcono } from "@olula/componentes/index.js";
import { useEffect } from "react";
import { LineaFacturaDevolucion } from "../../diseño.ts";
import {
  ContextoLineasDevolucion,
  contextoLineasDevolucionVacio,
} from "./diseño.ts";
import { getMaquina } from "./maquina.ts";

const formatoMoneda = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
});

const formatoNumero = new Intl.NumberFormat("es-ES", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const hayLineasConCantidad = (ctx: ContextoLineasDevolucion) =>
  ctx.lineas.some((linea) => Number(linea.cantidadDevolver ?? 0) > 0);

export const TablaLineasDevolucion = ({
  lineasIniciales,
  onLineasCambiadas,
  onCrear,
}: {
  lineasIniciales: LineaFacturaDevolucion[];
  onLineasCambiadas: (lineas: LineaFacturaDevolucion[]) => void;
  onCrear: () => void;
}) => {
  const { ctx, emitir } = useMaquina(getMaquina, contextoLineasDevolucionVacio);

  useEffect(() => {
    emitir("lineas_cargadas", lineasIniciales, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lineasIniciales]);

  useEffect(() => {
    onLineasCambiadas(ctx.lineas);
  }, [ctx.lineas, onLineasCambiadas]);

  const puedeCrear = hayLineasConCantidad(ctx);

  return (
    <>
      <div className="crear-devolucion-factura-tabla">
        <table>
          <thead>
            <tr>
              <th>Referencia</th>
              <th>Descripción</th>
              <th className="alineado-derecha">Importe</th>
              <th className="alineado-derecha">Cantidad</th>
              <th className="alineado-derecha">A devolver</th>
              <th className="alineado-centro">Aplicar</th>
            </tr>
          </thead>
          <tbody>
            {ctx.lineas.map((linea) => (
              <tr key={linea.id}>
                <td>{linea.referencia}</td>
                <td>{linea.descripcion}</td>
                <td className="alineado-derecha">
                  {formatoMoneda.format(linea.importe ?? linea.total ?? 0)}
                </td>
                <td className="alineado-derecha">
                  {formatoNumero.format(linea.cantidad ?? 0)}
                </td>
                <td className="alineado-derecha">
                  <input
                    value={ctx.borradoresCantidad[linea.id] ?? "0"}
                    onChange={(evento) =>
                      emitir("borrador_cambiado", {
                        idLinea: linea.id,
                        valor: evento.target.value,
                      })
                    }
                    className="entrada-cantidad"
                    disabled={linea.esKit}
                  />
                </td>
                <td className="alineado-centro">
                  <QBoton
                    variante="texto"
                    tamaño="pequeño"
                    deshabilitado={linea.esKit}
                    onClick={() => emitir("cantidad_maxima_aplicada", linea.id)}
                  >
                    <QIcono nombre="paquete_export" />
                  </QBoton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="botones">
        <QBoton
          variante="texto"
          onClick={() => emitir("devolucion_total_aplicada")}
        >
          Devolución total
        </QBoton>
        <QBoton onClick={onCrear} deshabilitado={!puedeCrear}>
          Crear devolución
        </QBoton>
      </div>
    </>
  );
};
