import { useContext, useEffect } from "react";
import { QBoton } from "../../../../../componentes/atomos/qboton.tsx";
import { MetaTabla, QTabla } from "../../../../../componentes/atomos/qtabla.tsx";
import { ContextoError } from "../../../../comun/contexto.ts";
import { useLista } from "../../../../comun/useLista.ts";
import { Maquina, useMaquina2 } from "../../../../comun/useMaquina.ts";
import { HookModelo } from "../../../../comun/useModelo.ts";
import { Accion } from "../../../accion/diseño.ts";
import { AltaAccion } from "../../../accion/vistas/AltaAccion.tsx";
import { BajaAccion } from "../../../accion/vistas/BajaAccion.tsx";
import { Incidencia } from "../../diseño.ts";
import { getAccionesIncidencia } from "../../infraestructura.ts";

type Estado = "Inactivo" | "Creando" | "Borrando" | "Cargando";

export const TabAcciones = ({ incidencia }: { incidencia: HookModelo<Incidencia> }) => {

  const acciones = useLista<Accion>([]);
  const { intentar } = useContext(ContextoError);

  const idIncidencia = incidencia.modelo.id;
  
  const cargarAcciones = async () => {
    const nuevasAcciones = await intentar(
      () => getAccionesIncidencia(idIncidencia)
    );
    emitir("acciones_cargadas", nuevasAcciones);
  };
  
  const maquina: Maquina<Estado> = {
    Cargando: {
      al_entrar: async () => {
        await cargarAcciones()
      },
      acciones_cargadas: (payload) => {
        acciones.setLista(payload as Accion[]);
        return "Inactivo" as Estado;
      }
    },
    Inactivo: {
      crear: "Creando",
      borrar: "Borrando", 
      accion_seleccionada: (payload) => {
        acciones.seleccionar(payload as Accion);
      },
      cargar: 'Cargando',
    },
    Creando: {
      accion_creada: async (payload) => {
        acciones.añadir(payload as Accion);
        return "Inactivo" as Estado;
      },
      creacion_cancelada: "Inactivo",
    },
    Borrando: {
      accion_borrada: async () => {
        if (acciones.seleccionada) {
          acciones.eliminar(acciones.seleccionada);
        }
        return "Inactivo" as Estado;
      },
      borrado_cancelado: "Inactivo",
    },
  };
  
  const [emitir, estado] = useMaquina2(maquina, 'Inactivo');

  useEffect(() => {
    emitir("cargar");
  }, [idIncidencia]);


  const metaTablaAccion: MetaTabla<Accion> = [
    { id: "id", cabecera: "Código" },
    { id: "descripcion", cabecera: "Descripción" },
    { id: "tipo", cabecera: "Tipo" },
    { id: "estado", cabecera: "Estado" },
    { id: "fecha", cabecera: "Fecha" },
  ];

  return (
    <div className="TabAcciones">
      {estado}
      <div className="TabAccionesAcciones maestro-botones">
        <QBoton onClick={() => emitir("crear")}
        >Nueva</QBoton>
        
        <QBoton
          onClick={() => emitir("borrar")}
          deshabilitado={!acciones.seleccionada}
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
        idAccion={acciones.seleccionada?.id}
      />

      <QTabla
        metaTabla={metaTablaAccion}
        datos={acciones.lista}
        cargando={estado === 'Cargando'}
        seleccionadaId={acciones.seleccionada?.id}
        onSeleccion={(accion) => emitir("accion_seleccionada", accion)}
        orden={["id", "ASC"]}
        onOrdenar={() => null}
      />
    </div>
  );
};
