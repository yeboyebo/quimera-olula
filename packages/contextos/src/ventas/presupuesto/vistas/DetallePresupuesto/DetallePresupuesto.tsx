import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { Detalle } from "@olula/componentes/detalle/Detalle.tsx";
import { Tab, Tabs } from "@olula/componentes/detalle/tabs/Tabs.tsx";
import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { EmitirEvento, Entidad } from "@olula/lib/diseño.ts";
import { Maquina, useMaquina } from "@olula/lib/useMaquina.ts";
import { useModelo } from "@olula/lib/useModelo.ts";
import { JSX, useContext, useState } from "react";
import { useParams } from "react-router";
import { TotalesVenta } from "../../../venta/vistas/TotalesVenta.tsx";
import { Presupuesto } from "../../diseño.ts";
import { metaPresupuesto, presupuestoVacio } from "../../dominio.ts";
import {
  aprobarPresupuesto,
  borrarPresupuesto,
  getPresupuesto,
  patchPresupuesto,
} from "../../infraestructura.ts";

import "./DetallePresupuesto.css";
import { Lineas } from "./Lineas/Lineas.tsx";

import { ContextoError } from "@olula/lib/contexto.ts";
import { TabCliente } from "./TabCliente/TabCliente.tsx";
import { TabDatosProps } from "./TabDatosBase.tsx";
import { TabObservaciones } from "./TabObservaciones.tsx";

type ParamOpcion = {
  valor: string;
  descripcion?: string;
};
export type ValorControl = null | string | ParamOpcion;
type Estado = "defecto";

export const DetallePresupuesto = ({
  TabDatos,
  presupuestoInicial = null,
  publicar = () => {},
}: {
  TabDatos: (props: TabDatosProps) => JSX.Element;
  presupuestoInicial?: Presupuesto | null;
  publicar?: EmitirEvento;
}) => {
  const params = useParams();
  const [estado, setEstado] = useState<"confirmarBorrado" | "edicion">(
    "edicion"
  );
  const { intentar } = useContext(ContextoError);

  const presupuestoId = presupuestoInicial?.id ?? params.id;
  const titulo = (presupuesto: Entidad) => presupuesto.codigo as string;

  const ctxPresupuesto = useModelo(metaPresupuesto, presupuestoVacio());
  const { modelo, init } = ctxPresupuesto;

  const maquina: Maquina<Estado> = {
    defecto: {
      GUARDAR_INICIADO: async () => {
        await intentar(() => patchPresupuesto(modelo.id, modelo));
        recargarCabecera();
      },
      APROBAR_INICIADO: async () => {
        await intentar(() => aprobarPresupuesto(modelo.id));
        recargarCabecera();
      },
      CLIENTE_PRESUPUESTO_CAMBIADO: async () => {
        await recargarCabecera();
      },
    },
  };
  const emitirPresupuesto = useMaquina(maquina, "defecto", () => {});

  const recargarCabecera = async () => {
    const nuevoPresupuesto = await getPresupuesto(modelo.id);
    init(nuevoPresupuesto);
    publicar("presupuesto_cambiado", nuevoPresupuesto);
  };

  const aprobarClicked = async () => {
    await intentar(() => aprobarPresupuesto(modelo.id));
    const presupuesto_aprobado = await getPresupuesto(modelo.id);
    init(presupuesto_aprobado);
    publicar("presupuesto_cambiado", presupuesto_aprobado);
  };

  const onBorrarConfirmado = async () => {
    await intentar(() => borrarPresupuesto(modelo.id));
    publicar("presupuesto_borrado", modelo);
    setEstado("edicion");
  };

  return (
    <Detalle
      id={presupuestoId}
      obtenerTitulo={titulo}
      setEntidad={(p) => init(p)}
      entidad={modelo}
      cargar={getPresupuesto}
      cerrarDetalle={() => publicar("seleccion_presupuesto_cancelada")}
    >
      {!!presupuestoId && (
        <>
          {!modelo.aprobado && (
            <div className="botones maestro-botones ">
              <QBoton onClick={aprobarClicked}>Aprobar</QBoton>
              <QBoton onClick={() => setEstado("confirmarBorrado")}>
                Borrar
              </QBoton>
            </div>
          )}
          <Tabs
            children={[
              <Tab
                key="tab-1"
                label="Cliente"
                children={
                  <TabCliente
                    presupuesto={ctxPresupuesto}
                    publicar={emitirPresupuesto}
                  />
                }
              />,
              <Tab
                key="tab-2"
                label="Datos"
                children={<TabDatos presupuesto={ctxPresupuesto} />}
              />,
              <Tab
                key="tab-3"
                label="Observaciones"
                children={<TabObservaciones ctxPresupuesto={ctxPresupuesto} />}
              />,
            ]}
          ></Tabs>
          {ctxPresupuesto.modificado && (
            <div className="botones maestro-botones ">
              <QBoton
                onClick={() => emitirPresupuesto("GUARDAR_INICIADO")}
                deshabilitado={!ctxPresupuesto.valido}
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
          <Lineas
            presupuesto={ctxPresupuesto}
            onCabeceraModificada={recargarCabecera}
          />
          <QModalConfirmacion
            nombre="borrarPresupuesto"
            abierto={estado === "confirmarBorrado"}
            titulo="Confirmar borrar"
            mensaje="¿Está seguro de que desea borrar este presupuesto?"
            onCerrar={() => setEstado("edicion")}
            onAceptar={onBorrarConfirmado}
          />
        </>
      )}
    </Detalle>
  );
};
