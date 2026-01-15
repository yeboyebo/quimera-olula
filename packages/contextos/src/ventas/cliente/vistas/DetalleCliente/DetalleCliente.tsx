import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { Detalle } from "@olula/componentes/detalle/Detalle.tsx";
import { Tab, Tabs } from "@olula/componentes/detalle/tabs/Tabs.tsx";
import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useCallback, useState } from "react";
import { useParams } from "react-router";
import { Cliente } from "../../diseño.ts";
import { useCliente } from "../../hooks/useCliente.ts";
import { TabCrmContactos } from "./CRMContactos/TabCrmContactos.tsx";
import { TabCuentasBanco } from "./CuentasBanco/TabCuentasBanco.tsx";
import "./DetalleCliente.css";
import { TabDirecciones } from "./Direcciones/TabDirecciones.tsx";
import { TabComercial } from "./TabComercial.tsx";
import { TabGeneral } from "./TabGeneral.tsx";

export const DetalleCliente = ({
  clienteInicial = null,
  publicar = () => {},
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

  const titulo = (cliente: Cliente) => (cliente.nombre as string) + estado;

  const [confirmacionEstado, setConfirmacionEstado] = useState<boolean>(false);

  const handleGuardar = useCallback(() => {
    emitir("edicion_de_cliente_lista", modelo);
  }, [emitir, modelo]);

  const handleCancelar = useCallback(() => {
    emitir("edicion_de_cliente_cancelada");
  }, [emitir]);

  const handleBorrar = useCallback(() => {
    setConfirmacionEstado(true);
  }, []);

  const handleBorrarConfirmado = useCallback(() => {
    emitir("borrar_solicitado");
    setConfirmacionEstado(false);
  }, [emitir]);

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
              <QBoton onClick={handleBorrar}>Borrar</QBoton>
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
            <QModalConfirmacion
              nombre="borrarCliente"
              abierto={confirmacionEstado}
              titulo="Confirmar borrar"
              mensaje="¿Está seguro de que desea borrar este cliente?"
              onCerrar={() => setConfirmacionEstado(false)}
              onAceptar={handleBorrarConfirmado}
            />
          </div>
        )}
      </Detalle>
    </div>
  );
};
