import { BorrarOportunidadVenta } from "#/crm/oportunidadventa/borrar/BorrarOportunidadVenta.tsx";
import { nuevaOportunidadVentaVacia } from "#/crm/oportunidadventa/crear/crear.ts";
import { CrearOportunidadVenta } from "#/crm/oportunidadventa/crear/CrearOportunidadVenta.tsx";
import { OportunidadVenta } from "#/crm/oportunidadventa/diseño.ts";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QTabla } from "@olula/componentes/atomos/qtabla.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.js";
import { listaEntidadesInicial } from "@olula/lib/ListaEntidades.js";
import { HookModelo } from "@olula/lib/useModelo.ts";
import { useCallback, useEffect, useState } from "react";
import { Cliente } from "../../diseño.ts";
import { getMaquina } from "./maquina.ts";
import { metaTablaOportunidades } from "./oportunidades.ts";

export const Oportunidades = ({
  cliente,
}: {
  cliente: HookModelo<Cliente>;
}) => {
  const [cargando, setCargando] = useState(false);

  const { ctx, emitir } = useMaquina(getMaquina, {
    estado: "INICIAL",
    oportunidades: listaEntidadesInicial<OportunidadVenta>(),
  });

  const { modelo } = cliente;

  const recargar = useCallback(async () => {
    setCargando(true);
    await emitir("recarga_de_oportunidades_solicitada", modelo.id);
    setCargando(false);
  }, [emitir, setCargando, modelo.id]);

  useEffect(() => {
    recargar();
  }, [modelo.id]);

  return (
    <div className="TabOportunidades">
      <div className="maestro-botones">
        <QBoton onClick={() => emitir("creacion_de_oportunidad_solicitada")}>
          Nueva
        </QBoton>

        <QBoton
          onClick={() => emitir("borrado_oportunidad_solicitado")}
          deshabilitado={!ctx.oportunidades.activo}
        >
          Borrar
        </QBoton>
      </div>

      {ctx.estado === "CREANDO" && (
        <CrearOportunidadVenta
          publicar={emitir}
          modeloVacio={{
            ...nuevaOportunidadVentaVacia,
            cliente_id: modelo.id,
          }}
        />
      )}

      {ctx.estado === "BORRANDO" && ctx.oportunidades.activo && (
        <BorrarOportunidadVenta
          publicar={emitir}
          oportunidad={ctx.oportunidades.activo}
        />
      )}

      <QTabla
        metaTabla={metaTablaOportunidades}
        datos={ctx.oportunidades.lista}
        cargando={cargando}
        seleccionadaId={ctx.oportunidades.activo?.id}
        onSeleccion={(oportunidad) =>
          emitir("oportunidad_seleccionada", oportunidad)
        }
        orden={["id", "ASC"]}
        onOrdenar={() => null}
      />
    </div>
  );
};
