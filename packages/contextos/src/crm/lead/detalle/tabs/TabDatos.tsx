import { PaisSelector } from "#/comun/componentes/pais/pais.tsx";
import { Cliente } from "#/crm/comun/componentes/cliente_con_nombre.tsx";
import { ContactoSelector } from "#/crm/comun/componentes/contacto.tsx";
import { EstadoLead } from "#/crm/comun/componentes/estado_lead.tsx";
import { FuenteLead } from "#/crm/comun/componentes/fuente_lead.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { formatearDireccionUnaLinea } from "@olula/lib/dominio.ts";
import { HookModelo } from "@olula/lib/useModelo.ts";
import { useState } from "react";
import { Lead } from "../../diseño.ts";
import "./TabDatos.css";

export const TabDatos = ({ lead }: { lead: HookModelo<Lead> }) => {
  const { uiProps, modelo } = lead;
  const [mostrarDireccion, setMostrarDireccion] = useState(false);

  const direccionResumen = formatearDireccionUnaLinea({
    tipo_via: "",
    nombre_via: modelo.direccion ?? "",
    ciudad: modelo.ciudad ?? "",
    numero: "",
    otros: "",
    cod_postal: modelo.cod_postal ?? "",
    provincia_id: modelo.provincia_id ? Number(modelo.provincia_id) : 0,
    provincia: modelo.provincia ?? "",
    pais_id: modelo.pais_id ?? "",
    apartado: "",
    telefono: modelo.telefono_1 ?? "",
  }).trim();

  return (
    <div className="TabMasDatos">
      <quimera-formulario>
        <EstadoLead {...uiProps("estado_id")} />
        <FuenteLead {...uiProps("fuente_id")} />
        <ContactoSelector
          {...uiProps("contacto_id")}
          label="Contacto"
          valor={modelo.contacto_id ?? ""}
          descripcion={modelo.contacto?.nombre ?? modelo.contacto_id ?? ""}
        />
        {modelo.tipo === "Cliente" && modelo.cliente_id ? (
          <Cliente {...uiProps("cliente_id", "nombre")} />
        ) : (
          // <Proveedor {...uiProps("proveedor_id", "nombre")} />
          <></>
        )}
        <QInput label="Nombre" {...uiProps("nombre")} />
        <QInput label="CIF/NIF" {...uiProps("id_fiscal")} />
        <QInput label="Teléfono 1" {...uiProps("telefono_1")} />
        <QInput label="Teléfono 2" {...uiProps("telefono_2")} />
        <QInput label="Email" {...uiProps("email")} />
        <section className="lead-direccion-resumen">
          <div className="lead-direccion-resumen-label">Dirección</div>
          <div className="lead-direccion-resumen-contenido">
            <span>{direccionResumen || "-"}</span>
            <QBoton
              tamaño="pequeño"
              variante="texto"
              onClick={() => setMostrarDireccion((abierto) => !abierto)}
            >
              {mostrarDireccion ? "Ocultar" : "Editar"}
            </QBoton>
          </div>
        </section>
        {mostrarDireccion && (
          <>
            <QInput label="Dirección" {...uiProps("direccion")} />
            <QInput label="Ciudad" {...uiProps("ciudad")} />
            <QInput label="Código Postal" {...uiProps("cod_postal")} />
            <QInput label="Provincia" {...uiProps("provincia")} />
            <PaisSelector label="País" {...uiProps("pais_id", "pais")} />
          </>
        )}
      </quimera-formulario>
    </div>
  );
};
