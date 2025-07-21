import { QBoton } from "../../../../../../componentes/atomos/qboton.tsx";
import { QInput } from "../../../../../../componentes/atomos/qinput.tsx";
import { HookModelo, useModelo } from "../../../../../comun/useModelo.ts";
import { ContactoSelector } from "../../../../../ventas/comun/componentes/contacto.tsx";
import { getAccion, postAccion } from "../../../../accion/infraestructura.ts";
import { EstadoAccion } from "../../../../comun/componentes/estado_accion.tsx";
import { TipoAccion } from "../../../../comun/componentes/tipo_accion.tsx";
import { Contacto } from "../../../diseño.ts";
import "./AltaAcciones.css";
import { metaNuevaAccion, nuevaAccionVacia } from "./dominio.ts";

export const AltaAcciones = ({
  emitir = () => {},
  contacto,
}: {
  emitir?: (evento: string, payload?: unknown) => void;
  contacto: HookModelo<Contacto>;
}) => {
  const nuevaAccion = useModelo(metaNuevaAccion, nuevaAccionVacia);

  const guardar = async () => {
    const modelo = {
      ...nuevaAccion.modelo,
      contacto_id: nuevaAccion.modelo.contacto_id || contacto.modelo.id,
    };
    const id = await postAccion(modelo);
    const accionCreada = await getAccion(id);
    emitir("ACCION_CREADA", accionCreada);
  };
  console.log(contacto.modelo);
  return (
    <div className="AltaAcciones">
      <h2>Nueva Acción</h2>
      <quimera-formulario>
        <QInput label="Descripción" {...nuevaAccion.uiProps("descripcion")} />
        <QInput label="Fecha" {...nuevaAccion.uiProps("fecha")} />
        <EstadoAccion {...nuevaAccion.uiProps("estado")} />
        <TipoAccion {...nuevaAccion.uiProps("tipo")} />
        <ContactoSelector
          {...nuevaAccion.uiProps("contacto_id")}
          valor={contacto.modelo.id}
          descripcion={contacto.modelo.nombre}
          label="Contacto"
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
