import { useParams } from "react-router";
import { QInput } from "../../../../../../../componentes/atomos/qinput.tsx";
import { Detalle } from "../../../../../../../componentes/detalle/Detalle.tsx";
import { Entidad } from "../../../../../../../contextos/comun/diseño.ts";
import { Maquina, useMaquina } from "../../../../../../../contextos/comun/useMaquina.ts";
import { useModelo } from "../../../../../../../contextos/comun/useModelo.ts";
import { Trabajador } from "../../diseño.ts";
import { metaTrabajador, trabajadorVacio } from "../../dominio.ts";
import { getTrabajador } from "../../infraestructura.ts";

type Estado = "defecto";

export const DetalleTrabajador = ({
  trabajadorInicial = null,
  emitir = () => {},
}: {
  trabajadorInicial?: Trabajador | null;
  emitir?: (trabajador: string, payload?: unknown) => void;
}) => {
  const params = useParams();
  const trabajadorId = trabajadorInicial?.id ?? params.id;
  const titulo = (trabajador: Entidad) => trabajador.id as string;

  const trabajador = useModelo(metaTrabajador, trabajadorVacio);
  const { modelo, init } = trabajador;

  const maquina: Maquina<Estado> = {
    defecto: {
      GUARDAR_INICIADO: async () => {
        console.log("hola mundo");
      },
    },
  };
  const emitirTrabajador = useMaquina(maquina, "defecto", () => {});
  
  return (
    <Detalle
      id={trabajadorId}
      obtenerTitulo={titulo}
      setEntidad={(o) => init(o)}
      entidad={modelo}
      cargar={getTrabajador}
      cerrarDetalle={() => emitir("CANCELAR_SELECCION")}
    >
      {!!trabajadorId && (
        <div className="DetalleTrabajador">
          <quimera-formulario>
            <QInput label="Nombre" {...trabajador.uiProps("nombre")} />
            <QInput label="Coste/Hora" {...trabajador.uiProps("coste")} />
          </quimera-formulario>
        </div>
      )}
    </Detalle>
  );
};