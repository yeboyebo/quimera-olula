import { useState } from "react";
import { QBoton } from "../../../../componentes/atomos/qboton.tsx";
import { MetaTabla } from "../../../../componentes/atomos/qtabla.tsx";
import { Listado } from "../../../../componentes/maestro/Listado.tsx";
import { MaestroDetalleResponsive } from "../../../../componentes/maestro/MaestroDetalleResponsive.tsx";
import { useLista } from "../../../comun/useLista.ts";
import { Maquina, useMaquina } from "../../../comun/useMaquina.ts";
import { Incidencia } from "../diseño.ts";
import { getIncidencias } from "../infraestructura.ts";
import { AltaIncidencia } from "./AltaIncidencia.tsx";
import { DetalleIncidencia } from "./DetalleIncidencia/DetalleIncidencia.tsx";
// import "./MaestroConDetalleIncidencia.css";

const metaTablaIncidencia: MetaTabla<Incidencia> = [
  { id: "id", cabecera: "Código" },
  { id: "descripcion", cabecera: "Descripcion" },
  { id: "nombre", cabecera: "Nombre" },
  { id: "estado", cabecera: "Estado" },
  { id: "prioridad", cabecera: "Prioridad" },
];

type Estado = "Inactivo" | "Creando";

export const MaestroConDetalleIncidencia = () => {
  const [estado, setEstado] = useState<Estado>("Inactivo");
  const incidencias = useLista<Incidencia>([]);

  const maquina: Maquina<Estado> = {
    Creando: {
      incidencia_creada: (payload: unknown) => {
        incidencias.añadir(payload as Incidencia);
        return "Inactivo";
      },
      creacion_cancelada: "Inactivo",
    },
    Inactivo: {
      crear: "Creando",
      incidencia_cambiada: (payload: unknown) => {
        incidencias.modificar(payload as Incidencia);
      },
      incidencia_borrada: (payload: unknown) => {
        incidencias.eliminar(payload as Incidencia);
      },
      cancelar_seleccion: () => {
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
              <QBoton onClick={() => emitir("crear")}>Nueva</QBoton>
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
      <AltaIncidencia publicar={emitir} activo={estado === 'Creando'}/>
    </div>
  );
};
