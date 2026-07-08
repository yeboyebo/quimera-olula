import { formatearFechaDate } from "@olula/lib/dominio.ts";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import "../../widgets/WidgetCrmLista.css";
import {
  cargarModeloWidgetAccionesHoy,
  ModeloWidgetAccionesHoy,
  modeloWidgetAccionesHoyInicial,
} from "./dominio_acciones_hoy.ts";

export const WidgetAccionesHoy = () => {
  const [modelo, setModelo] = useState<ModeloWidgetAccionesHoy>(
    modeloWidgetAccionesHoyInicial
  );

  useEffect(() => {
    let cancelado = false;

    cargarModeloWidgetAccionesHoy()
      .then((siguienteModelo) => {
        if (cancelado) return;
        setModelo(siguienteModelo);
      })
      .catch((error) => {
        if (cancelado) return;
        console.error("Error cargando acciones de hoy", error);
        setModelo((previo) => ({ ...previo, estado: "listo" }));
      });

    return () => {
      cancelado = true;
    };
  }, []);

  if (modelo.estado === "cargando") {
    return <div>Cargando acciones de hoy...</div>;
  }

  return (
    <div className="widget-crm-lista">
      <div className="widget-crm-lista__cabecera">
        <h3 className="widget-crm-lista__titulo">Acciones de hoy</h3>
        <div className="widget-crm-lista__subtitulo">
          {modelo.totalAcciones} pendientes para hoy
        </div>
      </div>

      {modelo.totalAcciones === 0 ? (
        <div className="widget-crm-lista__vacio">
          No tienes acciones para hoy
        </div>
      ) : (
        <div className="widget-crm-lista__grupos">
          {modelo.grupos.map((grupo) => (
            <section key={grupo.tipo} className="widget-crm-lista__grupo">
              <div className="widget-crm-lista__grupo-titulo">{grupo.tipo}</div>
              <div className="widget-crm-lista__lista">
                {grupo.acciones.map((accion) => (
                  <article key={accion.id} className="widget-crm-lista__item">
                    <div className="widget-crm-lista__item-principal">
                      <div className="widget-crm-lista__item-titulo">
                        {accion.descripcion}
                      </div>
                      <div className="widget-crm-lista__item-extra">
                        {accion.fecha ? formatearFechaDate(accion.fecha) : ""}
                      </div>
                    </div>
                    <div className="widget-crm-lista__item-secundario">
                      <div className="widget-crm-lista__item-meta">
                        {accion.nombre_cliente ||
                          accion.descripcion_oportunidad ||
                          accion.estado}
                      </div>
                      <div className="widget-crm-lista__item-extra">
                        {accion.estado}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      <div className="widget-crm-lista__acciones">
        <Link className="widget-crm-lista__enlace" to={modelo.urlVer}>
          Ver todas
        </Link>
      </div>
    </div>
  );
};
