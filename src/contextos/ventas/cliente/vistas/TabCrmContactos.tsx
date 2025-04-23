import { useCallback, useEffect, useState } from "react";
import { QBoton } from "../../../../componentes/atomos/qboton.tsx";
import { QTabla } from "../../../../componentes/atomos/qtabla.tsx";
import { QModal } from "../../../../componentes/moleculas/qmodal.tsx";
import { CrmContacto } from "../diseño.ts";
import {
  deleteCrmContacto,
  getCrmContactos,
  vincularContactoCliente,
} from "../infraestructura.ts";
import { AltaCrmContactos } from "./AltaCrmContactos.tsx";
import { EdicionCrmContactos } from "./EdicionCrmContactos.tsx";
import "./TabCrmContactos.css";

const metaTablaCrmContactos = [
  { id: "id", cabecera: "ID" },
  { id: "nombre", cabecera: "Nombre" },
  { id: "email", cabecera: "Email" },
];

export const TabCrmContactos = ({ clienteId }: { clienteId: string }) => {
  const [modo, setModo] = useState<"lista" | "alta" | "edicion">("lista");
  const [contactos, setContactos] = useState<CrmContacto[]>([]);
  const [seleccionada, setSeleccionada] = useState<CrmContacto | null>(null);
  const [cargando, setCargando] = useState(true);

  const cargarContactos = useCallback(async () => {
    setCargando(true);
    const contactos = await getCrmContactos(clienteId);
    setContactos(contactos);
    setCargando(false);
  }, [clienteId]);

  useEffect(() => {
    if (clienteId) cargarContactos();
  }, [clienteId, cargarContactos]);

  const onGuardarNuevoContacto = async (contacto: CrmContacto) => {
    await vincularContactoCliente(contacto.id, clienteId);
    setContactos([contacto, ...contactos]);
    setModo("lista");
  };

  const onGuardarEdicionContacto = async (contacto: CrmContacto) => {
    setContactos(contactos.map((c) => (c.id === contacto.id ? contacto : c)));
    setSeleccionada(null);
    setModo("lista");
  };

  const onBorrarContacto = async () => {
    if (!seleccionada) return;

    await deleteCrmContacto(seleccionada.id);
    setContactos(contactos.filter((c) => c.id !== seleccionada.id));
    setSeleccionada(null);
  };

  const onCancelar = () => {
    setSeleccionada(null);
    setModo("lista");
  };

  return (
    <>
      <>
        <h2>Contactos CRM</h2>
        <div className="acciones maestro-botones">
          <QBoton onClick={() => setModo("alta")}>Nuevo</QBoton>
          <QBoton
            onClick={() => seleccionada && setModo("edicion")}
            deshabilitado={!seleccionada}
          >
            Editar
          </QBoton>
          <QBoton onClick={onBorrarContacto} deshabilitado={!seleccionada}>
            Borrar
          </QBoton>
        </div>
        <QTabla
          metaTabla={metaTablaCrmContactos}
          datos={contactos}
          cargando={cargando}
          seleccionadaId={seleccionada?.id}
          onSeleccion={setSeleccionada}
          orden={{ id: "ASC" }}
          onOrdenar={() => null}
        />
      </>

      <QModal
        nombre="altaCrmContacto"
        abierto={modo === "alta"}
        onCerrar={onCancelar}
      >
        <AltaCrmContactos
          clienteId={clienteId}
          onContactoCreado={onGuardarNuevoContacto}
          onCancelar={onCancelar}
        />
      </QModal>

      <QModal
        nombre="edicionCrmContacto"
        abierto={modo === "edicion"}
        onCerrar={onCancelar}
      >
        {seleccionada && (
          <EdicionCrmContactos
            clienteId={clienteId}
            contacto={seleccionada}
            onContactoActualizado={onGuardarEdicionContacto}
            onCancelar={onCancelar}
          />
        )}
      </QModal>
    </>
  );
};
