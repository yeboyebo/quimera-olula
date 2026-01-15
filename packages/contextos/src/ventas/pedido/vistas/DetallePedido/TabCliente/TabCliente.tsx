import { Cliente } from "#/ventas/comun/componentes/cliente.tsx";
import { DirCliente } from "#/ventas/comun/componentes/dirCliente.tsx";
import { CambioClienteVenta } from "#/ventas/comun/componentes/moleculas/CambioClienteVenta/CambioClienteVenta.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { HookModelo } from "@olula/lib/useModelo.ts";
import { useState } from "react";
import { Pedido } from "../../../diseño.ts";
import { editable } from "../../../dominio.ts";
import "./TabCliente.css";

interface TabClienteProps {
  pedido: HookModelo<Pedido>;
  publicar?: (evento: string, payload?: unknown) => void;
}

export const TabCliente = ({
  pedido,
  publicar = () => {},
}: TabClienteProps) => {
  const { modelo, uiProps } = pedido;
  const [cambiandoCliente, setCambiandoCliente] = useState(false);

  const onGuardarCambioCliente = async (cambios: Partial<Pedido>) => {
    publicar("cambio_cliente_listo", cambios);
    setCambiandoCliente(false);
  };

  return (
    <div className="TabCliente">
      <quimera-formulario>
        <Cliente {...uiProps("cliente_id", "nombre_cliente")} />
        <QInput {...uiProps("id_fiscal")} label="ID Fiscal" />

        <div className="botones maestro-botones">
          <QBoton
            deshabilitado={!editable(modelo)}
            onClick={() => setCambiandoCliente(true)}
          >
            Cambiar Cliente
          </QBoton>
        </div>

        {modelo.cliente_id !== "None" ? (
          <DirCliente
            clienteId={modelo.cliente_id}
            {...uiProps("direccion_id")}
          />
        ) : (
          <QInput
            deshabilitado={true}
            label="Direccion"
            nombre="direccion_cliente"
            valor={`${modelo.tipo_via} ${modelo.nombre_via}, ${modelo.ciudad}`}
          />
        )}
      </quimera-formulario>

      {cambiandoCliente && (
        <CambioClienteVenta
          venta={pedido}
          onGuardar={onGuardarCambioCliente}
          onCancelar={() => setCambiandoCliente(false)}
        />
      )}
    </div>
  );
};
