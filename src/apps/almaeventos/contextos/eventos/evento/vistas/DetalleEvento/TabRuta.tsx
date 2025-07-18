import { QInput } from "../../../../../../../componentes/atomos/qinput.tsx";
import { HookModelo } from "../../../../../../../contextos/comun/useModelo.ts";
import { Evento } from "../../diseño.ts";
import "./TabRuta.css";

interface TabRutaProps {
  evento: HookModelo<Evento>;
  // emitirEvento: EmitirEvento;
}

export const TabRuta = ({ evento }: TabRutaProps) => {
  const { uiProps } = evento;

  return (
    <div className="TabRuta">   
      <quimera-formulario>
        {/* <Agente
          {...uiProps("agente_id", "nombre_agente")}
          nombre="evento/agente_id"
        /> */}
        {/* <div id="span3" /> */}
        {/* <Divisa {...uiProps("divisa_id")} nombre="evento/divisa_id" /> */}
        <QInput
          label="Serie"
          {...uiProps("serie_id")}
          nombre="evento/serie_id"
        />
        {/* <FormaPago
          {...uiProps("forma_pago_id", "nombre_forma_pago")}
          nombre="evento/forma_pago_id"
        />
        <GrupoIvaNegocio
          label="Grupo IVA"
          {...uiProps("grupo_iva_negocio_id")}
          nombre="evento/grupo_iva_negocio_id"
        /> */}
      </quimera-formulario>
    </div>
  );
};
