import { ColumnaEstadoTabla } from "#/comun/componentes/ColumnaEstadoTabla.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { MetaTabla, QIcono } from "@olula/componentes/index.js";
import { ListadoControlado } from "@olula/componentes/maestro/ListadoControlado.js";
import { MaestroDetalleControlado } from "@olula/componentes/maestro/MaestroDetalleControlado.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { Criteria } from "@olula/lib/diseño.js";
import { criteriaDefecto, procesarEvento } from "@olula/lib/dominio.js";
import { useCallback, useContext, useEffect, useState } from "react";
import { ContextoMaestroPresupuesto, Presupuesto } from "../diseño.ts";
import { metaTablaPresupuesto as metaTablaBase } from "../dominio.ts";
import { getMaquina } from "../maquinaMaestro.ts";
import { CrearPresupuesto } from "./DetallePresupuesto/CrearPresupuesto.tsx";
import { DetallePresupuesto } from "./DetallePresupuesto/DetallePresupuesto.tsx";
import "./MaestroConDetallePresupuesto.css";

const maquina = getMaquina();

export const MaestroConDetallePresupuesto = () => {
  const [creandoPresupuesto, setCreandoPresupuesto] = useState(false);
  const { intentar } = useContext(ContextoError);

  const [ctx, setCtx] = useState<ContextoMaestroPresupuesto>({
    estado: "INICIAL",
    presupuestos: [],
    totalPresupuestos: 0,
    presupuestoActivo: null,
  });

  const emitir = useCallback(
    async (evento: string, payload?: unknown) => {
      const [nuevoContexto, _] = await intentar(() =>
        procesarEvento(maquina, ctx, evento, payload)
      );
      setCtx(nuevoContexto);
    },
    [ctx, setCtx, intentar]
  );

  const crear = useCallback(() => setCreandoPresupuesto(true), [emitir]);

  const setSeleccionada = useCallback(
    (payload: Presupuesto) => emitir("presupuesto_seleccionado", payload),
    [emitir]
  );

  const recargar = useCallback(
    async (criteria: Criteria) => {
      emitir("recarga_de_presupuestos_solicitada", criteria);
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
              <QBoton onClick={crear}>Nuevo Presupuesto</QBoton>
            </div>
            <ListadoControlado<Presupuesto>
              metaTabla={metaTablaPresupuesto}
              criteria={criteriaDefecto}
              modo={"tabla"}
              entidades={ctx.presupuestos}
              totalEntidades={ctx.totalPresupuestos}
              seleccionada={ctx.presupuestoActivo}
              setSeleccionada={setSeleccionada}
              recargar={recargar}
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
        onCancelar={() => setCreandoPresupuesto(false)}
        activo={creandoPresupuesto}
      />
    </div>
  );
};
