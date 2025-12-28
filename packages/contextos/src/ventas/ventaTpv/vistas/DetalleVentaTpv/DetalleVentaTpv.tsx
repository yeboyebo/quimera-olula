import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { Detalle } from "@olula/componentes/detalle/Detalle.tsx";
import { Tab, Tabs } from "@olula/componentes/detalle/tabs/Tabs.tsx";
import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { EmitirEvento, Entidad, ListaSeleccionable } from "@olula/lib/diseño.ts";
import { cargar, listaSeleccionableVacia, seleccionarItem } from "@olula/lib/entidad.js";
import { ConfigMaquina4, useMaquina4 } from "@olula/lib/useMaquina.ts";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { TotalesVenta } from "../../../venta/vistas/TotalesVenta.tsx";
import { PagoVentaTpv, VentaTpv } from "../../diseño.ts";
import { metaVentaTpv, ventaTpvVacia } from "../../dominio.ts";
import {
  borrarFactura,
  getPagos,
  getVenta,
  patchFactura
} from "../../infraestructura.ts";
import { AltaPago } from "./AltaPago.tsx";
import "./DetalleVentaTpv.css";
import { Lineas } from "./Lineas/Lineas.tsx";
import { BajaPago } from "./Pagos/BajaPago.tsx";
import { Pagos } from "./Pagos/Pagos.tsx";
import { PendienteVenta } from "./PendienteVenta.tsx";
import { TabCliente } from "./TabCliente/TabCliente.tsx";
import { TabDatos } from "./TabDatos.tsx";
type ParamOpcion = {
  valor: string;
  descripcion?: string;
};
export type ValorControl = null | string | ParamOpcion;
export type EstadoVentaTpv = (
  "Defecto" | "ConfirmarBorrado" | "PAGANDO_EFECTIVO"
  | "BORRANDO_PAGO"
);
export type Contexto = {
    pagos: ListaSeleccionable<PagoVentaTpv>;
};

export const DetalleVentaTpv = ({
  ventaInicial = null,
  publicar = () => {},
}: {
  ventaInicial?: VentaTpv | null;
  publicar?: EmitirEvento;
}) => {
  const params = useParams();
  const { intentar } = useContext(ContextoError);

  const [pagos, setPagos] = useState<ListaSeleccionable<PagoVentaTpv>>({ lista:[], idActivo: null });

  const ventaId = ventaInicial?.id ?? params.id;
  const titulo = (venta: Entidad) => venta.codigo as string;

  const venta = useModelo(metaVentaTpv, ventaTpvVacia);
  const { modelo, init } = venta;

  const configMaquina: ConfigMaquina4<EstadoVentaTpv, Contexto> = {
    inicial: {
      estado: "Defecto",
      contexto: {
          pagos: listaSeleccionableVacia<PagoVentaTpv>(),
      },
    },
    estados: {
      Defecto: {
        guardar_iniciado: "Defecto",
        cliente_venta_cambiado: "Defecto",
        borrar_solicitado: "ConfirmarBorrado",
        pago_efectivo_solicitado: "PAGANDO_EFECTIVO",
        borrar_pago_solicitado: "BORRANDO_PAGO",
        pagos_cargados: "Defecto",
          
      },
      ConfirmarBorrado: {
        borrar_confirmado: "Defecto",
        borrar_cancelado: "Defecto",
      },

      PAGANDO_EFECTIVO: {
        pago_creado: "Defecto",

        pago_cancelado: "Defecto",
      },

      BORRANDO_PAGO: {
        pago_borrado: "Defecto",
        pago_borrado_cancelado: "Defecto",
      },
    },
  };

  const [emitir, { estado }] = useMaquina4<EstadoVentaTpv, Contexto>({
    config: configMaquina,
  });

  const emitirUI = async (evento: string, payload?: unknown) => {
    switch (evento) {
      case "pagos_cargados":
      case "pago_borrado": 
        const nuevosPagos = ventaId
          ? await intentar(() => getPagos(ventaId))
          : [];
          setPagos(cargar(nuevosPagos));
          await recargarCabecera();
          break;
      
      case "pago_seleccionado": {
        setPagos(seleccionarItem(payload as PagoVentaTpv));
        break;
      }
    }
    emitir(evento, payload);
  };

  const recargarCabecera = async () => {
    const nuevaFactura = await getVenta(modelo.id);
    init(nuevaFactura);
    publicar("venta_cambiada", nuevaFactura);
  };

  const guardar = async () => {
    await intentar(() => patchFactura(modelo.id, modelo));
    await recargarCabecera();
    emitir("guardar_iniciado");
  };

  const cancelar = () => {
    init();
    publicar("cancelar_seleccion");
  };

  const onBorrarConfirmado = async () => {
    await intentar(() => borrarFactura(modelo.id));
    publicar("venta_borrada", modelo);
    emitir("borrar_confirmado");
  };

  useEffect(() => {
      const cargarPagos = async () => {
        const nuevosPagos = ventaId
          ? await intentar(() => getPagos(ventaId))
          : [];

        setPagos(cargar(nuevosPagos));
      };
  
      // emitir("cargar");
      cargarPagos();
  }, [ventaId, emitir, intentar]);
  

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
            <QBoton onClick={() => emitir("borrar_solicitado")}>
              Borrar
            </QBoton>
            <QBoton onClick={() => emitir("pago_efectivo_solicitado")}>
              P. Efectivo 
            </QBoton>
          </div>
          <Tabs
            children={[
              <Tab
                key="tab-1"
                label="Cliente"
                children={
                  <TabCliente factura={venta} publicar={emitir} />
                }
              />,
              <Tab
                key="tab-2"
                label="Datos"
                children={<TabDatos factura={venta} />}
              />,
              <Tab
                key="tab-3"
                label="Pagos"
                children={<Pagos pagos={pagos} venta={venta} estado={estado} publicar={emitirUI} />}
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
            onCerrar={() => emitir("borrar_cancelado")}
            onAceptar={onBorrarConfirmado}
          />
          <AltaPago
            publicar={emitirUI}
            activo={estado === "PAGANDO_EFECTIVO"}
            idVenta={ventaId}
            pendiente={modelo.total - modelo.pagado}
          />
          <BajaPago
        publicar={emitirUI}
        activo={estado === "BORRANDO_PAGO"}
        idPago={pagos.idActivo || undefined}
        idVenta={venta.modelo.id}
      />
        </div>
      )}
    </Detalle>
  );
};
