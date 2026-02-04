import { Presupuesto } from "#/ventas/presupuesto/diseño.ts";
import { MetaTabla, QTabla } from "@olula/componentes/atomos/qtabla.tsx";
import { useLista } from "@olula/lib/useLista.ts";
import { Maquina, useMaquina } from "@olula/lib/useMaquina.ts";
import { HookModelo } from "@olula/lib/useModelo.ts";
import { useCallback, useEffect, useState } from "react";
import { getPresupuesto } from "../../../../../ventas/presupuesto/infraestructura.ts";
import { OportunidadVenta } from "../../../diseño.ts";
import {
  crearPresupuestoOportunidad,
  getPresupuestosOportunidad,
} from "../../../infraestructura.ts";
import { TabPresupuestosAcciones } from "./TabPresupuestosAcciones.tsx";
// import { TabPresupuestosAcciones } from "./TabPresupuestosAcciones.tsx";

type Estado = "lista" | "alta" | "borrar";

export const TabPresupuestos = ({
  oportunidad,
}: {
  oportunidad: HookModelo<OportunidadVenta>;
}) => {
  const presupuestos = useLista<Presupuesto>([]);
  const [cargando, setCargando] = useState(true);
  const [estado, setEstado] = useState<Estado>("lista");
  const oportunidadId = oportunidad.modelo.id;

  const setListaPresupuestos = presupuestos.setLista;

  const cargarPresupuestos = useCallback(async () => {
    setCargando(true);
    const nuevosPresupuestos = await getPresupuestosOportunidad(oportunidadId);
    setListaPresupuestos(nuevosPresupuestos.datos);
    setCargando(false);
  }, [oportunidadId, setListaPresupuestos]);

  useEffect(() => {
    if (oportunidadId) cargarPresupuestos();
  }, [oportunidadId, cargarPresupuestos]);

  const maquina: Maquina<Estado> = {
    lista: {
      ALTA_SOLICITADA: "alta",
      BORRADO_SOLICITADO: "borrar",
      PRESUPUESTO_SELECCIONADO: (payload: unknown) => {
        const presupuesto = payload as Presupuesto;
        presupuestos.seleccionar(presupuesto);
      },
    },
    alta: {
      CREAR_PRESUPUESTO: async () => {
        const nuevoPresupuestoId = await crearPresupuestoOportunidad(
          oportunidad.modelo.id,
          oportunidad.modelo.cliente_id || ""
        );
        const nuevoPresupuesto = await getPresupuesto(nuevoPresupuestoId);
        presupuestos.añadir(nuevoPresupuesto);
        return "lista" as Estado;
      },
      ALTA_CANCELADA: "lista",
    },
    borrar: {
      PRESUPUESTO_BORRADO: async () => {
        if (presupuestos.seleccionada) {
          presupuestos.eliminar(presupuestos.seleccionada);
        }
        return "lista" as Estado;
      },
      BORRADO_CANCELADO: "lista",
    },
  };

  const emitir = useMaquina(maquina, estado, setEstado);

  const metaTablaPresupuesto: MetaTabla<Presupuesto> = [
    { id: "codigo", cabecera: "Código" },
    { id: "nombre_cliente", cabecera: "Cliente" },
    { id: "total", cabecera: "Total", tipo: "moneda" },
  ];

  return (
    <div className="TabPresupuestos">
      <TabPresupuestosAcciones
        seleccionada={presupuestos.seleccionada || null}
        emitir={emitir}
        estado={estado}
        oportunidad={oportunidad}
      />
      <QTabla
        metaTabla={metaTablaPresupuesto}
        datos={presupuestos.lista}
        cargando={cargando}
        seleccionadaId={presupuestos.seleccionada?.id}
        onSeleccion={(presupuesto) =>
          emitir("PRESUPUESTO_SELECCIONADO", presupuesto)
        }
        orden={["id", "ASC"]}
        onOrdenar={() => null}
      />
    </div>
  );
};
