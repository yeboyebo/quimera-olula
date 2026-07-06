import { formatearMoneda } from "@olula/lib/dominio.ts";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  cargarModeloWidgetPrevision,
  ModeloWidgetPrevision,
  modeloWidgetPrevisionInicial,
} from "./dominio.ts";
import "./WidgetPrevisionOportunidades.css";

export const WidgetPrevisionOportunidades = () => {
  const [modelo, setModelo] = useState<ModeloWidgetPrevision>(
    modeloWidgetPrevisionInicial
  );

  useEffect(() => {
    let cancelado = false;

    cargarModeloWidgetPrevision()
      .then((siguienteModelo) => {
        if (cancelado) return;
        setModelo(siguienteModelo);
      })
      .catch((error) => {
        if (cancelado) return;
        console.error("Error cargando prevision de oportunidades", error);
        setModelo((previo) => ({ ...previo, estado: "listo" }));
      });

    return () => {
      cancelado = true;
    };
  }, []);

  const textoPrevision = formatearMoneda(modelo.previsionPotencial, "EUR");

  if (modelo.estado === "cargando") {
    return <div>Cargando previsión de oportunidades...</div>;
  }

  if (modelo.oportunidadesAbiertas === 0) {
    return (
      <div className="widget-prevision-oportunidades">
        <h3 className="widget-prevision-oportunidades__titulo">CRM</h3>
        <div>No tienes oportunidades abiertas</div>
      </div>
    );
  }

  return (
    <div className="widget-prevision-oportunidades">
      <h3 className="widget-prevision-oportunidades__titulo">CRM</h3>
      <div className="widget-prevision-oportunidades__valor">
        Prevision de ventas potencial <strong>{textoPrevision}</strong>
      </div>
      <div className="widget-prevision-oportunidades__acciones">
        <Link
          className="widget-prevision-oportunidades__enlace"
          to={modelo.urlVer}
        >
          Ver
        </Link>
      </div>
    </div>
  );
};
