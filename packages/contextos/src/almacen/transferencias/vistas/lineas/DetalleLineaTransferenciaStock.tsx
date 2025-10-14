import { Articulo } from "#/almacen/comun/componentes/Articulo.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useContext } from "react";
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
