import { useMaquina } from "@olula/componentes/hook/useMaquina.js";
import { Detalle, QBoton, Tab, Tabs } from "@olula/componentes/index.js";
import { EmitirEvento, Entidad } from "@olula/lib/diseño.js";
import { useModelo } from "@olula/lib/useModelo.js";
import { useParams } from "react-router";
import { BorrarContacto } from "../borrar/BorrarContacto.tsx";
import { Contacto } from "../diseño.ts";
import { TabClientes } from "../vistas/DetalleContacto/Clientes/TabClientes.tsx";
import { Acciones } from "./acciones/Acciones.tsx";
import { contactoVacio, metaContacto } from "./detalle.ts";
import "./DetalleContacto.css";
import { getMaquina } from "./maquina.ts";
import { Oportunidades } from "./oportunidades/Oportunidades.tsx";
import { TabGeneral } from "./tabs/TabGeneral.tsx";

export const DetalleContacto = ({
  inicial = null,
  publicar,
}: {
  inicial: Contacto | null;
  publicar: EmitirEvento;
}) => {
  const params = useParams();

  const contactoId = inicial?.id ?? params.id;
  const titulo = (contacto: Entidad) => contacto.nombre as string;

  const contacto = useModelo(metaContacto, contactoVacio);
  const { modelo, modeloInicial, modificado, valido, init } = contacto;

  const { ctx, emitir } = useMaquina(
    getMaquina,
    {
      estado: "INICIAL",
      contacto: modelo,
      inicial: modeloInicial,
    },
    publicar
  );

  if (ctx.contacto !== modeloInicial) {
    init(ctx.contacto);
  }

  if (contactoId && contactoId !== modelo.id) {
    emitir("contacto_id_cambiado", contactoId);
  }

  return (
    <Detalle
      id={contactoId}
      obtenerTitulo={titulo}
      setEntidad={() => {}}
      entidad={modelo}
      cerrarDetalle={() => emitir("edicion_contacto_cancelada", null)}
    >
      {!!contactoId && (
        <div className="DetalleContacto">
          <div className="maestro-botones ">
            <QBoton onClick={() => emitir("borrado_contacto_solicitado")}>
              Borrar
            </QBoton>
          </div>

          <Tabs>
            <Tab label="General">
              <TabGeneral contacto={contacto} />
            </Tab>

            <Tab label="Clientes">
              <TabClientes contacto={contacto} />
            </Tab>

            <Tab label="Oportunidades">
              <Oportunidades contacto={contacto} />
            </Tab>

            <Tab label="Acciones">
              <Acciones contacto={contacto} />
            </Tab>
          </Tabs>

          {modificado && (
            <div className="botones maestro-botones">
              <QBoton
                onClick={() => emitir("contacto_cambiado", modelo)}
                deshabilitado={!valido}
              >
                Guardar
              </QBoton>
              <QBoton
                tipo="reset"
                variante="texto"
                onClick={() => emitir("edicion_contacto_cancelada")}
              >
                Cancelar
              </QBoton>
            </div>
          )}
          {ctx.estado === "BORRANDO" && (
            <BorrarContacto publicar={emitir} contacto={modelo} />
          )}
        </div>
      )}
    </Detalle>
  );
};
