import { useParams } from "react-router";
import { QBoton } from "../../../../../componentes/atomos/qboton.tsx";
import { QInput } from "../../../../../componentes/atomos/qinput.tsx";
import { Detalle } from "../../../../../componentes/detalle/Detalle.tsx";
import { EmitirEvento, Entidad } from "../../../../comun/diseño.ts";
import { Maquina, useMaquina } from "../../../../comun/useMaquina.ts";
import { useModelo } from "../../../../comun/useModelo.ts";
import { EstadoOportunidad } from "../../diseño.ts";
import {
  estadoOportunidadVacio,
  metaEstadoOportunidad,
} from "../../dominio.ts";
import {
  getEstadoOportunidad,
  patchEstadoOportunidad,
} from "../../infraestructura.ts";

type Estado = "defecto";

export const DetalleEstadoOportunidad = ({
  estadoInicial = null,
  emitir = () => {},
}: {
  estadoInicial?: EstadoOportunidad | null;
  emitir?: EmitirEvento;
}) => {
  const params = useParams();
  const estadoId = estadoInicial?.id ?? params.id;
  const titulo = (estado: Entidad) => estado.descripcion as string;

  const estado = useModelo(metaEstadoOportunidad, estadoOportunidadVacio);
  const { modelo, init } = estado;

  const maquina: Maquina<Estado> = {
    defecto: {
      GUARDAR_INICIADO: async () => {
        await patchEstadoOportunidad(modelo.id, modelo);
        recargarCabecera();
      },
    },
  };
  const emitirEstado = useMaquina(maquina, "defecto", () => {});

  const recargarCabecera = async () => {
    const nuevoEstado = await getEstadoOportunidad(modelo.id);
    init(nuevoEstado);
    emitir("ESTADO_OPORTUNIDAD_CAMBIADO", nuevoEstado);
  };

  return (
    <Detalle
      id={estadoId}
      obtenerTitulo={titulo}
      setEntidad={(e) => init(e)}
      entidad={modelo}
      cargar={getEstadoOportunidad}
      cerrarDetalle={() => emitir("CANCELAR_SELECCION")}
    >
      {!!estadoId && (
        <div className="DetalleEstadoOportunidad">
          <quimera-formulario>
            <QInput label="Descripción" {...estado.uiProps("descripcion")} />
            <QInput
              label="Probabilidad (%)"
              {...estado.uiProps("probabilidad")}
            />
            <QInput
              label="Valor por defecto"
              {...estado.uiProps("valor_defecto")}
            />
          </quimera-formulario>
          {estado.modificado && (
            <div className="botones maestro-botones">
              <QBoton
                onClick={() => emitirEstado("GUARDAR_INICIADO")}
                deshabilitado={!estado.valido}
              >
                Guardar
              </QBoton>
              <QBoton tipo="reset" variante="texto" onClick={() => init()}>
                Cancelar
              </QBoton>
            </div>
          )}
        </div>
      )}
    </Detalle>
  );
};
