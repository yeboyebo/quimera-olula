import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.ts";
import { ListadoControlado } from "@olula/componentes/maestro/ListadoControlado.js";
import { MaestroDetalleControlado } from "@olula/componentes/maestro/MaestroDetalleControlado.tsx";
import { Criteria } from "@olula/lib/diseño.js";
import { criteriaDefecto } from "@olula/lib/dominio.js";
import { listaEntidadesInicial } from "@olula/lib/ListaEntidades.js";
import { useCallback, useEffect, useState } from "react";
import { CrearModulo } from "../crear/CrearModulo.tsx";
import { DetalleModulo } from "../detalle/DetalleModulo.tsx";
import { Modulo } from "../diseño.ts";
import { metaTablaModulo } from "./diseño.ts";
import "./MaestroConDetalleModulo.css";
import { getMaquina } from "./maquina.ts";

/**
 * Componente principal que combina listado (maestro) + detalle
 */
export const MaestroConDetalleModulo = () => {
  const [cargando, setCargando] = useState(false);

  // Hook principal: gestiona estado y máquina
  const { ctx, emitir } = useMaquina(getMaquina, {
    estado: "INICIAL",
    modulos: listaEntidadesInicial<Modulo>(),
  });

  // Callback: crear nuevo
  const crear = useCallback(() => emitir("crear_modulo_solicitado"), [emitir]);

  // Callback: seleccionar
  const setSeleccionada = useCallback(
    (modulo: Modulo) => emitir("modulo_seleccionado", modulo),
    [emitir]
  );

  // Callback: recargar con criterios
  const recargar = useCallback(
    async (criteria: Criteria) => {
      setCargando(true);
      await emitir("recarga_de_modulos_solicitada", criteria);
      setCargando(false);
    },
    [emitir]
  );

  // Efecto: cargar datos al montar
  useEffect(() => {
    recargar(criteriaDefecto);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="Modulo">
      <MaestroDetalleControlado<Modulo>
        Maestro={
          <>
            <h2>Módulos</h2>
            <div className="maestro-botones">
              <QBoton onClick={crear}>Nuevo Módulo</QBoton>
            </div>
            <ListadoControlado<Modulo>
              metaTabla={metaTablaModulo}
              criteriaInicial={criteriaDefecto}
              modo={"tabla"}
              cargando={cargando}
              entidades={ctx.modulos.lista}
              totalEntidades={ctx.modulos.total}
              seleccionada={ctx.modulos.activo}
              onSeleccion={setSeleccionada}
              onCriteriaChanged={recargar}
            />
          </>
        }
        Detalle={
          <DetalleModulo modulo={ctx.modulos.activo} publicar={emitir} />
        }
        seleccionada={ctx.modulos.activo}
        modoDisposicion="maestro-50"
      />

      <CrearModulo
        publicar={emitir}
        onCancelar={() => emitir("creacion_cancelada")}
        activo={ctx.estado === "CREANDO_MODULO"}
      />
    </div>
  );
};
