import { ContactoSelector } from "#/ventas/comun/componentes/contacto.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QIcono } from "@olula/componentes/atomos/qicono.tsx";
import { Mostrar } from "@olula/componentes/moleculas/Mostrar.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { ConfigMaquina4, useMaquina4 } from "@olula/lib/useMaquina.ts";
import { useModelo, ValorControl } from "@olula/lib/useModelo.ts";
import { useContext, useEffect } from "react";
import { Contacto } from "../../contacto/diseño.ts";
import { contactoVacio, metaContacto } from "../../contacto/dominio.ts";
import { getContacto, patchContacto } from "../../contacto/infraestructura.ts";
import { AltaContacto } from "../../contacto/vistas/AltaContacto.tsx";
import { TabGeneral } from "../../contacto/vistas/DetalleContacto/TabGeneral.tsx";
import "./contacto.css";

type Estado = "inactivo" | "creando" | "editando";
type Contexto = Record<string, unknown>;

const configMaquina: ConfigMaquina4<Estado, Contexto> = {
  inicial: {
    estado: "inactivo",
    contexto: {},
  },
  estados: {
    inactivo: {
      iniciar: "inactivo",
      crear_contacto: "creando",
      editar_contacto: "editando",
      cargar: "inactivo",
    },
    creando: {
      alta_cancelada: "inactivo",
      contacto_creado: "inactivo",
      creacion_cancelada: "inactivo",
    },
    editando: {
      edicion_cancelada: "inactivo",
      contacto_guardado: "inactivo",
    },
  },
};

export const MoleculaContacto = ({
  contactoId = null,
  onChange,
}: {
  contactoId?: string | null;
  onChange: (valor: ValorControl) => void;
}) => {
  const { intentar } = useContext(ContextoError);
  const [emitir, { estado }] = useMaquina4<Estado, Contexto>({
    config: configMaquina,
  });
  const contacto = useModelo(metaContacto, contactoVacio);
  const { uiProps, init, modelo, valido, modificado } = contacto;

  const emitir_contacto = (evento: string, payload: unknown) => {
    if (evento === "contacto_creado") {
      emitir("contacto_creado");
      onChange((payload as Contacto).id);
    } else if (evento === "contacto_cambiado") {
      emitir("contacto_guardado");
      onChange((payload as Contacto).id);
    } else {
      emitir(evento, payload);
    }
  };

  const onGuardarClicked = async () => {
    await intentar(() => patchContacto(modelo.id, modelo));
    onRecargarContacto();
    emitir("contacto_guardado");
  };

  const onChangeContacto = (
    opcion: { valor: string; descripcion: string } | null
  ) => {
    if (opcion?.valor === contacto.modelo.id) return;
    onChange(opcion ? opcion.valor : null);
  };

  const onRecargarContacto = async () => {
    const contactoRecargado = await getContacto(contacto.modelo.id);
    init(contactoRecargado);
    emitir_contacto("contacto_cambiado", contactoRecargado);
  };

  useEffect(() => {
    const cargaContacto = async () => {
      if (!contactoId) return;
      const contactoCargado = await intentar(() => getContacto(contactoId));
      init(contactoCargado);
    };

    emitir("cargar");
    if (contactoId) cargaContacto();
    else init(contactoVacio);
  }, [contactoId, emitir, intentar, init]);

  return (
    <div className="MoleculaContacto">
      <div className="MoleculaContactoCampos">
        <ContactoSelector
          {...uiProps("id", "nombre")}
          onChange={onChangeContacto}
          nombre="contacto_id"
          label="Contacto"
        />
        {contacto.modelo.id ? (
          <QBoton
            variante="texto"
            tamaño="pequeño"
            onClick={() => emitir("editar_contacto")}
          >
            <QIcono nombre="editar_2" />
          </QBoton>
        ) : (
          <QBoton
            variante="texto"
            tamaño="pequeño"
            onClick={() => emitir("crear_contacto")}
          >
            <QIcono nombre={"crear"} />
          </QBoton>
        )}
      </div>

      <AltaContacto
        publicar={emitir_contacto}
        activo={estado === "creando"}
        key={contactoId}
      />
      <Mostrar
        modo="modal"
        activo={estado === "editando"}
        onCerrar={() => emitir("edicion_cancelada")}
      >
        <>
          <TabGeneral
            contacto={contacto}
            recargarContacto={onRecargarContacto}
          />
          {contacto.modificado && (
            <div className="maestro-botones ">
              <QBoton onClick={onGuardarClicked} deshabilitado={!valido}>
                Guardar
              </QBoton>
              <QBoton
                tipo="reset"
                variante="texto"
                onClick={() => init()}
                deshabilitado={!modificado}
              >
                Cancelar
              </QBoton>
            </div>
          )}
        </>
      </Mostrar>
    </div>
  );
};
