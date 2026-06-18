import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.ts";
import { QModal } from "@olula/componentes/moleculas/qmodal.tsx";
import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { FacturaSelector } from "@olula/ctx/ventas/comun/componentes/factura.tsx";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useEffect, useState } from "react";
import { LineaFacturaDevolucion } from "../diseño.ts";
import { crearDevolucionPedido } from "../infraestructura.ts";
import "./buscar_factura_devolucion.css";
import { contextoCrearDevolucionVacio } from "./diseño.ts";
import {
  formCrearDevolucionVacio,
  metaFormCrearDevolucion,
} from "./dominio.ts";
import { TablaLineasDevolucion } from "./lineas_devolucion/TablaLineasDevolucion.tsx";
import { getMaquina } from "./maquina.ts";

const formatoMoneda = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
});

export const BuscarFacturaDevolucion = ({
  publicar = async () => {},
  onCancelar = () => {},
  activo = false,
}: {
  publicar?: EmitirEvento;
  onCancelar?: () => void;
  activo?: boolean;
}) => {
  const { ctx, emitir } = useMaquina(getMaquina, contextoCrearDevolucionVacio);
  const [lineasDevolucion, setLineasDevolucion] = useState<
    LineaFacturaDevolucion[]
  >([]);
  const [confirmandoCrear, setConfirmandoCrear] = useState(false);

  const formulario = useModelo(
    metaFormCrearDevolucion,
    formCrearDevolucionVacio
  );

  useEffect(() => {
    if (!activo) {
      formulario.init(formCrearDevolucionVacio);
      setLineasDevolucion([]);
      emitir("formulario_limpiado", null, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activo]);

  const idFactura = ctx.facturaSeleccionada?.valor ?? "";
  const puedeContinuar = !!idFactura;

  const cerrarFlujo = () => {
    formulario.init(formCrearDevolucionVacio);
    setLineasDevolucion([]);
    setConfirmandoCrear(false);
    emitir("formulario_limpiado");
    onCancelar();
  };

  const crearDevolucion = async () => {
    if (!ctx.factura || !idFactura) return;

    const devolucionCreada = await crearDevolucionPedido({
      idFactura,
      razonDevolucion: formulario.modelo.razonDevolucion,
      lineasConDevoluciones: lineasDevolucion.map((linea) => ({
        idLineaFactura: linea.id,
        cantidadDevolver: Number(linea.cantidadDevolver ?? 0),
      })),
    });

    publicar("devolucion_creada", devolucionCreada);
    cerrarFlujo();
  };

  const mostrarBusqueda = activo && ctx.estado === "SELECCIONANDO_FACTURA";
  const mostrarEdicion =
    activo && ctx.estado === "EDITANDO_DEVOLUCION" && !!ctx.factura;

  return (
    <>
      <QModal
        abierto={mostrarBusqueda}
        nombre="buscar_factura_devolucion"
        titulo="Nueva devolución"
        onCerrar={cerrarFlujo}
      >
        <div className="buscar-factura-devolucion">
          <>
            <FacturaSelector
              valor={ctx.facturaSeleccionada?.valor ?? ""}
              descripcion={ctx.facturaSeleccionada?.descripcion ?? ""}
              nombre="devolucion/factura"
              label="Buscar factura"
              onChange={(factura) => emitir("factura_seleccionada", factura)}
            />

            <div className="botones">
              <QBoton
                onClick={() => emitir("factura_buscada", idFactura)}
                deshabilitado={!puedeContinuar}
              >
                Siguiente
              </QBoton>
              <QBoton tipo="reset" variante="texto" onClick={cerrarFlujo}>
                Cancelar
              </QBoton>
            </div>

            {ctx.error && <p className="mensaje-error">{ctx.error}</p>}
          </>
        </div>
      </QModal>

      <QModal
        abierto={mostrarEdicion}
        nombre="crear_devolucion_factura"
        titulo="Configurar devolución"
        onCerrar={cerrarFlujo}
      >
        {!!ctx.factura && (
          <div className="buscar-factura-devolucion crear-devolucion-factura">
            <h3>Devolución factura ({ctx.factura.cabeceraFactura.codigo})</h3>

            <div className="crear-devolucion-factura-resumen">
              <h4>{ctx.factura.cabeceraFactura.nombrecliente}</h4>
              <h4>
                {ctx.factura.cabeceraFactura.fecha
                  ? ctx.factura.cabeceraFactura.fecha.toLocaleDateString()
                  : "-"}
              </h4>
              <h4>{formatoMoneda.format(ctx.factura.cabeceraFactura.total)}</h4>
            </div>

            <quimera-formulario>
              <QInput
                label="Razón de devolución"
                {...formulario.uiProps("razonDevolucion")}
              />
            </quimera-formulario>

            <TablaLineasDevolucion
              lineasIniciales={ctx.factura.lineas}
              razonDevolucion={formulario.modelo.razonDevolucion}
              onLineasCambiadas={setLineasDevolucion}
              onCrear={() => setConfirmandoCrear(true)}
            />

            <div className="botones">
              <QBoton
                variante="texto"
                onClick={() => emitir("volver_a_busqueda")}
              >
                Cambiar factura
              </QBoton>
              <QBoton tipo="reset" variante="texto" onClick={cerrarFlujo}>
                Cancelar
              </QBoton>
            </div>

            {ctx.error && <p className="mensaje-error">{ctx.error}</p>}
          </div>
        )}
      </QModal>

      <QModalConfirmacion
        nombre="confirmar_crear_devolucion"
        abierto={confirmandoCrear}
        titulo="Confirmar creación"
        mensaje="Se va a crear un pedido de devolución con las cantidades seleccionadas ¿Está seguro?"
        onCerrar={() => setConfirmandoCrear(false)}
        onAceptar={crearDevolucion}
        labelAceptar="Confirmar"
      />
    </>
  );
};
