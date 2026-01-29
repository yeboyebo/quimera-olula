import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { Detalle } from "@olula/componentes/detalle/Detalle.tsx";
import { Tab, Tabs } from "@olula/componentes/detalle/tabs/Tabs.tsx";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useCallback } from "react";
import { useParams } from "react-router";
import { BorrarCliente } from "../borrar/BorrarCliente.tsx";
import { Cliente } from "../diseño.ts";
import { TabCrmContactos } from "./CRMContactos/TabCrmContactos.tsx";
import { TabCuentasBanco } from "./CuentasBanco/TabCuentasBanco.tsx";
import "./DetalleCliente.css";
import { TabDirecciones } from "./Direcciones/TabDirecciones.tsx";
import { useCliente } from "./hooks/useCliente.ts";
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

  const cliente = useCliente({
    clienteId: clienteInicial?.id ?? params.id,
    clienteInicial,
    publicar,
  });

  const { modelo, modificado, valido, emitir, estado } = cliente;

  const titulo = (cliente: Cliente) => cliente.nombre as string;

  const handleGuardar = useCallback(() => {
    emitir("edicion_de_cliente_lista", modelo);
  }, [emitir, modelo]);

  const handleCancelar = useCallback(() => {
    emitir("edicion_de_cliente_cancelada");
  }, [emitir]);

  if (!clienteInicial) return null;

  return (
    <div className="DetalleCliente">
      <Detalle
        id={clienteInicial?.id ?? params.id}
        obtenerTitulo={titulo}
        setEntidad={() => {}}
        entidad={modelo}
        cerrarDetalle={() => emitir("cliente_deseleccionado", null)}
      >
        {!!(clienteInicial?.id ?? params.id) && (
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
                      cliente={cliente}
                      emitirCliente={emitir}
                      recargarCliente={() =>
                        emitir("cliente_id_cambiado", modelo.id)
                      }
                    />
                  }
                />,
                <Tab
                  key="tab-2"
                  label="Comercial"
                  children={
                    <TabComercial cliente={cliente} emitirCliente={emitir} />
                  }
                />,
                <Tab
                  key="tab-3"
                  label="Direcciones"
                  children={<TabDirecciones clienteId={cliente.modelo.id} />}
                />,
                <Tab
                  key="tab-4"
                  label="Cuentas Bancarias"
                  children={<TabCuentasBanco clienteId={cliente.modelo.id} />}
                />,
                <Tab
                  key="tab-5"
                  label="Agenda"
                  children={
                    <div className="detalle-cliente-tab-contenido">
                      <TabCrmContactos clienteId={cliente.modelo.id} />
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
                cliente={modelo}
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
