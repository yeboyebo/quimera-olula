import { Cliente } from "#/crm/comun/componentes/cliente_con_nombre.tsx";
import { EstadoOportunidad } from "#/crm/comun/componentes/estado_oportunidad_venta.tsx";
import { LeadSelector } from "#/crm/comun/componentes/lead.tsx";
import { ContactoSelector } from "#/ventas/comun/componentes/contacto.tsx";
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

  return (
    <div className="TabDatos">
      <quimera-formulario>
        <QInput label="Descripción" {...uiProps("descripcion")} />
        {modelo.cliente_id ? (
          <Cliente
            {...uiProps("cliente_id", "nombre_cliente")}
            label="Seleccionar cliente"
            deshabilitado
          />
        ) : (
          <></>
        )}
        <QInput label="Cliente" {...uiProps("nombre_cliente")} />
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
        {/* <Usuario {...uiProps("usuario_id")} label="Responsable" /> */}
      </quimera-formulario>
    </div>
  );
};
