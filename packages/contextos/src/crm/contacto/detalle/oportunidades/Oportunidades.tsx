import { BorrarOportunidadVenta } from "#/crm/oportunidadventa/borrar/BorrarOportunidadVenta.tsx";
import { nuevaOportunidadVentaVacia } from "#/crm/oportunidadventa/crear/crear.ts";
import { CrearOportunidadVenta } from "#/crm/oportunidadventa/crear/CrearOportunidadVenta.tsx";
import { OportunidadVenta } from "#/crm/oportunidadventa/diseño.ts";
import { metaTablaOportunidadVenta } from "#/crm/oportunidadventa/maestro/maestro.ts";
import { TarjetaOportunidadVenta } from "#/crm/oportunidadventa/maestro/TarjetaOportunidadVenta.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.js";
import { ListadoSemiControlado } from "@olula/componentes/maestro/ListadoSemiControlado.tsx";
import { QuimeraAcciones } from "@olula/componentes/moleculas/qacciones.tsx";
import { criteriaDefecto } from "@olula/lib/dominio.js";
import { listaEntidadesInicial } from "@olula/lib/ListaEntidades.js";
import { HookModelo } from "@olula/lib/useModelo.ts";
import { useCallback, useEffect, useState } from "react";
import { Contacto } from "../../diseño.ts";
import { getMaquina } from "./maquina.ts";

export const Oportunidades = ({
  contacto,
}: {
  contacto: HookModelo<Contacto>;
}) => {
  const [cargando, setCargando] = useState(false);

  const { ctx, emitir } = useMaquina(getMaquina, {
    estado: "INICIAL",
    oportunidades: listaEntidadesInicial<OportunidadVenta>(),
  });

  const { modelo } = contacto;

  const recargar = useCallback(async () => {
    setCargando(true);
    await emitir("recarga_de_oportunidades_solicitada", modelo.id);
    setCargando(false);
  }, [emitir, setCargando, modelo.id]);

  useEffect(() => {
    recargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelo.id]);

  return (
    <div className="TabOportunidades">
      {ctx.estado === "CREANDO" && (
        <CrearOportunidadVenta
          publicar={emitir}
          modeloVacio={{
            ...nuevaOportunidadVentaVacia,
            contacto_id: modelo.id,
          }}
        />
      )}

      {ctx.estado === "BORRANDO" && ctx.oportunidades.activo && (
        <BorrarOportunidadVenta
          publicar={emitir}
          oportunidad={ctx.oportunidades.activo}
        />
      )}

      <ListadoSemiControlado
        metaTabla={metaTablaOportunidadVenta}
        tarjeta={TarjetaOportunidadVenta}
        entidades={ctx.oportunidades.lista}
        totalEntidades={ctx.oportunidades.lista.length}
        cargando={cargando}
        renderAcciones={() => (
          <QuimeraAcciones
            vertical
            acciones={[
              {
                texto: "Nueva",
                onClick: () => emitir("creacion_de_oportunidad_solicitada"),
              },
              {
                texto: "Borrar",
                onClick: () => emitir("borrado_oportunidad_solicitado"),
                deshabilitado: !ctx.oportunidades.activo,
              },
            ]}
          />
        )}
        seleccionada={ctx.oportunidades.activo ?? null}
        onSeleccion={(oportunidad) =>
          emitir("oportunidad_seleccionada", oportunidad)
        }
        criteriaInicial={criteriaDefecto}
        onCriteriaChanged={() => null}
      />
    </div>
  );
};
