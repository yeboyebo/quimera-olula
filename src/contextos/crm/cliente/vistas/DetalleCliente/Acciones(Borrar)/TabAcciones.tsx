import { useCallback, useContext, useEffect, useState } from "react";
import {
  MetaTabla,
  QTabla,
} from "../../../../../../componentes/atomos/qtabla.tsx";
import { ContextoError } from "../../../../../comun/contexto.ts";
import { useLista } from "../../../../../comun/useLista.ts";
import { Maquina, useMaquina } from "../../../../../comun/useMaquina.ts";
import { HookModelo } from "../../../../../comun/useModelo.ts";
import { Accion } from "../../../../accion/diseño.ts";
import { deleteAccion } from "../../../../accion/infraestructura.ts";
import { getAccionesCliente } from "../../..//infraestructura.ts";
import { Cliente } from "../../../diseño.ts";
import { TabAccionesAcciones } from "./TabAccionesAcciones.tsx";
// import { TabAccionesAcciones } from "./TabAccionesAcciones.tsx";

type Estado = "lista" | "alta" | "borrar";

export const TabAcciones = ({ cliente }: { cliente: HookModelo<Cliente> }) => {
  const acciones = useLista<Accion>([]);
  const [cargando, setCargando] = useState(true);
  const [estado, setEstado] = useState<Estado>("lista");
  const clienteId = cliente.modelo.id;
  const { intentar } = useContext(ContextoError);

  const setListaAcciones = acciones.setLista;

  const cargarAcciones = useCallback(async () => {
    setCargando(true);
    const nuevasAcciones = await getAccionesCliente(clienteId);
    setListaAcciones(nuevasAcciones);
    setCargando(false);
  }, [clienteId, setListaAcciones]);

  useEffect(() => {
    if (clienteId) cargarAcciones();
  }, [clienteId, cargarAcciones]);

  const maquina: Maquina<Estado> = {
    lista: {
      ALTA_SOLICITADA: "alta",
      BORRADO_SOLICITADO: "borrar",
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
          const accionId = acciones.seleccionada.id;
          if (accionId) {
            await intentar(() => deleteAccion(accionId));
            acciones.eliminar(acciones.seleccionada);
          }
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
        cliente={cliente}
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
