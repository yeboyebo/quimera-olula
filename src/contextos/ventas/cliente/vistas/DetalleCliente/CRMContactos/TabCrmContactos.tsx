import { useCallback, useContext, useEffect, useState } from "react";
import { QBoton } from "../../../../../../componentes/atomos/qboton.tsx";
import { QTabla } from "../../../../../../componentes/atomos/qtabla.tsx";
import { QuimeraAcciones } from "../../../../../../componentes/moleculas/qacciones.tsx";
import { QModal } from "../../../../../../componentes/moleculas/qmodal.tsx";
import { QModalConfirmacion } from "../../../../../../componentes/moleculas/qmodalconfirmacion.tsx";
import { ContextoError } from "../../../../../comun/contexto.ts";
import { useLista } from "../../../../../comun/useLista.ts";
import { Maquina, useMaquina } from "../../../../../comun/useMaquina.ts";
import {
  desvincularContactoCliente,
  vincularContactoCliente,
} from "../../../../../crm/cliente/infraestructura.ts";
import { ContactoSelector } from "../../../../comun/componentes/contacto.tsx";
import { CrmContacto } from "../../../diseño.ts";
import {
  deleteCrmContacto,
  getCrmContactosCliente,
} from "../../../infraestructura.ts";
import { AltaCrmContactos } from "./CrearCrmContactos.tsx";
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
  | "confirmar_borrado"
  | "confirmar_eliminar_asociacion";

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
  confirmar_borrado: {
    nombre: "confirmacionBorrarContacto",
    titulo: "Confirmar borrar",
    mensaje: "¿Está seguro de que desea borrar este contacto?",
    onCerrar: "borrado_cancelado",
    onAceptar: "borrado_solicitado",
  },
  confirmar_eliminar_asociacion: {
    nombre: "confirmacionEliminarAsociacion",
    titulo: "Confirmar eliminación de asociación",
    mensaje:
      "¿Está seguro de que desea eliminar la asociación de este contacto?",
    onCerrar: "eliminacion_cancelada",
    onAceptar: "eliminacion_solicitada",
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
      alta_solicitada: "alta",
      edicion_solicitada: "edicion",
      contacto_seleccionado: (payload: unknown) => {
        const contacto = payload as CrmContacto;
        contactos.seleccionar(contacto);
      },
      confirmar_borrado: "confirmar_borrado",
      eliminar_asociacion: "confirmar_eliminar_asociacion",
      asociar_solicitado: "asociar",
    },
    alta: {
      contacto_creado: async (payload: unknown) => {
        const nuevoContacto = payload as CrmContacto;
        contactos.añadir(nuevoContacto);
        await intentar(() =>
          vincularContactoCliente(nuevoContacto.id, clienteId)
        );
        return "lista" as Estado;
      },
      alta_cancelada: "lista",
    },
    edicion: {
      contacto_actualizado: async (payload: unknown) => {
        const contactoActualizado = payload as CrmContacto;
        contactos.modificar(contactoActualizado);
        return "lista" as Estado;
      },
      edicion_cancelada: "lista",
    },
    asociar: {
      asociar_cerrar: "lista",
      asociar_contacto: async () => {
        if (!contactoSeleccionado) return;
        await intentar(() =>
          vincularContactoCliente(contactoSeleccionado.valor, clienteId)
        );
        await cargarContactos();
        return "lista" as Estado;
      },
    },
    confirmar_borrado: {
      borrado_solicitado: async () => {
        if (!contactos.seleccionada) return;
        const idContacto = contactos.seleccionada.id;
        if (!idContacto) return;
        await intentar(() => deleteCrmContacto(idContacto));
        contactos.eliminar(contactos.seleccionada);
        return "lista" as Estado;
      },
      borrado_cancelado: "lista",
    },
    confirmar_eliminar_asociacion: {
      eliminacion_solicitada: async () => {
        if (!contactos.seleccionada) return;
        const idContacto = contactos.seleccionada.id;
        if (!idContacto) return;
        await intentar(() => desvincularContactoCliente(idContacto, clienteId));
        contactos.eliminar(contactos.seleccionada);
        return "lista" as Estado;
      },
      eliminacion_cancelada: "lista",
    },
  };

  const emitir = useMaquina(maquina, estado, setEstado);

  const configuracionActual = configuracionModalConfirmacion[estado as Estado];

  const acciones = [
    {
      texto: "Editar",
      onClick: () => contactos.seleccionada && emitir("edicion_solicitada"),
      deshabilitado: !contactos.seleccionada,
    },
    {
      texto: "Borrar",
      onClick: () => emitir("confirmar_borrado"),
      deshabilitado: !contactos.seleccionada,
    },
    {
      texto: "Eliminar asociación",
      onClick: () => emitir("eliminar_asociacion"),
      deshabilitado: !contactos.seleccionada,
    },
    {
      texto: "Asociar",
      onClick: () => emitir("asociar_solicitado"),
    },
  ];

  return (
    <div className="TabCrmContactos">
      <div className="detalle-contacto-tab-contenido maestro-botones">
        <QBoton onClick={() => emitir("alta_solicitada")}>Nuevo</QBoton>
        <QuimeraAcciones acciones={acciones} vertical />
      </div>
      <QTabla
        metaTabla={metaTablaCrmContactos}
        datos={contactos.lista}
        cargando={cargando}
        seleccionadaId={contactos.seleccionada?.id}
        onSeleccion={(contacto) => emitir("contacto_seleccionado", contacto)}
        orden={["id", "ASC"]}
        onOrdenar={() => null}
      />
      {configuracionActual?.nombre && (
        <QModalConfirmacion
          nombre={configuracionActual.nombre}
          abierto={
            estado === "confirmar_borrado" ||
            estado === "confirmar_eliminar_asociacion"
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
        onCerrar={() => emitir("alta_cancelada")}
      >
        <AltaCrmContactos clienteId={clienteId} emitir={emitir} />
      </QModal>
      <QModal
        nombre="edicionCrmContacto"
        abierto={estado === "edicion"}
        onCerrar={() => emitir("edicion_cancelada")}
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
        onCerrar={() => emitir("asociar_cerrar")}
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
                emitir("asociar_contacto");
              }
            }}
            deshabilitado={!contactoSeleccionado}
          >
            Guardar
          </QBoton>
          <QBoton
            tipo="reset"
            variante="texto"
            onClick={() => emitir("asociar_cerrar")}
          >
            Cancelar
          </QBoton>
        </div>
      </QModal>
    </div>
  );
};
