import { ColumnaEstadoTabla } from "#/comun/componentes/ColumnaEstadoTabla.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.ts";
import { MetaTabla, QIcono } from "@olula/componentes/index.js";
import { ListadoControlado } from "@olula/componentes/maestro/ListadoControlado.js";
import { MaestroDetalleControlado } from "@olula/componentes/maestro/MaestroDetalleControlado.tsx";
import { Criteria } from "@olula/lib/diseño.js";
import { criteriaDefecto } from "@olula/lib/dominio.js";
import { listaEntidadesInicial } from "@olula/lib/ListaEntidades.js";
import { useCallback, useEffect } from "react";
import { CrearPresupuesto } from "../crear/CrearPresupuesto.tsx";
import { DetallePresupuesto } from "../detalle/DetallePresupuesto.tsx";
import {
  metaTablaPresupuesto as metaTablaBase,
  Presupuesto,
} from "./diseño.ts";
import "./MaestroConDetallePresupuesto.css";
import { getMaquina } from "./maquina.ts";

export const MaestroConDetallePresupuesto = () => {
  const { ctx, emitir } = useMaquina(getMaquina, {
    estado: "INICIAL",
    presupuestos: listaEntidadesInicial<Presupuesto>(),
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
              entidades={ctx.presupuestos.lista}
              totalEntidades={ctx.presupuestos.total}
              seleccionada={ctx.presupuestos.activo}
              onSeleccion={setSeleccionada}
              onCriteriaChanged={recargar}
            />
          </>
        }
        Detalle={
          <DetallePresupuesto
            presupuestoInicial={ctx.presupuestos.activo}
            publicar={emitir}
          />
        }
        seleccionada={ctx.presupuestos.activo}
      />

      <CrearPresupuesto
        publicar={emitir}
        onCancelar={() => emitir("creacion_presupuesto_cancelada")}
        activo={ctx.estado === "CREANDO_PRESUPUESTO"}
      />
    </div>
  );
};
