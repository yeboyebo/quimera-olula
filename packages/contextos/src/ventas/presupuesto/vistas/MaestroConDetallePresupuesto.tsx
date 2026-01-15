import { ColumnaEstadoTabla } from "#/comun/componentes/ColumnaEstadoTabla.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { MetaTabla, QIcono } from "@olula/componentes/index.js";
import { ListadoControlado } from "@olula/componentes/maestro/ListadoControlado.js";
import { MaestroDetalleControlado } from "@olula/componentes/maestro/MaestroDetalleControlado.tsx";
import { Criteria } from "@olula/lib/diseño.js";
import { criteriaDefecto } from "@olula/lib/dominio.js";
import { useCallback, useEffect } from "react";
import { useMaestroVenta } from "../../venta/hooks/useMaestroVenta.ts";
import { Presupuesto } from "../diseño.ts";
import { metaTablaPresupuesto as metaTablaBase } from "../dominio.ts";
import { getMaquina } from "../maquinaMaestro.ts";
import { CrearPresupuesto } from "./DetallePresupuesto/CrearPresupuesto.tsx";
import { DetallePresupuesto } from "./DetallePresupuesto/DetallePresupuesto.tsx";
import "./MaestroConDetallePresupuesto.css";

export const MaestroConDetallePresupuesto = () => {
  const { ctx, emitir } = useMaestroVenta(getMaquina, {
    estado: "INICIAL",
    presupuestos: [],
    totalPresupuestos: 0,
    presupuestoActivo: null,
  });

  const setSeleccionada = useCallback(
    (payload: Presupuesto) => void emitir("presupuesto_seleccionado", payload),
    [emitir]
  );

  const recargar = useCallback(
    (criteria: Criteria) => {
      void emitir("recarga_de_presupuestos_solicitada", criteria);
    },
    [emitir]
  );

  useEffect(() => {
    emitir("recarga_de_presupuestos_solicitada", criteriaDefecto);
  }, []);

  const metaTablaPresupuesto = [
    {
      id: "estado",
      cabecera: "",
      render: (presupuesto: Presupuesto) => (
        <ColumnaEstadoTabla
          estados={{
            aprobado: (
              <QIcono
                nombre={"circulo_relleno"}
                tamaño="sm"
                color="var(--color-deshabilitado-oscuro)"
              />
            ),
            pendiente: (
              <QIcono
                nombre={"circulo_relleno"}
                tamaño="sm"
                color="var(--color-exito-oscuro)"
              />
            ),
          }}
          estadoActual={presupuesto.aprobado ? "aprobado" : "pendiente"}
        />
      ),
    },
    ...metaTablaBase,
  ] as MetaTabla<Presupuesto>;

  return (
    <div className="Presupuesto">
      <MaestroDetalleControlado<Presupuesto>
        Maestro={
          <>
            <h2>Presupuestos</h2>
            <div className="maestro-botones">
              <QBoton onClick={() => emitir("crear_presupuesto_solicitado")}>
                Nuevo Presupuesto
              </QBoton>
            </div>
            <ListadoControlado<Presupuesto>
              metaTabla={metaTablaPresupuesto}
              criteriaInicial={criteriaDefecto}
              modo={"tabla"}
              entidades={ctx.presupuestos}
              totalEntidades={ctx.totalPresupuestos}
              seleccionada={ctx.presupuestoActivo}
              onSeleccion={setSeleccionada}
              onCriteriaChanged={recargar}
            />
          </>
        }
        Detalle={
          <DetallePresupuesto
            presupuestoInicial={ctx.presupuestoActivo}
            publicar={emitir}
          />
        }
        seleccionada={ctx.presupuestoActivo}
        modoDisposicion="maestro-50"
      />

      <CrearPresupuesto
        publicar={emitir}
        onCancelar={() => emitir("creacion_cancelada")}
        activo={ctx.estado === "CREANDO_PRESUPUESTO"}
      />
    </div>
  );
};
