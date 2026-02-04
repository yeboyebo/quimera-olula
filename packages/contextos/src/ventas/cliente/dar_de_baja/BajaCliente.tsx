import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QDate } from "@olula/componentes/atomos/qdate.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { ProcesarEvento } from "@olula/lib/useMaquina.js";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useContext, useMemo } from "react";
import { darDeBajaCliente } from "../infraestructura.ts";
import "./BajaCliente.css";
import { metaDarDeBaja } from "./dominio.ts";

interface BajaClienteProps {
  clienteId: string;
  publicar?: ProcesarEvento;
  onCancelar?: () => void;
}

export const BajaCliente = ({
  clienteId,
  publicar = async () => {},
  onCancelar = () => {},
}: BajaClienteProps) => {
  const modeloInicial = useMemo(() => ({ fecha_baja: null }), []);
  const bajaCliente = useModelo(metaDarDeBaja, modeloInicial);
  const { intentar } = useContext(ContextoError);

  const { modelo, valido, uiProps } = bajaCliente;

  const guardar = async () => {
    if (modelo.fecha_baja === null) return;
    await intentar(() =>
      darDeBajaCliente(clienteId, modelo.fecha_baja as Date)
    );
    publicar("cliente_dado_de_baja", {
      clienteId: clienteId,
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
