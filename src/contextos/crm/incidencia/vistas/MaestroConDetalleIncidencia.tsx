import { useState } from "react";
import { QBoton } from "../../../../componentes/atomos/qboton.tsx";
import { MetaTabla } from "../../../../componentes/atomos/qtabla.tsx";
import { Listado } from "../../../../componentes/maestro/Listado.tsx";
import { MaestroDetalleResponsive } from "../../../../componentes/maestro/MaestroDetalleResponsive.tsx";
import { QModal } from "../../../../componentes/moleculas/qmodal.tsx";
import { useLista } from "../../../comun/useLista.ts";
import { Maquina, useMaquina } from "../../../comun/useMaquina.ts";
import { Incidencia } from "../diseño.ts";
import { getIncidencias } from "../infraestructura.ts";
import { AltaIncidencia } from "./AltaIncidencia.tsx";
import { DetalleIncidencia } from "./DetalleIncidencia/DetalleIncidencia.tsx";
// import "./MaestroConDetalleIncidencia.css";

const metaTablaIncidencia: MetaTabla<Incidencia> = [
  { id: "id", cabecera: "Código" },
  { id: "nombre", cabecera: "Nombre" },
  { id: "tipo", cabecera: "Tipo" },
  { id: "estado_id", cabecera: "Estado" },
  { id: "fuente_id", cabecera: "Fuente" },
];

type Estado = "lista" | "alta";

export const MaestroConDetalleIncidencia = () => {
  const [estado, setEstado] = useState<Estado>("lista");
  const incidencias = useLista<Incidencia>([]);

  const maquina: Maquina<Estado> = {
    alta: {
      INCIDENCIA_CREADA: (payload: unknown) => {
        const Incidencia = payload as Incidencia;
        incidencias.añadir(Incidencia);
        return "lista";
      },
      ALTA_CANCELADA: "lista",
    },
    lista: {
      ALTA_INICIADA: "alta",
      INCIDENCIA_CAMBIADA: (payload: unknown) => {
        const Incidencia = payload as Incidencia;
        incidencias.modificar(Incidencia);
      },
      INCIDENCIA_BORRADA: (payload: unknown) => {
        const Incidencia = payload as Incidencia;
        incidencias.eliminar(Incidencia);
      },
      CANCELAR_SELECCION: () => {
        incidencias.limpiarSeleccion();
      },
    },
  };

  const emitir = useMaquina(maquina, estado, setEstado);

  return (
    <div className="Incidencia">
      <MaestroDetalleResponsive<Incidencia>
        seleccionada={incidencias.seleccionada}
        Maestro={
          <>
            <h2>Incidencias</h2>
            <div className="maestro-botones">
              <QBoton onClick={() => emitir("ALTA_INICIADA")}>Nueva</QBoton>
            </div>
            <Listado
              metaTabla={metaTablaIncidencia}
              entidades={incidencias.lista}
              setEntidades={incidencias.setLista}
              seleccionada={incidencias.seleccionada}
              setSeleccionada={incidencias.seleccionar}
              cargar={getIncidencias}
            />
          </>
        }
        Detalle={
          <DetalleIncidencia incidenciaInicial={incidencias.seleccionada} emitir={emitir} />
        }
      />
      <QModal
        nombre="modal"
        abierto={estado === "alta"}
        onCerrar={() => emitir("ALTA_CANCELADA")}
      >
        <AltaIncidencia emitir={emitir} />
      </QModal>
    </div>
  );
};
