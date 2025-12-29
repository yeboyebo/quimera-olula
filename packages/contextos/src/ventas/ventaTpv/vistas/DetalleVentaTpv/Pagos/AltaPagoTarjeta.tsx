import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { useModelo } from "@olula/lib/useModelo.ts";

import { metaNuevoPagoEfecctivo } from "#/ventas/venta/dominio.ts";
import { QModal } from "@olula/componentes/index.js";
import { ContextoError } from "@olula/lib/contexto.js";
import { EmitirEvento } from "@olula/lib/diseño.js";
import { useContext, useEffect } from "react";
import { nuevoPagoEfectivoVacio } from "../../../dominio.ts";
import { postPago } from "../../../infraestructura.ts";
import "./AltaPagoTarjeta.css";

export const AltaPagoTarjeta = ({
  activo = false,
  publicar,
  idVenta,
  pendiente,
}: {
  activo: boolean;
  publicar: EmitirEvento;
  idVenta: string;
  pendiente: number
}) => {

  const { modelo, uiProps, valido, dispatch } = useModelo(metaNuevoPagoEfecctivo, {
    ...nuevoPagoEfectivoVacio,
    factura_id: idVenta,
  });

  const { intentar } = useContext(ContextoError);

  const crear = async () => {
    const pagado = Number(modelo.importe) < pendiente
      ? Number(modelo.importe)
      : pendiente;
    const idPago = await intentar(() => postPago(idVenta, {
      importe: pagado,
      formaPago: "TARJETA",
    }));
    publicar("pago_creado", idPago);
  };

  const cancelar = () => {
    publicar("pago_cancelado");
  };

  useEffect(() => {
    if (activo) {
      setImporte(pendiente);
    }
  }, [activo]);

  const setImporte = (v: number) => {
    dispatch({
      type: "set_campo",
      payload: { campo: "importe", valor: v.toString() },
    });
  }

  const limpiar = () => {
    setImporte(0);  
  }

  return (
    <QModal abierto={activo} nombre="mostrar" onCerrar={cancelar}>
      <div className="AltaPago">
        <h2>Nuevo pago</h2>
        <quimera-formulario>
          <QInput label="Importe" {...uiProps("importe")} />
          
        </quimera-formulario>
        <div className="botones maestro-botones ">
          {`A Pagar: ${pendiente}€`}
          <QBoton onClick={limpiar}>Limpiar</QBoton>
        </div>
        <div className="botones maestro-botones ">
          <QBoton onClick={crear} deshabilitado={!valido}>
            Guardar
          </QBoton>
        </div>
      </div>
    </QModal>
  );
};
