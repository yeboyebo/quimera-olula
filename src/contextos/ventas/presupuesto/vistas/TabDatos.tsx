
import { appFactory } from "../../../app.ts";
import { HookModelo } from "../../../comun/useModelo.ts";
import { Presupuesto } from "../diseño.ts";
import "./TabDatos.css";

interface TabDatosProps {
  presupuesto: HookModelo<Presupuesto>; 
}

export const TabDatos = ({
  presupuesto,
}: TabDatosProps) => {
  return appFactory().PresupuestoTabDatos({
    presupuesto,
  })
};

// export const TabDatos = ({
//   ctxPresupuesto,
//   onEntidadActualizada,
// }: TabDatosProps) => {

//   const {uiProps} = ctxPresupuesto;

//   return (
//     <>
//       <quimera-formulario>
//         <QDate
//           label="Fecha"
//           {...uiProps("fecha")}
//         />
//         <div id="espacio_fecha"/>
//         <Divisa
//           {...uiProps("divisa_id")}
//         />
//         <QInput
//           tipo='numero'
//           label="T. Conversión"
//           {...uiProps("tasa_conversion")}
//         />
//         <QInput
//           tipo='numero'
//           {...uiProps("total_divisa_empresa")}
//           label="Total €"
//         />
//         <Agente
//           {...uiProps("agente_id", "nombre_agente")}
//         />
//         <div id="espacio_agente"/>
//         <FormaPago
//           {...uiProps("forma_pago_id", "nombre_forma_pago")}
//         />
//         <GrupoIvaNegocio
//           // label='Grupo IVA'
//           {...uiProps("grupo_iva_negocio_id")}
//         />
//       </quimera-formulario>
      
//     </>
//   );
// };
