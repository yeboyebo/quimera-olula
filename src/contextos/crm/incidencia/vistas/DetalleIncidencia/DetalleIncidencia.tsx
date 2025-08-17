import { useContext, useState } from "react";
import { useParams } from "react-router";
import { QBoton } from "../../../../../componentes/atomos/qboton.tsx";
import { Detalle } from "../../../../../componentes/detalle/Detalle.tsx";
// import { Tab, Tabs } from "../../../../../componentes/detalle/tabs/Tabs.tsx";
import { QModalConfirmacion } from "../../../../../componentes/moleculas/qmodalconfirmacion.tsx";
import { ContextoError } from "../../../../comun/contexto.ts";
import { EmitirEvento, Entidad } from "../../../../comun/diseño.ts";
import { Maquina, useMaquina } from "../../../../comun/useMaquina.ts";
import { useModelo } from "../../../../comun/useModelo.ts";
// import { EstadoIncidencia } from "../../../comun/componentes/estado_incidencia.tsx";
// import { FuenteIncidencia } from "../../../comun/componentes/fuente_incidencia.tsx";
import { Incidencia } from "../../diseño.ts";
import { IncidenciaVacia, metaIncidencia } from "../../dominio.ts";
import { deleteIncidencia, getIncidencia, patchIncidencia } from "../../infraestructura.ts";
import "./DetalleIncidencia.css";
// import { TabAcciones } from "./Acciones/TabAcciones.tsx";
// import { TabOportunidades } from "./OportunidadesVenta/TabOportunidades.tsx";
// import { TabDatos } from "./TabDatos.tsx";
// import { TabObservaciones } from "./TabObservaciones.tsx";
import { QDate } from "../../../../../componentes/atomos/qdate.tsx";
import { QInput } from "../../../../../componentes/atomos/qinput.tsx";
import { QTextArea } from "../../../../../componentes/atomos/qtextarea.tsx";
import { Tab, Tabs } from "../../../../../componentes/detalle/tabs/Tabs.tsx";
import { Usuario } from "../../../../comun/componentes/usuario.tsx";
import { EstadoIncidencia } from "../../../comun/componentes/EstadoIncidencia.tsx";
import { PrioridadIncidencia } from "../../../comun/componentes/PrioridadIncidencia.tsx";
import { TabAcciones } from "./Acciones/TabAcciones.tsx";

type Estado = "defecto";

export const DetalleIncidencia = ({
  incidenciaInicial = null,
  emitir = () => {},
}: {
  incidenciaInicial?: Incidencia | null;
  emitir?: EmitirEvento;
}) => {
  const params = useParams();
  const incidenciaId = incidenciaInicial?.id ?? params.id;
  const titulo = (incidencia: Entidad) => incidencia.descripcion as string;
  const { intentar } = useContext(ContextoError);

  const incidencia = useModelo(metaIncidencia, IncidenciaVacia);
  const { modelo, uiProps, init } = incidencia;
  const [estado, setEstado] = useState<"confirmarBorrado" | "edicion">(
    "edicion"
  );

  const maquina: Maquina<Estado> = {
    defecto: {
      GUARDAR_INICIADO: async () => {
        await patchIncidencia(modelo.id, modelo);
        recargarCabecera();
      },
    },
  };
  const emitirIncidencia = useMaquina(maquina, "defecto", () => {});

  const recargarCabecera = async () => {
    const nuevoIncidencia = await getIncidencia(modelo.id);
    init(nuevoIncidencia);
    emitir("INCIDENCIA_CAMBIADA", nuevoIncidencia);
  };

  const onBorrarConfirmado = async () => {
    await intentar(() => deleteIncidencia(modelo.id));
    emitir("INCIDENCIA_BORRADA", modelo);
    setEstado("edicion");
  };


  return (
    <Detalle
      id={incidenciaId}
      obtenerTitulo={titulo}
      setEntidad={(l) => init(l)}
      entidad={modelo}
      cargar={getIncidencia}
      cerrarDetalle={() => emitir("CANCELAR_SELECCION")}
    >
      {!!incidenciaId && (
        <>
          <div className="maestro-botones ">
            <QBoton onClick={() => setEstado("confirmarBorrado")}>
              Borrar
            </QBoton>
          </div>
          <div className="DetalleIncidencia">
            <quimera-formulario>
              <QInput label="Descripción" {...uiProps("descripcion")} />
              <QInput label="Nombre" {...uiProps("nombre")} />
              <QDate label="Fecha" {...uiProps("fecha")} />
              <PrioridadIncidencia {...uiProps("prioridad")}/>
              <EstadoIncidencia {...uiProps("estado")}/>
              <Usuario {...uiProps("responsable_id", "nombre_responsable")} label='Responsable'/>
              <div className="Tabs">
              <Tabs
                children={[
                  <Tab
                    key="tab-1"
                    label="Descripción"
                    children={
                      <QTextArea
                        label="Descripción larga"
                        rows={5}
                        {...uiProps("descripcion_larga")}
                      />
                    }
                  />,
                  <Tab
                    key="tab-2"
                    label="Resolución"
                    children={
                      <QTextArea
                        label="Resolución"
                        rows={5}
                        {...uiProps("resolucion")}
                      />}
                  />,
                  <Tab
                    key="tab-3"
                    label="Acciones"
                    children={
                      <div className="detalle-incidencia-tab-contenido">
                        <TabAcciones incidencia={incidencia} />
                      </div>
                    }
                  />,
                ]}
              ></Tabs>
              </div>
            </quimera-formulario>
          </div>
          {incidencia.modificado && (
            <div className="botones maestro-botones">
              <QBoton
                onClick={() => emitirIncidencia("GUARDAR_INICIADO")}
                deshabilitado={!incidencia.valido}
              >
                Guardar
              </QBoton>
              <QBoton tipo="reset" variante="texto" onClick={() => init()}>
                Cancelar
              </QBoton>
            </div>
          )}
          <QModalConfirmacion
            nombre="borrarIncidencia"
            abierto={estado === "confirmarBorrado"}
            titulo="Confirmar borrar"
            mensaje="¿Está seguro de que desea borrar este incidencia?"
            onCerrar={() => setEstado("edicion")}
            onAceptar={onBorrarConfirmado}
          />
        </>
      )}
    </Detalle>
  );
};
