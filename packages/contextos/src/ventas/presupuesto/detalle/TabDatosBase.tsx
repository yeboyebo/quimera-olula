import { Almacen } from "#/almacen/comun/componentes/Almacen.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QDate } from "@olula/componentes/atomos/qdate.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { HookModelo } from "@olula/lib/useModelo.ts";
import { Agente } from "../../comun/componentes/agente.tsx";
import { Divisa } from "../../comun/componentes/divisa.tsx";
import { FormaPago } from "../../comun/componentes/formapago.tsx";
import { RegimenIva } from "../../comun/componentes/regimen_iva.tsx";
import { puedeCambiarDivisa } from "../../venta/dominio.ts";
import { Presupuesto } from "../diseño.ts";
import { EstadoPresupuesto } from "./diseño.ts";
import "./TabDatos.css";

export interface TabDatosProps {
  presupuesto: HookModelo<Presupuesto>;
  estado?: EstadoPresupuesto;
  publicar?: (evento: string, payload?: unknown) => void;
}

export const TabDatosBase = ({
  presupuesto,
  estado,
  publicar = () => {},
}: TabDatosProps) => {
  const { uiProps, modelo } = presupuesto;
  const mostrarBotonesCambio = estado === "ABIERTO" && !modelo.aprobado;

  return (
    <div className="TabDatos">
      <quimera-formulario>
        <QDate label="Fecha" {...uiProps("fecha")} />
        <QDate label="Fecha salida" {...uiProps("fecha_salida")} />
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
        <Almacen {...uiProps("almacen_id")} />
        <FormaPago {...uiProps("forma_pago_id", "nombre_forma_pago")} />
        <RegimenIva {...uiProps("regimen_iva")} />
      </quimera-formulario>
    </div>
  );
};
