import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { Detalle } from "@olula/componentes/detalle/Detalle.tsx";
import { Tab, Tabs } from "@olula/componentes/detalle/tabs/Tabs.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.js";
import { QuimeraAcciones } from "@olula/componentes/index.js";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useModelo } from "@olula/lib/useModelo.js";
import { useCallback, useEffect, useRef } from "react";
import { useParams } from "react-router";
import { TotalesVenta } from "../../venta/vistas/TotalesVenta.tsx";
import { AprobarPresupuesto } from "../aprobar/AprobarPresupuesto.tsx";
import { BorrarPresupuesto } from "../borrar/BorrarPresupuesto.tsx";
import { Presupuesto } from "../diseño.ts";
import "./DetallePresupuesto.css";
import { metaPresupuesto, presupuestoVacio } from "./dominio.ts";
import { Lineas } from "./Lineas/Lineas.tsx";
import { getMaquina } from "./maquina.ts";
import { TabCliente } from "./TabCliente/TabCliente.tsx";
import { TabDatosBase as TabDatos } from "./TabDatosBase.tsx";
import { TabObservaciones } from "./TabObservaciones.tsx";

export const DetallePresupuesto = ({
  presupuestoInicial = null,
  publicar = async () => {},
}: {
  presupuestoInicial?: Presupuesto | null;
  publicar?: EmitirEvento;
}) => {
  const params = useParams();
  const presupuestoId = presupuestoInicial?.id ?? params.id;
  const presupuestoIdCargadoRef = useRef<string | null>(null);

  const { ctx, emitir } = useMaquina(
    getMaquina,
    {
      estado: "INICIAL",
      presupuesto: presupuestoInicial || presupuestoVacio(),
      presupuestoInicial: presupuestoInicial || presupuestoVacio(),
      lineaActiva: null,
    },
    publicar
  );

  const presupuesto = useModelo(metaPresupuesto, ctx.presupuesto);

  useEffect(() => {
    if (presupuestoId && presupuestoId !== presupuestoIdCargadoRef.current) {
      presupuestoIdCargadoRef.current = presupuestoId;
      emitir("presupuesto_id_cambiado", presupuestoId, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [presupuestoId]);

  const { estado, lineaActiva } = ctx;

  const titulo = (presupuesto: Presupuesto) => presupuesto.codigo;

  const handleGuardar = useCallback(() => {
    emitir("edicion_de_presupuesto_lista", presupuesto.modelo);
  }, [emitir, presupuesto]);

  const handleCancelar = useCallback(() => {
    emitir("edicion_de_presupuesto_cancelada");
  }, [emitir]);

  const acciones = [
    {
      texto: "Aprobar",
      onClick: () => emitir("aprobacion_solicitada", ctx.presupuesto),
      deshabilitado: ctx.presupuesto.aprobado,
    },
    {
      icono: "eliminar",
      texto: "Borrar",
      onClick: () => emitir("borrar_solicitado"),
      deshabilitado: ctx.presupuesto.aprobado,
    },
  ];

  return (
    <Detalle
      id={presupuestoId}
      obtenerTitulo={titulo}
      setEntidad={() => {}}
      entidad={ctx.presupuesto}
      cerrarDetalle={() => emitir("presupuesto_deseleccionada", null)}
    >
      {!!presupuestoId && (
        <>
          {!ctx.presupuesto.aprobado && (
            <QuimeraAcciones acciones={acciones} vertical />
          )}

          <Tabs>
            <Tab label="Cliente">
              <TabCliente
                presupuesto={presupuesto}
                estado={estado}
                publicar={emitir}
              />
            </Tab>

            <Tab label="Datos">
              <TabDatos presupuesto={presupuesto} />
            </Tab>

            <Tab label="Observaciones">
              <TabObservaciones presupuesto={presupuesto} />
            </Tab>
          </Tabs>

          {estado === "ABIERTO" && !ctx.presupuesto.aprobado && (
            <div className="botones maestro-botones">
              <QBoton onClick={handleGuardar}>Guardar Cambios</QBoton>
              <QBoton tipo="reset" variante="texto" onClick={handleCancelar}>
                Cancelar
              </QBoton>
            </div>
          )}

          <TotalesVenta
            neto={Number(ctx.presupuesto.neto ?? 0)}
            totalIva={Number(ctx.presupuesto.total_iva ?? 0)}
            total={Number(ctx.presupuesto.total ?? 0)}
            divisa={ctx.presupuesto.divisa_id || "EUR"}
          />

          <Lineas
            presupuesto={ctx.presupuesto}
            lineaActiva={lineaActiva}
            publicar={emitir}
            estadoPresupuesto={estado}
          />

          {estado === "BORRANDO_PRESUPUESTO" && (
            <BorrarPresupuesto
              presupuesto={ctx.presupuesto}
              publicar={emitir}
            />
          )}

          {estado === "APROBANDO_PRESUPUESTO" && (
            <AprobarPresupuesto
              presupuesto={ctx.presupuesto}
              publicar={emitir}
            />
          )}
        </>
      )}
    </Detalle>
  );
};
