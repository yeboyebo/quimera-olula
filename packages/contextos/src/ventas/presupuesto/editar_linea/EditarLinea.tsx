import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QModal } from "@olula/componentes/index.js";
import { Articulo } from "@olula/ctx/ventas/comun/componentes/articulo.tsx";
import { GrupoIvaProducto } from "@olula/ctx/ventas/comun/componentes/grupo_iva_producto.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { EmitirEvento } from "@olula/lib/diseño.js";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useCallback, useContext, useState } from "react";
import { LineaPresupuesto } from "../diseño.ts";
import { patchLinea } from "../infraestructura.ts";
import { metaLinea } from "./dominio.ts";
import "./EditarLinea.css";

export const EditarLinea = ({
  presupuestoId,
  publicar,
  linea,
}: {
  presupuestoId: string;
  linea: LineaPresupuesto;
  publicar: EmitirEvento;
}) => {
  const { intentar } = useContext(ContextoError);
  const { modelo, uiProps, valido } = useModelo(metaLinea, linea);
  const [cambiando, setCambiando] = useState(false);

  const cambiar = useCallback(async () => {
    await intentar(() => patchLinea(presupuestoId, modelo));
    setCambiando(true);
    publicar("linea_actualizada");
  }, [modelo, publicar, presupuestoId, intentar]);

  const cancelar = useCallback(() => {
    if (!cambiando) publicar("edicion_linea_cancelada");
  }, [cambiando, publicar]);

  return (
    <QModal abierto={true} nombre="mostrar" onCerrar={cancelar}>
      <div className="EditarLinea">
        <h2>Editar línea</h2>

        <quimera-formulario>
          <div id="titulo">
            <h3>{`${linea.descripcion}`}</h3>
            {`Ref: ${linea.referencia}`}
          </div>

          <Articulo {...uiProps("referencia", "descripcion")} />

          <QInput label="Cantidad" {...uiProps("cantidad")} />

          <GrupoIvaProducto {...uiProps("grupo_iva_producto_id")} />

          <QInput label="Precio" {...uiProps("pvp_unitario")} />

          <QInput label="% Descuento" {...uiProps("dto_porcentual")} />
        </quimera-formulario>

        <div className="botones maestro-botones ">
          <QBoton onClick={cambiar} deshabilitado={!valido}>
            Guardar
          </QBoton>
        </div>
      </div>
    </QModal>
  );
};
