import { Grupo } from "@quimera/ctx/auth/comun/componentes/grupo.tsx";
import { useContext } from "react";
import { useParams } from "react-router";
import { QBoton } from "../../../../../../src/componentes/atomos/qboton.tsx";
import { QInput } from "../../../../../../src/componentes/atomos/qinput.tsx";
import { Detalle } from "../../../../../../src/componentes/detalle/Detalle.tsx";
import { ContextoError } from "../../../../../../src/contextos/comun/contexto.ts";
import {
  EmitirEvento,
  Entidad,
} from "../../../../../../src/contextos/comun/diseño.ts";
import {
  ConfigMaquina4,
  useMaquina4,
} from "../../../../../../src/contextos/comun/useMaquina.ts";
import { useModelo } from "../../../../../../src/contextos/comun/useModelo.ts";
import { Usuario } from "../../diseño";
import { metaUsuario, usuarioVacio } from "../../dominio";
import {
  generarTokenUsuario,
  getUsuario,
  patchUsuario,
} from "../../infraestructura";
import { BorrarUsuario } from "./BorrarUsuario";
import "./DetalleUsuario.css";

type Estado = "editando" | "borrando";
type Contexto = Record<string, unknown>;

const configMaquina: ConfigMaquina4<Estado, Contexto> = {
  inicial: {
    estado: "editando",
    contexto: {},
  },
  estados: {
    editando: {
      borrar: "borrando",
      usuario_guardado: ({ publicar }) => publicar("usuario_cambiado"),
      cancelar_seleccion: ({ publicar }) => publicar("cancelar_seleccion"),
    },
    borrando: {
      borrado_cancelado: "editando",
      usuario_borrado: ({ publicar }) => publicar("usuario_borrado"),
    },
  },
};

const titulo = (usuario: Entidad) => usuario.id as string;

export const DetalleUsuario = ({
  usuarioInicial = null,
  emitir = () => {},
}: {
  usuarioInicial?: Usuario | null;
  emitir?: EmitirEvento;
}) => {
  const params = useParams();
  const usuarioId = usuarioInicial?.id ?? params.id;
  const { intentar } = useContext(ContextoError);

  const usuario = useModelo(metaUsuario, usuarioVacio);
  const { modelo, uiProps, init, modificado, valido } = usuario;

  const [emitirUsuario, { estado }] = useMaquina4<Estado, Contexto>({
    config: configMaquina,
    publicar: emitir,
  });

  const guardar = async () => {
    await intentar(() => patchUsuario(modelo.id, modelo));
    const usuario_guardado = await getUsuario(modelo.id);
    init(usuario_guardado);
    console.log("emitir usuario_guardado", usuario_guardado);
    emitir("usuario_cambiado", usuario_guardado);
  };

  const generarToken = async () => {
    const token_generado = await intentar(() => generarTokenUsuario(modelo.id));
    emitir("token_generado", token_generado);
  };

  return (
    <Detalle
      id={usuarioId}
      obtenerTitulo={titulo}
      setEntidad={(m) => init(m)}
      entidad={modelo}
      cargar={getUsuario}
      cerrarDetalle={() => emitirUsuario("cancelar_seleccion")}
    >
      {!!usuarioId && (
        <div className="DetalleUsuario">
          <div className="maestro-botones ">
            <QBoton onClick={generarToken}>Generar Token</QBoton>
            <QBoton onClick={() => emitirUsuario("borrar")}>Borrar</QBoton>
          </div>

          <quimera-formulario>
            <QInput label="Nombre" {...uiProps("nombre")} />
            <QInput label="Email" {...uiProps("email")} />
            <Grupo {...uiProps("grupo_id")} />
          </quimera-formulario>

          {modificado && (
            <div className="botones maestro-botones">
              <QBoton onClick={guardar} deshabilitado={!valido}>
                Guardar
              </QBoton>
              <QBoton tipo="reset" variante="texto" onClick={() => init()}>
                Cancelar
              </QBoton>
            </div>
          )}
          <BorrarUsuario
            emitir={emitirUsuario}
            activo={estado === "borrando"}
            usuario={modelo}
          />
        </div>
      )}
    </Detalle>
  );
};
