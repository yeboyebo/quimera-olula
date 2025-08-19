// import { useContext } from "react";
// import { QBoton } from "../../../../../../componentes/atomos/qboton.tsx";
// import { QInput } from "../../../../../../componentes/atomos/qinput.tsx";
// import { Usuario } from "../../../../../comun/componentes/usuario.tsx";
// import { ContextoError } from "../../../../../comun/contexto.ts";
// import { HookModelo, useModelo } from "../../../../../comun/useModelo.ts";
// import { getAccion, postAccion } from "../../../../accion/infraestructura.ts";
// import { Incidencia } from "../../../diseño.ts";
// import { metaNuevaAccion, nuevaAccionVacia } from "../../../dominio.ts";
// import "./AltaAcciones.css";

// export const AltaAcciones = ({
//   emitir = () => {},
//   incidencia,
// }: {
//   emitir?: (evento: string, payload?: unknown) => void;
//   incidencia: HookModelo<Incidencia>;
// }) => {
//   const nuevaAccion = useModelo(metaNuevaAccion, nuevaAccionVacia);
//   const { intentar } = useContext(ContextoError);

//   const guardar = async () => {
//     const modelo = {
//       ...nuevaAccion.modelo,
//       incidencia_id: incidencia.modelo.id,
//     };
//     const id = await intentar(() => postAccion(modelo));
//     const accionCreada = await getAccion(id);
//     emitir("ACCION_CREADA", accionCreada);
//   };

//   return (
//     <div className="AltaAcciones">
//       <h2>Nueva Acción</h2>
//       <quimera-formulario>
//         <QInput label="Descripción" {...nuevaAccion.uiProps("descripcion")} />
//         <QInput label="Fecha" {...nuevaAccion.uiProps("fecha")} />
//         <Usuario {...nuevaAccion.uiProps("usuario_id")} label='Responsable'/>
//       </quimera-formulario>
//       <div className="botones">
//         <QBoton onClick={guardar} deshabilitado={!nuevaAccion.valido}>
//           Guardar
//         </QBoton>
//         <QBoton onClick={() => emitir("ALTA_CANCELADA")} variante="texto">
//           Cancelar
//         </QBoton>
//       </div>
//     </div>
//   );
// };
