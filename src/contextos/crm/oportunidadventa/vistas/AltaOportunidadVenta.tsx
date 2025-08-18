import { useContext } from "react";
import { QBoton } from "../../../../componentes/atomos/qboton.tsx";
import { QInput } from "../../../../componentes/atomos/qinput.tsx";
import { ContextoError } from "../../../comun/contexto.ts";
import { EmitirEvento } from "../../../comun/diseño.ts";
import { useModelo } from "../../../comun/useModelo.ts";
import { EstadoOportunidad } from "../../comun/componentes/estadoOportunidadVenta.tsx";
import {
  metaNuevaOportunidadVenta,
  nuevaOportunidadVentaVacia,
} from "../dominio.ts";
import {
  getOportunidadVenta,
  postOportunidadVenta,
} from "../infraestructura.ts";
import "./AltaOportunidadVenta.css";

export const AltaOportunidadVenta = ({
  emitir = () => {},
}: {
  emitir?: EmitirEvento;
}) => {
  const nuevaOportunidad = useModelo(
    metaNuevaOportunidadVenta,
    nuevaOportunidadVentaVacia
  );
  const { intentar } = useContext(ContextoError);

  const guardar = async () => {
    const id = await intentar(() =>
      postOportunidadVenta(nuevaOportunidad.modelo)
    );
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
          {...nuevaOportunidad.uiProps("fecha_cierre")}
          label="Fecha Cierre"
        />
        <QInput
          label="probailidad (%)"
          {...nuevaOportunidad.uiProps("probabilidad")}
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
