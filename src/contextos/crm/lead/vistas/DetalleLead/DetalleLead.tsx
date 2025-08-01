import { useContext, useState } from "react";
import { useParams } from "react-router";
import { QBoton } from "../../../../../componentes/atomos/qboton.tsx";
import { Detalle } from "../../../../../componentes/detalle/Detalle.tsx";
import { Tab, Tabs } from "../../../../../componentes/detalle/tabs/Tabs.tsx";
import { QModalConfirmacion } from "../../../../../componentes/moleculas/qmodalconfirmacion.tsx";
import { ContextoError } from "../../../../comun/contexto.ts";
import { EmitirEvento, Entidad } from "../../../../comun/diseño.ts";
import { Maquina, useMaquina } from "../../../../comun/useMaquina.ts";
import { useModelo } from "../../../../comun/useModelo.ts";
import { EstadoLead } from "../../../comun/componentes/estado_lead.tsx";
import { FuenteLead } from "../../../comun/componentes/fuente_lead.tsx";
import { Lead } from "../../diseño.ts";
import { leadVacio, metaLead } from "../../dominio.ts";
import { deleteLead, getLead, patchLead } from "../../infraestructura.ts";
import { TabAcciones } from "./Acciones/TabAcciones.tsx";
import "./DetalleLead.css";
import { TabOportunidades } from "./OportunidadesVenta/TabOportunidades.tsx";
import { TabDatos } from "./TabDatos.tsx";
import { TabObservaciones } from "./TabObservaciones.tsx";

type Estado = "defecto";

export const DetalleLead = ({
  leadInicial = null,
  emitir = () => {},
}: {
  leadInicial?: Lead | null;
  emitir?: EmitirEvento;
}) => {
  const params = useParams();
  const leadId = leadInicial?.id ?? params.id;
  const titulo = (lead: Entidad) => lead.nombre as string;
  const { intentar } = useContext(ContextoError);

  const lead = useModelo(metaLead, leadVacio);
  const { modelo, init } = lead;
  const [estado, setEstado] = useState<"confirmarBorrado" | "edicion">(
    "edicion"
  );

  const maquina: Maquina<Estado> = {
    defecto: {
      GUARDAR_INICIADO: async () => {
        await patchLead(modelo.id, modelo);
        recargarCabecera();
      },
    },
  };
  const emitirLead = useMaquina(maquina, "defecto", () => {});

  const recargarCabecera = async () => {
    const nuevoLead = await getLead(modelo.id);
    init(nuevoLead);
    emitir("LEAD_CAMBIADO", nuevoLead);
  };

  const onBorrarConfirmado = async () => {
    await intentar(() => deleteLead(modelo.id));
    emitir("LEAD_BORRADO", modelo);
    setEstado("edicion");
  };

  return (
    <Detalle
      id={leadId}
      obtenerTitulo={titulo}
      setEntidad={(l) => init(l)}
      entidad={modelo}
      cargar={getLead}
      cerrarDetalle={() => emitir("CANCELAR_SELECCION")}
    >
      {!!leadId && (
        <>
          <div className="maestro-botones ">
            <QBoton onClick={() => setEstado("confirmarBorrado")}>
              Borrar
            </QBoton>
          </div>
          <Tabs
            children={[
              <Tab
                key="tab-1"
                label="Datos"
                children={
                  <div className="TabDatos">
                    <quimera-formulario>
                      <EstadoLead {...lead.uiProps("estado_id")} />
                      <FuenteLead {...lead.uiProps("fuente_id")} />
                    </quimera-formulario>
                  </div>
                }
              />,
              <Tab
                key="tab-2"
                label="Más datos"
                children={<TabDatos lead={lead} />}
              />,
              <Tab
                key="tab-3"
                label="Observaciones"
                children={<TabObservaciones oportunidad={lead} />}
              />,
              <Tab
                key="tab-4"
                label="Oportunidades de Venta"
                children={<TabOportunidades lead={lead} />}
              />,
              <Tab
                key="tab-5"
                label="Acciones"
                children={<TabAcciones lead={lead} />}
              />,
            ]}
          ></Tabs>
          {lead.modificado && (
            <div className="botones maestro-botones">
              <QBoton
                onClick={() => emitirLead("GUARDAR_INICIADO")}
                deshabilitado={!lead.valido}
              >
                Guardar
              </QBoton>
              <QBoton tipo="reset" variante="texto" onClick={() => init()}>
                Cancelar
              </QBoton>
            </div>
          )}
          <QModalConfirmacion
            nombre="borrarLead"
            abierto={estado === "confirmarBorrado"}
            titulo="Confirmar borrar"
            mensaje="¿Está seguro de que desea borrar este lead?"
            onCerrar={() => setEstado("edicion")}
            onAceptar={onBorrarConfirmado}
          />
        </>
      )}
    </Detalle>
  );
};
