import {
  QAvatar,
  QBoton,
  QIcono,
  QTarjetaGenerica,
} from "@olula/componentes/index.js";
import { formatearFechaDate } from "@olula/lib/dominio.js";
import { Accion } from "../diseño.ts";
import "./TarjetaAccionRapida.css";

const iconoTipoAccion = (tipo: string) => {
  const icono: Record<string, string> = {
    Tarea: "tarea",
    "E-mail": "correo",
    Teléfono: "telefono",
    Visita: "casa",
    Otro: "llaveinglesa",
  };

  return icono[tipo] ?? "llaveinglesa";
};

const estaVencida = (fecha: Date | null): boolean => {
  if (!fecha) return false;
  return new Date(fecha) < new Date();
};

export const TarjetaAccionRapida = ({
  accion,
  onFinalizar,
  onEditar,
}: {
  accion: Accion;
  onFinalizar: (id: string) => void;
  onEditar: (accion: Accion) => void;
}) => {
  const vencida = estaVencida(accion.fecha);

  return (
    <QTarjetaGenerica
      avatar={
        <QAvatar className={accion.estado}>
          <QIcono nombre={iconoTipoAccion(accion.tipo)} tamaño="sm" />
        </QAvatar>
      }
      arribaIzquierda={accion.descripcion}
      arribaDerecha={
        accion.fecha ? (
          <span className={vencida ? "tarjeta-accion-fecha-vencida" : ""}>
            {formatearFechaDate(accion.fecha)}
          </span>
        ) : (
          ""
        )
      }
      abajoIzquierda={accion.estado}
      abajoDerecha={accion.nombre_cliente}
      expansion={
        <div className="tarjeta-accion-rapida-acciones">
          <QBoton
            tamaño="pequeño"
            variante="borde"
            onClick={(e) => {
              e.stopPropagation();
              onFinalizar(accion.id);
            }}
          >
            ✓ Hecha
          </QBoton>
          <QBoton
            tamaño="pequeño"
            variante="texto"
            onClick={(e) => {
              e.stopPropagation();
              onEditar(accion);
            }}
          >
            Editar
          </QBoton>
        </div>
      }
    />
  );
};
