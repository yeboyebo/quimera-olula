import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QModal } from "@olula/componentes/index.js";
import { Articulo } from "@olula/ctx/ventas/comun/componentes/articulo.tsx";
import { GrupoIvaProducto } from "@olula/ctx/ventas/comun/componentes/grupo_iva_producto.tsx";
import { ContextoError } from "@olula/lib/contexto.js";
import { EmitirEvento } from "@olula/lib/diseño.js";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useContext, useEffect } from "react";
import { LineaPresupuesto } from "../../../diseño.ts";
import { metaLinea } from "../../../dominio.ts";
import { patchLinea } from "../../../infraestructura.ts";
import "./EdicionLinea.css";
export const EdicionLinea = ({
  publicar,
  activo,
  lineaSeleccionada,
  idPresupuesto,
  refrescarCabecera,
}: {
  lineaSeleccionada: LineaPresupuesto;
  publicar: EmitirEvento;
  activo: boolean;
  idPresupuesto: string;
  refrescarCabecera: () => void;
}) => {
  const { intentar } = useContext(ContextoError);
  const { modelo, uiProps, valido, init } = useModelo(
    metaLinea,
    lineaSeleccionada
  );
  const guardar = async (linea: LineaPresupuesto) => {
    await intentar(() => patchLinea(idPresupuesto, linea));
    publicar("edicion_confirmada");
    refrescarCabecera();
  };

  useEffect(() => {
    init(lineaSeleccionada);
  }, [lineaSeleccionada, init]);

  const cancelar = () => {
    publicar("edicion_cancelada");
    init();
  };

  return (
    <QModal abierto={activo} nombre="mostrar" onCerrar={cancelar}>
      <div className="EdicionLinea">
        <h2>Edición de línea</h2>
        <quimera-formulario>
          <Articulo {...uiProps("referencia", "descripcion")} />
          <QInput label="Cantidad" {...uiProps("cantidad")} />
          <GrupoIvaProducto {...uiProps("grupo_iva_producto_id")} />
          <QInput label="Precio" {...uiProps("pvp_unitario")} />
          <QInput label="% Descuento" {...uiProps("dto_porcentual")} />
        </quimera-formulario>
        <div className="botones maestro-botones ">
          <QBoton onClick={() => guardar(modelo)} deshabilitado={!valido}>
            Guardar
          </QBoton>
        </div>
      </div>
    </QModal>
  );
};
