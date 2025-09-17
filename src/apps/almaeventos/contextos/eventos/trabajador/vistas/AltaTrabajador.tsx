import { QBoton } from "../../../../../../componentes/atomos/qboton.tsx";
import { QInput } from "../../../../../../componentes/atomos/qinput.tsx";
import { useModelo } from "../../../../../../contextos/comun/useModelo.ts";
// import { EmitirEvento } from "../../../comun/diseño.ts";
import { EmitirEvento } from "../../../../../../contextos/comun/diseño.ts";
// import { Agente } from "../../comun/componentes/agente.tsx";
// import { TipoIdFiscal } from "../../comun/componentes/tipoIdFiscal.tsx";
import { useContext } from "react";
import { ContextoError } from "../../../../../../contextos/comun/contexto.ts";
import { metaNuevoTrabajador, nuevoTrabajadorVacio } from "../dominio.ts";
import { getTrabajador, postTrabajador } from "../infraestructura.ts";

export const AltaTrabajador = ({
  emitir = () => {},
}: {
  emitir?: EmitirEvento;
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
        <QBoton onClick={guardar} deshabilitado={nuevoTrabajador.valido === false}>
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
