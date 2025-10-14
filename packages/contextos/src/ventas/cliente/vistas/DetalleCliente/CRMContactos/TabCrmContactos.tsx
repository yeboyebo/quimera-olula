import { ContactoSelector } from "#/ventas/comun/componentes/contacto.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QTabla } from "@olula/componentes/atomos/qtabla.tsx";
import { QModal } from "@olula/componentes/moleculas/qmodal.tsx";
import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { useLista } from "@olula/lib/useLista.ts";
import { Maquina, useMaquina } from "@olula/lib/useMaquina.ts";
import { useCallback, useContext, useEffect, useState } from "react";
import {
  desvincularContactoCliente,
  vincularContactoCliente,
} from "../../../../../crm/cliente/infraestructura.ts";
import { CrmContacto } from "../../../diseño.ts";
import {
  deleteCrmContacto,
  getCrmContactosCliente,
} from "../../../infraestructura.ts";
import { AltaCrmContactos } from "./AltaCrmContactos.tsx";
import { EdicionCrmContactos } from "./EdicionCrmContactos.tsx";

const metaTablaCrmContactos = [
  { id: "id", cabecera: "ID" },
  { id: "nombre", cabecera: "Nombre" },
  { id: "email", cabecera: "Email" },
];

type Estado =
  | "lista"
  | "alta"
  | "edicion"
  | "asociar"
  | "confirmarBorrado"
  | "confirmarEliminarAsociacion";

type ConfiguracionModalConfirmacion = {
  nombre: string;
  titulo: string;
  mensaje: string;
  onCerrar: string;
  onAceptar: string;
};

const configuracionModalConfirmacion: Partial<
  Record<Estado, ConfiguracionModalConfirmacion>
> = {
  confirmarBorrado: {
    nombre: "confirmacionBorrarContacto",
    titulo: "Confirmar borrar",
    mensaje: "¿Está seguro de que desea borrar este contacto?",
    onCerrar: "BORRADO_CANCELADO",
    onAceptar: "BORRADO_SOLICITADO",
  },
  confirmarEliminarAsociacion: {
    nombre: "confirmacionEliminarAsociacion",
    titulo: "Confirmar eliminación de asociación",
    mensaje:
      "¿Está seguro de que desea eliminar la asociación de este contacto?",
    onCerrar: "ELIMINACION_CANCELADA",
    onAceptar: "ELIMINACION_SOLICITADA",
  },
};

export const TabCrmContactos = ({ clienteId }: { clienteId: string }) => {
  const contactos = useLista<CrmContacto>([]);
  const [cargando, setCargando] = useState(true);
  const [estado, setEstado] = useState<Estado>("lista");
  const [contactoSeleccionado, setContactoSeleccionado] = useState<{
    valor: string;
    descripcion: string;
  } | null>(null);
  const { intentar } = useContext(ContextoError);

  const setListaContactos = contactos.setLista;

  const cargarContactos = useCallback(async () => {
    setCargando(true);
    const nuevosContactos = await getCrmContactosCliente(clienteId);
    setListaContactos(nuevosContactos);
    setCargando(false);
  }, [clienteId, setListaContactos]);

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
      ELIMINAR_ASOCIACION: "confirmarEliminarAsociacion",
      ASOCIAR_SOLICITADO: "asociar",
    },
    alta: {
      CONTACTO_CREADO: async (payload: unknown) => {
        const nuevoContacto = payload as CrmContacto;
        contactos.añadir(nuevoContacto);
        await intentar(() =>
          vincularContactoCliente(nuevoContacto.id, clienteId)
        );
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
      ASOCIAR_CERRAR: "lista",
      ASOCIAR_CONTACTO: async () => {
        if (!contactoSeleccionado) return;
        await intentar(() =>
          vincularContactoCliente(contactoSeleccionado.valor, clienteId)
        );
        await cargarContactos();
        return "lista" as Estado;
      },
    },
    confirmarBorrado: {
      BORRADO_SOLICITADO: async () => {
        if (!contactos.seleccionada) return;
        const idContacto = contactos.seleccionada.id;
        if (!idContacto) return;
        await intentar(() => deleteCrmContacto(idContacto));
        contactos.eliminar(contactos.seleccionada);
        return "lista" as Estado;
      },
      BORRADO_CANCELADO: "lista",
    },
    confirmarEliminarAsociacion: {
      ELIMINACION_SOLICITADA: async () => {
        if (!contactos.seleccionada) return;
        const idContacto = contactos.seleccionada.id;
        if (!idContacto) return;
        await intentar(() => desvincularContactoCliente(idContacto, clienteId));
        contactos.eliminar(contactos.seleccionada);
        return "lista" as Estado;
      },
      ELIMINACION_CANCELADA: "lista",
    },
  };

  const emitir = useMaquina(maquina, estado, setEstado);

  const configuracionActual = configuracionModalConfirmacion[estado as Estado];

  return (
    <div className="TabCrmContactos">
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
        orden={["id", "ASC"]}
        onOrdenar={() => null}
      />
      {configuracionActual?.nombre && (
        <QModalConfirmacion
          nombre={configuracionActual.nombre}
          abierto={
            estado === "confirmarBorrado" ||
            estado === "confirmarEliminarAsociacion"
          }
          titulo={configuracionActual.titulo}
          mensaje={configuracionActual.mensaje}
          onCerrar={() => emitir(configuracionActual.onCerrar)}
          onAceptar={() => emitir(configuracionActual.onAceptar)}
        />
      )}
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
        onCerrar={() => emitir("ASOCIAR_CERRAR")}
      >
        <h2>Asociar contacto</h2>
        <ContactoSelector
          valor={contactoSeleccionado?.valor || ""}
          descripcion=""
          nombre="cliente/contacto_id"
          label="Seleccionar contacto"
          onChange={(contacto) => setContactoSeleccionado(contacto)}
        />
        <div className="botones">
          <QBoton
            onClick={async () => {
              if (contactoSeleccionado) {
                emitir("ASOCIAR_CONTACTO");
              }
            }}
            deshabilitado={!contactoSeleccionado}
          >
            Guardar
          </QBoton>
          <QBoton
            tipo="reset"
            variante="texto"
            onClick={() => emitir("ASOCIAR_CERRAR")}
          >
            Cancelar
          </QBoton>
        </div>
      </QModal>
    </div>
  );
};
