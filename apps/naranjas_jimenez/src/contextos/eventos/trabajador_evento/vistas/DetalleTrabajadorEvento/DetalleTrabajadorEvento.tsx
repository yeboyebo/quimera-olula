import {
    Detalle,
    QBoton,
    QCheckbox,
    QDate,
    QInput,
} from "@olula/componentes/index.ts";
import { ContextoError } from "@olula/lib/contexto.ts";
import { Entidad } from "@olula/lib/diseño.ts";
import { formatearFechaDate } from "@olula/lib/dominio.js";
import { ProcesarEvento } from "@olula/lib/useMaquina.js";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useContext, useEffect } from "react";
import { useParams } from "react-router";
import { TrabajadorEvento } from "../../diseño.ts";
import { metaTrabajadorEvento, trabajadorEventoVacio } from "../../dominio.ts";
import {
    getTrabajadorEvento,
    patchTrabajadorEvento,
} from "../../infraestructura.ts";

export const DetalleTrabajadorEvento = ({
  trabajadorEventoInicial = null,
  emitir = async () => {},
}: {
  trabajadorEventoInicial?: TrabajadorEvento | null;
  emitir?: ProcesarEvento;
}) => {
  const params = useParams();
  const trabajadorEventoId = trabajadorEventoInicial?.id ?? params.id;
  const titulo = (trabajadorEvento: Entidad) => {
    const te = trabajadorEvento as TrabajadorEvento;
    return `${formatearFechaDate(te.fecha) || ""} ${te.descripcion || ""}`;
  };
  const { intentar } = useContext(ContextoError);

  const trabajadorEvento = useModelo(
    metaTrabajadorEvento,
    trabajadorEventoVacio
  );
  const { modelo, init, modificado, valido } = trabajadorEvento;

  // Sincronizar el estado interno cuando cambie trabajadorEventoInicial
  useEffect(() => {
    if (trabajadorEventoInicial) {
      init(trabajadorEventoInicial);
    }
  }, [
    trabajadorEventoInicial,
    trabajadorEventoInicial?.id,
    trabajadorEventoInicial?.liquidado,
    init,
  ]);

  // const [estado, setEstado] = useState<"confirmarBorrado" | "edicion">(
  //   "edicion"
  // );

  // const maquina: Maquina<Estado> = {
  //   defecto: {
  //     GUARDAR_INICIADO: async () => {
  //       console.log("hola mundo");
  //     },
  //   },
  // };
  // const emitirTrabajadorEvento = useMaquina(maquina, "defecto", () => {});

  const onGuardarClicked = async () => {
    await intentar(() => patchTrabajadorEvento(modelo.id, modelo));
    const trabajadorEvento_guardado = await getTrabajadorEvento(modelo.id);
    init(trabajadorEvento_guardado);
    emitir("TRABAJADOR_EVENTO_CAMBIADO", trabajadorEvento_guardado);
  };

  return (
    <Detalle
      id={trabajadorEventoId}
      obtenerTitulo={titulo}
      setEntidad={(o) => init(o)}
      entidad={modelo}
      cargar={getTrabajadorEvento}
      cerrarDetalle={() => emitir("CANCELAR_SELECCION")}
    >
      {!!trabajadorEventoId && (
        <div className="DetalleTrabajadorEvento">
          <quimera-formulario>
            <QInput
              label={`Evento(${trabajadorEvento.modelo.evento_id})`}
              {...trabajadorEvento.uiProps("descripcion")}
              deshabilitado={true}
            />
            <QInput
              label={`Trabajador(${trabajadorEvento.modelo.trabajador_id})`}
              {...trabajadorEvento.uiProps("nombre")}
              deshabilitado={true}
            />
            <QDate
              label="Fecha Inicio"
              condensado
              {...trabajadorEvento.uiProps("fecha")}
              deshabilitado={true}
            />
            <QInput label="Coste/Hora" {...trabajadorEvento.uiProps("coste")} />
            <QCheckbox
              label="Liquidado"
              nombre={trabajadorEvento.uiProps("liquidado").nombre}
              valor={trabajadorEvento.uiProps("liquidado").valor}
              onChange={trabajadorEvento.uiProps("liquidado").onChange}
              deshabilitado={
                trabajadorEvento.uiProps("liquidado").deshabilitado
              }
              erroneo={trabajadorEvento.uiProps("liquidado").erroneo}
              valido={trabajadorEvento.uiProps("liquidado").valido}
              textoValidacion={
                trabajadorEvento.uiProps("liquidado").textoValidacion
              }
            />
          </quimera-formulario>
        </div>
      )}
      {trabajadorEvento.modificado && (
        <div className="maestro-botones ">
          <QBoton onClick={onGuardarClicked} deshabilitado={!valido}>
            Guardar
          </QBoton>
          <QBoton
            tipo="reset"
            variante="texto"
            onClick={() => init()}
            deshabilitado={!modificado}
          >
            Cancelar
          </QBoton>
        </div>
      )}
    </Detalle>
  );
};
