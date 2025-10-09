import { useParams } from "react-router";
import { QBoton } from "../../../../../componentes/atomos/qboton.tsx";
import { Detalle } from "../../../../../componentes/detalle/Detalle.tsx";
import { Tab, Tabs } from "../../../../../componentes/detalle/tabs/Tabs.tsx";
import { EmitirEvento, Entidad } from "../../../../comun/diseño.ts";
import { useModelo } from "../../../../comun/useModelo.ts";
import { Factura } from "../../diseño.ts";

import {
  borrarFactura,
  getFactura,
  patchFactura,
} from "../../infraestructura.ts";
import "./DetalleFactura.css";
import { Lineas } from "./Lineas/Lineas.tsx";
import { TabCliente } from "./TabCliente/TabCliente.tsx";

import { TabObservaciones } from "./TabObservaciones.tsx";

import { useContext } from "react";
import { QModalConfirmacion } from "../../../../../componentes/moleculas/qmodalconfirmacion.tsx";
import { ContextoError } from "../../../../comun/contexto.ts";
import { ConfigMaquina4, useMaquina4 } from "../../../../comun/useMaquina.ts";
import { TotalesVenta } from "../../../venta/vistas/TotalesVenta.tsx";
import { facturaVacia, metaFactura } from "../../dominio.ts";
import { TabDatos } from "./TabDatos.tsx";

type ParamOpcion = {
  valor: string;
  descripcion?: string;
};
export type ValorControl = null | string | ParamOpcion;
type Estado = "Defecto" | "ConfirmarBorrado";
type Contexto = Record<string, unknown>;

export const DetalleFactura = ({
  facturaInicial = null,
  emitir = () => {},
}: {
  facturaInicial?: Factura | null;
  emitir?: EmitirEvento;
}) => {
  const params = useParams();
  const { intentar } = useContext(ContextoError);

  const facturaId = facturaInicial?.id ?? params.id;
  const titulo = (factura: Entidad) => factura.codigo as string;

  const factura = useModelo(metaFactura, facturaVacia);
  const { modelo, init } = factura;

  const configMaquina: ConfigMaquina4<Estado, Contexto> = {
    inicial: {
      estado: "Defecto",
      contexto: {},
    },
    estados: {
      Defecto: {
        guardar_iniciado: "Defecto",
        cliente_factura_cambiado: "Defecto",
        borrar_solicitado: "ConfirmarBorrado",
      },
      ConfirmarBorrado: {
        borrar_confirmado: "Defecto",
        borrar_cancelado: "Defecto",
      },
    },
  };

  const [emitirFactura, { estado }] = useMaquina4<Estado, Contexto>({
    config: configMaquina,
  });

  const recargarCabecera = async () => {
    const nuevaFactura = await getFactura(modelo.id);
    init(nuevaFactura);
    emitir("factura_cambiada", nuevaFactura);
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
    emitir("factura_borrada", modelo);
    emitirFactura("borrar_confirmado");
  };

  return (
    <Detalle
      id={facturaId}
      obtenerTitulo={titulo}
      setEntidad={(f) => init(f)}
      entidad={modelo}
      cargar={getFactura}
      cerrarDetalle={cancelar}
    >
      {!!facturaId && (
        <div className="DetalleFactura">
          <div className="botones maestro-botones ">
            <QBoton onClick={() => emitirFactura("borrar_solicitado")}>
              Borrar
            </QBoton>
          </div>
          <Tabs
            children={[
              <Tab
                key="tab-1"
                label="Cliente"
                children={
                  <TabCliente factura={factura} publicar={emitirFactura} />
                }
              />,
              <Tab
                key="tab-2"
                label="Datos"
                children={<TabDatos factura={factura} />}
              />,
              <Tab
                key="tab-3"
                label="Observaciones"
                children={<TabObservaciones factura={factura} />}
              />,
            ]}
          ></Tabs>
          {factura.modificado && (
            <div className="botones maestro-botones ">
              <QBoton onClick={guardar} deshabilitado={!factura.valido}>
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
          <Lineas factura={factura} onCabeceraModificada={recargarCabecera} />
          <QModalConfirmacion
            nombre="borrarFactura"
            abierto={estado === "ConfirmarBorrado"}
            titulo="Confirmar borrar"
            mensaje="¿Está seguro de que desea borrar esta factura?"
            onCerrar={() => emitirFactura("borrar_cancelado")}
            onAceptar={onBorrarConfirmado}
          />
        </div>
      )}
    </Detalle>
  );
};
