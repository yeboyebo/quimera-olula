import { TabCrmContactos } from "#/ventas/cliente/detalle/CRMContactos/TabCrmContactos.tsx";
import { TabDirecciones } from "#/ventas/cliente/detalle/Direcciones/TabDirecciones.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.js";
import { Detalle, QBoton, Tab, Tabs } from "@olula/componentes/index.js";
import { EmitirEvento, Entidad } from "@olula/lib/diseño.js";
import { useModelo } from "@olula/lib/useModelo.js";
import { useParams } from "react-router";
import { BorrarCliente } from "../borrar/BorrarCliente.tsx";
import { Cliente } from "../diseño.ts";
import { Acciones } from "./acciones/Acciones.tsx";
import { clienteVacio, metaCliente } from "./detalle.ts";
import "./DetalleCliente.css";
import { getMaquina } from "./maquina.ts";
import { Oportunidades } from "./oportunidades/Oportunidades.tsx";
import { TabGeneral } from "./tabs/TabGeneral.tsx";

export const DetalleCliente = ({
  inicial = null,
  publicar,
}: {
  inicial: Cliente | null;
  publicar: EmitirEvento;
}) => {
  const params = useParams();

  const clienteId = inicial?.id ?? params.id;
  const titulo = (cliente: Entidad) => cliente.nombre as string;

  const cliente = useModelo(metaCliente, clienteVacio);
  const { modelo, modeloInicial, modificado, valido, init } = cliente;

  const { ctx, emitir } = useMaquina(
    getMaquina,
    {
      estado: "INICIAL",
      cliente: modelo,
      inicial: modeloInicial,
    },
    publicar
  );

  if (ctx.cliente !== modeloInicial) {
    init(ctx.cliente);
  }

  const guardar = async () => {
    emitir("cliente_cambiado", modelo);
  };

  const cancelar = () => {
    emitir("edicion_cliente_cancelada");
  };

  if (clienteId && clienteId !== modelo.id) {
    emitir("cliente_id_cambiado", clienteId);
  }

  return (
    <Detalle
      id={clienteId}
      obtenerTitulo={titulo}
      setEntidad={() => {}}
      entidad={modelo}
      cerrarDetalle={() => emitir("edicion_cliente_cancelada", null)}
    >
      {!!clienteId && (
        <div className="DetalleCliente">
          <div className="maestro-botones ">
            <QBoton onClick={() => emitir("borrado_cliente_solicitado")}>
              Borrar
            </QBoton>
          </div>

          <Tabs>
            <Tab label="General">
              <TabGeneral cliente={cliente} emitir={publicar} />
            </Tab>

            <Tab label="Contactos">
              <TabCrmContactos clienteId={clienteId} />
            </Tab>

            <Tab label="Direcciones">
              <TabDirecciones clienteId={clienteId} />
            </Tab>

            <Tab label="Oportunidades">
              <Oportunidades cliente={cliente} />
            </Tab>

            <Tab label="Acciones">
              <Acciones cliente={cliente} />
            </Tab>
          </Tabs>

          {modificado && (
            <div className="botones maestro-botones">
              <QBoton onClick={guardar} deshabilitado={!valido}>
                Guardar
              </QBoton>
              <QBoton tipo="reset" variante="texto" onClick={cancelar}>
                Cancelar
              </QBoton>
            </div>
          )}
          {ctx.estado === "BORRANDO" && (
            <BorrarCliente publicar={emitir} cliente={modelo} />
          )}
        </div>
      )}
    </Detalle>
  );
};
