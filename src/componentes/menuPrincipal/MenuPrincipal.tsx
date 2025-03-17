import { useState } from "react";
import {
  elementosDelMenu,
  MenuItemInterface,
} from "../../contextos/comun/menu";
import { MenuItem } from "./MenuItem";
import estilos from "./MenuPrincipal.module.css";

export const MenuPrincipal = () => {
  const [menuAbierto, setMenuAbierto] = useState<boolean>(false);
  const [showCleanSearchButton, setShowCleanSearchButton] =
    useState<boolean>(false);
  const handlerMenuButton = () => () => setMenuAbierto(!menuAbierto);

  const [originalMenuItems, setOriginalMenuItems] = useState<
    MenuItemInterface[]
  >([]);
  const [menuItems, setMenuItems] = useState<MenuItemInterface[]>([
    ...elementosDelMenu,
  ]);

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === "") {
      //Limpio el filtro
      setMenuItems(originalMenuItems);
      return;
    } else {
      setShowCleanSearchButton(true);
    }

    if (originalMenuItems.length === 0) {
      //Guardo menu original
      setOriginalMenuItems(menuItems);
      return;
    }
    const busqueda = e.target.value;
    const menuFiltrado = menuItems.filter((item) => {
      return (
        item.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        item.subMenuItems.some((subItem) =>
          subItem.nombre.toLowerCase().includes(busqueda.toLowerCase())
        )
      );
    });

    setMenuItems(menuFiltrado);
  };

  const onLimpiarBusqueda = (e: React.MouseEvent<HTMLSpanElement>) => {
    const inputElement = e.currentTarget.parentElement?.getElementsByClassName(
      "buscadorInput"
    )[0] as HTMLInputElement;
    if (inputElement) {
      inputElement.value = "";
    }
    setMenuItems(originalMenuItems);
    setShowCleanSearchButton(false);
  };

  const renderBuscador = () => {
    return (
      <div className={estilos.buscadorMenu}>
        <i className="fas fas-search">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-search"
            viewBox="0 0 16 16"
          >
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
          </svg>
        </i>
        <input
          type="text"
          className="buscadorInput"
          placeholder="Buscar..."
          onChange={onSearch}
        />
        {showCleanSearchButton && (
          <span className="cleanSearch" onClick={onLimpiarBusqueda}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-x"
              viewBox="0 0 16 16"
            >
              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
            </svg>
          </span>
        )}
      </div>
    );
  };

  const comprobarSiMostrarDesplegado = (item: MenuItemInterface) => {
    return (
      menuItems.length == 1 ||
      item.subMenuItems.filter((it: MenuItemInterface) => {
        return window.location.pathname === it.url;
      }).length > 0
    );
  };

  const renderMenuItems = () => {
    if (!menuAbierto) return null;
    return (
      <aside className="menuItems">
        {renderBuscador()}
        {menuItems.map((item) => (
          <MenuItem
            key={item.url + "-" + Math.random()}
            url={item.url}
            nombre={item.nombre}
            icono={item.icono ?? undefined}
            subMenuItems={item.subMenuItems}
            mostrarDesplegado={comprobarSiMostrarDesplegado(item)}
          ></MenuItem>
        ))}
      </aside>
    );
  };

  const renderMenuUsuario = () => {
    if (!menuAbierto) return null;
    return (
      <div className={estilos.menuUsuario}>
        <div className={estilos.menuUsuarioIcono}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-person-circle"
            viewBox="0 0 16 16"
          >
            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
            <path
              fillRule="evenodd"
              d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
            />
          </svg>
        </div>
        <div className={estilos.menuUsuarioNombre}>
          <span>Usuario</span>
        </div>
      </div>
    );
  };

  return (
    <div className={estilos.menuPrincipal} key="menuPrincipal">
      <div className="menuIcono">
        <button onClick={handlerMenuButton()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-list"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"
            />
          </svg>
        </button>
      </div>
      <div className={estilos.menu}>
        {renderMenuItems()}
        {renderMenuUsuario()}
      </div>
    </div>
  );
};
