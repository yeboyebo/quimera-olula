import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QCheckbox } from "@olula/componentes/atomos/qcheckbox.tsx";
import { QForm } from "@olula/componentes/atomos/qform.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { FactoryCtx } from "@olula/lib/factory_ctx.js";
import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { login } from "../dominio.ts";
import { permisosGrupo, whoAmI, whoAmIStorage } from "../infraestructura.ts";
import estilos from "./Login.module.css";

type TipoFormato = "email" | "texto";

export const Login = () => {
  const navigate = useNavigate();

  const [mostrarContraseña, setMostrarContraseña] = useState(false);

  const loginSubmit = async (datos: Record<string, string>) => {
    const { id, contraseña } = datos;

    return login(id, contraseña)
      .then(() =>
        whoAmI().then((datosWhoAmI) => {
          whoAmIStorage.actualizar(datosWhoAmI);
          permisosGrupo.actualizar(datosWhoAmI.permisos);
        })
      )
      .then(() => navigate("/"));
  };

  const { app } = useContext(FactoryCtx);
  if (!app.Auth) {
    return null;
  }
  // El formato de login se define en la factory de cada proyecto, y puede ser "email" o "texto". Esto permite adaptar el formulario de login a las necesidades de cada proyecto sin modificar el componente Login.

  const label_login = app.Auth.formato_login === "email" ? "Email" : "Usuario";

  return (
    <section className={estilos.login}>
      <div className="title">
        <h1>Iniciar sesión</h1>
      </div>
      <div className={estilos.loginForm}>
        <QForm onSubmit={loginSubmit}>
          <QInput
            label={label_login}
            nombre="id"
            tipo={app.Auth.formato_login as TipoFormato}
          />
          <QInput
            label="Contraseña"
            nombre="contraseña"
            tipo={mostrarContraseña ? "texto" : "contraseña"}
          />
          <QCheckbox
            label="Mostrar contraseña"
            nombre=""
            valor={mostrarContraseña}
            onChange={(valor) => setMostrarContraseña(valor === "true")}
            opcional={true}
          />
          <QBoton tipo="submit" tamaño="mediano">
            Iniciar sesión
          </QBoton>
        </QForm>
      </div>
    </section>
  );
};
