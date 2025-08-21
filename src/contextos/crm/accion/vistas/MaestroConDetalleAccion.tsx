import { useState } from "react";
import { QBoton } from "../../../../componentes/atomos/qboton.tsx";
import { MetaTabla } from "../../../../componentes/atomos/qtabla.tsx";
import { Listado } from "../../../../componentes/maestro/Listado.tsx";
import { MaestroDetalleResponsive } from "../../../../componentes/maestro/MaestroDetalleResponsive.tsx";
import { useLista } from "../../../comun/useLista.ts";
import { Maquina, useMaquina } from "../../../comun/useMaquina.ts";
import { Accion } from "../diseño.ts";
import { getAcciones } from "../infraestructura.ts";
import { AltaAccion } from "./AltaAccion.tsx";
import { DetalleAccion } from "./DetalleAccion/DetalleAccion.tsx";

const metaTablaAccion: MetaTabla<Accion> = [
  { id: "id", cabecera: "Código" },
  { id: "fecha", cabecera: "Fecha" },
  { id: "descripcion", cabecera: "Descripción" },
  { id: "tipo", cabecera: "Tipo" },
  { id: "estado", cabecera: "Estado" },
];

type Estado = "Inactivo" | "Creando";

export const MaestroConDetalleAccion = () => {
  const [estado, setEstado] = useState<Estado>("Inactivo");
  const acciones = useLista<Accion>([]);

  const maquina: Maquina<Estado> = {
    Creando: {
      accion_creada: (payload: unknown) => {
        acciones.añadir(payload as Accion);
        return "Inactivo";
      },
      creacion_cancelada: "Inactivo",
    },
    Inactivo: {
      crear: "Creando",
      accion_cambiada: (payload: unknown) => {
        acciones.modificar(payload as Accion);
      },
      accion_borrada: (payload: unknown) => {
        acciones.eliminar(payload as Accion);
      },
      seleccion_cancelada: () => {
        acciones.limpiarSeleccion();
      },
    },
  };

  const emitir = useMaquina(maquina, estado, setEstado);

  return (
    <div className="Accion">
      <MaestroDetalleResponsive
        seleccionada={acciones.seleccionada}
        Maestro={
          <>
            <h2>Acciones</h2>
            <div className="maestro-botones">
              <QBoton onClick={() => emitir("crear")}>Nueva</QBoton>
            </div>
            <Listado
              metaTabla={metaTablaAccion}
              entidades={acciones.lista}
              setEntidades={acciones.setLista}
              seleccionada={acciones.seleccionada}
              setSeleccionada={acciones.seleccionar}
              cargar={getAcciones}
            />
          </>
        }
        Detalle={
          <DetalleAccion
            key={acciones.seleccionada?.id}
            accionInicial={acciones.seleccionada}
            emitir={emitir}
          />
        }
      />
      <AltaAccion emitir={emitir} activo={estado === 'Creando'}/>
    </div>
  );
};
