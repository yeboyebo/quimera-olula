import { Agente } from "#/ventas/comun/componentes/agente.tsx";
import { TipoIdFiscal } from "#/ventas/comun/componentes/tipoIdFiscal.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { Mostrar } from "@olula/componentes/index.js";
import { ContextoError } from "@olula/lib/contexto.ts";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useContext } from "react";
import { metaNuevoCliente, nuevoClienteVacio } from "../dominio.ts";
import { getCliente, postCliente } from "../infraestructura.ts";
import "./CrearCliente.css";

interface CrearClienteProps {
  publicar?: EmitirEvento;
  onCancelar?: () => void;
  activo?: boolean;
}

export const CrearCliente = ({
  publicar = () => {},
  onCancelar = () => {},
  activo = false,
}: CrearClienteProps) => {
  const nuevoCliente = useModelo(metaNuevoCliente, nuevoClienteVacio);
  const { intentar } = useContext(ContextoError);

  const guardar = async () => {
    const id = await intentar(() => postCliente(nuevoCliente.modelo));
    nuevoCliente.init(nuevoClienteVacio);
    const clienteCreado = await getCliente(id);
    publicar("cliente_creado", clienteCreado);
    onCancelar();
  };

  if (!activo) return null;

  return (
    <Mostrar modo="modal" activo={activo} onCerrar={onCancelar}>
      <div className="CrearCliente">
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
          <QBoton
            onClick={guardar}
            deshabilitado={nuevoCliente.valido === false}
          >
            Guardar
          </QBoton>
          <QBoton tipo="reset" variante="texto" onClick={onCancelar}>
            Cancelar
          </QBoton>
        </div>
      </div>
    </Mostrar>
  );
};
