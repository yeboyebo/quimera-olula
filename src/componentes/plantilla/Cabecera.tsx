import { Link } from "react-router";
import { MenuPrincipal } from "../menuPrincipal/MenuPrincipal";

export const Cabecera = () => {
  return (
    <header style={{ display: "flex" }}>
      <MenuPrincipal key="menuPrincipalCabecera" />
      <Link to="/">Quimera Olula</Link>
    </header>
  );
};
