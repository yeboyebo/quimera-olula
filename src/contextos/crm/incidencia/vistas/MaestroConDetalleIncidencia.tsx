import { useCallback } from "react";
import { QBoton } from "../../../../componentes/atomos/qboton.tsx";
import { MetaTabla } from "../../../../componentes/atomos/qtabla.tsx";
import { Listado } from "../../../../componentes/maestro/Listado.tsx";
import { MaestroDetalleResponsive } from "../../../../componentes/maestro/MaestroDetalleResponsive.tsx";
import { ListaSeleccionable } from "../../../comun/diseño.ts";
import { cambiarItemEnLista, cargarLista, getSeleccionada, incluirEnLista, listaSeleccionableVacia, quitarDeLista, seleccionarItemEnLista } from "../../../comun/entidad.ts";
import { ConfigMaquina3, Maquina3, useMaquina3 } from "../../../comun/useMaquina.ts";
import { Incidencia } from "../diseño.ts";
import { getIncidencias } from "../infraestructura.ts";
import { CrearIncidencia } from "./CrearIncidencia.tsx";
import { DetalleIncidencia } from "./DetalleIncidencia/DetalleIncidencia.tsx";

const metaTablaIncidencia: MetaTabla<Incidencia> = [
  { id: "id", cabecera: "Código" },
  { id: "descripcion", cabecera: "Descripcion" },
  { id: "nombre", cabecera: "Nombre" },
  { id: "estado", cabecera: "Estado" },
  { id: "prioridad", cabecera: "Prioridad" },
];

type Estado = "Inactivo" | "Creando";

type Contexto = {
  incidencias: ListaSeleccionable<Incidencia>;
}

const setIncidencias = (maquina: Maquina3<Estado, Contexto>, incidencias: ListaSeleccionable<Incidencia>) => {
  return {
    ...maquina,
    contexto: {
      ...maquina.contexto,
      incidencias: incidencias,
    },
  };
}

const configMaquina: ConfigMaquina3<Estado, Contexto> = {
  Inactivo: {
    crear: "Creando",
    incidencia_cambiada: ({ contexto, ...maquina}, payload) => {
      return {
        ...maquina,
        contexto: {
          ...contexto,
          incidencias: cambiarItemEnLista(contexto.incidencias, payload as Incidencia),
        },
      }
    },
    incidencia_seleccionada: (maquina, payload) => {
      return setIncidencias(maquina, seleccionarItemEnLista(maquina.contexto.incidencias, payload as Incidencia));
      // return {
      //   ...maquina,
      //   contexto: {
      //     ...contexto,
      //     incidencias: seleccionarItemEnLista(contexto.incidencias, payload as Incidencia),
      //   },
      // }
    },
    incidencia_borrada: ({ contexto, ...maquina}) => {
      if (!contexto.incidencias.idActivo) {
        return { contexto, ...maquina}
      }
      return {
        estado: "Inactivo",
        contexto: {
          ...contexto,
          incidencias: quitarDeLista(contexto.incidencias, contexto.incidencias.idActivo),
        },
      }
    },
    // incidencias_cargadas: (maquina, payload) => {
    //   return maquina.accion.cargarIncidencias(payload as Incidencia[])
    // },
    incidencias_cargadas: ({ contexto, ...maquina}, payload) => {
      return {
        ...maquina,
        estado: "Inactivo",
        contexto: {
          ...contexto,
          incidencias: cargarLista(payload as Incidencia[]),
        },
      }
    },
  },
  Creando: {
    incidencia_creada: ({ contexto, ...maquina}, payload: unknown) => {
      return {
        estado: "Inactivo",
        contexto: {
          ...maquina,
          incidencias: incluirEnLista(contexto.incidencias, payload as Incidencia, {}),
        },
      }
    },
    creacion_cancelada: "Inactivo",
  },
    // cargar: 'Cargando',
};
  // ,
  // Creando: {
  //   incidencia_creada: ({ contexto, ...maquina}, payload: unknown) => {
  //     return {
  //       estado: "Inactivo",
  //       contexto: {
  //         ...maquina,
  //         incidencias: incluirEnLista(contexto.incidencias, payload as Incidencia, {}),
  //       },
  //     }
  //   },
  //   creacion_cancelada: "Inactivo",
  // },
  // Borrando: {
