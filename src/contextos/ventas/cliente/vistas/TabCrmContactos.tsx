import { useCallback, useEffect, useState } from "react";
import { QBoton } from "../../../../componentes/atomos/qboton.tsx";
import { QForm } from "../../../../componentes/atomos/qform.tsx";
import { QInput } from "../../../../componentes/atomos/qinput.tsx";
import { QTabla } from "../../../../componentes/atomos/qtabla.tsx";
import {
  quitarEntidadDeLista,
  refrescarSeleccionada,
} from "../../../comun/dominio.ts";
import { CrmContacto } from "../diseño.ts";
import {
  deleteCrmContacto,
  getCrmContactos,
  patchCrmContacto,
  postCrmContacto,
} from "../infraestructura.ts";

const metaTablaCrmContactos = [
  { id: "id", cabecera: "ID" },
  { id: "nombre", cabecera: "Nombre" },
  { id: "email", cabecera: "Email" },
];

export const TabCrmContactos = ({ clienteId }: { clienteId: string }) => {
  const [modo, setModo] = useState<"lista" | "alta" | "edicion">("lista");
  const [contactos, setContactos] = useState<CrmContacto[]>([]);
  const [seleccionada, setSeleccionada] = useState<CrmContacto | null>(null);
  const [estado, setEstado] = useState({} as Record<string, string>);
  const [cargando, setCargando] = useState(true);

  const cargarContactos = useCallback(async () => {
    setCargando(true);
    const contactos = await getCrmContactos(clienteId);
    setContactos(contactos);
    refrescarSeleccionada(contactos, seleccionada?.id, (e) =>
      setSeleccionada(e as CrmContacto | null)
    );
    setCargando(false);
  }, [clienteId, seleccionada?.id]);

  useEffect(() => {
    if (clienteId) cargarContactos();
  }, [clienteId, cargarContactos]);

  const validarContacto = (datos: Record<string, string>) => {
    return {
      nombre: datos.nombre.trim() === "" ? "El nombre es obligatorio." : "",
      email: datos.email.trim() === "" ? "El email es obligatorio." : "",
    };
  };

  const onGuardarNuevoContacto = async (datos: Record<string, string>) => {
    const nuevoEstado = validarContacto(datos);
    setEstado(nuevoEstado);

    if (Object.values(nuevoEstado).some((v) => v.length > 0)) return;

    const nuevoContacto: CrmContacto = {
      id: crypto.randomUUID(),
      nombre: datos.nombre,
      email: datos.email,
    };

    await postCrmContacto(clienteId, nuevoContacto);
    setContactos([nuevoContacto, ...contactos]);
    setModo("lista");
  };

  const onGuardarEdicionContacto = async (datos: Record<string, string>) => {
    const nuevoEstado = validarContacto(datos);
    setEstado(nuevoEstado);

    if (Object.values(nuevoEstado).some((v) => v.length > 0)) return;

    if (seleccionada) {
      const contactoActualizado: CrmContacto = {
        ...seleccionada,
        nombre: datos.nombre,
        email: datos.email,
      };

      await patchCrmContacto(clienteId, contactoActualizado);
      setContactos(
        contactos.map((contacto) =>
          contacto.id === seleccionada.id ? contactoActualizado : contacto
        )
      );
      setSeleccionada(null);
      setModo("lista");
    }
  };

  const onBorrarContacto = async () => {
    if (!seleccionada) return;

    await deleteCrmContacto(clienteId, seleccionada.id);
    setContactos(quitarEntidadDeLista<CrmContacto>(contactos, seleccionada));
    setSeleccionada(null);
  };

  const onCancelar = () => {
    setSeleccionada(null);
    setModo("lista");
  };

  return (
    <>
      {modo === "lista" && (
        <>
          <h2>Contactos CRM</h2>
          <button onClick={() => setModo("alta")}>Nuevo</button>
          <button
            onClick={() => seleccionada && setModo("edicion")}
            disabled={!seleccionada}
          >
            Editar
          </button>
          <button onClick={onBorrarContacto} disabled={!seleccionada}>
            Borrar
          </button>
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
      )}

      {modo === "alta" && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={onCancelar}>
              &times;
            </span>
            <h2>Nuevo Contacto CRM</h2>
            <QForm onSubmit={onGuardarNuevoContacto} onReset={onCancelar}>
              <section>
                <QInput
                  label="Nombre"
                  nombre="nombre"
                  erroneo={!!estado.nombre && estado.nombre.length > 0}
                  textoValidacion={estado.nombre}
                />
                <QInput
                  label="Email"
                  nombre="email"
                  erroneo={!!estado.email && estado.email.length > 0}
                  textoValidacion={estado.email}
                />
              </section>
              <section>
                <QBoton tipo="submit">Guardar</QBoton>
                <QBoton tipo="reset" variante="texto">
                  Cancelar
                </QBoton>
              </section>
            </QForm>
          </div>
        </div>
      )}

      {modo === "edicion" && seleccionada && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={onCancelar}>
              &times;
            </span>
            <h2>Editar Contacto CRM</h2>
            <QForm onSubmit={onGuardarEdicionContacto} onReset={onCancelar}>
              <section>
                <QInput
                  label="Nombre"
                  nombre="nombre"
                  valor={seleccionada.nombre}
                  erroneo={!!estado.nombre && estado.nombre.length > 0}
                  textoValidacion={estado.nombre}
                />
                <QInput
                  label="Email"
                  nombre="email"
                  valor={seleccionada.email}
                  erroneo={!!estado.email && estado.email.length > 0}
                  textoValidacion={estado.email}
                />
              </section>
              <section>
                <QBoton tipo="submit">Guardar</QBoton>
                <QBoton tipo="reset" variante="texto">
                  Cancelar
                </QBoton>
              </section>
            </QForm>
          </div>
        </div>
      )}
    </>
  );
};
