import { QInput } from "../../../../../componentes/atomos/qinput.tsx";
import { HookModelo } from "../../../../comun/useModelo.ts";
import { ContactoSelector } from "../../../../ventas/comun/componentes/contacto.tsx";
import { ClienteConNombre } from "../../../comun/componentes/cliente_con_nombre.tsx";
import { EstadoOportunidad } from "../../../comun/componentes/estadoOportunidadVenta.tsx";
import { OportunidadVenta } from "../../diseño.ts";
import "./TabDatos.css";

export const TabDatos = ({
  oportunidad,
}: {
  oportunidad: HookModelo<OportunidadVenta>;
}) => {
  const { uiProps } = oportunidad;

  return (
    <div className="TabDatos">
      <quimera-formulario>
        <QInput label="Descripción" {...uiProps("descripcion")} />
        <ClienteConNombre
          {...uiProps("cliente_id", "nombre_cliente")}
          valor={oportunidad.modelo.cliente_id ?? ""}
          descripcion={oportunidad.modelo.nombre_cliente ?? ""}
        />
        <ContactoSelector
          {...uiProps("contacto_id")}
          label="Contacto"
          descripcion={oportunidad.modelo.nombre_contacto ?? undefined}
        />
        <EstadoOportunidad
          label="Estado"
          {...uiProps("estado_id")}
          descripcion={oportunidad.modelo.descripcion_estado ?? undefined}
        />
        <QInput label="Probabilidad (%)" {...uiProps("probabilidad")} />
        <QInput label="Tarjeta" {...uiProps("tarjeta_id")} deshabilitado />
        <QInput label="Total Venta" {...uiProps("total_venta")} />
        <QInput label="Fecha Cierre" {...uiProps("fecha_cierre")} />
      </quimera-formulario>
    </div>
  );
};
