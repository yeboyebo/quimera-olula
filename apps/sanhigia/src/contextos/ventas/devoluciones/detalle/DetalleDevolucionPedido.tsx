import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { Detalle } from "@olula/componentes/detalle/Detalle.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.ts";
import { QIcono } from "@olula/componentes/index.js";
import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useEffect, useState } from "react";
import "./DetalleDevolucionPedido.css";
import { contextoDetalleDevolucionPedidoVacio } from "./diseño.ts";
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

export const DetalleDevolucionPedido = ({
  id,
  publicar = async () => {},
  mostrarBotonCerrar = true,
}: {
  id?: string;
  publicar?: EmitirEvento;
  mostrarBotonCerrar?: boolean;
}) => {
  const { ctx, emitir } = useMaquina(
    getMaquina,
    contextoDetalleDevolucionPedidoVacio,
    publicar
  );
  const [confirmandoPreparar, setConfirmandoPreparar] = useState(false);

  useEffect(() => {
    emitir("id_cambiado", id ?? "", true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!id) return null;

  if (ctx.error) {
    return <div className="DetalleDevolucionPedido">{ctx.error}</div>;
  }

  if (!ctx.devolucion) {
    return (
      <div className="DetalleDevolucionPedido">Cargando devolución...</div>
    );
  }

  const cerrarDetalle = () => publicar("devolucion_deseleccionada", null);
  const fecha = ctx.devolucion.fecha
    ? ctx.devolucion.fecha.toLocaleDateString()
    : "-";
  const total = formatoMoneda.format(ctx.devolucion.total ?? 0);
  const hayErroresLineas = Object.keys(ctx.erroresLineas).length > 0;
  const hayCantidades = ctx.lineas.some(
    (linea) => (linea.cantidadOk ?? 0) + (linea.cantidadKo ?? 0) > 0
  );
  const confirmarDeshabilitado =
    ctx.lineas.length === 0 || hayErroresLineas || !hayCantidades;

  return (
    <Detalle
      id={ctx.devolucion.id}
      entidad={ctx.devolucion}
      setEntidad={() => {}}
      obtenerTitulo={undefined}
      cerrarDetalle={undefined}
      className="DetalleDevolucionPedido"
    >
      <div className="detalle-devolucion-pedido-legacy">
        <div className="devolucion-cabecera-principal">
          <h2>Devolución {ctx.devolucion.codigo}</h2>
          <h3>{fecha}</h3>
          <h3>{total}</h3>
          {mostrarBotonCerrar && (
            <QBoton
              onClick={cerrarDetalle}
              variante="texto"
              tamaño="pequeño"
              destructivo
            >
              <QIcono nombre="cerrar" tamaño="sm" />
            </QBoton>
          )}
        </div>

        <div className="devolucion-cabecera-secundaria">
          <h4>{ctx.devolucion.nombrecliente}</h4>
          <QBoton
            texto="Confirmar devolución"
            deshabilitado={confirmarDeshabilitado}
            onClick={() => setConfirmandoPreparar(true)}
          >
            Confirmar devolución
          </QBoton>
        </div>

        <div className="detalle-devolucion-pedido-lineas">
          <table>
            <thead>
              <tr>
                <th>Referencia</th>
                <th>Descripción</th>
                <th className="alineado-derecha">Cantidad</th>
                <th>Cód. Lote</th>
                <th>F. Caducidad</th>
                <th className="alineado-derecha">Correcta</th>
                <th className="alineado-derecha">Dañada</th>
                <th className="alineado-centro">Limpiar</th>
              </tr>
            </thead>
            <tbody>
              {ctx.lineas.map((linea) => (
                <tr key={linea.id}>
                  <td>{linea.codigo}</td>
                  <td>{linea.descripcion}</td>
                  <td className="alineado-derecha">
                    {formatoNumero.format(linea.cantidad ?? 0)}
                  </td>
                  <td>{linea.codLote || "-"}</td>
                  <td>
                    {linea.fechaCaducidad
                      ? linea.fechaCaducidad.toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="alineado-derecha celda-cantidad-editar">
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      value={linea.cantidadOk ?? 0}
                      onChange={(evento) =>
                        emitir("cantidad_ok_cambiada", {
                          idLinea: linea.id,
                          valor: Number(evento.target.value),
                        })
                      }
                    />
                  </td>
                  <td className="alineado-derecha celda-cantidad-editar">
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      value={linea.cantidadKo ?? 0}
                      onChange={(evento) =>
                        emitir("cantidad_ko_cambiada", {
                          idLinea: linea.id,
                          valor: Number(evento.target.value),
                        })
                      }
                    />
                  </td>
                  <td className="alineado-centro">
                    <QBoton
                      variante="texto"
                      tamaño="pequeño"
                      deshabilitado={
                        (linea.cantidadOk ?? 0) + (linea.cantidadKo ?? 0) === 0
                      }
                      onClick={() =>
                        emitir("cantidades_limpiadas", { idLinea: linea.id })
                      }
                    >
                      <QIcono nombre="cerrar" tamaño="sm" />
                    </QBoton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {hayErroresLineas && (
            <p className="detalle-devolucion-error-lineas">
              Revisa las cantidades: correcta + dañada no puede superar la
              cantidad de la línea.
            </p>
          )}
        </div>
      </div>

      <QModalConfirmacion
        nombre="confirmar_preparar_devolucion"
        abierto={confirmandoPreparar}
        titulo="Confirmar preparación"
        mensaje="Se va a preparar la devolución ¿Está seguro?"
        onCerrar={() => setConfirmandoPreparar(false)}
        onAceptar={async () => {
          await emitir("devolucion_preparada");
          setConfirmandoPreparar(false);
        }}
        labelAceptar="Confirmar"
      />
    </Detalle>
  );
};
