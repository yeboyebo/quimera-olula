import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import type { JSONContent } from "@olula/componentes/moleculas/qeditor_enriquecido.tsx";
import {
  QEditorEnriquecido,
  QTextEnriquecidoJSON,
} from "@olula/componentes/moleculas/qeditor_enriquecido.tsx";
import { QModal } from "@olula/componentes/moleculas/qmodal.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useContext, useState } from "react";
import { getComunicacion, postComunicacion } from "../infraestructura.ts";
import "./CrearComunicacion.css";

interface CrearComunicacionProps {
  publicar?: EmitirEvento;
  onCancelar?: () => void;
  activo?: boolean;
}

const jsonVacio: JSONContent = {
  type: "doc",
  content: [{ type: "paragraph" }],
};

export const CrearComunicacion = ({
  publicar = async () => {},
  onCancelar = () => {},
  activo = false,
}: CrearComunicacionProps) => {
  const [usuarioDestinoId, setUsuarioDestinoId] = useState("");
  const [asunto, setAsunto] = useState("");
  const [jsonEditor, setJsonEditor] = useState<JSONContent>(jsonVacio);
  const [htmlEditor, setHtmlEditor] = useState("<p></p>");
  const [guardando, setGuardando] = useState(false);
  const { intentar } = useContext(ContextoError);

  const limpiarFormulario = () => {
    setUsuarioDestinoId("");
    setAsunto("");
    setJsonEditor(jsonVacio);
    setHtmlEditor("<p></p>");
  };

  const cancelar = () => {
    if (guardando) {
      return;
    }

    limpiarFormulario();
    onCancelar();
  };

  const guardar = async () => {
    if (!usuarioDestinoId.trim() || !asunto.trim()) {
      return;
    }

    setGuardando(true);
    try {
      const id = await intentar(() =>
        postComunicacion({
          usuario_destino_id: usuarioDestinoId.trim(),
          asunto: asunto.trim(),
          cuerpo: htmlEditor,
        })
      );

      const comunicacionCreada = await getComunicacion(id);
      publicar("comunicacion_creada", comunicacionCreada);
      limpiarFormulario();
      onCancelar();
    } finally {
      setGuardando(false);
    }
  };

  if (!activo) return null;

  return (
    <QModal
      nombre="crear-comunicacion"
      titulo="Nueva comunicación"
      abierto={activo}
      onCerrar={cancelar}
    >
      <div className="crear-comunicacion-modal">
        <QInput
          label="Usuario destino"
          nombre="usuario_destino_id"
          valor={usuarioDestinoId}
          onChange={(valor) => setUsuarioDestinoId(valor)}
        />

        <QInput
          label="Asunto"
          nombre="asunto"
          valor={asunto}
          onChange={(valor) => setAsunto(valor)}
        />

        <QEditorEnriquecido
          valor={jsonEditor}
          onChange={(valor, html) => {
            setJsonEditor(valor);
            setHtmlEditor(html);
          }}
          marcadorPosicion="Escribe el contenido..."
        />

        <section className="crear-comunicacion-preview">
          <h4>Vista lectura (componente de solo lectura)</h4>
          <QTextEnriquecidoJSON valor={jsonEditor} />
        </section>

        <div className="crear-comunicacion-botones">
          <QBoton variante="borde" onClick={cancelar}>
            Cancelar
          </QBoton>
          <QBoton
            onClick={guardar}
            deshabilitado={
              guardando || !usuarioDestinoId.trim() || !asunto.trim()
            }
          >
            {guardando ? "Guardando..." : "Guardar"}
          </QBoton>
        </div>
      </div>
    </QModal>
  );
};
