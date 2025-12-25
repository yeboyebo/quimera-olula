import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { useModelo } from "@olula/lib/useModelo.ts";

import { metaNuevoPagoEfecctivo } from "#/ventas/venta/dominio.ts";
import { QModal } from "@olula/componentes/index.js";
import { ContextoError } from "@olula/lib/contexto.js";
import { EmitirEvento } from "@olula/lib/diseño.js";
import { useContext, useEffect } from "react";
import { nuevoPagoEfectivoVacio } from "../../dominio.ts";
import { postPago } from "../../infraestructura.ts";
import "./AltaPago.css";

export const AltaPago = ({
  activo = false,
  publicar,
  idVenta,
  refrescarCabecera,
  pendiente,
}: {
  activo: boolean;
  publicar: EmitirEvento;
  idVenta: string;
  refrescarCabecera: () => void;
  pendiente: number
}) => {

  const { modelo, uiProps, valido, init, dispatch } = useModelo(metaNuevoPagoEfecctivo, {
    ...nuevoPagoEfectivoVacio,
    factura_id: idVenta,
  });

  const { intentar } = useContext(ContextoError);

  const crear = async () => {
    await intentar(() => postPago(idVenta, {
      importe: Number(modelo.importe),
      idFormaPago: "efectivo",
    }));
    publicar("pago_creado");
    init();
    refrescarCabecera();
  };

  const cancelar = () => {
    publicar("pago_cancelado");
    init();
  };

  useEffect(() => {
    console.log("AltaPago", activo);
    if (activo) {
      dispatch({
            type: "set_campo",
            payload: { campo:'importe', valor:pendiente.toString() },
        });
    }
  }, [activo]);

  return (
    <QModal abierto={activo} nombre="mostrar" onCerrar={cancelar}>
      <div className="AltaPago">
        <h2>Nuevo pago</h2>
        <quimera-formulario>
          <QInput label="Importe" {...uiProps("importe")} />
        </quimera-formulario>
        <div className="botones maestro-botones ">
          <QBoton onClick={crear} deshabilitado={!valido}>
            Guardar
          </QBoton>
        </div>
      </div>
    </QModal>
  );
};
