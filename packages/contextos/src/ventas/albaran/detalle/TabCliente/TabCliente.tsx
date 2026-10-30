import { BotonCambiar } from "#/ventas/comun/componentes/BotonCambiar.tsx";
import { Cliente } from "#/ventas/comun/componentes/cliente.tsx";
import { CambioClienteVenta } from "#/ventas/comun/componentes/moleculas/CambioClienteVenta/CambioClienteVenta.tsx";
import { CambioCliente } from "#/ventas/comun/componentes/moleculas/CambioClienteVenta/diseño.ts";
import { formatearDireccionVenta } from "#/ventas/comun/dominio.ts";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { ProcesarEvento } from "@olula/lib/useMaquina.js";
import { HookModelo } from "@olula/lib/useModelo.ts";
import { Albaran } from "../../diseño.ts";
import { editable } from "../../dominio.ts";
import { EstadoAlbaran } from "../diseño.ts";
import "./TabCliente.css";

interface TabClienteProps {
  albaran: HookModelo<Albaran>;
  estado: EstadoAlbaran;
  publicar?: ProcesarEvento;
}

export const TabCliente = ({
  albaran,
  estado,
  publicar = async () => {},
}: TabClienteProps) => {
  const { modelo } = albaran;
  const clienteEditable = editable(modelo);

  const onGuardarCambioCliente = async (cambios: CambioCliente) => {
    publicar("cambio_cliente_listo", cambios);
  };

  return (
    <div className="TabCliente">
      <quimera-formulario>
        <Cliente
          nombre="cliente_id"
          valor={modelo.cliente.cliente_id ?? ""}
          descripcion={modelo.cliente.nombre_cliente}
          soloLectura={true}
        />  
        <QInput
          nombre="id_fiscal"
          label="ID Fiscal"
          valor={modelo.cliente.id_fiscal}
          soloLectura={true}
        />

        {clienteEditable && (
          <div className="TabCliente-accion">
            <BotonCambiar
              titulo="Cambiar cliente y dirección"
              onClick={() => publicar("cambio_cliente_solicitado")}
            />
          </div>
        )}

        <QInput
          label="Dirección"
          nombre="direccion_cliente"
          valor={formatearDireccionVenta(modelo.cliente.direccion)}
          soloLectura={true}
        />
      </quimera-formulario>

      {clienteEditable && estado === "CAMBIANDO_CLIENTE" && (
        <CambioClienteVenta
          venta={albaran}
          onGuardar={onGuardarCambioCliente}
          onCancelar={() => publicar("cambio_cliente_cancelado")}
        />
      )}
    </div>
  );
};
