import { Cliente } from "#/ventas/comun/componentes/cliente.tsx";
import { DirCliente } from "#/ventas/comun/componentes/dirCliente.tsx";
import { CambioClienteVenta } from "#/ventas/comun/componentes/moleculas/CambioClienteVenta/CambioClienteVenta.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { HookModelo } from "@olula/lib/useModelo.ts";
import { useState } from "react";
import { Presupuesto } from "../../diseño.ts";
import { editable } from "../dominio.ts";
import "./TabCliente.css";

interface TabClienteProps {
  presupuesto: HookModelo<Presupuesto>;
  publicar?: (evento: string, payload?: unknown) => void;
}

export const TabCliente = ({
  presupuesto,
  publicar = () => {},
}: TabClienteProps) => {
  const { modelo, uiProps } = presupuesto;
  const [cambiandoCliente, setCambiandoCliente] = useState(false);

  const onGuardarCambioCliente = async (cambios: Partial<Presupuesto>) => {
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
          venta={presupuesto}
          onGuardar={onGuardarCambioCliente}
          onCancelar={() => setCambiandoCliente(false)}
        />
      )}
    </div>
  );
};
