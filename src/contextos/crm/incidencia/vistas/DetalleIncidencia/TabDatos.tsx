import { QInput } from "../../../../../componentes/atomos/qinput.tsx";
import { HookModelo } from "../../../../comun/useModelo.ts";
import { Cliente } from "../../../../ventas/comun/componentes/cliente.tsx";
// import { Proveedor } from "../../../../ventas/comun/componentes/proveedor.tsx";
import { TipoEntidadLead } from "../../../comun/componentes/tipo_entidad_lead.tsx";
import { Lead } from "../../diseño.ts";
import "./TabDatos.css";

export const TabDatos = ({ lead }: { lead: HookModelo<Lead> }) => {
  const { uiProps, modelo } = lead;

  return (
    <div className="TabMasDatos">
      <quimera-formulario>
        <TipoEntidadLead {...uiProps("tipo")} />
        {modelo.tipo === "Cliente" ? (
          <Cliente {...uiProps("cliente_id", "nombre")} />
        ) : (
          // <Proveedor {...uiProps("proveedor_id", "nombre")} />
          <></>
        )}
        <QInput label="Dirección" {...uiProps("direccion")} />
        <QInput label="Código Postal" {...uiProps("cod_postal")} />
        <QInput label="Ciudad" {...uiProps("ciudad")} />
        <QInput label="Provincia" {...uiProps("provincia")} />
        <QInput label="País ID" {...uiProps("pais_id")} />
        <QInput label="Teléfono 1" {...uiProps("telefono_1")} />
        <QInput label="Teléfono 2" {...uiProps("telefono_2")} />
      </quimera-formulario>
    </div>
  );
};
