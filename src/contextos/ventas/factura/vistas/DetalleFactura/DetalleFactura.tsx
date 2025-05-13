import { useParams } from "react-router";
import { QBoton } from "../../../../../componentes/atomos/qboton.tsx";
import { Detalle } from "../../../../../componentes/detalle/Detalle.tsx";
import { Tab, Tabs } from "../../../../../componentes/detalle/tabs/Tabs.tsx";
import { EmitirEvento, Entidad } from "../../../../comun/diseño.ts";
import { Maquina, useMaquina } from "../../../../comun/useMaquina.ts";
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

import { useContext, useState } from "react";
import { QModalConfirmacion } from "../../../../../componentes/moleculas/qmodalconfirmacion.tsx";
import { ContextoError } from "../../../../comun/contexto.ts";
import { TotalesVenta } from "../../../venta/TotalesVenta.tsx";
import { facturaVacia, metaFactura } from "../../dominio.ts";
import { TabDatos } from "./TabDatos.tsx";

type ParamOpcion = {
  valor: string;
  descripcion?: string;
};
export type ValorControl = null | string | ParamOpcion;
type Estado = "defecto" | "confirmarBorrado";

export const DetalleFactura = ({
  facturaInicial = null,
  emitir = () => {},
}: {
  facturaInicial?: Factura | null;
  emitir?: EmitirEvento;
}) => {
  const [estado, setEstado] = useState<Estado>("defecto");
  const params = useParams();

  const { intentar } = useContext(ContextoError);

  const facturaId = facturaInicial?.id ?? params.id;
  const titulo = (factura: Entidad) => factura.codigo as string;

  const factura = useModelo(metaFactura, facturaVacia);
  const { modelo, init } = factura;

  const maquina: Maquina<Estado> = {
    defecto: {
      GUARDAR_INICIADO: async () => {
        await intentar(() => patchFactura(modelo.id, modelo));
        recargarCabecera();
      },
      CLIENTE_FACTURA_CAMBIADO: async () => {
        await recargarCabecera();
      },
    },
    confirmarBorrado: {},
  };
  const emitirFactura = useMaquina(maquina, "defecto", () => {});

  const recargarCabecera = async () => {
    const nuevaFactura = await getFactura(modelo.id);
    init(nuevaFactura);
    emitir("FACTURA_CAMBIADA", nuevaFactura);
  };

  const onBorrarConfirmado = async () => {
    await intentar(() => borrarFactura(modelo.id));
    emitir("FACTURA_BORRADA", modelo);
    setEstado("defecto");
  };

  return (
    <Detalle
      id={facturaId}
      obtenerTitulo={titulo}
      setEntidad={(f) => init(f)}
      entidad={modelo}
      cargar={getFactura}
    >
      {!!facturaId && (
        <>
          <div className="botones maestro-botones ">
            <QBoton onClick={() => setEstado("confirmarBorrado")}>
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
              <QBoton
                onClick={() => emitirFactura("GUARDAR_INICIADO")}
                deshabilitado={!factura.valido}
              >
                Guardar
              </QBoton>
              <QBoton tipo="reset" variante="texto" onClick={() => init()}>
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
            abierto={estado === "confirmarBorrado"}
            titulo="Confirmar borrar"
            mensaje="¿Está seguro de que desea borrar esta factura?"
            onCerrar={() => setEstado("defecto")}
            onAceptar={onBorrarConfirmado}
          />
        </>
      )}
    </Detalle>
  );
};
