import { useCallback } from "react";
import { QBoton } from "../../../../componentes/atomos/qboton.tsx";
import { MetaTabla } from "../../../../componentes/atomos/qtabla.tsx";
import { Listado } from "../../../../componentes/maestro/Listado.tsx";
import { MaestroDetalleResponsive } from "../../../../componentes/maestro/MaestroDetalleResponsive.tsx";
import { ListaSeleccionable } from "../../../comun/diseño.ts";
import { cambiarItemEnLista, cargarLista, getSeleccionada, incluirEnLista, listaSeleccionableVacia, quitarDeLista, seleccionarItemEnLista } from "../../../comun/entidad.ts";
import { pipe } from "../../../comun/funcional.ts";
import { ConfigMaquina4, Maquina3, useMaquina4 } from "../../../comun/useMaquina.ts";
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



const setIncidencias = (aplicable: (incidencias: ListaSeleccionable<Incidencia>) =>
   ListaSeleccionable<Incidencia>) => (maquina: Maquina3<Estado, Contexto>) => {
  return {
    ...maquina,
    contexto: {
      ...maquina.contexto,
      incidencias: aplicable(maquina.contexto.incidencias),
    },
  };
}

const configMaquina: ConfigMaquina4<Estado, Contexto> = {
  inicial: {
    estado: "Inactivo",
    contexto: {
      incidencias: listaSeleccionableVacia<Incidencia>(),
    },
  },
  estados: {
    Inactivo: {
      crear: "Creando",
      incidencia_cambiada: ({maquina, payload}) => pipe(
        maquina,
        setIncidencias(cambiarItemEnLista(payload as Incidencia))
      ),
      incidencia_seleccionada: ({maquina, payload}) => pipe(
        maquina,
        setIncidencias(seleccionarItemEnLista(payload as Incidencia))
      ),
      incidencia_borrada: ({maquina}) => {
        const { incidencias } = maquina.contexto;
        if (!incidencias.idActivo) {
          return maquina
        }
        return pipe(maquina,
          setIncidencias(quitarDeLista(incidencias.idActivo))
        )
      },
      incidencias_cargadas: ({maquina, payload, setEstado}) => pipe(
        maquina,
        setEstado('Inactivo' as Estado),
        setIncidencias(cargarLista(payload as Incidencia[]))
      ),
    },
    Creando: {
      incidencia_creada: ({maquina, payload, setEstado}) => pipe(
        maquina,
        setEstado('Inactivo' as Estado), 
        setIncidencias(incluirEnLista(payload as Incidencia, {})) 
      ),
      creacion_cancelada: "Inactivo",
    },
  }
};
  

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

  const [emitir, { estado, contexto}] = useMaquina4<Estado, Contexto>(
    { config: configMaquina}
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
