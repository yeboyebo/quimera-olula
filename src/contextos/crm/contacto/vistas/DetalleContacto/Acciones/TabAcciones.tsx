import { useCallback, useEffect, useState } from "react";
import {
  MetaTabla,
  QTabla,
} from "../../../../../../componentes/atomos/qtabla.tsx";
import { useLista } from "../../../../../comun/useLista.ts";
import { Maquina, useMaquina } from "../../../../../comun/useMaquina.ts";
import { HookModelo } from "../../../../../comun/useModelo.ts";
import { Accion } from "../../../../accion/diseño.ts";
import { getAccionesContacto } from "../../..//infraestructura.ts";
import { Contacto } from "../../../diseño.ts";
import { TabAccionesAcciones } from "./TabAccionesAcciones.tsx";

type Estado = "lista" | "alta" | "borrar";

export const TabAcciones = ({
  contacto,
}: {
  contacto: HookModelo<Contacto>;
}) => {
  const acciones = useLista<Accion>([]);
  const [cargando, setCargando] = useState(true);
  const [estado, setEstado] = useState<Estado>("lista");
  const contactoId = contacto.modelo.id;

  const setListaAcciones = acciones.setLista;

  const cargarAcciones = useCallback(async () => {
    setCargando(true);
    const nuevasAcciones = await getAccionesContacto(contactoId);
    setListaAcciones(nuevasAcciones);
    setCargando(false);
  }, [contactoId, setListaAcciones]);

  useEffect(() => {
    if (contactoId) cargarAcciones();
  }, [contactoId, cargarAcciones]);

  const maquina: Maquina<Estado> = {
    lista: {
      ALTA_SOLICITADA: "alta",
      BORRADO_SOLICITADO: "borrar",
      EDICION_SOLICITADA: () => {
        if (acciones.seleccionada) {
          console.log("Editar acción:", acciones.seleccionada.id);
        }
      },
      ACCION_SELECCIONADA: (payload: unknown) => {
        const accion = payload as Accion;
        acciones.seleccionar(accion);
      },
    },
    alta: {
      ACCION_CREADA: async (payload: unknown) => {
        const nuevaAccion = payload as Accion;
        acciones.añadir(nuevaAccion);
        return "lista" as Estado;
      },
      ALTA_CANCELADA: "lista",
    },
    borrar: {
      ACCION_BORRADA: async () => {
        if (acciones.seleccionada) {
          acciones.eliminar(acciones.seleccionada);
        }
        return "lista" as Estado;
      },
      BORRADO_CANCELADO: "lista",
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
      <TabAccionesAcciones
        seleccionada={acciones.seleccionada}
        emitir={emitir}
        estado={estado}
        contacto={contacto}
      />
      <QTabla
        metaTabla={metaTablaAccion}
        datos={acciones.lista}
        cargando={cargando}
        seleccionadaId={acciones.seleccionada?.id}
        onSeleccion={(accion) => emitir("ACCION_SELECCIONADA", accion)}
        orden={["id", "ASC"]}
        onOrdenar={() => null}
      />
    </div>
  );
};
