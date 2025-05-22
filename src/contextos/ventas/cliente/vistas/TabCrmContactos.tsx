import { useCallback, useEffect, useState } from "react";
import { QBoton } from "../../../../componentes/atomos/qboton.tsx";
import { QTabla } from "../../../../componentes/atomos/qtabla.tsx";
import { QModal } from "../../../../componentes/moleculas/qmodal.tsx";
import { QModalConfirmacion } from "../../../../componentes/moleculas/qmodalconfirmacion.tsx";
import { useLista } from "../../../comun/useLista.ts";
import { Maquina, useMaquina } from "../../../comun/useMaquina.ts";
import { CrmContacto } from "../diseño.ts";
import {
  deleteCrmContacto,
  desvincularContactoCliente,
  getCrmContactosCliente,
  vincularContactoCliente,
} from "../infraestructura.ts";
import { AltaCrmContactos } from "./AltaCrmContactos.tsx";
import { EdicionCrmContactos } from "./EdicionCrmContactos.tsx";

const metaTablaCrmContactos = [
  { id: "id", cabecera: "ID" },
  { id: "nombre", cabecera: "Nombre" },
  { id: "email", cabecera: "Email" },
];

type Estado = "lista" | "alta" | "edicion" | "asociar" | "confirmarBorrado";

export const TabCrmContactos = ({ clienteId }: { clienteId: string }) => {
  const contactos = useLista<CrmContacto>([]);
  const [cargando, setCargando] = useState(true);
  const [estado, setEstado] = useState<Estado>("lista");

  const cargarContactos = useCallback(async () => {
    setCargando(true);
    const nuevosContactos = await getCrmContactosCliente(clienteId);
    contactos.setLista(nuevosContactos);
    setCargando(false);
  }, [clienteId]);

  useEffect(() => {
    if (clienteId) cargarContactos();
  }, [clienteId, cargarContactos]);

  const maquina: Maquina<Estado> = {
    lista: {
      ALTA_SOLICITADA: "alta",
      EDICION_SOLICITADA: "edicion",
      CONTACTO_SELECCIONADO: (payload: unknown) => {
        const contacto = payload as CrmContacto;
        contactos.seleccionar(contacto);
      },
      CONFIRMAR_BORRADO: "confirmarBorrado",
      ELIMINAR_ASOCIACION: async () => {
        if (!contactos.seleccionada) return;
        await desvincularContactoCliente(contactos.seleccionada.id, clienteId);
      },
      ASOCIAR_SOLICITADO: "asociar",
    },
    alta: {
      CONTACTO_CREADO: async (payload: unknown) => {
        const nuevoContacto = payload as CrmContacto;
        contactos.añadir(nuevoContacto);
        await vincularContactoCliente(nuevoContacto.id, clienteId);
        return "lista" as Estado;
      },
      ALTA_CANCELADA: "lista",
    },
    edicion: {
      CONTACTO_ACTUALIZADO: async (payload: unknown) => {
        const contactoActualizado = payload as CrmContacto;
        contactos.modificar(contactoActualizado);
        return "lista" as Estado;
      },
      EDICION_CANCELADA: "lista",
    },
    asociar: {
      ASOCIAR_CANCELADO: "lista",
    },
    confirmarBorrado: {
      BORRADO_SOLICITADO: async () => {
        if (!contactos.seleccionada) return;
        await deleteCrmContacto(contactos.seleccionada.id);
        contactos.eliminar(contactos.seleccionada);
        return "lista" as Estado;
      },
      BORRADO_CANCELADO: "lista",
    },
  };

  const emitir = useMaquina(maquina, estado, setEstado);

  return (
    <>
      <div className="detalle-contacto-tab-contenido maestro-botones">
        <QBoton onClick={() => emitir("ALTA_SOLICITADA")}>Nuevo</QBoton>
        <QBoton
          onClick={() => contactos.seleccionada && emitir("EDICION_SOLICITADA")}
          deshabilitado={!contactos.seleccionada}
        >
          Editar
        </QBoton>
        <QBoton
          onClick={() => emitir("CONFIRMAR_BORRADO")}
          deshabilitado={!contactos.seleccionada}
        >
          Borrar
        </QBoton>
        <QBoton
          onClick={() => emitir("ELIMINAR_ASOCIACION")}
          deshabilitado={!contactos.seleccionada}
        >
          Eliminar asociación
        </QBoton>
        <QBoton onClick={() => emitir("ASOCIAR_SOLICITADO")}>Asociar</QBoton>
      </div>
      <QTabla
        metaTabla={metaTablaCrmContactos}
        datos={contactos.lista}
        cargando={cargando}
        seleccionadaId={contactos.seleccionada?.id}
        onSeleccion={(contacto) => emitir("CONTACTO_SELECCIONADO", contacto)}
        orden={{ id: "ASC" }}
        onOrdenar={() => null}
      />
      <QModalConfirmacion
        nombre="borrarContacto"
        abierto={estado === "confirmarBorrado"}
        titulo="Confirmar borrar"
        mensaje="¿Está seguro de que desea borrar este contacto?"
        onCerrar={() => emitir("BORRADO_CANCELADO")}
        onAceptar={() => emitir("BORRADO_SOLICITADO")}
      />
      <QModal
        nombre="altaCrmContacto"
        abierto={estado === "alta"}
        onCerrar={() => emitir("ALTA_CANCELADA")}
      >
        <AltaCrmContactos clienteId={clienteId} emitir={emitir} />
      </QModal>
      <QModal
        nombre="edicionCrmContacto"
        abierto={estado === "edicion"}
        onCerrar={() => emitir("EDICION_CANCELADA")}
      >
        {contactos.seleccionada && (
          <EdicionCrmContactos
            contacto={contactos.seleccionada}
            emitir={emitir}
          />
        )}
      </QModal>
      <QModal
        nombre="asociarCrmContacto"
        abierto={estado === "asociar"}
        onCerrar={() => emitir("ASOCIAR_CANCELADO")}
      >
        <p>Seleccionar contacto para asociar.</p>
      </QModal>
    </>
  );
};
