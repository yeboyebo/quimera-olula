import { QIcono } from "@olula/componentes/index.js";
import { estaAutentificado } from "@olula/componentes/plantilla/autenticacion.js";
import "@olula/componentes/plantilla/Cabecera.css";
import { CabeceraProps } from "@olula/componentes/plantilla/Cabecera.tsx";
import { useMenuControl } from "@olula/componentes/plantilla/useMenuControl.js";
import { Link } from "react-router";
import "./Cabecera.scss";

export const CabeceraBase = ({
  logoSrc = "/olula_header_blanco.png",
  logoAlt = "Olula | Inicio",
  Titulo,
  AccionesCabecera,
  MenuUsuario,
  ExtraLogo,
}: CabeceraProps) => {
  const { toggleMenu } = useMenuControl();
  const autenticado = estaAutentificado();

  return (
    <>
      <header className="cabecera-principal">
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
          <img src={logoSrc} alt={logoAlt} className="logo-app" />
        </Link>
        {ExtraLogo ? <ExtraLogo /> : null}
        <div id="cabecera-titulo">{Titulo ? <Titulo /> : null}</div>
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
              {MenuUsuario ? (
                <MenuUsuario />
              ) : (
                <QIcono nombre="perfil" tamaño="sm" />
              )}
            </label>
          </>
        )}
      </header>
    </>
  );
};

export const CabeceraGanso = (props: CabeceraProps) => {
  return (
    <CabeceraBase
      {...props}
      logoSrc="/logo_ganso.png"
      logoAlt="ElGanso | Inicio"
    />
  );
};
