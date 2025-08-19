import { useCallback, useEffect, useState } from "react";
import { QBoton } from "../../../../../../componentes/atomos/qboton.tsx";
import {
  MetaTabla,
  QTabla,
} from "../../../../../../componentes/atomos/qtabla.tsx";
import { useLista } from "../../../../../comun/useLista.ts";
import { Maquina, useMaquina } from "../../../../../comun/useMaquina.ts";
import { HookModelo } from "../../../../../comun/useModelo.ts";
import { Accion } from "../../../../accion/diseño.ts";
import { AltaAccion } from "../../../../accion/vistas/AltaAccion.tsx";
import { BajaAccion } from "../../../../accion/vistas/BajaAccion.tsx";
import { Incidencia } from "../../../diseño.ts";
import { getAccionesIncidencia } from "../../../infraestructura.ts";

type Estado = "Inactivo" | "Creando" | "Borrando";

export const TabAcciones = ({ incidencia }: { incidencia: HookModelo<Incidencia> }) => {
  const acciones = useLista<Accion>([]);
  const [cargando, setCargando] = useState(true);
  const [estado, setEstado] = useState<Estado>("Inactivo");
  const incidenciaId = incidencia.modelo.id;

  const setListaAcciones = acciones.setLista;

  const cargarAcciones = useCallback(async () => {
    setCargando(true);
    const nuevasAcciones = await getAccionesIncidencia(incidenciaId);
    setListaAcciones(nuevasAcciones);
    setCargando(false);
  }, [incidenciaId, setListaAcciones]);

  useEffect(() => {
    if (incidenciaId) cargarAcciones();
  }, [incidenciaId, cargarAcciones]);

  const maquina: Maquina<Estado> = {
    Inactivo: {
      crear: "Creando",
      borrar: "Borrando",
      accion_seleccionada: (payload: unknown) => {
        const accion = payload as Accion;
        acciones.seleccionar(accion);
      },
    },
    Creando: {
      accion_creada: async (payload: unknown) => {
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

  const emitir = useMaquina(maquina, estado, setEstado);

  const metaTablaAccion: MetaTabla<Accion> = [
    { id: "id", cabecera: "Código" },
    { id: "descripcion", cabecera: "Descripción" },
    { id: "tipo", cabecera: "Tipo" },
    { id: "estado", cabecera: "Estado" },
    { id: "fecha", cabecera: "Fecha" },
  ];

  return (
    <div className="TabAcciones">
      {/* <TabAccionesAcciones
        seleccionada={acciones.seleccionada}
        emitir={emitir}
        estado={estado}
        incidencia={incidencia}
      /> */}
      <div className="TabAccionesAcciones maestro-botones">
        <QBoton onClick={() => emitir("crear")}>
          Nueva
        </QBoton>
        
        <QBoton
          onClick={() => emitir("borrar")}
          deshabilitado={!acciones.seleccionada}
        >
          Borrar
        </QBoton>
  
        <AltaAccion emitir={emitir} idIncidencia={incidencia.modelo.id} key={incidencia.modelo.id} activo={estado === "Creando"}/>
  
        <BajaAccion 
          emitir={emitir}
          activo={estado === "Borrando"}
          idAccion={acciones.seleccionada?.id}
        />
      </div>
      <QTabla
        metaTabla={metaTablaAccion}
        datos={acciones.lista}
        cargando={cargando}
        seleccionadaId={acciones.seleccionada?.id}
        onSeleccion={(accion) => emitir("accion_seleccionada", accion)}
        orden={["id", "ASC"]}
        onOrdenar={() => null}
      />
    </div>
  );
};
