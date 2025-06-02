import { QInput } from "../../../../../componentes/atomos/qinput.tsx";
import { EmitirEvento } from "../../../../comun/diseño.ts";
import { HookModelo } from "../../../../comun/useModelo.ts";
import { Agente } from "../../../comun/componentes/agente.tsx";
import { Divisa } from "../../../comun/componentes/divisa.tsx";
import { FormaPago } from "../../../comun/componentes/formapago.tsx";
import { GrupoIvaNegocio } from "../../../comun/componentes/grupo_iva_negocio.tsx";
import { Cliente } from "../../diseño.ts";
import "./TabComercial.css";

interface TabComercialProps {
  cliente: HookModelo<Cliente>;
  emitirCliente: EmitirEvento;
}

export const TabComercial = ({ cliente }: TabComercialProps) => {
  const { uiProps } = cliente;

  return (
    <div className="TabComercial">
      <quimera-formulario>
        <Agente
          {...uiProps("agente_id", "nombre_agente")}
          nombre="cliente/agente_id"
        />
        <div id="span3" />
        <Divisa {...uiProps("divisa_id")} nombre="cliente/divisa_id" />
        <QInput
          label="Serie"
          {...uiProps("serie_id")}
          nombre="cliente/serie_id"
        />
        <FormaPago
          {...uiProps("forma_pago_id", "nombre_forma_pago")}
          nombre="cliente/forma_pago_id"
        />
        <GrupoIvaNegocio
          label="Grupo IVA"
          {...uiProps("grupo_iva_negocio_id")}
          nombre="cliente/grupo_iva_negocio_id"
        />
      </quimera-formulario>
    </div>
  );
};
