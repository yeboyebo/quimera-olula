import { Cliente } from "#/ventas/comun/componentes/cliente.tsx";
import { DirCliente } from "#/ventas/comun/componentes/dirCliente.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QModal } from "@olula/componentes/moleculas/qmodal.tsx";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { Maquina, useMaquina } from "@olula/lib/useMaquina.ts";
import { HookModelo } from "@olula/lib/useModelo.ts";
import { useState } from "react";

import { VentaTpv } from "../../diseño.ts";
import { patchCambiarCliente } from "../../infraestructura.ts";
import { CambioCliente } from "./CambioCliente.tsx";
import "./TabCliente.css";

interface TabClienteProps {
  venta: HookModelo<VentaTpv>;
  publicar?: EmitirEvento;
}
type Estado = "edicion" | "cambiando_cliente";

export const TabCliente = ({
  venta,
  publicar = () => {},
}: TabClienteProps) => {
  
    const [estado, setEstado] = useState<Estado>("edicion");
    const { modelo, uiProps, editable } = venta;

    const maquina: Maquina<Estado> = {
        edicion: {
        CAMBIO_CLIENTE_INICIADO: "cambiando_cliente",
        },
        cambiando_cliente: {
        CAMBIO_CLIENTE_CANCELADO: "edicion",

        CAMBIO_CLIENTE_LISTO: async (payload: unknown) => {
            const cambioCliente = payload as TipoCambioCliente;
            await patchCambiarCliente(modelo.id, cambioCliente);
            publicar("CLIENTE_FACTURA_CAMBIADO", modelo);
            return "edicion" as Estado;
        },
        },
    };
    const emitir = useMaquina(maquina, estado, setEstado);

    return (
        <div className="TabCliente">
        <quimera-formulario>
            <Cliente {...uiProps("cliente_id", "nombre_cliente")} />
            <QInput {...uiProps("id_fiscal")} label="ID Fiscal" />
            <div id="cambiar_cliente" className="botones maestro-botones">
            <QBoton
                deshabilitado={!editable}
                onClick={() => emitir("CAMBIO_CLIENTE_INICIADO")}
            >
                C
            </QBoton>
            </div>

            <DirCliente
            clienteId={modelo.cliente_id}
            {...uiProps("direccion_id")}
            />
        </quimera-formulario>

        <QModal
            nombre="modal"
            abierto={estado === "cambiando_cliente"}
            onCerrar={() => emitir("CAMBIO_CLIENTE_CANCELADO")}
        >
            <CambioCliente publicar={emitir} />
        </QModal>
        </div>
    );
};
