import { useState } from "react";
import { useParams } from "react-router";
import { QBoton } from "../../../../componentes/atomos/qboton.tsx";
import { QForm } from "../../../../componentes/atomos/qform.tsx";
import { QInput } from "../../../../componentes/atomos/qinput.tsx";
import { Detalle } from "../../../../componentes/detalle/Detalle.tsx";
import { Tab, Tabs } from "../../../../componentes/detalle/tabs/Tabs.tsx";
import { Entidad } from "../../../comun/diseño.ts";
import { Cliente, IdFiscal as TipoIdFiscal } from "../diseño.ts";
import { clienteVacio } from "../dominio.ts";
import { getCliente, patchCliente } from "../infraestructura.ts";
import "./DetalleCliente.css";
import { IdFiscal } from "./IdFiscal.tsx";
import { TabCrmContactos } from "./TabCrmContactos.tsx";
import { TabCuentasBanco } from "./TabCuentasBanco.tsx";
import { TabDirecciones } from "./TabDirecciones.tsx";

export const DetalleCliente = ({
  clienteInicial = null,
  onEntidadActualizada = () => {},
  cancelarSeleccionada,
}: {
  clienteInicial?: Cliente | null;
  onEntidadActualizada?: (entidad: Cliente) => void;
  cancelarSeleccionada?: () => void;
}) => {
  const params = useParams();

  const [guardando, setGuardando] = useState(false);

  const clienteId = clienteInicial?.id ?? params.id;

  const sufijoTitulo = guardando ? " (Guardando...)" : "";
  const titulo = (cliente: Entidad) =>
    `${cliente.nombre} ${sufijoTitulo}` as string;

  const [cliente, setCliente] = useState<Cliente>(clienteVacio());

  const onIdFiscalCambiadoCallback = (idFiscal: TipoIdFiscal) => {
    const nuevoCliente = { ...cliente, ...idFiscal };
    setCliente(nuevoCliente);
    onEntidadActualizada(nuevoCliente);
  };

  const onGuardar = async (datos: Record<string, string>) => {
    if (!clienteId) {
      return;
    }

    const cambios = Object.keys(datos).reduce((acc, key) => {
      if (datos[key] !== cliente[key as keyof Cliente]) {
        acc[key] = datos[key];
      }
      return acc;
    }, {} as Record<string, string>);

    if (Object.keys(cambios).length === 0) return;

    setGuardando(true);
    await patchCliente(clienteId, cambios);
    setGuardando(false);

    const nuevoCliente = { ...cliente, ...cambios };
    setCliente(nuevoCliente);
    onEntidadActualizada(nuevoCliente);
  };

  return (
    <Detalle
      id={clienteId}
      obtenerTitulo={titulo}
      setEntidad={(c) => setCliente(c as Cliente)}
      entidad={cliente}
      cargar={getCliente}
      className="detalle-cliente"
      cerrarDetalle={cancelarSeleccionada}
    >
      <IdFiscal
        cliente={cliente}
        onIdFiscalCambiadoCallback={onIdFiscalCambiadoCallback}
      />
      <QForm onSubmit={onGuardar}>
        <section>
          <QInput
            label="Nombre"
            nombre="nombre"
            valor={cliente?.nombre ?? ""}
          />
          <QInput
            label="Agente"
            nombre="agente_id"
            valor={cliente?.agente_id ?? ""}
          />
        </section>
        <section>
          <QBoton tipo="submit">Guardar</QBoton>
          <QBoton tipo="reset" variante="texto" onClick={cancelarSeleccionada}>
            Cancelar
          </QBoton>
        </section>
      </QForm>

      {!!clienteId && (
        <Tabs
          className="detalle-cliente-tabs"
          children={[
            <Tab
              key="tab-1"
              label="Comercial"
              children={
                <div className="detalle-cliente-tab-contenido">
                  Comercial contenido
                </div>
              }
            />,
            <Tab
              key="tab-2"
              label="Direcciones"
              children={
                <div className="detalle-cliente-tab-contenido">
                  <TabDirecciones clienteId={clienteId} />
                </div>
              }
            />,
            <Tab
              key="tab-3"
              label="Cuentas Bancarias"
              children={
                <div className="detalle-cliente-tab-contenido">
                  <TabCuentasBanco clienteId={clienteId} />
                </div>
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
            <Tab
              key="tab-5"
              label="Descuentos"
              children={
                <div className="detalle-cliente-tab-contenido">
                  Descuentos contenido
                </div>
              }
            />,
            <Tab
              key="tab-6"
              label="Documentos"
              children={
                <div className="detalle-cliente-tab-contenido">
                  Documentos contenido
                </div>
              }
            />,
            <Tab
              key="tab-7"
              label="Contabilidad"
              children={
                <div className="detalle-cliente-tab-contenido">
                  Contabilidad contenido
                </div>
              }
            />,
            <Tab
              key="tab-8"
              label="Factura-e"
              children={
                <div className="detalle-cliente-tab-contenido">
                  Factura-e contenido
                </div>
              }
            />,
          ]}
        ></Tabs>
      )}
    </Detalle>
  );
};
