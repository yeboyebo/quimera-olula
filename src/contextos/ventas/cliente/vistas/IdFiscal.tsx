import { useEffect, useState } from "react";
import { Input } from "../../../../componentes/detalle/FormularioGenerico";
import {
  guardar,
  idFiscalValido,
  idFiscalValidoGeneral,
  tipoIdFiscalValido,
} from "../dominio.ts";

import { Cliente } from "../diseño.ts";
import { camposCliente } from "../infraestructura.ts";
interface IdFiscalProps {
  cliente: Cliente;
  onIdFiscalCambiadoCallback: (idFiscal: IdFiscal) => void;
}

interface IdFiscal {
  id_fiscal: string;
  tipo_id_fiscal: string;
}

export const IdFiscal = ({
  cliente,
  onIdFiscalCambiadoCallback,
}: IdFiscalProps) => {
  const [modoLectura, setModoLectura] = useState(true);

  useEffect(() => {
    setModoLectura(true);
  }, [cliente]);

  return modoLectura ? (
    <IdFiscalLectura
      cliente={cliente}
      onEditarCallback={() => setModoLectura(false)}
    />
  ) : (
    <IdFiscalEdicion
      cliente={cliente}
      onIdFiscalCambiadoCallback={onIdFiscalCambiadoCallback}
      canceladoCallback={() => setModoLectura(true)}
    />
  );
};

const IdFiscalLectura = ({
  cliente,
  onEditarCallback,
}: {
  cliente: Cliente;
  onEditarCallback: () => void;
}) => {
  return (
    <>
      <label>
        {cliente.tipo_id_fiscal}: {cliente.id_fiscal}
      </label>
      <button onClick={onEditarCallback}>Editar</button>
    </>
  );
};

const IdFiscalEdicion = ({
  cliente,
  onIdFiscalCambiadoCallback,
  canceladoCallback,
}: {
  cliente: Cliente;
  onIdFiscalCambiadoCallback: (idFiscal: IdFiscal) => void;
  canceladoCallback: () => void;
}) => {
  const [idFiscal, setIdFiscal] = useState<IdFiscal>({
    id_fiscal: cliente.id_fiscal,
    tipo_id_fiscal: cliente.tipo_id_fiscal,
  });

  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    setIdFiscal({
      id_fiscal: cliente.id_fiscal,
      tipo_id_fiscal: cliente.tipo_id_fiscal,
    });
  }, [cliente]);

  const onIdFiscalCambiado = (campo: string, valor: string) => {
    const idFiscalNuevo = {
      ...idFiscal,
      [campo]: valor,
    };
    setIdFiscal(idFiscalNuevo);
  };

  const guardarIdFiscalClicked = async () => {
    setGuardando(true);
    await guardar(cliente.id, {
      id_fiscal: idFiscal.id_fiscal,
      tipo_id_fiscal: idFiscal.tipo_id_fiscal,
    });
    setGuardando(false);
    onIdFiscalCambiadoCallback(idFiscal);
  };

  return (
    <>
      <Input
        controlado
        campo={camposCliente.tipo_id_fiscal}
        onCampoCambiado={onIdFiscalCambiado}
        valorEntidad={idFiscal.tipo_id_fiscal}
        validador={tipoIdFiscalValido}
      />
      <Input
        controlado
        campo={camposCliente.id_fiscal}
        onCampoCambiado={onIdFiscalCambiado}
        valorEntidad={idFiscal.id_fiscal}
        validador={idFiscalValido(idFiscal.tipo_id_fiscal)}
      />

      <button
        disabled={
          guardando ||
          !idFiscalValidoGeneral(idFiscal.tipo_id_fiscal, idFiscal.id_fiscal)
        }
        onClick={guardarIdFiscalClicked}
      >
        {guardando ? "Guardando" : "Guardar"}
      </button>
      <button onClick={canceladoCallback}>Cancelar</button>
    </>
  );
};
