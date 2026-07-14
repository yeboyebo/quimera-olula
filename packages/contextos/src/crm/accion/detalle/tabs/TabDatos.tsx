import { Cliente } from "#/crm/comun/componentes/cliente_con_nombre.tsx";
import { OportunidadVenta } from "#/crm/comun/componentes/oportunidad_venta.tsx";
import { ContactoSelector } from "#/ventas/comun/componentes/contacto.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { HookModelo } from "@olula/lib/useModelo.ts";
import { Accion } from "../../diseño.ts";

const limpiarTelefono = (telefono: string) => telefono.replace(/[^+\d]/g, "");
const telefonoWhatsapp = (telefono: string) => telefono.replace(/\D/g, "");

export const TabDatos = ({ accion }: { accion: HookModelo<Accion> }) => {
  const { uiProps, modelo } = accion;
  const contactosCliente = modelo.cliente?.contactos ?? [];
  const mostrarCliente = Boolean(modelo.cliente_id);
  const mostrarTarjeta = !mostrarCliente;

  return (
    <div className="TabDatos">
      <quimera-formulario>
        {mostrarCliente && (
          <Cliente
            {...uiProps("cliente_id", "nombre_cliente")}
            valor={modelo.cliente_id ?? ""}
            descripcion={modelo.nombre_cliente ?? modelo.cliente?.nombre ?? ""}
            label="Cod. cliente"
            deshabilitado
          />
        )}

        {mostrarTarjeta && (
          <QInput
            label="Cod. tarjeta"
            {...uiProps("tarjeta_id")}
            deshabilitado
          />
        )}

        <ContactoSelector {...uiProps("contacto_id", "nombre_contacto")} />
        <OportunidadVenta
          {...uiProps("oportunidad_id", "descripcion_oportunidad")}
        />
      </quimera-formulario>

      <div className="contactos-cliente">
        <h4>Contactos</h4>
        <p className="contactos-tarjeta">Tarjeta: {modelo.tarjeta_id || "-"}</p>
        {contactosCliente.length === 0 && (
          <p className="contactos-vacio">
            {modelo.cliente
              ? "Este cliente no tiene contactos."
              : "Sin cliente vinculado en esta acción."}
          </p>
        )}

        {contactosCliente.map((contacto, index) => {
          const telefono = contacto.telefono ?? "";
          const telefonoLimpio = limpiarTelefono(telefono);
          const telefonoWa = telefonoWhatsapp(telefono);
          const email = contacto.email ?? "";

          return (
            <div
              key={`${contacto.nombre}-${contacto.email ?? ""}-${index}`}
              className="contacto-item"
            >
              <div className="contacto-info">
                <strong>{contacto.nombre}</strong>
                {contacto.cargo && <span>{contacto.cargo}</span>}
                {email && <span>{email}</span>}
                {telefono && <span>{telefono}</span>}
              </div>
              <div className="contacto-acciones">
                {telefonoLimpio && <a href={`tel:${telefonoLimpio}`}>Llamar</a>}
                {telefonoWa && (
                  <a
                    href={`https://wa.me/${telefonoWa}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    WhatsApp
                  </a>
                )}
                {email && <a href={`mailto:${email}`}>Email</a>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
