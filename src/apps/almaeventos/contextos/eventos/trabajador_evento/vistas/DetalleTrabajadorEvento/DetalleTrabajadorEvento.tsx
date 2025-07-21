import { useContext, useState } from "react";
import { useParams } from "react-router";
import { QBoton } from "../../../../../../../componentes/atomos/qboton.tsx";
import { QInput } from "../../../../../../../componentes/atomos/qinput.tsx";
import { Detalle } from "../../../../../../../componentes/detalle/Detalle.tsx";
import { ContextoError } from "../../../../../../../contextos/comun/contexto.ts";
import { Entidad } from "../../../../../../../contextos/comun/diseño.ts";
import { useModelo } from "../../../../../../../contextos/comun/useModelo.ts";
import { getTrabajadorEvento, patchTrabajadorEvento } from "../../../trabajador_evento/infraestructura.ts";
import { TrabajadorEvento } from "../../diseño.ts";
import { metaTrabajadorEvento, trabajadorEventoVacio } from "../../dominio.ts";

type Estado = "defecto";

export const DetalleTrabajadorEvento = ({
  trabajadorEventoInicial = null,
  emitir = () => {},
}: {
  trabajadorEventoInicial?: TrabajadorEvento | null;
  emitir?: (trabajadorEvento: string, payload?: unknown) => void;
}) => {
  const params = useParams();
  const trabajadorEventoId = trabajadorEventoInicial?.id ?? params.id;
  const titulo = (trabajadorEvento: Entidad) => trabajadorEvento.id as string;
  const { intentar } = useContext(ContextoError);

  const trabajadorEvento = useModelo(metaTrabajadorEvento, trabajadorEventoVacio);
  const { modelo, init, modificado, valido } = trabajadorEvento;
    const [estado, setEstado] = useState<"confirmarBorrado" | "edicion">(
    "edicion"
  );    

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
    emitir("TRABAJADOR_CAMBIADO", trabajadorEvento_guardado);
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
          {/* <div className="maestro-botones ">
            <QBoton onClick={() => setEstado("confirmarBorrado")}>
              Borrar
            </QBoton>
          </div> */}
          <quimera-formulario>
            <QInput label="Nombre" {...trabajadorEvento.uiProps("nombre")} />
            <QInput label="Coste/Hora" {...trabajadorEvento.uiProps("coste")} />
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