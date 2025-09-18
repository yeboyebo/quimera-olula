import { useContext, useEffect } from "react";
import { QBoton } from "../../../../componentes/atomos/qboton.tsx";
import { QIcono } from "../../../../componentes/atomos/qicono.tsx";
import { Mostrar } from "../../../../componentes/moleculas/Mostrar.tsx";
import { ContextoError } from "../../../comun/contexto.ts";
import { EmitirEvento } from "../../../comun/diseño.ts";
import { ConfigMaquina4, useMaquina4 } from "../../../comun/useMaquina.ts";
import { useModelo } from "../../../comun/useModelo.ts";
import { ContactoSelector } from "../../../ventas/comun/componentes/contacto.tsx";
import { contactoVacio, metaContacto } from "../../contacto/dominio.ts";
import { getContacto } from "../../contacto/infraestructura.ts";
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
    },
    editando: {
      edicion_cancelada: "inactivo",
      contacto_guardado: "inactivo",
    },
  },
};

export const MoleculaContacto = ({
  contactoId = null,
  publicar = () => {},
}: {
  contactoId?: string | null;
  publicar?: EmitirEvento;
}) => {
  const { intentar } = useContext(ContextoError);
  const [emitir, { estado }] = useMaquina4<Estado, Contexto>({
    config: configMaquina,
  });
  const contacto = useModelo(metaContacto, contactoVacio);
  const { uiProps, init } = contacto;

  const onChangeContacto = (
    opcion: { valor: string; descripcion: string } | null
  ) => {
    if (opcion?.valor === contacto.modelo.id) return;
    uiProps("id").onChange(opcion);
    publicar("contacto_cambiado", opcion);
  };

  const onRecargarContacto = async () => {
    const contactoRecargado = await getContacto(contacto.modelo.id);
    init(contactoRecargado);
    publicar("contacto_cambiado", contactoRecargado);
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
  // console.log(contacto);
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
        publicar={emitir}
        activo={estado === "creando"}
        key={contactoId}
      />
      <Mostrar
        modo="modal"
        activo={estado === "editando"}
        onCerrar={() => emitir("edicion_cancelada")}
      >
        <TabGeneral
          contacto={contacto}
          emitirContacto={publicar}
          recargarContacto={onRecargarContacto}
        />
      </Mostrar>
    </div>
  );
};
