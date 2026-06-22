import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { Detalle } from "@olula/componentes/detalle/Detalle.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.ts";
import { MetaTabla, QIcono, QInput, QTabla } from "@olula/componentes/index.js";
import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useEffect, useState } from "react";
import { LineaDevolucionPedido } from "../diseño.ts";
import "./DetalleDevolucionPedido.css";
import { contextoDetalleDevolucionPedidoVacio } from "./diseño.ts";
import { getMaquina } from "./maquina.ts";

const formatoMoneda = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
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

  const metaTablaLineas: MetaTabla<LineaDevolucionPedido> = [
    {
      id: "referencia",
      cabecera: "Referencia",
      render: (linea) => linea.referencia || linea.codigo,
    },
    { id: "descripcion", cabecera: "Descripción" },
    { id: "cantidad", cabecera: "Cantidad", tipo: "numero" },
    {
      id: "codLote",
      cabecera: "Cód. Lote",
      render: (linea) => linea.codLote || "-",
    },
    {
      id: "fechaCaducidad",
      cabecera: "F. Caducidad",
      render: (linea) =>
        linea.fechaCaducidad ? linea.fechaCaducidad.toLocaleDateString() : "-",
    },
    {
      id: "cantidadOk",
      cabecera: "Correcta",
      render: (linea) => (
        <div className="celda-cantidad-input">
          <QInput
            label=""
            nombre={`cantidad_ok_${linea.id}`}
            tipo="decimal"
            valor={String(linea.cantidadOk ?? 0)}
            onChange={(valor) =>
              emitir("cantidad_ok_cambiada", {
                idLinea: linea.id,
                valor: Number(valor),
              })
            }
          />
        </div>
      ),
    },
    {
      id: "cantidadKo",
      cabecera: "Dañada",
      render: (linea) => (
        <div className="celda-cantidad-input">
          <QInput
            label=""
            nombre={`cantidad_ko_${linea.id}`}
            tipo="decimal"
            valor={String(linea.cantidadKo ?? 0)}
            onChange={(valor) =>
              emitir("cantidad_ko_cambiada", {
                idLinea: linea.id,
                valor: Number(valor),
              })
            }
          />
        </div>
      ),
    },
    {
      id: "limpiar",
      cabecera: "Limpiar",
      render: (linea) => (
        <div className="alineado-centro">
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
        </div>
      ),
    },
  ];

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
          <QTabla
            metaTabla={metaTablaLineas}
            datos={ctx.lineas}
            cargando={false}
            orden={["referencia", "ASC"]}
          />

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
          publicar("devolucion_deseleccionada", null);
          setConfirmandoPreparar(false);
        }}
        labelAceptar="Confirmar"
      />
    </Detalle>
  );
};
