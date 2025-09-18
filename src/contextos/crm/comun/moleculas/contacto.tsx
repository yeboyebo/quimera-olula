import { useContext, useEffect } from "react";
import { ContextoError } from "../../../comun/contexto.ts";
import { EmitirEvento } from "../../../comun/diseño.ts";
import { ConfigMaquina4, useMaquina4 } from "../../../comun/useMaquina.ts";
import { useModelo } from "../../../comun/useModelo.ts";
import { ContactoSelector } from "../../../ventas/comun/componentes/contacto.tsx";
import { contactoVacio, metaContacto } from "../../contacto/dominio.ts";
import { getContacto } from "../../contacto/infraestructura.ts";
import { AltaContacto } from "../../contacto/vistas/AltaContacto.tsx";
import "./contacto.css";

type Estado = "inactivo" | "creando" | "lista";
type Contexto = Record<string, unknown>;

const configMaquina: ConfigMaquina4<Estado, Contexto> = {
  inicial: {
    estado: "inactivo",
    contexto: {},
  },
  estados: {
    inactivo: {
      iniciar: "inactivo",
    },
    lista: {
      crear: "creando",
    },
    creando: {
      alta_cancelada: "inactivo",
      contacto_creado: "inactivo",
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
    publicar,
  });
  const contacto = useModelo(metaContacto, contactoVacio);
  const { uiProps, init } = contacto;

  const onChangeContacto = (
    opcion: { valor: string; descripcion: string } | null
  ) => {
    if (opcion?.valor === contacto.modelo.id) return;
    uiProps("id").onChange(opcion);
    console.log("Cambio contacto:", opcion);
    publicar("contacto_cambiado", opcion);
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
          <>ver</>
        ) : (
          // <Proveedor {...uiProps("proveedor_id", "nombre")} />
          <>crear</>
        )}
      </div>

      <AltaContacto
        publicar={emitir}
        activo={estado === "creando"}
        key={contactoId}
      />

      {/* <QTabla
        metaTabla={metaTablaContacto}
        datos={contactos.lista}
        cargando={estado === "Cargando"}
        seleccionadaId={contactos.idActivo || undefined}
        onSeleccion={(contacto) => emitir("contacto_seleccionada", contacto)}
        orden={["id", "ASC"]}
        onOrdenar={() => null}
      /> */}
    </div>
  );
};
