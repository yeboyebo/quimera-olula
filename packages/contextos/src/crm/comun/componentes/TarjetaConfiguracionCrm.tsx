import { QEtiqueta, QTarjetaGenerica } from "@olula/componentes/index.js";
import { ReactNode } from "react";
import "./TarjetaConfiguracionCrm.css";

/**
 * Tarjeta común para los maestros de configuración del CRM
 * (fuentes de lead, estados de lead, estados de oportunidad).
 *
 * Sin etiquetas (label/valor) para alinearse con el resto de tarjetas del CRM,
 * y con la marca "Por defecto" en su propia línea, solo cuando el registro
 * está marcado.
 */
export const TarjetaConfiguracionCrm = ({
  codigo,
  descripcion,
  valorDefecto,
  derecha,
  abajoDerecha,
}: {
  codigo: string;
  descripcion?: string | null;
  valorDefecto?: boolean;
  derecha?: ReactNode;
  abajoDerecha?: ReactNode;
}) => (
  <article className="TarjetaConfiguracionCrm">
    <QTarjetaGenerica
      arribaIzquierda={
        <span className="tarjeta-config-descripcion">
          {descripcion || codigo}
        </span>
      }
      arribaDerecha={
        derecha ?? <span className="tarjeta-config-codigo">{codigo}</span>
      }
      abajoIzquierda={
        valorDefecto ? (
          <QEtiqueta variante="exito" className="tarjeta-config-defecto">
            Por defecto
          </QEtiqueta>
        ) : undefined
      }
      abajoDerecha={abajoDerecha}
    />
  </article>
);
