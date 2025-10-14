import { EstadoAccion } from "#/crm/comun/componentes/estado_accion.tsx";
import { TipoAccion } from "#/crm/comun/componentes/tipo_accion.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { Detalle } from "@olula/componentes/detalle/Detalle.tsx";
import { Tab, Tabs } from "@olula/componentes/detalle/tabs/Tabs.tsx";
import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { EmitirEvento, Entidad } from "@olula/lib/diseño.ts";
import { ConfigMaquina4, useMaquina4 } from "@olula/lib/useMaquina.ts";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useParams } from "react-router";
import { Accion } from "../../diseño.ts";
import { accionVacia, metaAccion } from "../../dominio.ts";
import {
  finalizarAccion,
  getAccion,
  patchAccion,
} from "../../infraestructura.ts";
import { BajaAccion } from "../BajaAccion.tsx";
import "./DetalleAccion.css";
import { TabDatos } from "./TabDatos.tsx";
import { TabObservaciones } from "./TabObservaciones.tsx";

type Estado = "inactivo" | "borrando" | "confirmar_finalizar";
type Contexto = Record<string, unknown>;

const configMaquina: ConfigMaquina4<Estado, Contexto> = {
  inicial: {
    estado: "inactivo",
    contexto: {},
  },
  estados: {
    inactivo: {
      borrar: "borrando",
      finalizar: "confirmar_finalizar",
      cancelar: ({ publicar }) => publicar("cancelar"),
    },
    borrando: {
      borrado_cancelado: "inactivo",
      accion_borrada: ({ publicar }) => publicar("accion_borrada"),
    },
    confirmar_finalizar: {
      finalizacion_cancelada: "inactivo",
      accion_finalizada: ({ publicar }) => publicar("accion_cambiada"),
    },
  },
};

export const DetalleAccion = ({
  accionInicial = null,
  publicar = () => {},
}: {
  accionInicial?: Accion | null;
  publicar?: EmitirEvento;
}) => {
  const params = useParams();
  const accionId = accionInicial?.id ?? params.id;
  const titulo = (accion: Entidad) => accion.descripcion as string;

  const accion = useModelo(metaAccion, accionVacia);
  const { modelo, init, modificado, valido, uiProps } = accion;

  const [emitir, { estado }] = useMaquina4<Estado, Contexto>({
    config: configMaquina,
    publicar: publicar,
  });

  const guardar = async () => {
    await patchAccion(modelo.id, modelo);
    recargarCabecera();
    publicar("accion_cambiada", modelo);
  };

  const cancelar = () => {
    init();
    emitir("cancelar");
  };

  const recargarCabecera = async () => {
    const nuevaAccion = await getAccion(modelo.id);
    init(nuevaAccion);
    publicar("accion_cambiada", nuevaAccion);
  };

  const finalizarConfirmado = async () => {
    await finalizarAccion(modelo.id);
    const accion_finalizada = await getAccion(modelo.id);
    init(accion_finalizada);
    emitir("accion_finalizada", accion_finalizada);
  };

  return (
    <Detalle
      id={accionId}
      obtenerTitulo={titulo}
      setEntidad={(a) => init(a)}
      entidad={modelo}
      cargar={getAccion}
      cerrarDetalle={() => publicar("seleccion_cancelada")}
    >
      {!!accionId && (
        <>
          <div className="botones maestro-botones ">
            <QBoton onClick={() => emitir("finalizar")}>Finalizar</QBoton>
            <QBoton onClick={() => emitir("borrar")}>Borrar</QBoton>
          </div>

          <Tabs
            children={[
              <Tab
                key="tab-1"
                label="Datos"
                children={
                  <div className="TabDatos">
                    <quimera-formulario>
                      <QInput label="Descripción" {...uiProps("descripcion")} />
                      <QInput label="Fecha" {...uiProps("fecha")} />
                      <EstadoAccion {...uiProps("estado")} />
                      <TipoAccion {...uiProps("tipo")} />
                    </quimera-formulario>
                  </div>
                }
              />,
              <Tab
                key="tab-2"
                label="Más datos"
                children={<TabDatos accion={accion} />}
              />,
              <Tab
                key="tab-3"
                label="Observaciones"
                children={<TabObservaciones oportunidad={accion} />}
              />,
            ]}
          ></Tabs>
          {modificado && (
            <div className="botones maestro-botones">
              <QBoton onClick={guardar} deshabilitado={!valido}>
                Guardar
              </QBoton>
              <QBoton tipo="reset" variante="texto" onClick={cancelar}>
                Cancelar
              </QBoton>
            </div>
          )}
          <QModalConfirmacion
            nombre="finalizarAccion"
            abierto={estado === "confirmar_finalizar"}
            titulo="Finalizar acción"
            mensaje="¿Está seguro de que desea finalizar esta acción?"
            onCerrar={() => emitir("finalizacion_cancelada")}
            onAceptar={finalizarConfirmado}
          />
          <BajaAccion
            publicar={emitir}
            activo={estado === "borrando"}
            idAccion={modelo.id}
          />
        </>
      )}
    </Detalle>
  );
};
