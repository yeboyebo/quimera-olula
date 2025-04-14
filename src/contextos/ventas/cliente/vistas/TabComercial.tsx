import { useState } from "react";
import { QBoton } from "../../../../componentes/atomos/qboton.tsx";
import { QInput } from "../../../../componentes/atomos/qinput.tsx";
import { QAutocompletar } from "../../../../componentes/moleculas/qautocompletar.tsx";
import {
  Accion,
  entidadModificada,
  EstadoObjetoValor,
  puedoGuardarObjetoValor,
} from "../../../comun/dominio.ts";
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
  const [_, setGuardando] = useState<boolean>(false);

  const onGuardarClicked = async () => {
    setGuardando(true);
    await patchCliente(cliente.valor.id, cliente.valor);
    const cliente_guardado = await getCliente(cliente.valor.id);
    dispatch({ type: "init", payload: { entidad: cliente_guardado } });
    setGuardando(false);
    onEntidadActualizada(cliente.valor);
  };

  const onAgenteChange = async (
    agenteId: { valor: string; descripcion: string } | null
  ) => {
    if (!agenteId) return;

    setCampo("agente_id")(agenteId.valor);
  };

  const obtenerOpcionesAgente = async () => [
    { valor: "1", descripcion: "Antonio 1" },
    { valor: "2", descripcion: "Juanma 2" },
    { valor: "3", descripcion: "Pozu 3" },
  ];

  return (
    <>
      <quimera-formulario>
        <QAutocompletar
          label="Agente"
          nombre="agente_id"
          onBlur={onAgenteChange}
          obtenerOpciones={obtenerOpcionesAgente}
          {...getProps("agente_id")}
        />
        <QInput
          nombre="nombre_agente"
          label="Nombre"
          {...getProps("nombre_agente")}
        />
        <QInput
          nombre="divisa_id"
          label="Divisa"
          onChange={setCampo("divisa_id")}
          {...getProps("divisa_id")}
        />
        <QInput
          nombre="serie_id"
          label="Serie"
          onChange={setCampo("serie_id")}
          {...getProps("serie_id")}
        />
        <QInput
          nombre="forma_pago_id"
          label="Forma de Pago"
          onChange={setCampo("forma_pago_id")}
          {...getProps("forma_pago_id")}
        />
        <QInput
          nombre="grupo_iva_negocio_id"
          label="Grupo IVA Negocio"
          onChange={setCampo("grupo_iva_negocio_id")}
          {...getProps("grupo_iva_negocio_id")}
        />
        {/* <QInput
            nombre="copiasfactura"
            label="Copias Factura"
            onChange={setCampo("copiasfactura")}
            {...getProps("copiasfactura")}
          /> */}
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
