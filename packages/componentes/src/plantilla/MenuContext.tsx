import { createContext, useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router";

export type MenuType = "lateral" | "usuario";

interface MenuContextType {
  menuAbierto: Record<MenuType, boolean>;
  abrirMenu: (menu: MenuType) => void;
  cerrarMenu: (menu: MenuType) => void;
  toggleMenu: (menu: MenuType) => void;
  cerrarTodos: () => void;
}

export const MenuContext = createContext<MenuContextType | undefined>(
  undefined
);

export const MenuProvider = ({ children }: { children: React.ReactNode }) => {
  const [menuAbierto, setMenuAbierto] = useState<Record<MenuType, boolean>>({
    lateral: false,
    usuario: false,
  });

  const location = useLocation();

  const cerrarTodos = useCallback(() => {
    setMenuAbierto({ lateral: false, usuario: false });
  }, []);

  // Cerrar menús automáticamente al navegar
  useEffect(() => {
    cerrarTodos();
  }, [cerrarTodos, location.pathname]);

  const abrirMenu = useCallback((menu: MenuType) => {
    setMenuAbierto((prev) => ({ ...prev, [menu]: true }));
  }, []);

  const cerrarMenu = useCallback((menu: MenuType) => {
    setMenuAbierto((prev) => ({ ...prev, [menu]: false }));
  }, []);

  const toggleMenu = useCallback((menu: MenuType) => {
    setMenuAbierto((prev) => ({ ...prev, [menu]: !prev[menu] }));
  }, []);

  const value: MenuContextType = {
    menuAbierto,
    abrirMenu,
    cerrarMenu,
    toggleMenu,
    cerrarTodos,
  };

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
};
