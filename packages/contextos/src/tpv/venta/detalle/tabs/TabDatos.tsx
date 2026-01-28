import { Agente } from "#/ventas/comun/componentes/agente.tsx";
import { Divisa } from "#/ventas/comun/componentes/divisa.tsx";
import { FormaPago } from "#/ventas/comun/componentes/formapago.tsx";
import { GrupoIvaNegocio } from "#/ventas/comun/componentes/grupo_iva_negocio.tsx";
import { QDate } from "@olula/componentes/atomos/qdate.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { FormModelo } from "@olula/lib/dominio.js";
import { VentaTpv } from "../../diseño.ts";
import "./TabDatos.css";

interface TabDatosProps {
    venta: VentaTpv;
    form: FormModelo;
}

export const TabDatos = ({ form }: TabDatosProps) => {
    
    const { uiProps } = form;

    return (
        <div className="TabDatos">

        <quimera-formulario>

            <QDate label="Fecha" {...uiProps("fecha")} />

            <div id="espacio_fecha" />

            <Divisa {...uiProps("divisa_id")} />
            
            <QInput label="T. Conversión" {...uiProps("tasa_conversion")} />
            
            <QInput {...uiProps("total_divisa_empresa")} label="Total €" />
            
            <Agente {...uiProps("agente_id", "nombre_agente")} />
            
            <div id="espacio_agente" />

            <FormaPago {...uiProps("forma_pago_id", "nombre_forma_pago")} />

            <GrupoIvaNegocio {...uiProps("grupo_iva_negocio_id")} />

        </quimera-formulario>

        </div>
    );
};
