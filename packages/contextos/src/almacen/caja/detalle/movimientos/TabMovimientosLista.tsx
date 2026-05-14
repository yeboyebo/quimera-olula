import { ListadoSemiControlado } from "@olula/componentes/maestro/ListadoSemiControlado.tsx";
import { criteriaDefecto } from "@olula/lib/dominio.js";
import { MovimientoCaja } from "../../diseño.ts";
import { metaTablaMovimientosCaja } from "../dominio.ts";

export const TabMovimientosLista = ({
  cajaId,
  movimientos,
  seleccionada: _seleccionada,
  cargando,
  emitir: _emitir,
}: {
  cajaId: string;
  movimientos: MovimientoCaja[];
  seleccionada: MovimientoCaja | null;
  cargando: boolean;
  emitir: (evento: string, payload?: unknown) => void;
}) => {
  //   const acciones = [
  //     {
  //       icono: "eliminar",
  //       texto: "Borrar",
  //       advertencia: true,
  //       onClick: () => emitir("borrado_movimiento_solicitado"),
  //       deshabilitado: !seleccionada,
  //     },
  //   ];

  return (
    <ListadoSemiControlado
      idReiniciarCriteria={cajaId}
      metaTabla={metaTablaMovimientosCaja}
      entidades={movimientos}
      totalEntidades={movimientos.length}
      cargando={cargando}
      //   seleccionada={seleccionada}
      //   onSeleccion={(movimiento) =>
      //     emitir("movimiento_seleccionado", movimiento)
      //   }
      seleccionada={null}
      onSeleccion={() => null}
      criteriaInicial={criteriaDefecto}
      onCriteriaChanged={() => null}
      //   renderAcciones={() => (
      //     <div className="maestro-botones">
      //       <QuimeraAcciones acciones={acciones} />
      //     </div>
      //   )}
    />
  );
};
