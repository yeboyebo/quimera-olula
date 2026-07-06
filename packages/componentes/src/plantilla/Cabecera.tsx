import { OlulaWordmark } from "@olula/componentes/tema/Olula.jsx";
import { FactoryCtx } from "@olula/lib/factory_ctx.tsx";
import { useContext } from "react";
import { Link, useLocation } from "react-router";
import { QIcono } from "../atomos/qicono.tsx";
import "./Cabecera.css";
import { NotificacionesCabecera } from "./NotificacionesCabecera.tsx";
import { estaAutentificado } from "./autenticacion";
import { useMenuControl } from "./useMenuControl";

export type CabeceraProps = {
  logoSrc?: string;
  logoAlt?: string;
  logoClassName?: string;
  Logo?: (() => React.ReactNode) | null;
  Titulo?: () => React.ReactNode;
  NotificacionesCabecera?: () => React.ReactNode;
  AccionesCabecera?: () => React.ReactNode;
  MenuUsuario?: () => React.ReactNode;
  ExtraLogo?: () => React.ReactNode;
};

export const CabeceraBase = ({
  logoSrc = "/olula-wordmark.svg",
  logoAlt = "Olula | Inicio",
  Logo = () =>
    OlulaWordmark({
      color: "#ffffff",
      bowlColor: "#ffffff",
      className: "logo-app",
      style: {},
    }),
  Titulo,
  NotificacionesCabecera: Notificaciones,
  AccionesCabecera,
  MenuUsuario,
  ExtraLogo,
}: CabeceraProps) => {
  const { toggleMenu } = useMenuControl();
  const autenticado = estaAutentificado();

  console.log("Logo", Logo);
  return (
    <>
      <header className="cabecera-principal">
        <button
          id="boton-menu-lateral"
          aria-label="Abrir menú lateral"
          onClick={() => toggleMenu("lateral")}
        ></button>

        <label htmlFor="boton-menu-lateral" id="etiqueta-menu-abierto" />
        <Link to="/">
          {Logo ? (
            <Logo />
          ) : (
            <img src={logoSrc} alt={logoAlt} className="logo-app" />
          )}
        </Link>
        {ExtraLogo ? <ExtraLogo /> : null}
        <div id="cabecera-titulo">{Titulo ? <Titulo /> : null}</div>
        <div id="cabecera-acciones">
          <div id="cabecera-acciones-globales">
            {Notificaciones ? <Notificaciones /> : null}
          </div>
          <div id="cabecera-acciones-extra">
            {AccionesCabecera ? <AccionesCabecera /> : null}
          </div>
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

export const Cabecera = (props: CabeceraProps) => {
  const { app } = useContext(FactoryCtx);
  const CabeceraCustom = app.Componentes?.cabecera as typeof CabeceraBase;
  const NotificacionesCabeceraCustom = app.Componentes
    ?.cabecera_notificaciones as () => React.ReactNode;
  const AccionesCabecera = app.Componentes
    ?.cabecera_acciones as () => React.ReactNode;
  const MenuUsuario = app.Componentes
    ?.cabecera_menu_usuario as () => React.ReactNode;
  const ExtraLogo = app.Componentes
    ?.cabecera_extra_logo as () => React.ReactNode;
  const cProps: CabeceraProps = {
    ...props,
    NotificacionesCabecera:
      NotificacionesCabeceraCustom ||
      props.NotificacionesCabecera ||
      NotificacionesCabecera,
    // Logo: Logo || props.Logo,
    AccionesCabecera: AccionesCabecera || props.AccionesCabecera,
    MenuUsuario: MenuUsuario || props.MenuUsuario,
    ExtraLogo: ExtraLogo || props.ExtraLogo,
    Titulo: props.Titulo,
  };

  const { pathname } = useLocation();

  const rutasExcluidas = [
    "/login",
    "/forgot-password",
    "/signup",
    "/welcome",
    "/auth/passkey/enlace-magico",
    "/auth/reset-password",
  ];
  const esRutaExcluida = rutasExcluidas.some((ruta) =>
    pathname.startsWith(ruta)
  );

  if (esRutaExcluida) {
    return null;
  }

  return CabeceraCustom ? (
    <CabeceraCustom {...cProps} />
  ) : (
    <CabeceraBase {...cProps} />
  );
};
