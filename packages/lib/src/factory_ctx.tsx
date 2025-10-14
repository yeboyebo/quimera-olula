import { createContext, PropsWithChildren, useState } from "react";
import { ElementoMenu } from "./menu.ts";

type APP = Record<string, Record<string, unknown>>;
type Menu = ElementoMenu[];

// eslint-disable-next-line react-refresh/only-export-components
export const FactoryObj = {
  app: {} as APP,
  setApp: (_app: APP) => {},
  menu: [] as Menu,
  setMenu: (_menu: Menu) => {},
};
FactoryObj.setApp = (app: APP) => {
  FactoryObj.app = app;
};
FactoryObj.setMenu = (menu: Menu) => {
  FactoryObj.menu = menu;
};

// eslint-disable-next-line react-refresh/only-export-components
export const FactoryCtx = createContext(FactoryObj);

export const FactoryProvider = ({ children }: PropsWithChildren) => {
  const [app, setApp] = useState<APP>({});
  const [menu, setMenu] = useState<Menu>([]);

  FactoryObj.app = app;
  FactoryObj.setApp = setApp;
  FactoryObj.menu = menu;
  FactoryObj.setMenu = setMenu;

  return (
    <FactoryCtx.Provider value={{ app, menu, setApp, setMenu }}>
      {children}
    </FactoryCtx.Provider>
  );
};
