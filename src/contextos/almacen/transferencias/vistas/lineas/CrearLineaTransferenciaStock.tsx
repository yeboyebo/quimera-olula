import { useContext } from "react";
import { QBoton } from "../../../../../componentes/atomos/qboton.tsx";
import { QInput } from "../../../../../componentes/atomos/qinput.tsx";
import { Mostrar } from "../../../../../componentes/moleculas/Mostrar.tsx";
import { ContextoError } from "../../../../comun/contexto.ts";
import { EmitirEvento } from "../../../../comun/diseño.ts";
import { HookModelo, useModelo } from "../../../../comun/useModelo.ts";
import { Articulo } from "../../../comun/componentes/Articulo.tsx";
import { NuevaLineaTransferenciaStock } from "../../diseño.ts";
import {
  metaNuevaLineaTransferenciaStock,
  nuevaLineaTransferenciaStockVacia,
} from "../../dominio.ts";
import { crearLineaTransferenciaStock } from "../../infraestructura.ts";

export const CrearLineaTransferenciaStock = ({
  publicar = () => {},
  activo = false,
  transferenciaID,
}: {
  publicar?: EmitirEvento;
  activo?: boolean;
  transferenciaID: string;
}) => {
  const linea = useModelo(metaNuevaLineaTransferenciaStock, {
    ...nuevaLineaTransferenciaStockVacia,
  });

  const cancelar = () => {
    linea.init();
    publicar("creacion_cancelada");
  };

  return (
    <Mostrar modo="modal" activo={activo} onCerrar={cancelar}>
      <FormAltaLineaTransferenciaStock
        publicar={publicar}
        linea={linea}
        transferenciaID={transferenciaID}
      />
    </Mostrar>
  );
};

const FormAltaLineaTransferenciaStock = ({
  publicar = () => {},
  linea,
  transferenciaID,
}: {
  publicar?: EmitirEvento;
  linea: HookModelo<NuevaLineaTransferenciaStock>;
  transferenciaID: string;
}) => {
  const { intentar } = useContext(ContextoError);

  const crear = async () => {
    const modelo = {
      ...linea.modelo,
    };
    await intentar(() => crearLineaTransferenciaStock(transferenciaID, modelo));
    publicar("linea_creada", { ...modelo, id: Math.random().toString() });
    linea.init();
  };

  const cancelar = () => {
    publicar("creacion_cancelada");
    linea.init();
  };

  return (
    <div className="CrearLineaTransferenciaStock">
      <h2>Nueva línea</h2>
      <quimera-formulario>
        <Articulo {...linea.uiProps("sku", "descripcion_producto")} />
        <QInput label="Cantidad" {...linea.uiProps("cantidad")} />
      </quimera-formulario>
      <div className="botones">
        <QBoton onClick={crear} deshabilitado={!linea.valido}>
          Guardar
        </QBoton>
        <QBoton onClick={cancelar} variante="texto">
          Cancelar
        </QBoton>
      </div>
    </div>
  );
};
