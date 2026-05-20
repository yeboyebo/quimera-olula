import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { Detalle } from "@olula/componentes/detalle/Detalle.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.js";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { formatearFechaDate } from "@olula/lib/dominio.js";
import { useEffect } from "react";
import { useParams } from "react-router";
import { Comunicacion } from "../diseño.ts";
import { comunicacionVacia } from "../dominio.ts";
import "./DetalleComunicacion.css";
import { getMaquina } from "./maquina.ts";

const fechaConHora = (fecha: Date | null) => {
  if (!fecha) return "-";

  return `${formatearFechaDate(fecha)} ${fecha.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
};

export const DetalleComunicacion = ({
  id,
  publicar,
}: {
  id?: string;
  publicar: EmitirEvento;
}) => {
  const params = useParams();
  const comunicacionId = id ?? params.id;

  const { ctx, emitir } = useMaquina(
    getMaquina,
    {
      estado: "INICIAL",
      comunicacion: comunicacionVacia(),
      comunicacionInicial: comunicacionVacia(),
    },
    publicar
  );

  useEffect(() => {
    emitir("comunicacion_id_cambiado", comunicacionId, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [comunicacionId]);

  if (!comunicacionId || !ctx.comunicacion.id) return null;

  return (
    <Detalle
      id={ctx.comunicacion.id}
      obtenerTitulo={(entidad) =>
        (entidad as Comunicacion).asunto || "Comunicación"
      }
      setEntidad={() => {}}
      entidad={ctx.comunicacion}
      cerrarDetalle={() => emitir("comunicacion_deseleccionada", null)}
    >
      <div className="DetalleComunicacion">
        <div className="acciones-rapidas maestro-botones">
          <QBoton onClick={() => emitir("borrado_solicitado")}>Borrar</QBoton>
        </div>

        <div className="detalle-comunicacion-campos">
          <p>
            <strong>Estado:</strong> {ctx.comunicacion.estado}
          </p>
          <p>
            <strong>Fecha envío:</strong>{" "}
            {fechaConHora(ctx.comunicacion.fechaEnvio)}
          </p>
          <p>
            <strong>Fecha lectura:</strong>{" "}
            {fechaConHora(ctx.comunicacion.fechaLectura)}
          </p>
          <p>
            <strong>Asunto:</strong> {ctx.comunicacion.asunto}
          </p>
          <div>
            <strong>Cuerpo:</strong>
            <p className="detalle-comunicacion-cuerpo">
              {ctx.comunicacion.cuerpo}
            </p>
          </div>
        </div>
      </div>
    </Detalle>
  );
};
