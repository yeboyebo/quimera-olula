import { QTabla } from "../../../../componentes/atomos/qtabla.tsx";
import { EmitirEvento } from "../../../comun/diseño.ts";
import { Grupo, Permiso, Regla } from "../../diseño.ts";
import { obtenerTextoYClaseAccion } from "../../dominio.ts";
import { AccionesRegla } from "./AccionesRegla.tsx";
import "./SubReglas.css";

export const SubReglas = ({
  reglas,
  permisos,
  grupoSeleccionado,
  emitir = () => {},
}: {
  permisos: Permiso[];
  reglas: Regla[];
  grupoSeleccionado: Grupo | null;
  emitir?: EmitirEvento;
}) => {
  return (
    <td colSpan={2} className="SubReglas" style={{ padding: 0 }}>
      <QTabla
        metaTabla={[
          {
            id: "id",
            cabecera: "Acción",
            render: (regla: Regla) => {
              const partes = regla.id.split("/");
              const accion = partes[1] || "";
              const { texto, clase } = obtenerTextoYClaseAccion(accion);
              return <span className={`accion-caja ${clase}`}>{texto}</span>;
            },
          },
          { id: "descripcion", cabecera: "Descripción" },
          {
            id: "acciones",
            cabecera: "Acciones",
            render: (regla: Regla) => (
              <AccionesRegla
                regla={regla}
                permisos={permisos}
                emitir={emitir}
                grupoId={grupoSeleccionado?.id || ""}
              />
            ),
          },
        ]}
        datos={reglas}
        cargando={false}
        orden={{ id: "ASC" }}
        mostrarCabecera={false}
      />
    </td>
  );
};
