import { useContext } from "react";
import { QBoton } from "../../../../componentes/atomos/qboton.tsx";
import { QInput } from "../../../../componentes/atomos/qinput.tsx";
import { ContextoError } from "../../../comun/contexto.ts";
import { EmitirEvento } from "../../../comun/diseño.ts";
import { useModelo } from "../../../comun/useModelo.ts";
import { Agente } from "../../comun/componentes/agente.tsx";
import { TipoIdFiscal } from "../../comun/componentes/tipoIdFiscal.tsx";
import { metaNuevoCliente, nuevoClienteVacio } from "../dominio.ts";
import { getCliente, postCliente } from "../infraestructura.ts";

export const AltaCliente = ({
  emitir = () => {},
}: {
  emitir?: EmitirEvento;
}) => {
  const nuevoCliente = useModelo(metaNuevoCliente, nuevoClienteVacio);
  const { intentar } = useContext(ContextoError);

  const guardar = async () => {
    const id = await intentar(() => postCliente(nuevoCliente.modelo));
    nuevoCliente.init(nuevoClienteVacio);
    const clienteCreado = await getCliente(id);
    emitir("CLIENTE_CREADO", clienteCreado);
  };

  return (
    <>
      <h2>Nuevo Cliente</h2>
      <quimera-formulario>
        <QInput label="Nombre" {...nuevoCliente.uiProps("nombre")} />
        <TipoIdFiscal {...nuevoCliente.uiProps("tipo_id_fiscal")} />
        <QInput label="ID Fiscal" {...nuevoCliente.uiProps("id_fiscal")} />
        <QInput label="Empresa" {...nuevoCliente.uiProps("empresa_id")} />
        <Agente {...nuevoCliente.uiProps("agente_id", "nombre_agente")} />
      </quimera-formulario>
      <div className="botones">
        <QBoton onClick={guardar} deshabilitado={nuevoCliente.valido === false}>
          Guardar
        </QBoton>
        <QBoton
          tipo="reset"
          variante="texto"
          onClick={() => emitir("ALTA_CANCELADA")}
        >
          Cancelar
        </QBoton>
      </div>
    </>
  );
};
