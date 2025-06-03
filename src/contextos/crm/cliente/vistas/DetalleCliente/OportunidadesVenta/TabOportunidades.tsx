import { useCallback, useEffect, useState } from "react";
import {
  MetaTabla,
  QTabla,
} from "../../../../../../componentes/atomos/qtabla.tsx";
import { useLista } from "../../../../../comun/useLista.ts";
import { Maquina, useMaquina } from "../../../../../comun/useMaquina.ts";
import { OportunidadVenta } from "../../../../oportunidadventa/diseño.ts";
import { getOportunidadesVentaCliente } from "../../../infraestructura.ts";
import { TabOportunidadesAcciones } from "./TabOportunidadesAcciones.tsx";

type Estado = "lista" | "alta" | "borrar";

export const TabOportunidades = ({ clienteId }: { clienteId: string }) => {
  const oportunidades = useLista<OportunidadVenta>([]);
  const [cargando, setCargando] = useState(true);
  const [estado, setEstado] = useState<Estado>("lista");

  const setListaOportunidades = oportunidades.setLista;

  const cargarOportunidades = useCallback(async () => {
    setCargando(true);
    const nuevasOportunidades = await getOportunidadesVentaCliente({}, {});
    setListaOportunidades(nuevasOportunidades);
    setCargando(false);
  }, [clienteId, setListaOportunidades]);

  useEffect(() => {
    if (clienteId) cargarOportunidades();
  }, [clienteId, cargarOportunidades]);

  const maquina: Maquina<Estado> = {
    lista: {
      ALTA_SOLICITADA: "alta",
      BORRADO_SOLICITADO: "borrar",
      EDICION_SOLICITADA: () => {
        if (oportunidades.seleccionada) {
          // Solo loguea el id de la oportunidad
          console.log("Editar oportunidad:", oportunidades.seleccionada.id);
        }
      },
      OPORTUNIDAD_SELECCIONADA: (payload: unknown) => {
        const oportunidad = payload as OportunidadVenta;
        oportunidades.seleccionar(oportunidad);
      },
    },
    alta: {
      OPORTUNIDAD_CREADA: async (payload: unknown) => {
        const nuevaOportunidad = payload as OportunidadVenta;
        oportunidades.añadir(nuevaOportunidad);
        return "lista" as Estado;
      },
      ALTA_CANCELADA: "lista",
    },
    borrar: {
      OPORTUNIDAD_BORRADA: async () => {
        if (oportunidades.seleccionada) {
          oportunidades.eliminar(oportunidades.seleccionada);
        }
        return "lista" as Estado;
      },
      BORRADO_CANCELADO: "lista",
    },
  };

  const emitir = useMaquina(maquina, estado, setEstado);

  const metaTablaOportunidadVenta: MetaTabla<OportunidadVenta> = [
    { id: "id", cabecera: "Código" },
    { id: "descripcion", cabecera: "Descripción" },
    { id: "nombre_cliente", cabecera: "Cliente" },
    { id: "total_venta", cabecera: "Total Venta", tipo: "moneda" },
    { id: "fecha_cierre", cabecera: "Fecha Cierre" },
  ];

  return (
    <div className="TabOportunidades">
      <TabOportunidadesAcciones
        seleccionada={oportunidades.seleccionada}
        emitir={emitir}
        estado={estado}
        clienteId={clienteId}
      />
      <QTabla
        metaTabla={metaTablaOportunidadVenta}
        datos={oportunidades.lista}
        cargando={cargando}
        seleccionadaId={oportunidades.seleccionada?.id}
        onSeleccion={(oportunidad) =>
          emitir("OPORTUNIDAD_SELECCIONADA", oportunidad)
        }
        orden={{ id: "ASC" }}
        onOrdenar={() => null}
      />
    </div>
  );
};
