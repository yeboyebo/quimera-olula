import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.js";
import { QuimeraAcciones } from "@olula/componentes/index.js";
import { QModal } from "@olula/componentes/moleculas/qmodal.tsx";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { listaEntidadesInicial } from "@olula/lib/ListaEntidades.js";
import { useEffect } from "react";
import { Cliente, CuentaBanco } from "../../diseño.ts";
import { BorrarCuentaBanco } from "./BorrarCuentaBanco.tsx";
import { CrearCuentaBanco } from "./CrearCuentaBanco.tsx";
import { EdicionCuentaBanco } from "./EdicionCuentaBanco.tsx";
import { getMaquina } from "./maquina.ts";
import { TabCuentasBancoLista } from "./TabCuentasBancoLista.tsx";

export const TabCuentasBanco = ({
  cliente,
  publicar,
}: {
  cliente: Cliente;
  publicar: EmitirEvento;
}) => {
  const clienteId = cliente.id;

  const { ctx, emitir } = useMaquina(
    getMaquina,
    {
      estado: "lista",
      cuentas: listaEntidadesInicial<CuentaBanco>(),
      cargando: true,
      clienteId,
    },
    publicar
  );

  useEffect(() => {
    if (clienteId) emitir("cargar_cuentas", clienteId, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clienteId]);

  const estado = ctx.estado;

  const acciones = [
    {
      texto: "Editar",
      onClick: () => ctx.cuentas.activo && emitir("edicion_solicitada"),
      deshabilitado: !ctx.cuentas.activo,
    },
    {
      icono: "eliminar",
      texto: "Borrar",
      onClick: () => emitir("borrado_solicitado"),
      deshabilitado: !ctx.cuentas.activo,
    },
    {
      texto: "Cuenta de domiciliación",
      onClick: () => emitir("domiciliar_solicitada"),
      deshabilitado: !ctx.cuentas.activo,
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
          cuentas={ctx.cuentas.lista}
          seleccionada={ctx.cuentas.activo}
          emitir={emitir}
          cargando={ctx.cargando}
          cuentaDomiciliadaId={cliente.cuenta_domiciliada ?? ""}
        />
      </>
      <QModal
        nombre="altaCuentaBanco"
        abierto={estado === "alta"}
        onCerrar={() => emitir("alta_cancelada")}
      >
        <CrearCuentaBanco clienteId={clienteId} emitir={emitir} />
      </QModal>

      <QModal
        nombre="edicionCuentaBanco"
        abierto={estado === "edicion"}
        onCerrar={() => emitir("edicion_cancelada")}
      >
        {ctx.cuentas.activo && (
          <EdicionCuentaBanco
            clienteId={clienteId}
            cuenta={ctx.cuentas.activo}
            emitir={emitir}
          />
        )}
      </QModal>

      {ctx.cuentas.activo && (
        <BorrarCuentaBanco
          clienteId={clienteId}
          cuenta={ctx.cuentas.activo}
          abierto={estado === "confirmar_borrado"}
          emitir={emitir}
        />
      )}
    </div>
  );
};
