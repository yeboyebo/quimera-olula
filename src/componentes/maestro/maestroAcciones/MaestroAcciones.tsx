// import { useContext, useState } from "react";
// import { Contexto } from "../../../contextos/comun/contexto.ts";
// import { Acciones, Entidad } from "../../../contextos/comun/diseño.ts";
// import {
//   CampoFormularioGenerico,
//   FormularioGenerico,
// } from "../../detalle/FormularioGenerico.tsx";

// type MaestroProps<T extends Entidad> = {
//   acciones: Acciones<T>;
//   camposEntidad: CampoFormularioGenerico[];
// };

// export const MaestroAcciones = <T extends Entidad>({
//   acciones,
//   camposEntidad,
// }: MaestroProps<T>) => {
//   const { eliminarUno, crearUno, obtenerTodos } = acciones;
//   const context = useContext(Contexto);
//   if (!context) {
//     throw new Error("Contexto es nulo");
//   }
//   const { entidades, setEntidades, seleccionada, setSeleccionada } = context;
//   const [mostrarModal, setMostrarModal] = useState(false);
//   const [entidadNueva, setEntidadNueva] = useState({} as T);

//   const onEliminarSeleccionado = () => {
//     if (!seleccionada) {
//       return;
//     }

//     eliminarUno(seleccionada.id).then(() => {
//       setEntidades(
//         (entidades as T[]).filter(
//           (entidad: T) => entidad.id !== seleccionada.id
//         )
//       );
//       setSeleccionada(null);
//     });
//   };

//   const handleCrear = async (data: T) => {
//     if (!data.id) {
//       crearUno(data).then(() => {
//         obtenerTodos().then((lineasPresupuesto) => {
//           setEntidades(lineasPresupuesto);
//         });
//         setEntidadNueva({} as T);
//         cerrarModal();
//       });
//     }
//   };

//   const abrirModal = () => {
//     setMostrarModal(true);
//   };

//   const cerrarModal = () => {
//     setMostrarModal(false);
//   };

//   return (
//     <div className="MaestroAcciones">
//       <button onClick={abrirModal}>Crear</button>
//       {mostrarModal && (
//         <div className="modal">
//           <div className="modal-content">
//             <span className="close" onClick={cerrarModal}>
//               &times;
//             </span>
//             <FormularioGenerico
//               campos={camposEntidad}
//               entidad={entidadNueva}
//               setEntidad={setEntidadNueva}
//               onSubmit={handleCrear}
//             />
//           </div>
//         </div>
//       )}
//       <button onClick={onEliminarSeleccionado}>Borrar</button>
//     </div>
//   );
// };
