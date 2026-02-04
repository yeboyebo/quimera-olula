import { useMaquina } from "@olula/componentes/hook/useMaquina.js";
import { QBoton, QInput } from "@olula/componentes/index.ts";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useCallback, useEffect, useRef } from "react";
import { useParams } from "react-router";
import { Usuario } from "../diseño.ts";
import { metaUsuario, usuarioVacio } from "../dominio.ts";
import "./DetalleUsuario.css";
import { ContextoDetalleUsuario } from "./diseño.ts";
import { getMaquina } from "./maquina.ts";

export const DetalleUsuario = ({
  usuarioInicial = null,
  publicar = async () => {},
}: {
  usuarioInicial?: Usuario | null;
  publicar?: EmitirEvento;
}) => {
  const params = useParams();
  const usuarioId = usuarioInicial?.id ?? params.id;
  const usuarioIdCargadoRef = useRef<string | null>(null);

  const contextoInicial: ContextoDetalleUsuario = {
    estado: "INICIAL",
    usuario: usuarioInicial || usuarioVacio,
    usuarioInicial: usuarioInicial || null,
  };

  const { ctx, emitir } = useMaquina(getMaquina, contextoInicial, publicar);

  const usuarioForm = useModelo(metaUsuario, ctx.usuario!);

  const handleGuardar = useCallback(() => {
    emitir("edicion_de_usuario_lista", usuarioForm.modelo);
  }, [emitir, usuarioForm.modelo]);

  const handleCancelar = useCallback(() => {
    emitir("edicion_de_usuario_cancelada");
  }, [emitir]);

  useEffect(() => {
    if (usuarioId && usuarioId !== usuarioIdCargadoRef.current) {
      usuarioIdCargadoRef.current = usuarioId;
      emitir("usuario_id_cambiada", usuarioId, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuarioId]);

  if (!usuarioInicial) {
    return <div className="DetalleUsuario">Selecciona un usuario</div>;
  }

  return (
    <div className="DetalleUsuario">
      <h2>Detalle de Usuario</h2>
      <quimera-formulario>
        <QInput {...usuarioForm.uiProps("id")} label="ID" />
        <QInput {...usuarioForm.uiProps("nombre")} label="Nombre" />
        <QInput {...usuarioForm.uiProps("email")} label="Email" />
        <QInput {...usuarioForm.uiProps("grupo_id")} label="Grupo" />
      </quimera-formulario>
      <div className="botones">
        <QBoton onClick={handleGuardar} deshabilitado={!usuarioForm.valido}>
          Guardar
        </QBoton>
        <QBoton onClick={handleCancelar} variante="texto">
          Cancelar
        </QBoton>
      </div>
    </div>
  );
};
