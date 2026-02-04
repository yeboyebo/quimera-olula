import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.js";
import { ListadoControlado } from "@olula/componentes/maestro/ListadoControlado.js";
import { MaestroDetalleControlado } from "@olula/componentes/maestro/MaestroDetalleControlado.tsx";
import { Criteria } from "@olula/lib/diseño.js";
import { criteriaDefecto } from "@olula/lib/dominio.js";
import { listaEntidadesInicial } from "@olula/lib/ListaEntidades.js";
import { useCallback, useEffect, useState } from "react";
import { CrearOportunidadVenta } from "../crear/CrearOportunidadVenta.tsx";
import { DetalleOportunidadVenta } from "../detalle/DetalleOportunidadVenta.tsx";
import { OportunidadVenta } from "../diseño.ts";
import { TarjetaOportunidadVenta } from "../vistas/TarjetaOportunidadVenta.tsx";
import { metaTablaOportunidadVenta } from "./maestro.ts";
import "./MaestroOportunidadesVenta.css";
import { getMaquina } from "./maquina.ts";

export const MaestroOportunidades = () => {
  const [cargando, setCargando] = useState(false);

  const { ctx, emitir } = useMaquina(getMaquina, {
    estado: "INICIAL",
    oportunidades: listaEntidadesInicial<OportunidadVenta>(),
  });

  const recargar = useCallback(
    async (criteria: Criteria) => {
      setCargando(true);
      await emitir("recarga_de_oportunidades_solicitada", criteria);
      setCargando(false);
    },
    [emitir, setCargando]
  );

  useEffect(() => {
    recargar(criteriaDefecto);
  }, []);

  return (
    <div className="OportunidadesVenta">
      <MaestroDetalleControlado<OportunidadVenta>
        Maestro={
          <>
            <h2>Oportunidades de Venta</h2>

            <div className="maestro-botones">
              <QBoton
                onClick={() => emitir("creacion_de_oportunidad_solicitada")}
              >
                Nueva
              </QBoton>
            </div>

            <ListadoControlado<OportunidadVenta>
              metaTabla={metaTablaOportunidadVenta}
              metaFiltro={true}
              cargando={cargando}
              criteriaInicial={criteriaDefecto}
              modo={"tabla"}
              tarjeta={(oportunidad) => (
                <TarjetaOportunidadVenta oportunidad={oportunidad} />
              )}
              entidades={ctx.oportunidades.lista}
              totalEntidades={ctx.oportunidades.total}
              seleccionada={ctx.oportunidades.activo}
              onSeleccion={(payload) =>
                emitir("oportunidad_seleccionada", payload)
              }
              onCriteriaChanged={recargar}
            />
          </>
        }
        Detalle={
          <DetalleOportunidadVenta
            inicial={ctx.oportunidades.activo}
            publicar={emitir}
          />
        }
        seleccionada={ctx.oportunidades.activo}
        modoDisposicion="maestro-50"
      />

      {ctx.estado === "CREANDO" && <CrearOportunidadVenta publicar={emitir} />}
    </div>
  );
};
