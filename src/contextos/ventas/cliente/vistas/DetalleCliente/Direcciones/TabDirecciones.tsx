import { useCallback, useContext, useEffect, useState } from "react";
import { QModal } from "../../../../../../componentes/moleculas/qmodal.tsx";
import { QModalConfirmacion } from "../../../../../../componentes/moleculas/qmodalconfirmacion.tsx";
import { ContextoError } from "../../../../../comun/contexto.ts";
import { useLista } from "../../../../../comun/useLista.ts";
import { Maquina, useMaquina } from "../../../../../comun/useMaquina.ts";
import { DirCliente } from "../../../diseño.ts";
import {
  deleteDireccion,
  getDirecciones,
  setDirFacturacion,
} from "../../../infraestructura.ts";
import { AltaDireccion } from "./CrearDireccion.tsx";
import { EdicionDireccion } from "./EdicionDireccion.tsx";
import { TabDireccionesLista } from "./TabDireccionesLista.tsx";

type Estado = "lista" | "alta" | "edicion" | "confirmar_borrado";

export const TabDirecciones = ({ clienteId }: { clienteId: string }) => {
  const direcciones = useLista<DirCliente>([]);
  const [cargando, setCargando] = useState(true);
  const [estado, setEstado] = useState<Estado>("lista");

  const setListaDirecciones = direcciones.setLista;
  const { intentar } = useContext(ContextoError);

  const cargarDirecciones = useCallback(async () => {
    setCargando(true);
    const nuevasDirecciones = await getDirecciones(clienteId);
    setListaDirecciones(nuevasDirecciones);
    setCargando(false);
  }, [clienteId, setListaDirecciones]);

  useEffect(() => {
    if (clienteId) cargarDirecciones();
  }, [clienteId, cargarDirecciones]);

  const maquina: Maquina<Estado> = {
    lista: {
      alta_solicitada: "alta",
      edicion_solicitada: "edicion",
      direccion_seleccionada: (payload: unknown) => {
        const direccion = payload as DirCliente;
        direcciones.seleccionar(direccion);
      },
      borrado_solicitado: "confirmar_borrado",
      facturacion_solicitada: async () => {
        if (!direcciones.seleccionada) return;
        const idDireccion = direcciones.seleccionada.id;
        if (!idDireccion) return;
        await intentar(() => setDirFacturacion(clienteId, idDireccion));
        cargarDirecciones();
      },
    },
    alta: {
      direccion_creada: async (payload: unknown) => {
        const nuevaDireccion = payload as DirCliente;
        direcciones.añadir(nuevaDireccion);
        return "lista" as Estado;
      },
      alta_cancelada: "lista",
    },
    edicion: {
      direccion_actualizada: async (payload: unknown) => {
        const direccionActualizada = payload as DirCliente;
        direcciones.modificar(direccionActualizada);
        return "lista" as Estado;
      },
      edicion_cancelada: "lista",
    },
    confirmar_borrado: {},
  };

  const confirmarBorrado = async () => {
    if (!direcciones.seleccionada) {
      setEstado("lista");
      return;
    }
    const idDireccion = direcciones.seleccionada.id;
    if (!idDireccion) {
      setEstado("lista");
      return;
    }
    await intentar(() => deleteDireccion(clienteId, idDireccion));
    direcciones.eliminar(direcciones.seleccionada);
    setEstado("lista");
  };

  const emitir = useMaquina(maquina, estado, setEstado);

  return (
    <div className="TabDirecciones">
      <TabDireccionesLista
        clienteId={clienteId}
        direcciones={direcciones.lista}
        seleccionada={direcciones.seleccionada}
        emitir={emitir}
        cargando={cargando}
      />
      <QModal
        nombre="edicionDireccion"
        abierto={estado === "edicion"}
        onCerrar={() => emitir("edicion_cancelada")}
      >
        {direcciones.seleccionada && (
          <EdicionDireccion
            clienteId={clienteId}
            direccion={direcciones.seleccionada}
            emitir={emitir}
          />
        )}
      </QModal>
      <QModal
        nombre="altaDireccion"
        abierto={estado === "alta"}
        onCerrar={() => emitir("alta_cancelada")}
      >
        <h2 className="titulo-modal">Nueva dirección</h2>
        <AltaDireccion clienteId={clienteId} emitir={emitir} />
      </QModal>
      <QModalConfirmacion
        nombre="confirmarBorrarDireccion"
        abierto={estado === "confirmar_borrado"}
        titulo="Confirmar borrado"
        mensaje="¿Está seguro de que desea borrar esta dirección?"
        onCerrar={() => setEstado("lista")}
        onAceptar={confirmarBorrado}
      />
    </div>
  );
};
