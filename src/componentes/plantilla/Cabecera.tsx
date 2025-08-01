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
        <Link to="/">Quimera Olula</Link>
        <button
          id="boton-menu-usuario"
          aria-label="Abrir menú usuario"
          onClick={() => toggleMenu("menu-usuario")}
        ></button>
        <label htmlFor="boton-menu-usuario" id="etiqueta-menu-usuario-abierto">
          <QIcono nombre="perfil" tamaño="md" />
        </label>
      </header>
    </>
  );
};
