import { QInput } from "../../../../../componentes/atomos/qinput.tsx";
import { HookModelo } from "../../../../comun/useModelo.ts";
import { Cliente } from "../../../../ventas/comun/componentes/cliente.tsx";
import { ContactoSelector } from "../../../../ventas/comun/componentes/contacto.tsx";
import { EstadoOportunidad } from "../../../comun/componentes/estado_oportunidad_venta.tsx";
import { LeadSelector } from "../../../comun/componentes/lead.tsx";
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
        <Cliente {...uiProps("cliente_id", "nombre_cliente")} />
        <LeadSelector
          {...uiProps("tarjeta_id")}
          label="Lead"
          valor={oportunidad.modelo.tarjeta_id ?? ""}
          descripcion={oportunidad.modelo.tarjeta_id ?? ""}
        />
        <ContactoSelector
          {...uiProps("contacto_id")}
          label="Contacto"
          descripcion={oportunidad.modelo.nombre_contacto ?? undefined}
        />
        <EstadoOportunidad label="Estado" {...uiProps("estado_id")} />
        <QInput label="Probabilidad (%)" {...uiProps("probabilidad")} />
        <QInput label="Fecha Cierre" {...uiProps("fecha_cierre")} />

        <QInput label="Total" {...uiProps("importe")} />
      </quimera-formulario>
    </div>
  );
};
