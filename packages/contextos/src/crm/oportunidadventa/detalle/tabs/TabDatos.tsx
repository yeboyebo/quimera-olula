import { EstadoOportunidad } from "#/crm/comun/componentes/estado_oportunidad_venta.tsx";
import { LeadSelector } from "#/crm/comun/componentes/lead.tsx";
import { ContactoSelector } from "#/ventas/comun/componentes/contacto.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { HookModelo } from "@olula/lib/useModelo.ts";
import { useCallback } from "react";
import { OportunidadVenta } from "../../diseño.ts";
import "./TabDatos.css";

export const TabDatos = ({
  oportunidad,
}: {
  oportunidad: HookModelo<OportunidadVenta>;
}) => {
  const { uiProps, modelo, set } = oportunidad;
  const tieneCliente = Boolean(modelo.cliente_id);
  const tieneTarjeta = Boolean(modelo.tarjeta_id);

  const seleccionarTarjeta = useCallback(
    (opcion: { valor: string; descripcion: string } | null) => {
      set({
        ...modelo,
        tarjeta_id: opcion?.valor ?? null,
        cliente_id: opcion?.valor ? null : modelo.cliente_id,
        nombre_cliente: opcion?.valor ? null : modelo.nombre_cliente,
      });
    },
    [modelo, set]
  );

  return (
    <div className="TabDatos">
      <quimera-formulario>
        <QInput label="Descripción" {...uiProps("descripcion")} />

        {!tieneTarjeta && (
          <QInput
            label="Cliente"
            nombre="cliente"
            soloTexto
            valor={modelo.nombre_cliente ?? modelo.cliente_id ?? ""}
          />
        )}

        {!tieneCliente && (
          <LeadSelector
            {...uiProps("tarjeta_id")}
            label="Cod. tarjeta"
            valor={oportunidad.modelo.tarjeta_id ?? ""}
            descripcion={
              oportunidad.modelo.nombre_tarjeta ??
              oportunidad.modelo.tarjeta_id ??
              ""
            }
            onChange={seleccionarTarjeta}
          />
        )}
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
