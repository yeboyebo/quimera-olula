import { useReducer } from "react";
import { QBoton } from "../../../../componentes/atomos/qboton.tsx";
import { QDate } from "../../../../componentes/atomos/qdate.tsx";
import {
    campoModeloAInput,
    EstadoModelo,
    initEstadoModelo,
    makeReductor,
    modeloEsValido,
} from "../../../comun/dominio.ts";

import { Cliente } from "../diseño.ts";
import { metaDarDeBaja } from "../dominio.ts";
import { darDeBajaCliente } from "../infraestructura.ts";

interface BajaClienteProps {
  cliente: EstadoModelo<Cliente>;
  onBajaRealizada: () => void;
}

export const BajaCliente = ({ cliente, onBajaRealizada }: BajaClienteProps) => {
  const onGuardarClicked = async () => {
    await darDeBajaCliente(cliente.valor.id, estado.valor.fecha_baja);
    onBajaRealizada();
  };

  const [estado, dispatch] = useReducer(
    makeReductor(metaDarDeBaja),
    initEstadoModelo({ fecha_baja: "" }, metaDarDeBaja)
  );

  const setCampo = (campo: string) => (valor: string) => {
    dispatch({
      type: "set_campo",
      payload: { campo, valor },
    });
  };

  const getProps = (campo: string) => {
    return campoModeloAInput(estado, campo);
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
          deshabilitado={!modeloEsValido(estado)}
        >
          Guardar
        </QBoton>
      </div>
    </>
  );
};
