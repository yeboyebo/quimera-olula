import { useState } from "react";
import { QBoton } from "../../../../componentes/atomos/qboton.tsx";
import { MetaTabla } from "../../../../componentes/atomos/qtabla.tsx";
import { Listado } from "../../../../componentes/maestro/Listado.tsx";
import { MaestroDetalleResponsive } from "../../../../componentes/maestro/MaestroDetalleResponsive.tsx";
import { QModal } from "../../../../componentes/moleculas/qmodal.tsx";
import { useLista } from "../../../comun/useLista.ts";
import { Maquina, useMaquina } from "../../../comun/useMaquina.ts";
import { OportunidadVenta } from "../diseño.ts";
import {
  deleteOportunidadVenta,
  getOportunidadesVenta,
} from "../infraestructura.ts";
import { AltaOportunidadVenta } from "./AltaOportunidadVenta.tsx";
import { DetalleOportunidadVenta } from "./DetalleOportunidadVenta/DetalleOportunidadVenta.tsx";
// import "./MaestroConDetalleOportunidadVenta.css";

const metaTablaOportunidadVenta: MetaTabla<OportunidadVenta> = [
  { id: "id", cabecera: "Código" },
  { id: "descripcion", cabecera: "Descripción" },
  { id: "nombre_cliente", cabecera: "Cliente" },
  { id: "importe", cabecera: "Total Venta", tipo: "moneda" },
  { id: "fecha_cierre", cabecera: "Fecha Cierre" },
];

type Estado = "lista" | "alta";

export const MaestroConDetalleOportunidadVenta = () => {
  const [estado, setEstado] = useState<Estado>("lista");
  const oportunidades = useLista<OportunidadVenta>([]);

  const maquina: Maquina<Estado> = {
    alta: {
      OPORTUNIDAD_CREADA: (payload: unknown) => {
        const oportunidad = payload as OportunidadVenta;
        oportunidades.añadir(oportunidad);
        return "lista";
      },
      ALTA_CANCELADA: "lista",
    },
    lista: {
      ALTA_INICIADA: "alta",
      OPORTUNIDAD_CAMBIADA: (payload: unknown) => {
        const oportunidad = payload as OportunidadVenta;
        oportunidades.modificar(oportunidad);
      },
      OPORTUNIDAD_BORRADA: (payload: unknown) => {
        const oportunidad = payload as OportunidadVenta;
        oportunidades.eliminar(oportunidad);
      },
      CANCELAR_SELECCION: () => {
        oportunidades.limpiarSeleccion();
      },
    },
  };

  const emitir = useMaquina(maquina, estado, setEstado);

  const onBorrarOportunidad = async () => {
    if (!oportunidades.seleccionada) {
      return;
    }
    await deleteOportunidadVenta(oportunidades.seleccionada.id);
    oportunidades.eliminar(oportunidades.seleccionada);
  };

  return (
    <div className="OportunidadVenta">
      <MaestroDetalleResponsive<OportunidadVenta>
        seleccionada={oportunidades.seleccionada}
        Maestro={
          <>
            <h2>Oportunidades de Venta</h2>
            <div className="maestro-botones">
              <QBoton onClick={() => emitir("ALTA_INICIADA")}>Nueva</QBoton>
              <QBoton
                deshabilitado={!oportunidades.seleccionada}
                onClick={onBorrarOportunidad}
              >
                Borrar
              </QBoton>
            </div>
            <Listado
              metaTabla={metaTablaOportunidadVenta}
              entidades={oportunidades.lista}
              setEntidades={oportunidades.setLista}
              seleccionada={oportunidades.seleccionada}
              setSeleccionada={oportunidades.seleccionar}
              cargar={getOportunidadesVenta}
            />
          </>
        }
        Detalle={
          <DetalleOportunidadVenta
            oportunidadInicial={oportunidades.seleccionada}
            emitir={emitir}
          />
        }
      />
      <QModal
        nombre="modal"
        abierto={estado === "alta"}
        onCerrar={() => emitir("ALTA_CANCELADA")}
      >
        <AltaOportunidadVenta emitir={emitir} />
      </QModal>
    </div>
  );
};
