import { QBoton } from "../../../../../../componentes/atomos/qboton.tsx";
import { QInput } from "../../../../../../componentes/atomos/qinput.tsx";
import { HookModelo, useModelo } from "../../../../../comun/useModelo.ts";
import { getAccion, postAccion } from "../../../../accion/infraestructura.ts";
import { EstadoAccion } from "../../../../comun/componentes/estado_accion.tsx";
import { OportunidadVenta as OportunidadSelect } from "../../../../comun/componentes/oportunidad_venta.tsx";
import { TipoAccion } from "../../../../comun/componentes/tipo_accion.tsx";
import { OportunidadVenta } from "../../../diseño.ts";
import "./AltaAcciones.css";
import { metaNuevaAccion, nuevaAccionVacia } from "./dominio.ts";

export const AltaAcciones = ({
  emitir = () => {},
  oportunidad,
}: {
  emitir?: (evento: string, payload?: unknown) => void;
  oportunidad: HookModelo<OportunidadVenta>;
}) => {
  const nuevaAccion = useModelo(metaNuevaAccion, nuevaAccionVacia);

  const guardar = async () => {
    const id = await postAccion(nuevaAccion.modelo);
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
        <OportunidadSelect
          {...nuevaAccion.uiProps("oportunidad_id")}
          valor={oportunidad.modelo.id}
          descripcion={oportunidad.modelo.descripcion}
          label="Oportunidad"
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
