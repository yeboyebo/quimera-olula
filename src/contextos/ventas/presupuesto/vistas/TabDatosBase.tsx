import { QDate } from "../../../../componentes/atomos/qdate.tsx";
import { QInput } from "../../../../componentes/atomos/qinput.tsx";

import { HookModelo } from "../../../comun/useModelo.ts";
import { Agente } from "../../comun/componentes/agente.tsx";
import { Divisa } from "../../comun/componentes/divisa.tsx";
import { FormaPago } from "../../comun/componentes/formapago.tsx";
import { GrupoIvaNegocio } from "../../comun/componentes/grupo_iva_negocio.tsx";
import { Presupuesto } from "../diseño.ts";
import "./TabDatos.css";

interface TabDatosProps {
  presupuesto: HookModelo<Presupuesto>; 
}

export const TabDatosBase = ({
  presupuesto,
}: TabDatosProps) => {

  const {uiProps} = presupuesto;

  return (
    <>
      <quimera-formulario>
        <QDate
          label="Fecha"
          {...uiProps("fecha")}
        />
        <div id="espacio_fecha"/>
        <Divisa
          {...uiProps("divisa_id")}
        />
        <QInput
          label="T. Conversión"
          {...uiProps("tasa_conversion")}
        />
        <QInput
          {...uiProps("total_divisa_empresa")}
          label="Total €"
        />
        <Agente
          {...uiProps("agente_id", "nombre_agente")}
        />
        <div id="espacio_agente"/>
        <FormaPago
          {...uiProps("forma_pago_id", "nombre_forma_pago")}
        />
        <GrupoIvaNegocio
          {...uiProps("grupo_iva_negocio_id")}
        />
      </quimera-formulario>
    </>
  );
};
