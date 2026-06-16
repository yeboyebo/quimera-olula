import { login } from "#/auth/login/dominio.ts";
import { misPermisos, permisosGrupo } from "#/auth/login/infraestructura.ts";
import estilosOriginal from "#/auth/login/vistas/Login.module.css";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QCheckbox } from "@olula/componentes/atomos/qcheckbox.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { useState } from "react";
import { useNavigate } from "react-router";
import estilos from "./Login.module.scss";

export const Login = () => {
  const navigate = useNavigate();
  const [mostrarContraseña, setMostrarContraseña] = useState(false);
  const [id, setId] = useState("");
  const [contraseña, setContraseña] = useState("");

  const handleLogin = async () => {
    return login(id, contraseña)
      .then(() => {
        return misPermisos().then((datosPermisos) => {
          permisosGrupo.actualizar(datosPermisos.datos);
        });
      })
      .then(() => navigate("/"));
  };

  return (
    <section className={`${estilosOriginal.login} ${estilos.login}`}>
      <div className={estilos.logo}>
        <img alt="Project logo" src="/ganso.png" />
        <h3>Stores</h3>
      </div>
      <div className={estilos.heading}>
        <h1>Iniciar sesión</h1>
      </div>
      <div className={`${estilosOriginal.loginForm} ${estilos.loginForm}`}>
        <quimera-formulario>
          <QInput label="E-mail" nombre="id" tipo="email" valor={id} onChange={(v) => setId(v)} />
          <QInput
            label="Contraseña"
            nombre="contraseña"
            tipo={mostrarContraseña ? "texto" : "contraseña"}
            valor={contraseña}
            onChange={(v) => setContraseña(v)}
          />
          <QCheckbox
            label="Mostrar contraseña"
            nombre=""
            valor={mostrarContraseña}
            onChange={(valor) => setMostrarContraseña(valor === "true")}
            opcional={true}
          />
          <QBoton tamaño="mediano" onClick={handleLogin}>
            Entrar
          </QBoton>
        </quimera-formulario>
      </div>
    </section>
  );
};
