import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QuimeraAcciones } from "@olula/componentes/index.js";
import { QModal } from "@olula/componentes/moleculas/qmodal.tsx";
import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { AltaCuentaBanco } from "./CrearCuentaBanco.tsx";
import { EdicionCuentaBanco } from "./EdicionCuentaBanco.tsx";
import { TabCuentasBancoLista } from "./TabCuentasBancoLista";
import { useCuentasBanco } from "./useCuentasBanco.ts";

export const TabCuentasBanco = ({ clienteId }: { clienteId: string }) => {
  const { ctx, estado, emitir } = useCuentasBanco({ clienteId });

  const acciones = [
    {
      texto: "Editar",
      onClick: () => ctx.cuentaActiva && emitir("edicion_solicitada"),
      deshabilitado: !ctx.cuentaActiva,
    },
    {
      icono: "eliminar",
      texto: "Borrar",
      onClick: () => emitir("borrado_solicitado"),
      deshabilitado: !ctx.cuentaActiva,
    },
    {
      texto: "Cuenta de domiciliación",
      onClick: () => emitir("domiciliar_solicitada"),
      deshabilitado: !ctx.cuentaActiva,
    },
    {
      texto: "Desmarcar domiciliación",
      onClick: () => emitir("desmarcar_domiciliacion"),
    },
  ];

  return (
    <div className="CuentasBanco">
      <>
        <div className="detalle-cliente-tab-contenido maestro-botones">
          <QBoton onClick={() => emitir("alta_solicitada")}>Nueva</QBoton>
          <QuimeraAcciones acciones={acciones} vertical />
        </div>
        <TabCuentasBancoLista
          clienteId={clienteId}
          cuentas={ctx.cuentas}
          seleccionada={ctx.cuentaActiva}
          emitir={emitir}
          cargando={ctx.cargando}
        />
      </>
      <QModal
        nombre="altaCuentaBanco"
        abierto={estado === "alta"}
        onCerrar={() => emitir("alta_cancelada")}
      >
        <AltaCuentaBanco emitir={emitir} />
      </QModal>

      <QModal
        nombre="edicionCuentaBanco"
        abierto={estado === "edicion"}
        onCerrar={() => emitir("edicion_cancelada")}
      >
        {ctx.cuentaActiva && (
          <EdicionCuentaBanco
            clienteId={clienteId}
            cuenta={ctx.cuentaActiva}
            emitir={emitir}
          />
        )}
      </QModal>

      <QModalConfirmacion
        nombre="confirmarBorradoCuenta"
        abierto={estado === "confirmar_borrado"}
        titulo="Confirmar borrar"
        mensaje="¿Está seguro de que desea borrar esta cuenta bancaria?"
        onCerrar={() => emitir("borrado_cancelado")}
        onAceptar={() => emitir("borrado_confirmado")}
      />
    </div>
  );
};
