import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { Detalle } from "@olula/componentes/detalle/Detalle.tsx";
import { Tab, Tabs } from "@olula/componentes/detalle/tabs/Tabs.tsx";
import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { EmitirEvento, Entidad } from "@olula/lib/diseño.ts";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useContext, useState } from "react";
import { useParams } from "react-router";
import { Cliente } from "../../diseño.ts";
import { clienteVacio, metaCliente } from "../../dominio.ts";
import {
  deleteCliente,
  getCliente,
  patchCliente,
} from "../../infraestructura.ts";
import { TabCrmContactos } from "./CRMContactos/TabCrmContactos.tsx";
import { TabCuentasBanco } from "./CuentasBanco/TabCuentasBanco.tsx";
import "./DetalleCliente.css";
import { TabDirecciones } from "./Direcciones/TabDirecciones.tsx";
import { TabComercial } from "./TabComercial.tsx";
import { TabGeneral } from "./TabGeneral.tsx";

export const DetalleCliente = ({
  clienteInicial = null,
  emitir = () => {},
}: {
  clienteInicial?: Cliente | null;
  emitir?: EmitirEvento;
}) => {
  const params = useParams();
  const { intentar } = useContext(ContextoError);

  const clienteId = clienteInicial?.id ?? params.id;
  const titulo = (cliente: Entidad) => cliente.nombre as string;

  const cliente = useModelo(metaCliente, clienteVacio());
  const { modelo, init, modificado, valido } = cliente;
  const [estado, setEstado] = useState<"confirmarBorrado" | "edicion">(
    "edicion"
  );

  const onGuardarClicked = async () => {
    await intentar(() => patchCliente(modelo.id, modelo));
    const cliente_guardado = await getCliente(modelo.id);
    init(cliente_guardado);
    emitir("CLIENTE_CAMBIADO", cliente_guardado);
  };

  const onRecargarCliente = async () => {
    const clienteRecargado = await getCliente(modelo.id);
    init(clienteRecargado);
    emitir("CLIENTE_CAMBIADO", clienteRecargado);
  };

  const onBorrarConfirmado = async () => {
    await deleteCliente(modelo.id);
    emitir("CLIENTE_BORRADO", modelo);
    setEstado("edicion");
  };

  return (
    <div className="DetalleCliente">
      <Detalle
        id={clienteId}
        obtenerTitulo={titulo}
        setEntidad={(c) => init(c as Cliente)}
        entidad={modelo}
        cargar={getCliente}
        className="detalle-cliente"
        cerrarDetalle={() => emitir("CANCELAR_SELECCION")}
      >
        {!!clienteId && (
          <div className="DetalleCliente">
            <div className="maestro-botones ">
              <QBoton onClick={() => setEstado("confirmarBorrado")}>
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
                      recargarCliente={onRecargarCliente}
                    />
                  }
                />,
                <Tab
                  key="tab-1"
                  label="Comercial"
                  children={
                    <TabComercial cliente={cliente} emitirCliente={emitir} />
                  }
                />,
                <Tab
                  key="tab-2"
                  label="Direcciones"
                  children={<TabDirecciones clienteId={clienteId} />}
                />,
                <Tab
                  key="tab-3"
                  label="Cuentas Bancarias"
                  children={
                    <TabCuentasBanco
                      cliente={cliente}
                      emitirCliente={emitir}
                      recargarCliente={onRecargarCliente}
                    />
                  }
                />,
                <Tab
                  key="tab-4"
                  label="Agenda"
                  children={
                    <div className="detalle-cliente-tab-contenido">
                      <TabCrmContactos clienteId={clienteId} />
                    </div>
                  }
                />,
              ]}
            />
            {cliente.modificado && (
              <div className="maestro-botones ">
                <QBoton onClick={onGuardarClicked} deshabilitado={!valido}>
                  Guardar
                </QBoton>
                <QBoton
                  tipo="reset"
                  variante="texto"
                  onClick={() => init()}
                  deshabilitado={!modificado}
                >
                  Cancelar
                </QBoton>
              </div>
            )}
            <QModalConfirmacion
              nombre="borrarCliente"
              abierto={estado === "confirmarBorrado"}
              titulo="Confirmar borrar"
              mensaje="¿Está seguro de que desea borrar este cliente?"
              onCerrar={() => setEstado("edicion")}
              onAceptar={onBorrarConfirmado}
            />
          </div>
        )}
      </Detalle>
    </div>
  );
};
