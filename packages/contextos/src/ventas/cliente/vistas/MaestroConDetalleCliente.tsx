import { Listado } from "@olula/componentes/maestro/Listado.tsx";
import { MaestroDetalleResponsive } from "@olula/componentes/maestro/MaestroDetalleResponsive.tsx";
import { QuimeraAcciones } from "@olula/componentes/moleculas/qacciones.tsx";
import { QModal } from "@olula/componentes/moleculas/qmodal.tsx";
import { puede } from "@olula/lib/dominio.ts";
import { useLista } from "@olula/lib/useLista.ts";
import { Maquina, useMaquina } from "@olula/lib/useMaquina.ts";
import { useState } from "react";
import { Cliente } from "../diseño.ts";
import { metaTablaCliente } from "../dominio.ts";
import { getClientes } from "../infraestructura.ts";
import { AltaCliente } from "./CrearCliente.tsx";
import { DetalleCliente } from "./DetalleCliente/DetalleCliente.tsx";
import "./MaestroConDetalleCliente.css";
import { TarjetaCliente } from "./TarjetaCliente.tsx";

type Estado = "lista" | "alta";
export const MaestroConDetalleCliente = () => {
  const [estado, setEstado] = useState<Estado>("lista");
  const clientes = useLista<Cliente>([]);

  const maquina: Maquina<Estado> = {
    alta: {
      cliente_creado: (payload) => {
        const cliente = payload as Cliente;
        clientes.añadir(cliente);
        return "lista";
      },
      alta_cancelada: "lista",
    },
    lista: {
      alta_iniciada: "alta",
      cliente_cambiado: (payload) => {
        const cliente = payload as Cliente;
        clientes.modificar(cliente);
      },
      cliente_borrado: (payload) => {
        const cliente = payload as Cliente;
        clientes.eliminar(cliente);
      },
      cancelar_seleccion: () => {
        clientes.limpiarSeleccion();
      },
    },
  };

  const emitir = useMaquina(maquina, estado, setEstado);

  const puedeCrear = puede("ventas.cliente.crear");

  const acciones = [
    puedeCrear && {
      texto: "Nuevo",
      onClick: () => emitir("alta_iniciada"),
      variante: "borde" as const,
    },
  ].filter(Boolean);

  return (
    <div className="Cliente">
      <MaestroDetalleResponsive<Cliente>
        seleccionada={clientes.seleccionada}
        Maestro={
          <>
            <h2>Clientes</h2>
            <div className="maestro-botones">
              <QuimeraAcciones acciones={acciones} />
            </div>
            <Listado
              metaTabla={metaTablaCliente}
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
        onCerrar={() => emitir("alta_cancelada")}
      >
        <AltaCliente emitir={emitir} />
      </QModal>
    </div>
  );
};
