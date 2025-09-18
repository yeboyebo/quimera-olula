import { useContext } from "react";
import { QBoton } from "../../../../../componentes/atomos/qboton.tsx";
import { QInput } from "../../../../../componentes/atomos/qinput.tsx";
import { ContextoError } from "../../../../comun/contexto.ts";
import { useModelo } from "../../../../comun/useModelo.ts";
import { Articulo } from "../../../comun/componentes/Articulo.tsx";
import { LineaTransferenciaStock } from "../../diseño.ts";
import { metaLineaTransferenciaStock } from "../../dominio.ts";
import { actualizarLineaTransferenciaStock } from "../../infraestructura.ts";

export const DetalleLineaTransferenciaStock = ({
  lineaInicial,
  emitir,
  transferenciaID,
}: {
  lineaInicial: LineaTransferenciaStock;
  emitir: (evento: string, payload: unknown) => void;
  transferenciaID: string;
}) => {
  const { modelo, uiProps, valido } = useModelo(metaLineaTransferenciaStock, {
    ...lineaInicial,
  });

  const { intentar } = useContext(ContextoError);

  const guardar = async () => {
    await intentar(() =>
      actualizarLineaTransferenciaStock(transferenciaID, modelo.id, modelo)
    );
    emitir("linea_transferencia_cambiada", modelo);
  };

  return (
    <div className="DetalleLineaTransferenciaStock">
      <h2>Edición de línea</h2>

      <quimera-formulario>
        <Articulo {...uiProps("sku", "descripcion_producto")} />
        <QInput label="Cantidad" {...uiProps("cantidad")} />
      </quimera-formulario>
      <div className="botones maestro-botones ">
        <QBoton onClick={guardar} deshabilitado={!valido}>
          Guardar
        </QBoton>
      </div>
    </div>
  );
};
