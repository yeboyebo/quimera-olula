import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.ts";
import { Listado } from "@olula/componentes/maestro/Listado.js";
import { MaestroDetalle } from "@olula/componentes/maestro/MaestroDetalle.tsx";
import type { JSONContent } from "@olula/componentes/moleculas/qeditor_enriquecido.tsx";
import {
  QEditorEnriquecido,
  QTextEnriquecidoJSON,
} from "@olula/componentes/moleculas/qeditor_enriquecido.tsx";
import { QModal } from "@olula/componentes/moleculas/qmodal.tsx";
import { listaActivaEntidadesInicial } from "@olula/lib/ListaActivaEntidades.js";
import { getUrlParams, useUrlParams } from "@olula/lib/url-params.js";
import { useEffect, useState } from "react";
import { CrearCliente } from "../crear/CrearCliente.tsx";
import { DetalleCliente } from "../detalle/DetalleCliente.tsx";
import { Cliente } from "../diseño.ts";
import { metaTablaCliente } from "./diseño.ts";
import "./MaestroConDetalleCliente.css";
import { getMaquina } from "./maquina.ts";

export const MaestroConDetalleCliente = () => {
  const { id, criteria } = getUrlParams();
  const [modalWysiwygAbierto, setModalWysiwygAbierto] = useState(false);
  const [jsonEditor, setJsonEditor] = useState<JSONContent>({
    type: "doc",
    content: [{ type: "paragraph" }],
  });
  const [htmlEditor, setHtmlEditor] = useState("<p></p>");
  const [payloadVisible, setPayloadVisible] = useState<string | null>(null);

  const mostrarPayload = () => {
    const payload = {
      formato: "tiptap-json",
      contenido: jsonEditor,
      html: htmlEditor,
    };

    const payloadSerializado = JSON.stringify(payload, null, 2);
    setPayloadVisible(payloadSerializado);
    console.log("Payload prueba WYSIWYG", payload);
  };

  const { ctx, emitir } = useMaquina(getMaquina, {
    estado: "INICIAL",
    clientes: listaActivaEntidadesInicial<Cliente>(id, criteria),
  });

  useUrlParams(ctx.clientes.activo, ctx.clientes.criteria);

  useEffect(() => {
    emitir("recarga_de_clientes_solicitada", ctx.clientes.criteria);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="Cliente">
      <MaestroDetalle<Cliente>
        Maestro={
          <>
            <h2>Clientes</h2>
            <Listado<Cliente>
              metaTabla={metaTablaCliente}
              modo="tabla"
              criteria={ctx.clientes.criteria}
              entidades={ctx.clientes.lista}
              totalEntidades={ctx.clientes.total}
              seleccionada={ctx.clientes.activo}
              renderAcciones={() => (
                <div className="maestro-botones">
                  <QBoton onClick={() => emitir("creacion_solicitada")}>
                    Nuevo Cliente
                  </QBoton>
                  <QBoton onClick={() => setModalWysiwygAbierto(true)}>
                    Probar WYSIWYG
                  </QBoton>
                </div>
              )}
              onSeleccion={(payload) => emitir("cliente_seleccionado", payload)}
              onCriteriaChanged={(payload) =>
                emitir("criteria_cambiado", payload)
              }
              onSiguientePagina={(payload) =>
                emitir("siguiente_pagina", payload)
              }
            />
          </>
        }
        Detalle={<DetalleCliente id={ctx.clientes.activo} publicar={emitir} />}
        seleccionada={ctx.clientes.activo}
        modoDisposicion="maestro-50"
      />

      <CrearCliente
        publicar={emitir}
        onCancelar={() => emitir("creacion_cancelada")}
        activo={ctx.estado === "CREANDO_CLIENTE"}
      />

      <QModal
        nombre="prueba-wysiwyg"
        titulo="Prueba editor WYSIWYG"
        abierto={modalWysiwygAbierto}
        onCerrar={() => setModalWysiwygAbierto(false)}
      >
        <div className="prueba-wysiwyg-modal">
          <QEditorEnriquecido
            valor={jsonEditor}
            onChange={(valor, html) => {
              setJsonEditor(valor);
              setHtmlEditor(html);
            }}
            marcadorPosicion="Escribe una nota de prueba..."
          />

          <div className="prueba-wysiwyg-botones">
            <QBoton onClick={mostrarPayload}>Mostrar payload</QBoton>
          </div>

          <section className="prueba-wysiwyg-preview">
            <h4>Vista lectura (componente de solo lectura)</h4>
            <QTextEnriquecidoJSON valor={jsonEditor} />
          </section>

          {payloadVisible && (
            <pre className="prueba-wysiwyg-payload">{payloadVisible}</pre>
          )}
        </div>
      </QModal>
    </div>
  );
};
