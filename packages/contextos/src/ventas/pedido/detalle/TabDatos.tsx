import { Agente } from "#/ventas/comun/componentes/agente.tsx";
import { Divisa } from "#/ventas/comun/componentes/divisa.tsx";
import { FormaPago } from "#/ventas/comun/componentes/formapago.tsx";
import { RegimenIva } from "#/ventas/comun/componentes/regimen_iva.tsx";
import { puedeCambiarDivisa } from "#/ventas/venta/dominio.ts";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QDate } from "@olula/componentes/atomos/qdate.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { HookModelo } from "@olula/lib/useModelo.ts";
import { EstadoPedido, Pedido } from "../diseño.ts";
import { editable } from "./detalle.ts";
import "./TabDatos.css";

export interface TabDatosProps {
  pedido: HookModelo<Pedido>;
  estado?: EstadoPedido;
  publicar?: (evento: string, payload?: unknown) => void;
}

export const TabDatosBase = ({
  pedido,
  estado,
  publicar = () => {},
}: TabDatosProps) => {
  const { uiProps, modelo } = pedido;
  const mostrarBotonesCambio = estado === "ABIERTO" && editable(modelo);

  return (
    <div className="TabDatos">
      <quimera-formulario>
        <QDate label="Fecha" {...uiProps("fecha")} />
        <Divisa {...uiProps("divisa_id")} />
        <QInput label="T. Conversión" {...uiProps("tasa_conversion")} />
        {mostrarBotonesCambio && (
          <div className="TabDatos-accion">
            <QBoton
              onClick={() => publicar("cambio_divisa_solicitado")}
              deshabilitado={!puedeCambiarDivisa(modelo)}
            >
              Cambiar Divisa
            </QBoton>
          </div>
        )}
        <Agente {...uiProps("agente_id", "nombre_agente")} />
        <QInput label="% Comisión" {...uiProps("por_comision")} />
        {mostrarBotonesCambio && (
          <div className="TabDatos-accion">
            <QBoton onClick={() => publicar("cambio_agente_solicitado")}>
              Cambiar Agente
            </QBoton>
          </div>
        )}
        <FormaPago {...uiProps("forma_pago_id", "nombre_forma_pago")} />
        <RegimenIva {...uiProps("regimen_iva")} />
      </quimera-formulario>
    </div>
  );
};
