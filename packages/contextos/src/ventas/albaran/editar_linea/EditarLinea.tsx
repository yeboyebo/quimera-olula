import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QModal } from "@olula/componentes/index.js";
import { Articulo } from "@olula/ctx/ventas/comun/componentes/articulo.tsx";
import { GrupoIvaProducto } from "@olula/ctx/ventas/comun/componentes/grupo_iva_producto.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { EmitirEvento } from "@olula/lib/diseño.js";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useCallback, useContext } from "react";
import { LineaAlbaran } from "../diseño.ts";
import { patchLinea } from "../infraestructura.ts";
import { metaLineaAlbaran } from "./dominio.ts";
import "./EditarLinea.css";

export const EditarLinea = ({
  publicar,
  linea,
  albaranId,
}: {
  linea: LineaAlbaran;
  albaranId: string;
  publicar: EmitirEvento;
}) => {
  const { intentar } = useContext(ContextoError);
  const { modelo, uiProps, valido } = useModelo(metaLineaAlbaran, linea);

  const cambiar = useCallback(async () => {
    await intentar(() => patchLinea(albaranId, modelo));
    publicar("cambio_linea_listo");
  }, [modelo, publicar, albaranId, intentar]);

  const cancelar = useCallback(() => {
    publicar("cambio_linea_cancelado");
  }, [publicar]);

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
