import { useState } from "react";
import { Listado } from "../../../../componentes/maestro/Listado.tsx";
import { MaestroDetalleResponsive } from "../../../../componentes/maestro/MaestroDetalleResponsive.tsx";
import { Entidad } from "../../../comun/diseño.ts";
import { useLista } from "../../../comun/useLista.ts";
import { Maquina, useMaquina } from "../../../comun/useMaquina.ts";
import { Cliente } from "../diseño.ts";
import { getClientes } from "../infraestructura.ts";
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
];
type Estado = "lista";
export const MaestroConDetalleClienteCRM = () => {
  const [estado, setEstado] = useState<Estado>("lista");
  const clientes = useLista<Cliente>([]);

  const maquina: Maquina<Estado> = {
    lista: {
      CLIENTE_CAMBIADO: (payload: unknown) => {
        const cliente = payload as Cliente;
        clientes.modificar(cliente);
      },
      CANCELAR_SELECCION: () => {
        clientes.limpiarSeleccion();
      },
    },
  };

  const emitir = useMaquina(maquina, estado, setEstado);

  return (
    <div className="Cliente">
      <MaestroDetalleResponsive<Cliente>
        seleccionada={clientes.seleccionada}
        Maestro={
          <>
            <h2>Clientes</h2>
            <Listado
              metaTabla={metaTablaCliente}
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
    </div>
  );
};
