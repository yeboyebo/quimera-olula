import { AgenteTpv as CompAgenteTpv } from "#/tpv/comun/componentes/AgenteTpv.tsx";
import { Cliente } from "#/ventas/comun/componentes/cliente.tsx";
import { DirCliente } from "#/ventas/comun/componentes/dirCliente.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";

import { EmitirEvento } from "@olula/lib/diseño.js";
import { FormModelo } from "@olula/lib/dominio.js";
import { VentaTpv } from "../../diseño.ts";
import { EstadoVentaTpv } from "../detalle.ts";
import { CambiarCliente } from "./cambiar_cliente/CambioCliente.tsx";
import "./TabCliente.css";

interface TabClienteProps {
  venta: VentaTpv;
  form: FormModelo;
  estado: EstadoVentaTpv,
  publicar: EmitirEvento;
}
// type Estado = "edicion" | "cambiando_cliente";

export const TabCliente = ({
  venta,
  form,
  estado,
  publicar = async () => {},
}: TabClienteProps) => {

    const { uiProps, editable } = form;

    return (
        <div className="TabCliente">
            <quimera-formulario>
            <CompAgenteTpv 
                {...uiProps("idAgente", "agente")}
                nombre="tpv_venta_agente_id"
            />
            <Cliente {...uiProps("cliente_id", "nombre_cliente")} />
            <QInput {...uiProps("id_fiscal")} label="ID Fiscal" />
            <div id="cambiar_cliente" className="botones maestro-botones">
                <QBoton
                deshabilitado={!editable}
                onClick={() => publicar("cambio_cliente_solicitado")}
                >
                C
                </QBoton>
            </div>

            <DirCliente
                clienteId={venta.cliente_id}
                {...uiProps("direccion_id")}
            />
            </quimera-formulario>

            {/* <QModal
                nombre="modal"
                abierto={estado === "CAMBIANDO_CLIENTE"}
                onCerrar={() => publicar("cambio_cliente_cancelado")}
            > */}
            {
            estado === "CAMBIANDO_CLIENTE" &&
                <CambiarCliente
                    venta={venta}
                    publicar={publicar}
                />
            }
            {/* </QModal> */}
        </div>
    );
};