// };

export const MaestroConDetalleIncidencia = () => {

  // const incidencias = useLista<Incidencia>([]);

  // const maquina: Maquina<Estado> = {
  //   Creando: {
  //     incidencia_creada: (payload) => {
  //       incidencias.añadir(payload as Incidencia);
  //       return "Inactivo";
  //     },
  //     creacion_cancelada: "Inactivo",
  //   },
  //   Inactivo: {
  //     crear: "Creando",
  //     incidencia_cambiada: (payload) => {
  //       incidencias.modificar(payload as Incidencia);
  //     },
  //     incidencia_borrada: (payload) => {
  //       incidencias.eliminar(payload as Incidencia);
  //     },
  //     cancelar_seleccion: () => {
  //       incidencias.limpiarSeleccion();
  //     },
  //   },
  // };

  const [emitir, { estado, contexto}] = useMaquina3<Estado, Contexto>(
    configMaquina, 'Inactivo', {
      incidencias: listaSeleccionableVacia<Incidencia>(),
    }
  );
  const { incidencias } = contexto;

  const setEntidades = useCallback((payload: Incidencia[]) => emitir("incidencias_cargadas", payload), [emitir]);
  const setSeleccionada = useCallback((payload: Incidencia) => emitir("incidencia_seleccionada", payload), [emitir]);
  
  const seleccionada = getSeleccionada(incidencias);

  return (
    <div className="Incidencia">
      <MaestroDetalleResponsive<Incidencia>
        seleccionada={seleccionada}
        Maestro={
          <>
            <h2>Incidencias</h2>
            <div className="maestro-botones">
              <QBoton onClick={() => emitir("crear")}>Nueva</QBoton>
            </div>
            <Listado
              metaTabla={metaTablaIncidencia}
              entidades={incidencias.lista}
              setEntidades={setEntidades}
              seleccionada={seleccionada}
              setSeleccionada={setSeleccionada}
              cargar={getIncidencias}
            />
          </>
        }
        Detalle={
          <DetalleIncidencia 
            key={seleccionada?.id}
            incidenciaInicial={seleccionada} publicar={emitir} />
        }
      />
      <CrearIncidencia publicar={emitir} activo={estado === 'Creando'}/>
    </div>
  );

  // const incidencias = useLista<Incidencia>([]);

  // const maquina: Maquina<Estado> = {
  //   Creando: {
  //     incidencia_creada: (payload) => {
  //       incidencias.añadir(payload as Incidencia);
  //       return "Inactivo";
  //     },
  //     creacion_cancelada: "Inactivo",
  //   },
  //   Inactivo: {
  //     crear: "Creando",
  //     incidencia_cambiada: (payload) => {
  //       incidencias.modificar(payload as Incidencia);
  //     },
  //     incidencia_borrada: (payload) => {
  //       incidencias.eliminar(payload as Incidencia);
  //     },
  //     cancelar_seleccion: () => {
  //       incidencias.limpiarSeleccion();
  //     },
  //   },
  // };

  // const [emitir, estado] = useMaquina2(maquina, "Inactivo");

  // return (
  //   <div className="Incidencia">
  //     <MaestroDetalleResponsive<Incidencia>
  //       seleccionada={incidencias.seleccionada}
  //       Maestro={
  //         <>
  //           <h2>Incidencias</h2>
  //           <div className="maestro-botones">
  //             <QBoton onClick={() => emitir("crear")}>Nueva</QBoton>
  //           </div>
  //           <Listado
  //             metaTabla={metaTablaIncidencia}
  //             entidades={incidencias.lista}
  //             setEntidades={incidencias.setLista}
  //             seleccionada={incidencias.seleccionada}
  //             setSeleccionada={incidencias.seleccionar}
  //             cargar={getIncidencias}
  //           />
  //         </>
  //       }
  //       Detalle={
  //         <DetalleIncidencia 
  //           key={incidencias.seleccionada?.id}
  //           incidenciaInicial={incidencias.seleccionada} publicar={emitir} />
  //       }
  //     />
  //     <CrearIncidencia publicar={emitir} activo={estado === 'Creando'}/>
  //   </div>
  // );
};
