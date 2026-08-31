import { Cliente } from "#/crm/comun/componentes/cliente_con_nombre.tsx";
import { ContactoSelector } from "#/crm/comun/componentes/contacto.tsx";
import { EstadoOportunidad } from "#/crm/comun/componentes/estado_oportunidad_venta.tsx";
import { LeadSelector } from "#/crm/comun/componentes/lead.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { HookModelo } from "@olula/lib/useModelo.ts";
import { OportunidadVenta } from "../../diseño.ts";
import "./TabDatos.css";

export const TabDatos = ({
  oportunidad,
}: {
  oportunidad: HookModelo<OportunidadVenta>;
}) => {
  const { uiProps, modelo } = oportunidad;
  const tieneCliente = Boolean(modelo.cliente_id);
  const tieneTarjeta = Boolean(modelo.tarjeta_id);
  const tieneContacto = Boolean(modelo.contacto_id);

  return (
    <div className="TabDatos">
      <quimera-formulario>
        <QInput label="Descripción" {...uiProps("descripcion")} />

        {tieneCliente && (
          <Cliente
            valor={modelo.cliente_id ?? ""}
            descripcion={modelo.nombre_cliente ?? ""}
            deshabilitado
          />
        )}

        {tieneTarjeta && (
          <LeadSelector
            label="Lead"
            valor={modelo.tarjeta_id ?? ""}
            descripcion={modelo.nombre_cliente ?? modelo.nombre_tarjeta ?? ""}
            onChange={() => null}
            deshabilitado
          />
        )}

        {tieneContacto && (
          <ContactoSelector
            label="Contacto"
            valor={modelo.contacto_id ?? ""}
            descripcion={modelo.nombre_contacto ?? ""}
            onChange={() => null}
            deshabilitado
          />
        )}

        <EstadoOportunidad label="Estado" {...uiProps("estado_id")} />

        <QInput label="Probabilidad (%)" {...uiProps("probabilidad")} />
        <QInput label="Fecha Cierre" {...uiProps("fecha_cierre")} />
        <QInput label="Total" {...uiProps("importe")} />
      </quimera-formulario>
    </div>
  );
};
