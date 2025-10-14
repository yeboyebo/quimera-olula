// import { useEffect, useState } from "react";
// import {
//   Acciones,
//   Criteria,
//   Entidad,
//   Filtro,
//   Orden,
// } from "@olula/lib/diseño.ts";
// import { CampoFormularioGenerico } from "../detalle/FormularioGenerico.tsx";
// import { expandirEntidad, formatearClave } from "../detalle/helpers.tsx";
// import { SinDatos } from "../SinDatos/SinDatos.tsx";
// import { Tabla } from "../wrappers/tabla.tsx";
// import { MaestroAcciones } from "./maestroAcciones/MaestroAcciones.tsx";
// import { filtrarEntidad } from "./maestroFiltros/filtro.ts";
// import { MaestroFiltros } from "./maestroFiltros/MaestroFiltros.tsx";

// const datosCargando = () =>
//   new Array(10).fill(null).map((_, i) => ({
//     id: i.toString(),
//     ...Object.fromEntries(new Array(10).fill(null).map((_, j) => [j, "U00A0"])),
//   }));

// const obtenerCampos = (entidad: Entidad | null): string[] => {
//   if (!entidad) return [];

//   return expandirEntidad(entidad).map(([clave]) => clave);
// };

// /* eslint-disable  @typescript-eslint/no-explicit-any */
// export type MaestroProps<T extends Entidad> = {
//   acciones: Acciones<T>;
//   Acciones?: any;
//   camposEntidad: CampoFormularioGenerico[];
//   criteria?: Criteria;
//   entidades: T[];
//   setEntidades: (entidades: T[]) => void;
//   seleccionada: T | null;
//   setSeleccionada: (seleccionada: T | null) => void;
// };

// export const Maestro = <T extends Entidad>({
//   acciones,
//   Acciones = null,
//   camposEntidad,
//   criteria = { filtro: {}, orden: { id: "DESC" } },
//   entidades,
//   setEntidades,
//   seleccionada,
//   setSeleccionada,
// }: MaestroProps<T>) => {
//   const { obtenerTodos } = acciones;
//   const [cargando, setCargando] = useState(true);
//   const [filtro, setFiltro] = useState<Filtro>(criteria.filtro);
//   const [orden, setOrden] = useState<Orden>(criteria.orden);

//   // const context = useContext(Contexto);
//   // if (!context) {
//   //   throw new Error("Contexto nulo");
//   // }
//   // const { entidades, setEntidades, seleccionada, setSeleccionada } = context;
//   // print("contextParam", contextParam);

//   // const { entidades, setEntidades, seleccionada, setSeleccionada } = contextParam;

//   useEffect(() => {
//     let hecho = false;
//     setCargando(true);

//     obtenerTodos(filtro, orden).then((entidades) => {
//       if (hecho) return;

//       setEntidades(entidades as T[]);
//       setCargando(false);
//     });

//     return () => {
//       hecho = true;
//     };
//   }, [filtro, orden, obtenerTodos, setEntidades]);

//   const entidadesFiltradas = entidades.filter((entidad) =>
//     filtrarEntidad(entidad, filtro)
//   );

//   const cabeceras = entidadesFiltradas.length
//     ? (Object.fromEntries(
//         expandirEntidad(entidadesFiltradas[0]).map(([clave]) => [
//           formatearClave(clave),
//           clave,
//         ])
//       ) as Record<string, string>)
//     : {};

//   const renderEntidades = () => {
//     if (!entidadesFiltradas.length && !cargando) return <SinDatos />;

//     const datos = entidadesFiltradas.length
//       ? entidadesFiltradas
//       : datosCargando();

//     return (
//       <Tabla
//         cabeceras={cabeceras}
//         datos={datos}
//         cargando={cargando}
//         seleccionadaId={seleccionada?.id}
//         onSeleccion={setSeleccionada}
//         orden={orden}
//         onOrdenar={(clave) =>
//           setOrden({ [clave]: orden[clave] === "ASC" ? "DESC" : "ASC" })
//         }
//       />
//     );
//   };

//   return (
//     <div className="Maestro">
//       {Acciones ? (
//         <Acciones acciones={acciones} camposEntidad={camposEntidad} />
//       ) : (
//         <MaestroAcciones acciones={acciones} camposEntidad={camposEntidad} />
//       )}
//       <MaestroFiltros
//         campos={obtenerCampos(entidades[0])}
//         filtro={filtro}
//         cambiarFiltro={(clave, valor) =>
//           setFiltro({ ...filtro, [clave]: { LIKE: valor } })
//         }
//         borrarFiltro={(clave) => {
//           const { [clave]: _, ...resto } = filtro;
//           setFiltro(resto);
//         }}
//         resetearFiltro={() => setFiltro(criteria.filtro)}
//       />
//       {renderEntidades()}
//     </div>
//   );
// };
