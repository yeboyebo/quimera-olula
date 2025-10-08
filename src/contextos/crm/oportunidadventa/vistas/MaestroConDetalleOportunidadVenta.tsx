import { useCallback } from "react";
import { QBoton } from "../../../../componentes/atomos/qboton.tsx";
import { MaestroDetalle } from "../../../../componentes/maestro/MaestroDetalle.tsx";
import { ListaSeleccionable } from "../../../comun/diseño.ts";
import {
  cambiarItem,
  cargar,
  getSeleccionada,
  incluirItem,
  listaSeleccionableVacia,
  quitarItem,
  seleccionarItem,
} from "../../../comun/entidad.ts";
import { pipe } from "../../../comun/funcional.ts";
import {
  ConfigMaquina4,
  Maquina3,
  useMaquina4,
} from "../../../comun/useMaquina.ts";
import { OportunidadVenta } from "../diseño.ts";
import { metaTablaOportunidadVenta } from "../dominio.ts";
import { getOportunidadesVenta } from "../infraestructura.ts";
import { AltaOportunidadVenta } from "./AltaOportunidadVenta.tsx";
import { DetalleOportunidadVenta } from "./DetalleOportunidadVenta/DetalleOportunidadVenta.tsx";
import { TarjetaOportunidadVenta } from "./TarjetaOportunidadVenta.tsx";
// import "./MaestroConDetalleOportunidadVenta.css";

type Estado = "inactivo" | "creando";
type Contexto = {
  oportunidades: ListaSeleccionable<OportunidadVenta>;
};

const setOportunidades =
  (
    aplicable: (
      oportunidades: ListaSeleccionable<OportunidadVenta>
    ) => ListaSeleccionable<OportunidadVenta>
  ) =>
  (maquina: Maquina3<Estado, Contexto>) => {
    return {
      ...maquina,
      contexto: {
        ...maquina.contexto,
        oportunidades: aplicable(maquina.contexto.oportunidades),
      },
    };
  };

const configMaquina: ConfigMaquina4<Estado, Contexto> = {
  inicial: {
    estado: "inactivo",
    contexto: {
      oportunidades: listaSeleccionableVacia<OportunidadVenta>(),
    },
  },
  estados: {
    inactivo: {
      crear: "creando",
      oportunidad_cambiada: ({ maquina, payload }) =>
        pipe(
          maquina,
          setOportunidades(cambiarItem(payload as OportunidadVenta))
        ),
      oportunidad_seleccionada: ({ maquina, payload }) =>
        pipe(
          maquina,
          setOportunidades(seleccionarItem(payload as OportunidadVenta))
        ),
      oportunidad_borrada: ({ maquina }) => {
        const { oportunidades } = maquina.contexto;
        if (!oportunidades.idActivo) {
          return maquina;
        }
        return pipe(
          maquina,
          setOportunidades(quitarItem(oportunidades.idActivo))
        );
      },
      oportunidades_cargadas: ({ maquina, payload, setEstado }) =>
        pipe(
          maquina,
          setEstado("inactivo" as Estado),
          setOportunidades(cargar(payload as OportunidadVenta[]))
        ),
      seleccion_cancelada: ({ maquina }) =>
        pipe(
          maquina,
          setOportunidades((oportunidades) => ({
            ...oportunidades,
            idActivo: null,
          }))
        ),
    },
    creando: {
      oportunidad_creada: ({ maquina, payload, setEstado }) =>
        pipe(
          maquina,
          setEstado("inactivo" as Estado),
          setOportunidades(incluirItem(payload as OportunidadVenta, {}))
        ),
      creacion_cancelada: "inactivo",
    },
  },
};

export const MaestroConDetalleOportunidadVenta = () => {
  const [emitir, { estado, contexto }] = useMaquina4<Estado, Contexto>({
    config: configMaquina,
  });
  const { oportunidades } = contexto;

  const setEntidades = useCallback(
    (payload: OportunidadVenta[]) => emitir("oportunidades_cargadas", payload),
    [emitir]
  );
  const setSeleccionada = useCallback(
    (payload: OportunidadVenta) => emitir("oportunidad_seleccionada", payload),
    [emitir]
  );

  const seleccionada = getSeleccionada(oportunidades);

  return (
    <div className="OportunidadVenta">
      <MaestroDetalle<OportunidadVenta>
        seleccionada={seleccionada}
        preMaestro={
          <>
            <h2>Oportunidades de Venta</h2>
            <div className="maestro-botones">
              <QBoton onClick={() => emitir("crear")}>Nueva</QBoton>
            </div>
          </>
        }
        modoVisualizacion="tabla"
        modoDisposicion="maestro-dinamico"
        setModoVisualizacion={(modo) => console.log("Vista:", modo)}
        setModoDisposicion={(modo) => console.log("Disposición:", modo)}
        metaTabla={metaTablaOportunidadVenta}
        tarjeta={(oportunidad) => (
          <TarjetaOportunidadVenta oportunidad={oportunidad} />
        )}
        entidades={oportunidades.lista}
        setEntidades={setEntidades}
        setSeleccionada={setSeleccionada}
        cargar={getOportunidadesVenta}
        Detalle={
          <DetalleOportunidadVenta
            oportunidadInicial={seleccionada}
            publicar={emitir}
          />
        }
      />
      <AltaOportunidadVenta emitir={emitir} activo={estado === "creando"} />
    </div>
  );
};
