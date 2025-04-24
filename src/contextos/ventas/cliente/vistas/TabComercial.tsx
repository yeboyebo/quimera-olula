import { QBoton } from "../../../../componentes/atomos/qboton.tsx";
import { QInput } from "../../../../componentes/atomos/qinput.tsx";
import {
  Accion,
  entidadModificada,
  EstadoObjetoValor,
  puedoGuardarObjetoValor,
} from "../../../comun/dominio.ts";
import { Agentes } from "../../comun/componentes/agente.tsx";
import { Divisas } from "../../comun/componentes/divisa.tsx";
import { FormaPago } from "../../comun/componentes/formapago.tsx";
import { Cliente } from "../diseño.ts";
import { getCliente, patchCliente } from "../infraestructura.ts";
import "./TabComercial.css";

interface TabComercialProps {
  getProps: (campo: string) => Record<string, unknown>;
  setCampo: (campo: string) => (valor: unknown) => void;
  cliente: EstadoObjetoValor<Cliente>;
  dispatch: (action: Accion<Cliente>) => void;
  onEntidadActualizada: (entidad: Cliente) => void;
}

export const TabComercial = ({
  getProps,
  setCampo,
  cliente,
  dispatch,
  onEntidadActualizada,
}: TabComercialProps) => {
  const onGuardarClicked = async () => {
    await patchCliente(cliente.valor.id, cliente.valor);
    const clienteGuardado = await getCliente(cliente.valor.id);
    dispatch({ type: "init", payload: { entidad: clienteGuardado } });
    onEntidadActualizada(cliente.valor);
  };

  const onAgenteChange = async (
    agenteId: { valor: string; descripcion: string } | null
  ) => {
    if (!agenteId) return;

    setCampo("agente_id")(agenteId.valor);
  };

  return (
    <>
      <quimera-formulario>
        <Agentes
          agente_id={cliente.valor.agente_id ?? ""}
          onAgenteChanged={onAgenteChange}
        />
        <Divisas
          valor={cliente.valor.divisa_id}
          onChange={(opcion) => setCampo("divisa_id")(opcion?.valor)}
          getProps={getProps}
        />
        <QInput
          nombre="serie_id"
          label="Serie"
          onChange={setCampo("serie_id")}
          {...getProps("serie_id")}
        />
        <FormaPago
          forma_pago_id={cliente.valor.forma_pago_id}
          forma_pago={cliente.valor.forma_pago}
          onChange={(opcion) => setCampo("forma_pago_id")(opcion?.valor)}
          getProps={getProps}
        />
        <QInput
          nombre="grupo_iva_negocio_id"
          label="Grupo IVA Negocio"
          onChange={setCampo("grupo_iva_negocio_id")}
          {...getProps("grupo_iva_negocio_id")}
        />
      </quimera-formulario>
      <div className="botones">
        <QBoton
          onClick={onGuardarClicked}
          deshabilitado={!puedoGuardarObjetoValor(cliente)}
        >
          Guardar
        </QBoton>
        <QBoton
          tipo="reset"
          variante="texto"
          onClick={() => {
            dispatch({
              type: "init",
              payload: { entidad: cliente.valor_inicial },
            });
          }}
          deshabilitado={!entidadModificada(cliente)}
        >
          Cancelar
        </QBoton>
      </div>
    </>
  );
};
