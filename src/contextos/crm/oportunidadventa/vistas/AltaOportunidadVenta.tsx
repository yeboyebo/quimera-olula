import { useContext } from "react";
import { QBoton } from "../../../../componentes/atomos/qboton.tsx";
import { QInput } from "../../../../componentes/atomos/qinput.tsx";
import { Mostrar } from "../../../../componentes/moleculas/Mostrar.tsx";
import { ContextoError } from "../../../comun/contexto.ts";
import { EmitirEvento } from "../../../comun/diseño.ts";
import { HookModelo, useModelo } from "../../../comun/useModelo.ts";
import { EstadoOportunidad } from "../../comun/componentes/estadoOportunidadVenta.tsx";
import { NuevaOportunidadVenta } from "../diseño.ts";
import {
  metaNuevaOportunidadVenta,
  nuevaOportunidadVentaVacia,
} from "../dominio.ts";
import {
  getOportunidadVenta,
  postOportunidadVenta,
} from "../infraestructura.ts";
import "./AltaOportunidadVenta.css";

export const AltaOportunidadVenta = ({
  emitir = () => {},
  idLead = "",
  idContacto = "",
  idCliente = "",
  activo = false,
}: {
  emitir?: EmitirEvento;
  idLead?: string;
  idContacto?: string;
  idCliente?: string;
  activo: boolean;
}) => {
  const oportunidadventa = useModelo(metaNuevaOportunidadVenta, {
    ...nuevaOportunidadVentaVacia,
    tarjeta_id: idLead,
    contacto_id: idContacto,
    cliente_id: idCliente,
  });

  const cancelar = () => {
    emitir("creacion_cancelada");
    oportunidadventa.init();
  };

  return (
    <Mostrar modo="modal" activo={activo} onCerrar={cancelar}>
      <FormAltaOportunidadVenta
        emitir={emitir}
        oportunidadventa={oportunidadventa}
      />
    </Mostrar>
  );
};

export const FormAltaOportunidadVenta = ({
  emitir = () => {},
  oportunidadventa,
}: {
  emitir?: EmitirEvento;
  oportunidadventa: HookModelo<NuevaOportunidadVenta>;
}) => {
  const { intentar } = useContext(ContextoError);

  const crear = async () => {
    const modelo = {
      ...oportunidadventa.modelo,
    };
    const id = await intentar(() => postOportunidadVenta(modelo));
    const oportunidadventaCreada = await getOportunidadVenta(id);
    emitir("oportunidad_creada", oportunidadventaCreada);
    oportunidadventa.init();
  };

  const cancelar = () => {
    emitir("ALTA_CANCELADA");
    oportunidadventa.init();
  };

  return (
    <div className="AltaOportunidadVenta">
      <h2>Nueva Oportunidad de Venta</h2>
      <quimera-formulario>
        <QInput
          label="Descripción"
          {...oportunidadventa.uiProps("descripcion")}
        />
        <EstadoOportunidad
          label="Estado"
          {...oportunidadventa.uiProps("estado_id")}
          nombre="alta_estado_id"
        />
        <QInput
          {...oportunidadventa.uiProps("fecha_cierre")}
          label="Fecha Cierre"
        />
        <QInput
          label="probailidad (%)"
          {...oportunidadventa.uiProps("probabilidad")}
        />
      </quimera-formulario>
      <div className="botones">
        <QBoton onClick={crear} deshabilitado={!oportunidadventa.valido}>
          Guardar
        </QBoton>
        <QBoton onClick={cancelar} variante="texto">
          Cancelar
        </QBoton>
      </div>
    </div>
  );
};
