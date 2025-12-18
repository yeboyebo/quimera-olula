import { Link } from "react-router";
import { QIcono } from "../atomos/qicono.tsx";
import "./Cabecera.css";

function toggleMenu(selector: string) {
  const menu = document.querySelector(selector);
  if (menu) {
    menu.classList.toggle("activo");
  }
}

export const Cabecera = () => {
  return (
    <>
      <header>
        <button
          id="boton-menu-lateral"
          aria-label="Abrir menú lateral"
          onClick={() => toggleMenu("menu-lateral")}
        ></button>

        <label htmlFor="boton-menu-lateral" id="etiqueta-menu-abierto" />
        <Link to="/">
          <img src="/olula_header_blanco.png" alt="Olula | Inicio" />
        </Link>
        {/* <img
          src="/olula_header_blanco.png"
          alt="Olula | Inicio"
          onClick={() => {
            if (window.location.pathname === "/") {
              window.location.reload();
            } else {
              window.location.href = "/";
            }
          }}
          style={{ cursor: "pointer" }}
        /> */}
        <button
          id="boton-menu-usuario"
          aria-label="Abrir menú usuario"
          onClick={() => toggleMenu("menu-usuario")}
        ></button>
        <label htmlFor="boton-menu-usuario" id="etiqueta-menu-usuario-abierto">
          <QIcono nombre="perfil" tamaño="sm" />
        </label>
      </header>
    </>
  );
};
