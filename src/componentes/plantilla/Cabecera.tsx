import { Link } from "react-router";

export const Cabecera = () => {
  return (
    <>
      <header>
        <input type="checkbox" id="menu-abierto" name="menu-abierto" />
        <label htmlFor="menu-abierto" id="etiqueta-menu-abierto" />
        <Link to="/">Quimera Olula</Link>
      </header>
    </>
  );
};
