import { useState } from "react";
import { useParams } from "react-router";
import { QBoton } from "../../../../../componentes/atomos/qboton.tsx";
import { Detalle } from "../../../../../componentes/detalle/Detalle.tsx";
import { Tab, Tabs } from "../../../../../componentes/detalle/tabs/Tabs.tsx";
import { QModalConfirmacion } from "../../../../../componentes/moleculas/qmodalconfirmacion.tsx";
import { EmitirEvento, Entidad } from "../../../../comun/diseño.ts";
import { Maquina, useMaquina } from "../../../../comun/useMaquina.ts";
import { useModelo } from "../../../../comun/useModelo.ts";
import { TotalesVenta } from "../../../venta/TotalesVenta.tsx";
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
import { TabCliente } from "./TabCliente.tsx";
import { TabDatos } from "./TabDatos.tsx";
import { TabObservaciones } from "./TabObservaciones.tsx";

type ParamOpcion = {
  valor: string;
  descripcion?: string;
};
export type ValorControl = null | string | ParamOpcion;
type Estado = "defecto";

export const DetallePresupuesto = ({
  presupuestoInicial = null,
  emitir = () => {},
}: {
  presupuestoInicial?: Presupuesto | null;
  emitir?: EmitirEvento;
}) => {
  const params = useParams();
  const [estado, setEstado] = useState<"confirmarBorrado" | "edicion">(
    "edicion"
  );

  const presupuestoId = presupuestoInicial?.id ?? params.id;
  const titulo = (presupuesto: Entidad) => presupuesto.codigo as string;

  const ctxPresupuesto = useModelo(metaPresupuesto, presupuestoVacio());
  const { modelo, init } = ctxPresupuesto;

  const maquina: Maquina<Estado> = {
    defecto: {
      GUARDAR_INICIADO: async () => {
        await patchPresupuesto(modelo.id, modelo);
        recargarCabecera();
      },
      APROBAR_INICIADO: async () => {
        await aprobarPresupuesto(modelo.id);
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
    emitir("PRESUPUESTO_CAMBIADO", nuevoPresupuesto);
  };

  const aprobarClicked = async () => {
    await aprobarPresupuesto(modelo.id);
    const presupuesto_aprobado = await getPresupuesto(modelo.id);
    init(presupuesto_aprobado);
    emitir("PRESUPUESTO_CAMBIADO", presupuesto_aprobado);
  };

  const onBorrarConfirmado = async () => {
    await borrarPresupuesto(modelo.id);
    emitir("PRESUPUESTO_BORRADO", modelo);
    setEstado("edicion");
  };

  return (
    <Detalle
      id={presupuestoId}
      obtenerTitulo={titulo}
      setEntidad={(p) => init(p)}
      entidad={modelo}
      cargar={getPresupuesto}
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
