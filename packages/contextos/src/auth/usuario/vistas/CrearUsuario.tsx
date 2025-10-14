import { Mostrar, QBoton, QInput } from "@olula/componentes/index.ts";
import { ContextoError } from "@olula/lib/contexto.ts";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { HookModelo, useModelo } from "@olula/lib/useModelo.ts";
import { useContext } from "react";
import { Usuario } from "../diseño";
import { metaNuevoUsuario, nuevoUsuarioVacio } from "../dominio.ts";
import { getUsuario, postUsuario } from "../infraestructura";
import "./CrearUsuario.css";

export const CrearUsuario = ({
  emitir = () => {},
  activo = false,
}: {
  emitir?: EmitirEvento;
  activo: boolean;
}) => {
  const usuario = useModelo(metaNuevoUsuario, { ...nuevoUsuarioVacio });

  const cancelar = () => {
    usuario.init();
    emitir("creacion_cancelada");
  };

  return (
    <Mostrar modo="modal" activo={activo} onCerrar={cancelar}>
      <FormAltaUsuario emitir={emitir} usuario={usuario} />
    </Mostrar>
  );
};

const FormAltaUsuario = ({
  emitir = () => {},
  usuario,
}: {
  emitir?: EmitirEvento;
  usuario: HookModelo<Partial<Usuario>>;
}) => {
  const { intentar } = useContext(ContextoError);

  const crear = async () => {
    const modelo = { ...usuario.modelo };
    const id = await intentar(() => postUsuario(modelo));
    const usuarioCreado = await getUsuario(id);
    emitir("usuario_creado", usuarioCreado);
    usuario.init();
  };

  const cancelar = () => {
    emitir("creacion_cancelada");
    usuario.init();
  };

  return (
    <div className="CrearUsuario">
      <h2>Nuevo Usuario</h2>
      <quimera-formulario>
        <QInput label="Identificador" {...usuario.uiProps("id")} />
        <QInput label="Nombre" {...usuario.uiProps("nombre")} />
        <QInput label="Email" {...usuario.uiProps("email")} />
      </quimera-formulario>
      <div className="botones">
        <QBoton onClick={crear} deshabilitado={!usuario.valido}>
          Guardar
        </QBoton>
        <QBoton onClick={cancelar} variante="texto">
          Cancelar
        </QBoton>
      </div>
    </div>
  );
};
