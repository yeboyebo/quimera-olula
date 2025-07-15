import { useParams } from "react-router";
import { Detalle } from "../../../../../../../componentes/detalle/Detalle.tsx";
import { Entidad } from "../../../../../../../contextos/comun/diseño.ts";
import { Maquina, useMaquina } from "../../../../../../../contextos/comun/useMaquina.ts";
import { useModelo } from "../../../../../../../contextos/comun/useModelo.ts";
import { Evento } from "../../diseño.ts";
import { eventoVacio, metaEvento } from "../../dominio.ts";
import { getEvento } from "../../infraestructura.ts";

type Estado = "defecto";

export const DetalleEvento = ({
  eventoInicial = null,
  emitir = () => {},
}: {
  eventoInicial?: Evento | null;
  emitir?: (evento: string, payload?: unknown) => void;
}) => {
  const params = useParams();
  const eventoId = eventoInicial?.id ?? params.id;
  const titulo = (evento: Entidad) => evento.descripcion as string;

  const evento = useModelo(metaEvento, eventoVacio);
  const { modelo, init } = evento;

  const maquina: Maquina<Estado> = {
    defecto: {
      GUARDAR_INICIADO: async () => {
        console.log("hola mundo");
      },
    },
  };
  const emitirEvento = useMaquina(maquina, "defecto", () => {});
  
  return (
    <Detalle
      id={eventoId}
      obtenerTitulo={titulo}
      setEntidad={(o) => init(o)}
      entidad={modelo}
      cargar={getEvento}
      cerrarDetalle={() => emitir("CANCELAR_SELECCION")}
    >
      {!!eventoId && (
        <>
          hola mundo
        </>
      )}
    </Detalle>
  );
};