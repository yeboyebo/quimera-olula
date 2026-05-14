import { Icon } from "@mui/material";
import { estaAutentificado } from "@olula/componentes/plantilla/autenticacion.ts";
import "@olula/componentes/plantilla/Cabecera.css";
import { CabeceraProps } from "@olula/componentes/plantilla/Cabecera.tsx";
import { useMenuControl } from "@olula/componentes/plantilla/useMenuControl.ts";
import { FactoryCtx } from "@olula/lib/factory_ctx.tsx";
import { useContext } from "react";
import { Link } from "react-router";
import "./Cabecera.scss";

export const CabeceraGan = (_props?: CabeceraProps) => {
  const { app } = useContext(FactoryCtx);
  const { toggleMenu } = useMenuControl();
  const AccionesCabecera = app.Componentes
    ?.cabecera_acciones as () => React.ReactNode;
  const autenticado = estaAutentificado();

  return (
    <>
      <header>
        {autenticado && (
          <>
            <button
              id="boton-menu-lateral"
              aria-label="Abrir menú lateral"
              onClick={() => toggleMenu("lateral")}
            ></button>
            <label htmlFor="boton-menu-lateral" id="etiqueta-menu-abierto" />
          </>
        )}
        <Link to="/" className={"logoGanso" + (!autenticado ? " login" : "")}>
          <img src="/logo_ganso.png" alt="ElGanso | Inicio" />
        </Link>
        <div id="cabecera-acciones-extra">
          {AccionesCabecera ? <AccionesCabecera /> : null}
        </div>
        {autenticado && (
          <>
            <button
              id="boton-menu-usuario"
              aria-label="Abrir menú usuario"
              onClick={() => toggleMenu("usuario")}
            ></button>
            <label
              htmlFor="boton-menu-usuario"
              id="etiqueta-menu-usuario-abierto"
            >
              <Icon fontSize="large">account_circle</Icon>
            </label>
          </>
        )}
      </header>
    </>
  );
};
