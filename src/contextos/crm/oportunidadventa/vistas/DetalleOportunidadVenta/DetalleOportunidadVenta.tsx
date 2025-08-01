import { useParams } from "react-router";
import { QBoton } from "../../../../../componentes/atomos/qboton.tsx";
import { Detalle } from "../../../../../componentes/detalle/Detalle.tsx";
import { Tab, Tabs } from "../../../../../componentes/detalle/tabs/Tabs.tsx";
import { EmitirEvento, Entidad } from "../../../../comun/diseño.ts";
import { Maquina, useMaquina } from "../../../../comun/useMaquina.ts";
import { useModelo } from "../../../../comun/useModelo.ts";
import { OportunidadVenta } from "../../diseño.ts";
import { metaOportunidadVenta, oportunidadVentaVacia } from "../../dominio.ts";
import {
  deleteOportunidadVenta,
  getOportunidadVenta,
  patchOportunidadVenta,
} from "../../infraestructura.ts";
// import "./DetalleOportunidadVenta.css";
import { useContext, useState } from "react";
import { QModalConfirmacion } from "../../../../../componentes/moleculas/qmodalconfirmacion.tsx";
import { ContextoError } from "../../../../comun/contexto.ts";
import { TabAcciones } from "./Acciones/TabAcciones.tsx";
import { TabPresupuestos } from "./Presupuestos/TabPresupuestos.tsx";
import { TabDatos } from "./TabDatos.tsx";
import { TabObservaciones } from "./TabObservaciones.tsx";

type Estado = "defecto" | "confirmarBorrado";

export const DetalleOportunidadVenta = ({
  oportunidadInicial = null,
  emitir = () => {},
}: {
  oportunidadInicial?: OportunidadVenta | null;
  emitir?: EmitirEvento;
}) => {
  const params = useParams();
  const oportunidadId = oportunidadInicial?.id ?? params.id;
  const titulo = (oportunidad: Entidad) => oportunidad.descripcion as string;
  const { intentar } = useContext(ContextoError);

  const oportunidad = useModelo(metaOportunidadVenta, oportunidadVentaVacia);
  const { modelo, init } = oportunidad;
  const [estado, setEstado] = useState<"confirmarBorrado" | "edicion">(
    "edicion"
  );

  const maquina: Maquina<Estado> = {
    defecto: {
      GUARDAR_INICIADO: async () => {
        await intentar(() => patchOportunidadVenta(modelo.id, modelo));
        recargarCabecera();
      },
    },
    confirmarBorrado: {
      BORRAR_CANCELADO: "defecto",
    },
  };
  const emitirOportunidad = useMaquina(maquina, "defecto", () => {});

  const recargarCabecera = async () => {
    const nuevaOportunidad = await getOportunidadVenta(modelo.id);
    init(nuevaOportunidad);
    emitir("OPORTUNIDAD_CAMBIADA", nuevaOportunidad);
  };

  const onBorrarConfirmado = async () => {
    await intentar(() => deleteOportunidadVenta(modelo.id));
    emitir("OPORTUNIDAD_BORRADA", modelo);
    setEstado("edicion");
  };

  return (
    <Detalle
      id={oportunidadId}
      obtenerTitulo={titulo}
      setEntidad={(o) => init(o)}
      entidad={modelo}
      cargar={getOportunidadVenta}
      cerrarDetalle={() => emitir("CANCELAR_SELECCION")}
    >
      {!!oportunidadId && (
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
              <QBoton
                onClick={() => emitirOportunidad("GUARDAR_INICIADO")}
                deshabilitado={!oportunidad.valido}
              >
                Guardar
              </QBoton>
              <QBoton tipo="reset" variante="texto" onClick={() => init()}>
                Cancelar
              </QBoton>
            </div>
          )}
          <QModalConfirmacion
            nombre="borrarOportunidad"
            abierto={estado === "confirmarBorrado"}
            titulo="Confirmar borrar"
            mensaje="¿Está seguro de que desea borrar esta oportunidad de venta?"
            onCerrar={() => setEstado("edicion")}
            onAceptar={onBorrarConfirmado}
          />
        </>
      )}
    </Detalle>
  );
};
