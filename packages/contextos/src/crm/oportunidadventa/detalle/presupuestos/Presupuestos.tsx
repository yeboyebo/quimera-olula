import { BorrarPresupuesto } from "#/ventas/presupuesto/borrar/BorrarPresupuesto.tsx";
import { Presupuesto } from "#/ventas/presupuesto/diseño.ts";
import { getPresupuesto } from "#/ventas/presupuesto/infraestructura.ts";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.js";
import { MetaTabla } from "@olula/componentes/index.js";
import { ListadoSemiControlado } from "@olula/componentes/maestro/ListadoSemiControlado.tsx";
import { listaEntidadesInicial } from "@olula/lib/ListaEntidades.js";
import { criteriaDefecto } from "@olula/lib/dominio.js";
import { HookModelo } from "@olula/lib/useModelo.ts";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router";
import { OportunidadVenta } from "../../diseño.ts";
import { crearPresupuestoOportunidad } from "../../infraestructura.ts";
import { getMaquina } from "./maquina.ts";
import { metaTablaPresupuesto } from "./presupuestos.ts";

const metaTabla: MetaTabla<Presupuesto> = [
  ...metaTablaPresupuesto,
  {
    id: "ver_presupuesto",
    cabecera: "",
    tipo: "booleano",
    ancho: "80px",
    render: (v) => (
      <Link to={`/ventas/presupuesto?id=${v.id}`}>
        <QBoton>Ver presupuesto</QBoton>
      </Link>
    ),
  },
];

export const Presupuestos = ({
  oportunidad,
}: {
  oportunidad: HookModelo<OportunidadVenta>;
}) => {
  const [cargando, setCargando] = useState(false);

  const { ctx, emitir } = useMaquina(getMaquina, {
    estado: "INICIAL",
    presupuestos: listaEntidadesInicial<Presupuesto>(),
  });

  const { modelo } = oportunidad;

  const crearPresupuesto = async () => {
    const nuevoPresupuestoId = await crearPresupuestoOportunidad(
      modelo.id,
      modelo.cliente_id || ""
    );
    const nuevoPresupuesto = await getPresupuesto(nuevoPresupuestoId);
    await emitir("presupuesto_creado", nuevoPresupuesto);
  };

  const recargar = useCallback(async () => {
    setCargando(true);
    await emitir("recarga_de_presupuestos_solicitada", modelo.id);
    setCargando(false);
  }, [emitir, setCargando, modelo.id]);

  useEffect(() => {
    recargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelo.id]);

  return (
    <div className="TabPresupuestos">
      {ctx.estado === "BORRANDO" && ctx.presupuestos.activo && (
        <BorrarPresupuesto
          publicar={emitir}
          presupuesto={ctx.presupuestos.activo}
        />
      )}

      <ListadoSemiControlado
        metaTabla={metaTabla}
        entidades={ctx.presupuestos.lista}
        totalEntidades={ctx.presupuestos.lista.length}
        cargando={cargando}
        renderAcciones={() => (
          <div className="maestro-botones">
            <QBoton onClick={() => crearPresupuesto()}>Nuevo</QBoton>

            <QBoton
              onClick={() => emitir("borrado_presupuesto_solicitado")}
              deshabilitado={!ctx.presupuestos.activo}
            >
              Borrar
            </QBoton>
          </div>
        )}
        seleccionada={ctx.presupuestos.activo ?? null}
        onSeleccion={(presupuesto) =>
          emitir("presupuesto_seleccionado", presupuesto)
        }
        criteriaInicial={criteriaDefecto}
        onCriteriaChanged={() => null}
      />
    </div>
  );
};
