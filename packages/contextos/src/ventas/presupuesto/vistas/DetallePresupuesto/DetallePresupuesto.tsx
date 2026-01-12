import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { Detalle } from "@olula/componentes/detalle/Detalle.tsx";
import { Tab, Tabs } from "@olula/componentes/detalle/tabs/Tabs.tsx";
import { QModalConfirmacion } from "@olula/componentes/index.js";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useCallback } from "react";
import { useParams } from "react-router";
import { TotalesVenta } from "../../../venta/vistas/TotalesVenta.tsx";
import { Presupuesto } from "../../diseño.ts";
import { usePresupuesto } from "../../hooks/usePresupuesto.ts";
import "./DetallePresupuesto.css";
import { Lineas } from "./Lineas/Lineas.tsx";
import { TabCliente } from "./TabCliente/TabCliente.tsx";
import { TabDatosBase as TabDatos } from "./TabDatosBase.tsx";
import { TabObservaciones } from "./TabObservaciones.tsx";

export const DetallePresupuesto = ({
  presupuestoInicial = null,
  publicar = () => {},
}: {
  presupuestoInicial?: Presupuesto | null;
  publicar?: EmitirEvento;
}) => {
  const params = useParams();

  const presupuesto = usePresupuesto({
    presupuestoId: presupuestoInicial?.id ?? params.id,
    presupuestoInicial,
    publicar,
  });

  const { modelo, estado, lineaActiva, emitir } = presupuesto;

  const titulo = (presupuesto: Presupuesto) =>
    presupuesto.codigo || "Nuevo Presupuesto";

  const handleAprobar = useCallback(() => {
    emitir("aprobacion_solicitada", modelo);
  }, [emitir, modelo]);

  const handleBorrar = useCallback(() => {
    emitir("borrar_solicitado");
  }, [emitir]);

  const handleGuardar = useCallback(() => {
    emitir("edicion_de_presupuesto_lista", modelo);
  }, [emitir, modelo]);

  const handleCancelar = useCallback(() => {
    emitir("edicion_de_presupuesto_cancelada");
  }, [emitir]);

  return (
    <Detalle
      id={presupuestoInicial?.id ?? params.id}
      obtenerTitulo={titulo}
      setEntidad={() => {}}
      entidad={modelo}
      cerrarDetalle={() => emitir("presupuesto_deseleccionada", null)}
    >
      {!!(presupuestoInicial?.id ?? params.id) && (
        <>
          {!modelo.aprobado && (
            <div className="acciones-rapidas">
              <QBoton onClick={handleAprobar}>Aprobar</QBoton>
              <QBoton tipo="reset" variante="texto" onClick={handleBorrar}>
                Borrar
              </QBoton>
            </div>
          )}

          <Tabs>
            <Tab label="Cliente">
              <TabCliente presupuesto={presupuesto} publicar={emitir} />
            </Tab>

            <Tab label="Datos">
              <TabDatos presupuesto={presupuesto} />
            </Tab>

            <Tab label="Observaciones">
              <TabObservaciones presupuesto={presupuesto} />
            </Tab>
          </Tabs>

          {estado === "ABIERTO" && !modelo.aprobado && (
            <div className="botones maestro-botones">
              <QBoton onClick={handleGuardar}>Guardar Cambios</QBoton>
              <QBoton tipo="reset" variante="texto" onClick={handleCancelar}>
                Cancelar
              </QBoton>
            </div>
          )}

          <TotalesVenta
            neto={Number(modelo.neto ?? 0)}
            totalIva={Number(modelo.total_iva ?? 0)}
            total={Number(modelo.total ?? 0)}
            divisa={modelo.divisa_id || "EUR"}
          />

          <Lineas
            presupuesto={modelo}
            lineaActiva={lineaActiva}
            publicar={emitir}
            estadoPresupuesto={estado}
          />

          <QModalConfirmacion
            nombre="borrarPresupuesto"
            abierto={estado === "BORRANDO_PRESUPUESTO"}
            titulo="Confirmar borrar"
            mensaje="¿Está seguro de que desea borrar este presupuesto?"
            onCerrar={() => emitir("borrar_cancelado")}
            onAceptar={() => emitir("borrado_de_presupuesto_listo")}
          />

          <QModalConfirmacion
            nombre="aprobarPresupuesto"
            abierto={estado === "APROBANDO_PRESUPUESTO"}
            titulo="Confirmar aprobación"
            mensaje="¿Está seguro de que desea aprobar este presupuesto?"
            onCerrar={() => emitir("aprobacion_cancelada")}
            onAceptar={() => emitir("aprobacion_lista")}
          />
        </>
      )}
    </Detalle>
  );
};
