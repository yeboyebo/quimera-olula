import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QDate } from "@olula/componentes/atomos/qdate.tsx";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { HookModelo, useModelo } from "@olula/lib/useModelo.ts";
import { Cliente } from "../../diseño.ts";
import { metaDarDeBaja } from "../../dominio.ts";
import "./BajaCliente.css";

type BajaCliente = {
  fecha_baja: string;
};

interface BajaClienteProps {
  cliente: HookModelo<Cliente>;
  emitirCliente: EmitirEvento;
}

export const BajaCliente = ({ emitirCliente }: BajaClienteProps) => {
  const bajaCliente = useModelo(metaDarDeBaja, { fecha_baja: "" });

  const { modelo, valido, uiProps } = bajaCliente;

  const onGuardarClicked = async () => {
    emitirCliente("dar_de_baja_solicitado", modelo.fecha_baja);
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
