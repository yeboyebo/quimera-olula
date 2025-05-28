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
  getOportunidadVenta,
  patchOportunidadVenta,
} from "../../infraestructura.ts";
// import "./DetalleOportunidadVenta.css";
import { TabDatos } from "./TabDatos.tsx";
import { TabObservaciones } from "./TabObservaciones.tsx";

type Estado = "defecto";

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

  const oportunidad = useModelo(metaOportunidadVenta, oportunidadVentaVacia);
  const { modelo, init } = oportunidad;

  const maquina: Maquina<Estado> = {
    defecto: {
      GUARDAR_INICIADO: async () => {
        await patchOportunidadVenta(modelo.id, modelo);
        recargarCabecera();
      },
    },
  };
  const emitirOportunidad = useMaquina(maquina, "defecto", () => {});

  const recargarCabecera = async () => {
    const nuevaOportunidad = await getOportunidadVenta(modelo.id);
    init(nuevaOportunidad);
    emitir("OPORTUNIDAD_CAMBIADA", nuevaOportunidad);
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
        </>
      )}
    </Detalle>
  );
};
