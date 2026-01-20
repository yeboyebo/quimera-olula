import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QDate } from "@olula/componentes/atomos/qdate.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useContext } from "react";
import { Cliente } from "../diseño.ts";
import { darDeBajaCliente } from "../infraestructura.ts";
import "./BajaCliente.css";
import { metaDarDeBaja } from "./dominio.ts";

interface BajaClienteProps {
  cliente: Cliente;
  publicar?: EmitirEvento;
  onCancelar?: () => void;
}

export const BajaCliente = ({
  cliente,
  publicar = () => {},
  onCancelar = () => {},
}: BajaClienteProps) => {
  const bajaCliente = useModelo(metaDarDeBaja, { fecha_baja: null });
  const { intentar } = useContext(ContextoError);

  const { modelo, valido, uiProps } = bajaCliente;

  const guardar = async () => {
    if (modelo.fecha_baja === null) return;
    await intentar(() =>
      darDeBajaCliente(cliente.id, modelo.fecha_baja as Date)
    );
    publicar("cliente_dado_de_baja", {
      clienteId: cliente.id,
      fecha_baja: modelo.fecha_baja,
    });
    onCancelar();
  };

  return (
    <div className="BajaCliente">
      <quimera-formulario>
        <QDate label="Fecha Baja" {...uiProps("fecha_baja")} />
      </quimera-formulario>
      <div className="botones">
        <QBoton onClick={guardar} deshabilitado={!valido}>
          Guardar
        </QBoton>
        <QBoton tipo="reset" variante="texto" onClick={onCancelar}>
          Cancelar
        </QBoton>
      </div>
    </div>
  );
};
