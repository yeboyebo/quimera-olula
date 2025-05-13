import { QBoton } from "../../../../../componentes/atomos/qboton.tsx";
import { QDate } from "../../../../../componentes/atomos/qdate.tsx";
import { MetaModelo } from "../../../../comun/dominio.ts";

import { HookModelo, useModelo } from "../../../../comun/useModelo.ts";
import { Cliente } from "../../diseño.ts";
import { darDeBajaCliente } from "../../infraestructura.ts";

type BajaCliente = {
  fecha_baja: string;
};

interface BajaClienteProps {
  cliente: HookModelo<Cliente>;
  onBajaRealizada: () => void;
}

const metaBajaCliente: MetaModelo<BajaCliente> = {
  campos: {
    fecha_baja: { requerido: true },
  },
};

export const BajaCliente = ({ cliente, onBajaRealizada }: BajaClienteProps) => {
  const bajaCliente = useModelo(metaBajaCliente, { fecha_baja: "" });

  const { modelo, valido, uiProps } = bajaCliente;

  const onGuardarClicked = async () => {
    await darDeBajaCliente(cliente.modelo.id, modelo.fecha_baja);
    onBajaRealizada();
  };

  return (
    <>
      <quimera-formulario>
        <QDate label="Fecha Baja" {...uiProps("fecha_baja")} />
      </quimera-formulario>
      <div className="botones">
        <QBoton onClick={onGuardarClicked} deshabilitado={!valido}>
          Guardar
        </QBoton>
      </div>
    </>
  );
};
