import { useState } from "react";
import { useParams } from "react-router";
import { QForm } from "../../../../componentes/atomos/qform.tsx";
import { QInput } from "../../../../componentes/atomos/qinput.tsx";
import { Detalle } from "../../../../componentes/detalle/Detalle.tsx";
import { Tab, Tabs } from "../../../../componentes/detalle/tabs/Tabs.tsx";
import { Cliente, IdFiscal as TipoIdFiscal } from "../diseño.ts";
import { clienteVacio } from "../dominio.ts";
import {
  desmarcarCuentaDomiciliacion,
  getCliente,
  patchCliente,
} from "../infraestructura.ts";
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
  const titulo = (cliente: Cliente) => `${cliente.nombre} ${sufijoTitulo}`;

  const [cliente, setCliente] = useState<Cliente>(clienteVacio());
  const [errores] = useState<Record<string, string>>({});

  const onIdFiscalCambiadoCallback = (idFiscal: TipoIdFiscal) => {
    const nuevoCliente = { ...cliente, ...idFiscal };
    setCliente(nuevoCliente);
    onEntidadActualizada(nuevoCliente);
  };

  const actualizarCampo = async (cambios: Record<string, string>) => {
    if (!clienteId) return;
    console.log(cambios);
    const [campo, valor] = Object.entries(cambios)[0];

    // const validador =
    //   validadoresCliente[campo as keyof typeof validadoresCliente];
    // console.log(validador(valor));

    // if (!validador(valor)) {
    //   const nuevoEstadoErrores = {
    //     ...errores,
    //     [campo]: validadoresCliente[campo as keyof typeof validadoresCliente](
    //       valor
    //     )
    //       ? ""
    //       : `El campo "${campo}" no es válido.`,
    //   };
    //   setErrores(nuevoEstadoErrores);
    // }
    console.log(cambios);
    if (cliente[campo as keyof Cliente] === valor) return;

    setGuardando(true);
    await patchCliente(clienteId, cambios);
    setGuardando(false);

    const nuevoCliente = { ...cliente, ...cambios };
    setCliente(nuevoCliente);
    onEntidadActualizada(nuevoCliente);
  };

  const desmarcarCuentaDomiciliada = async () => {
    if (!clienteId) return;
    setGuardando(true);
    await desmarcarCuentaDomiciliacion(clienteId);
    setGuardando(false);
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
      {!!clienteId && (
        <Tabs
          className="detalle-cliente-tabs"
          children={[
            <Tab
              key="tab-1"
              label="General"
              children={
                <>
                  <IdFiscal
                    cliente={cliente}
                    onIdFiscalCambiadoCallback={onIdFiscalCambiadoCallback}
                  />
                  <section>
                    <QForm onSubmit={actualizarCampo}>
                      <QInput
                        label="Nombre"
                        nombre="nombre"
                        valor={cliente?.nombre ?? ""}
                        erroneo={!!errores.nombre}
                        textoValidacion={errores.nombre}
                      />
                    </QForm>
                    <QForm onSubmit={actualizarCampo}>
                      <QInput
                        label="Agente"
                        nombre="agente_id"
                        valor={cliente?.agente_id ?? ""}
                        erroneo={!!errores.agente_id}
                        textoValidacion={errores.agente_id}
                      />
                      <QInput
                        label="Divisa"
                        nombre="divisa_id"
                        valor={cliente?.divisa_id ?? ""}
                        erroneo={!!errores.divisa_id}
                        textoValidacion={errores.divisa_id}
                      />
                      <QInput
                        label="Tipo ID Fiscal"
                        nombre="tipo_id_fiscal"
                        valor={cliente?.tipo_id_fiscal ?? ""}
                        erroneo={!!errores.tipo_id_fiscal}
                        textoValidacion={errores.tipo_id_fiscal}
                      />
                      <QInput
                        label="Serie"
                        nombre="serie_id"
                        valor={cliente?.serie_id ?? ""}
                        erroneo={!!errores.serie_id}
                        textoValidacion={errores.serie_id}
                      />
                      <QInput
                        label="Forma de Pago"
                        nombre="forma_pago_id"
                        valor={cliente?.forma_pago_id ?? ""}
                        erroneo={!!errores.forma_pago_id}
                        textoValidacion={errores.forma_pago_id}
                      />
                      <QInput
                        label="Grupo IVA Negocio"
                        nombre="grupo_iva_negocio_id"
                        valor={cliente?.grupo_iva_negocio_id ?? ""}
                        erroneo={!!errores.grupo_iva_negocio_id}
                        textoValidacion={errores.grupo_iva_negocio_id}
                      />
                      <QInput
                        label="Teléfono 1"
                        nombre="telefono1"
                        valor={cliente?.telefono1 ?? ""}
                        erroneo={!!errores.telefono1}
                        textoValidacion={errores.telefono1}
                      />
                      <QInput
                        label="Teléfono 2"
                        nombre="telefono2"
                        valor={cliente?.telefono2 ?? ""}
                        erroneo={!!errores.telefono2}
                        textoValidacion={errores.telefono2}
                      />
                      <QInput
                        label="Email"
                        nombre="email"
                        valor={cliente?.email ?? ""}
                        erroneo={!!errores.email}
                        textoValidacion={errores.email}
                      />
                      <QInput
                        label="Web"
                        nombre="web"
                        valor={cliente?.web ?? ""}
                        erroneo={!!errores.web}
                        textoValidacion={errores.web}
                      />
                    </QForm>
                    <QForm onSubmit={actualizarCampo}>
                      <QInput
                        label="Observaciones"
                        nombre="observaciones"
                        valor={cliente?.observaciones ?? ""}
                        erroneo={!!errores.observaciones}
                        textoValidacion={errores.observaciones}
                      />
                    </QForm>
                    <QForm onSubmit={actualizarCampo}>
                      <QInput
                        label="Copias Factura"
                        nombre="copiasfactura"
                        valor={cliente?.copiasfactura?.toString() ?? ""}
                        erroneo={!!errores.copiasfactura}
                        textoValidacion={errores.copiasfactura}
                      />
                      <QInput
                        label="Fecha de Baja"
                        nombre="fechabaja"
                        valor={cliente?.fechabaja ?? ""}
                        erroneo={!!errores.fechabaja}
                        textoValidacion={errores.fechabaja}
                      />
                      <QInput
                        label="Contacto"
                        nombre="contacto_id"
                        valor={cliente?.contacto_id ?? ""}
                        erroneo={!!errores.contacto_id}
                        textoValidacion={errores.contacto_id}
                      />
                      <QInput
                        label="De Baja"
                        nombre="de_baja"
                        valor={cliente?.de_baja ? "Sí" : "No"}
                        erroneo={!!errores.de_baja}
                        textoValidacion={errores.de_baja}
                      />
                    </QForm>
                  </section>
                </>
              }
            />,

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
                  <div className="CuentaBancoDomiciliacion">
                    <span>Domiciliar en: {cliente.cuenta_domiciliada}</span>
                    <button onClick={() => desmarcarCuentaDomiciliada()}>
                      Desmarcar
                    </button>
                  </div>
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
          ]}
        ></Tabs>
      )}
    </Detalle>
  );
};
