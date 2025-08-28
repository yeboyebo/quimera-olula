import { useContext, useEffect } from "react";
import { QBoton } from "../../../../../componentes/atomos/qboton.tsx";
import { MetaTabla, QTabla } from "../../../../../componentes/atomos/qtabla.tsx";
import { ContextoError } from "../../../../comun/contexto.ts";
import { ListaSeleccionable } from "../../../../comun/diseño.ts";
import { cargarLista, incluirEnLista, listaSeleccionableVacia, quitarDeLista, seleccionarItemEnLista } from "../../../../comun/entidad.ts";
import { pipe } from "../../../../comun/funcional.ts";
import { ConfigMaquina4, Maquina3, useMaquina4 } from "../../../../comun/useMaquina.ts";
import { HookModelo } from "../../../../comun/useModelo.ts";
import { Accion } from "../../../accion/diseño.ts";
import { AltaAccion } from "../../../accion/vistas/AltaAccion.tsx";
import { BajaAccion } from "../../../accion/vistas/BajaAccion.tsx";
import { Incidencia } from "../../diseño.ts";
import { getAccionesIncidencia } from "../../infraestructura.ts";

type Estado = "Inactivo" | "Creando" | "Borrando" | "Cargando";

type Contexto = {
  acciones: ListaSeleccionable<Accion>;
}

const setAcciones = (aplicable: (acciones: ListaSeleccionable<Accion>) => ListaSeleccionable<Accion>) => 
  (maquina: Maquina3<Estado, Contexto>) => {
  return {
    ...maquina,
    contexto: {
      ...maquina.contexto,
      acciones: aplicable(maquina.contexto.acciones),
    },
  };
}


const configMaquina: ConfigMaquina4<Estado, Contexto> = {
  inicial: {
    estado: "Inactivo",
    contexto: {
      acciones: listaSeleccionableVacia<Accion>(),
    },
  },
  estados: {
    Cargando: {
      acciones_cargadas: ({maquina, payload, setEstado}) => pipe(
        maquina, 
        setEstado("Inactivo"),
        setAcciones(cargarLista(payload as Accion[]))
      ),
    },
    Inactivo: {
      crear: "Creando",
      borrar: "Borrando", 
      accion_seleccionada: ({maquina, payload}) => pipe(
        maquina,
        setAcciones(seleccionarItemEnLista(payload as Accion))
      ),
      cargar: 'Cargando',
    },
    Creando: {
      accion_creada: ({maquina, payload, setEstado}) => pipe(
        maquina,
        setEstado('Inactivo'),
        setAcciones(incluirEnLista(payload as Accion, {}))
      ),
      creacion_cancelada: "Inactivo",
    },
    Borrando: {
      accion_borrada: ({maquina, setEstado}) => {
        const idActivo = maquina.contexto.acciones.idActivo
        if (!idActivo) {
          return maquina
        }
        return pipe(maquina,
          setEstado('Inactivo'),
          setAcciones(quitarDeLista(idActivo))
        )
      },
      borrado_cancelado: "Inactivo",
    },
  }
};

export const TabAcciones = ({ incidencia }: { incidencia: HookModelo<Incidencia> }) => {

  const { intentar } = useContext(ContextoError);

  const idIncidencia = incidencia.modelo.id;
  
  const [emitir, { estado, contexto}] = useMaquina4<Estado, Contexto>(
    {config: configMaquina}
  );
  const { acciones } = contexto;

  useEffect(() => {

    const cargarAcciones = async () => {
      const nuevasAcciones = await intentar(
        () => getAccionesIncidencia(idIncidencia)
      );
      emitir("acciones_cargadas", nuevasAcciones);
    };

    emitir("cargar");
    cargarAcciones()
  }, [idIncidencia, emitir, intentar]);


  const metaTablaAccion: MetaTabla<Accion> = [
    { id: "id", cabecera: "Código" },
    { id: "descripcion", cabecera: "Descripción" },
    { id: "tipo", cabecera: "Tipo" },
    { id: "estado", cabecera: "Estado" },
    { id: "fecha", cabecera: "Fecha" },
  ];

  return (
    <div className="TabAcciones">
      <div className="TabAccionesAcciones maestro-botones">
        <QBoton onClick={() => emitir("crear")}
        >Nueva</QBoton>
        
        <QBoton
          onClick={() => emitir("borrar")}
          deshabilitado={!acciones.idActivo}
        >Borrar</QBoton>
      </div>
      
      <AltaAccion
        emitir={emitir}
        activo={estado === "Creando"}
        key={incidencia.modelo.id}
        idIncidencia={incidencia.modelo.id}
      />

      <BajaAccion 
        emitir={emitir}
        activo={estado === "Borrando"}
        idAccion={acciones.idActivo || undefined}
      />

      <QTabla
        metaTabla={metaTablaAccion}
        datos={acciones.lista}
        cargando={estado === 'Cargando'}
        seleccionadaId={acciones.idActivo || undefined}
        onSeleccion={(accion) => emitir("accion_seleccionada", accion)}
        orden={["id", "ASC"]}
        onOrdenar={() => null}
      />
    </div>
  );
};
