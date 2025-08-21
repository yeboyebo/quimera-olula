import { useContext, useEffect } from "react";
import { QBoton } from "../../../../../componentes/atomos/qboton.tsx";
import { MetaTabla, QTabla } from "../../../../../componentes/atomos/qtabla.tsx";
import { ContextoError } from "../../../../comun/contexto.ts";
import { ListaSeleccionable } from "../../../../comun/diseño.ts";
import { cargarLista, incluirEnLista, listaSeleccionableVacia, quitarDeLista, seleccionarItemEnLista } from "../../../../comun/entidad.ts";
import { ConfigMaquina3, useMaquina3 } from "../../../../comun/useMaquina.ts";
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

const configMaquina: ConfigMaquina3<Estado, Contexto> = {
  Cargando: {
    acciones_cargadas: (maquina, payload) => {
      return {
        estado: "Inactivo" as Estado,
        contexto: {
          ...maquina.contexto,
          acciones: cargarLista(payload as Accion[]),
        },
      }
    },
  },
  Inactivo: {
    crear: "Creando",
    borrar: "Borrando", 
    accion_seleccionada: ({ contexto, ...maquina}, payload) => {
      return {
        ...maquina,
        contexto: {
          ...contexto,
          acciones: seleccionarItemEnLista(contexto.acciones, payload as Accion),
        },
      }
    },
    cargar: 'Cargando',
  },
  Creando: {
    accion_creada: ({ contexto, ...maquina}, payload: unknown) => {
      return {
        estado: "Inactivo",
        contexto: {
          ...maquina,
          acciones: incluirEnLista(contexto.acciones, payload as Accion, {}),
        },
      }
    },
    creacion_cancelada: "Inactivo",
  },
  Borrando: {
    accion_borrada: ({ contexto, ...maquina}) => {
      if (!contexto.acciones.idActivo) {
        return { contexto, ...maquina}
      }
      return {
        estado: "Inactivo",
        contexto: {
          ...contexto,
          acciones: quitarDeLista(contexto.acciones, contexto.acciones.idActivo),
        },
      }
    },
    borrado_cancelado: "Inactivo",
  },
};

export const TabAcciones = ({ incidencia }: { incidencia: HookModelo<Incidencia> }) => {

  const { intentar } = useContext(ContextoError);

  const idIncidencia = incidencia.modelo.id;
  
  const cargarAcciones = async () => {
    const nuevasAcciones = await intentar(
      () => getAccionesIncidencia(idIncidencia)
    );
    emitir("acciones_cargadas", nuevasAcciones);
  };

  const [emitir, { estado, contexto}] = useMaquina3<Estado, Contexto>(
    configMaquina, 'Inactivo', {
      acciones: listaSeleccionableVacia<Accion>(),
    }
  );
  const { acciones } = contexto;

  useEffect(() => {
    emitir("cargar");
    cargarAcciones()
  }, [idIncidencia, emitir]);


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
