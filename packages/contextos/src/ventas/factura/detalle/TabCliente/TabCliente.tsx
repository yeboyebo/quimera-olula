import { Cliente } from "#/ventas/comun/componentes/cliente.tsx";
import { formatearDireccionVenta } from "#/ventas/comun/dominio.ts";
import { CambioClienteVenta } from "#/ventas/comun/componentes/moleculas/CambioClienteVenta/CambioClienteVenta.tsx";
import { CambioCliente } from "#/ventas/comun/componentes/moleculas/CambioClienteVenta/diseño.ts";
import { BotonCambiar } from "#/ventas/comun/componentes/BotonCambiar.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { HookModelo } from "@olula/lib/useModelo.ts";
import { useState } from "react";
import { Factura } from "../../diseño.ts";
import { editable } from "../diseño.ts";
import "./TabCliente.css";

interface TabClienteProps {
  factura: HookModelo<Factura>;
  publicar?: (evento: string, payload?: unknown) => void;
}

export const TabCliente = ({
  factura,
  publicar = async () => {},
}: TabClienteProps) => {
  const { modelo } = factura;
  const clienteEditable = editable(modelo);
  const [cambiandoCliente, setCambiandoCliente] = useState(false);

  const onGuardarCambioCliente = async (cambios: CambioCliente) => {
    publicar("cambio_cliente_listo", cambios);
    setCambiandoCliente(false);
  };

  return (
    <div className="TabCliente">
      <quimera-formulario>
        <Cliente
          nombre="cliente_id"
          valor={modelo.cliente.cliente_id ?? ""}
          descripcion={modelo.cliente.nombre_cliente}
          deshabilitado={true}
        />
        <QInput
          nombre="id_fiscal"
          label="ID Fiscal"
          valor={modelo.cliente.id_fiscal}
          deshabilitado={true}
        />

        {clienteEditable && (
          <div className="TabCliente-accion">
            <BotonCambiar
              titulo="Cambiar cliente y dirección"
              onClick={() => setCambiandoCliente(true)}
            />
          </div>
        )}

        <QInput
          deshabilitado={true}
          label="Dirección"
          nombre="direccion_cliente"
          valor={formatearDireccionVenta(modelo.cliente.direccion)}
        />
      </quimera-formulario>

      {clienteEditable && cambiandoCliente && (
        <CambioClienteVenta
          venta={factura}
          inicializarDesdeVenta={true}
          onGuardar={onGuardarCambioCliente}
          onCancelar={() => setCambiandoCliente(false)}
        />
      )}
    </div>
  );
};
