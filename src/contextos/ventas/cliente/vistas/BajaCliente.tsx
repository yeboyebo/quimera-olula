import { QBoton } from "../../../../componentes/atomos/qboton.tsx";
import { QDate } from "../../../../componentes/atomos/qdate.tsx";
import {
  MetaModelo
} from "../../../comun/dominio.ts";

import { HookModelo, useModelo } from "../../../comun/useModelo.ts";
import { Cliente } from "../diseño.ts";
import { darDeBajaCliente } from "../infraestructura.ts";

type BajaCliente = {
  fecha_baja: string;
};

interface BajaClienteProps {
  cliente: HookModelo<Cliente>;
  onBajaRealizada: () => void;
}

export const metaBajaCliente: MetaModelo<BajaCliente> = {
    // validador: makeValidadorCliente(validacionesCliente),
    campos: {
        fecha_baja: { requerido: true },
        // id_fiscal: {
        //     requerido: true,
        //     validacion: (cliente: Cliente) => idFiscalValido(cliente.tipo_id_fiscal)(cliente.id_fiscal),
        // },
        // tipo_id_fiscal: {
        //     requerido: true,
        //     validacion: (cliente: Cliente) => tipoIdFiscalValido(cliente.tipo_id_fiscal),
        // },
        // nombre_agente: { bloqueado: true },
    }
};

export const BajaCliente = ({ cliente, onBajaRealizada }: BajaClienteProps) => {

  // const { modelo, init } = cliente;

  // const [estado, dispatch] = useReducer(
  //   makeReductor(metaDarDeBaja),
  //   initEstadoModelo({ fecha_baja: "" }, metaDarDeBaja)
  // );
  const bajaCliente = useModelo(
    metaBajaCliente,
    { fecha_baja: "" }
  )

  const { modelo, valido, uiProps } = bajaCliente;

  const onGuardarClicked = async () => {
    await darDeBajaCliente(cliente.modelo.id, modelo.fecha_baja);
    onBajaRealizada();
  };


  // const setCampo = (campo: string) => (valor: string) => {
  //   dispatch({
  //     type: "set_campo",
  //     payload: { campo, valor },
  //   });
  // };

  // const getProps = (campo: string) => {
  //   return campoModeloAInput(estado, campo);
  // };

  return (
    <>
      <quimera-formulario>
        <QDate
          label="Fecha Baja"
          { ...uiProps("fecha_baja") }
        />
      </quimera-formulario>
      <div className="botones">
        <QBoton
          onClick={onGuardarClicked}
          deshabilitado={!valido}
        >
          Guardar
        </QBoton>
      </div>
    </>
  );
};
