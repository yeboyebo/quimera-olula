import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.ts";
import { QIcono } from "@olula/componentes/index.js";
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
  const [facturaSeleccionada, setFacturaSeleccionada] = useState<{
    valor: string;
    descripcion: string;
  } | null>(null);
  const [lineasDevolucion, setLineasDevolucion] = useState<
    LineaFacturaDevolucion[]
  >([]);
  const [borradoresCantidad, setBorradoresCantidad] = useState<
    Record<string, string>
  >({});
  const [confirmandoCrear, setConfirmandoCrear] = useState(false);

  const formulario = useModelo(
    metaFormCrearDevolucion,
    formCrearDevolucionVacio
  );

  useEffect(() => {
    if (!activo) {
      formulario.init(formCrearDevolucionVacio);
      setFacturaSeleccionada(null);
      setLineasDevolucion([]);
      setBorradoresCantidad({});
      emitir("formulario_limpiado", null, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activo]);

  useEffect(() => {
    if (ctx.factura) {
      const lineas = ctx.factura.lineas.map((linea) => ({
        ...linea,
        cantidadDevolver: Number(linea.cantidadDevolver ?? 0),
      }));
      setLineasDevolucion(lineas);
      setBorradoresCantidad(
        lineas.reduce<Record<string, string>>(
          (acc, linea) => ({
            ...acc,
            [linea.id]: String(linea.cantidadDevolver ?? 0),
          }),
          {}
        )
      );
    }
  }, [ctx.factura]);

  const idFactura = facturaSeleccionada?.valor ?? "";
  const puedeContinuar = !!idFactura;
  const puedeCrear =
    !!ctx.factura &&
    !!formulario.modelo.razonDevolucion &&
    lineasDevolucion.some((linea) => Number(linea.cantidadDevolver ?? 0) > 0);

  const aplicarCantidadDevolver = (idLinea: string) => {
    setLineasDevolucion((actuales) =>
      actuales.map((linea) => {
        if (linea.id !== idLinea) return linea;

        const bruto = borradoresCantidad[idLinea]?.replace(",", ".") ?? "0";
        const valor = Number(bruto);
        const cantidad = Number.isNaN(valor)
          ? 0
          : Math.max(0, Math.min(valor, linea.cantidad));

        return {
          ...linea,
          cantidadDevolver: cantidad,
        };
      })
    );
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
    formulario.init(formCrearDevolucionVacio);
    setFacturaSeleccionada(null);
    setLineasDevolucion([]);
    setBorradoresCantidad({});
    setConfirmandoCrear(false);
    emitir("formulario_limpiado");
    onCancelar();
  };

  if (!activo) return null;

  return (
    <QModal
      abierto={activo}
      nombre="buscar_factura_devolucion"
      titulo="Nueva devolución"
      onCerrar={onCancelar}
    >
      <div className="buscar-factura-devolucion">
        {!ctx.factura && (
          <>
            <FacturaSelector
              valor={facturaSeleccionada?.valor ?? ""}
              descripcion={facturaSeleccionada?.descripcion ?? ""}
              nombre="devolucion/factura"
              label="Buscar factura"
              onChange={(factura) => {
                setFacturaSeleccionada(factura);
                emitir("formulario_limpiado");
              }}
            />

            <div className="botones">
              <QBoton
                onClick={() => emitir("factura_buscada", idFactura)}
                deshabilitado={!puedeContinuar}
              >
                Siguiente
              </QBoton>
              <QBoton tipo="reset" variante="texto" onClick={onCancelar}>
                Cancelar
              </QBoton>
            </div>
          </>
        )}

        {!!ctx.factura && (
          <div className="crear-devolucion-factura">
            <div className="crear-devolucion-factura-cabecera">
              <h3>Devolución Factura ({ctx.factura.cabeceraFactura.codigo})</h3>
              <QBoton variante="texto" onClick={onCancelar}>
                <QIcono nombre="cerrar" tamaño="sm" />
              </QBoton>
            </div>

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
                  {lineasDevolucion.map((linea) => (
                    <tr key={linea.id}>
                      <td>{linea.codigo}</td>
                      <td>{linea.descripcion}</td>
                      <td className="alineado-derecha">
                        {formatoMoneda.format(
                          linea.importe ?? linea.total ?? 0
                        )}
                      </td>
                      <td className="alineado-derecha">
                        {formatoNumero.format(linea.cantidad ?? 0)}
                      </td>
                      <td className="alineado-derecha">
                        <input
                          value={borradoresCantidad[linea.id] ?? "0"}
                          onChange={(evento) => {
                            setBorradoresCantidad((actuales) => ({
                              ...actuales,
                              [linea.id]: evento.target.value,
                            }));
                          }}
                          className="entrada-cantidad"
                          disabled={linea.esKit}
                        />
                      </td>
                      <td className="alineado-centro">
                        <QBoton
                          variante="texto"
                          tamaño="pequeño"
                          deshabilitado={linea.esKit}
                          onClick={() => aplicarCantidadDevolver(linea.id)}
                        >
                          Aplicar
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
                onClick={() => {
                  setLineasDevolucion((actuales) => {
                    const lineas = actuales.map((linea) => ({
                      ...linea,
                      cantidadDevolver: linea.esKit ? 0 : linea.cantidad,
                    }));

                    setBorradoresCantidad(
                      lineas.reduce<Record<string, string>>(
                        (acc, linea) => ({
                          ...acc,
                          [linea.id]: String(linea.cantidadDevolver ?? 0),
                        }),
                        {}
                      )
                    );

                    return lineas;
                  });
                }}
              >
                Devolución total
              </QBoton>
              <QBoton
                onClick={() => setConfirmandoCrear(true)}
                deshabilitado={!puedeCrear}
              >
                Crear devolución
              </QBoton>
            </div>
          </div>
        )}

        {ctx.error && <p className="mensaje-error">{ctx.error}</p>}
      </div>

      <QModalConfirmacion
        nombre="confirmar_crear_devolucion"
        abierto={confirmandoCrear}
        titulo="Confirmar creación"
        mensaje="Se va a crear un pedido de devolución con las cantidades seleccionadas ¿Está seguro?"
        onCerrar={() => setConfirmandoCrear(false)}
        onAceptar={crearDevolucion}
        labelAceptar="Confirmar"
      />
    </QModal>
  );
};
