import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QModal } from "@olula/componentes/index.js";
import { ContextoError } from "@olula/lib/contexto.js";
import { EmitirEvento } from "@olula/lib/diseño.js";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useContext, useEffect } from "react";
import { LineaFactura } from "../../../diseño.ts";
import { metaLineaFactura } from "../../../dominio.ts";
import { patchLinea } from "../../../infraestructura.ts";
import "./EdicionLinea.css";

export const EdicionLinea = ({
  publicar,
  activo,
  lineaSeleccionada,
  idFactura,
}: {
  lineaSeleccionada: LineaFactura;
  publicar: EmitirEvento;
  activo: boolean;
  idFactura: string;
}) => {

  const { intentar } = useContext(ContextoError);
  const { modelo, uiProps, valido, init } = useModelo(
    metaLineaFactura,
    lineaSeleccionada
  );

  const guardar = async (linea: LineaFactura) => {
    await intentar(() => patchLinea(idFactura, linea));
    publicar("linea_cambiada");
  };

  useEffect(() => {
    init(lineaSeleccionada);
  }, [lineaSeleccionada, init]);

  const cancelar = () => {
    publicar("cambio_linea_cancelado");
    init();
  };

  return (
    <QModal abierto={activo} nombre="mostrar" onCerrar={cancelar}>
      <div className="EdicionLinea">
        <h2>Edición de línea</h2>
        <quimera-formulario>
          <div id='titulo'>
          <h3>{`${lineaSeleccionada.descripcion}`}</h3>
          {`Ref: ${lineaSeleccionada.referencia}`}
          </div>
          <QInput label="Cantidad" {...uiProps("cantidad")} />
          <div id='espacio'/>
          <QInput label="Precio" {...uiProps("pvp_unitario")} />
          <div id='espacio'/>
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
