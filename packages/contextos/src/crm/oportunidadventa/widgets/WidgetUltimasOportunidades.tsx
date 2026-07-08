import { formatearFechaDate, formatearMoneda } from "@olula/lib/dominio.ts";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import "../../widgets/WidgetCrmLista.css";
import {
  cargarModeloWidgetUltimasOportunidades,
  ModeloWidgetUltimasOportunidades,
  modeloWidgetUltimasOportunidadesInicial,
} from "./dominio_ultimas_oportunidades.ts";

export const WidgetUltimasOportunidades = () => {
  const [modelo, setModelo] = useState<ModeloWidgetUltimasOportunidades>(
    modeloWidgetUltimasOportunidadesInicial
  );

  useEffect(() => {
    let cancelado = false;

    cargarModeloWidgetUltimasOportunidades()
      .then((siguienteModelo) => {
        if (cancelado) return;
        setModelo(siguienteModelo);
      })
      .catch((error) => {
        if (cancelado) return;
        console.error("Error cargando últimas oportunidades", error);
        setModelo((previo) => ({ ...previo, estado: "listo" }));
      });

    return () => {
      cancelado = true;
    };
  }, []);

  if (modelo.estado === "cargando") {
    return <div>Cargando últimas oportunidades...</div>;
  }

  return (
    <div className="widget-crm-lista">
      <div className="widget-crm-lista__cabecera">
        <h3 className="widget-crm-lista__titulo">Últimas oportunidades</h3>
        <div className="widget-crm-lista__subtitulo">
          Tus 3 oportunidades más recientes
        </div>
      </div>

      {modelo.oportunidades.length === 0 ? (
        <div className="widget-crm-lista__vacio">
          No hay oportunidades recientes
        </div>
      ) : (
        <div className="widget-crm-lista__lista">
          {modelo.oportunidades.map((oportunidad) => (
            <article key={oportunidad.id} className="widget-crm-lista__item">
              <div className="widget-crm-lista__item-principal">
                <div className="widget-crm-lista__item-titulo">
                  {oportunidad.descripcion}
                </div>
                <div className="widget-crm-lista__item-valor">
                  {formatearMoneda(oportunidad.importe, "EUR")}
                </div>
              </div>
              <div className="widget-crm-lista__item-secundario">
                <div className="widget-crm-lista__item-meta">
                  {oportunidad.nombre_cliente ||
                    oportunidad.descripcion_estado ||
                    "Sin cliente"}
                </div>
                <div className="widget-crm-lista__item-extra">
                  {oportunidad.fecha_cierre
                    ? formatearFechaDate(oportunidad.fecha_cierre)
                    : ""}
                </div>
              </div>
            </article>
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
