import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { Detalle } from "@olula/componentes/detalle/Detalle.tsx";
import { Tab, Tabs } from "@olula/componentes/detalle/tabs/Tabs.tsx";
import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { EmitirEvento, Entidad } from "@olula/lib/diseño.ts";
import { ConfigMaquina4, useMaquina4 } from "@olula/lib/useMaquina.ts";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useContext } from "react";
import { useParams } from "react-router";
import { OportunidadVenta } from "../../diseño.ts";
import { metaOportunidadVenta, oportunidadVentaVacia } from "../../dominio.ts";
import {
  deleteOportunidadVenta,
  getOportunidadVenta,
  patchOportunidadVenta,
} from "../../infraestructura.ts";
// import "./DetalleOportunidadVenta.css";
import { TabPresupuestos } from "./Presupuestos/TabPresupuestos.tsx";
import { TabAcciones } from "./TabAcciones.tsx";
import { TabDatos } from "./TabDatos.tsx";
import { TabObservaciones } from "./TabObservaciones.tsx";

type Estado = "edicion" | "borrando";
type Contexto = Record<string, unknown>;

const configMaquina: ConfigMaquina4<Estado, Contexto> = {
  inicial: {
    estado: "edicion",
    contexto: {},
  },
  estados: {
    edicion: {
      borrar: "borrando",
      oportunidad_guardada: ({ publicar }) => publicar("oportunidad_cambiada"),
      cancelar_seleccion: ({ publicar }) => publicar("seleccion_cancelada"),
    },
    borrando: {
      borrado_cancelado: "edicion",
      oportunidad_borrada: ({ publicar }) => publicar("oportunidad_borrada"),
    },
  },
};

export const DetalleOportunidadVenta = ({
  oportunidadInicial = null,
  publicar = () => {},
}: {
  oportunidadInicial?: OportunidadVenta | null;
  publicar?: EmitirEvento;
}) => {
  const params = useParams();
  const oportunidadId = oportunidadInicial?.id ?? params.id;
  const titulo = (oportunidad: Entidad) => oportunidad.descripcion as string;
  const { intentar } = useContext(ContextoError);

  const oportunidad = useModelo(metaOportunidadVenta, oportunidadVentaVacia);
  const { modelo, init, valido } = oportunidad;

  const [emitir, { estado }] = useMaquina4<Estado, Contexto>({
    config: configMaquina,
    publicar: publicar,
  });

  const onGuardarClicked = async () => {
    await intentar(() => patchOportunidadVenta(modelo.id, modelo));
    const oportunidad_guardada = await getOportunidadVenta(modelo.id);
    init(oportunidad_guardada);
    publicar("oportunidad_cambiada", oportunidad_guardada);
  };

  const onBorrarConfirmado = async () => {
    await intentar(() => deleteOportunidadVenta(modelo.id));
    publicar("oportunidad_borrada", modelo);
    emitir("borrado_cancelado");
  };

  return (
    <Detalle
      id={oportunidadId}
      obtenerTitulo={titulo}
      setEntidad={(o) => init(o)}
      entidad={modelo}
      cargar={getOportunidadVenta}
      cerrarDetalle={() => emitir("cancelar_seleccion")}
    >
      {!!oportunidadId && (
        <>
          <div className="maestro-botones ">
            <QBoton onClick={() => emitir("borrar")}>Borrar</QBoton>
          </div>
          <Tabs
            children={[
              <Tab
                key="tab-1"
                label="Datos"
                children={<TabDatos oportunidad={oportunidad} />}
              />,
              <Tab
                key="tab-2"
                label="Observaciones"
                children={<TabObservaciones oportunidad={oportunidad} />}
              />,
              <Tab
                key="tab-3"
                label="Acciones"
                children={<TabAcciones oportunidad={oportunidad} />}
              />,
              <Tab
                key="tab-4"
                label="Presupuestos"
                children={<TabPresupuestos oportunidad={oportunidad} />}
              />,
            ]}
          ></Tabs>
          {oportunidad.modificado && (
            <div className="botones maestro-botones">
              <QBoton onClick={onGuardarClicked} deshabilitado={!valido}>
                Guardar
              </QBoton>
              <QBoton tipo="reset" variante="texto" onClick={() => init()}>
                Cancelar
              </QBoton>
            </div>
          )}
          <QModalConfirmacion
            nombre="borrarOportunidad"
            abierto={estado === "borrando"}
            titulo="Confirmar borrar"
            mensaje="¿Está seguro de que desea borrar esta oportunidad de venta?"
            onCerrar={() => emitir("borrado_cancelado")}
            onAceptar={onBorrarConfirmado}
          />
        </>
      )}
    </Detalle>
  );
};
