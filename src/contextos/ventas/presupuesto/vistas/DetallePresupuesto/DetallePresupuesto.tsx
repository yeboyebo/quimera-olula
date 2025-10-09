import { JSX, useContext } from "react";
import { useParams } from "react-router";
import { QBoton } from "../../../../../componentes/atomos/qboton.tsx";
import { Detalle } from "../../../../../componentes/detalle/Detalle.tsx";
import { Tab, Tabs } from "../../../../../componentes/detalle/tabs/Tabs.tsx";
import { EmitirEvento, Entidad } from "../../../../comun/diseño.ts";
import { ConfigMaquina4, useMaquina4 } from "../../../../comun/useMaquina.ts";
import { useModelo } from "../../../../comun/useModelo.ts";
import { TotalesVenta } from "../../../venta/vistas/TotalesVenta.tsx";
import { Presupuesto } from "../../diseño.ts";
import { metaPresupuesto, presupuestoVacio } from "../../dominio.ts";
import {
  aprobarPresupuesto,
  getPresupuesto,
  patchPresupuesto,
} from "../../infraestructura.ts";

import "./DetallePresupuesto.css";
import { Lineas } from "./Lineas/Lineas.tsx";

import { ContextoError } from "../../../../comun/contexto.ts";
import { BorrarPresupuesto } from "../BorrarPresupuesto.tsx";
import { TabCliente } from "./TabCliente/TabCliente.tsx";
import { TabDatosProps } from "./TabDatosBase.tsx";
import { TabObservaciones } from "./TabObservaciones.tsx";

type ParamOpcion = {
  valor: string;
  descripcion?: string;
};
export type ValorControl = null | string | ParamOpcion;
type Estado = "editando" | "borrando";
type Contexto = Record<string, unknown>;

const configMaquina: ConfigMaquina4<Estado, Contexto> = {
  inicial: {
    estado: "editando",
    contexto: {},
  },
  estados: {
    editando: {
      borrar_presupuesto: "borrando",
      presupuesto_guardado: ({ publicar }) => publicar("presupuesto_guardado"),
    },
    borrando: {
      cancelar_borrado: "editando",
      presupuesto_borrado: ({ publicar }) => publicar("presupuesto_borrado"),
    },
  },
};

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
  const { intentar } = useContext(ContextoError);

  const presupuestoId = presupuestoInicial?.id ?? params.id;
  const titulo = (presupuesto: Entidad) => presupuesto.codigo as string;

  const ctxPresupuesto = useModelo(metaPresupuesto, presupuestoVacio());
  const { modelo, init } = ctxPresupuesto;

  const recargarCabecera = async () => {
    const nuevoPresupuesto = await getPresupuesto(modelo.id);
    init(nuevoPresupuesto);
    publicar("presupuesto_cambiado", nuevoPresupuesto);
  };

  const aprobar = async () => {
    await intentar(() => aprobarPresupuesto(modelo.id));
    await recargarCabecera();
    emitir("presupuesto_guardado");
  };

  const guardar = async () => {
    await intentar(() => patchPresupuesto(modelo.id, modelo));
    await recargarCabecera();
    emitir("presupuesto_guardado");
  };

  const cancelar = () => {
    init();
  };

  const [emitir, { estado }] = useMaquina4<Estado, Contexto>({
    config: configMaquina,
    publicar,
  });

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
              <QBoton onClick={aprobar}>Aprobar</QBoton>
              <QBoton onClick={() => emitir("borrar_presupuesto")}>
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
                    publicar={() => recargarCabecera()}
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
              <QBoton onClick={guardar} deshabilitado={!ctxPresupuesto.valido}>
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
          <Lineas
            presupuesto={ctxPresupuesto}
            onCabeceraModificada={recargarCabecera}
          />
          <BorrarPresupuesto
            publicar={emitir}
            activo={estado === "borrando"}
            presupuesto={modelo}
          />
        </>
      )}
    </Detalle>
  );
};
