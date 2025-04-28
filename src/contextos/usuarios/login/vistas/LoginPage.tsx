import { useState } from "react";
import { QBoton } from "../../../../componentes/atomos/qboton.tsx";
import { QForm } from "../../../../componentes/atomos/qform.tsx";
import { QInput } from "../../../../componentes/atomos/qinput.tsx";
import { forgetPassword, isLogged, login } from "../infraestructura.ts";
import estilos from "./LoginPage.module.css";

export const LoginPage = () => {
  const [showForgetPassword, setShowForgetPassword] = useState(false);
  const [showForgetPasswordMessage, setShowForgetPasswordMessage] =
    useState("");

  const loginSubmit = async (datos: Record<string, string>) => {
    console.log(datos);
    const { email, password } = datos;
    const usuario = await login(email, password);
    if (
      usuario &&
      usuario !== null &&
      usuario !== undefined &&
      usuario.token !== null &&
      usuario.token !== undefined
    ) {
      localStorage.setItem("usuario", JSON.stringify(usuario));
      window.location.href = "/"; // Redirigir a la página de inicio
    }
  };

  const logOutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.removeItem("usuario");
    window.location.href = "/login"; // Redirigir a la página de login
  };

  const forgetPasswordSubmit = async (datos: Record<string, string>) => {
    const { email } = datos;
    const respuesta = await forgetPassword(email);
    setShowForgetPasswordMessage(respuesta.message);
  };

  const renderLoginForm = () => {
    if (isLogged()) {
      return (
        <div>
          <p>Ya has iniciado sesión</p>
          <QBoton tipo="button" tamaño="mediano" onClick={logOutSubmit}>
            Cerrar sesión
          </QBoton>
        </div>
      );
    }

    return (
      <section className={estilos.loginPage}>
        <div className="title">
          <h1>Iniciar sesión</h1>
        </div>
        <div className={estilos.loginPageForm}>
          <QForm onSubmit={loginSubmit}>
            <section>
              <QInput label="Email" nombre="email" />
              <QInput label="Contraseña" nombre="password" />
              <QBoton
                tipo="submit"
                tamaño="mediano"
                children="Iniciar sesión"
              />
              <QBoton
                variante="texto"
                onClick={() => setShowForgetPassword(true)}
                children="Olvidé mi contraseña"
              />
            </section>
          </QForm>
        </div>
      </section>
    );
  };

  const renderForgetPasswordContent = () => {
    if (showForgetPasswordMessage !== "") {
      return <p>{showForgetPasswordMessage}</p>;
    }
    return (
      <QForm onSubmit={forgetPasswordSubmit}>
        <p>
          ¿Has olvidado tu contraseña?
          <br />
          Indícanos tu email y te enviaremos un mensaje para restablecerla.
        </p>
        <QInput label="Email" nombre="email" />
        <QBoton
          tipo="submit"
          tamaño="mediano"
          key={"recuperarPass"}
          children="Recuperar contraseña"
        />
        <QBoton
          variante="texto"
          onClick={() => setShowForgetPassword(false)}
          children="Iniciar sesión"
        />
      </QForm>
    );
  };

  const renderForgetPasswordForm = () => {
    return (
      <section className={estilos.loginPage}>
        <div className="title">
          <h1>Recuperar contraseña</h1>
        </div>
        <div className={estilos.loginPageForm}>
          {renderForgetPasswordContent()}
        </div>
      </section>
    );
  };

  const render = () => {
    return !showForgetPassword ? renderLoginForm() : renderForgetPasswordForm();
  };

  return <div className="loginPage">{render()}</div>;
};
