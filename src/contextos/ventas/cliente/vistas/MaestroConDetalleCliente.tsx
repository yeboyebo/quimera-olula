import { useState } from "react";
import { QBoton } from "../../../../componentes/atomos/qboton.tsx";
import { Listado } from "../../../../componentes/maestro/Listado.tsx";
import { MaestroDetalleResponsive } from "../../../../componentes/maestro/MaestroDetalleResponsive.tsx";
import { QModal } from "../../../../componentes/moleculas/qmodal.tsx";
import { QModalConfirmacion } from "../../../../componentes/moleculas/qmodalconfirmacion.tsx";
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
type Estado = "lista" | "alta" | "confirmarBorrado";
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
      CANCELAR_SELECCION: () => {
        clientes.limpiarSeleccion();
      },
    },
    confirmarBorrado: {},
  };

  const emitir = useMaquina(maquina, estado, setEstado);

  const onBorrarCliente = async () => {
    setEstado("confirmarBorrado");
  };

  const confirmarBorrado = async () => {
    if (!clientes.seleccionada) {
      setEstado("lista");
      return;
    }
    await deleteCliente(clientes.seleccionada.id);
    clientes.eliminar(clientes.seleccionada);
    setEstado("lista");
  };

  return (
    <div className="Cliente">
      <MaestroDetalleResponsive<Cliente>
        seleccionada={clientes.seleccionada}
        Maestro={
          <>
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
              tamañoPagina={2}
              cargar={getClientes}
            />
          </>
        }
        Detalle={
          <DetalleCliente
            clienteInicial={clientes.seleccionada}
            emitir={emitir}
          />
        }
      />
      <QModal
        nombre="modal"
        abierto={estado === "alta"}
        onCerrar={() => emitir("ALTA_CANCELADA")}
      >
        <AltaCliente emitir={emitir} />
      </QModal>
      <QModalConfirmacion
        nombre="confirmarBorrarCliente"
        abierto={estado === "confirmarBorrado"}
        titulo="Confirmar borrado"
        mensaje="¿Está seguro de que desea borrar este cliente?"
        onCerrar={() => setEstado("lista")}
        onAceptar={confirmarBorrado}
      />
    </div>
  );
};
