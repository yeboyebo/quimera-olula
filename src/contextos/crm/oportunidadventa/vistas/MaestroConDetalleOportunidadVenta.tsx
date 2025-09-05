import { useState } from "react";
import { QBoton } from "../../../../componentes/atomos/qboton.tsx";
import { Listado } from "../../../../componentes/maestro/Listado.tsx";
import { MaestroDetalleResponsive } from "../../../../componentes/maestro/MaestroDetalleResponsive.tsx";
import { useLista } from "../../../comun/useLista.ts";
import { Maquina, useMaquina } from "../../../comun/useMaquina.ts";
import { OportunidadVenta } from "../diseño.ts";
import { metaTablaOportunidadVenta } from "../dominio.ts";
import { getOportunidadesVenta } from "../infraestructura.ts";
import { AltaOportunidadVenta } from "./AltaOportunidadVenta.tsx";
import { DetalleOportunidadVenta } from "./DetalleOportunidadVenta/DetalleOportunidadVenta.tsx";
// import "./MaestroConDetalleOportunidadVenta.css";

type Estado = "lista" | "alta";

export const MaestroConDetalleOportunidadVenta = () => {
  const [estado, setEstado] = useState<Estado>("lista");
  const oportunidades = useLista<OportunidadVenta>([]);

  const maquina: Maquina<Estado> = {
    alta: {
      oportunidad_creada: (payload: unknown) => {
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
      oportunidad_borrada: (payload: unknown) => {
        const oportunidad = payload as OportunidadVenta;
        oportunidades.eliminar(oportunidad);
      },
      CANCELAR_SELECCION: () => {
        oportunidades.limpiarSeleccion();
      },
    },
  };

  const emitir = useMaquina(maquina, estado, setEstado);

  return (
    <div className="OportunidadVenta">
      <MaestroDetalleResponsive<OportunidadVenta>
        seleccionada={oportunidades.seleccionada}
        Maestro={
          <>
            <h2>Oportunidades de Venta</h2>
            <div className="maestro-botones">
              <QBoton onClick={() => emitir("ALTA_INICIADA")}>Nueva</QBoton>
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
      <AltaOportunidadVenta emitir={emitir} activo={estado === "alta"} />
    </div>
  );
};
