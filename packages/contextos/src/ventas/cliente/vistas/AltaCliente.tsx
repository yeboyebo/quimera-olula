import { Agente } from "#/ventas/comun/componentes/agente.tsx";
import { TipoIdFiscal } from "#/ventas/comun/componentes/tipoIdFiscal.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useContext } from "react";
import { metaNuevoCliente, nuevoClienteVacio } from "../dominio.ts";
import { getCliente, postCliente } from "../infraestructura.ts";
import "./AltaCliente.css";

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
    emitir("cliente_creado", clienteCreado);
  };

  return (
    <div className="AltaCliente">
      <h2>Nuevo Cliente</h2>
      <quimera-formulario>
        <QInput
          label="Nombre"
          autoSeleccion={true}
          {...nuevoCliente.uiProps("nombre")}
        />
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
          onClick={() => emitir("alta_cancelada")}
        >
          Cancelar
        </QBoton>
      </div>
    </div>
  );
};
