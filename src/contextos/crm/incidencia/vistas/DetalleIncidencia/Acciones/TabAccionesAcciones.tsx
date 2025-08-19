// import { QBoton } from "../../../../../../componentes/atomos/qboton.tsx";
// import { HookModelo } from "../../../../../comun/useModelo.ts";
// import { Accion } from "../../../../accion/diseño.ts";
// import { AltaAccion } from "../../../../accion/vistas/AltaAccion.tsx";
// import { BajaAccion } from "../../../../accion/vistas/BajaAccion.tsx";
// import { Incidencia } from "../../../diseño.ts";

// interface Props {
//   seleccionada?: Accion | null;
//   emitir: (evento: string, payload?: unknown) => void;
//   estado: string;
//   incidencia: HookModelo<Incidencia>;
// }

// export const TabAccionesAcciones = ({
//   seleccionada,
//   emitir,
//   estado,
//   incidencia,
// }: Props) => {
//   return (
//     <div className="TabAccionesAcciones maestro-botones">
//       <QBoton onClick={() => emitir("ALTA_SOLICITADA")}>Nueva</QBoton>
//       <QBoton
//         onClick={() => emitir("BORRADO_SOLICITADO")}
//         deshabilitado={!seleccionada}
//       >
//         Borrar
//       </QBoton>

//       <AltaAccion emitir={emitir} idIncidencia={incidencia.modelo.id} key={incidencia.modelo.id} activo={estado === "alta"}/>

//       <BajaAccion 
//         emitir={emitir}
//         activo={estado === "borrar"}
//         idAccion={seleccionada?.id}
//       />
//     </div>
//   );
// };

// // export const BajaAccion = ({
// //   emitir,
// //   activo = false,
// // }: {
// //   emitir: (evento: string, payload?: unknown) => void;
// //   idAccion?: string;
// //   activo?: boolean;
// // }) => {
// //   return (
// //     <QModalConfirmacion
// //         nombre="confirmarBorrarAccion"
// //         abierto={activo}
// //         titulo="Confirmar borrado"
// //         mensaje="¿Está seguro de que desea borrar esta acción?"
// //         onCerrar={() => emitir("BORRADO_CANCELADO")}
// //         onAceptar={() => emitir("ACCION_BORRADA")}
// //       />
// //   );
// // }
