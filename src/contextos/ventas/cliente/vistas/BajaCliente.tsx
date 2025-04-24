import { useReducer } from "react";
import { QBoton } from "../../../../componentes/atomos/qboton.tsx";
import { QDate } from "../../../../componentes/atomos/qdate.tsx";
import {
  campoObjetoValorAInput,
  EstadoObjetoValor,
  initEstadoObjetoValor,
  makeReductor,
  puedoGuardarObjetoValor,
} from "../../../comun/dominio.ts";

import { Cliente } from "../diseño.ts";
import { metaDarDeBaja } from "../dominio.ts";
import { darDeBajaCliente } from "../infraestructura.ts";

interface BajaClienteProps {
  cliente: EstadoObjetoValor<Cliente>;
  onBajaRealizada: () => void;
}

export const BajaCliente = ({ cliente, onBajaRealizada }: BajaClienteProps) => {
  const onGuardarClicked = async () => {
    await darDeBajaCliente(cliente.valor.id, estado.valor.fecha_baja);
    onBajaRealizada();
  };

  const [estado, dispatch] = useReducer(
    makeReductor(metaDarDeBaja),
    initEstadoObjetoValor({ fecha_baja: "" }, metaDarDeBaja)
  );

  const setCampo = (campo: string) => (valor: string) => {
    dispatch({
      type: "set_campo",
      payload: { campo, valor },
    });
  };

  const getProps = (campo: string) => {
    return campoObjetoValorAInput(estado, campo);
  };

  return (
    <>
      <quimera-formulario>
        <QDate
          label="Fecha Baja"
          onChange={setCampo("fecha_baja")}
          {...getProps("fecha_baja")}
        />
      </quimera-formulario>
      <div className="botones">
        <QBoton
          onClick={onGuardarClicked}
          deshabilitado={!puedoGuardarObjetoValor(estado)}
        >
          Guardar
        </QBoton>
      </div>
    </>
  );
};
