import { useState } from "react";
import { Listado } from "../../../../componentes/maestro/Listado.tsx";
import { Presupuesto } from "../diseño.ts";
import { getPresupuestos } from "../infraestructura.ts";
import "./MaestroConDetallePresupuesto.css";

import { QBoton } from "../../../../componentes/atomos/qboton.tsx";
import { QModal } from "../../../../componentes/moleculas/qmodal.tsx";
import { useLista } from "../../../comun/useLista.ts";
import { Maquina, useMaquina } from "../../../comun/useMaquina.ts";
import { AltaPresupuesto } from "./AltaPresupuesto.tsx";
import { DetallePresupuesto } from "./DetallePresupuesto/DetallePresupuesto.tsx";

const metaTablaPresupuesto = [
  {
    id: "codigo",
    cabecera: "Código",
  },
  {
    id: "nombre_cliente",
    cabecera: "Cliente",
  },
  {
    id: "total",
    cabecera: "Total",
  },
];
type Estado = "lista" | "alta";
export const MaestroConDetallePresupuesto = () => {
  const [estado, setEstado] = useState<Estado>("lista");
  const presupuestos = useLista<Presupuesto>([]);

  const maquina: Maquina<Estado> = {
    alta: {
      PRESUPUESTO_CREADO: (payload: unknown) => {
        const presupuesto = payload as Presupuesto;
        presupuestos.añadir(presupuesto);
        return "lista";
      },
      ALTA_CANCELADA: "lista",
    },
    lista: {
      ALTA_INICIADA: "alta",
      PRESUPUESTO_CAMBIADO: (payload: unknown) => {
        const presupuesto = payload as Presupuesto;
        presupuestos.modificar(presupuesto);
      },
      PRESUPUESTO_BORRADO: (payload: unknown) => {
        const presupuesto = payload as Presupuesto;
        presupuestos.eliminar(presupuesto);
      },
    },
  };

  const emitir = useMaquina(maquina, estado, setEstado);
  const emision = (evento: string, payload?: unknown) => () =>
    emitir(evento, payload);

  return (
    <div className="MaestroConDetalle" style={{ display: "flex", gap: "2rem" }}>
      <div className="Maestro" style={{ flexBasis: "50%", overflow: "auto" }}>
        <h2>Presupuestos</h2>
        <Listado
          metaTabla={metaTablaPresupuesto}
          entidades={presupuestos.lista}
          setEntidades={presupuestos.setLista}
          seleccionada={presupuestos.seleccionada}
          setSeleccionada={presupuestos.seleccionar}
          cargar={getPresupuestos}
        />
        <QBoton onClick={emision("ALTA_INICIADA")}>Crear Presupuesto</QBoton>
      </div>
      <div className="Detalle" style={{ flexBasis: "50%", overflow: "auto" }}>
        <DetallePresupuesto
          presupuestoInicial={presupuestos.seleccionada}
          emitir={emitir}
        />
      </div>

      <QModal
        nombre="modal"
        abierto={estado === "alta"}
        onCerrar={emision("ALTA_CANCELADA")}
      >
        <AltaPresupuesto emitir={emitir} />
      </QModal>
    </div>
  );
};
