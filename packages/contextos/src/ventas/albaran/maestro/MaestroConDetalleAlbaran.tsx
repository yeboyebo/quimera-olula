import { ColumnaEstadoTabla } from "#/comun/componentes/ColumnaEstadoTabla.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { MetaTabla, QIcono } from "@olula/componentes/index.js";
import { ListadoControlado } from "@olula/componentes/maestro/ListadoControlado.js";
import { MaestroDetalleControlado } from "@olula/componentes/maestro/MaestroDetalleControlado.js";
import { QModal } from "@olula/componentes/moleculas/qmodal.tsx";
import { Criteria } from "@olula/lib/diseño.js";
import { criteriaDefecto } from "@olula/lib/dominio.js";
import { useCallback, useEffect } from "react";
import { useMaestroVenta } from "../../venta/hooks/useMaestroVenta.ts";
import { CrearAlbaran } from "../crear/CrearAlbaran.tsx";
import { DetalleAlbaran } from "../detalle/DetalleAlbaran.tsx";
import { Albaran } from "../diseño.ts";
import { metaTablaAlbaran as metaTablaBase } from "../dominio.ts";
import "./MaestroConDetalleAlbaran.css";
import { getMaquina } from "./maquina.ts";

export const MaestroConDetalleAlbaran = () => {
  const { ctx, emitir } = useMaestroVenta(getMaquina, {
    estado: "INICIAL",
    albaranes: [],
    totalAlbaranes: 0,
    albaranActivo: null,
  });

  const setSeleccionada = useCallback(
    (payload: Albaran) => void emitir("albaran_seleccionado", payload),
    [emitir]
  );

  const recargar = useCallback(
    (criteria: Criteria) => {
      void emitir("recarga_de_albaranes_solicitada", criteria);
    },
    [emitir]
  );

  useEffect(() => {
    emitir("recarga_de_albaranes_solicitada", criteriaDefecto);
  }, []);

  const metaTablaAlbaran = [
    {
      id: "estado",
      cabecera: "",
      render: (albaran: Albaran) => (
        <ColumnaEstadoTabla
          estados={{
            facturado: (
              <QIcono
                nombre={"circulo_relleno"}
                tamaño="sm"
                color="var(--color-deshabilitado-oscuro)"
              />
            ),
            pendiente: (
              <QIcono
                nombre={"circulo_relleno"}
                tamaño="sm"
                color="var(--color-exito-oscuro)"
              />
            ),
          }}
          estadoActual={albaran.idfactura ? "facturado" : "pendiente"}
        />
      ),
    },
    ...metaTablaBase,
  ] as MetaTabla<Albaran>;

  return (
    <div className="Albaran">
      <MaestroDetalleControlado<Albaran>
        Maestro={
          <>
            <h2>Albaranes</h2>
            <div className="maestro-botones">
              <QBoton onClick={() => emitir("crear_albaran_solicitado")}>
                Nuevo Albarán
              </QBoton>
            </div>
            <ListadoControlado<Albaran>
              metaTabla={metaTablaAlbaran}
              criteriaInicial={criteriaDefecto}
              modo={"tabla"}
              entidades={ctx.albaranes}
              totalEntidades={ctx.totalAlbaranes}
              seleccionada={ctx.albaranActivo}
              onSeleccion={setSeleccionada}
              onCriteriaChanged={recargar}
            />
          </>
        }
        Detalle={
          <DetalleAlbaran
            albaranInicial={ctx.albaranActivo}
            publicar={emitir}
          />
        }
        seleccionada={ctx.albaranActivo}
        modoDisposicion="maestro-50"
      />

      <QModal
        nombre="modal"
        abierto={ctx.estado === "CREANDO_ALBARAN"}
        onCerrar={() => emitir("creacion_cancelada")}
      >
        <CrearAlbaran publicar={emitir} />
      </QModal>
    </div>
  );
};
