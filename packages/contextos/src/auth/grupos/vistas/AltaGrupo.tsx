import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useContext } from "react";
import { grupoVacio, metaNuevoGrupo } from "../dominio.ts";
import { postGrupo } from "../infraestructura.ts";
import "./AltaGrupo.css";

export const AltaGrupo = ({ emitir = () => {} }: { emitir?: EmitirEvento }) => {
  const nuevoGrupo = useModelo(metaNuevoGrupo, grupoVacio);
  const { intentar } = useContext(ContextoError);

  const guardar = async () => {
    await intentar(() => postGrupo(nuevoGrupo.modelo));
    emitir("GRUPO_CREADO", nuevoGrupo.modelo);
  };

  return (
    <div className="AltaGrupo">
      <h2>Nueva Acción</h2>
      <quimera-formulario>
        <QInput label="Identificador" {...nuevoGrupo.uiProps("id")} />
        <QInput label="Descripción" {...nuevoGrupo.uiProps("descripcion")} />
      </quimera-formulario>
      <div className="botones">
        <QBoton onClick={guardar} deshabilitado={!nuevoGrupo.valido}>
          Guardar
        </QBoton>
        <QBoton onClick={() => emitir("ALTA_CANCELADA")} variante="texto">
          Cancelar
        </QBoton>
      </div>
    </div>
  );
};
