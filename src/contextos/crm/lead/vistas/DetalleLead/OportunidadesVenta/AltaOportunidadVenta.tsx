import { QBoton } from "../../../../../../componentes/atomos/qboton.tsx";
import { QInput } from "../../../../../../componentes/atomos/qinput.tsx";
import { EmitirEvento } from "../../../../../comun/diseño.ts";
import { HookModelo, useModelo } from "../../../../../comun/useModelo.ts";
import { ContactoSelector } from "../../../../../ventas/comun/componentes/contacto.tsx";
import { EstadoOportunidad } from "../../../../comun/componentes/estadoOportunidadVenta.tsx";
import {
  getOportunidadVenta,
  postOportunidadVenta,
} from "../../../../oportunidadventa/infraestructura.ts";
import { Lead } from "../../../diseño.ts";
import {
  metaNuevaOportunidadVenta,
  nuevaOportunidadVentaVacia,
} from "../../../dominio.ts";
import "./AltaOportunidadVenta.css";

export const AltaOportunidadVenta = ({
  emitir = () => {},
  lead,
}: {
  emitir?: EmitirEvento;
  lead: HookModelo<Lead>;
}) => {
  const nuevaOportunidad = useModelo(
    metaNuevaOportunidadVenta,
    nuevaOportunidadVentaVacia
  );

  const guardar = async () => {
    const id = await postOportunidadVenta(nuevaOportunidad.modelo);
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
        <ContactoSelector
          {...nuevaOportunidad.uiProps("contacto_id")}
          valor={lead.modelo.id}
          descripcion={lead.modelo.nombre}
          label="Lead"
          deshabilitado={true}
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
