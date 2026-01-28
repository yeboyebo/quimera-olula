import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { Detalle } from "@olula/componentes/detalle/Detalle.tsx";
import { Tab, Tabs } from "@olula/componentes/detalle/tabs/Tabs.tsx";
import { QuimeraAcciones } from "@olula/componentes/index.js";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useCallback } from "react";
import { useParams } from "react-router";
import { TotalesVenta } from "../../venta/vistas/TotalesVenta.tsx";
import { AprobarPresupuesto } from "../aprobar/AprobarPresupuesto.tsx";
import { BorrarPresupuesto } from "../borrar/BorrarPresupuesto.tsx";
import { Presupuesto } from "../diseño.ts";
import "./DetallePresupuesto.css";
import { usePresupuesto } from "./hooks/usePresupuesto.ts";
import { Lineas } from "./Lineas/Lineas.tsx";
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

  const presupuesto = usePresupuesto({
    presupuestoId: presupuestoInicial?.id ?? params.id,
    presupuestoInicial,
    publicar,
  });

  const { modelo, estado, lineaActiva, emitir } = presupuesto;

  const titulo = (presupuesto: Presupuesto) => presupuesto.codigo;

  const handleGuardar = useCallback(() => {
    emitir("edicion_de_presupuesto_lista", modelo);
  }, [emitir, modelo]);

  const handleCancelar = useCallback(() => {
    emitir("edicion_de_presupuesto_cancelada");
  }, [emitir]);

  const acciones = [
    {
      texto: "Aprobar",
      onClick: () => emitir("aprobacion_solicitada", modelo),
      deshabilitado: modelo.aprobado,
    },
    {
      icono: "eliminar",
      texto: "Borrar",
      onClick: () => emitir("borrar_solicitado"),
      deshabilitado: modelo.aprobado,
    },
  ];

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
          {!modelo.aprobado && <QuimeraAcciones acciones={acciones} vertical />}

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

          {estado === "BORRANDO_PRESUPUESTO" && (
            <BorrarPresupuesto presupuesto={modelo} publicar={emitir} />
          )}

          {estado === "APROBANDO_PRESUPUESTO" && (
            <AprobarPresupuesto presupuesto={modelo} publicar={emitir} />
          )}
        </>
      )}
    </Detalle>
  );
};
