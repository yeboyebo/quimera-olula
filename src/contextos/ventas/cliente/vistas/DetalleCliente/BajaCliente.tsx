import { useContext } from "react";
import { QBoton } from "../../../../../componentes/atomos/qboton.tsx";
import { QDate } from "../../../../../componentes/atomos/qdate.tsx";
import { ContextoError } from "../../../../comun/contexto.ts";

import { HookModelo, useModelo } from "../../../../comun/useModelo.ts";
import { Cliente } from "../../diseño.ts";
import { metaDarDeBaja } from "../../dominio.ts";
import { darDeBajaCliente } from "../../infraestructura.ts";
import "./BajaCliente.css";

type BajaCliente = {
  fecha_baja: string;
};

interface BajaClienteProps {
  cliente: HookModelo<Cliente>;
  onBajaRealizada: () => void;
}

export const BajaCliente = ({ cliente, onBajaRealizada }: BajaClienteProps) => {
  const bajaCliente = useModelo(metaDarDeBaja, { fecha_baja: "" });
  const { intentar } = useContext(ContextoError);

  const { modelo, valido, uiProps } = bajaCliente;

  const onGuardarClicked = async () => {
    await intentar(() =>
      darDeBajaCliente(cliente.modelo.id, modelo.fecha_baja)
    );
    onBajaRealizada();
  };

  return (
    <div className="BajaCliente">
      <quimera-formulario>
        <QDate label="Fecha Baja" {...uiProps("fecha_baja")} />
      </quimera-formulario>
      <div className="botones">
        <QBoton onClick={onGuardarClicked} deshabilitado={!valido}>
          Guardar
        </QBoton>
      </div>
    </div>
  );
};
