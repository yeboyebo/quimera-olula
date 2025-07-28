import { QBoton } from "../../../../../../componentes/atomos/qboton.tsx";
import { QInput } from "../../../../../../componentes/atomos/qinput.tsx";
import { HookModelo, useModelo } from "../../../../../comun/useModelo.ts";
import { Cliente as ClienteSelector } from "../../../../../ventas/comun/componentes/cliente.tsx";
import { getAccion, postAccion } from "../../../../accion/infraestructura.ts";
import { EstadoAccion } from "../../../../comun/componentes/estado_accion.tsx";
import { TipoAccion } from "../../../../comun/componentes/tipo_accion.tsx";
import { Cliente } from "../../../diseño.ts";
import "./AltaAcciones.css";
import { metaNuevaAccion, nuevaAccionVacia } from "./dominio.ts";

export const AltaAcciones = ({
  emitir = () => {},
  cliente,
}: {
  emitir?: (evento: string, payload?: unknown) => void;
  cliente: HookModelo<Cliente>;
}) => {
  const nuevaAccion = useModelo(metaNuevaAccion, nuevaAccionVacia);

  const guardar = async () => {
    const modelo = {
      ...nuevaAccion.modelo,
      cliente_id: nuevaAccion.modelo.cliente_id || cliente.modelo.id,
    };
    const id = await postAccion(modelo);
    const accionCreada = await getAccion(id);
    emitir("ACCION_CREADA", accionCreada);
  };

  return (
    <div className="AltaAcciones">
      <h2>Nueva Acción</h2>
      <quimera-formulario>
        <QInput label="Descripción" {...nuevaAccion.uiProps("descripcion")} />
        <QInput label="Fecha" {...nuevaAccion.uiProps("fecha")} />
        <EstadoAccion {...nuevaAccion.uiProps("estado")} />
        <TipoAccion {...nuevaAccion.uiProps("tipo")} />
        <ClienteSelector
          {...nuevaAccion.uiProps("cliente_id")}
          valor={cliente.modelo.id}
          descripcion={cliente.modelo.nombre}
          deshabilitado={true}
        />
      </quimera-formulario>
      <div className="botones">
        <QBoton onClick={guardar} deshabilitado={!nuevaAccion.valido}>
          Guardar
        </QBoton>
        <QBoton onClick={() => emitir("ALTA_CANCELADA")} variante="texto">
          Cancelar
        </QBoton>
      </div>
    </div>
  );
};
