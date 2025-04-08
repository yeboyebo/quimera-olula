import { useState } from "react";
import { Plantilla } from "../plantilla/Plantilla.tsx";
import {
  AtributosHistoria,
  ComponenteHistoria,
  Historia,
  HistoriasComponente,
  MetaHistorias,
} from "./diseño.tsx";
import "./historias.css";
import { listadoHistorias } from "./listado-historias.ts";

const renderMenu = (setSeleccionada: (_: HistoriasComponente) => void) =>
  listadoHistorias.map((componente) => {
    const { default: meta } = componente;
    const clave = meta.grupo + "/" + meta.titulo;

    return (
      <li key={clave} onClick={() => setSeleccionada(componente)}>
        {clave}
      </li>
    );
  });

const renderComponente = (componente: HistoriasComponente, tema: string) => {
  const { default: meta, ...historias } = componente;
  const clave = meta.grupo + "/" + meta.titulo;

  return (
    <qhistorias-componente style={{ colorScheme: tema }}>
      <section key={clave}>
        <h2>{clave}</h2>
        <section>
          {Object.entries(historias).map((historia) =>
            renderHistoria(historia, meta)
          )}
        </section>
      </section>
    </qhistorias-componente>
  );
};

const renderCode = (atributos: AtributosHistoria[], meta: MetaHistorias) => {
  const comp = meta.Componente.name;

  const atributosTexto = (atributos: AtributosHistoria) =>
    Object.entries(atributos).map(([k, v]) => (
      <div className="attribute">
        <span className="key">{k}</span>=<span className="value">"{v}"</span>
      </div>
    ));

  const texto = atributos.map((attrs) => (
    <div className="component">
      {"<"}
      <span className="tag">{comp}</span>
      {atributosTexto(attrs)}
      {"/>"}
    </div>
  ));

  return <pre>{texto}</pre>;
};

const renderHistoria = (
  [titulo, attrs]: [string, Historia],
  meta: MetaHistorias
) => {
  const atributos = Array.isArray(attrs)
    ? (attrs as AtributosHistoria[])
    : [attrs];
  const atributosCompletos = atributos.map((attrs) => ({
    ...meta.attrs,
    ...attrs,
  }));

  return (
    <qhistorias-historia>
      <article key={titulo}>
        <h3>{titulo}</h3>
        <section>
          {atributosCompletos.map((attrs) =>
            renderContenidoHistoria(meta.Componente, attrs)
          )}
        </section>
        <aside>{renderCode(atributosCompletos, meta)}</aside>
      </article>
    </qhistorias-historia>
  );
};

const renderContenidoHistoria = (
  Componente: ComponenteHistoria,
  attrs: AtributosHistoria
) => {
  return <Componente {...attrs} />;
};

export const Historias = () => {
  const [seleccionada, setSeleccionada] = useState<HistoriasComponente | null>(
    null
  );
  const [tema, setTema] = useState("light");

  const toggleTema = () => {
    const nuevoTema = tema === "light" ? "dark" : "light";
    setTema(nuevoTema);
  };

  return (
    <Plantilla>
      <quimera-historias>
        <ul>
          <a href="#" onClick={toggleTema}>
            Cambiar tema a {tema === "light" ? "oscuro" : "claro"}
          </a>
          {renderMenu(setSeleccionada)}
        </ul>
        {seleccionada ? renderComponente(seleccionada, tema) : null}
      </quimera-historias>
    </Plantilla>
  );
};
