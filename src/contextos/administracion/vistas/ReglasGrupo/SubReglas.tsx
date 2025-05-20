import { QTabla } from "../../../../componentes/atomos/qtabla.tsx";
import { EmitirEvento } from "../../../comun/diseño.ts";
import { Permiso, Regla } from "../../diseño.ts";
import { obtenerTextoYClaseAccion } from "../../dominio.ts";
import { AccionesRegla } from "./AccionesRegla.tsx";
import "./SubReglas.css";

export const SubReglas = ({
  reglas,
  permisos,
  grupoId,
  emitir = () => {},
}: {
  permisos: Permiso[];
  reglas: Regla[];
  grupoId: string;
  emitir?: EmitirEvento;
}) => {
  return (
    <td className="SubReglas">
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
                grupoId={grupoId}
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
