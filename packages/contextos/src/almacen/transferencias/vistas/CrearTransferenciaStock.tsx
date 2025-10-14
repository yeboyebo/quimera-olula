import { Almacen } from "#/almacen/comun/componentes/Almacen.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QDate } from "@olula/componentes/atomos/qdate.tsx";
import { Mostrar } from "@olula/componentes/moleculas/Mostrar.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { HookModelo, useModelo } from "@olula/lib/useModelo.ts";
import { useContext } from "react";
import { NuevaTransferenciaStock } from "../diseño.ts";
import {
  metaNuevaTransferenciaStock,
  nuevaTransferenciaStockVacia,
} from "../dominio.ts";
import {
  crearTransferenciaStock,
  obtenerTransferenciaStock,
} from "../infraestructura.ts";

export const CrearTransferenciaStock = ({
  publicar = () => {},
  activo = false,
}: {
  publicar?: EmitirEvento;
  activo: boolean;
}) => {
  const transferencia = useModelo(metaNuevaTransferenciaStock, {
    ...nuevaTransferenciaStockVacia,
  });

  const cancelar = () => {
    transferencia.init();
    publicar("creacion_cancelada");
  };

  return (
    <Mostrar modo="modal" activo={activo} onCerrar={cancelar}>
      <FormAltaTransferenciaStock
        publicar={publicar}
        transferencia={transferencia}
      />
    </Mostrar>
  );
};

const FormAltaTransferenciaStock = ({
  publicar = () => {},
  transferencia,
}: {
  publicar?: EmitirEvento;
  transferencia: HookModelo<NuevaTransferenciaStock>;
}) => {
  const { intentar } = useContext(ContextoError);

  const crear = async () => {
    const modelo = {
      ...transferencia.modelo,
    };
    const id = await intentar(() => crearTransferenciaStock(modelo));
    const transferenciaCreada = await obtenerTransferenciaStock(id);
    publicar("transferencia_creada", transferenciaCreada);
    transferencia.init();
  };

  const cancelar = () => {
    publicar("creacion_cancelada");
    transferencia.init();
  };

  return (
    <div className="CrearTransferenciaStock">
      <h2>Nueva Transferencia</h2>
      <quimera-formulario>
        <Almacen
          label="Origen"
          {...transferencia.uiProps("origen", "nombre_origen")}
        />
        <Almacen
          label="Destino"
          {...transferencia.uiProps("destino", "nombre_destino")}
        />
        <QDate label="Fecha" {...transferencia.uiProps("fecha")} />
      </quimera-formulario>
      <div className="botones">
        <QBoton onClick={crear} deshabilitado={!transferencia.valido}>
          Guardar
        </QBoton>
        <QBoton onClick={cancelar} variante="texto">
          Cancelar
        </QBoton>
      </div>
    </div>
  );
};
