import { useContext, useState } from "react";
import { useParams } from "react-router";
import { QBoton } from "../../../../../componentes/atomos/qboton.tsx";
import { Detalle } from "../../../../../componentes/detalle/Detalle.tsx";
import { Tab, Tabs } from "../../../../../componentes/detalle/tabs/Tabs.tsx";
import { QModalConfirmacion } from "../../../../../componentes/moleculas/qmodalconfirmacion.tsx";
import { ContextoError } from "../../../../comun/contexto.ts";
import { EmitirEvento, Entidad } from "../../../../comun/diseño.ts";
import { useModelo } from "../../../../comun/useModelo.ts";
import { Contacto } from "../../diseño.ts";
import { contactoVacio, metaContacto } from "../../dominio.ts";
import {
  deleteContacto,
  getContacto,
  patchContacto,
} from "../../infraestructura.ts";
import { TabAcciones } from "./Acciones/TabAcciones.tsx";
import { TabClientes } from "./Clientes/TabClientes.tsx";
import "./DetalleContacto.css";
import { TabOportunidades } from "./OportunidadesVenta/TabOportunidades.tsx";
import { TabGeneral } from "./TabGeneral.tsx";

export const DetalleContacto = ({
  contactoInicial = null,
  emitir = () => {},
}: {
  contactoInicial?: Contacto | null;
  emitir?: EmitirEvento;
}) => {
  const params = useParams();

  const contactoId = contactoInicial?.id ?? params.id;
  const titulo = (contacto: Entidad) => contacto.nombre as string;
  const { intentar } = useContext(ContextoError);

  const contacto = useModelo(metaContacto, contactoVacio());
  const { modelo, init, modificado, valido } = contacto;
  const [estado, setEstado] = useState<"confirmarBorrado" | "edicion">(
    "edicion"
  );

  const onGuardarClicked = async () => {
    await intentar(() => patchContacto(modelo.id, modelo));
    const contacto_guardado = await getContacto(modelo.id);
    init(contacto_guardado);
    emitir("CONTACTO_CAMBIADO", contacto_guardado);
  };

  const onRecargarContacto = async () => {
    const contactoRecargado = await getContacto(modelo.id);
    init(contactoRecargado);
    emitir("CONTACTO_CAMBIADO", contactoRecargado);
  };

  const onBorrarConfirmado = async () => {
    await intentar(() => deleteContacto(modelo.id));
    emitir("CONTACTO_BORRADO", modelo);
    setEstado("edicion");
  };

  return (
    <div className="DetalleContacto">
      <Detalle
        id={contactoId}
        obtenerTitulo={titulo}
        setEntidad={(c) => init(c as Contacto)}
        entidad={modelo}
        cargar={getContacto}
        className="detalle-contacto"
        cerrarDetalle={() => emitir("CANCELAR_SELECCION")}
      >
        {!!contactoId && (
          <div className="DetalleContacto">
            <div className="maestro-botones ">
              <QBoton onClick={() => setEstado("confirmarBorrado")}>
                Borrar
              </QBoton>
            </div>
            <Tabs
              children={[
                <Tab
                  key="tab-1"
                  label="General"
                  children={
                    <TabGeneral
                      contacto={contacto}
                      emitirContacto={emitir}
                      recargarContacto={onRecargarContacto}
                    />
                  }
                />,
                <Tab
                  key="tab-2"
                  label="Clientes"
                  children={
                    <div className="detalle-cliente-tab-contenido">
                      <TabClientes contacto={contacto} />
                    </div>
                  }
                />,
                <Tab
                  key="tab-4"
                  label="Oportunidades"
                  children={
                    <div className="detalle-cliente-tab-contenido">
                      <TabOportunidades contacto={contacto} />
                    </div>
                  }
                />,
                <Tab
                  key="tab-5"
                  label="Acciones"
                  children={
                    <div className="detalle-cliente-tab-contenido">
                      <TabAcciones contacto={contacto} />
                    </div>
                  }
                />,
              ]}
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
            <QModalConfirmacion
              nombre="borrarContacto"
              abierto={estado === "confirmarBorrado"}
              titulo="Confirmar borrar"
              mensaje="¿Está seguro de que desea borrar este contacto?"
              onCerrar={() => setEstado("edicion")}
              onAceptar={onBorrarConfirmado}
            />
          </div>
        )}
      </Detalle>
    </div>
  );
};
