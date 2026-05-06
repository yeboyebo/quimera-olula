import { Modulo } from "../diseño.ts";

/**
 * Tab Información: solo lectura, muestra datos del módulo
 */
export const TabInformacion = ({ modulo }: { modulo: Modulo }) => {
  return (
    <div className="TabInformacion">
      <div className="info-grupo">
        <h4>Detalles del Módulo</h4>
        <p>
          <strong>ID:</strong> {modulo.id}
        </p>
        <p>
          <strong>Nombre:</strong> {modulo.nombre}
        </p>
        <p>
          <strong>Estado:</strong>{" "}
          <span className={`badge estado-${modulo.estado}`}>
            {modulo.estado}
          </span>
        </p>
        <p>
          <strong>Fecha de creación:</strong>{" "}
          {modulo.fecha_creacion.toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>

      <div className="info-grupo">
        <h4>Descripción</h4>
        <p className="descripcion-texto">
          {modulo.descripcion || <em>Sin descripción</em>}
        </p>
      </div>
    </div>
  );
};
