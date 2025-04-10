import { useState } from "react";
import { QBoton } from "../../../../componentes/atomos/qboton.tsx";
import { QDate } from "../../../../componentes/atomos/qdate.tsx";
import { QInput } from "../../../../componentes/atomos/qinput.tsx";
import { QSelect } from "../../../../componentes/atomos/qselect.tsx";
import { QAutocompletar } from "../../../../componentes/moleculas/qautocompletar.tsx";
import {
  Accion,
  entidadModificada,
  EstadoObjetoValor,
  puedoGuardarObjetoValor,
} from "../../../comun/dominio.ts";
import { opcionesTipoIdFiscal } from "../../../valores/idfiscal.ts";
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
    agenteId: string,
    evento: React.ChangeEvent<HTMLElement>
  ) => {
    console.log("Agente cambiado", agenteId);
    console.log(evento);
    setCampo("agente_id")(agenteId);
    setCampo("nombre_agente")((evento.target as HTMLInputElement).value);
  };

  const obtenerOpcionesAgente = async () => [
    { valor: "1", descripcion: "Antonio 1" },
    { valor: "2", descripcion: "Juanma 2" },
    { valor: "3", descripcion: "Pozu 3" },
  ];

  return (
    <>
      <div className="formulario">
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
        <QSelect
          nombre="tipo_id_fiscal"
          label="Tipo Id Fiscal"
          opciones={opcionesTipoIdFiscal}
          onChange={setCampo("tipo_id_fiscal")}
          {...getProps("tipo_id_fiscal")}
        />
        <QInput
          nombre="id_fiscal"
          label="Id Fiscal"
          onChange={setCampo("id_fiscal")}
          {...getProps("id_fiscal")}
        />
        <div style={{ gridColumn: "span 8" }}></div>
        {/* <QInput
          nombre="agente_id"
          label="Agente"
          onChange={setCampo("agente_id")}
          {...getProps("agente_id")}
        /> */}
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
        <QDate
          nombre="fecha_baja"
          label="Fecha Baja"
          onChange={setCampo("fecha_baja")}
          {...getProps("fecha_baja")}
        />
      </div>
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
