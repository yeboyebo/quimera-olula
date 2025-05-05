import { QInput } from "../../../../componentes/atomos/qinput.tsx";
import { HookModelo } from "../../../comun/useModelo.ts";
import { Agente } from "../../comun/componentes/agente.tsx";
import { Divisa } from "../../comun/componentes/divisa.tsx";
import { FormaPago } from "../../comun/componentes/formapago.tsx";
import { GrupoIvaNegocio } from "../../comun/componentes/grupo_iva_negocio.tsx";
import { Cliente } from "../diseño.ts";
import "./TabComercial.css";

interface TabComercialProps {
  // getProps: (campo: string) => Record<string, unknown>;
  // setCampo: (campo: string) => (valor: unknown) => void;
  // dispatch: (action: Accion<Cliente>) => void;
  cliente: HookModelo<Cliente>;
  onEntidadActualizada: (entidad: Cliente) => void;
}

export const TabComercial = ({
  // getProps,
  // setCampo,
  // dispatch,
  cliente,
  // onEntidadActualizada,
}: TabComercialProps) => {

  const { uiProps } = cliente;

  // const onGuardarClicked = async () => {
  //   await patchCliente(modelo.id, modelo);
  //   const clienteGuardado = await getCliente(modelo.id);
  //   // dispatch({ type: "init", payload: { entidad: clienteGuardado } });
  //   init(clienteGuardado);
  //   onEntidadActualizada(modelo);
  // };

  // const onAgenteChange = async (
  //   agenteId: { valor: string; descripcion: string } | null
  // ) => {
  //   if (!agenteId) return;

  //   setCampo("agente_id")(agenteId.valor);
  // };

  return (
    <>
      <quimera-formulario>
        <Agente
          {...uiProps("agente_id", "nombre_agente")}
          nombre='cliente/agente_id'
        />
        <div id="span3"/>
        <Divisa
          {...uiProps("divisa_id")}
          nombre='cliente/divisa_id'
        />
        <QInput
          label="Serie"
          {...uiProps("serie_id")}
          nombre='cliente/serie_id'
        />
        <FormaPago
          {...uiProps("forma_pago_id", "nombre_forma_pago")}
          nombre='cliente/forma_pago_id'
        />
        <GrupoIvaNegocio
          label='Grupo IVA'
          {...uiProps("grupo_iva_negocio_id")}
          nombre='cliente/grupo_iva_negocio_id'
        />
      </quimera-formulario>
    </>
  );
};
