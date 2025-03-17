import { useState } from "react";
import { Link } from "react-router";
import estilos from "./MenuItem.module.css";

interface MenuItemProps {
  nombre: string;
  url: string;
  icono?: string;
  subMenuItems?: MenuItemProps[];
  mostrarDesplegado?: boolean;
}

export const MenuItem = ({
  nombre,
  url,
  icono,
  subMenuItems,
  mostrarDesplegado,
}: MenuItemProps) => {
  const [menuAbierto, setMenuAbierto] = useState<boolean>(
    mostrarDesplegado ?? false
  );
  const handlerMenuButton = () => () => setMenuAbierto(!menuAbierto);

  const renderDesplegarSubMenuIcono = () => {
    if (!subMenuItems || subMenuItems.length === 0) return null;
    if (!menuAbierto) {
      return (
        <button onClick={handlerMenuButton()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-chevron-compact-down"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M1.553 6.776a.5.5 0 0 1 .67-.223L8 9.44l5.776-2.888a.5.5 0 1 1 .448.894l-6 3a.5.5 0 0 1-.448 0l-6-3a.5.5 0 0 1-.223-.67"
            />
          </svg>
        </button>
      );
    }
    return (
      <button onClick={handlerMenuButton()}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-chevron-compact-up"
          viewBox="0 0 16 16"
        >
          <path
            fillRule="evenodd"
            d="M7.776 5.553a.5.5 0 0 1 .448 0l6 3a.5.5 0 1 1-.448.894L8 6.56 2.224 9.447a.5.5 0 1 1-.448-.894z"
          />
        </svg>
      </button>
    );
  };

  const renderSubmenuItems = () => {
    if (!subMenuItems) return null;
    return (
      <div className={estilos.subMenuItems}>
        <div className="items">
          {menuAbierto &&
            subMenuItems.map((item) => (
              <MenuItem
                key={item.url + "-" + Math.random()}
                url={item.url}
                nombre={item.nombre}
                icono={item.icono ?? undefined}
                subMenuItems={item.subMenuItems}
              ></MenuItem>
            ))}
        </div>
      </div>
    );
  };
  const renderIcono = (icono: string | undefined) => {
    if (!icono) return <span className="iconoSpace"></span>;
    if (icono.startsWith("fa-"))
      return <i className={estilos.iconoMenu + `fas ${icono}`}></i>;
    if (icono.startsWith("bi-"))
      return <i className={estilos.iconoMenu + `bi ${icono}`}></i>;
    if (icono.startsWith("ri-"))
      return <i className={estilos.iconoMenu + `ri ${icono}`}></i>;
    if (icono === "inicio")
      return (
        <i className={estilos.iconoMenu}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-house"
            viewBox="0 0 16 16"
          >
            <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5z" />
          </svg>
        </i>
      );

    if (icono === "graficos")
      return (
        <i className={estilos.iconoMenu}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-bar-chart-line"
            viewBox="0 0 16 16"
          >
            <path d="M11 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h1V7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7h1zm1 12h2V2h-2zm-3 0V7H7v7zm-5 0v-3H2v3z" />
          </svg>
        </i>
      );

    if (icono === "documentos")
      return (
        <i className={estilos.iconoMenu}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-file-earmark-text"
            viewBox="0 0 16 16"
          >
            <path d="M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5" />
            <path d="M9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5zm0 1v2A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z" />
          </svg>
        </i>
      );
    return <i className={estilos.iconoMenu}></i>;
  };

  const active = window.location.pathname === url ? estilos.active : "";
  return (
    <div
      className={estilos.menuItem + " " + active}
      key={url + "_" + Math.random()}
    >
      {renderIcono(icono)}
      <Link key={url + "-" + Math.random()} to={url}>
        {nombre}
      </Link>
      <div className={estilos.desplegarMenuIcono}>
        {renderDesplegarSubMenuIcono()}
      </div>
      {renderSubmenuItems()}
    </div>
  );
};
