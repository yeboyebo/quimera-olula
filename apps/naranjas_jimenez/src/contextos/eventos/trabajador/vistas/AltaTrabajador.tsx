import { QBoton, QInput } from "@olula/componentes/index.ts";
import { ContextoError } from "@olula/lib/contexto.ts";
import { ProcesarEvento } from "@olula/lib/useMaquina.js";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useContext } from "react";
import { metaNuevoTrabajador, nuevoTrabajadorVacio } from "../dominio.ts";
import { getTrabajador, postTrabajador } from "../infraestructura.ts";

export const AltaTrabajador = ({
  emitir = async () => {},
}: {
  emitir?: ProcesarEvento;
}) => {
  const nuevoTrabajador = useModelo(metaNuevoTrabajador, nuevoTrabajadorVacio);
  const { intentar } = useContext(ContextoError);

  const guardar = async () => {
    const id = await intentar(() => postTrabajador(nuevoTrabajador.modelo));
    nuevoTrabajador.init(nuevoTrabajadorVacio);
    const TrabajadorCreado = await getTrabajador(id);
    emitir("TRABAJADOR_CREADO", TrabajadorCreado);
  };

  return (
    <>
      <h2>Nuevo Trabajador</h2>
      <quimera-formulario>
        <QInput label="Código" {...nuevoTrabajador.uiProps("id")} />
        <QInput label="Nombre" {...nuevoTrabajador.uiProps("nombre")} />
        <QInput label="Coste/Hora" {...nuevoTrabajador.uiProps("coste")} />
      </quimera-formulario>
      <div className="botones">
        <QBoton
          onClick={guardar}
          deshabilitado={nuevoTrabajador.valido === false}
        >
          Guardar
        </QBoton>
        <QBoton
          tipo="reset"
          variante="texto"
          onClick={() => emitir("ALTA_CANCELADA")}
        >
          Cancelar
        </QBoton>
      </div>
    </>
  );
};
