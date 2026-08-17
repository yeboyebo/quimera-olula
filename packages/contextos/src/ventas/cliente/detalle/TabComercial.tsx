import { Agente } from "#/ventas/comun/componentes/agente.tsx";
import { Divisa } from "#/ventas/comun/componentes/divisa.tsx";
import { FormaPago } from "#/ventas/comun/componentes/formapago.tsx";
import { RegimenIva } from "#/ventas/comun/componentes/regimen_iva.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { ProcesarEvento } from "@olula/lib/useMaquina.js";
import { HookModelo } from "@olula/lib/useModelo.ts";
import { Cliente } from "../diseño.ts";
import "./TabComercial.css";

interface TabComercialProps {
  form: HookModelo<Cliente>;
  cliente: Cliente;
  emitirCliente: ProcesarEvento;
}

export const TabComercial = ({ form }: TabComercialProps) => {
  const { uiProps } = form;

  return (
    <div className="TabComercial">
      <quimera-formulario>
        <Agente
          {...uiProps("agente_id", "nombre_agente")}
          nombre="cliente/agente_id"
        />
        <QInput
          label="Serie"
          {...uiProps("serie_id")}
          nombre="cliente/serie_id"
        />
        <Divisa {...uiProps("divisa_id")} nombre="cliente/divisa_id" />
        <FormaPago
          {...uiProps("forma_pago_id", "nombre_forma_pago")}
          nombre="cliente/forma_pago_id"
        />
        <RegimenIva
          {...uiProps("regimen_iva")}
          nombre="cliente/regimen_iva"
        />
      </quimera-formulario>
    </div>
  );
};
