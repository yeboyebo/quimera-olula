import { QInput } from "../../../../../componentes/atomos/qinput.tsx";
import { HookModelo } from "../../../../comun/useModelo.ts";
import { Lead } from "../../diseño.ts";

export const TabDatos = ({ lead }: { lead: HookModelo<Lead> }) => {
  const { uiProps } = lead;

  return (
    <div className="TabDatos">
      <quimera-formulario>
        <QInput label="Tipo" {...uiProps("tipo")} />
        <QInput label="Estado" {...uiProps("estado_id")} />
        <QInput label="Nombre" {...uiProps("nombre")} />
        <QInput label="ID Fiscal" {...uiProps("id_fiscal")} />
        <QInput label="Cliente" {...uiProps("cliente_id")} />
        <QInput label="Proveedor" {...uiProps("proveedor_id")} />
        <QInput label="Dirección" {...uiProps("direccion")} />
        <QInput label="Email" {...uiProps("email")} />
        <QInput label="Web" {...uiProps("web")} />
        <QInput label="Contacto" {...uiProps("contacto_id")} />
        <QInput label="Fuente" {...uiProps("fuente_id")} />
        <QInput label="Responsable" {...uiProps("responsable_id")} />
      </quimera-formulario>
    </div>
  );
};
