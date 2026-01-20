import { QModal } from "@olula/componentes/moleculas/qmodal.tsx";
import { BorrarDireccion } from "../../borrar_direccion/BorrarDireccion.tsx";
import { CrearDireccion } from "../../crear_direccion/CrearDireccion.tsx";
import { EdicionDireccion } from "../../editar_direccion/EdicionDireccion.tsx";
import { TabDireccionesLista } from "./TabDireccionesLista.tsx";
import { useDirecciones } from "./useDirecciones.ts";

export const TabDirecciones = ({ clienteId }: { clienteId: string }) => {
  const { ctx, estado, emitir } = useDirecciones({
    clienteId,
  });

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
        <CrearDireccion clienteId={clienteId} publicar={emitir} />
      </QModal>

      <QModal
        nombre="editarDireccion"
        abierto={estado === "edicion"}
        onCerrar={() => emitir("edicion_cancelada")}
      >
        {ctx.direccionActiva && (
          <EdicionDireccion 
            direccion={ctx.direccionActiva} 
            clienteId={clienteId}
            publicar={emitir} 
          />
        )}
      </QModal>

      {estado === "confirmar_borrado" && ctx.direccionActiva && (
        <BorrarDireccion
          direccion={ctx.direccionActiva}
          clienteId={clienteId}
          publicar={emitir}
          onCancelar={() => emitir("borrado_cancelado")}
        />
      )}
    </div>
  );
};
