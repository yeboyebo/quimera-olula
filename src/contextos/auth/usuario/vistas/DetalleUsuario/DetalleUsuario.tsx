import { QModal } from "@quimera/comp/moleculas/qmodal.tsx";
import { Grupo } from "@quimera/ctx/auth/comun/componentes/grupo.tsx";
import { useContext, useState } from "react";
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

type Estado = "editando" | "borrando" | "generar_token";
type Contexto = Record<string, unknown>;

const configMaquina: ConfigMaquina4<Estado, Contexto> = {
  inicial: {
    estado: "editando",
    contexto: {},
  },
  estados: {
    editando: {
      borrar: "borrando",
      generar_token: "generar_token",
      usuario_guardado: ({ publicar }) => publicar("usuario_cambiado"),
      cancelar_seleccion: ({ publicar }) => publicar("cancelar_seleccion"),
    },
    borrando: {
      borrado_cancelado: "editando",
      usuario_borrado: ({ publicar }) => publicar("usuario_borrado"),
    },
    generar_token: {
      cancelar: "editando",
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

  const [expiracion, setExpiracion] = useState("");
  const [expiracionError, setExpiracionError] = useState("");
  const [tokenGenerado, setTokenGenerado] = useState<string | null>(null);

  // Expresión regular ISO: YYYY-MM-DD, opcionalmente T[HH:MM[:SS]]Z
  const isoRegex = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2})?Z)?$/;

  const validarExpiracion = (valor: string) => {
    if (!valor) return "";
    return isoRegex.test(valor)
      ? ""
      : "Formato inválido. Debe ser YYYY-MM-DDTHH:MMZ o YYYY-MM-DDTHH:MM:SSZ";
  };

  const onExpiracionChange = (valor: string) => {
    setExpiracion(valor);
    setExpiracionError(validarExpiracion(valor));
  };

  const onGenerar = async () => {
    if (validarExpiracion(expiracion)) return;
    const token = await intentar(() =>
      generarTokenUsuario(modelo.id, expiracion)
    );
    setTokenGenerado(token);
    // emitir("token_generado", token);
    setExpiracion("");
    setExpiracionError("");
    console.log("Token generado:", token);
  };

  const guardar = async () => {
    await intentar(() => patchUsuario(modelo.id, modelo));
    const usuario_guardado = await getUsuario(modelo.id);
    init(usuario_guardado);
    emitir("usuario_cambiado", usuario_guardado);
  };

  const abrirGenerarToken = () => {
    setTokenGenerado(null);
    emitirUsuario("generar_token");
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
            <QBoton onClick={abrirGenerarToken}>Generar Token</QBoton>
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
          <QModal
            nombre="generarToken"
            abierto={estado === "generar_token"}
            onCerrar={() => {
              emitirUsuario("cancelar");
              setExpiracion("");
              setExpiracionError("");
              setTokenGenerado(null);
            }}
          >
            <h2>Generar token</h2>
            <QInput
              nombre="expiracion"
              label="Expiración"
              valor={expiracion}
              onChange={onExpiracionChange}
              textoValidacion={expiracionError}
              tipo="texto"
            />
            <div className="botones">
              <QBoton
                onClick={onGenerar}
                deshabilitado={!!validarExpiracion(expiracion)}
              >
                Guardar
              </QBoton>
              <QBoton
                tipo="reset"
                variante="texto"
                onClick={() => {
                  emitirUsuario("cancelar");
                  setExpiracion("");
                  setExpiracionError("");
                  setTokenGenerado(null);
                }}
              >
                Cancelar
              </QBoton>
            </div>
            {tokenGenerado && (
              <div className="token-generado">
                <label htmlFor="token-generado">Token generado</label>
                <textarea
                  id="token-generado"
                  className="token-textarea"
                  name="token"
                  value={tokenGenerado}
                  readOnly
                />
              </div>
            )}
          </QModal>
        </div>
      )}
    </Detalle>
  );
};
