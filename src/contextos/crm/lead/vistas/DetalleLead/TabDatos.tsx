import { QInput } from "../../../../../componentes/atomos/qinput.tsx";
import { PaisSelector } from "../../../../comun/componentes/pais/pais.tsx";
import { HookModelo } from "../../../../comun/useModelo.ts";
import { Cliente } from "../../../../ventas/comun/componentes/cliente.tsx";
import { ContactoSelector } from "../../../../ventas/comun/componentes/contacto.tsx";
import { EstadoLead } from "../../../comun/componentes/estado_lead.tsx";
import { FuenteLead } from "../../../comun/componentes/fuente_lead.tsx";
// import { Proveedor } from "../../../../ventas/comun/componentes/proveedor.tsx";
import { TipoEntidadLead } from "../../../comun/componentes/tipo_entidad_lead.tsx";
import { Lead } from "../../diseño.ts";
import "./TabDatos.css";

export const TabDatos = ({ lead }: { lead: HookModelo<Lead> }) => {
  const { uiProps, modelo } = lead;
  console.log(uiProps("contacto_id"));
  return (
    <div className="TabMasDatos">
      <quimera-formulario>
        <EstadoLead {...uiProps("estado_id")} />
        <FuenteLead {...uiProps("fuente_id")} />
        <ContactoSelector
          {...uiProps("contacto_id")}
          label="Contacto"
          descripcion={uiProps("contacto_id").valor || ""}
        />
        {modelo.contacto_id ? (
          <>+</>
        ) : (
          // <Proveedor {...uiProps("proveedor_id", "nombre")} />
          <>ver</>
        )}
        <TipoEntidadLead {...uiProps("tipo")} />
        {modelo.tipo === "Cliente" && modelo.cliente_id ? (
          <Cliente {...uiProps("cliente_id", "nombre")} />
        ) : (
          // <Proveedor {...uiProps("proveedor_id", "nombre")} />
          <></>
        )}
        <QInput label="Nombre" {...uiProps("nombre")} />
        <QInput label="CIF/NIF" {...uiProps("id_fiscal")} />
        <QInput label="Dirección" {...uiProps("direccion")} />
        <QInput label="Ciudad" {...uiProps("ciudad")} />
        <QInput label="Código Postal" {...uiProps("cod_postal")} />
        <QInput label="Provincia" {...uiProps("provincia")} />
        <PaisSelector label="País" {...uiProps("pais_id", "pais")} />
        <QInput label="Teléfono 1" {...uiProps("telefono_1")} />
        <QInput label="Teléfono 2" {...uiProps("telefono_2")} />
      </quimera-formulario>
    </div>
  );
};
