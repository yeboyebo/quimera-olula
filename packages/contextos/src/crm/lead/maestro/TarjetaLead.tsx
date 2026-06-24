import { QAvatar, QTarjetaGenerica } from "@olula/componentes/index.js";
import { Lead } from "../diseño.ts";

export const TarjetaLead = (lead: Lead) => {
  return (
    <QTarjetaGenerica
      avatar={<QAvatar nombre={lead.nombre} />}
      arribaIzquierda={lead.nombre}
      abajoIzquierda={lead.estado_id}
    />
  );
};
