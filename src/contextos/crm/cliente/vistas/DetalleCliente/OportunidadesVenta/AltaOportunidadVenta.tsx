import { useContext } from "react";
import { QBoton } from "../../../../../../componentes/atomos/qboton.tsx";
import { QInput } from "../../../../../../componentes/atomos/qinput.tsx";
import { ContextoError } from "../../../../../comun/contexto.ts";
import { EmitirEvento } from "../../../../../comun/diseño.ts";
import { HookModelo, useModelo } from "../../../../../comun/useModelo.ts";
import { ClienteConNombre } from "../../../../comun/componentes/cliente_con_nombre.tsx";
import { EstadoOportunidad } from "../../../../comun/componentes/estadoOportunidadVenta.tsx";
import { Cliente } from "../../../diseño.ts";
import {
  metaNuevaOportunidadVenta,
  nuevaOportunidadVentaVacia,
} from "../../../dominio.ts";
import {
  getOportunidadVenta,
  postOportunidadVenta,
} from "../../../infraestructura.ts";
import "./AltaOportunidadVenta.css";

export const AltaOportunidadVenta = ({
  emitir = () => {},
  cliente,
}: {
  emitir?: EmitirEvento;
  cliente: HookModelo<Cliente>;
}) => {
  const nuevaOportunidad = useModelo(
    metaNuevaOportunidadVenta,
    nuevaOportunidadVentaVacia
  );
  const { intentar } = useContext(ContextoError);

  const guardar = async () => {
    const modelo = {
      ...nuevaOportunidad.modelo,
      cliente_id: nuevaOportunidad.modelo.cliente_id || cliente.modelo.id,
      nombre_cliente:
        nuevaOportunidad.modelo.nombre_cliente || cliente.modelo.nombre,
    };
    const id = await intentar(() => postOportunidadVenta(modelo));
    const oportunidadCreada = await getOportunidadVenta(id);
    emitir("OPORTUNIDAD_CREADA", oportunidadCreada);
  };

  return (
    <div className="AltaOportunidadVenta">
      <h2>Nueva Oportunidad de Venta</h2>
      <quimera-formulario>
        <QInput
          label="Descripción"
          {...nuevaOportunidad.uiProps("descripcion")}
        />
        <EstadoOportunidad
          label="Estado"
          {...nuevaOportunidad.uiProps("estado_id")}
          nombre="alta_estado_id"
        />
        <QInput
          label="probailidad (%)"
          {...nuevaOportunidad.uiProps("probabilidad")}
        />
        <ClienteConNombre
          {...nuevaOportunidad.uiProps("cliente_id", "nombre_cliente")}
          valor={cliente.modelo.id}
          descripcion={cliente.modelo.nombre}
        />
      </quimera-formulario>
      <div className="botones">
        <QBoton onClick={guardar} deshabilitado={!nuevaOportunidad.valido}>
          Guardar
        </QBoton>
        <QBoton onClick={() => emitir("ALTA_CANCELADA")} variante="texto">
          Cancelar
        </QBoton>
      </div>
    </div>
  );
};
