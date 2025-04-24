import { QBoton } from "../../../../componentes/atomos/qboton.tsx";
import { QDate } from "../../../../componentes/atomos/qdate.tsx";
import { QInput } from "../../../../componentes/atomos/qinput.tsx";
import {
  Accion,
  entidadModificada,
  EstadoObjetoValor,
  puedoGuardarObjetoValor,
} from "../../../comun/dominio.ts";
import { IdFiscal } from "../../comun/componentes/idfiscal.tsx";
import { Cliente } from "../diseño.ts";
import { getCliente, patchCliente } from "../infraestructura.ts";
import "./TabGeneral.css";

interface TabGeneralProps {
  getProps: (campo: string) => Record<string, unknown>;
  setCampo: (campo: string) => (valor: unknown) => void;
  cliente: EstadoObjetoValor<Cliente>;
  dispatch: (action: Accion<Cliente>) => void;
  onEntidadActualizada: (entidad: Cliente) => void;
}

export const TabGeneral = ({
  getProps,
  setCampo,
  cliente,
  dispatch,
  onEntidadActualizada,
}: TabGeneralProps) => {
  const onGuardarClicked = async () => {
    await patchCliente(cliente.valor.id, cliente.valor);
    const cliente_guardado = await getCliente(cliente.valor.id);
    dispatch({ type: "init", payload: { entidad: cliente_guardado } });
    onEntidadActualizada(cliente.valor);
  };

  return (
    <>
      <quimera-formulario>
        <QInput
          nombre="nombre"
          label="Nombre"
          onChange={setCampo("nombre")}
          {...getProps("nombre")}
        />
        <QInput
          nombre="nombre_comercial"
          label="Nombre Comercial"
          onChange={setCampo("nombre_comercial")}
          {...getProps("nombre_comercial")}
        />
        <IdFiscal
          valor={cliente.valor.tipo_id_fiscal}
          onChange={(opcion) => setCampo("tipo_id_fiscal")(opcion?.valor ?? "")}
          getProps={getProps}
        />
        <QInput
          nombre="id_fiscal"
          label="Id Fiscal"
          onChange={setCampo("id_fiscal")}
          {...getProps("id_fiscal")}
        />
        <QInput
          nombre="telefono1"
          label="Teléfono 1"
          onChange={setCampo("telefono1")}
          {...getProps("telefono1")}
        />
        <QInput
          nombre="telefono2"
          label="Teléfono 2"
          onChange={setCampo("telefono2")}
          {...getProps("telefono2")}
        />
        <QInput
          nombre="email"
          label="Email"
          onChange={setCampo("email")}
          {...getProps("email")}
        />
        <QInput
          nombre="web"
          label="Web"
          onChange={setCampo("web")}
          {...getProps("web")}
        />
        <QInput
          nombre="observaciones"
          label="Observaciones"
          onChange={setCampo("observaciones")}
          {...getProps("observaciones")}
        />
        <QDate
          nombre="fecha_baja"
          label="Fecha Baja"
          onChange={setCampo("fecha_baja")}
          {...getProps("fecha_baja")}
        />
      </quimera-formulario>
      <div className="botones maestro-botones ">
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
