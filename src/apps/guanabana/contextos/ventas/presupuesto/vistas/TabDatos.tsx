import { QDate } from "../../../../../../componentes/atomos/qdate.tsx";
import { QInput } from "../../../../../../componentes/atomos/qinput.tsx";
import { HookModelo } from "../../../../../../contextos/comun/useModelo.ts";
import { Agente } from "../../../../../../contextos/ventas/comun/componentes/agente.tsx";
import { Divisa } from "../../../../../../contextos/ventas/comun/componentes/divisa.tsx";
import { FormaPago } from "../../../../../../contextos/ventas/comun/componentes/formapago.tsx";
import { GrupoIvaNegocio } from "../../../../../../contextos/ventas/comun/componentes/grupo_iva_negocio.tsx";
import { Presupuesto } from "../../../../../../contextos/ventas/presupuesto/diseño.ts";


import "../../../../../../contextos/ventas/presupuesto/vistas/TabDatos.css";

interface TabDatosProps {
  ctxPresupuesto: HookModelo<Presupuesto>; 
  onEntidadActualizada: (entidad: Presupuesto) => void;
}

export const TabDatosGua = ({
  ctxPresupuesto,
}: TabDatosProps) => {

  const {uiProps} = ctxPresupuesto;

  return (
    <>
      <quimera-formulario>
        {'Guanabana!!!'}
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
          // label='Grupo IVA'
          {...uiProps("grupo_iva_negocio_id")}
        />
      </quimera-formulario>
      
    </>
  );
};
