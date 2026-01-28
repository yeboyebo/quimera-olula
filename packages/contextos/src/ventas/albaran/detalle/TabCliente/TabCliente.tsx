import { Cliente } from "#/ventas/comun/componentes/cliente.tsx";
import { DirCliente } from "#/ventas/comun/componentes/dirCliente.tsx";
import { CambioClienteVenta } from "#/ventas/comun/componentes/moleculas/CambioClienteVenta/CambioClienteVenta.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
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
  const { modelo, uiProps } = albaran;

  const onGuardarCambioCliente = async (cambios: Partial<Albaran>) => {
    publicar("cambio_cliente_listo", cambios);
  };

  return (
    <div className="TabCliente">
      <quimera-formulario>
        <Cliente {...uiProps("cliente_id", "nombre_cliente")} />
        <QInput {...uiProps("id_fiscal")} label="ID Fiscal" />

        <div className="botones maestro-botones">
          <QBoton
            deshabilitado={!editable(modelo)}
            onClick={() => publicar("cambio_cliente_solicitado")}
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

      {estado === "CAMBIANDO_CLIENTE" && (
        <CambioClienteVenta
          venta={albaran}
          onGuardar={onGuardarCambioCliente}
          onCancelar={() => publicar("cambio_cliente_cancelado")}
        />
      )}
    </div>
  );
};
