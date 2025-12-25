import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { Detalle } from "@olula/componentes/detalle/Detalle.tsx";
import { Tab, Tabs } from "@olula/componentes/detalle/tabs/Tabs.tsx";
import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { EmitirEvento, Entidad } from "@olula/lib/diseño.ts";
import { ConfigMaquina4, useMaquina4 } from "@olula/lib/useMaquina.ts";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useContext } from "react";
import { useParams } from "react-router";
import { TotalesVenta } from "../../../venta/vistas/TotalesVenta.tsx";
import { VentaTpv } from "../../diseño.ts";
import { metaVentaTpv, ventaTpvVacia } from "../../dominio.ts";
import {
  borrarFactura,
  getVenta,
  patchFactura
} from "../../infraestructura.ts";
import { AltaPago } from "./AltaPago.tsx";
import "./DetalleVentaTpv.css";
import { Lineas } from "./Lineas/Lineas.tsx";
import { PendienteVenta } from "./PendienteVenta.tsx";
import { TabCliente } from "./TabCliente/TabCliente.tsx";
import { TabDatos } from "./TabDatos.tsx";
import { TabObservaciones } from "./TabObservaciones.tsx";
type ParamOpcion = {
  valor: string;
  descripcion?: string;
};
export type ValorControl = null | string | ParamOpcion;
type Estado = "Defecto" | "ConfirmarBorrado" | "PagarEfectivo";
type Contexto = Record<string, unknown>;

export const DetalleVentaTpv = ({
  ventaInicial = null,
  emitir = () => {},
}: {
  ventaInicial?: VentaTpv | null;
  emitir?: EmitirEvento;
}) => {
  const params = useParams();
  const { intentar } = useContext(ContextoError);

  const ventaId = ventaInicial?.id ?? params.id;
  const titulo = (venta: Entidad) => venta.codigo as string;

  const venta = useModelo(metaVentaTpv, ventaTpvVacia);
  const { modelo, init } = venta;

  const configMaquina: ConfigMaquina4<Estado, Contexto> = {
    inicial: {
      estado: "Defecto",
      contexto: {},
    },
    estados: {
      Defecto: {
        guardar_iniciado: "Defecto",
        cliente_venta_cambiado: "Defecto",
        borrar_solicitado: "ConfirmarBorrado",
        pago_efectivo_solicitado: "PagarEfectivo",
      },
      ConfirmarBorrado: {
        borrar_confirmado: "Defecto",
        borrar_cancelado: "Defecto",
      },
      PagarEfectivo: {
        pago_creado: "Defecto",
        pago_cancelado: "Defecto",
      },
    },
  };

  const [emitirFactura, { estado }] = useMaquina4<Estado, Contexto>({
    config: configMaquina,
  });

  const recargarCabecera = async () => {
    const nuevaFactura = await getVenta(modelo.id);
    init(nuevaFactura);
    emitir("venta_cambiada", nuevaFactura);
  };

  const guardar = async () => {
    await intentar(() => patchFactura(modelo.id, modelo));
    await recargarCabecera();
    emitirFactura("guardar_iniciado");
  };

  const cancelar = () => {
    init();
    emitir("cancelar_seleccion");
  };

  const onBorrarConfirmado = async () => {
    await intentar(() => borrarFactura(modelo.id));
    emitir("venta_borrada", modelo);
    emitirFactura("borrar_confirmado");
  };

  return (
    <Detalle
      id={ventaId}
      obtenerTitulo={titulo}
      setEntidad={(f) => init(f)}
      entidad={modelo}
      cargar={getVenta}
      cerrarDetalle={cancelar}
    >
      {!!ventaId && (
        <div className="DetalleFactura">
          <div className="botones maestro-botones ">
            <QBoton onClick={() => emitirFactura("borrar_solicitado")}>
              Borrar
            </QBoton>
            <QBoton onClick={() => emitirFactura("pago_efectivo_solicitado")}>
              P. Efectivo 
            </QBoton>
          </div>
          <Tabs
            children={[
              <Tab
                key="tab-1"
                label="Cliente"
                children={
                  <TabCliente factura={venta} publicar={emitirFactura} />
                }
              />,
              <Tab
                key="tab-2"
                label="Datos"
                children={<TabDatos factura={venta} />}
              />,
              <Tab
                key="tab-3"
                label="Observaciones"
                children={<TabObservaciones factura={venta} />}
              />,
            ]}
          ></Tabs>
          {venta.modificado && (
            <div className="botones maestro-botones ">
              <QBoton onClick={guardar} deshabilitado={!venta.valido}>
                Guardar
              </QBoton>
              <QBoton tipo="reset" variante="texto" onClick={cancelar}>
                Cancelar
              </QBoton>
            </div>
          )}

          <TotalesVenta
            neto={Number(modelo.neto ?? 0)}
            totalIva={Number(modelo.total_iva ?? 0)}
            total={Number(modelo.total ?? 0)}
            divisa={String(modelo.coddivisa ?? "EUR")}
          />
          <PendienteVenta 
            total={Number(modelo.total ?? 0)}
            divisa={String(modelo.coddivisa ?? "EUR")}
            pagado={Number(modelo.pagado ?? 0)}
          />
          <Lineas
            onCabeceraModificada={recargarCabecera}
            facturaId={ventaId}
            facturaEditable={true}
          />
          <QModalConfirmacion
            nombre="borrarFactura"
            abierto={estado === "ConfirmarBorrado"}
            titulo="Confirmar borrar"
            mensaje="¿Está seguro de que desea borrar esta venta?"
            onCerrar={() => emitirFactura("borrar_cancelado")}
            onAceptar={onBorrarConfirmado}
          />
          <AltaPago
            publicar={emitirFactura}
            activo={estado === "PagarEfectivo"}
            idVenta={ventaId}
            refrescarCabecera={recargarCabecera}
            pendiente={modelo.total - modelo.pagado}
          />
        </div>
      )}
    </Detalle>
  );
};
