import { HookModelo } from "../../../../comun/useModelo.ts";
import { Cliente } from "../../../../ventas/comun/componentes/cliente.tsx";
import { ContactoSelector } from "../../../../ventas/comun/componentes/contacto.tsx";
import { OportunidadVenta } from "../../../comun/componentes/oportunidad_venta.tsx";
import { Accion } from "../../diseño.ts";
import "./TabDatos.css";

export const TabDatos = ({ accion }: { accion: HookModelo<Accion> }) => {
  const { uiProps } = accion;

  return (
    <div className="TabDatos">
      <quimera-formulario>
        {/* <QInput label="Responsable" {...uiProps("usuario_id")} deshabilitado /> */}
        <Cliente {...uiProps("cliente_id", "nombre_cliente")} />
        <ContactoSelector {...uiProps("contacto_id", "nombre_contacto")} />
        <OportunidadVenta
          {...uiProps("oportunidad_id", "descripcion_oportunidad")}
        />
        {/* <QInput label="Incidencia" {...uiProps("incidencia_id")} />
        <QInput label="Tarjeta" {...uiProps("tarjeta_id")} /> */}
      </quimera-formulario>
    </div>
  );
};
