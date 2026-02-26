import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { Detalle } from "@olula/componentes/detalle/Detalle.tsx";
import { Tab, Tabs } from "@olula/componentes/detalle/tabs/Tabs.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.js";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useModelo } from "@olula/lib/useModelo.js";
import { useCallback, useEffect, useRef } from "react";
import { useParams } from "react-router";
import { BorrarCliente } from "../borrar/BorrarCliente.tsx";
import { Cliente } from "../diseño.ts";
import { TabCrmContactos } from "./CRMContactos/TabCrmContactos.tsx";
import { TabCuentasBanco } from "./CuentasBanco/TabCuentasBanco.tsx";
import "./DetalleCliente.css";
import { TabDirecciones } from "./Direcciones/TabDirecciones.tsx";
import { clienteVacio, metaCliente } from "./dominio.ts";
import { getMaquina } from "./maquina.ts";
import { TabComercial } from "./TabComercial.tsx";
import { TabGeneral } from "./TabGeneral.tsx";

export const DetalleCliente = ({
  clienteInicial = null,
  publicar = async () => {},
}: {
  clienteInicial?: Cliente | null;
  publicar?: EmitirEvento;
}) => {
  const params = useParams();
  const clienteId = clienteInicial?.id ?? params.id;
  const clienteIdCargadoRef = useRef<string | null>(null);

  const { ctx, emitir } = useMaquina(
    getMaquina,
    {
      estado: "INICIAL",
      cliente: clienteInicial || clienteVacio(),
      clienteInicial: clienteInicial || clienteVacio(),
    },
    publicar
  );

  const cliente = useModelo(metaCliente, ctx.cliente);

  const clienteIdActual = clienteId ?? ctx.cliente.id;

  useEffect(() => {
    if (clienteId && clienteId !== clienteIdCargadoRef.current) {
      clienteIdCargadoRef.current = clienteId;
      emitir("cliente_id_cambiado", clienteId, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clienteId]);

  const { estado } = ctx;
  const { modificado, valido } = cliente;

  const titulo = (cliente: Cliente) => cliente.nombre as string;

  const handleGuardar = useCallback(() => {
    emitir("edicion_de_cliente_lista", cliente.modelo);
  }, [emitir, cliente]);

  const handleCancelar = useCallback(() => {
    emitir("edicion_de_cliente_cancelada");
  }, [emitir]);

  if (!clienteInicial) return null;

  return (
    <div className="DetalleCliente">
      <Detalle
        id={clienteIdActual}
        obtenerTitulo={titulo}
        setEntidad={() => {}}
        entidad={ctx.cliente}
        cerrarDetalle={() => emitir("cliente_deseleccionado", null)}
      >
        {!!clienteIdActual && (
          <div className="DetalleCliente">
            <div className="maestro-botones">
              <QBoton onClick={() => emitir("borrado_solicitado")}>
                Borrar
              </QBoton>
            </div>
            <Tabs
              children={[
                <Tab
                  key="tab-1"
                  label="General"
                  children={
                    <TabGeneral
                      form={cliente}
                      cliente={ctx.cliente}
                      emitirCliente={emitir}
                      recargarCliente={() =>
                        emitir("cliente_id_cambiado", clienteIdActual)
                      }
                      estado={estado}
                    />
                  }
                />,
                <Tab
                  key="tab-2"
                  label="Comercial"
                  children={
                    <TabComercial
                      form={cliente}
                      cliente={ctx.cliente}
                      emitirCliente={emitir}
                    />
                  }
                />,
                <Tab
                  key="tab-3"
                  label="Direcciones"
                  children={<TabDirecciones clienteId={clienteIdActual} />}
                />,
                <Tab
                  key="tab-4"
                  label="Cuentas Bancarias"
                  children={
                    <TabCuentasBanco cliente={ctx.cliente} publicar={emitir} />
                  }
                />,
                <Tab
                  key="tab-5"
                  label="Agenda"
                  children={
                    <div className="detalle-cliente-tab-contenido">
                      <TabCrmContactos clienteId={clienteIdActual} />
                    </div>
                  }
                />,
              ]}
            />
            {modificado && (
              <div className="maestro-botones">
                <QBoton onClick={handleGuardar} deshabilitado={!valido}>
                  Guardar
                </QBoton>
                <QBoton
                  tipo="reset"
                  variante="texto"
                  onClick={handleCancelar}
                  deshabilitado={!modificado}
                >
                  Cancelar
                </QBoton>
              </div>
            )}

            {estado === "BORRANDO_CLIENTE" && (
              <BorrarCliente
                clienteId={ctx.cliente.id}
                clienteNombre={ctx.cliente.nombre as string}
                publicar={emitir}
                onCancelar={() => emitir("borrado_cancelado")}
              />
            )}
          </div>
        )}
      </Detalle>
    </div>
  );
};
