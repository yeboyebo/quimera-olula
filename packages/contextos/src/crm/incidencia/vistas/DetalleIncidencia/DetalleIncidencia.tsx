import { Usuario } from "#/comun/componentes/usuario.tsx";
import { EstadoIncidencia } from "#/crm/comun/componentes/EstadoIncidencia.tsx";
import { PrioridadIncidencia } from "#/crm/comun/componentes/PrioridadIncidencia.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QDate } from "@olula/componentes/atomos/qdate.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QTextArea } from "@olula/componentes/atomos/qtextarea.tsx";
import { Detalle } from "@olula/componentes/detalle/Detalle.tsx";
import { Tab, Tabs } from "@olula/componentes/detalle/tabs/Tabs.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { EmitirEvento, Entidad } from "@olula/lib/diseño.ts";
import { ConfigMaquina4, useMaquina4 } from "@olula/lib/useMaquina.ts";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useContext } from "react";
import { useParams } from "react-router";
import { Incidencia } from "../../diseño.ts";
import { incidenciaVacia, metaIncidencia } from "../../dominio.ts";
import { getIncidencia, patchIncidencia } from "../../infraestructura.ts";
import { BorrarIncidencia } from "./BorrarIncidencia.tsx";
import "./DetalleIncidencia.css";
import { TabAcciones } from "./TabAcciones.tsx";

type Estado = "Editando" | "Borrando";
type Contexto = Record<string, unknown>;
const configMaquina: ConfigMaquina4<Estado, Contexto> = {
  inicial: {
    estado: "Editando",
    contexto: {},
  },
  estados: {
    Editando: {
      borrar: "Borrando",
      incidencia_guardada: ({ publicar }) => publicar("incidencia_guardada"),
      cancelar_seleccion: ({ publicar }) => publicar("seleccion_cancelada"),
    },
    Borrando: {
      borrado_cancelado: "Editando",
      incidencia_borrada: ({ publicar }) => publicar("incidencia_borrada"),
    },
  },
};

const titulo = (incidencia: Entidad) => incidencia.descripcion as string;

export const DetalleIncidencia = ({
  incidenciaInicial = null,
  publicar = () => {},
}: {
  incidenciaInicial?: Incidencia | null;
  publicar?: EmitirEvento;
}) => {
  const params = useParams();
  const { intentar } = useContext(ContextoError);

  const incidencia = useModelo(metaIncidencia, incidenciaVacia);
  const { modelo, uiProps, init } = incidencia;

  const guardar = async () => {
    await intentar(() => patchIncidencia(modelo.id, modelo));
    recargarCabecera();
    emitir("incidencia_guardada");
  };

  const cancelar = () => {
    init();
  };

  const [emitir, { estado }] = useMaquina4<Estado, Contexto>({
    config: configMaquina,
    publicar,
  });

  const recargarCabecera = async () => {
    const nuevaIncidencia = await intentar(() => getIncidencia(modelo.id));
    init(nuevaIncidencia);
    publicar("incidencia_cambiada", nuevaIncidencia);
  };

  const incidenciaId = incidenciaInicial?.id ?? params.id;

  return (
    <Detalle
      id={incidenciaId}
      obtenerTitulo={titulo}
      setEntidad={(accionInicial) => init(accionInicial)}
      entidad={modelo}
      cargar={getIncidencia}
      cerrarDetalle={() => emitir("cancelar_seleccion")}
    >
      {!!incidenciaId && (
        <>
          <div className="maestro-botones ">
            <QBoton onClick={() => emitir("borrar")}>Borrar</QBoton>
          </div>
          <div className="DetalleIncidencia">
            <Tabs
              children={[
                <Tab key="general" label="General">
                  <quimera-formulario>
                    <QInput label="Descripción" {...uiProps("descripcion")} />
                    <QInput label="Nombre" {...uiProps("nombre")} />
                    <QDate label="Fecha" {...uiProps("fecha")} />
                    <PrioridadIncidencia {...uiProps("prioridad")} />
                    <EstadoIncidencia {...uiProps("estado")} />
                    <Usuario
                      {...uiProps("responsable_id", "nombre_responsable")}
                      label="Responsable"
                    />
                    <div className="Tabs">
                      <Tabs
                        children={[
                          <Tab key="tab-1" label="Descripción">
                            <QTextArea
                              label="Descripción larga"
                              rows={5}
                              {...uiProps("descripcion_larga")}
                            />
                          </Tab>,
                          <Tab key="tab-2" label="Resolución">
                            <QTextArea
                              label="Resolución"
                              rows={5}
                              {...uiProps("resolucion")}
                            />
                          </Tab>,
                        ]}
                      ></Tabs>
                    </div>
                  </quimera-formulario>
                </Tab>,
                <Tab key="tab-3" label="Acciones">
                  <div className="detalle-incidencia-tab-contenido">
                    <TabAcciones incidencia={incidencia} />
                  </div>
                </Tab>,
              ]}
            ></Tabs>
          </div>
          {incidencia.modificado && (
            <div className="botones maestro-botones">
              <QBoton onClick={guardar} deshabilitado={!incidencia.valido}>
                Guardar
              </QBoton>
              <QBoton
                tipo="reset"
                variante="texto"
                onClick={cancelar}
                deshabilitado={!incidencia.modificado}
              >
                Cancelar
              </QBoton>
            </div>
          )}
          <BorrarIncidencia
            publicar={emitir}
            activo={estado === "Borrando"}
            incidencia={modelo}
          />
        </>
      )}
    </Detalle>
  );
};
