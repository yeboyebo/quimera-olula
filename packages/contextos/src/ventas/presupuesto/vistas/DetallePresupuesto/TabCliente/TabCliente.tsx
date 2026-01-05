import { Cliente } from "#/ventas/comun/componentes/cliente.tsx";
import { DirCliente } from "#/ventas/comun/componentes/dirCliente.tsx";
import { CambioClienteVenta } from "#/ventas/comun/componentes/moleculas/CambioClienteVenta/CambioClienteVenta.tsx";
import {
  getPresupuesto,
  patchCambiarCliente,
} from "#/ventas/presupuesto/infraestructura.ts";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { ContextoError } from "@olula/lib/contexto.js";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { ConfigMaquina4, useMaquina4 } from "@olula/lib/useMaquina.ts";
import { HookModelo } from "@olula/lib/useModelo.ts";
import { useContext } from "react";
import { Presupuesto } from "../../../diseño.ts";
import { editable } from "../../../dominio.ts";
import "./TabCliente.css";

interface TabClienteProps {
  presupuesto: HookModelo<Presupuesto>;
  publicar?: EmitirEvento;
}
type Estado = "edicion" | "cambiando_cliente";
type Contexto = Record<string, unknown>;

const configMaquina: ConfigMaquina4<Estado, Contexto> = {
  inicial: {
    estado: "edicion",
    contexto: {},
  },
  estados: {
    edicion: {
      cambio_cliente_iniciado: "cambiando_cliente",
    },
    cambiando_cliente: {
      cambio_cliente_cancelado: "edicion",
      cambio_cliente_listo: "edicion",
    },
  },
};

export const TabCliente = ({
  presupuesto,
  publicar = () => {},
}: TabClienteProps) => {
  const { modelo, uiProps } = presupuesto;
  const { intentar } = useContext(ContextoError);

  const [emitir, { estado }] = useMaquina4<Estado, Contexto>({
    config: configMaquina,
    publicar,
  });

  const onGuardarCambioCliente = async (
    ventaId: string,
    cambios: Partial<Presupuesto>
  ) => {
    await intentar(() => patchCambiarCliente(ventaId, cambios));
    const nuevoPresupuesto = await getPresupuesto(ventaId);
    publicar("presupuesto_cambiado", nuevoPresupuesto);
    emitir("cambio_cliente_listo");
  };

  return (
    <div className="TabCliente">
      <quimera-formulario>
        <Cliente {...uiProps("cliente_id", "nombre_cliente")} />
        <QInput {...uiProps("id_fiscal")} label="ID Fiscal" />
        <div id="cambiar_cliente" className="botones maestro-botones">
          <QBoton
            deshabilitado={!editable(modelo)}
            onClick={() => emitir("cambio_cliente_iniciado")}
          >
            C
          </QBoton>
        </div>
        {presupuesto.modelo.cliente_id !== "None" ? (
          <DirCliente
            clienteId={modelo.cliente_id}
            {...uiProps("direccion_id")}
          />
        ) : (
          <>
            <QInput
              deshabilitado={true}
              label="Direccion"
              nombre="direccion_cliente"
              valor={`${modelo.tipo_via} ${modelo.nombre_via}, ${modelo.ciudad}`}
            />
          </>
        )}
      </quimera-formulario>

      <CambioClienteVenta
        venta={presupuesto}
        onGuardar={onGuardarCambioCliente}
        onCancelar={() => emitir("cambio_cliente_listo")}
        activo={estado === "cambiando_cliente"}
      />
    </div>
  );
};
