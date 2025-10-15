import { Listado } from "@olula/componentes/maestro/Listado.tsx";
import { MaestroDetalleResponsive } from "@olula/componentes/maestro/MaestroDetalleResponsive.tsx";
import { QuimeraAcciones } from "@olula/componentes/moleculas/qacciones.tsx";
import { QModal } from "@olula/componentes/moleculas/qmodal.tsx";
import { Entidad } from "@olula/lib/diseño.ts";
import { puede } from "@olula/lib/dominio.ts";
import { useLista } from "@olula/lib/useLista.ts";
import { Maquina, useMaquina } from "@olula/lib/useMaquina.ts";
import { useState } from "react";
import { Cliente } from "../diseño.ts";
import { getClientes } from "../infraestructura.ts";
import { AltaCliente } from "./AltaCliente.tsx";
import { DetalleCliente } from "./DetalleCliente/DetalleCliente.tsx";
import "./MaestroConDetalleCliente.css";
import { TarjetaCliente } from "./TarjetaCliente.tsx";

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
type Modo = "tabla" | "tarjetas";
export const MaestroConDetalleCliente = () => {
  const [estado, setEstado] = useState<Estado>("lista");
  const clientes = useLista<Cliente>([]);
  const [modo, setModo] = useState<Modo>("tarjetas");

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
  };

  const emitir = useMaquina(maquina, estado, setEstado);

  const puedeCrear = puede("ventas.cliente.crear");

  const acciones = [
    puedeCrear && {
      texto: "Nuevo",
      onClick: () => emitir("ALTA_INICIADA"),
      variante: "borde" as const,
    },
    // {
    //   icono: "eliminar",
    //   texto: "Borrar",
    //   onClick: () => emitir("BORRADO_SOLICITADO"),
    //   deshabilitado: true,
    // },
  ].filter(Boolean);

  // const modo = "tarjetas";

  return (
    <div className="Cliente">
      <MaestroDetalleResponsive<Cliente>
        seleccionada={clientes.seleccionada}
        modo={modo}
        Maestro={
          <>
            <h2>Clientes</h2>
            <div className="maestro-botones">
              <QuimeraAcciones acciones={acciones} />
            </div>
            <Listado
              metaTabla={metaTablaCliente}
              modo={modo}
              setModo={setModo}
              tarjeta={(cliente) => <TarjetaCliente cliente={cliente} />}
              entidades={clientes.lista}
              setEntidades={clientes.setLista}
              seleccionada={clientes.seleccionada}
              setSeleccionada={clientes.seleccionar}
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
    </div>
  );
};
