import { Articulo } from "#/ventas/comun/componentes/articulo.tsx";
import { GrupoIvaProducto } from "#/ventas/comun/componentes/grupo_iva_producto.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useEffect } from "react";
import { LineaFactura } from "../../../diseño.ts";
import { metaLineaFactura } from "../../../dominio.ts";
import "./EdicionLinea.css";
export const EdicionLinea = ({
  lineaInicial,
  emitir,
}: {
  lineaInicial: LineaFactura;
  emitir: (evento: string, payload: unknown) => void;
}) => {
  const { modelo, uiProps, valido, init } = useModelo(
    metaLineaFactura,
    lineaInicial
  );

  useEffect(() => {
    init(lineaInicial);
  }, [lineaInicial, init]);

  return (
    <>
      <h2>Edición de línea</h2>
      <quimera-formulario>
        <Articulo {...uiProps("referencia", "descripcion")} />
        <QInput label="Cantidad" {...uiProps("cantidad")} />
        <GrupoIvaProducto {...uiProps("grupo_iva_producto_id")} />
        <QInput label="Precio" {...uiProps("pvp_unitario")} />
        <QInput label="% Descuento" {...uiProps("dto_porcentual")} />
      </quimera-formulario>
      <div className="botones maestro-botones ">
        <QBoton
          onClick={() => emitir("EDICION_LISTA", modelo)}
          deshabilitado={!valido}
        >
          Guardar
        </QBoton>
      </div>
    </>
  );
};
