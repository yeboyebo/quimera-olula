import { useState } from "react";
import { QBoton } from "../atomos/qboton.tsx";
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
    <qhistorias-componente style={{ colorScheme: tema }} key={clave}>
      <section>
        <h2>{clave}</h2>
        <section>
          {Object.entries(historias).map((historia) => (
            <RenderHistoria key={historia[0]} historia={historia} meta={meta} />
          ))}
        </section>
      </section>
    </qhistorias-componente>
  );
};

const renderCode = (atributos: AtributosHistoria[], meta: MetaHistorias) => {
  const comp = meta.Componente.name;

  const valorTexto = (valor: unknown) => {
    if (typeof valor === "string") {
      return valor;
    }

    if (typeof valor === "boolean") {
      return valor ? "true" : "false";
    }

    if (typeof valor === "number") {
      return valor.toString();
    }

    return JSON.stringify(valor);
  };

  const atributosTexto = (atributos: AtributosHistoria) =>
    Object.entries(atributos).map(([k, v]) => {
      const valor = valorTexto(v);

      return (
        <div className="attribute" key={k + valor}>
          {valor === "true" ? (
            <span className="key">{k}</span>
          ) : (
            <>
              <span className="key">{k}</span>=
              <span className="value">"{valor}"</span>
            </>
          )}
        </div>
      );
    });

  const texto = atributos.map((attrs) => (
    <div className="component" key={Object.values(attrs).toString()}>
      {"<"}
      <span className="tag">{comp}</span>
      {atributosTexto(attrs)}
      {"/>"}
    </div>
  ));

  return <pre>{texto}</pre>;
};

const RenderHistoria = ({
  historia: [titulo, attrs],
  meta,
}: {
  historia: [string, Historia];
  meta: MetaHistorias;
}) => {
  const [mostrarCodigo, setMostrarCodigo] = useState(false);
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
          <QBoton
            tipo="submit"
            tamaño="pequeño"
            onClick={() => setMostrarCodigo(!mostrarCodigo)}
          >
            {mostrarCodigo ? "Ocultar código" : "Mostrar código"}
          </QBoton>
        </section>
        <aside data-codigo={mostrarCodigo.toString()}>
          {renderCode(atributosCompletos, meta)}
        </aside>
      </article>
    </qhistorias-historia>
  );
};

const renderContenidoHistoria = (
  Componente: ComponenteHistoria,
  attrs: AtributosHistoria
) => {
  return <Componente key={Object.values(attrs).toString()} {...attrs} />;
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
