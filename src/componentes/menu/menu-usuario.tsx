import "./menu-usuario.css";

import { Link } from "react-router";
import { ElementoMenu, ElementoMenuPadre } from "../../contextos/comun/menu.ts";
import { QIcono } from "../atomos/qicono.tsx";

const elementosDelMenu = [
  {
    nombre: "Usuarios",
    icono: "usuario",
    subelementos: [
      {
        nombre: "Perfil",
        icono: "perfil",
        url: "/usuario/perfil",
      },
    ],
  },
  {
    nombre: "Sesión",
    icono: "sesion",
    subelementos: [
      {
        nombre: "Cerrar sesión",
        icono: "cerrar-sesion",
        url: "/logout",
      },
    ],
  },
];

export const MenuUsuario = () => {
  const renderizaElemento = (elemento: ElementoMenu) => {
    const icono = elemento.icono ? (
      <QIcono nombre={elemento.icono} tamaño="sm" />
    ) : null;

    if ("url" in elemento && elemento.url) {
      return (
        <li key={elemento.nombre}>
          <Link to={elemento.url}>
            {icono} {elemento.nombre}
          </Link>
        </li>
      );
    }

    const subelementos = (elemento as ElementoMenuPadre).subelementos
      .map((subelemento) => renderizaElemento(subelemento))
      .filter(Boolean);
    if (!subelementos.length) return null;

    return (
      <details key={elemento.nombre} open>
        <summary>
          {icono} {elemento.nombre}
        </summary>
        <ul>{subelementos}</ul>
      </details>
    );
  };

  const elementos = elementosDelMenu.map((elemento) =>
    renderizaElemento(elemento)
  );

  return (
    <menu-usuario>
      <aside id="menu-usuario">
        <nav>
          <ul>{elementos}</ul>
        </nav>
      </aside>
    </menu-usuario>
  );
};
