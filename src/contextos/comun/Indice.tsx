import { Link } from "react-router";

export const Indice = () => {
  return (
    <>
      <h1>Quimera Olula</h1>
      <ul>
        <li>
          <Link to="/ventas/cliente">Maestro de clientes</Link>
        </li>
        <li>
          <Link to="/ventas/cliente/000001">Cliente #1</Link>
        </li>
        <li>
          <Link to="/ventas/cliente/000002">Cliente #2</Link>
        </li>
        <li>
          <Link to="/ventas/cliente/000003">Cliente #3</Link>
        </li>
      </ul>
    </>
  );
};
