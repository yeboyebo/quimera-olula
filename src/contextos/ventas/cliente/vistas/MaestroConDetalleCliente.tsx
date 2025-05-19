import { useState } from "react";
import { QBoton } from "../../../../componentes/atomos/qboton.tsx";
import { Listado } from "../../../../componentes/maestro/Listado.tsx";
import { QModal } from "../../../../componentes/moleculas/qmodal.tsx";
import { Entidad } from "../../../../contextos/comun/diseño.ts";
import { useLista } from "../../../comun/useLista.ts";
import { Maquina, useMaquina } from "../../../comun/useMaquina.ts";
import { Cliente } from "../diseño.ts";
import { deleteCliente, getClientes } from "../infraestructura.ts";
import { AltaCliente } from "./AltaCliente.tsx";
import { DetalleCliente } from "./DetalleCliente/DetalleCliente.tsx";
import "./MaestroConDetalleCliente.css";

const metaTablaCliente = [
  { id: "id", cabecera: "Id" },
  { id: "nombre", cabecera: "Nombre" },
  {
    id: "id_fiscal",
    cabecera: "Id Fiscal",
    render: (entidad: Entidad) =>
      `${entidad.tipo_id_fiscal}: ${entidad.id_fiscal}`,
  },
  { id: "telefono1", cabecera: "Teléfono" },
  { id: "email", cabecera: "Email" },
  { id: "nombre_agente", cabecera: "Nombre del Agente" },
  { id: "forma_pago", cabecera: "Forma de Pago" },
  { id: "grupo_iva_negocio_id", cabecera: "Grupo IVA Negocio" },
];
type Estado = "lista" | "alta";
export const MaestroConDetalleCliente = () => {
  const [estado, setEstado] = useState<Estado>("lista");
  const clientes = useLista<Cliente>([]);

  const maquina: Maquina<Estado> = {
    alta: {
      CLIENTE_CREADO: (payload: unknown) => {
        const cliente = payload as Cliente;
        clientes.añadir(cliente);
        return "lista";
      },
      ALTA_CANCELADA: "lista",
    },
    lista: {
      ALTA_INICIADA: "alta",
      CLIENTE_CAMBIADO: (payload: unknown) => {
        const cliente = payload as Cliente;
        clientes.modificar(cliente);
      },
      CLIENTE_BORRADO: (payload: unknown) => {
        const cliente = payload as Cliente;
        clientes.eliminar(cliente);
      },
    },
  };

  const emitir = useMaquina(maquina, estado, setEstado);

  const onBorrarCliente = async () => {
    if (!clientes.seleccionada) {
      return;
    }
    await deleteCliente(clientes.seleccionada.id);
    clientes.eliminar(clientes.seleccionada);
  };

  return (
    <maestro-detalle name="clientes">
      <div className="Maestro">
        <h2>Clientes</h2>
        <div className="maestro-botones">
          <QBoton onClick={() => emitir("ALTA_INICIADA")}>Nuevo</QBoton>
          <QBoton
            deshabilitado={!clientes.seleccionada}
            onClick={onBorrarCliente}
          >
            Borrar
          </QBoton>
        </div>
        <Listado
          metaTabla={metaTablaCliente}
          entidades={clientes.lista}
          setEntidades={clientes.setLista}
          seleccionada={clientes.seleccionada}
          setSeleccionada={clientes.seleccionar}
          cargar={getClientes}
        />
      </div>
      <div className="Detalle">
        <DetalleCliente
          clienteInicial={clientes.seleccionada}
          emitir={emitir}
          cancelarSeleccionada={clientes.limpiarSeleccion}
        />
      </div>

      <QModal
        nombre="modal"
        abierto={estado === "alta"}
        onCerrar={() => emitir("ALTA_CANCELADA")}
      >
        <AltaCliente
          emitir={emitir}
          // onClienteCreado={onClienteCreado}
          // onCancelar={onCancelar}
        />
      </QModal>
    </maestro-detalle>
  );
};
