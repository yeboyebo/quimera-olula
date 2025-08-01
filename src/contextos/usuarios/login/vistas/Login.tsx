import { useState } from "react";
import { QBoton } from "../../../../componentes/atomos/qboton.tsx";
import { QCheckbox } from "../../../../componentes/atomos/qcheckbox.tsx";
import { QForm } from "../../../../componentes/atomos/qform.tsx";
import { QInput } from "../../../../componentes/atomos/qinput.tsx";
import { comprobarToken, login } from "../dominio.ts";
import estilos from "./Login.module.css";

const MINUTOS = 60 * 1000;

setInterval(() => {
  comprobarToken()?.catch((_e) => {
    return;
  });
}, 2 * MINUTOS);

export const Login = () => {
  const [mostrarContraseña, setMostrarContraseña] = useState(false);

  const loginSubmit = async (datos: Record<string, string>) => {
    const { id, contraseña } = datos;

    login(id, contraseña).then(() => {
      window.location.href = "/";
    });
  };

  return (
    <section className={estilos.login}>
      <div className="title">
        <h1>Iniciar sesión</h1>
      </div>
      <div className={estilos.loginForm}>
        <QForm onSubmit={loginSubmit}>
          <QInput label="Email" nombre="id" tipo="email" />
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
