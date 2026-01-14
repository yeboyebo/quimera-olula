import { QModal } from "@olula/componentes/moleculas/qmodal.tsx";
import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { AltaDireccion } from "./CrearDireccion.tsx";
import { EdicionDireccion } from "./EdicionDireccion.tsx";
import { TabDireccionesLista } from "./TabDireccionesLista.tsx";
import { useDirecciones } from "./useDirecciones.ts";

export const TabDirecciones = ({ clienteId }: { clienteId: string }) => {
  const { ctx, estado, emitir } = useDirecciones({ clienteId });

  return (
    <div className="TabDirecciones">
      <TabDireccionesLista
        clienteId={clienteId}
        direcciones={ctx.direcciones}
        seleccionada={ctx.direccionActiva}
        emitir={emitir}
        cargando={ctx.cargando}
      />

      <QModal
        nombre="crearDireccion"
        abierto={estado === "alta"}
        onCerrar={() => emitir("alta_cancelada")}
      >
        <AltaDireccion clienteId={clienteId} emitir={emitir} />
      </QModal>

      <QModal
        nombre="editarDireccion"
        abierto={estado === "edicion"}
        onCerrar={() => emitir("edicion_cancelada")}
      >
        {ctx.direccionActiva && (
          <EdicionDireccion
            clienteId={clienteId}
            direccion={ctx.direccionActiva}
            emitir={emitir}
          />
        )}
      </QModal>

      <QModalConfirmacion
        nombre="confirmarBorradoDireccion"
        abierto={estado === "confirmar_borrado"}
        titulo="Confirmar borrar"
        mensaje="¿Está seguro de que desea borrar esta dirección?"
        onCerrar={() => emitir("borrado_cancelado")}
        onAceptar={() => emitir("borrado_confirmado")}
      />
    </div>
  );
};
